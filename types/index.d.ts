import { Client } from '@sentry/types/dist/client';

// add type to Vue context
declare module "vue/types/vue" {
  interface Vue {
    $sentry: Client;
  }
}

// since nuxt 2.7.1 there is "NuxtAppOptions" for app context - see https://github.com/nuxt/nuxt.js/pull/5701
declare module '@nuxt/vue-app' {
  interface NuxtAppOptions {
    $sentry: Client;
  }
}

// add types for Vuex Store
declare module 'vuex/types' {
  interface Store<S> {
    $sentry: Client;
  }
}
