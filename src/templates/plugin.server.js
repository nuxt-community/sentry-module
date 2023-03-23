<% if (options.tracing) { %>
import { dynamicSamplingContextToSentryBaggageHeader } from '~@sentry/utils'
<% } %>

/** @type {import('@nuxt/types').Module} */
export default function (ctx, inject) {
  const sentry = process.sentry || null
  if (!sentry) {
    return
  }
  inject('sentry', sentry)
  ctx.$sentry = sentry
  <% if (options.tracing) { %>
  const scope = ctx.$sentry.getCurrentHub().getScope()
  if (scope) {
    const span = scope.getSpan()
    const transaction = scope.getTransaction()
    if (span && transaction) {
      ctx.app.head.meta.push({ hid: 'sentry-trace', name: 'sentry-trace', content: span.toTraceparent() })
      const dsc = transaction.getDynamicSamplingContext()
      if (dsc) {
        ctx.app.head.meta.push({ hid: 'sentry-baggage', name: 'baggage', content: dynamicSamplingContextToSentryBaggageHeader(dsc) })
      }
    }
  }
  <% } %>
  <% if (options.lazy) { %>
  const sentryReady = () => Promise.resolve(sentry)
  inject('sentryReady', sentryReady)
  ctx.$sentryReady = sentryReady
  <% } %>
}
