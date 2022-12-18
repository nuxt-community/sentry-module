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

export default async function (ctx, inject) {
  <% if (options.initialize) { %>
  /* eslint-disable object-curly-spacing, quote-props, quotes, key-spacing, comma-spacing */
  const config = {
    Vue,
    <%= Object
      .entries(options.config)
      .map(([key, option]) => {
        const value = typeof option === 'function' ? serializeFunction(option) : serialize(option)
        return `${key}:${value}`
      })
      .join(',\n    ') %>,
  }

  const runtimeConfigKey = <%= serialize(options.runtimeConfigKey) %>
  if (ctx.$config && runtimeConfigKey && ctx.$config[runtimeConfigKey]) {
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
      })
      .join(',\n    ') %>,
  ]
  <% if (options.tracing) { %>
  // eslint-disable-next-line prefer-regex-literals
  const { browserTracing, vueOptions, ...tracingOptions } = <%= serialize(options.tracing) %>
  config.integrations.push(new BrowserTracing(browserTracing))
  merge(config, vueOptions, tracingOptions)
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
