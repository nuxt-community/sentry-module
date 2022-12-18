import Vue from 'vue'

<% if (options.lazy.injectMock) { %>
let delayedCalls = []
let SentryMock = {}
<% } %>
let sentryReadyResolve
let loadInitiated = false
let loadCompleted = false

<% if (options.lazy.injectMock) { %>
let delayedGlobalErrors = []
let delayedUnhandledRejections = []
/** @param {ErrorEvent} event */
const delayGlobalError = function (event) {
  delayedGlobalErrors.push([event.message, event.filename, event.lineno, event.colno, event.error])
}
const delayUnhandledRejection = function (event) {
  delayedUnhandledRejections.push('reason' in event ? event.reason : 'detail' in event && 'reason' in event.detail ? event.detail.reason : event)
}

const vueErrorHandler = Vue.config.errorHandler

Vue.config.errorHandler = (error, vm, info) => {
  if (!loadCompleted) {
    if (vm) {
      vm.$sentry.captureException(error)
    }

    if (Vue.util) {
      Vue.util.warn(`Error in ${info}: "${error.toString()}"`, vm)
    }
    console.error(error)
  }

  if (vueErrorHandler) {
    return vueErrorHandler(error, vm, info)
  }
}
<% } %>

export default function SentryPlugin (ctx, inject) {
  <% if (options.lazy.injectMock) { %>
  /* eslint-disable-next-line quotes, comma-spacing */
  const apiMethods = <%= JSON.stringify(options.lazy.mockApiMethods)%>
  apiMethods.forEach((key) => {
    SentryMock[key] = (...args) => delayedCalls.push([key, args])
  })

  window.addEventListener('error', delayGlobalError)
  window.addEventListener('unhandledrejection', delayUnhandledRejection)

  inject('sentry', SentryMock)
  ctx.$sentry = SentryMock
  <% } %>

  const loadSentryHook = () => attemptLoadSentry(ctx, inject)

  <% if (options.lazy.injectLoadHook) { %>
  inject('sentryLoad', loadSentryHook)
  ctx.$sentryLoad = loadSentryHook
  <% } else { %>
  window.<%= globals.readyCallback %>(loadSentryHook)
  <% } %>

  const sentryReadyPromise = new Promise((resolve) => {
    sentryReadyResolve = resolve
  })

  const sentryReady = () => sentryReadyPromise

  inject('sentryReady', sentryReady)
  ctx.$sentryReady = sentryReady
}

async function attemptLoadSentry (ctx, inject) {
  if (loadInitiated) {
    return
  }

  loadInitiated = true

  if (!window.<%= globals.nuxt %>) {
    <% if (options.dev) { %>
    console.warn(`$sentryLoad was called but window.<%= globals.nuxt %> is not available, delaying sentry loading until onNuxtReady callback. Do you really need to use lazy loading for Sentry?`)
    <% } %>
    <% if (options.lazy.injectLoadHook) { %>
    window.<%= globals.readyCallback %>(() => loadSentry(ctx, inject))
    <% } else { %>
    // Wait for onNuxtReady hook to trigger.
    <% } %>
    return
  }

  await loadSentry(ctx, inject)
}

async function loadSentry (ctx, inject) {
  if (loadCompleted) {
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
  const Sentry = await import(/* <%= magicComments.join(', ') %> */ '@sentry/vue')
  <%
  if (options.initialize) {
    let integrations = options.PLUGGABLE_INTEGRATIONS.filter(key => key in options.integrations)
    if (integrations.length) {%>const { <%= integrations.join(', ') %> } = await import(/* <%= magicComments.join(', ') %> */ '@sentry/integrations')
<%  }
    integrations = options.BROWSER_INTEGRATIONS.filter(key => key in options.integrations)
    if (integrations.length) {%>  const { <%= integrations.join(', ') %> } = Sentry.Integrations
<%}

  const serializedConfig = Object
    .entries({
      ...options.config,
      ...options.integrations.Vue,
      ...(options.tracing ? options.tracing.vueOptions.tracingOptions : {}),
    })
    .map(([key, option]) => {
      const value = typeof option === 'function' ? serializeFunction(option) : serialize(option)
      return`${key}: ${value}`
    })
    .join(',\n    ')
  %>
  /* eslint-disable quotes, key-spacing */
  const config = {
    Vue,
    <%= serializedConfig %>,
  }

  const runtimeConfigKey = <%= serialize(options.runtimeConfigKey) %>
  if (ctx.$config && runtimeConfigKey && ctx.$config[runtimeConfigKey]) {
    const { default: merge } = await import(/* <%= magicComments.join(', ') %> */ 'lodash.mergewith')
    merge(config, ctx.$config[runtimeConfigKey].config, ctx.$config[runtimeConfigKey].clientConfig)
  }

  config.integrations = [
    <%= Object
      .entries(options.integrations)
      .filter(([name]) => name !== 'Vue')
      .map(([name, integration]) => {
        const integrationOptions = Object
          .entries(integration)
          .map(([key, option]) => {
            const value = typeof option === 'function' ? serializeFunction(option) : serialize(option)
            return `${key}:${value}`
          })

        return `new ${name}(${integrationOptions.length ? '{ ' + integrationOptions.join(',') + ' }' : ''})`
      }).join(',\n    ')
    %>,
  ]
  /* eslint-enable quotes, key-spacing */

  <%if (options.customClientIntegrations) {%>
  const customIntegrations = (await import(/* <%= magicComments.join(', ') %> */ '<%= options.customClientIntegrations %>').then(m => m.default || m))(ctx)
  if (Array.isArray(customIntegrations)) {
    config.integrations.push(...customIntegrations)
  } else {
    console.error(`[@nuxtjs/sentry] Invalid value returned from customClientIntegrations plugin. Expected an array, got "${typeof customIntegrations}".`)
  }
  <% } %>
  Sentry.init(config)
  <% } %>

  loadCompleted = true
  <% if (options.lazy.injectMock) { %>
  window.removeEventListener('error', delayGlobalError)
  window.removeEventListener('unhandledrejection', delayUnhandledRejection)
  if (delayedGlobalErrors.length) {
    if (window.onerror) {
      console.info('Reposting global errors after Sentry has loaded')
      for (const errorArgs of delayedGlobalErrors) {
        window.onerror.apply(window, errorArgs)
      }
    }
    delayedGlobalErrors = []
  }
  if (delayedUnhandledRejections.length) {
    if (window.onunhandledrejection) {
      console.info('Reposting unhandled promise rejection errors after Sentry has loaded')
      for (const reason of delayedUnhandledRejections) {
        window.onunhandledrejection(reason)
      }
    }
    delayedUnhandledRejections = []
  }
  delayedCalls.forEach(([methodName, args]) => Sentry[methodName].apply(Sentry, args))
  <% } %>

  forceInject(ctx, inject, 'sentry', Sentry)

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
function forceInject (ctx, inject, key, value) {
  inject(key, value)
  const injectKey = '$' + key
  ctx[injectKey] = value
  window.<%= globals.nuxt %>.$options[injectKey] = value
}
