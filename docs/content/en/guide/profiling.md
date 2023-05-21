---
title: Profiling
description: Node profiling enhances tracing by providing profiles for individual transactions
position: 25
category: Guide
---

Node profiling can be enabled through an integration provided by the `@sentry/profiling-node` dependency that does not come with this module by default.

### Setup

Install required dependency:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add @sentry/profiling-node
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install @sentry/profiling-node
  ```

  </code-block>
</code-group>

Include the following options in the module's configuration:

```js [nuxt.config.js]
sentry: {
  dsn: '...',
  tracing: {
    tracesSampleRate: 1.0,
  },
  serverIntegrations: {
    ProfilingIntegration: {},
  },
  serverConfig: {
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  },
}
```

<alert type="info">

  Note that the `tracesSampleRate` value can be between 0.0 and 1.0 (percentage of requests to capture) and Sentry documentation strongly recommends reducing the value from the default 1.0.

</alert>

### Documentation

See Sentry's [Profiling](https://docs.sentry.io/platforms/node/profiling/) pages for additional information.
