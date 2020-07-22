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
    this.$nextTick(() => {
      // eslint-disable-next-line no-console
      console.log('Loading Sentry in 1 second')
      setTimeout(this.$sentryLoad, 1000)
    })

    if (process.client) {
      throw new Error('oeps')
    }
  }
}
</script>
