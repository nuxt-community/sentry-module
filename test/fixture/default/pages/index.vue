<template>
  <div>
    <h3>Server-side</h3>
    <span id="server-side">{{ serverSentry ? 'Works!' : '$sentry object is missing!' }}</span>
    <h3>Client-side</h3>
    <span id="client-side">{{ clientSentry ? 'Works!' : '$sentry object is missing!' }}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      /** @type {import('@sentry/minimal') | null} */
      clientSentry: null,
      /** @type {import('@sentry/minimal') | null} */
      serverSentry: this.$sentry
    }
  },
  created () {
    if (process.client) {
      this.clientSentry = this.$sentry
    }
  }
}
</script>
