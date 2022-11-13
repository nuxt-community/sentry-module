/** @type {import('@nuxt/types').Module} */
export default function (ctx, inject) {
  const sentry = process.sentry || {}
  inject('sentry', sentry)
  ctx.$sentry = sentry

  <% if (options.lazy) { %>
  const sentryReady = () => Promise.resolve(sentry)
  inject('sentryReady', sentryReady)
  ctx.$sentryReady = sentryReady
  <% } %>
}
