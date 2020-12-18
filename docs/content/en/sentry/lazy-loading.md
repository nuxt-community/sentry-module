---
title: Lazy-Loading (client-side)
description: 'Load Sentry module lazily on the client'
position: 4
category: Sentry
---

<alert type="warning">

  Please be aware that lazy loading could prevent some errors from being reported

</alert>

Set `lazy: true` in your module options to load Sentry lazily on the client. This will prevent Sentry from being included in your main bundle **but could result in some errors not being reported**.

You can also pass a lazy config object in your module options (see [options](/sentry/options#lazy) for more information).

### Injected properties

#### `$sentry` (mocked)
- Type: `Object`

Normally `$sentry` would always refer to the `@sentry/browser` API. But if we lazy load Sentry this API wont be available until Sentry has loaded. If you don't want to worry about whether Sentry is loaded or not, a mocked Sentry API is injected into the Nuxt.js context that will execute all Sentry API calls once Sentry is loaded

See: [`injectMock`](/sentry/options#lazy) and [`mockApiMethods`](/sentry/options#lazy) options.

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

```js [layouts/default.vue]
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
