import { Options as WebpackOptions } from 'webpack'
import { BrowserTracingOptions } from '@sentry/tracing/dist/browser/browsertracing'
import { Options as SentryOptions } from '@sentry/types'
import { BrowserOptions } from '@sentry/browser'
import { SentryCliPluginOptions } from '@sentry/webpack-plugin'
import { Handlers } from '@sentry/node'

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
/**
 * Vue specific configuration for Tracing Integration
 * Not exported, so have to reproduce here
 * @see https://github.com/getsentry/sentry-javascript/blob/master/packages/integrations/src/vue.ts
 **/
interface TracingOptions {
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
}

export interface TracingConfiguration {
    tracesSampleRate?: number
    vueOptions?: {
        tracing?: boolean
        tracingOptions?: TracingOptions
    }
    browserOptions?: BrowserTracingOptions
}

export interface ModuleConfiguration {
    /** @deprecated Set `publishRelease.setCommits.auto = true` instead. */
    attachCommits?: boolean
    clientConfig?: BrowserOptions
    clientIntegrations?: IntegrationsConfiguration
    config?: SentryOptions
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
    /** @deprecated Set `publishRelease.setCommits.repo` instead. */
    repo?: string
    runtimeConfigKey?: string
    serverConfig?: SentryOptions
    serverIntegrations?: IntegrationsConfiguration
    sourceMapStyle?: WebpackOptions.Devtool
    /** @deprecated Use `publishRelease` instead. */
    webpackConfig?: Partial<SentryCliPluginOptions>
    requestHandlerConfig?: Handlers.RequestHandlerOptions
}

interface ResolvedModuleConfiguration extends Omit<Required<ModuleConfiguration>, 'publishRelease'> {
    publishRelease?: Partial<SentryCliPluginOptions>
}
