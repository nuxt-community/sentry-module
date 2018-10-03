import Vue from 'vue'
import * as Sentry from '@sentry/browser'

export default function (ctx, inject) {
  const opts = Object.assign({}, <%= serialize(options.config) %>, {
    integrations: (integrations) => {
      integrations.push(new Sentry.Integrations.Vue({ Vue }))
      return integrations
    }
  })
  Sentry.init(opts)

  // Inject Sentry to the context as $sentry
  ctx.$sentry = Sentry
  inject('sentry', Sentry)
}
