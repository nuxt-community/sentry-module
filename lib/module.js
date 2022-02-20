import consola from 'consola'
import merge from 'lodash.mergewith'
import { Handlers as SentryHandlers, captureException, withScope } from '@sentry/node'
import { buildHook, initializeServerSentry, shutdownServerSentry, webpackConfigHook } from './core/hooks'
import { boolToText, canInitialize, clientSentryEnabled, envToBool, serverSentryEnabled } from './core/utils'

const logger = consola.withScope('nuxt:sentry')

/** @type {import('lodash').MergeWithCustomizer} */
function mergeWithCustomizer (objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}

/** @type {import('@nuxt/types').Module<import('../types').ModuleConfiguration>} */
export default function SentryModule (moduleOptions) {
  /** @type {Required<import('../types/sentry').ModuleConfiguration>} */
  const defaults = {
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
      Vue: { attachProps: true, logErrors: this.options.dev }
    },
    serverIntegrations: {
      Dedupe: {},
      ExtraErrorData: {},
      RewriteFrames: {},
      Transaction: {}
    },
    config: {
      environment: this.options.dev ? 'development' : 'production'
    },
    serverConfig: {},
    clientConfig: {},
    webpackConfig: {
      include: [],
      ignore: [
        'node_modules',
        '.nuxt/dist/client/img'
      ],
      configFile: '.sentryclirc'
    },
    requestHandlerConfig: {}
  }

  const topLevelOptions = this.options.sentry || {}
  const options = /** @type {import('../types/sentry').ResolvedModuleConfiguration} */(
    merge({}, defaults, topLevelOptions, moduleOptions, mergeWithCustomizer)
  )

  if (options.publishRelease) {
    const merged = merge(options.webpackConfig, options.publishRelease, mergeWithCustomizer)
    options.publishRelease = merged
  }

  options.webpackConfig = {}

  if (serverSentryEnabled(options)) {
    // @ts-ignore
    this.nuxt.hook('render:setupMiddleware', app => app.use(SentryHandlers.requestHandler(options.requestHandlerConfig)))
    // @ts-ignore
    this.nuxt.hook('render:errorMiddleware', app => app.use(SentryHandlers.errorHandler()))
    // @ts-ignore
    this.nuxt.hook('generate:routeFailed', ({ route, errors }) => {
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
    let why
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

  this.nuxt.hook('build:before', () => buildHook(this, options, logger))

  if (serverSentryEnabled(options)) {
    this.nuxt.hook('ready', () => initializeServerSentry(this, options))
    this.nuxt.hook('generate:done', () => shutdownServerSentry())
  }

  // Enable publishing of sourcemaps
  if (options.publishRelease && !options.disabled && !this.options.dev) {
    // @ts-ignore
    this.nuxt.hook('webpack:config', webpackConfigs => webpackConfigHook(this, webpackConfigs, options, logger))
  }
}
