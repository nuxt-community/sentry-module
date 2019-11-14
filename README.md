# @nuxtjs/sentry

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Circle CI][circle-ci-src]][circle-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![Dependencies][david-dm-src]][david-dm-href]
[![Standard JS][standard-js-src]][standard-js-href]

> Sentry module for Nuxt.js

## Features

The module enables error logging through [Sentry](http://sentry.io).

- **Please note** that version 2.2.0 of this package removed the older `public_key` and `private_key` options, since the updated Sentry packages don't support these anymore.
- **Please note** that version 2.0.0 of this package introduces a breaking change. See [#30](https://github.com/nuxt-community/sentry-module/pull/30) for more information.

## Setup
- Add `@nuxtjs/sentry` dependency using yarn or npm to your project
- Add `@nuxtjs/sentry` to `modules` section of `nuxt.config.js`

```js
{
  modules: [
    '@nuxtjs/sentry',
  ],

  sentry: {
    dsn: '', // Enter your project's DSN here
    config: {}, // Additional config
  }
}
```

### Nuxt compatibility
Versions of NuxtJS before v2.4.0 are **not** supported by this package.

## Usage

Enter your DSN in the NuxtJS config file. Additional config settings can be found [here](https://docs.sentry.io/clients/javascript/config/).

### Usage in Vue component

In a Vue component, `Sentry` is available as `this.$sentry`, so we can call functions like

```
this.$sentry.captureException(new Error('example'))
```

where `this` is a Vue instance.

## Options

Options can be passed using either environment variables or `sentry` section in `nuxt.config.js`.
Normally setting required DSN information would be enough.

### dsn
- Type: `String`
  - Default: `process.env.SENTRY_DSN || false`
  - If no `dsn` is provided, Sentry will be initialised, but errors will not be logged. See [#47](https://github.com/nuxt-community/sentry-module/issues/47) for more information about this.

### disabled
- Type: `Boolean`
  - Default: `process.env.SENTRY_DISABLED || false`
  - Sentry will not be initialised if set to `true`.

### disableClientSide
- Type: `Boolean`
  - Default: `process.env.SENTRY_DISABLE_CLIENT_SIDE || false`

### disableServerSide
- Type: `Boolean`
  - Default: `process.env.SENTRY_DISABLE_SERVER_SIDE || false`

### initialize
- Type: `Boolean`
  - Default: `process.env.SENTRY_INITIALIZE || true`

### publishRelease
- Type: `Boolean`
  - Default: `process.env.SENTRY_PUBLISH_RELEASE || false`
  - See https://docs.sentry.io/workflow/releases for more information

### attachCommits
- Type: `Boolean`
  - Default: `process.env.SENTRY_AUTO_ATTACH_COMMITS || false`
  - Only has effect when `publishRelease = true`

### repo
- Type: `String`
  - Default: `process.env.SENTRY_RELEASE_REPO || false`
  - Only has effect when `publishRelease = true && attachCommits = true`

### disableServerRelease
- Type: `Boolean`
  - Default: `process.env.SENTRY_DISABLE_SERVER_RELEASE || false`
  - See https://docs.sentry.io/workflow/releases for more information

### disableClientRelease
- Type: `Boolean`
  - Default: `process.env.SENTRY_DISABLE_CLIENT_RELEASE || false`
  - See https://docs.sentry.io/workflow/releases for more information

### clientIntegrations
- Type: `Dictionary`
  - Default:
  ```
   {
      Dedupe: {},
      ExtraErrorData: {},
      ReportingObserver: {},
      RewriteFrames: {},
      Vue: {attachProps: true}
   }
  ```
  - See https://docs.sentry.io/platforms/node/pluggable-integrations/ for more information

### serverIntegrations
- Type: `Dictionary`
  - Default:
  ```
    {
      Dedupe: {},
      ExtraErrorData: {},
      RewriteFrames: {},
      Transaction: {}
    }
  ```
  - See https://docs.sentry.io/platforms/node/pluggable-integrations/ for more information

### config
- Type: `Object`
  - Default: `{
    environment: this.options.dev ? 'development' : 'production'
  }`

### serverConfig
- Type: `Object`
  - Default: `{
  }`
  - If specified, values will override config values for server sentry plugin

### clientConfig
- Type: `Object`
  - Default: `{
  }`
  - If specified, values will override config values for client sentry plugin

## Submitting releases to Sentry
Support for the [sentry-webpack-plugin](https://github.com/getsentry/sentry-webpack-plugin) was introduced [#a6cd8d3](https://github.com/nuxt-community/sentry-module/commit/a6cd8d3b983b4c6659e985736b19dc771fe7c9ea). This can be used to send releases to Sentry. Use the publishRelease  option to enable this feature.

Note that releases are only submitted to Sentry when `(options.publishRelease && !isDev)` is true.

## License
[MIT License](./LICENSE)

Copyright (c) Diederik van den Burger <diederik@glue.group>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/dt/@nuxtjs/sentry.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/@nuxtjs/sentry
[npm-downloads-src]: https://img.shields.io/npm/v/@nuxtjs/sentry/latest.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/sentry
[circle-ci-src]: https://img.shields.io/circleci/project/github/nuxt-community/sentry-module.svg?style=flat-square
[circle-ci-href]: https://circleci.com/gh/nuxt-community/sentry-module
[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-community/sentry-module.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/nuxt-community/sentry-module
[david-dm-src]: https://david-dm.org/nuxt-community/sentry-module/status.svg?style=flat-square
[david-dm-href]: https://david-dm.org/nuxt-community/sentry-module
[standard-js-src]: https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square
[standard-js-href]: https://standardjs.com
