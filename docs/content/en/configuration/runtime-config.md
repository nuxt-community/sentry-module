---
title: Runtime config
description: "Load Sentry configuration at runtime"
position: 16
category: Configuration
---

<alert type="info">

  This module is for Nuxt 2. For [Nuxt 3+](https://nuxt.com/) support see the official [`@sentry/nuxt` module](https://docs.sentry.io/platforms/javascript/guides/nuxt/).

</alert>

Defining options using the [Nuxt Runtime Config](https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-runtime-config/) functionality allows them to be runtime-based rather than build-time based, as is the case by default.

Currently, only the `config`, `clientConfig` and `serverConfig` [options](/configuration/options) can be configured using the runtime config.

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

You can customize the key that is used to access settings from `publicRuntimeConfig` by setting [`runtimeConfigKey`](/configuration/options#runtimeconfigkey) in the non-runtime options.

This functionality is supported from Nuxt 2.13 and up.
