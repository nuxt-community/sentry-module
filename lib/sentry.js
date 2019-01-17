const path = require('path')

const logger = require('consola').withScope('nuxt:sentry')
const Sentry = require('@sentry/node')
const WebpackPlugin = require('@sentry/webpack-plugin')

module.exports = function sentry (moduleOptions) {
  const defaults = {
    dsn: process.env.SENTRY_DSN || false,
    disabled: process.env.SENTRY_DISABLED || false,
    disableClientSide: process.env.SENTRY_DISABLE_CLIENT_SIDE || false,
    publishRelease: process.env.SENTRY_PUBLISH_RELEASE || false,
    config: {
      environment: this.options.dev ? 'development' : 'production'
    },
    webpackConfig: {
      include: ['.nuxt/dist/client'],
      ignore: [
        'node_modules',
        '.nuxt/dist/client/img'
      ],
      urlPrefix: '~/_nuxt/',
      configFile: '.sentryclirc'
    }
  }

  const options = Object.assign({}, defaults, this.options.sentry, moduleOptions)
  options.config = Object.assign({}, defaults.config, this.options.sentry.config, moduleOptions.config)
  options.webpackConfig = Object.assign({}, defaults.webpackConfig, this.options.sentry.webpackConfig, moduleOptions.webpackConfig)

  if (options.disabled) {
    logger.info('Errors will not be logged because the disable option has been set')
  }

  if (!options.dsn) {
    logger.info('Errors will not be logged because no DSN has been provided')
  }

  // Initialize Sentry
  if (!options.disabled && options.config.dsn) {
    Sentry.init({
      ...options.dsn,
      ...options.config
    })
    logger.success('Started logging errors to Sentry')
  }

  // Enable publishing of sourcemaps
  this.extendBuild((config, { isClient, isDev }) => {
    if (!options.publishRelease || isDev) return
    if (isClient) config.devtool = '#sourcemap'

    config.plugins.push(new WebpackPlugin(options.webpackConfig))
    logger.info('Enabling uploading of release sourcemaps to Sentry')
  })

  // Register the client plugin
  if (!options.disableClientSide) {
    this.addPlugin({
      src: path.resolve(__dirname, 'templates/sentry-client.js'),
      fileName: 'sentry-client.js',
      ssr: false,
      options: {
        dsn: options.dsn,
        ...options.config
      }
    })
  }

  // Initialize the hooks
  if (this.nuxt.hook) {
    this.nuxt.hook('render:setupMiddleware', app => app.use(Sentry.Handlers.requestHandler()))
    this.nuxt.hook('render:errorMiddleware', app => app.use(Sentry.Handlers.errorHandler()))
    this.nuxt.hook('generate:routeFailed', ({ route, errors }) => {
      errors.forEach(({ error }) => Sentry.withScope(scope => {
        scope.setExtra('route', route)
        Sentry.captureException(error)
      }))
    })
  } else {
    // This is for backwards compatibility (NuxtJS pre-hooks)
    this.nuxt.plugin('renderer', renderer => {
      renderer.app.use(Sentry.Handlers.requestHandler())

      // Grab Nuxt's original error middleware and overwrite it with our own
      const nuxtErrorMiddleware = renderer.errorMiddleware
      renderer.errorMiddleware = (err, req, res, next) => {
        // Log the error
        Sentry.withScope(scope => {
          scope.setExtra('req', req)
          Sentry.captureException(err)
        })

        // Call Nuxt's original error middleware
        nuxtErrorMiddleware.call(renderer, err, req, res, next)
      }
    })
  }
}
