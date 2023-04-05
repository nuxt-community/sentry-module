const SentryModule = require('../..')

/** @type {import('@nuxt/types').NuxtConfig} */
const config = {
  rootDir: __dirname,
  telemetry: false,
  modules: [
    /** @type {import('@nuxt/types').Module} */(/** @type {unknown} */(SentryModule)),
  ],
  sentry: {
    dsn: 'https://fe8b7df6ea7042f69d7a97c66c2934f7@sentry.io.nuxt/1429779',
    lazy: true,
    tracing: true,
  },
}

module.exports = config
