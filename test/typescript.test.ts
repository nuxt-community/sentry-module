/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { describe, afterAll, beforeAll, beforeEach, test, expect } from 'vitest'
import type { Browser } from 'playwright-chromium'
import sentryTestkit from 'sentry-testkit'
import { setup, url } from '@nuxtjs/module-test-utils'
import type { Nuxt } from '../src/kit-shim'
import { $$, createBrowser, loadConfig } from './utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { testkit, localServer } = sentryTestkit.default()
const TEST_DSN = 'http://acacaeaccacacacabcaacdacdacadaca@sentry.io/000001'

describe('Smoke test (typescript)', () => {
  let nuxt: Nuxt
  let browser: Browser

  beforeAll(async () => {
    await localServer.start(TEST_DSN)
    const dsn = localServer.getDsn()
    nuxt = (await setup(loadConfig(__dirname, 'typescript', { sentry: { dsn } }, { merge: true }))).nuxt
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

  test('reads serverConfig from external file', async () => {
    const page = await browser.newPage()
    const response = await page.goto(url('/?crashOnLoad=1'))
    expect(response!.status()).toBe(500)

    const reports = testkit.reports()
    expect(reports).toHaveLength(1)
    expect(reports[0].error?.message).toContain('crashOnLoad is not defined')
    // Coming from `serverConfig` file-based configuration
    expect(reports[0].extra).toBeDefined()
    expect(reports[0].extra!.foo).toBe('1')
  })

  test('catches a client crash', async () => {
    const page = await browser.newPage()
    await page.goto(url('/'))

    expect(await $$('#client-side', page)).toBe('Works!')
    await page.click('#crash-button')
    const reports = testkit.reports()
    expect(reports).toHaveLength(1)
    expect(reports[0].error?.message).toContain('crash_me is not a function')
  })

  // TODO: Add tests for custom integration. Blocked by various sentry-kit bugs reported in its repo.
})
