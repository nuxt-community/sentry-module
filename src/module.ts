import { defu } from 'defu'
import { resolvePath } from 'mlly'
import type { SentryCliPluginOptions } from '@sentry/webpack-plugin'
import { captureException, withScope } from '@sentry/node'
import type { Configuration as WebpackConfig } from 'webpack'
import { defineNuxtModule, isNuxt2, useLogger } from './kit-shim'
import { envToBool, boolToText, callOnce, canInitialize, clientSentryEnabled, serverSentryEnabled } from './utils'
import { buildHook, initializeServerSentry, shutdownServerSentry, webpackConfigHook } from './hooks'
import type { SentryHandlerProxy } from './options'
import type { ModuleConfiguration, ModuleOptions, ModulePublicRuntimeConfig } from './types'

export type { ModuleOptions, ModulePublicRuntimeConfig }

const logger = useLogger('nuxt:sentry')

export default defineNuxtModule<ModuleConfiguration>({
  meta: {
    name: '@nuxtjs/sentry',
    configKey: 'sentry',
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
      ExtraErrorData: {},
      ReportingObserver: {},
      RewriteFrames: {},
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
  async setup (options, nuxt) {
    const defaultsPublishRelease: SentryCliPluginOptions = {
      include: [],
      ignore: [
        'node_modules',
        '.nuxt/dist/client/img',
      ],
      configFile: '.sentryclirc',
    }

    if (options.publishRelease) {
      // @ts-expect-error Defu introduces "null" value in its merged types which cause error.
      options.publishRelease = defu(options.publishRelease, defaultsPublishRelease)
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

    // Work-around issues with Nuxt not being able to resolve unhoisted dependencies that are imported in webpack context.
    const aliasedDependencies = ['lodash.mergewith', '@sentry/integrations', '@sentry/utils', '@sentry/vue', ...(options.tracing ? ['@sentry/tracing'] : [])]
    for (const dep of aliasedDependencies) {
      nuxt.options.alias[`~${dep}`] = (await resolvePath(dep)).replace(/\/cjs\//, '/esm/')
    }

    if (serverSentryEnabled(options)) {
      /**
       * Proxy that provides a dummy request handler before Sentry is initialized and gets replaced with Sentry's own
       * handler after initialization. Otherwise server-side request tracing would not work as it depends on Sentry being
       * initialized already during handler creation.
       */
      const sentryHandlerProxy: SentryHandlerProxy = {
        errorHandler: (error, _, __, next) => { next(error) },
        requestHandler: (_, __, next) => { next() },
        tracingHandler: (_, __, next) => { next() },
      }
      // @ts-expect-error Nuxt 2 only hook
      nuxt.hook('render:setupMiddleware', app => app.use((req, res, next) => { sentryHandlerProxy.requestHandler(req, res, next) }))
      if (options.tracing) {
        // @ts-expect-error Nuxt 2 only hook
        nuxt.hook('render:setupMiddleware', app => app.use((req, res, next) => { sentryHandlerProxy.tracingHandler(req, res, next) }))
      }
      // @ts-expect-error Nuxt 2 only hook
      nuxt.hook('render:errorMiddleware', app => app.use((error, req, res, next) => { sentryHandlerProxy.errorHandler(error, req, res, next) }))
      // @ts-expect-error Nuxt 2 only hook
      nuxt.hook('generate:routeFailed', ({ route, errors }) => {
        type routeGeneretorError = {
          type: 'handled' | 'unhandled'
          route: unknown
          error: Error
        }
        (errors as routeGeneretorError[]).forEach(({ error }) => withScope((scope) => {
          scope.setExtra('route', route)
          captureException(error)
        }))
      })
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
        nuxt.hook(initHook, () => initializeServerSentry(nuxt, options, sentryHandlerProxy, logger))
        const shutdownServerSentryOnce = callOnce(() => shutdownServerSentry())
        nuxt.hook('generate:done', shutdownServerSentryOnce)
        nuxt.hook('close', shutdownServerSentryOnce)
      }
    }

    nuxt.hook('build:before', () => buildHook(nuxt, options, logger))

    // Enable publishing of sourcemaps
    if (options.publishRelease && !options.disabled && !nuxt.options.dev) {
      if (isNuxt2()) {
        nuxt.hook('webpack:config', (webpackConfigs: WebpackConfig[]) => webpackConfigHook(nuxt, webpackConfigs, options as ModuleConfiguration & { publishRelease: SentryCliPluginOptions }, logger))
      }
    }
  },
}) as unknown /* casting to "unknown" prevents unnecessary types being exposed in the generated type definitions */
