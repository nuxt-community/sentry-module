<template>
  <div>
    <h3>Server-side</h3>
    <span id="server-side">{{ serverSentryPresent ? 'Works!' : '$sentry object is missing!' }}</span>
    <h3>Client-side</h3>
    <span id="client-side">{{ clientSentryPresent ? 'Works!' : '$sentry object is missing!' }}</span>
    <p>
      <button id="crash-button" type="button" @click="crash_me()">
        crash me
      </button>
    </p>
  </div>
</template>

<script>
export default {
  asyncData ({ $sentry }) {
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
}
</script>
