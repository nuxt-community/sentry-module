import { fileURLToPath } from 'node:url'
import type { ConsolaInstance } from 'consola'
import { defu } from 'defu'
import initJiti from 'jiti'
import { relative } from 'pathe'
import { Integrations as SentryNodeIntegrations, autoDiscoverNodePerformanceMonitoringIntegrations } from '@sentry/node'
import type Sentry from '@sentry/node'
import * as SentryCore from '@sentry/core'
import * as PluggableIntegrations from '@sentry/integrations'
import type { Integration, Options } from '@sentry/types'
import type { LazyConfiguration, TracingConfiguration } from './types/configuration'
import type { AllIntegrations, BrowserIntegrations, ClientCoreIntegrations, ClientIntegrations, ClientPluggableIntegrations, NodeIntegrations, NodeProfilingIntegrations, ServerCoreIntegrations, ServerIntegrations, ServerPluggableIntegrations } from './types/sentry'
import type { ModuleConfiguration } from './types'
import { Nuxt, resolveAlias } from './kit-shim'
import { canInitialize } from './utils'

const jiti = initJiti(fileURLToPath(import.meta.url))

export interface SentryHandlerProxy {
    errorHandler: ReturnType<typeof Sentry.Handlers.errorHandler>
    requestHandler: ReturnType<typeof Sentry.Handlers.requestHandler>
    tracingHandler: ReturnType<typeof Sentry.Handlers.tracingHandler>
}

type BooleanMap<T extends Record<string, unknown>> = Record<keyof T, true>
type IntegrationToImportMapping = Record<keyof AllIntegrations, string>

export const BROWSER_CORE_INTEGRATIONS: BooleanMap<ClientCoreIntegrations> = {
  FunctionToString: true,
  InboundFilters: true,
  LinkedErrors: true,
}

// Enabled by default in Vue - https://docs.sentry.io/platforms/javascript/guides/vue/configuration/integrations/default/
export const BROWSER_INTEGRATIONS: BooleanMap<BrowserIntegrations> = {
  Breadcrumbs: true,
  GlobalHandlers: true,
  HttpContext: true,
  Replay: true,
  TryCatch: true,
}

// Optional in Vue - https://docs.sentry.io/platforms/javascript/guides/vue/configuration/integrations/plugin/
export const BROWSER_PLUGGABLE_INTEGRATIONS: BooleanMap<ClientPluggableIntegrations> = {
  CaptureConsole: true,
  ContextLines: true,
  Debug: true,
  Dedupe: true,
  ExtraErrorData: true,
  HttpClient: true,
  ReportingObserver: true,
  RewriteFrames: true,
  SessionTiming: true,
}

const SERVER_CORE_INTEGRATIONS: BooleanMap<ServerCoreIntegrations> = {
  FunctionToString: true,
  InboundFilters: true,
  LinkedErrors: true,
  RequestData: true,
}

// Enabled by default in Node.js - https://docs.sentry.io/platforms/node/configuration/integrations/default-integrations/
const SERVER_NODE_INTEGRATIONS: BooleanMap<NodeIntegrations> = {
  Anr: true,
  Apollo: true,
  Console: true,
  Context: true,
  ContextLines: true,
  Express: true,
  GraphQL: true,
  Hapi: true,
  Http: true,
  LocalVariables: true,
  Modules: true,
  Mongo: true,
  Mysql: true,
  OnUncaughtException: true,
  OnUnhandledRejection: true,
  Postgres: true,
  Prisma: true,
  Spotlight: true,
  Undici: true,
}

// Optional in Node.js - https://docs.sentry.io/platforms/node/configuration/integrations/pluggable-integrations/
const SERVER_PLUGGABLE_INTEGRATIONS: BooleanMap<ServerPluggableIntegrations> = {
  CaptureConsole: true,
  Debug: true,
  Dedupe: true,
  ExtraErrorData: true,
  HttpClient: true,
  ReportingObserver: true,
  RewriteFrames: true,
  SessionTiming: true,
}

const INTEGRATION_TO_IMPORT_NAME_MAP: IntegrationToImportMapping = {
  Anr: 'Anr',
  Apollo: 'Apollo',
  Breadcrumbs: 'breadcrumbsIntegration',
  CaptureConsole: 'captureConsoleIntegration',
  Console: 'Console',
  Context: 'Context',
  ContextLines: 'contextLinesIntegration',
  Debug: 'debugIntegration',
  Dedupe: 'dedupeIntegration',
  Express: 'Express',
  ExtraErrorData: 'extraErrorDataIntegration',
  FunctionToString: 'functionToStringIntegration',
  GlobalHandlers: 'globalHandlersIntegration',
  GraphQL: 'GraphQL',
  Hapi: 'Hapi',
  Http: 'Http',
  HttpClient: 'httpClientIntegration',
  HttpContext: 'httpContextIntegration',
  InboundFilters: 'inboundFiltersIntegration',
  LinkedErrors: 'linkedErrorsIntegration',
  LocalVariables: 'LocalVariables',
  Modules: 'Modules',
  Mongo: 'Mongo',
  Mysql: 'Mysql',
  OnUncaughtException: 'OnUncaughtException',
  OnUnhandledRejection: 'OnUnhandledRejection',
  Postgres: 'Postgres',
  Prisma: 'Prisma',
  ProfilingIntegration: 'ProfilingIntegration',
  Replay: 'replayIntegration',
  ReportingObserver: 'reportingObserverIntegration',
  RequestData: 'requestDataIntegration',
  RewriteFrames: 'rewriteFramesIntegration',
  SessionTiming: 'sessionTimingIntegration',
  Spotlight: 'Spotlight',
  TryCatch: 'browserApiErrorsIntegration',
  Undici: 'Undici',
}

function mapClientIntegrationToImportName (key: keyof ClientIntegrations): string {
  return INTEGRATION_TO_IMPORT_NAME_MAP[key]
}

function mapServerIntegrationToImportName (key: keyof ServerIntegrations): string {
  if (key === 'ContextLines') {
    return 'ContextLines'
  }

  return INTEGRATION_TO_IMPORT_NAME_MAP[key]
}

// External and optional Node.js integration - https://docs.sentry.io/platforms/node/profiling/
export const SERVER_PROFILING_INTEGRATION: keyof Pick<NodeProfilingIntegrations, 'ProfilingIntegration'> = 'ProfilingIntegration'

function getEnabledIntegrations<T extends AllIntegrations> (integrations: T): (keyof T)[] {
  return getIntegrationsKeys(integrations).filter(key => integrations[key])
}

function getDisabledIntegrationKeys<T extends AllIntegrations> (integrations: T): string[] {
  return getIntegrationsKeys(integrations).filter(key => integrations[key] === false) as string[]
}

function getIntegrationsKeys<T extends Partial<Record<keyof AllIntegrations, unknown>>> (integrations: T): (keyof T)[] {
  return Object.keys(integrations) as (keyof T)[]
}

function isBrowserCoreIntegration (name: string): name is keyof ClientCoreIntegrations {
  return name in BROWSER_CORE_INTEGRATIONS
}

function isBrowserDefaultIntegration (name: string): name is keyof BrowserIntegrations {
  return name in BROWSER_INTEGRATIONS
}

function isBrowserPluggableIntegration (name: string): name is keyof ClientPluggableIntegrations {
  return name in BROWSER_PLUGGABLE_INTEGRATIONS
}

function isServerCoreIntegration (name: string): name is keyof ServerCoreIntegrations {
  return name in SERVER_CORE_INTEGRATIONS
}

function isServerNodeIntegration (name: string): name is keyof NodeIntegrations {
  return name in SERVER_NODE_INTEGRATIONS
}

function isServerPlugabbleIntegration (name: string): name is keyof ServerPluggableIntegrations {
  return name in SERVER_PLUGGABLE_INTEGRATIONS
}

async function getApiMethods (packageName: string): Promise<string[]> {
  const packageApi = await import(packageName)

  const apiMethods: string[] = []
  for (const key in packageApi) {
    if (key === 'default') {
      for (const subKey in packageApi[key]) {
        if (typeof packageApi[key][subKey] === 'function') {
          apiMethods.push(subKey)
        }
      }
      continue
    }
    if (typeof packageApi[key] === 'function') {
      apiMethods.push(key)
    }
  }

  return apiMethods
}

export async function resolveRelease (moduleOptions: Readonly<ModuleConfiguration>): Promise<string | undefined> {
  if (!('release' in moduleOptions.config)) {
    // Determine "config.release" automatically from local repo if not provided.
    try {
      const SentryCli = await (import('@sentry/cli').then(m => m.default || m))
      const cli = new SentryCli()
      return (await cli.releases.proposeVersion()).trim()
    } catch {
      // Ignore
    }
  }
}

function resolveClientLazyOptions (options: ModuleConfiguration, apiMethods: string[], logger: ConsolaInstance): void {
  if (!options.lazy) {
    return
  }

  const defaultLazyOptions: LazyConfiguration = {
    injectMock: true,
    injectLoadHook: false,
    mockApiMethods: true,
    chunkName: 'sentry',
    webpackPrefetch: false,
    webpackPreload: false,
  }

  options.lazy = defu(options.lazy, defaultLazyOptions)

  if (!options.lazy.injectMock) {
    options.lazy.mockApiMethods = []
  } else if (options.lazy.mockApiMethods === true) {
    options.lazy.mockApiMethods = apiMethods
  } else if (Array.isArray(options.lazy.mockApiMethods)) {
    const mockMethods = options.lazy.mockApiMethods
    options.lazy.mockApiMethods = mockMethods.filter(method => apiMethods.includes(method))
    const notfoundMethods = mockMethods.filter(method => !apiMethods.includes(method))
    if (notfoundMethods.length) {
      logger.warn('Some specified methods to mock weren\'t found in @sentry/vue:', notfoundMethods)
    }
    if (!options.lazy.mockApiMethods.includes('captureException')) {
      // always add captureException if a sentry mock is requested
      options.lazy.mockApiMethods.push('captureException')
    }
  }
}

function resolveTracingOptions (options: ModuleConfiguration): void {
  if (!options.tracing) {
    return
  }

  const defaultTracingOptions: TracingConfiguration = {
    tracesSampleRate: 1.0,
    browserTracing: {},
    vueOptions: {
      trackComponents: true,
    },
    vueRouterInstrumentationOptions: {
      routeLabel: 'name',
    },
  }

  options.tracing = defu(options.tracing, defaultTracingOptions)

  if (options.config.tracesSampleRate === undefined) {
    options.config.tracesSampleRate = options.tracing.tracesSampleRate
  }
}

export type ResolvedClientOptions = {
  dev: boolean
  DISABLED_INTEGRATION_KEYS: string[]
  runtimeConfigKey: string
  config: Options
  lazy: boolean | LazyConfiguration
  apiMethods: string[]
  clientConfigPath: string | undefined
  customClientIntegrations: string | undefined
  logMockCalls: boolean
  tracing: boolean | TracingConfiguration
  imports: Record<string, string[]>
  initialize: boolean
  integrations: Record<string, unknown>
}

export async function resolveClientOptions (nuxt: Nuxt, moduleOptions: Readonly<ModuleConfiguration>, logger: ConsolaInstance): Promise<ResolvedClientOptions> {
  const options: ModuleConfiguration = defu(moduleOptions)

  let clientConfigPath: string | undefined
  if (typeof (options.clientConfig) === 'string') {
    clientConfigPath = resolveAlias(options.clientConfig)
    clientConfigPath = relative(nuxt.options.buildDir, clientConfigPath)
  } else {
    options.config = defu(options.clientConfig, options.config)
  }

  const apiMethods = await getApiMethods('@sentry/vue')
  resolveClientLazyOptions(options, apiMethods, logger)
  resolveTracingOptions(options)

  for (const name of getIntegrationsKeys(options.clientIntegrations)) {
    if (!isBrowserDefaultIntegration(name) && !isBrowserCoreIntegration(name) && !isBrowserPluggableIntegration(name)) {
      logger.warn(`Sentry clientIntegration "${name}" is not recognized and will be ignored.`)
      delete options.clientIntegrations[name]
    }
  }

  let customClientIntegrations: string | undefined
  if (options.customClientIntegrations) {
    if (typeof (options.customClientIntegrations) === 'string') {
      customClientIntegrations = resolveAlias(options.customClientIntegrations)
      customClientIntegrations = relative(nuxt.options.buildDir, customClientIntegrations)
    } else {
      logger.warn(`Invalid customClientIntegrations option. Expected a file path, got "${typeof (options.customClientIntegrations)}".`)
    }
  }

  const importsBrowser: string[] = []
  const importsCore: string[] = []
  const importsPluggable: string[] = []

  const integrations = getEnabledIntegrations<ClientIntegrations>(options.clientIntegrations)
    .reduce((res, key) => {
      const importName = mapClientIntegrationToImportName(key)

      if (key in BROWSER_INTEGRATIONS) {
        importsBrowser.push(importName)
      } else if (key in BROWSER_CORE_INTEGRATIONS) {
        importsCore.push(importName)
      } else if (key in BROWSER_PLUGGABLE_INTEGRATIONS) {
        importsPluggable.push(importName)
      }

      res[importName] = options.clientIntegrations[key]
      return res
    }, {} as Record<string, unknown>)

  const imports = {
    '~@sentry/browser': importsBrowser,
    '~@sentry/core': importsCore,
    '~@sentry/integrations': importsPluggable,
    '~@sentry/vue': ['init', ...(options.tracing ? ['browserTracingIntegration'] : [])],
  }

  return {
    dev: nuxt.options.dev,
    runtimeConfigKey: options.runtimeConfigKey,
    config: {
      dsn: options.dsn,
      ...options.config,
    },
    clientConfigPath,
    DISABLED_INTEGRATION_KEYS: getDisabledIntegrationKeys(options.clientIntegrations),
    lazy: options.lazy,
    apiMethods,
    customClientIntegrations,
    logMockCalls: options.logMockCalls, // for mocked only
    tracing: options.tracing,
    imports,
    initialize: canInitialize(options),
    integrations,
  }
}

export type ResolvedServerOptions = {
  config: Options
  apiMethods: string[]
  lazy: boolean | LazyConfiguration
  logMockCalls: boolean
  tracing: ModuleConfiguration['tracing']
}

export async function resolveServerOptions (nuxt: Nuxt, moduleOptions: Readonly<ModuleConfiguration>, logger: ConsolaInstance): Promise<ResolvedServerOptions> {
  const options: ModuleConfiguration = defu(moduleOptions)

  if (options.tracing) {
    resolveTracingOptions(options)
    options.serverIntegrations = defu(options.serverIntegrations, { Http: { tracing: true } })
  }

  if (typeof (options.serverConfig) === 'string') {
    const resolvedPath = resolveAlias(options.serverConfig)
    try {
      const mod = jiti(resolvedPath)
      options.serverConfig = (mod.default || mod)()
    } catch (error) {
      logger.error(`Error handling the serverConfig plugin:\n${error}`)
    }
  }

  options.config = defu(getServerRuntimeConfig(nuxt, options), options.serverConfig, options.config)

  for (const name of getIntegrationsKeys(options.serverIntegrations)) {
    if (!isServerNodeIntegration(name) && !isServerCoreIntegration(name) && !isServerPlugabbleIntegration(name) && name !== SERVER_PROFILING_INTEGRATION) {
      logger.warn(`Sentry serverIntegration "${name}" is not recognized and will be ignored.`)
      delete options.serverIntegrations[name]
    }
  }

  let customIntegrations: Integration[] = []
  if (options.customServerIntegrations) {
    const resolvedPath = resolveAlias(options.customServerIntegrations)
    try {
      const mod = jiti(resolvedPath)
      customIntegrations = (mod.default || mod)()
      if (!Array.isArray(customIntegrations)) {
        logger.error(`Invalid value returned from customServerIntegrations plugin. Expected an array, got "${typeof (customIntegrations)}".`)
      }
    } catch (error) {
      logger.error(`Error handling the customServerIntegrations plugin:\n${error}`)
    }
  }

  if (SERVER_PROFILING_INTEGRATION in options.serverIntegrations) {
    const enabled = options.serverIntegrations[SERVER_PROFILING_INTEGRATION]
    delete options.serverIntegrations[SERVER_PROFILING_INTEGRATION]
    if (enabled) {
      try {
        const { ProfilingIntegration } = await (import('@sentry/profiling-node').then(m => m.default || m))
        customIntegrations.push(new ProfilingIntegration())
      } catch (error) {
        logger.error(`To use the ${SERVER_PROFILING_INTEGRATION} integration you need to install the "@sentry/profiling-node" dependency.`)
        throw new Error((error as Error).message)
      }
    }
  }

  const resolvedIntegrations = [
    // Automatically instrument Node.js libraries and frameworks
    ...(options.tracing ? autoDiscoverNodePerformanceMonitoringIntegrations() : []),
    ...getEnabledIntegrations(options.serverIntegrations)
      .map((name) => {
        const importName = mapServerIntegrationToImportName(name)
        const opt = options.serverIntegrations[name]
        try {
          if (isServerCoreIntegration(name)) {
            // @ts-expect-error Some integrations don't take arguments but it doesn't hurt to pass one.
            // eslint-disable-next-line import/namespace
            return Object.keys(opt as Record<string, unknown>).length ? SentryCore[importName](opt) : SentryCore[importName]()
          } else if (isServerNodeIntegration(name)) {
            // @ts-expect-error Some integrations don't take arguments but it doesn't hurt to pass one.
            return Object.keys(opt as Record<string, unknown>).length ? new SentryNodeIntegrations[name](opt) : new SentryNodeIntegrations[name]()
          } else if (isServerPlugabbleIntegration(name)) {
            // @ts-expect-error Some integrations don't take arguments but it doesn't hurt to pass one.
            // eslint-disable-next-line import/namespace
            return Object.keys(opt as Record<string, unknown>).length ? PluggableIntegrations[importName](opt) : PluggableIntegrations[importName]()
          } else {
            throw new Error(`Unsupported server integration "${name}"`)
          }
        } catch (error) {
          throw new Error(`Failed initializing server integration "${name}".\n${error}`)
        }
      }),
    ...customIntegrations,
  ]

  const disabledIntegrationKeys = getDisabledIntegrationKeys(options.serverIntegrations)

  // Use a function to be able to filter out default integrations.
  options.config.integrations = (defaultIntegrations) => {
    return [
      ...defaultIntegrations.filter(integration => !disabledIntegrationKeys.includes(integration.name)),
      ...resolvedIntegrations,
    ]
  }

  return {
    config: {
      dsn: options.dsn,
      ...options.config,
    },
    apiMethods: await getApiMethods('@sentry/node'),
    lazy: options.lazy,
    logMockCalls: options.logMockCalls, // for mocked only
    tracing: options.tracing,
  }
}

function getServerRuntimeConfig (nuxt: Nuxt, options: Readonly<ModuleConfiguration>): Partial<ModuleConfiguration['config']> | undefined {
  const { publicRuntimeConfig } = nuxt.options
  const { runtimeConfigKey } = options
  if (publicRuntimeConfig && typeof (publicRuntimeConfig) !== 'function' && runtimeConfigKey in publicRuntimeConfig) {
    return defu(
      publicRuntimeConfig[runtimeConfigKey].serverConfig as Partial<ModuleConfiguration['serverConfig']>,
      publicRuntimeConfig[runtimeConfigKey].config as Partial<ModuleConfiguration['config']>,
    )
  }
}
