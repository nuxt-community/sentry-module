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
  asyncData ({ $sentry }) {
    if (process.server) {
      return {
        serverSentryPresent: Boolean($sentry?.captureException),
      }
    }
  },
  data () {
    return {
      isSentryReady: false,
      serverSentryPresent: false,
    }
  },
  created () {
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
