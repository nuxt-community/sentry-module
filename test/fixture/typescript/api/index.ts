import type { ServerMiddleware } from '@nuxt/types'

export default <ServerMiddleware> function serverRoute (req, res, next) {
  // @ts-expect-error crash on purpose
  apiCrash()
  res.end('OK')
}
