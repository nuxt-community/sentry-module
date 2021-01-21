---
title: Runtime config
description: "Load Sentry configuration at runtime"
position: 5
category: Sentry
---

Defining options using the [Nuxt Runtime Config](https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-runtime-config/) functionality allows them to be runtime-based rather than build-time based, as is the case by default.

Currently only the `config`, `clientConfig` and `serverConfig` [options](/sentry/options) can be configured using the runtime config.

In the Nuxt configuration file define a `publicRuntimeConfig.sentry` configuration object with settings that will be applied at runtime. For example:

```js [nuxt.config.js]
publicRuntimeConfig: {
  sentry: {
    config: {
      environment: process.env.SENTRY_ENVIRONMENT
    },
    serverConfig: {
      // Any server-specific config
    },
    clientConfig: {
      // Any client-specific config
    }
  }
}
```

You can customize the key that is used to access settings from `publicRuntimeConfig` by setting [`runtimeConfigKey`](/sentry/options#runtimeconfigkey) in the non-runtime options.
