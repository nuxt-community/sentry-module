import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

export default function (ctx, inject) {
  // Inject Raven to the context as $raven
  ctx.$raven = Raven
  inject('raven', Raven)
  
  Raven
    .config('<%= options.public_dsn %>', <%= serialize(options.config) %>)
    .addPlugin(RavenVue, Vue)
    .install()
}
