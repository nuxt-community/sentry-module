import { setup, loadConfig, url } from '@nuxtjs/module-test-utils'
import { $$, createBrowser } from './utils'

describe('Smoke test (lazy)', () => {
  /** @type {any} */
  let nuxt
  /** @type {import('playwright-chromium').Browser} */
  let browser

  beforeAll(async () => {
    ({ nuxt } = await setup(loadConfig(__dirname, 'lazy')))
    browser = await createBrowser()
  })

  afterAll(async () => {
    if (browser) {
      await browser.close()
    }
    await nuxt.close()
  })

  test('builds, runs and there are no errors', async () => {
    const page = await browser.newPage()

    /** @type {string[]} */
    const errors = []
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })
    await page.goto(url('/'))

    expect(await $$('#server-side', page)).toBe('Works!')
    expect(await $$('#client-side', page)).toBe('Works and is ready!')
    expect(errors).toEqual([])
  })
})
