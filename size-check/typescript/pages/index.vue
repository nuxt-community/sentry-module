<template>
  <div>
    <h3>Server-side</h3>
    <span id="server-side">{{ serverSentryPresent ? 'Works!' : '$sentry object is missing!' }}</span>
    <h3>Client-side</h3>
    <span id="client-side">{{ clientSentryPresent ? 'Works!' : '$sentry object is missing!' }}</span>
    <p>
      <button id="crash-button" @click="crash_me()">
        crash me
      </button>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  asyncData ({ $sentry, query }) {
    if (query.crashOnLoad) {
      // @ts-ignore forces a crash
      // eslint-disable-next-line no-undef
      crashOnLoad()
    }

    if (process.server) {
      return {
        serverSentryPresent: Boolean($sentry?.captureException),
      }
    }
  },
  data () {
    return {
      clientSentryPresent: false,
      serverSentryPresent: false,
    }
  },
  created () {
    if (process.client) {
      this.clientSentryPresent = Boolean(this.$sentry?.captureException)
    }
  },
})
</script>
