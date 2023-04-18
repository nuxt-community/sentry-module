---
title: Options
description: 'Options can be passed to Sentry using either environment variables'
position: 15
category: Configuration
---

Options can be passed using either:
 - environment variables
 - `sentry` object in `nuxt.config.js`
 - when registering the module: `modules: [['@nuxtjs/sentry', {/*options*/}]]`

The `config`, `serverConfig` and `clientConfig` options can also be configured using [Runtime Config](/configuration/runtime-config).

The `dsn` is the only option that is required to enable Sentry reporting.

### dsn

- Type: `String`
- Default: `process.env.SENTRY_DSN || ''`
- If no `dsn` is provided then Sentry will be initialized using mocked instance to prevent the code that references `$sentry` from crashing. No errors will be reported using that mocked instance.

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
- Options:
  - **injectMock**
    - Type: `Boolean`
    - Default: `true`
    - Whether a Sentry mock needs to be injected that captures any calls to `$sentry` API methods while Sentry has not yet loaded. Captured API method calls are executed once Sentry is loaded
    > When `injectMock: true` this module will also add a window.onerror listener. If errors are captured before Sentry has loaded then these will be reported once Sentry has loaded using sentry.captureException
    ```js [pages/index.vue]
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
    ```js [layouts/default.vue]
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
    - Which API methods from `@sentry/vue` should be mocked. You can use this to only mock methods you really use.
    - This option is ignored when `injectMock: false`
    - If `mockApiMethods: true` then all available API methods will be mocked
    > If `injectMock: true` then _captureException_ will always be mocked for use with the window.onerror listener
    ```js [nuxt.config.js]
    sentry: {
      lazy: {
        mockApiMethods: ['captureMessage']
      }
    }
    ```

    ```js [pages/index.vue]
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

### runtimeConfigKey

- Type: `String`
- Default: `sentry`
- Specified object in Nuxt config in `publicRuntimeConfig[runtimeConfigKey]` will override some options at runtime. See documentation at https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-runtime-config/
- Used to define the environment at runtime for example
- See also [Runtime Config](/configuration/runtime-config) documentation.

### disabled

- Type: `Boolean`
- Default: `process.env.SENTRY_DISABLED || false`
- Sentry will not be initialized if set to `true`.

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

<alert type="info">

  `@sentry/webpack-plugin` package must be installed manually as a dev dependency to be able to publish releases.

</alert>

- Type: `Boolean` or [`WebpackPluginOptions`](https://github.com/getsentry/sentry-webpack-plugin)
- Default: `process.env.SENTRY_PUBLISH_RELEASE || false`
- Enables Sentry releases for better debugging using source maps. Uses [@sentry/webpack-plugin](https://github.com/getsentry/sentry-webpack-plugin).
- Publishing releases requires the organization slug, project name and the Sentry authentication token to be provided. Those can be provided either via the `WebpackPluginOptions` object or [environment variables or a properties file](https://docs.sentry.io/product/cli/configuration/#sentry-cli-working-with-projects). So for example, when using the options object, you'd set `authToken`, `org` and `project` options, and when using the environment variables you'd set `SENTRY_AUTH_TOKEN`, `SENTRY_ORG` and `SENTRY_PROJECT`.
- It's recommended to pass a configuration object to this option rather than using the boolean `true`. When using the boolean, you have to provide the required options through other means mentioned above.
- The releases are only published when this option is enabled and at the same time you are NOT running in development (`nuxt dev`) mode.
- See https://docs.sentry.io/workflow/releases for more information. Note that the Sentry CLI options mentioned in the documentation typically have a [@sentry/webpack-plugin](https://github.com/getsentry/sentry-webpack-plugin) equivalent.

Example configuration:

```js
sentry: {
  // ...
  publishRelease: {
    authToken: '<token>',
    org: 'MyCompany',
    project: 'my-project',
    // Attach commits to the release (requires that the build triggered within a git repository).
    setCommits: {
      auto: true
    }
  }
}
```

Note that the module sets the following defaults when publishing is enabled:

```js
{
  include: [], // automatically set at publishing time to relevant paths for the bundles that were built
  ignore: [
    'node_modules',
    '.nuxt/dist/client/img'
  ],
  configFile: '.sentryclirc',
  release: '',  // defaults to the value of "config.release" which can either be set manually or is determined automatically through `@sentry/cli`
}
```

- Providing custom values for `include` or `ignore` will result in provided values getting appended to default values.

### sourceMapStyle

- Type: `String`
- Default: `source-map`
- Only has effect when `publishRelease` is enabled
- The type of source maps generated when publishing release to Sentry. See https://webpack.js.org/configuration/devtool for a list of available options
- **Note**: Consider using `hidden-source-map` instead. For most people, that should be a better option but due to it being a breaking change, it won't be set as the default until next major release

### disableServerRelease

- Type: `Boolean`
- Default: `process.env.SENTRY_DISABLE_SERVER_RELEASE || false`
- Only has effect when `publishRelease` is enabled
- See https://docs.sentry.io/workflow/releases for more information

### disableClientRelease

- Type: `Boolean`
- Default: `process.env.SENTRY_DISABLE_CLIENT_RELEASE || false`
- Only has effect when `publishRelease` is enabled
- See https://docs.sentry.io/workflow/releases for more information

### clientIntegrations

- Type: `Object`
- Default:
  ```js
  {
    ExtraErrorData: {},
    ReportingObserver: {},
    RewriteFrames: {},
  }
  ```
- Sentry by default also enables the following browser integrations: `Breadcrumbs`, `Dedupe`, `FunctionToString`, `GlobalHandlers`, `HttpContext`, `InboundFilters`, `LinkedErrors`, `TryCatch`.
- When `tracing` option is enabled then the [Vue Router Instrumentation](https://docs.sentry.io/platforms/javascript/guides/vue/configuration/integrations/vue-router/) is also enabled.
- The full list of client integrations that are supported: `Breadcrumbs`, `CaptureConsole`, `Debug`, `Dedupe`, `ExtraErrorData`, `FunctionToString`, `GlobalHandlers`, `HttpClient`, `HttpContext`, `InboundFilters`, `LinkedErrors`, `Reply`, `ReportingObserver`, `RewriteFrames`, `TryCatch`.
- Integration options can be specified in the object value corresponding to the individual integration key.
- To disable integration that is enabled by default, pass `false` as a value. For example to disable `ExtraErrorData` integration (only) set the option to:
  ```js
  {
    ExtraErrorData: false,
    ReportingObserver: {},
    RewriteFrames: {},
  }
  ```
- See also [Sentry Browser Integrations](https://docs.sentry.io/platforms/javascript/guides/vue/configuration/integrations/) for more information on configuring each integration.

### serverIntegrations

- Type: `Object`
- Default:
  ```js
  {
    Dedupe: {},
    ExtraErrorData: {},
    RewriteFrames: {},
    Transaction: {},
  }
  ```
- Sentry by default enables the following server integrations: `Console`, `ContextLines`, `Context`, `FunctionToString`, `Http`,  `InboundFilters`, `LinkedErrors`, `Modules`,`OnUncaughtException`, `OnUnhandledRejection`, `RequestData`.
- The full list of server integrations that are supported includes the ones above plus: `CaptureConsole`, `Debug`, `Dedupe`, `ExtraErrorData`, `RewriteFrames`, `Transaction`.
- Integration options can be specified in the object value corresponding to the individual integration key.
- To disable integration that is enabled by default, pass `false` as a value. For example to disable `ExtraErrorData` integration (only) set the option to:
  ```js
  {
    Dedupe: {},
    ExtraErrorData: false,
    RewriteFrames: {},
    Transaction: {},
  }
  ```
- See also [Sentry Server Integrations](https://docs.sentry.io/platforms/node/configuration/integrations/) for more information on configuring each integration.

### customClientIntegrations

- Type: `String`
- Default: `undefined`
- This option gives the flexibility to register any custom integration that is not handled internally by the `clientIntegrations` option.
- The value needs to be a file path (can include [webpack aliases](https://nuxtjs.org/docs/2.x/directory-structure/assets#aliases)) pointing to a javascript file that exports a function returning an array of initialized integrations. The function will be passed a `context` argument which is the Nuxt Context.

For example:
```js
import SentryRRWeb from '@sentry/rrweb'

export default function (context) {
  return [new SentryRRWeb()]
}
```

### customServerIntegrations

- Type: `String`
- Default: `undefined`
- This option gives the flexibility to register any custom integration that is not handled internally by the `serverIntegrations` option.
- The value needs to be a file path (can include [webpack aliases](https://nuxtjs.org/docs/2.x/directory-structure/assets#aliases)) pointing to a javascript file that exports a function returning an array of initialized integrations.

For example:
```js
import MyAwesomeIntegration from 'my-awesome-integration'

export default function () {
  return [new MyAwesomeIntegration()]
}
```

### tracing

- Type: `Boolean` or `Object`
- Default: `false`

- Enables Sentry Performance Monitoring on the [server](https://docs.sentry.io/platforms/node/guides/express/performance/) and [browser](https://docs.sentry.io/platforms/javascript/guides/vue/performance/) side.
- Takes the following object configuration format (default values shown):
  ```js
  {
    tracesSampleRate: 1.0,
    browserTracing: {},
    vueOptions: {
      trackComponents: true,
    },
  }
  ```
- On the browser side the `BrowserTracing` integration is enabled by default and adds automatic instrumentation for monitoring the performance of the application. The [Vue Router Integration](https://docs.sentry.io/platforms/javascript/guides/vue/configuration/integrations/vue-router/) is also automatically enabled. See all available [`BrowserTracing` options](https://docs.sentry.io/platforms/javascript/guides/vue/performance/instrumentation/automatic-instrumentation/).
- On the browser side extra options for [Tracking Vue components](https://docs.sentry.io/platforms/javascript/guides/vue/features/component-tracking/) can be passed through the `vueOptions` object.
- On the server side the `Http` integration is enabled to trace HTTP requests and [tracingHandler](https://docs.sentry.io/platforms/node/guides/express/performance/) is enabled to trace `connect` and `express` routes.
- See also the [Performance Monitoring](/guide/performance) section for more information.

<alert type="info">

  The `tracesSampleRate` value can be between 0.0 and 1.0 (percentage of requests to capture) and Sentry documentation strongly recommends reducing the value from the default 1.0.

</alert>

### config

- Type: `Object`
- Default:
  ```js
  {
    environment: this.options.dev ? 'development' : 'production'
  }
  ```
- Additional options to pass to the Sentry SDK common to the Server and the Browser SDKs and which are passed to `Sentry.init()`. See Sentry's documentation for [Basic Browser Options](https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/) and [Basic Server Options](https://docs.sentry.io/platforms/node/configuration/options/).
- If you need to pass options only to the client or the server SDK instance then use `clientConfig` and `serverConfig` respectively.
- Note that `config.dsn` is automatically set based on the root `dsn` option.
- The value for `config.release` is automatically inferred from the local repo unless specified manually.
- Do not set `config.integrations`, use `clientIntegrations` and `serverIntegrations` options instead.

### serverConfig

- Type: `Object` or `String`
- Default: `{}`
- Sentry SDK [Basic Server Options](https://docs.sentry.io/platforms/node/configuration/options/).
- The specified keys will override common options set in the `config` key.
- The value can be a string in which case it needs to be a file path (can use [webpack aliases](https://nuxtjs.org/docs/2.x/directory-structure/assets#aliases)) pointing to a javascript file whose default export (a function) returns the configuration object. This is necessary in case some of the options rely on imported values or can't be serialized. The function can be `async`. An artificial example that switches out the `transport`:
  ```js [nuxt.config.js]
  sentry: {
    dsn: '...',
    serverConfig: '~/config/sentry-server-config.js',
  }
  ```
  ```js [~/config/sentry-server-config.js]
  import { makeNodeTransport } from '@sentry/node'

  export default function() {
    return {
      transport: makeNodeTransport,
    }
  }
  ```

### clientConfig

- Type: `Object` or `String`
- Default: `{}`
- Sentry SDK [Basic Browser Options](https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/).
- The specified keys will override common options set in the `config` key.
- The value can be a string in which case it needs to be a file path (can use [webpack aliases](https://nuxtjs.org/docs/2.x/directory-structure/assets#aliases)) pointing to a javascript file whose default export (a function) returns the configuration object. This is necessary in case some of the options rely on imported values or can't be serialized. The function is passed a `Nuxt Context` argument and can be `async`.
- See an example usage on the [User Feedback](/guide/user-feedback) page.

### requestHandlerConfig

- Type: `Object`
- Default: `{}`
- Options passed to `requestHandler` in `@sentry/node`. See: https://docs.sentry.io/platforms/node/guides/express/
