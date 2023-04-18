---
title: User Feedback
description: A feedback dialog for providing additional user information
position: 25
category: Guide
---

When a user experiences an error, Sentry provides the ability to collect additional feedback through a feedback dialog.

### Setup

`showReportDialog` is a function that should be called to trigger the User Feedback dialog. Due to how Nuxt works, we can't reference it directly from within Nuxt config as Sentry configuration is strinigified and the function reference does not survive that. We have to use the `clientConfig` option with a path to a custom client configuration that imports the function like so:

```js [nuxt.config.js]
sentry: {
  dsn: '...',
  clientConfig: '~/config/sentry-client-config.js',
}
```

```js [~/config/sentry-client-config.js]
import { showReportDialog } from '@sentry/vue'

export default function(context) {
  return {
    beforeSend (event, hint) {
      if (event.exception) {
        showReportDialog({ eventId: event.event_id })
      }
      return event
    },
  }
}
```

<alert type="info">

  The configuration provided through `clientConfig` is merged with the configuration provided in the Nuxt config so other configuration options can (but don't have to) be defined in Nuxt config.

</alert>

### Documentation

See Sentry's [User Feedback](https://docs.sentry.io/platforms/javascript/guides/vue/enriching-events/user-feedback/) pages for additional information.
