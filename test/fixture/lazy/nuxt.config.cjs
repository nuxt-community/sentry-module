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
    lazy: true,
    // dsn: 'https://fe8b7df6ea7042f69d7a97c66c2934f7@sentry.io.nuxt/1429779',
    config: {},
    clientIntegrations: {
      // Integration from @Sentry/browser package.
      TryCatch: { eventTarget: false },
    },
    customClientIntegrations: '~/config/custom-client-integrations.js',
    tracing: true,
  },
  publicRuntimeConfig: {
    sentry: {
      config: {
        environment: 'production',
      },
    },
  },
}

module.exports = config
