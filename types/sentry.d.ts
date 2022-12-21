/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingMessage, ServerResponse } from 'http'
import { Options as WebpackOptions } from 'webpack'
import { BrowserTracing } from '@sentry/tracing'
import { Options as SentryOptions } from '@sentry/types'
import { Options as SentryVueOptions, TracingOptions as SentryVueTracingOptions } from '@sentry/vue/types/types'
import { SentryCliPluginOptions } from '@sentry/webpack-plugin'
import { Handlers } from '@sentry/node'

export interface SentryHandlerProxy {
    errorHandler: (error: any, req: IncomingMessage, res: ServerResponse, next: (error: any) => void) => void
    requestHandler: (req: IncomingMessage, res: ServerResponse, next: (error?: any) => void) => void
}

export type IntegrationsConfiguration = Record<string, unknown>

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
    clientConfig?: Partial<SentryVueOptions> | string
    clientIntegrations?: IntegrationsConfiguration
    config?: SentryOptions
    customClientIntegrations?: string
    customServerIntegrations?: string
    disableClientRelease?: boolean
    disableClientSide?: boolean
    disabled?: boolean
    disableServerRelease?: boolean
    disableServerSide?: boolean
    dsn?: string
    tracing?: boolean | TracingConfiguration
    initialize?: boolean
    lazy?: boolean | LazyConfiguration
    logMockCalls?: boolean
    /** See available options at https://github.com/getsentry/sentry-webpack-plugin */
    publishRelease?: boolean | Partial<SentryCliPluginOptions>
    runtimeConfigKey?: string
    serverConfig?: SentryOptions | string
    serverIntegrations?: IntegrationsConfiguration
    sourceMapStyle?: WebpackOptions.Devtool
    requestHandlerConfig?: Handlers.RequestHandlerOptions
}

interface ResolvedModuleConfiguration extends Omit<Required<ModuleConfiguration>, 'publishRelease'> {
    publishRelease?: Partial<SentryCliPluginOptions>
}
