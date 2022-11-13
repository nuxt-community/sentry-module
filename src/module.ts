import { defineNuxtModule, useLogger, isNuxt2 } from '@nuxt/kit'
import { defu } from 'defu'
import type { SentryCliPluginOptions } from '@sentry/webpack-plugin'
import { Handlers as SentryHandlers, captureException, withScope } from '@sentry/node'
import type { ModuleConfiguration } from '../types'
import type { DeepPartialModuleConfiguration } from '../types/sentry'
import { envToBool, boolToText, canInitialize, clientSentryEnabled, serverSentryEnabled } from './core/utils'
import { buildHook, initializeServerSentry, shutdownServerSentry, webpackConfigHook } from './core/hooks'

export interface ModuleOptions extends DeepPartialModuleConfiguration {}

export interface ModulePublicRuntimeConfig extends DeepPartialModuleConfiguration {}

export interface ModulePrivateRuntimeConfig extends DeepPartialModuleConfiguration {}

const logger = useLogger('nuxt:sentry')

export default defineNuxtModule<ModuleConfiguration>({
  meta: {
    name: '@nuxtjs/sentry',
    configKey: 'sentry',
    compatibility: {
      nuxt: '^2.15.8',
    },
  },
  defaults: nuxt => ({
    lazy: false,
    dsn: process.env.SENTRY_DSN || '',
    disabled: envToBool(process.env.SENTRY_DISABLED) || false,
    initialize: envToBool(process.env.SENTRY_INITIALIZE) || true,
    runtimeConfigKey: 'sentry',
    disableClientSide: envToBool(process.env.SENTRY_DISABLE_CLIENT_SIDE) || false,
    disableServerSide: envToBool(process.env.SENTRY_DISABLE_SERVER_SIDE) || false,
    publishRelease: envToBool(process.env.SENTRY_PUBLISH_RELEASE) || false,
    disableServerRelease: envToBool(process.env.SENTRY_DISABLE_SERVER_RELEASE) || false,
    disableClientRelease: envToBool(process.env.SENTRY_DISABLE_CLIENT_RELEASE) || false,
    logMockCalls: true,
    sourceMapStyle: 'source-map',
    tracing: false,
    clientIntegrations: {
      Dedupe: {},
      ExtraErrorData: {},
      ReportingObserver: {},
      RewriteFrames: {},
      Vue: { attachProps: true, logErrors: nuxt.options.dev },
    },
    serverIntegrations: {
      Dedupe: {},
      ExtraErrorData: {},
      RewriteFrames: {},
      Transaction: {},
    },
    customClientIntegrations: '',
    customServerIntegrations: '',
    config: {
      environment: nuxt.options.dev ? 'development' : 'production',
    },
    serverConfig: {},
    clientConfig: {},
    requestHandlerConfig: {},
  }),
  setup (options, nuxt) {
    const defaultsPublishRelease: SentryCliPluginOptions = {
      include: [],
      ignore: [
        'node_modules',
        '.nuxt/dist/client/img',
      ],
      configFile: '.sentryclirc',
    }

    if (options.publishRelease) {
      options.publishRelease = defu(options.publishRelease, defaultsPublishRelease)
    }

    if (serverSentryEnabled(options)) {
      // @ts-ignore
      nuxt.hook('render:setupMiddleware', app => app.use(SentryHandlers.requestHandler(options.requestHandlerConfig)))
      // @ts-ignore
      nuxt.hook('render:errorMiddleware', app => app.use(SentryHandlers.errorHandler()))
      // @ts-ignore
      nuxt.hook('generate:routeFailed', ({ route, errors }) => {
      // @ts-ignore
        errors.forEach(({ error }) => withScope((scope) => {
          scope.setExtra('route', route)
          captureException(error)
        }))
      })
    }

    if (canInitialize(options) && (clientSentryEnabled(options) || serverSentryEnabled(options))) {
      const status = `(client side: ${boolToText(clientSentryEnabled(options))}, server side: ${boolToText(serverSentryEnabled(options))})`
      logger.success(`Sentry reporting is enabled ${status}`)
    } else {
      let why: string
      if (options.disabled) {
        why = '"disabled" option has been set'
      } else if (!options.dsn) {
        why = 'no DSN has been provided'
      } else if (!options.initialize) {
        why = '"initialize" option has been set to false'
      } else {
        why = 'both client and server side clients are disabled'
      }
      logger.info(`Sentry reporting is disabled (${why})`)
    }

    nuxt.hook('build:before', () => buildHook(nuxt, options, logger))

    // This is messy but Nuxt provides many modes that it can be started with like:
    // - nuxt dev
    // - nuxt build
    // - nuxt start
    // - nuxt generate
    // but it doesn't really provide great way to differentiate those or enough hooks to
    // pick from. This should ensure that server Sentry will only be initialized **after**
    // the release version has been determined and the options template created but before
    // the build is started (if building).
    if (isNuxt2()) {
      const initHook = nuxt.options._build ? 'build:compile' : 'ready'
      if (serverSentryEnabled(options)) {
        // @ts-ignore
        nuxt.hook(initHook, () => initializeServerSentry(nuxt, options, logger))
        // @ts-ignore
        nuxt.hook('generate:done', () => shutdownServerSentry())
      }
    }

    // Enable publishing of sourcemaps
    if (options.publishRelease && !options.disabled) {
      if (isNuxt2()) {
        nuxt.hook('webpack:config', webpackConfigs => webpackConfigHook(nuxt, webpackConfigs, options as ModuleConfiguration & { publishRelease: SentryCliPluginOptions }, logger))
      }
    }
  },
})
