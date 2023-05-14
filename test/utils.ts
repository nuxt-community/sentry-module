import { defu } from 'defu'
import { chromium, Browser, Page } from 'playwright-chromium'

export async function createBrowser (): Promise<Browser> {
  return await chromium.launch()
}

/**
 * @param {string} selector
 * @param {Page} page
 */
export async function $$ (selector: string, page: Page): Promise<string | null> {
  const element = await page.$(selector)
  if (element) {
    return await element.textContent()
  }
  return null
}

export async function loadConfig (dir: string, fixture: string | null = null, override: Record<string, unknown> = {}, { merge = false } = {}): Promise<Record<string, unknown>> {
  const config = await import(`${dir}/fixture/${fixture ? fixture + '/' : ''}nuxt.config.cjs`)

  if (merge) {
    return defu(override, config)
  } else {
    return {
      ...defu(config),
      ...defu(override),
    }
  }
}
