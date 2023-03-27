import 'vue'
import 'vuex'
import '@nuxt/types'
import * as SentryNode from '@sentry/node'
import * as SentryTypes from '@sentry/core'
import { PartialModuleConfiguration } from './configuration'

export type ModulePublicRuntimeConfig = Pick<PartialModuleConfiguration, 'config' | 'clientConfig' | 'serverConfig'>

type Sentry = typeof SentryTypes
type NodeSentry = typeof SentryNode

// add type to Vue context
declare module 'vue/types/vue' {
  interface Vue {
    readonly $sentry: Sentry
    $sentryLoad(): Promise<void>
    $sentryReady(): Promise<Sentry>
  }
}

// App Context and NuxtAppOptions
declare module '@nuxt/types' {
  interface Context {
    readonly $sentry: Sentry
    $sentryLoad(): Promise<void>
    $sentryReady(): Promise<Sentry>
  }

  interface NuxtOptions {
    sentry?: PartialModuleConfiguration
  }

  interface NuxtAppOptions {
    readonly $sentry: Sentry
    $sentryLoad(): Promise<void>
    $sentryReady(): Promise<Sentry>
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
    readonly $sentry: Sentry
    $sentryLoad(): Promise<void>
    $sentryReady(): Promise<Sentry>
  }
}

declare global {
  namespace NodeJS {
    interface Process {
      sentry: NodeSentry
    }
  }
}
