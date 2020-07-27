import VueLib from 'vue'
import * as Sentry from '@sentry/browser'
<% if (options.initialize) { %>
import { <%= Object.keys(options.integrations).join(', ') %> } from '@sentry/integrations'
<% } %>

export default function (ctx, inject) {
  <% if (options.initialize) { %>
  /* eslint-disable object-curly-spacing, quote-props, quotes, key-spacing, comma-spacing */
  const config = <%= serialize(options.config) %>
  config.integrations = [
    <%= Object.entries(options.integrations).map(([name, integration]) => {
      if (name === 'Vue') {
        return `new ${name}({ Vue: VueLib, ...${serialize(integration)}})`
      }

      const integrationOptions = Object.entries(integration).map(([key, option]) =>
        typeof option === 'function'
          ? `${key}:${serializeFunction(option)}`
          : `${key}:${serialize(option)}`
      )

      return `new ${name}({${integrationOptions.join(',')}})`
    }).join(',\n    ')%>
  ]
  /* eslint-enable object-curly-spacing, quote-props, quotes, key-spacing, comma-spacing */
  Sentry.init(config)
  <% } %>

  inject('sentry', Sentry)
  ctx.$sentry = Sentry
}
