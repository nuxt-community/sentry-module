import { fileURLToPath } from 'node:url'
import initJiti from 'jiti'
import type { NuxtConfig } from '@nuxt/types'

const jiti = initJiti(fileURLToPath(import.meta.url))

const config: NuxtConfig = {
  rootDir: __dirname,
  telemetry: false,
  build: {
    terser: false,
  },
  render: {
    resourceHints: false,
  },
  buildModules: [
    '@nuxt/typescript-build',
  ],
  modules: [
    jiti.resolve('../../..'),
  ],
  publicRuntimeConfig: {
    baseURL: 'http://localhost:3000',
  },
  sentry: {
    dsn: 'https://fe8b7df6ea7042f69d7a97c66c2934f7@sentry.io.nuxt/1429779',
    clientIntegrations: {
      // Integration from @Sentry/browser package.
      TryCatch: { eventTarget: false },
      Replay: {},
      Dedupe: false,
    },
    serverIntegrations: {
      Modules: false,
    },
    clientConfig: {
      // This sets the sample rate to be 10%. You may want this to be 100% while
      // in development and sample at a lower rate in production
      replaysSessionSampleRate: 0.1,
      // If the entire session is not sampled, use the below sample rate to sample
      // sessions when an error occurs.
      replaysOnErrorSampleRate: 1.0,
    },
    customClientIntegrations: '~/config/custom-client-integrations.ts',
    serverConfig: '~/config/server.config',
    tracing: true,
  },
  serverMiddleware: [
    { path: '/api', handler: '~/api/index' },
  ],
  typescript: {
    typeCheck: false,
  },
}

export default config
