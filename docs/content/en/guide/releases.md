---
title: Releases
description: Creating and publishing Releases
position: 24
category: Guide
---

> Notifying Sentry of a release enables auto discovery of which commits to associate with a release and identifies what we consider "the most recent release" when searching in sentry.io.
>
> See Sentry's [Releases](https://docs.sentry.io/product/releases/) for additional information.


## Setup

Follow the following steps to create and publish releases to Sentry.

1. Install the `@sentry/webpack-plugin@2` package as a dev dependency.
2. Enable the [publishRelease](/configuration/options#publishrelease) option. Follow the link for mode detailed explanation of available options.

<alert type="info">

  Releases will only be published during `nuxt build`.

</alert>

## Error handling

On error during publishing, the build will be interrupted. If you would instead want to ignore errors during publishing, you can modify the behavior by customizing the `publishRelease.errorHandler` option. For example, the following configuration will post a warning to the console instead of interrupting the build:

```js
{
    sentry: {
        publishRelease: {
            // other options...
            errorHandler(error) {
                console.error(`Sentry Release Error: ${error.message}`);
            },
        },
    }
}
```
