import { setup, loadConfig, url } from '@nuxtjs/module-test-utils'
import { $$, createBrowser } from './utils'

describe('Smoke test (lazy config)', () => {
  /** @type {any} */
  let nuxt
  /** @type {import('playwright-chromium').Browser} */
  let browser

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
    /** @type {string[]} */
    const messages = []
    page.on('console', (msg) => {
      messages.push(msg.text())
    })
    await page.goto(url('/'))

    expect(messages).toEqual(expect.arrayContaining(['Caught expected error on $sentry.captureEvent']))
    expect(messages).toEqual(expect.arrayContaining(['Loading Sentry in 1 second']))
    expect(await $$('#server-side', page)).toBe('Works!')
    expect(await $$('#client-side', page)).toBe('Works but is not ready!')
    await page.waitForTimeout(1100)
    expect(await $$('#client-side', page)).toBe('Works and is ready!')
    expect(messages).toEqual(expect.arrayContaining(['Sentry is ready']))
  })
})
