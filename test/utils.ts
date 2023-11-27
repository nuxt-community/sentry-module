import { fileURLToPath } from 'node:url'
import initJiti from 'jiti'
import { defu } from 'defu'
import { join } from 'pathe'
import { NuxtConfig } from '@nuxt/types'
import { chromium, Browser, Page } from 'playwright-chromium'

const jitiImport = initJiti(fileURLToPath(import.meta.url))

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

export function loadConfig (dir: string, fixture: string | null = null, override: NuxtConfig = {}, { merge = false } = {}): NuxtConfig {
  const fixtureConfig = jitiImport(join(dir, 'fixture', fixture ?? '', 'nuxt.config'))
  const config = Object.assign({}, fixtureConfig.default || fixtureConfig)

  if (merge) {
    return defu(override, config)
  } else {
    return {
      ...defu(config),
      ...defu(override),
    }
  }
}
