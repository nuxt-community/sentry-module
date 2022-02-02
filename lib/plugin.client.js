import VueLib from 'vue'
import merge from 'lodash.mergewith'
import * as Sentry from '@sentry/browser'
<%
if (options.initialize) {
  let integrations = options.SENTRY_PLUGGABLE_INTEGRATIONS.filter(key => key in options.integrations)
  if (integrations.length) {%>import { <%= integrations.join(', ') %> } from '@sentry/integrations'
<%}
  integrations = options.SENTRY_BROWSER_INTEGRATIONS.filter(key => key in options.integrations)
  if (integrations.length) {%>const { <%= integrations.join(', ') %> } = Sentry.Integrations
<%}
}
%>
<% if (options.tracing) { %>
import { Integrations as TracingIntegrations } from '@sentry/tracing'
<% } %>

export default function (ctx, inject) {
  <% if (options.initialize) { %>
  /* eslint-disable object-curly-spacing, quote-props, quotes, key-spacing, comma-spacing */
  const config = {
    <%= Object.entries(options.config).map(([key, option]) =>
      typeof option === 'function'
        ? `${key}:${serializeFunction(option)}`
        : `${key}:${serialize(option)}`
    ).join(',\n    ') %>
  }

  const runtimeConfigKey = <%= serialize(options.runtimeConfigKey) %>
  if (ctx.$config && runtimeConfigKey && ctx.$config[runtimeConfigKey]) {
    merge(config, ctx.$config[runtimeConfigKey].config, ctx.$config[runtimeConfigKey].clientConfig)
  }

  config.integrations = [
    <%= Object.entries(options.integrations).map(([name, integration]) => {
      if (name === 'Vue') {
        if (options.tracing) {
          integration = { ...integration, ...options.tracing.vueOptions }
        }
        return `new ${name}({ Vue: VueLib, ...${serialize(integration)}})`
      }

      const integrationOptions = Object.entries(integration).map(([key, option]) =>
        typeof option === 'function'
          ? `${key}:${serializeFunction(option)}`
          : `${key}:${serialize(option)}`
      )

      return `new ${name}(${integrationOptions.length ? '{' + integrationOptions.join(',') + '}' : ''})`
    }).join(',\n    ')%>
  ]
  <% if (options.tracing) { %>
    config.integrations.push(<%= `new TracingIntegrations.BrowserTracing(${serialize(options.tracing.browserOptions)})` %>)
  <% } %>
  /* eslint-enable object-curly-spacing, quote-props, quotes, key-spacing, comma-spacing */
  Sentry.init(config)
  <% } %>

  inject('sentry', Sentry)
  ctx.$sentry = Sentry
}
