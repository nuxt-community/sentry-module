const path = require('path')
const Sentry = require('@sentry/node')
const WebpackPlugin = require('@sentry/webpack-plugin')
const deepMerge = require('deepmerge')
const Integrations = require('@sentry/integrations')

const logger = require('consola').withScope('nuxt:sentry')

const filterDisabledIntegration = integrations => Object.keys(integrations)
  .filter(key => integrations[key])

module.exports = function sentry (moduleOptions) {
  const publicPath = this.options.build.publicPath
  const buildDirRelative = path.relative(this.options.rootDir, this.options.buildDir)
  const defaults = {
    dsn: process.env.SENTRY_DSN || false,
    disabled: process.env.SENTRY_DISABLED || false,
    initialize: process.env.SENTRY_INITIALIZE || true,
    disableClientSide: process.env.SENTRY_DISABLE_CLIENT_SIDE || false,
    disableServerSide: process.env.SENTRY_DISABLE_SERVER_SIDE || false,
    publishRelease: process.env.SENTRY_PUBLISH_RELEASE || false,
    disableServerRelease: process.env.SENTRY_DISABLE_SERVER_RELEASE || false,
    disableClientRelease: process.env.SENTRY_DISABLE_CLIENT_RELEASE || false,
    attachCommits: process.env.SENTRY_AUTO_ATTACH_COMMITS || true,
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
      urlPrefix: publicPath.startsWith('/') ? `~${publicPath}` : publicPath,
      configFile: '.sentryclirc'
    }
  }

  const topLevelOptions = this.options.sentry || {}
  const options = deepMerge.all([defaults, topLevelOptions, moduleOptions])

  options.serverConfig = deepMerge.all([options.config, options.serverConfig])
  options.clientConfig = deepMerge.all([options.config, options.clientConfig])

  if (!options.disableServerRelease) {
    options.webpackConfig.include.push(`${buildDirRelative}/dist/server`)
  }
  if (!options.disableClientRelease) {
    options.webpackConfig.include.push(`${buildDirRelative}/dist/client`)
  }

  if (options.config.release && !options.webpackConfig.release) {
    options.webpackConfig.release = options.config.release
  }

  if (options.attachCommits) {
    options.webpackConfig.setCommits = {
      auto: true
    }

    if (options.repo) {
      options.webpackConfig.setCommits.repo = options.repo
    }
  }

  const initializationRequired = options.initialize && options.dsn

  if (options.disabled) {
    logger.info('Errors will not be logged because the disable option has been set')
    return
  }

  if (!options.dsn) {
    logger.info('Errors will not be logged because no DSN has been provided')
  }

  // Register the client plugin
  if (!options.disableClientSide) {
    this.addPlugin({
      src: path.resolve(__dirname, 'sentry.client.js'),
      fileName: 'sentry.client.js',
      mode: 'client',
      options: {
        config: {
          dsn: options.dsn,
          ...options.clientConfig
        },
        initialize: initializationRequired,
        integrations: filterDisabledIntegration(options.clientIntegrations)
          .reduce((res, key) => {
            res[key] = options.clientIntegrations[key]
            return res
          }, {})
      }
    })
  }

  // Register the server plugin
  if (!options.disableServerSide) {
    // Initialize Sentry
    if (initializationRequired) {
      Sentry.init({
        dsn: options.dsn,
        ...options.serverConfig,
        integrations: filterDisabledIntegration(options.serverIntegrations)
          .map(name => new Integrations[name](options.serverIntegrations[name]))
      })
    }

    process.sentry = Sentry
    logger.success('Started logging errors to Sentry')

    this.addPlugin({
      src: path.resolve(__dirname, 'sentry.server.js'),
      fileName: 'sentry.server.js',
      mode: 'server'
    })
    this.nuxt.hook('render:setupMiddleware', app => app.use(Sentry.Handlers.requestHandler()))
    this.nuxt.hook('render:errorMiddleware', app => app.use(Sentry.Handlers.errorHandler()))
    this.nuxt.hook('generate:routeFailed', ({ route, errors }) => {
      errors.forEach(({ error }) => Sentry.withScope((scope) => {
        scope.setExtra('route', route)
        Sentry.captureException(error)
      }))
    })
  }

  // Enable publishing of sourcemaps
  this.extendBuild((config, { isClient, isModern, isDev }) => {
    if (!options.publishRelease || isDev) {
      return
    }
    if (isClient) {
      config.devtool = 'source-map'
    }
    // when not in spa mode upload only at server build
    if (isClient && this.options.mode !== 'spa') {
      return
    }
    // when in spa mode upload only at modern build if enabled
    if (isClient && !isModern && this.options.modern) {
      return
    }

    config.plugins.push(new WebpackPlugin(options.webpackConfig))
    logger.info('Enabling uploading of release sourcemaps to Sentry')
  })
}
