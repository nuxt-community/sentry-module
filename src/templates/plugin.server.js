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
  connectBackendTraces(ctx)
  <% } %>
  <% if (options.lazy) { %>
  const sentryReady = () => Promise.resolve(sentry)
  inject('sentryReady', sentryReady)
  ctx.$sentryReady = sentryReady
  <% } %>
}

<% if (options.tracing) { %>
function connectBackendTraces (ctx) {
  const { head } = ctx.app
  if (!head || head instanceof Function) {
    console.warn('[@nuxtjs/sentry] can not connect backend and frontend traces because app.head is a function or missing!')
    return
  }
  const scope = ctx.$sentry.getCurrentHub().getScope()
  const span = scope.getSpan()
  const transaction = scope.getTransaction()
  if (!span || !transaction) {
    return
  }
  head.meta = head.meta || []
  head.meta.push({ hid: 'sentry-trace', name: 'sentry-trace', content: span.toTraceparent() })
  const dsc = transaction.getDynamicSamplingContext()
  if (dsc) {
    head.meta.push({ hid: 'sentry-baggage', name: 'baggage', content: dynamicSamplingContextToSentryBaggageHeader(dsc) })
  }
}
<% } %>
