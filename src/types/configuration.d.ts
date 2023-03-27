import { Configuration as WebpackOptions } from 'webpack'
import { BrowserTracing } from '@sentry/tracing'
import { Options as SentryOptions, IntegrationClass } from '@sentry/types'
import * as PluggableIntegrations from '@sentry/integrations'
import { Integrations as BrowserIntegrations } from '@sentry/vue'
import { Options as SentryVueOptions, TracingOptions as SentryVueTracingOptions } from '@sentry/vue/types/types'
import { SentryCliPluginOptions } from '@sentry/webpack-plugin'
import { Integrations as NodeIntegrations, NodeOptions, Handlers } from '@sentry/node'

type IntegrationsConfig<T extends Record<keyof T, IntegrationClass<unknown>>> = Partial<{
    [K in keyof T]: ConstructorParameters<T[K]>[0] | Record<string, never>
}>

type ClientIntegrations = IntegrationsConfig<typeof BrowserIntegrations & typeof PluggableIntegrations>
type ServerIntegrations = IntegrationsConfig<typeof NodeIntegrations & typeof PluggableIntegrations>
type AllIntegrations = ClientIntegrations | ServerIntegrations

export interface LazyConfiguration {
    chunkName?: string
    injectLoadHook?: boolean
    injectMock?: boolean
    mockApiMethods?: boolean | string[]
    webpackPrefetch?: boolean
    webpackPreload?: boolean
}

export interface TracingConfiguration extends Pick<SentryOptions, 'tracesSampleRate'> {
    browserTracing?: Partial<BrowserTracing['options']>
    vueOptions?: Partial<SentryVueTracingOptions>
}

export interface ModuleConfiguration {
  clientConfig: Partial<SentryVueOptions> | string
  clientIntegrations: ClientIntegrations
  config: SentryOptions
  customClientIntegrations: string
  customServerIntegrations: string
  disableClientRelease: boolean
  disableClientSide: boolean
  disabled: boolean
  disableServerRelease: boolean
  disableServerSide: boolean
  dsn: string
  tracing: boolean | TracingConfiguration
  initialize: boolean
  lazy: boolean | LazyConfiguration
  logMockCalls: boolean
  /** See available options at https://github.com/getsentry/sentry-webpack-plugin */
  publishRelease: boolean | Partial<SentryCliPluginOptions>
  runtimeConfigKey: string
  serverConfig: NodeOptions | string
  serverIntegrations: ServerIntegrations
  sourceMapStyle: WebpackOptions['devtool']
  requestHandlerConfig: Handlers.RequestHandlerOptions
}

export type PartialModuleConfiguration = Partial<ModuleConfiguration>
