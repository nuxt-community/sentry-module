import 'vue'
import 'vuex'
import '@nuxt/types'
import { Client } from '@sentry/types'
import { PartialModuleConfiguration } from './configuration'

export type ModulePublicRuntimeConfig = Pick<PartialModuleConfiguration, 'config' | 'clientConfig' | 'serverConfig'>

// add type to Vue context
declare module 'vue/types/vue' {
  interface Vue {
    readonly $sentry: Client
    $sentryLoad(): Promise<void>
    $sentryReady(): Promise<Client>
  }
}

// App Context and NuxtAppOptions
declare module '@nuxt/types' {
  interface Context {
    readonly $sentry: Client
    $sentryLoad(): Promise<void>
    $sentryReady(): Promise<Client>
  }

  interface NuxtOptions {
    sentry?: PartialModuleConfiguration
  }

  interface NuxtAppOptions {
    readonly $sentry: Client
    $sentryLoad(): Promise<void>
    $sentryReady(): Promise<Client>
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
    readonly $sentry: Client
    $sentryLoad(): Promise<void>
    $sentryReady(): Promise<Client>
  }
}

declare global {
  namespace NodeJS {
    interface Process {
      sentry: Client
    }
  }
}
