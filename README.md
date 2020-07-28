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

> Nuxt.js v2.4.0+ is required, earlier versions are not supported

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
## Configure

See [Options](#options) for a list of available options

## Usage

Enter your DSN in the Nuxt.js config file. Additional config settings can be found [here](https://docs.sentry.io/error-reporting/configuration/?platform=browser).

### Usage in Vue components

In a Vue component, `Sentry` is available as `this.$sentry`, so we can call functions like

``` js
this.$sentry.captureException(new Error('example'))
```

where `this` is a Vue instance.

### Usage in `asyncData`

While using Nuxt's `asyncData` method, there's `$sentry` object in the `context`:

``` js
async asyncData ({ params, $sentry }) {
  try {
    let { data } = await axios.get(`https://my-api/posts/${params.id}`)
    return { title: data.title }
  } catch (error) {
    $sentry.captureException(error)
  }
}
```

### Usage in other lifecycle areas

For the other special Nuxt lifecycle areas like `plugins`, `middleware`, and `nuxtServerInit`, the `$sentry` object is also accessible through the `context` object like so:

```js
async nuxtServerInit({ commit }, { $sentry }) {
  try {
    let { data } = await axios.get(`https://my-api/timestamp`)
    commit('setTimeStamp', data)
  } catch (error) {
    $sentry.captureException(error)
  }
}
```

## Lazy Loading (on the client)

> :warning: Please be aware that lazy loading could prevent some errors from being reported

Set `lazy: true` in your module options to load Sentry lazily on the client. This will prevent Sentry from being included in your main bundle **but could result in some errors not being reported**.

You can also pass a lazy config object in your module options (see [options](#lazy) for more information).

### Injected properties

#### `$sentry` (mocked)
- Type: `Object`

Normally `$sentry` would always refer to the `@sentry/browser` API. But if we lazy load Sentry this API wont be available until Sentry has loaded. If you don't want to worry about whether Sentry is loaded or not, a mocked Sentry API is injected into the Nuxt.js context that will execute all Sentry API calls once Sentry is loaded

See: `injectMock` and `mockApiMethods` options below

#### `$sentryReady`
- Type `Function`

This method returns a Promise which will be resolved once Sentry has been loaded. You could use this instead of mocking `$sentry`.

Example usage:
```js
this.$sentryReady().then((sentry) => sentry.captureMessage('Erreur!'))
// or
(await this.$sentryReady()).captureMessage('Erreur!')
```

#### `$sentryLoad`
- Type: `Function`

> Only injected when `injectLoadHook: true`.

The callback you need to call to indicate that you are ready to load Sentry.

Example usage:
```js
  // layouts/default.vue
  ...
  mounted() {
    // This will only load sentry once an error was thrown
    // To prevent a chicken & egg issue, make sure to also
    // set injectMock: true if you use this so the error
    // that triggered the load will also be captured
    this.errorListener = () => {
      this.$sentryLoad()
      window.removeEventListener('error', errorListener)
    }
    window.addEventListener('error', errorListener)
  },
  destroyed() {
    window.removeEventListener('error', this.errorListener)
  }
```

## Options

Options can be passed using either environment variables or `sentry` section in `nuxt.config.js`.
Normally, setting required DSN information would be enough.

### dsn
- Type: `String`
  - Default: `process.env.SENTRY_DSN || ''`
  - If no `dsn` is provided, Sentry will be initialised, but errors will not be logged. See [#47](https://github.com/nuxt-community/sentry-module/issues/47) for more information about this.

### lazy
- Type: `Boolean` or `Object`
  - Default: `false`
  - Load Sentry lazily so it's not included in your main bundle
  - If `true` then the default options will be used:
  ```js
    {
      injectMock: true,
      injectLoadHook: false,
      mockApiMethods: true,
      chunkName: 'sentry',
      webpackPrefetch: false,
      webpackPreload: false
    }
  ```
    - **injectMock**
      - Type: `Boolean`
        - Default: `true`
        - Whether a Sentry mock needs to be injected that captures any calls to `$sentry` API methods while Sentry has not yet loaded. Captured API method calls are executed once Sentry is loaded
      > When `injectMock: true` this module will also add a window.onerror listener. If errors are captured before Sentry has loaded then these will be reported once Sentry has loaded using sentry.captureException
        ```js
        // pages/index.vue
        beforeMount() {
          // onNuxtReady is called _after_ the Nuxt.js app is fully mounted,
          // so Sentry is not yet loaded when beforeMount is called
          // But when you set injectMock: true this call will be captured
          // and executed after Sentry has loaded
          this.$sentry.captureMessage('Hello!')
        },
        ```

    - **injectLoadHook**
      - Type: `Boolean`
        - Default: `false`
        - By default Sentry will be lazy loaded once `window.onNuxtReady` is called. If you want to explicitly control when Sentry will be loaded you can set `injectLoadHook: true`. The module will inject a `$sentryLoad` method into the Nuxt.js context which you need to call once you are ready to load Sentry
        ```js
        // layouts/default.vue
        ...
        mounted() {
          // Only load Sentry after initial page has fully loaded
          // (this example should behave similar to using window.onNuxtReady though)
          this.$nextTick(() => this.$sentryLoad())
        }
        ```

    - **mockApiMethods**
      - Type: `Boolean` or `Array`
        - Default `true`
        - Which API methods from `@sentry/browser` should be mocked. You can use this to only mock methods you really use.
        - This option is ignored when `injectMock: false`
        - If `mockApiMethods: true` then all available API methods will be mocked
        > If `injectMock: true` then _captureException_ will always be mocked for use with the window.onerror listener
        ```js
        // nuxt.config.js
        sentry: {
          lazy: {
            mockApiMethods: ['captureMessage']
          }
        }

        // pages/index.vue
        mounted() {
          this.$sentry.captureMessage('This works!')

          this.$sentry.captureEvent({
            message: `
              This will throw an error because
              captureEvent doesn't exists on the mock
            `
          })

          // To circumvent this problem you could use $sentryReady
          (await this.$sentryReady()).captureEvent({
            message: `
              This will not throw an error because
              captureEvent is only executed after
              Sentry has been loaded
            `
          })
        }
        ```

    - **chunkName**
      - Type: `String`
        - Default: `'sentry'`
        - The _webpackChunkName_  to use, see [Webpack Magic Comments](https://webpack.js.org/API/module-methods/#magic-comments)

    - **webpackPrefetch**
      - Type: `Boolean`
        - Default: `false`
        - Whether the Sentry chunk should be prefetched

    - **webpackPreload**
      - Type: `Boolean`
        - Default: `false`
        - Whether the Sentry chunk should be preloaded

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
  - Can be used to add the `$sentry` object without initializing it, which will result in not reporting errors to Sentry when they happen but not crashing on calling the Sentry APIs.

### logMockCalls
- Type: `Boolean`
  - Default: `true`
  - Whether to log calls to the mocked `$sentry` object in the console
  - Only applies when mocked instance is used (when `disabled`, `disableClientSide` or `disableServerSide` is `true`)

### publishRelease
- Type: `Boolean`
  - Default: `process.env.SENTRY_PUBLISH_RELEASE || false`
  - See https://docs.sentry.io/workflow/releases for more information

### sourceMapStyle
- Type: `String`
  - Default: `source-map`
  - Only has effect when `publishRelease = true`
  - The type of source maps generated when publishing release to Sentry. See https://webpack.js.org/configuration/devtool for a list of available options
  - **Note**: Consider using `hidden-source-map` instead. For most people, that should be a better option but due to it being a breaking change, it won't be set as the default until next major release

### attachCommits
- Type: `Boolean`
  - Default: `process.env.SENTRY_AUTO_ATTACH_COMMITS || false`
  - Only has effect when `publishRelease = true`

### repo
- Type: `String`
  - Default: `process.env.SENTRY_RELEASE_REPO || ''`
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
  ``` js
   {
      Dedupe: {},
      ExtraErrorData: {},
      ReportingObserver: {},
      RewriteFrames: {},
      Vue: {attachProps: true, logErrors: this.options.dev}
   }
  ```
  - See https://docs.sentry.io/platforms/javascript/vue/ and  https://docs.sentry.io/platforms/node/pluggable-integrations/ for more information on configuring integrations

### serverIntegrations
- Type: `Dictionary`
  - Default:
  ``` js
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
  - Sentry options common to the server and client that are passed to `Sentry.init(options)`. See Sentry documentation at https://docs.sentry.io/error-reporting/configuration/?platform=browsernpm
  - Note that `config.dsn` is automatically set based on the root `dsn` option
  - The value for `config.release` is automatically inferred from the local repo unless specified manually

### serverConfig
- Type: `Object`
  - Default: `{
  }`
  - Specified key will override common Sentry options for server sentry plugin

### clientConfig
- Type: `Object`
  - Default: `{
  }`
  - Specified keys will override common Sentry options for client sentry plugin

### webpackConfig
- Type: `Object`
  - Default: Refer to `module.js` since defaults include various options that also change dynamically based on other options.
  - Options passed to `@sentry/webpack-plugin`. See documentation at https://github.com/getsentry/sentry-webpack-plugin/blob/master/README.md

## Submitting releases to Sentry
Support for the [sentry-webpack-plugin](https://github.com/getsentry/sentry-webpack-plugin) was introduced [#a6cd8d3](https://github.com/nuxt-community/sentry-module/commit/a6cd8d3b983b4c6659e985736b19dc771fe7c9ea). This can be used to send releases to Sentry. Use the publishRelease  option to enable this feature.

Note that releases are only submitted to Sentry when `(options.publishRelease && !isDev)` is true.

## License
[MIT License](./LICENSE)

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
