---
title: Enriching Events
description: Enriching Reported Events
position: 21
category: Guide
---

Sentry SDK provides API for enhancing events that are being reported. For example, you can:
  - set user information like IP address or username using `Sentry.setUser` API
  - add custom structured data using `Sentry.setContext` API
  - set custom key/value pairs (tags) that get indexed and can be used for filtering and searching using `Sentry.setTag` API
  - add file attachments using `scope.addAttachment` API
  - manually add breadcrumbs using `Sentry.addBreadcrumb` API
  - and other...

Read more about [Enriching Events](https://docs.sentry.io/platforms/javascript/guides/vue/enriching-events/).
