import { Options as WebpackOptions } from 'webpack'
import { Options as SentryOptions } from '@sentry/types'
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

export interface ModuleConfiguration {
    attachCommits?: boolean
    clientConfig?: SentryOptions
    clientIntegrations?: IntegrationsConfiguration
    config?: SentryOptions
    disableClientRelease?: boolean
    disableClientSide?: boolean
    disabled?: boolean
    disableServerRelease?: boolean
    disableServerSide?: boolean
    dsn?: string
    initialize?: boolean
    lazy?: boolean | LazyConfiguration
    logMockCalls?: boolean
    publishRelease?: boolean
    repo?: string
    serverConfig?: SentryOptions
    serverIntegrations?: IntegrationsConfiguration
    sourceMapStyle?: WebpackOptions.Devtool
    webpackConfig?: SentryCliPluginOptions
    requestHandlerConfig?: Handlers.RequestHandlerOptions
}
