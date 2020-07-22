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
      // eslint-disable-next-line no-console
      console.log('Sentry is ready')
    })
  },
  mounted () {
    this.$sentry.captureMessage('Hi!')

    try {
      this.$sentry.captureEvent({ message: 'This should fail' })
      // eslint-disable-next-line no-console
      console.error('The call to captureEvent should fail so this line shouldnt be printed (on initial load only, this line will be printed on eg HMR)')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.info('Catched expected error on $sentry.captureEvent')
    }

    this.$nextTick(() => {
      // eslint-disable-next-line no-console
      console.log('Loading Sentry in 1 second')
      setTimeout(this.$sentryLoad, 1000)
    })
  }
}
</script>
