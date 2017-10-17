const Raven = require('raven')
const path = require('path')

module.exports = async function sentry (options) {
  // Setup raven
  Raven.config(`https://${options.public_key}:${options.private_key}@sentry.io/${options.project_id}`, options.config).install()

  // Register the client plugin
  this.addPlugin({ src: path.resolve(__dirname, 'templates/sentry-client.js'), options })

  // Hook in to Nuxt renderer
  this.nuxt.plugin('renderer', (renderer) => {
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
