import VueLib from 'vue'

const methodKeys = <%= JSON.stringify(options.browserMethods)%>
let delayedCalls = []
let SentryMock = {}
let resolveSentryReady

export default async function SentryPlugin(ctx, inject) {
  methodKeys.forEach(key => {
    SentryMock[key] = (...args) => delayedCalls.push([key, args])
  })

  window.addEventListener('error', SentryMock.captureException)
  window.onNuxtReady(() => loadSentry(ctx, inject))

  const sentryReady = () => {
    return new Promise(resolve => {
      resolveSentryReady = resolve
    })
  }

  // Inject Sentry mock to the context as $sentry
  inject('sentry', SentryMock)
  ctx.$sentry = SentryMock

  inject('sentryReady', sentryReady)
  ctx.$sentryReady = sentryReady
}

async function loadSentry(ctx, inject) {
  const Sentry = await import(/* webpackChunkName: 'sentry' */ '@sentry/browser')
  const { <%= Object.keys(options.integrations).join(', ') %> } = await import(/* webpackChunkName: 'sentry' */ '@sentry/integrations')

  <% if (options.initialize) { %>// Initialize sentry
  const config = <%= serialize(options.config) %>
  config.integrations = [
    <%= Object.entries(options.integrations).map(([name, integration]) => {
      if (name === 'Vue') {
        return `new ${name}({Vue: VueLib, ...${serialize(integration)}})`
      }

      const integrationOptions = Object.entries(integration).map(([key, option]) => {
        typeof option === 'function'
        ? `${key}:${serializeFunction(option)}`
        : `${key}:${serialize(option)}`
      })

      return `new ${name}({${integrationOptions.join(',')}})`
    }).join(',\n      ')%>
  ]

  Sentry.init(config)
  <% } %>

  window.removeEventListener('error', SentryMock.captureException)

  delayedCalls.forEach(([methodName, args]) => Sentry[methodName].apply(Sentry, args))

  // Inject Sentry to the context as $sentry
  resolveSentryReady(Sentry)
  inject('sentry', Sentry)
  inject('sentryReady', () => Promise.resolve(Sentry))
  ctx.$sentry = Sentry
  ctx.$sentryReady = () => Promise.resolve(Sentry)

  // help gc
  delayedCalls = undefined
  SentryMock = undefined
  resolveSentryReady = undefined
}
