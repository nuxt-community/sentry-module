import { setup, loadConfig, url } from '@nuxtjs/module-test-utils'
import { $$, createBrowser } from './utils'

describe('Smoke test (default)', () => {
  /** @type {any} */
  let nuxt
  /** @type {import('playwright-chromium').Browser} */
  let browser

  beforeAll(async () => {
    ({ nuxt } = await setup(loadConfig(__dirname, 'default')))
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
    await page.goto(url('/'))
    expect(await $$('#server-side', page)).toBe('Works!')
    expect(await $$('#client-side', page)).toBe('Works!')
  })
})
