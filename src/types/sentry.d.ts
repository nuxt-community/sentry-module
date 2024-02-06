import { IntegrationFn, IntegrationClass, Integration } from '@sentry/types'
import {
  breadcrumbsIntegration,
  browserApiErrorsIntegration,
  globalHandlersIntegration,
  httpContextIntegration,
  replayIntegration,
} from '@sentry/browser'
import {
  functionToStringIntegration,
  inboundFiltersIntegration,
  linkedErrorsIntegration,
  requestDataIntegration,
} from '@sentry/core'
import {
  captureConsoleIntegration,
  contextLinesIntegration,
  debugIntegration,
  dedupeIntegration,
  extraErrorDataIntegration,
  httpClientIntegration,
  reportingObserverIntegration,
  rewriteFramesIntegration,
  sessionTimingIntegration,
} from '@sentry/integrations'
import {
  Integrations,
} from '@sentry/node'

type IntegrationConfig<T extends IntegrationFn> = Parameters<T>[0] | Record<string, never> | false
type ClassIntegrationConfig<T extends IntegrationClass<Integration>> = ConstructorParameters<T>[0] | Record<string, never> | false

export type BrowserIntegrations = {
    Breadcrumbs?: IntegrationConfig<typeof breadcrumbsIntegration>
    GlobalHandlers?: IntegrationConfig<typeof globalHandlersIntegration>
    HttpContext?: IntegrationConfig<typeof httpContextIntegration>
    Replay?: IntegrationConfig<typeof replayIntegration>
    TryCatch?: IntegrationConfig<typeof browserApiErrorsIntegration>
}

export type CoreIntegrations = {
    FunctionToString?: IntegrationConfig<typeof functionToStringIntegration>
    InboundFilters?: IntegrationConfig<typeof inboundFiltersIntegration>
    LinkedErrors?: IntegrationConfig<typeof linkedErrorsIntegration>
    RequestData?: IntegrationConfig<typeof requestDataIntegration>
}

export type PluggableIntegrations = {
    CaptureConsole?: IntegrationConfig<typeof captureConsoleIntegration>
    ContextLines?: IntegrationConfig<typeof contextLinesIntegration>
    Debug?: IntegrationConfig<typeof debugIntegration>
    Dedupe?: IntegrationConfig<typeof dedupeIntegration>
    ExtraErrorData?: IntegrationConfig<typeof extraErrorDataIntegration>
    HttpClient?: IntegrationConfig<typeof httpClientIntegration>
    ReportingObserver?: IntegrationConfig<typeof reportingObserverIntegration>
    RewriteFrames?: IntegrationConfig<typeof rewriteFramesIntegration>
    SessionTiming?: IntegrationConfig<typeof sessionTimingIntegration>
}

export type NodeProfilingIntegrations = {
    ProfilingIntegration?: IntegrationConfig<IntegrationFn> // Dummy type since we don't want to depend on `@sentry/profiling-node`
}

export type NodeIntegrations = {
    Anr?: ClassIntegrationConfig<typeof Integrations.Anr>
    Apollo?: ClassIntegrationConfig<typeof Integrations.Apollo>
    Console?: ClassIntegrationConfig<typeof Integrations.Console>
    Context?: ClassIntegrationConfig<typeof Integrations.Context>
    ContextLines?: ClassIntegrationConfig<typeof Integrations.ContextLines>
    Express?: ClassIntegrationConfig<typeof Integrations.Express>
    GraphQL?: ClassIntegrationConfig<typeof Integrations.GraphQL>
    Hapi?: ClassIntegrationConfig<typeof Integrations.Hapi>
    Http?: ClassIntegrationConfig<typeof Integrations.Http>
    LocalVariables?: ClassIntegrationConfig<typeof Integrations.LocalVariables>
    Modules?: ClassIntegrationConfig<typeof Integrations.Modules>
    Mongo?: ClassIntegrationConfig<typeof Integrations.Mongo>
    Mysql?: ClassIntegrationConfig<typeof Integrations.Mysql>
    OnUncaughtException?: ClassIntegrationConfig<typeof Integrations.OnUncaughtException>
    OnUnhandledRejection?: ClassIntegrationConfig<typeof Integrations.OnUnhandledRejection>
    Postgres?: ClassIntegrationConfig<typeof Integrations.Postgres>
    Prisma?: ClassIntegrationConfig<typeof Integrations.Prisma>
    Spotlight?: ClassIntegrationConfig<typeof Integrations.Spotlight>
    Undici?: ClassIntegrationConfig<typeof Integrations.Undici>
}

export type ClientCoreIntegrations = Pick<CoreIntegrations, 'FunctionToString' | 'InboundFilters' | 'LinkedErrors'>
export type ClientPluggableIntegrations = PluggableIntegrations
export type ClientIntegrations = ClientCoreIntegrations & ClientPluggableIntegrations & BrowserIntegrations

export type ServerCoreIntegrations = CoreIntegrations
export type ServerPluggableIntegrations = Omit<PluggableIntegrations, 'ContextLines'>
export type ServerIntegrations = ServerCoreIntegrations & ServerPluggableIntegrations & NodeProfilingIntegrations & NodeIntegrations

export type AllIntegrations = ClientIntegrations & ServerIntegrations
