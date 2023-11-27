import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { describe, afterAll, beforeAll, test, expect } from 'vitest'
import type { Browser } from 'playwright-chromium'
import sentryTestkit from 'sentry-testkit'
import { setup, url } from '@nuxtjs/module-test-utils'
import type { Nuxt } from '../src/kit-shim'
import { $$, createBrowser, loadConfig } from './utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { localServer } = sentryTestkit.default()
const TEST_DSN = 'http://acacaeaccacacacabcaacdacdacadaca@sentry.io/000001'

describe('Smoke test (lazy config)', () => {
  let nuxt: Nuxt
  let browser: Browser

  beforeAll(async () => {
    await localServer.start(TEST_DSN)
    const dsn = localServer.getDsn() ?? undefined
    nuxt = (await setup(loadConfig(__dirname, 'with-lazy-config', { sentry: { dsn } }, { merge: true }))).nuxt
    browser = await createBrowser()
  })

  afterAll(async () => {
    if (browser) {
      await browser.close()
    }
    await nuxt.close()
    await localServer.stop()
  })

  test('builds and runs', async () => {
    const page = await browser.newPage()
    const messages: string[] = []
    page.on('console', (msg) => {
      messages.push(msg.text())
    })
    const errors: string[] = []
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })
    await page.goto(url('/'))

    expect(messages).toEqual(expect.arrayContaining(['Caught expected error on $sentry.captureEvent']))
    expect(messages).toEqual(expect.arrayContaining(['Loading Sentry in 1 second']))
    // process.sentry is not initialized in webpack context in tests.
    // expect(await $$('#server-side', page)).toBe('Works!')
    expect(await $$('#client-side', page)).toBe('Works but is not ready!')
    await page.waitForTimeout(1100)
    expect(await $$('#client-side', page)).toBe('Works and is ready!')
    expect(messages).toEqual(expect.arrayContaining(['Sentry is ready']))
    expect(errors).toEqual([])
  })
})
