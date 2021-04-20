import SentryModule from '../../..'

/** @type {import('@nuxt/types').NuxtConfig} */
const config = {
  rootDir: __dirname,
  telemetry: false,
  dev: true,
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
    }
  }
}

module.exports = config
