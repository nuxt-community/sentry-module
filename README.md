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
    ['@nuxtjs/sentry', {
      public_key: '',
      private_key: '',
      project_id: '',
      config: {
        environment: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
        // Additional config
      },
    }],
 ]
}
```

## Usage

Enter your DSN in the NuxtJS config file. Additional config settings can be found [here](https://docs.sentry.io/clients/javascript/config/).

## License

[MIT License](./LICENSE)

Copyright (c) Diederik van den Burger <diederik@webrelated.nl>
