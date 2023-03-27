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

    try {
      this.$sentry.captureEvent({ message: 'This should fail' })
      console.error('The call to captureEvent should fail so this line shouldn\'t be printed (on initial load only, this line will be printed on eg HMR)')
    } catch (err) {
      console.info('Caught expected error on $sentry.captureEvent')
    }

    this.$nextTick(() => {
      console.info('Loading Sentry in 1 second')
      setTimeout(this.$sentryLoad, 1000)
    })
  },
}
</script>
