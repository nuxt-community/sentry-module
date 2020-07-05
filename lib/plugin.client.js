import VueLib from 'vue'
import * as Sentry from '@sentry/browser'
import { <%= Object.keys(options.integrations).join(', ') %> } from '@sentry/integrations'

export default function (ctx, inject) {
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

  // Inject Sentry to the context as $sentry
  inject('sentry', Sentry)
  ctx.$sentry = Sentry
}
