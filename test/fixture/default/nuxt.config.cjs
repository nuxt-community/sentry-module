const SentryModule = require('../../..')

/** @type {import('@nuxt/types').NuxtConfig} */
const config = {
  rootDir: __dirname,
  telemetry: false,
  build: {
    terser: false,
  },
  render: {
    resourceHints: false,
  },
  modules: [
    /** @type {import('@nuxt/types').Module} */(/** @type {unknown} */(SentryModule)),
  ],
  sentry: {
    dsn: 'https://fe8b7df6ea7042f69d7a97c66c2934f7@sentry.io.nuxt/1429779',
    clientIntegrations: {
      // Integration from @Sentry/browser package.
      TryCatch: { eventTarget: false },
      ReportingObserver: false,
    },
    customClientIntegrations: '~/config/custom-client-integrations.js',
    tracing: true,
    publishRelease: {
      authToken: 'fakeToken',
      org: 'MyCompany',
      project: 'TestProject',
      dryRun: true,
    },
  },
}

module.exports = config
