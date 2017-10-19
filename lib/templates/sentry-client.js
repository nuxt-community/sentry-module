import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

Raven
  .config('<%= options.public_dsn %>', <%= serialize(options.config) %>)
  .addPlugin(RavenVue, Vue)
  .install()
