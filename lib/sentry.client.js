import VueLib from 'vue'
import * as Sentry from '@sentry/browser'
import { <%= Object.keys(options.integrations).map(integration => integration).join(', ') %> } from '@sentry/integrations'

export default function (ctx, inject) {
  const opts = Object.assign({}, <%= serialize(options.config) %>, {
    integrations: [
      <%= Object.keys(options.integrations).map(name => {
        const integration = options.integrations[name]
        if (name === 'Vue') {
          return `new ${name}({Vue: VueLib, ...${serialize(integration)}})`
        }
        return `new ${name}({${Object.keys(integration).map(option => typeof integration[option] === 'function' ?
          `${option}:${serializeFunction(integration[option])}` : `${option}:${serialize(integration[option])}`).join(',')}})`
      }).join(',\n      ') %>
    ]
  })

  <% if (options.initialize) { %>// Initialize sentry
  Sentry.init(opts)<% } %>

  // Inject Sentry to the context as $sentry
  inject('sentry', Sentry)
}
