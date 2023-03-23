<template>
  <div>
    <h3>Server-side</h3>
    <span id="server-side">{{ serverSentryPresent ? 'Works!' : '$sentry object is missing!' }}</span>
    <h3>Client-side</h3>
    <span id="client-side">Works {{ isSentryReady ? 'and is' : 'but is not' }} ready!</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isSentryReady: false,
      serverSentryPresent: false,
    }
  },
  created () {
    if (process.server) {
      this.serverSentryPresent = Boolean(this.$sentry?.captureException)
    }
    if (process.client) {
      this.$sentryReady().then(() => {
        this.isSentryReady = true
        console.info('Sentry is ready')
      })
    }
  },
  mounted () {
    this.$sentry.captureMessage('Hi!')
  },
}
</script>
