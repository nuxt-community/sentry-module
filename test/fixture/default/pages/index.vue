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

<script>
export default {
  data () {
    return {
      clientSentryPresent: false,
      serverSentryPresent: false,
    }
  },
  created () {
    if (process.server) {
      this.serverSentryPresent = Boolean(this.$sentry?.captureException)
    }
    if (process.client) {
      this.clientSentryPresent = Boolean(this.$sentry?.captureException)
    }
  },
}
</script>
