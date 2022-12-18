---
title: Setup
description: 'Setup the sentry module into Nuxt'
position: 2
category: Guide
---

Check the [Nuxt.js documentation](https://nuxtjs.org/guides/configuration-glossary/configuration-modules) for more information about installing and using modules in Nuxt.js.

> Nuxt.js v2.4.0+ is required, earlier versions are not supported

## Installation

Add `@nuxtjs/sentry` dependency to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add @nuxtjs/sentry
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install @nuxtjs/sentry
  ```

  </code-block>
</code-group>

Then, add `@nuxtjs/sentry` to the `modules` section of `nuxt.config.js` and set your unique `dsn` value:

```js [nuxt.config.js]
{
  modules: [
    '@nuxtjs/sentry'
  ],
  sentry: {
    dsn: '', // Enter your project's DSN.
    // Additional Module Options.
    config: {
      // Optional Sentry SDK configuration.
      // Those options are shared by both the Browser and the Server instances.
      // Browser-only and Server-only options should go
      // into `clientConfig` and `serverConfig` objects respectively.
    },
  }
}
```

See [Options](/sentry/options) for a list of available options.

<alert type="info">

  For Typescript or type-checked JavaScript projects, you might have to install the `@sentry/tracing` package even when not using the tracing functionality. In that case, the package can be installed as a dev-only dependency.

</alert>

## Types

In Typescript or type-checked JavaScript projects, add `@nuxtjs/sentry` to the `types` array in `tsconfig.json` to enable module types.

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": [
      "@nuxtjs/sentry"
    ]
  }
}
```
