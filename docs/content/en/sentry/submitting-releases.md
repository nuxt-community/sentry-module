---
title: Submitting releases to Sentry
menuTitle: Submitting releases
description: 'Submitting releases to Sentry'
position: 7
category: Sentry
---

Support for the [sentry-webpack-plugin](https://github.com/getsentry/sentry-webpack-plugin) was introduced [#a6cd8d3](https://github.com/nuxt-community/sentry-module/commit/a6cd8d3b983b4c6659e985736b19dc771fe7c9ea). This can be used to send releases to Sentry. Use the `publishRelease` option to enable this feature.

Note that releases are only submitted to Sentry when `(options.publishRelease && !isDev)` is true.