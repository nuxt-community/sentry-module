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
