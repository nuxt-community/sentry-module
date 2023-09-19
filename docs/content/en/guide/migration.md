---
title: Migration guide
description: Follow this guide to upgrade from one major version to the other.
position: 29
category: Guide
---

Follow this guide to upgrade from one major version to the other.

## Upgrading from v7 to v8

Breaking changes only affect the `publishRelease` and the (related to `publishRelease`) `sourceMapStyle` option.

When using the `publishRelease` option, the `@sentry/webpack-plugin` package needs to be updated from version 1.x to 2.x.

The options supported by the `publishRelease` object have also changed slightly:
 - `configFile`, `dryRun`, `include`, `sourcemap` and `urlPrefix` options are no longer supported.
 - `setCommits` option moved to `release.setCommits`
 - `errorHandler` option signature has changed - see https://sentry.nuxtjs.org/guide/releases

The default value of the `sourceMapStyle` option has changed from `source-map` to `hidden-source-map` since the new version of the webpack plugin can handle source maps without having to reference them directly in the source files.

You can also check the [`@sentry/webpack-plugin` official migration guide](https://github.com/getsentry/sentry-javascript-bundler-plugins/blob/main/MIGRATION.md#upgrading-to-2x) for more information although not everything mentioned there applies to this module.

## Upgrading from v6 to v7

Sentry SDK dependencies updated from v6 to v7. Please read about breaking changes in Sentry SDK's [Upgrading from v6.x to v7.x](https://github.com/getsentry/sentry-javascript/blob/master/MIGRATION.md#upgrading-from-6x-to-7x) document.

Some of the breaking changes listed in that document are automatically handled by the module and don't need any action. Other notable changes that might require action are:

  - The `@sentry/tracing` dependency should be uninstalled, regardless whether `tracing` option is used or not.
  - The `whitelistUrls` and `blacklistUrls` Sentry `config` (or `clientConfig` / `serverConfig`) options have been renamed to `allowUrls` and `denyUrls`.
  - The `Vue` integration was removed as is now merged into the Sentry Browser SDK. If you have been passing custom `Vue` options through the `clientIntegrations.Vue` object then those can now be merged directly into the `clientConfig` option (without the parent `Vue` key).
  - The `UserAgent` integration was renamed to `HttpContext`. If you have been passing custom configuration to that integration through `clientIntegrations` option then you should rename the key.
