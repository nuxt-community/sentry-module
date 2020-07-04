/** @type {import('@nuxt/types').Module} */
export default function (ctx, inject) {
  const sentry = process.sentry || {}
  // Inject Sentry to the context as $sentry
  inject('sentry', sentry)
  ctx.$sentry = sentry

  <% if (options.async) { %>
  const sentryReady = () => Promise.resolve(sentry)
  inject('sentryReady', sentryReady)
  ctx.$sentryReady = sentryReady
  <% } %>
}
