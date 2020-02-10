import * as Sentry from '@sentry/browser'

export default function (ctx, inject) {
  const sentryMock = {}
  function createMockFunction (key) {
    return (...params) => {
      // eslint-disable-next-line no-console
      console.warn(`$sentry.${key}() called, but sentry plugin is disabled. Arguments:`, params)
    }
  }

  for (const [key, value] of Object.entries(Sentry)) {
    if (typeof value === 'function') {
      sentryMock[key] = createMockFunction(key)
    }
  }

  // Inject mocked sentry to the context as $sentry (this is used in case sentry is disabled)
  inject('sentry', sentryMock)
  ctx.$sentry = sentryMock
}
