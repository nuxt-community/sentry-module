import Vue from 'vue'
import merge from 'lodash.mergewith'
import * as Sentry from '@sentry/vue'
<% if (options.tracing) { %>import { BrowserTracing } from '@sentry/tracing'<% } %>
<%
if (options.initialize) {
  let integrations = options.PLUGGABLE_INTEGRATIONS.filter(key => key in options.integrations)
  if (integrations.length) {%>import { <%= integrations.join(', ') %> } from '@sentry/integrations'
<%}
  if (options.customClientIntegrations) {%>import getCustomIntegrations from '<%= options.customClientIntegrations %>'
<%}
  integrations = options.BROWSER_INTEGRATIONS.filter(key => key in options.integrations)
  if (integrations.length) {%>
const { <%= integrations.join(', ') %> } = Sentry.Integrations
<%}
}
%>

// eslint-disable-next-line require-await
export default async function (ctx, inject) {
  <% if (options.initialize) { %>
  /* eslint-disable object-curly-spacing, quote-props, quotes, key-spacing, comma-spacing */
  const config = {
    Vue,
    <%= Object.entries(options.config).map(([key, option]) =>
      typeof option === 'function'
        ? `${key}:${serializeFunction(option)}`
        : `${key}:${serialize(option)}`
    ).join(',\n    ') %>,
  }

  const runtimeConfigKey = <%= serialize(options.runtimeConfigKey) %>
  if (ctx.$config && runtimeConfigKey && ctx.$config[runtimeConfigKey]) {
    merge(config, ctx.$config[runtimeConfigKey].config, ctx.$config[runtimeConfigKey].clientConfig)
  }

  config.integrations = [
    <%= Object.entries(options.integrations).map(([name, integration]) => {
      const integrationOptions = Object.entries(integration).map(([key, option]) =>
        typeof option === 'function'
          ? `${key}:${serializeFunction(option)}`
          : `${key}:${serialize(option)}`
      )

      return `new ${name}(${integrationOptions.length ? '{' + integrationOptions.join(',') + '}' : ''})`
    }).join(',\n    ')%>,
  ]
  <% if (options.tracing) { %>
  const { tracePropagationTargets, ...tracingOptions } = <%= serialize(options.tracing) %>
  config.integrations.push(new BrowserTracing({ tracePropagationTargets }))
  merge(config, tracingOptions)
  <% } %>
  <% if (options.customClientIntegrations) { %>
  const customIntegrations = await getCustomIntegrations(ctx)
  if (Array.isArray(customIntegrations)) {
    config.integrations.push(...customIntegrations)
  } else {
    console.error(`[@nuxtjs/sentry] Invalid value returned from customClientIntegrations plugin. Expected an array, got "${typeof customIntegrations}".`)
  }
  <% } %>
  /* eslint-enable object-curly-spacing, quote-props, quotes, key-spacing, comma-spacing */
  Sentry.init(config)
  <% } %>

  inject('sentry', Sentry)
  ctx.$sentry = Sentry
}
