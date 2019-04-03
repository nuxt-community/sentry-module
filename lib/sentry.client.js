import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations';

export default function (ctx, inject) {
  const opts = Object.assign({}, <%= serialize(options) %>, {
    integrations: [
      new Integrations.Dedupe(),
      new Integrations.ExtraErrorData(),
      new Integrations.ReportingObserver(),
      new Integrations.RewriteFrames(),
      new Integrations.Vue({ Vue, attachProps: true })
    ]
  })

  if (!opts.disabled) {
    Sentry.init(opts)
  }

  // Inject Sentry to the context as $sentry
  inject('sentry', Sentry)
}
