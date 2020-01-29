import { Client } from '@sentry/types';

// add type to Vue context
declare module 'vue/types/vue' {
  interface Vue {
    readonly $sentry?: Client;
  }
}

// App Context and NuxtAppOptions
declare module '@nuxt/types' {
  interface Context {
    readonly $sentry?: Client;
  }

  interface NuxtAppOptions {
    readonly $sentry?: Client;
  }
}

// add types for Vuex Store
declare module 'vuex/types' {
  interface Store<S> {
    readonly $sentry?: Client;
  }
}
