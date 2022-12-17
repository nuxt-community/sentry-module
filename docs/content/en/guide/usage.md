---
title: Usage / API
description: 'Usage of Sentry in Nuxt'
position: 3
category: Guide
---

### Automatic Capturing

Once enabled, Sentry automatically reports errors, uncaught exceptions and unhandled rejections. No need for further steps, unless you like to report (certain) exceptions manually or have deactivated integrations like `GlobalError`. In this case, find out below how to send reports manually.

### Enriching Reported Events

Sentry SDK provides API for enhancing events that are being reported. For example, you can:
  - set user information like IP address or username using `Sentry.setUser` API
  - add custom structured data using `Sentry.setContext` API
  - set custom key/value pairs (tags) that get indexed and can be used for filtering and searching using `Sentry.setTag` API
  - add file attachments using `scope.addAttachment` API
  - manually add breadcrumbs using `Sentry.addBreadcrumb` API
  - and other...

Read more about [Enriching Events](https://docs.sentry.io/platforms/javascript/guides/vue/enriching-events/).

### Usage in Vue components

In a Vue component, `Sentry` is available as `this.$sentry`, so we can call functions like

```js
this.$sentry.captureException(new Error('example'))
```

where `this` is a Vue instance.

### Usage in `asyncData`

While using Nuxt's `asyncData` method, there's `$sentry` object in the `context` object:

```js
async asyncData ({ params, $sentry }) {
  try {
    let { data } = await axios.get(`https://my-api/posts/${params.id}`)
    return { title: data.title }
  } catch (error) {
    $sentry.captureException(error)
  }
}
```

### Usage in server middleware

Server Sentry instance is accessible through `process.sentry`.

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
