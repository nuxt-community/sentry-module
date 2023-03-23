import { fileURLToPath } from 'url'
import { dirname } from 'path'
import type { Browser } from 'playwright-chromium'
import sentryTestkit from 'sentry-testkit'
import { setup, loadConfig, url } from '@nuxtjs/module-test-utils'
import type { Nuxt } from '../src/kit-shim'
import { $$, createBrowser } from './utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { testkit, localServer } = sentryTestkit.default()
const TEST_DSN = 'http://acacaeaccacacacabcaacdacdacadaca@sentry.io/000001'

describe('Smoke test (default)', () => {
  let nuxt: Nuxt
  let browser: Browser

  beforeAll(async () => {
    await localServer.start(TEST_DSN)
    const dsn = localServer.getDsn()
    nuxt = (await setup(loadConfig(__dirname, 'default', { sentry: { dsn } }, { merge: true }))).nuxt
    browser = await createBrowser()
  })

  afterAll(async () => {
    if (browser) {
      await browser.close()
    }
    await nuxt.close()
    await localServer.stop()
  })

  beforeEach(() => {
    testkit.reset()
  })

  test('builds and runs', async () => {
    const page = await browser.newPage()
    const errors: string[] = []
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })
    await page.goto(url('/'))

    // process.sentry is not initialized in webpack context in tests.
    // expect(await $$('#server-side', page)).toBe('Works!')
    expect(await $$('#client-side', page)).toBe('Works!')
    expect(errors).toEqual([])
  })

  // TODO: Add tests for custom integration. Blocked by various sentry-kit bugs reported in its repo.
})
