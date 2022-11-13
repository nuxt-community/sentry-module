import { fileURLToPath } from 'url'
import { dirname } from 'path'
import type { Nuxt } from '@nuxt/schema'
import type { Browser } from 'playwright-chromium'
import { setup, loadConfig, url } from '@nuxtjs/module-test-utils'
import { $$, createBrowser } from './utils'

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

describe('Smoke test (lazy)', () => {
  let nuxt: Nuxt
  let browser: Browser

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

    const errors: string[] = []
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })
    await page.goto(url('/'))

    expect(await $$('#server-side', page)).toBe('Works!')
    expect(await $$('#client-side', page)).toBe('Works and is ready!')
    expect(errors).toEqual([])
  })
})
