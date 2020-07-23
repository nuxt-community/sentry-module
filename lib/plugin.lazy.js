import VueLib from 'vue'

<% if (options.lazy.injectMock) { %>
const apiMethods = <%= JSON.stringify(options.lazy.mockApiMethods)%>
let delayedCalls = []
let SentryMock = {}
<% } %>
let sentryReadyResolve
let loaded = false

<% if (options.lazy.injectMock) { %>
let captureExceptionHandler = (error, vm, info) => {
  vm.$sentry.captureException(error)

  if (VueLib.util) {
    VueLib.util.warn(`Error in ${info}: "${error.toString()}"`, vm)
  }
  console.error(error)
}

const vueErrorHandler = VueLib.config.errorHandler

VueLib.config.errorHandler = (error, vm, info) => {
  captureExceptionHandler(error, vm, info)

  if (vueErrorHandler) {
    return vueErrorHandler(error, vm, info)
  }
}
<% } %>

export default async function SentryPlugin(ctx, inject) {
  <% if (options.lazy.injectMock) { %>
  apiMethods.forEach(key => {
    SentryMock[key] = (...args) => delayedCalls.push([key, args])
  })

  window.addEventListener('error', SentryMock.captureException)

  inject('sentry', SentryMock)
  ctx.$sentry = SentryMock
  <% } %>

  const loadSentryHook = () => !loaded && loadSentry(ctx, inject)

  <% if (options.lazy.injectLoadHook) { %>
  inject('sentryLoad', loadSentryHook)
  ctx.$sentryLoad = loadSentryHook
  <% } else { %>
  window.<%= globals.readyCallback %>(loadSentryHook)
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
    console.warn(`$sentryLoad was called but window.<%= globals.nuxt %> is not available, delaying sentry loading until onNuxtReady callback. Do you really need to use lazy loading for Sentry?`)
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

  <% if (options.lazy.injectMock) { %>
  captureExceptionHandler = () => {}
  <% } %>

  Sentry.init(config)
  <% } %>

  <% if (options.lazy.injectMock) { %>
  window.removeEventListener('error', SentryMock.captureException)

  delayedCalls.forEach(([methodName, args]) => Sentry[methodName].apply(Sentry, args))
  <% } %>

  forceInject(inject, ctx, 'sentry', Sentry)

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


// Custom inject function that is able to overwrite previously injected values,
// which original inject doesn't allow to do.
// This method is adapted from the inject method in nuxt/vue-app/template/index.js
function forceInject(originalInject, ctx, key, value) {
  originalInject(key, value)
  const injectKey = '$' + key
  ctx[injectKey] = value
  window.<%= globals.nuxt %>.$options[injectKey] = value
}
