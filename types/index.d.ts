import * as SentryTypes from '@sentry/minimal';

// add type to Vue context
declare module 'vue/types/vue' {
  interface Vue {
    readonly $sentry: typeof SentryTypes;
  }
}

// App Context and NuxtAppOptions
declare module '@nuxt/types' {
  interface Context {
    readonly $sentry: typeof SentryTypes;
  }

  interface NuxtAppOptions {
    readonly $sentry: typeof SentryTypes;
  }
}

// add types for Vuex Store
declare module 'vuex/types' {
  interface Store<S> {
    readonly $sentry: typeof SentryTypes;
  }
}
