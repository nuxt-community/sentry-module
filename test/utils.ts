import { chromium, Page } from 'playwright-chromium'

export async function createBrowser () {
  return await chromium.launch()
}

/**
 * @param {string} selector
 * @param {Page} page
 */
export async function $$ (selector: string, page: Page) {
  const element = await page.$(selector)
  if (element) {
    return await element.textContent()
  }
  return null
}
