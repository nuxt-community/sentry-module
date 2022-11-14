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
