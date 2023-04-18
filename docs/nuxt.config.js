import theme from '@nuxt/content-theme-docs'

export default theme({
  docs: {
    primaryColor: '#ae9dff',
  },
  modules: [
    '@nuxtjs/redirect-module',
  ],
  redirect: {
    onDecodeError: (_error, _req, _res, next) => next(),
    rules: [
      {
        from: '^/guide/setup',
        to: '/getting-started/setup',
        statusCode: 301,
      },
      {
        from: '^/sentry/lazy-loading',
        to: '/getting-started/lazy-loading',
        statusCode: 301,
      },
      {
        from: '^/sentry/options',
        to: '/configuration/options',
        statusCode: 301,
      },
      {
        from: '^/sentry/runtime-config',
        to: '/configuration/runtime-config',
        statusCode: 301,
      },
    ],
  },
})
