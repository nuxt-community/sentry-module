import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    hookTimeout: 30000,
    onConsoleLog (log, type) {
      return false
    },
  },
})
