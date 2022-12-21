import consola from 'consola'
import merge from 'lodash.mergewith'
import { captureException, withScope } from '@sentry/node'
import { buildHook, initializeServerSentry, shutdownServerSentry, webpackConfigHook } from './core/hooks'
import { boolToText, callOnce, canInitialize, clientSentryEnabled, envToBool, serverSentryEnabled } from './core/utils'

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
      environment: this.options.dev ? 'development' : 'production',
    },
    serverConfig: {},
    clientConfig: {},
    requestHandlerConfig: {},
  }

  /** @type {import('@sentry/webpack-plugin').SentryCliPluginOptions} */
  const defaultsPublishRelease = {
    include: [],
    ignore: [
      'node_modules',
      '.nuxt/dist/client/img',
    ],
    configFile: '.sentryclirc',
  }

  const topLevelOptions = this.options.sentry || {}
  const options = /** @type {import('../types/sentry').ResolvedModuleConfiguration} */(
    merge({}, defaults, topLevelOptions, moduleOptions, mergeWithCustomizer)
  )

  if (options.publishRelease) {
    const merged = merge(defaultsPublishRelease, options.publishRelease, mergeWithCustomizer)
    options.publishRelease = merged
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

  this.nuxt.hook('build:before', callOnce(() => buildHook(this, options, logger)))

  if (serverSentryEnabled(options)) {
    /**
     * Proxy that provides a dummy request handler before Sentry is initialized and gets replaced with Sentry's own
     * handler after initialization. Otherwise server-side request tracing would not work as it depends on Sentry being
     * initialized already during handler creation.
     * @type {import('../types/sentry').SentryHandlerProxy}
     */
    const sentryHandlerProxy = {
      errorHandler: (error, req, res, next) => { next(error) },
      requestHandler: (req, res, next) => { next() },
    }
    // @ts-ignore
    this.nuxt.hook('render:setupMiddleware', app => app.use((req, res, next) => { sentryHandlerProxy.requestHandler(req, res, next) }))
    // @ts-ignore
    this.nuxt.hook('render:errorMiddleware', app => app.use((error, req, res, next) => { sentryHandlerProxy.errorHandler(error, req, res, next) }))
    // @ts-ignore
    this.nuxt.hook('generate:routeFailed', ({ route, errors }) => {
      // @ts-ignore
      errors.forEach(({ error }) => withScope((scope) => {
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
    const initHook = this.options._build ? 'build:compile' : 'ready'
    this.nuxt.hook(initHook, callOnce(() => initializeServerSentry(this, options, sentryHandlerProxy, logger)))
    const shutdownServerSentryOnce = callOnce(() => shutdownServerSentry())
    this.nuxt.hook('generate:done', shutdownServerSentryOnce)
    this.nuxt.hook('close', shutdownServerSentryOnce)
  }

  // Enable publishing of sourcemaps
  if (options.publishRelease && !options.disabled && !this.options.dev) {
    // @ts-ignore
    this.nuxt.hook('webpack:config', webpackConfigs => webpackConfigHook(this, webpackConfigs, options, logger))
  }
}
