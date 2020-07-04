const methodKeys = <%= JSON.stringify(options.browserMethods)%>

/** @type {import('@nuxt/types').Plugin} */
export default function (ctx, inject) {
  const SentryMock = {}
  methodKeys.forEach(key => {
    // eslint-disable-next-line no-console
    SentryMock[key] = <%= options.logMockCalls
      ? '(...args) => console.warn(`$sentry.${key}() called, but Sentry plugin is disabled. Arguments:`, args)'
      : '_ => _'%>  
  })

  // Inject mocked sentry to the context as $sentry (this is used in case sentry is disabled)
  inject('sentry', SentryMock)
  ctx.$sentry = SentryMock
}
