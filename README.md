# @nuxtjs/sentry
[![npm (scoped with tag)](https://img.shields.io/npm/v/@nuxtjs/sentry/latest.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/sentry)
[![npm](https://img.shields.io/npm/dt/@nuxtjs/sentry.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/sentry)
[![CircleCI](https://img.shields.io/circleci/project/github/nuxt-community/sentry-module.svg?style=flat-square)](https://circleci.com/gh/nuxt-community/sentry-module)
[![Codecov](https://img.shields.io/codecov/c/github/nuxt-community/sentry-module.svg?style=flat-square)](https://codecov.io/gh/nuxt-community/sentry-module)
[![Dependencies](https://david-dm.org/nuxt-community/sentry-module/status.svg?style=flat-square)](https://david-dm.org/nuxt-community/sentry-module)
[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

> Sentry module for Nuxt.js

## Features

The module enables error logging through [Sentry](http://sentry.io).

## Setup
- Add `@nuxtjs/sentry` dependency using yarn or npm to your project
- Add `@nuxtjs/sentry` to `modules` section of `nuxt.config.js`

```js
{
  modules: [
    '@nuxtjs/sentry',
  ],

  sentry: {
      public_key: '',
      private_key: '',
      project_id: '',
      config: {
        // Additional config
      },
    }
}
```

### Nuxt compatibility
Make sure you use a version of Nuxt either *prior* to v1.0.0 or *after* v1.2.1.

## Usage

Enter your DSN in the NuxtJS config file. Additional config settings can be found [here](https://docs.sentry.io/clients/javascript/config/).

### Usage in Vue component

In a Vue component, `Raven` is available as `this.$raven`, so we can call functions like

```
this.$raven.setUserContext({user})
```

where this is a Vue instance.

## Options

Options can be passed using either environment variables or `sentry` section in `nuxt.config.js`. 
Normally setting required DSN information would be enough.

### dsn
- Type: `String`
  - Default: `process.env.SENTRY_DSN`

### public_dsn
- Type: `String`
  - Default: `process.env.SENTRY_PUBLIC_DSN`

If value omitted it will be generated using `dsn` value, by removing private key part.

### public_key
- Type: `String`
  - Default: `process.env.SENTRY_PUBLIC_KEY`

Will be ignored if `dsn` provided.

### private_key
- Type: `String`
  - Default: `process.env.SENTRY_PRIVATE_KEY`

Will be ignored if `dsn` provided.

### host
- Type: `String`
  - Default: `process.env.SENTRY_HOST || 'sentry.io'`

Will be ignored if `dsn` provided.
### protocol
- Type: `String`
  - Default: `process.env.SENTRY_PROTOCOL || 'https'`

Will be ignored if `dsn` provided.

### project_Id
- Type: `String`
  - Default: `process.env.SENTRY_PROJECT_ID || ''`

Will be ignored if `dsn` provided.
### path
- Type: `String`
  - Default: `process.env.SENTRY_PATH || '/'`

Will be ignored if `dsn` provided.

### disableClientSide
- Type: `Boolean`
  - Default: `process.env.SENTRY_DISABLE_CLIENT_SIDE || false`

## License

[MIT License](./LICENSE)

Copyright (c) Diederik van den Burger <diederik@webrelated.nl>

