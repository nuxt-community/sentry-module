import type { Integration } from '@sentry/types'
import type { Context } from '@nuxt/types'

// eslint-disable-next-line require-await
export default async function (_context: Context): Promise<Integration[]> {
  return []
}
