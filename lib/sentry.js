const Raven = require('raven')
const path = require('path')

module.exports = function sentry (moduleOptions) {
  // Merge options
  const options = Object.assign({
    disableClientSide: process.env.SENTRY_DISABLE_CLIENT_SIDE === 'true' || false,
    dsn: process.env.SENTRY_DSN || null,
    public_dsn: process.env.SENTRY_PUBLIC_DSN || null,
    public_key: process.env.SENTRY_PUBLIC_KEY || null,
    private_key: process.env.SENTRY_PRIVATE_KEY || null,
    host: process.env.SENTRY_HOST || 'sentry.io',
    protocol: process.env.SENTRY_PROTOCOL || 'https',
    project_id: process.env.SENTRY_PROJECT_ID || '',
    path: process.env.SENTRY_PATH || '/',
    config: {
      environment: this.options.dev ? 'development' : 'production'
    }
  }, this.options.sentry, moduleOptions)

  // Don't proceed if no keys are provided
  if (!options.dsn && !options.public_key && !options.private_key) {
    /* eslint-disable no-console */
    console.info('nuxt:sentry disabled because no (private) key was found')
    /* eslint-enable no-console */
    return
  }

  // Generate DSN
  // https://docs.sentry.io/quickstart/#about-the-dsn
  if (!options.dsn || !options.dsn.length) {
    options.dsn = `${options.protocol}://${options.public_key}:${options.private_key}@${options.host}${options.path}${options.project_id}`
  }

  // Public DSN (without private key)
  if (!options.public_dsn || !options.public_dsn.length) {
    options.public_dsn = options.dsn.replace(/:\w+@/, '@')
  }

  // Setup raven
  Raven.config(options.dsn, options.config).install()

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
    this.nuxt.hook('render:setupMiddleware', app => app.use(Raven.requestHandler()))
    this.nuxt.hook('render:errorMiddleware', app => app.use(Raven.errorHandler()))
  } else {
    this.nuxt.plugin('renderer', renderer => {
      renderer.app.use(Raven.requestHandler())

      // Grab Nuxt's original error middleware and overwrite it with our own
      const nuxtErrorMiddleware = renderer.errorMiddleware
      renderer.errorMiddleware = (err, req, res, next) => {
        // Log the error
        res.sentry = Raven.captureException(err, { req })

        // Call Nuxt's original error middleware
        nuxtErrorMiddleware.call(renderer, err, req, res, next)
      }
    })
  }
}
