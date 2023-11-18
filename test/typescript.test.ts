/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { describe, afterAll, beforeAll, beforeEach, test, expect } from 'vitest'
import type { Browser } from 'playwright-chromium'
import sentryTestkit from 'sentry-testkit'
// TODO: Until sentry-kit types are fixed
import type { Stacktrace } from '@sentry/node'
import type { NuxtConfig } from '@nuxt/types'
import { generatePort, setup, url } from '@nuxtjs/module-test-utils'
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
    const dsn = localServer.getDsn()!
    const port = await generatePort()
    const overrides: NuxtConfig = {
      sentry: { dsn },
      server: { port },
      publicRuntimeConfig: { baseURL: url('') },
    }
    const config = loadConfig(__dirname, 'typescript', overrides, { merge: true })
    nuxt = (await setup(config)).nuxt
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

  test('catches a server crash in server middleware', async () => {
    const page = await browser.newPage()
    const response = await page.goto(url('/?crashOnLoadInApi=1'))
    expect(response!.status()).toBe(200)

    const reports = testkit.reports()
    expect(reports).toHaveLength(1)
    expect(reports[0].error?.message).toContain('apiCrash is not defined')
    expect(reports[0].error?.stacktrace as Stacktrace).toMatchObject({
      frames: expect.arrayContaining([
        expect.objectContaining({
          filename: 'app:///api/index.ts',
        }),
      ]),
    })
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
