import merge from '~lodash.mergewith'
import * as CoreSdk from '~@sentry/core'
import { captureUserFeedback, forceLoad, onLoad, showReportDialog, wrap } from '~@sentry/browser'
<%
for (const [package, imports] of Object.entries(options.imports)) {
  if (imports.length) {
    %>import { <%= imports.join(', ') %> } from '<%= package %>'
<%
  }
}
if (options.clientConfigPath) {%>import getClientConfig from '<%= options.clientConfigPath %>'
<%}
if (options.customClientIntegrations) {%>import getCustomIntegrations from '<%= options.customClientIntegrations %>'
<%}%>

export { init }
export const SentrySdk = { ...CoreSdk, ...{ captureUserFeedback, forceLoad, onLoad, showReportDialog, wrap } }

/** @type {string[]} */
const DISABLED_INTEGRATION_KEYS = <%= serialize(options.DISABLED_INTEGRATION_KEYS) %>

/**
 * @typedef {Parameters<typeof init>[0]} InitConfig
 * @param {import('@nuxt/types').Context} ctx
 * @return {Promise<InitConfig>}
 */
export<%= (options.clientConfigPath || options.customClientIntegrations) ? ' async' : '' %> function getConfig (ctx) {
  /** @type {InitConfig} */
  const config = {
    <%= Object
      .entries(options.config)
      .map(([key, option]) => {
        const value = typeof option === 'function' ? serializeFunction(option) : serialize(option)
        return `${key}:${value}`
      })
      .join(',\n    ') %>,
  }

  /** @type {NonNullable<InitConfig>['integrations']} */
  const resolvedIntegrations = [
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

        return `${name}(${integrationOptions.length ? '{ ' + integrationOptions.join(',') + ' }' : ''})`
      })
      .join(',\n    ') %>,
  ]
  <%
  if (options.tracing) {
    const { browserTracing, vueOptions, vueRouterInstrumentationOptions, ...tracingOptions } = options.tracing
  %>
  resolvedIntegrations.push(browserTracingIntegration({
    router: ctx.app.router,
    ...<%= serialize(vueRouterInstrumentationOptions) %>,
    ...<%= serialize(browserTracing) %>,
  }))
  merge(config, <%= serialize(vueOptions) %>, <%= serialize(tracingOptions) %>)
  <% } %>

  <% if (options.clientConfigPath) { %>
  const clientConfig = await getClientConfig(ctx)
  clientConfig ? merge(config, clientConfig) : console.error(`[@nuxtjs/sentry] Invalid value returned from the clientConfig plugin.`)
  <% } %>

  <% if (options.customClientIntegrations) { %>
  const customIntegrations = await getCustomIntegrations(ctx)
  if (Array.isArray(customIntegrations)) {
    resolvedIntegrations.push(...customIntegrations)
  } else {
    console.error(`[@nuxtjs/sentry] Invalid value returned from customClientIntegrations plugin. Expected an array, got "${typeof customIntegrations}".`)
  }
  <% } %>
  config.integrations = (defaultIntegrations) => {
    return [
      ...defaultIntegrations.filter(integration => !DISABLED_INTEGRATION_KEYS.includes(integration.name)),
      ...resolvedIntegrations,
    ]
  }
  const runtimeConfigKey = <%= serialize(options.runtimeConfigKey) %>
  if (ctx.$config && runtimeConfigKey && ctx.$config[runtimeConfigKey]) {
    merge(config, ctx.$config[runtimeConfigKey].config, ctx.$config[runtimeConfigKey].clientConfig)
  }

  return config
}
