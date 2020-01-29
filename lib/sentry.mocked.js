export default function (ctx, inject) {
  const handler = {
    get () {
      return (...params) => {
        console.warn(`$sentry.${arguments[1]} called, but sentry plugin is disabled`, params)
      }
    }
  }

  const sentryProxy = new Proxy({}, handler)

  // Inject mocked sentry to the context as $sentry (this is used in case sentry is disabled)
  inject('sentry', sentryProxy)
  ctx.$sentry = sentryProxy
}
