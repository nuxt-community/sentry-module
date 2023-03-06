/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingMessage, ServerResponse } from 'http'
import { Configuration as WebpackOptions } from 'webpack'
import { BrowserTracing } from '@sentry/tracing'
import { Options as SentryOptions } from '@sentry/types'
import * as PluggableIntegrations from '@sentry/integrations'
import type { Integrations as BrowserIntegrations } from '@sentry/vue'
import { Options as SentryVueOptions, TracingOptions as SentryVueTracingOptions } from '@sentry/vue/types/types'
import { SentryCliPluginOptions } from '@sentry/webpack-plugin'
import { Integrations as ServerIntegrations, NodeOptions, Handlers } from '@sentry/node'

export interface SentryHandlerProxy {
    errorHandler: (error: any, req: IncomingMessage, res: ServerResponse, next: (error: any) => void) => void
    requestHandler: (req: IncomingMessage, res: ServerResponse, next: (error?: any) => void) => void
    tracingHandler: (req: IncomingMessage, res: ServerResponse, next: (error?: any) => void) => void
}

export type Integrations<T = Record<string, unknown>> = Partial<Record<keyof T, unknown>>

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
  clientIntegrations: Integrations<typeof BrowserIntegrations & typeof PluggableIntegrations>
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
  publishRelease: boolean | SentryCliPluginOptions
  runtimeConfigKey: string
  serverConfig: NodeOptions | string
  serverIntegrations: Integrations<typeof ServerIntegrations & typeof PluggableIntegrations>
  sourceMapStyle: WebpackOptions['devtool']
  requestHandlerConfig: Handlers.RequestHandlerOptions
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer I>
    ? Array<DeepPartial<I>>
    : DeepPartial<T[P]>;
}

export type DeepPartialModuleConfiguration = DeepPartial<ModuleConfiguration>
