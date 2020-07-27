import SentryModule from '../../..'

/** @type {import('@nuxt/types').NuxtOptions} */
const config = {
  rootDir: __dirname,
  dev: false,
  render: {
    resourceHints: false
  },
  modules: [
    // @ts-ignore
    SentryModule
  ],
  sentry: {
    dsn: 'https://fe8b7df6ea7042f69d7a97c66c2934f7@sentry.io.nuxt/1429779',
    config: {}
  }
}

module.exports = config
