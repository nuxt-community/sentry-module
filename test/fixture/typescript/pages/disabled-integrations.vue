<template>
  <div>
    <p>Integrations</p>
    <p id="client">
      Dedupe: {{ clientDedupeDisabled ? 'DISABLED' : 'ENABLED' }}
    </p>
    <p id="server">
      Modules: {{ serverModulesDisabled ? 'DISABLED' : 'ENABLED' }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { BrowserClient } from '@sentry/browser'
import type { NodeClient } from '@sentry/node'

export default defineComponent({
  asyncData ({ $sentry }) {
    if (process.server) {
      return {
        serverModulesDisabled: $sentry.getClient<NodeClient>()!.getIntegrationByName('Modules') === undefined,
      }
    }
  },
  data () {
    return {
      clientDedupeDisabled: false,
      serverModulesDisabled: false,
    }
  },
  created () {
    if (process.client) {
      this.clientDedupeDisabled = this.$sentry.getClient<BrowserClient>()!.getIntegrationByName('Dedupe') === undefined
    }
  },
})
</script>
