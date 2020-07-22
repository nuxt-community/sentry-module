import VueLib from 'vue'

<% if (options.lazy.injectMock) { %>
const apiMethods = <%= JSON.stringify(options.lazy.mockApiMethods)%>
let delayedCalls = []
let SentryMock = {}
<% } %>
let sentryReadyResolve
let loaded = false

export default async function SentryPlugin(ctx, inject) {
  <% if (options.lazy.injectMock) { %>
  apiMethods.forEach(key => {
    SentryMock[key] = (...args) => delayedCalls.push([key, args])
  })

  window.addEventListener('error', SentryMock.captureException)

  // Inject Sentry mock to the context as $sentry
  inject('sentry', SentryMock)
  <% } %>

  const loadSentryHook = () => !loaded && loadSentry(ctx, inject)

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
  loaded = true

  if (!window.<%= globals.nuxt %>) {
    <% if (options.dev) { %>
    console.warn(`$sentryLoad was called but window.<%= globals.nuxt %> is not available, delaying sentry loading until onNuxtReady callback`)
    <% } %>
    window.<%= globals.readyCallback %>Cbs.push(() => loadSentry(ctx, inject))
    return
  }

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

      const integrationOptions = Object.entries(integration).map(([key, option]) => 
        typeof option === 'function'
        ? `${key}:${serializeFunction(option)}`
        : `${key}:${serialize(option)}`
      )

      return `new ${name}({${integrationOptions.join(',')}})`
    }).join(',\n      ')%>
  ]

  Sentry.init(config)
  <% } %>

  <% if (options.lazy.injectMock) { %>
  window.removeEventListener('error', SentryMock.captureException)

  delayedCalls.forEach(([methodName, args]) => Sentry[methodName].apply(Sentry, args))
  <% } %>

  injectOverwrite(ctx, 'sentry', Sentry)

  sentryReadyResolve(Sentry)

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


// Temporary inject into Nuxt without using Nuxt's inject method,
// so we can later inject the final value
// This method is adapted from the inject method in nuxt/vue-app/template/index.js
function injectOverwrite({ app }, key, value) {
  key = '$' + key
  // Add into app
  app[key] = value
  // Add into context (always overwrite)
  app.context[key] = value

  <% if (store) { %>
  // Add into store
  store[key] = app[key]
  <% } %>

  window.<%= globals.nuxt %>.$options[key] = value
}
