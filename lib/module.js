const path = require('path')
const Sentry = require('@sentry/node')
const WebpackPlugin = require('@sentry/webpack-plugin')
const deepMerge = require('deepmerge')
const { Dedupe, ExtraErrorData, RewriteFrames, Transaction } = require('@sentry/integrations')

const logger = require('consola').withScope('nuxt:sentry')

module.exports = function sentry(moduleOptions) {
  const publicPath = this.options.build.publicPath
  const defaults = {
    dsn: process.env.SENTRY_DSN || false,
    disabled: process.env.SENTRY_DISABLED || false,
    disableClientSide: process.env.SENTRY_DISABLE_CLIENT_SIDE || false,
    disableServerSide: process.env.SENTRY_DISABLE_SERVER_SIDE || false,
    publishRelease: process.env.SENTRY_PUBLISH_RELEASE || false,
    config: {
      environment: this.options.dev ? 'development' : 'production'
    },
    webpackConfig: {
      include: ['.nuxt/dist/client', '.nuxt/dist/server'],
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

  if (options.disabled) {
    logger.info('Errors will not be logged because the disable option has been set')
    return
  }

  if (!options.dsn) {
    logger.info('Errors will not be logged because no DSN has been provided')
    return
  }

  // Register the client plugin
  if (!options.disableClientSide) {
    this.addPlugin({
      src: path.resolve(__dirname, 'sentry.client.js'),
      fileName: 'sentry.client.js',
      mode: 'client',
      options: {
        dsn: options.dsn,
        ...options.config
      }
    })
  }

  // Register the server plugin
  if (!options.disableServerSide) {
    // Initialize Sentry
    Sentry.init({
      dsn: options.dsn,
      ...options.config,
      integrations: [
        new Dedupe(),
        new ExtraErrorData(),
        new RewriteFrames(),
        new Transaction()
      ]
    })
    logger.success('Started logging errors to Sentry')

    this.addPlugin({
      src: path.resolve(__dirname, 'sentry.server.js'),
      fileName: 'sentry.server.js',
      mode: 'server',
      options: {
        dsn: options.dsn,
        ...options.config
      }
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
  this.extendBuild((config, { isClient, isDev }) => {
    if (!options.publishRelease || isDev) return
    if (isClient) config.devtool = '#sourcemap'

    config.plugins.push(new WebpackPlugin(options.webpackConfig))
    logger.info('Enabling uploading of release sourcemaps to Sentry')
  })
}
