const Sentry = require('@sentry/node')
const path = require('path')

const logger = require('consola').withScope('nuxt:sentry')

module.exports = function sentry (moduleOptions) {
  // Merge options
  const options = Object.assign({
    disabled: process.env.SENTRY_DISABLED || false,
    disableClientSide: process.env.SENTRY_DISABLE_CLIENT_SIDE === 'true' || false,
    dsn: process.env.SENTRY_DSN || null,
    public_key: process.env.SENTRY_PUBLIC_KEY || null,
    host: process.env.SENTRY_HOST || 'sentry.io',
    protocol: process.env.SENTRY_PROTOCOL || 'https',
    project_id: process.env.SENTRY_PROJECT_ID || '',
    path: process.env.SENTRY_PATH || '/',
    config: {
      environment: this.options.dev ? 'development' : 'production'
    }
  }, this.options.sentry, moduleOptions)

  // Don't proceed if it's disabled
  if (options.disabled) {
    logger.info('Disabled because the disabled option is set')
    return
  }

  // Don't proceed if no keys are provided
  if (!options.dsn && !options.public_key) {
    logger.info('Disabled because no key was found')
    return
  }

  // Generate DSN
  // https://docs.sentry.io/quickstart/#about-the-dsn
  if (!options.dsn || !options.dsn.length) {
    options.dsn = `${options.protocol}://${options.public_key}@${options.host}${options.path}${options.project_id}`
  }

  options.config.dsn = options.dsn
  // Setup sentry
  Sentry.init(options.config)

  // Register the client plugin
  if (!options.disableClientSide) {
    this.addPlugin({
      src: path.resolve(__dirname, 'templates/sentry-client.js'),
      fileName: 'sentry-client.js',
      ssr: false,
      options
    })
  }

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
