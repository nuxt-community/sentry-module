import type { Integration } from '@sentry/types'
import type { Context } from '@nuxt/types'

export default async function (_context: Context): Promise<Integration[]> {
  return []
}
