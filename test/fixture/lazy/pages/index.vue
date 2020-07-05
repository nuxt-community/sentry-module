<template>
  <div>
    Works {{ isSentryReady ? 'and is' : 'but is not' }} ready!
  </div>
</template>

<script>
export default {
  data () {
    return {
      isSentryReady: false
    }
  },
  created () {
    this.$sentryReady().then(() => {
      this.isSentryReady = true
      console.log('Sentry is ready') // eslint-disable-line no-console
    })
  },
  mounted () {
    this.$sentry.captureMessage('Hi!')
  }
}
</script>
