/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingMessage, ServerResponse } from 'http'
import { Options as WebpackOptions } from 'webpack'
import { Options as SentryOptions } from '@sentry/types'
import type { Options as SentryVueOptions } from '@sentry/vue/types/types'
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

declare type Operation = 'activate' | 'create' | 'destroy' | 'mount' | 'update'
export interface TracingConfiguration {
    tracesSampleRate?: number
    /**
     * Decides whether to track components by hooking into its lifecycle methods.
     * Can be either set to `boolean` to enable/disable tracking for all of them.
     * Or to an array of specific component names (case-sensitive).
     */
    trackComponents: boolean | string[]
    /** How long to wait until the tracked root activity is marked as finished and sent of to Sentry */
    timeout: number
    /**
     * List of hooks to keep track of during component lifecycle.
     * Available hooks: 'activate' | 'create' | 'destroy' | 'mount' | 'update'
     * Based on https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
     */
    hooks: Operation[]
    tracePropagationTargets: (string|RegExp)[]
}

export interface ModuleConfiguration {
    clientConfig?: Partial<SentryVueOptions>
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
    serverConfig?: SentryOptions
    serverIntegrations?: IntegrationsConfiguration
    sourceMapStyle?: WebpackOptions.Devtool
    requestHandlerConfig?: Handlers.RequestHandlerOptions
}

interface ResolvedModuleConfiguration extends Omit<Required<ModuleConfiguration>, 'publishRelease'> {
    publishRelease?: Partial<SentryCliPluginOptions>
}
