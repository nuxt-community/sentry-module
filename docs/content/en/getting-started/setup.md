---
title: Setup
description: 'Setup the sentry module into Nuxt'
position: 10
category: Getting Started
---

Check the [Nuxt.js documentation](https://nuxtjs.org/guides/configuration-glossary/configuration-modules) for more information about installing and using modules in Nuxt.js.

> Nuxt.js v2.16.0+ is required, earlier versions are not supported.

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
    // Additional module options go here.
  }
}
```

See [Options](/configuration/options) for a list of available options.

Note that the Sentry SDK dependencies (`@sentry/*`) are not pinned and can be updated independently from the module itself by running `npm upgrade @nuxtjs/sentry` or `yarn upgrade @nuxtjs/sentry`. That means you don't have to wait for a new module release if you want to update to the latest SDK version.

## Types

In Typescript or type-checked JavaScript projects, add `@nuxtjs/sentry` to the `types` array in `tsconfig.json` to enable module types.

```json [tsconfig.json]
{
  "compilerOptions": {
    // ...
    "types": [
      "@nuxtjs/sentry"
    ]
  }
}
```

<alert type="info">

  The otherwise optional package `@sentry/webpack-plugin@2` has to be installed for types to be fully working.

  If not using the relevant functionality (`publishRelease` option is not enabled) then this package can be installed as dev-only dependency.

</alert>
