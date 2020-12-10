import { chromium } from 'playwright-chromium'

export async function createBrowser () {
  return await chromium.launch()
}

/**
 * @param {string} selector
 * @param {import('playwright-chromium').Page} page
 */
export async function $$ (selector, page) {
  const element = await page.$(selector)
  if (element) {
    return await element.textContent()
  }
  return null
}
