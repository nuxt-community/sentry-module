import * as Sentry from '@sentry/browser'

function noop () {}

/** @type {import('@nuxt/types').Plugin} */
export default function (ctx, inject) {
  const sentryMock = {}

  for (const [key, value] of Object.entries(Sentry)) {
    if (typeof value === 'function') {
      sentryMock[key] = noop
    }
  }

  // Inject mocked sentry to the context as $sentry (this is used in case sentry is disabled)
  inject('sentry', sentryMock)
  ctx.$sentry = sentryMock
}
