import { fileURLToPath } from 'url'
import { dirname } from 'path'
import type { Nuxt } from '@nuxt/schema'
import type { Browser } from 'playwright-chromium'
import { setup, loadConfig, url } from '@nuxtjs/module-test-utils'
import { $$, createBrowser } from './utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('Smoke test (lazy config)', () => {
  let nuxt: Nuxt
  let browser: Browser

  beforeAll(async () => {
    ({ nuxt } = await setup(loadConfig(__dirname, 'with-lazy-config')))
    browser = await createBrowser()
  })

  afterAll(async () => {
    if (browser) {
      await browser.close()
    }
    await nuxt.close()
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
    expect(await $$('#server-side', page)).toBe('Works!')
    expect(await $$('#client-side', page)).toBe('Works but is not ready!')
    await page.waitForTimeout(1100)
    expect(await $$('#client-side', page)).toBe('Works and is ready!')
    expect(messages).toEqual(expect.arrayContaining(['Sentry is ready']))
    expect(errors).toEqual([])
  })
})
