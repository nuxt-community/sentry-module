import { fileURLToPath } from 'node:url'
import initJiti from 'jiti'
import type { NuxtConfig } from '@nuxt/types'

const jiti = initJiti(fileURLToPath(import.meta.url))

const config: NuxtConfig = {
  rootDir: __dirname,
  telemetry: false,
  buildModules: [
    '@nuxt/typescript-build',
  ],
  modules: [
    jiti.resolve('../..'),
  ],
  sentry: {
    dsn: 'https://fe8b7df6ea7042f69d7a97c66c2934f7@sentry.io.nuxt/1429779',
  },
  typescript: {
    typeCheck: false,
  },
}

export default config
