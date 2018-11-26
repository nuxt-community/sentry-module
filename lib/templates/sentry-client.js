import Vue from 'vue'
import * as Sentry from '@sentry/browser'

export default function (ctx, inject) {
  const opts = Object.assign({}, <%= serialize(options.config) %>, {
    integrations: (integrations) => {
      integrations.push(new Sentry.Integrations.Dedupe)
      integrations.push(new Sentry.Integrations.FunctionToString)
      integrations.push(new Sentry.Integrations.InboundFilters)
      integrations.push(new Sentry.Integrations.Breadcrumbs)
      integrations.push(new Sentry.Integrations.GlobalHandlers)
      integrations.push(new Sentry.Integrations.LinkedErrors)
      integrations.push(new Sentry.Integrations.ReportingObserver)
      integrations.push(new Sentry.Integrations.TryCatch)
      integrations.push(new Sentry.Integrations.UserAgent)
      integrations.push(new Sentry.Integrations.Vue({ Vue }))
      return integrations
    }
  })
  Sentry.init(opts)

  // Inject Sentry to the context as $sentry
  ctx.$sentry = Sentry
  inject('sentry', Sentry)
}
