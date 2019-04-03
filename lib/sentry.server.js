import * as Sentry from '@sentry/node'
import { Dedupe, ExtraErrorData, RewriteFrames, Transaction } from '@sentry/integrations'

export default function (ctx, inject) {
  const opts = Object.assign({}, <%= serialize(options) %>, {
    integrations: [
        new Dedupe(),
        new ExtraErrorData(),
        new RewriteFrames(),
        new Transaction()
      ]
  })

  if (!opts.disabled) {
    Sentry.init(opts)
  }

  // Inject Sentry to the context as $sentry
  inject('sentry', Sentry)
}
