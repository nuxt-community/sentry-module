const SentryModule = require('../../..')

/** @type {import('@nuxt/types').NuxtConfig} */
const config = {
  rootDir: __dirname,
  telemetry: false,
  dev: false,
  render: {
    resourceHints: false,
  },
  modules: [
    SentryModule,
  ],
  sentry: {
    dsn: 'https://fe8b7df6ea7042f69d7a97c66c2934f7@sentry.io.nuxt/1429779',
    config: {},
    lazy: {
      mockApiMethods: [
        'captureMessage',
      ],
      injectLoadHook: true,
      chunkName: 'my-chunk',
      webpackPreload: true,
      webpackPrefetch: true,
    },
  },
}

module.exports = config
