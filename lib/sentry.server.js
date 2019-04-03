import * as Sentry from '@sentry/node'
import * as Integrations from '@sentry/integrations'

export default function (ctx, inject) {
  const opts = Object.assign({}, <%= serialize(options) %>, {
    integrations: [
        new Integrations.Dedupe(),
        new Integrations.ExtraErrorData(),
        new Integrations.RewriteFrames(),
        new Integrations.Transaction()
      ]
  })

  if (!opts.disabled) {
    Sentry.init(opts)
  }

  // Inject Sentry to the context as $sentry
  inject('sentry', Sentry)
}
