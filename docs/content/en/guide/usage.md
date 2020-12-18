---
title: Usage
description: 'Usage of Sentry into Nuxt'
position: 3
category: Guide
---

Enter your DSN in the Nuxt.js config file. Additional config options can be found [here](https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/).

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

### Usage in server middleware

Sentry instance is accessible through the `process.sentry`.

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
