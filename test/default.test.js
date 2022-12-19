import sentryTestkit from 'sentry-testkit'
import { setup, loadConfig, url } from '@nuxtjs/module-test-utils'
import { $$, createBrowser } from './utils'

const { testkit, localServer } = sentryTestkit()
const TEST_DSN = 'http://acacaeaccacacacabcaacdacdacadaca@sentry.io/000001'

describe('Smoke test (default)', () => {
  /** @type {any} */
  let nuxt
  /** @type {import('playwright-chromium').Browser} */
  let browser

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
    /** @type {string[]} */
    const errors = []
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })
    await page.goto(url('/'))

    expect(await $$('#server-side', page)).toBe('Works!')
    expect(await $$('#client-side', page)).toBe('Works!')
    expect(errors).toEqual([])
  })

  test('reports error on crash', async () => {
    const page = await browser.newPage()
    await page.goto(url('/'))
    expect(await $$('#server-side', page)).toBe('Works!')
    expect(await $$('#client-side', page)).toBe('Works!')
    const crashButton = await page.$('#crash-button')
    expect(crashButton).not.toBeNull()
    await crashButton?.click()
    const reports = testkit.reports()
    expect(reports).toHaveLength(1)
  })

  // TODO: Add tests for custom integration. Blocked by various sentry-kit bugs reported in its repo.
})
