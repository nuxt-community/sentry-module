import VueLib from 'vue'

<% if (options.lazy.injectMock) { %>
const apiMethods = <%= JSON.stringify(options.lazy.mockApiMethods)%>
let delayedCalls = []
let SentryMock = {}
<% } %>
let sentryReadyResolve

export default async function SentryPlugin(ctx, inject) {
  <% if (options.lazy.injectMock) { %>
  apiMethods.forEach(key => {
    SentryMock[key] = (...args) => delayedCalls.push([key, args])
  })

  window.addEventListener('error', SentryMock.captureException)

  // Inject Sentry mock to the context as $sentry
  inject('sentry', SentryMock)
  ctx.$sentry = SentryMock
  <% } %>

  const loadSentryHook = () => loadSentry(ctx, inject)

  <% if (options.lazy.injectLoadHook) { %>
  inject('sentryLoad', loadSentryHook)
  ctx.$sentryLoad = loadSentryHook
  <% } else { %>
  window.onNuxtReady(loadSentryHook)
  <% } %>

  const sentryReadyPromise = new Promise(resolve => {
      sentryReadyResolve = resolve
    })

  const sentryReady = () => sentryReadyPromise

  inject('sentryReady', sentryReady)
  ctx.$sentryReady = sentryReady
}

async function loadSentry(ctx, inject) {
  <%
  const magicComments = [`webpackChunkName: '${options.lazy.chunkName}'`]
  if (options.lazy.webpackPrefetch) {
    magicComments.push('webpackPrefetch: true')
  }
  if (options.lazy.webpackPreload) {
    magicComments.push('webpackPreload: true')
  }
  %>
  const Sentry = await import(/* <%= magicComments.join(', ') %> */ '@sentry/browser')
  const { <%= Object.keys(options.integrations).join(', ') %> } = await import(/* <%= magicComments.join(', ') %> */ '@sentry/integrations')

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

  <% if (options.lazy.injectMock) { %>
  window.removeEventListener('error', SentryMock.captureException)

  delayedCalls.forEach(([methodName, args]) => Sentry[methodName].apply(Sentry, args))
  <% } %>

  // Inject Sentry to the context as $sentry
  sentryReadyResolve(Sentry)
  inject('sentry', Sentry)
  inject('sentryReady', () => Promise.resolve(Sentry))
  ctx.$sentry = Sentry
  ctx.$sentryReady = () => Promise.resolve(Sentry)
  
  <% if (options.lazy.injectLoadHook) { %>
  // Set noop for sentryLoad so we dont
  // try to load Sentry more then once
  const noop = _ => _
  inject('sentryLoad', noop)
  ctx.$sentryLoad = noop
  <% } %>

  // help gc
  <% if (options.lazy.injectMock) { %>
  // Dont unset delayedCalls & SentryMock during
  // development, this will cause HMR issues
  <% if (!options.dev) { %>
  delayedCalls = undefined
  SentryMock = undefined
  <% } else { %>
  delayedCalls = []
  <% } %>
  <% } %>
  sentryReadyResolve = undefined
}
