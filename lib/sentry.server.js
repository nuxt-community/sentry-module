/** @type {import('@nuxt/types').Module} */
export default function (ctx, inject) {
  // Inject Sentry to the context as $sentry
  inject('sentry', process.sentry || {})
  ctx.$sentry = process.sentry || {}
}
