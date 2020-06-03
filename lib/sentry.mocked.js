import * as Sentry from '@sentry/browser'

<% if (options.logMockCalls) { %>
function createMockFunction (key) {
  return (...params) => {
    // eslint-disable-next-line no-console
    console.warn(`$sentry.${key}() called, but sentry plugin is disabled. Arguments:`, params)
  }
}
<% } else { %>
function noop () {}
<% } %>

/** @type {import('@nuxt/types').Plugin} */
export default function (ctx, inject) {
  const sentryMock = {}

  for (const [key, value] of Object.entries(Sentry)) {
    if (typeof value === 'function') {
      sentryMock[key] = <% if (options.logMockCalls) { %> createMockFunction(key) <% } else { %> noop <% } %>
    }
  }

  // Inject mocked sentry to the context as $sentry (this is used in case sentry is disabled)
  inject('sentry', sentryMock)
  ctx.$sentry = sentryMock
}
