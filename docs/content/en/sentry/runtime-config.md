---
title: Runtime configuration
description: "Load Sentry configuration at runtime"
position: 5
category: Sentry
---

Define a configuration object at runtime in Nuxt config `publicRuntimeConfig[]` to set the environment at runtime for example.

```js
publicRuntimeConfig: {
  sentry: {
    environment: process.env.SENTRY_ENVIRONMENT
  }
}
```

You can change the key used in `publicRuntimeConfig` by setting `publicRuntimeConfigKey` in the options (see [options](#publicRuntimeConfigKey) for more information).
