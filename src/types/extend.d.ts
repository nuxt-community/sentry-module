import 'vue'
import 'vuex'
import '@nuxt/types'
import * as SentryTypes from '@sentry/core'
import { DeepPartialModuleConfiguration } from './configuration'

export type ModulePublicRuntimeConfig = Pick<DeepPartialModuleConfiguration, 'config' | 'clientConfig' | 'serverConfig'>

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

  interface NuxtOptions {
    sentry?: DeepPartialModuleConfiguration
  }

  interface NuxtAppOptions {
    readonly $sentry: typeof SentryTypes
    $sentryLoad(): Promise<void>
    $sentryReady(): Promise<typeof SentryTypes>
  }
}

declare module '@nuxt/types/config/runtime' {
  interface NuxtRuntimeConfig {
    sentry?: ModulePublicRuntimeConfig
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
