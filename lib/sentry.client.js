import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import { Dedupe, ExtraErrorData, ReportingObserver, RewriteFrames, Vue as VueIntegration } from '@sentry/integrations';

export default function (ctx, inject) {
  const opts = Object.assign({}, <%= serialize(options) %>, {
    integrations: [
      new Dedupe(),
      new ExtraErrorData(),
      new ReportingObserver(),
      new RewriteFrames(),
      new VueIntegration({ Vue, attachProps: true })
    ]
  })

  if (!opts.disabled) {
    Sentry.init(opts)
  }

  // Inject Sentry to the context as $sentry
  inject('sentry', Sentry)
}
