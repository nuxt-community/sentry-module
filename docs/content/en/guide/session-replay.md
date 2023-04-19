---
title: Session Replay
description: Record and replay user interactions that lead to an error
position: 24
category: Guide
---

Session Replay helps you get to the root cause of an error or latency issue faster by providing you with a video-like reproduction of what was happening in the user's browser before, during, and after the issue.

### Setup

Session Replay comes as a separate integration that is not enabled by default. To enable it, add `Replay: {}` to the [`clientIntegrations`](/configuration/options#clientintegrations) option like so:

```js [nuxt.config.js]
sentry: {
  dsn: '...',
  clientIntegrations: {
    Replay: {},
  },
  clientConfig: {
    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,
    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: 1.0,
  }
}
```

You can customize integration options by passing them within the `{}` object.

<alert type="info">

  Note that the `replaysSessionSampleRate` and `replaysOnErrorSampleRate` options are part of the global client options and not options of the `Replay` integration itself.

</alert>

<alert type="info">

  Refer to the Sentry documentation below to make sure that Content Security Policy (CSP) is configured properly for allowing `Replay` integration to do its work.

</alert>

### Documentation

See Sentry's [Session Replay](https://docs.sentry.io/platforms/javascript/guides/vue/session-replay/) pages for additional information.
