import 'vue'
import 'vuex'
import * as SentryTypes from '@sentry/minimal'
import { ModuleConfiguration } from './sentry'

// add type to Vue context
declare module 'vue/types/vue' {
  interface Vue {
    readonly $sentry: typeof SentryTypes
    $sentryLoad(): Promise<void>
    $sentryReady(): Promise<typeof SentryTypes>
  }
}

// App Context and NuxtAppOptions
declare module '@nuxt/types' {
  interface Context {
    readonly $sentry: typeof SentryTypes
    $sentryLoad(): Promise<void>
    $sentryReady(): Promise<typeof SentryTypes>
  }

  interface NuxtAppOptions {
    readonly $sentry: typeof SentryTypes
    $sentryLoad(): Promise<void>
    $sentryReady(): Promise<typeof SentryTypes>
  }

  interface NuxtOptions {
    sentry?: ModuleConfiguration
  }
}

declare module '@nuxt/types/config/runtime' {
  interface NuxtRuntimeConfig {
    sentry?: ModuleConfiguration
  }
}

// add types for Vuex Store
declare module 'vuex/types' {
  interface Store<S> {
    readonly $sentry: typeof SentryTypes
    $sentryLoad(): Promise<void>
    $sentryReady(): Promise<typeof SentryTypes>
  }
}
