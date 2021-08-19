import SentryModule from '../../..'

/** @type {import('@nuxt/types').NuxtConfig} */
const config = {
  rootDir: __dirname,
  telemetry: false,
  build: {
    terser: false
  },
  render: {
    resourceHints: false
  },
  modules: [
    // @ts-ignore
    SentryModule
  ],
  sentry: {
    dsn: 'https://fe8b7df6ea7042f69d7a97c66c2934f7@sentry.io.nuxt/1429779',
    clientIntegrations: {
      // Integration from @Sentry/browser package.
      TryCatch: { eventTarget: false }
    },
    publishRelease: {
      authToken: 'fakeToken',
      org: 'MyCompany',
      project: 'TestProject',
      dryRun: true
    }
  }
}

module.exports = config
