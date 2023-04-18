---
title: Performance Monitoring
description: Track performance metrics
position: 23
category: Guide
---

To automatically configure and enable performance monitoring, enable the [tracing](/configuration/options#tracing) option.

This enables various additional integrations for monitoring and instrumentation. On the client-side it enables [`BrowserTracing`](https://docs.sentry.io/platforms/javascript/guides/vue/performance/instrumentation/automatic-instrumentation/) and [`Vue Router Instrumentation`](https://docs.sentry.io/platforms/javascript/guides/vue/configuration/integrations/vue-router/) integrations. On the server-side it enables the [`Http` and `tracingHandler`](https://docs.sentry.io/platforms/node/guides/express/performance/instrumentation/automatic-instrumentation/) integrations for tracing HTTP requests and `connect`/`express` routes.

See the description of the [tracing](/configuration/options#tracing) option if you want to customize some aspect of that functionality like the percentage of requests to capture.

<alert type="info">

  Note that the `tracesSampleRate` value can be between 0.0 and 1.0 (percentage of requests to capture) and Sentry documentation strongly recommends reducing the value from the default 1.0.

</alert>

See also Sentry's SDK [client](https://docs.sentry.io/platforms/javascript/guides/vue/performance/) and [server](https://docs.sentry.io/platforms/node/guides/express/performance/) Performance Monitoring pages for additional information about those integrations.
