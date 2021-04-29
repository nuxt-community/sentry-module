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

Then, add `@nuxtjs/sentry` to the `modules` section of `nuxt.config.js`:

```js [nuxt.config.js]
{
  modules: [
    '@nuxtjs/sentry'
  ],
  sentry: {
    dsn: '', // Enter your project's DSN here
    // Additional Module Options go here
    // https://sentry.nuxtjs.org/sentry/options
    config: {
      // Add native Sentry config here
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
    },
  }
}
```

## Types

For typescript projects, add `@nuxtjs/sentry` to tsconfig types array

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": [
      "@nuxtjs/sentry"
    ]
  }
}
```

## Configuration

See [Options](/sentry/options) for a list of available options
