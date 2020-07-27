import consola from 'consola'
import deepMerge from 'deepmerge'
import { Handlers as SentryHandlers, captureException, withScope } from '@sentry/node'
import { buildHook, listenHook, webpackConfigHook } from './core/hooks'
import { boolToText, canInitialize, clientSentryEnabled, serverSentryEnabled } from './core/utils'

const logger = consola.withScope('nuxt:sentry')

/** @type {import('@nuxt/types').Module} */
export default function SentryModule (moduleOptions) {
  const defaults = {
    lazy: false,
    dsn: process.env.SENTRY_DSN || false,
    disabled: process.env.SENTRY_DISABLED || false,
    initialize: process.env.SENTRY_INITIALIZE || true,
    disableClientSide: process.env.SENTRY_DISABLE_CLIENT_SIDE || false,
    disableServerSide: process.env.SENTRY_DISABLE_SERVER_SIDE || false,
    publishRelease: process.env.SENTRY_PUBLISH_RELEASE || false,
    disableServerRelease: process.env.SENTRY_DISABLE_SERVER_RELEASE || false,
    disableClientRelease: process.env.SENTRY_DISABLE_CLIENT_RELEASE || false,
    logMockCalls: true,
    attachCommits: process.env.SENTRY_AUTO_ATTACH_COMMITS || false,
    sourceMapStyle: 'source-map',
    repo: process.env.SENTRY_RELEASE_REPO || false,
    clientIntegrations: {
      Dedupe: {},
      ExtraErrorData: {},
      ReportingObserver: {},
      RewriteFrames: {},
      Vue: { attachProps: true }
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
    }
  }

  const topLevelOptions = this.options.sentry || {}
  const options = deepMerge.all([defaults, topLevelOptions, moduleOptions])

  if (serverSentryEnabled(options)) {
    this.nuxt.hook('render:setupMiddleware', app => app.use(SentryHandlers.requestHandler()))
    this.nuxt.hook('render:errorMiddleware', app => app.use(SentryHandlers.errorHandler()))
    this.nuxt.hook('generate:routeFailed', ({ route, errors }) => {
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
    this.nuxt.hook('listen', () => listenHook(this, options))
  }

  // Enable publishing of sourcemaps
  if (options.publishRelease && !options.disabled && !this.options.dev) {
    this.nuxt.hook('webpack:config', webpackConfigs => webpackConfigHook(this, webpackConfigs, options, logger))
  }
}
