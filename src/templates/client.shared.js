<%
if (options.clientConfigPath) {%>import getClientConfig from '<%= options.clientConfigPath %>'
<%}
if (options.customClientIntegrations) {%>import getCustomIntegrations from '<%= options.customClientIntegrations %>'
<%}%>
import merge from '~lodash.mergewith'
<%
const browserIntegrations = options.BROWSER_INTEGRATIONS.filter(key => key in options.integrations)
const vueImports = [
  'init',
  ...(browserIntegrations.length ? ['Integrations'] : []),
  ...(options.tracing ? ['vueRouterInstrumentation', 'BrowserTracing'] : [])
]
%>import { <%= vueImports.join(', ') %> } from '~@sentry/vue'
import * as CoreSdk from '~@sentry/core'
import * as BrowserSdk from '~@sentry/browser-sdk'
<%
let integrations = options.BROWSER_PLUGGABLE_INTEGRATIONS.filter(key => key in options.integrations)
if (integrations.length) {%>import { <%= integrations.join(', ') %> } from '~@sentry/integrations'
<%}%>

export { init }
export const SentrySdk = { ...CoreSdk, ...BrowserSdk }

export<%= (options.clientConfigPath || options.customClientIntegrations) ? ' async' : '' %> function getConfig (ctx) {
  /* eslint-disable object-curly-spacing, quote-props, quotes, key-spacing, comma-spacing */
  const config = {
    <%= Object
      .entries(options.config)
      .map(([key, option]) => {
        const value = typeof option === 'function' ? serializeFunction(option) : serialize(option)
        return `${key}:${value}`
      })
      .join(',\n    ') %>,
  }

  <% if (browserIntegrations.length) {%>
  const { <%= browserIntegrations.join(', ') %> } = Integrations
  <%}%>
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
      })
      .join(',\n    ') %>,
  ]
  <% if (options.tracing) { %>
  const { browserTracing, vueOptions, ...tracingOptions } = <%= serialize(options.tracing) %>
  config.integrations.push(new BrowserTracing({
    ...(ctx.app.router ? { routingInstrumentation: vueRouterInstrumentation(ctx.app.router) } : {}),
    ...browserTracing,
  }))
  merge(config, vueOptions, tracingOptions)
  <% } %>

  <% if (options.clientConfigPath) { %>
  const clientConfig = await getClientConfig(ctx)
  clientConfig ? merge(config, clientConfig) : console.error(`[@nuxtjs/sentry] Invalid value returned from the clientConfig plugin.`)
  <% } %>

  <% if (options.customClientIntegrations) { %>
  const customIntegrations = await getCustomIntegrations(ctx)
  if (Array.isArray(customIntegrations)) {
    config.integrations.push(...customIntegrations)
  } else {
    console.error(`[@nuxtjs/sentry] Invalid value returned from customClientIntegrations plugin. Expected an array, got "${typeof customIntegrations}".`)
  }
  <% } %>

  const runtimeConfigKey = <%= serialize(options.runtimeConfigKey) %>
  if (ctx.$config && runtimeConfigKey && ctx.$config[runtimeConfigKey]) {
    merge(config, ctx.$config[runtimeConfigKey].config, ctx.$config[runtimeConfigKey].clientConfig)
  }

  return config
}
