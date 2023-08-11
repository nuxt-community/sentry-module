import type { ConsolaInstance } from 'consola'
import { defu } from 'defu'
import { relative } from 'pathe'
import { Integrations as ServerIntegrations, autoDiscoverNodePerformanceMonitoringIntegrations } from '@sentry/node'
import type Sentry from '@sentry/node'
import * as PluggableIntegrations from '@sentry/integrations'
import type { Integration, Options } from '@sentry/types'
import type { Replay } from '@sentry/vue'
import type { AllIntegrations, ClientIntegrations, LazyConfiguration, ProfilingIntegration, TracingConfiguration } from './types/configuration'
import type { ModuleConfiguration } from './types'
import { Nuxt, resolveAlias } from './kit-shim'
import { canInitialize } from './utils'

export interface SentryHandlerProxy {
    errorHandler: ReturnType<typeof Sentry.Handlers.errorHandler>
    requestHandler: ReturnType<typeof Sentry.Handlers.requestHandler>
    tracingHandler: ReturnType<typeof Sentry.Handlers.tracingHandler>
}

// Enabled by default in Vue - https://docs.sentry.io/platforms/javascript/guides/vue/configuration/integrations/default/
export const BROWSER_INTEGRATIONS = ['Breadcrumbs', 'Dedupe', 'FunctionToString', 'GlobalHandlers', 'HttpContext', 'InboundFilters', 'LinkedErrors', 'TryCatch']
// Optional in Vue - https://docs.sentry.io/platforms/javascript/guides/vue/configuration/integrations/plugin/
export const BROWSER_PLUGGABLE_INTEGRATIONS = ['CaptureConsole', 'ContextLines', 'Debug', 'ExtraErrorData', 'HttpClient', 'ReportingObserver', 'RewriteFrames']
// Optional, separately exported integration - https://docs.sentry.io/platforms/javascript/guides/vue/session-replay/
export const BROWSER_VUE_INTEGRATIONS = ['Replay']
// Enabled by default in Node.js - https://docs.sentry.io/platforms/node/configuration/integrations/default-integrations/
const SERVER_INTEGRATIONS = ['Console', 'ContextLines', 'FunctionToString', 'Http', 'InboundFilters', 'LinkedErrors', 'LocalVariables', 'Modules', 'OnUncaughtException', 'OnUnhandledRejection', 'RequestData']
// Optional in Node.js - https://docs.sentry.io/platforms/node/configuration/integrations/pluggable-integrations/
const SERVER_PLUGGABLE_INTEGRATIONS = ['CaptureConsole', 'Debug', 'Dedupe', 'ExtraErrorData', 'RewriteFrames', 'Transaction']
// External and optional Node.js integration - https://docs.sentry.io/platforms/node/profiling/
export const SERVER_PROFILING_INTEGRATION: keyof ProfilingIntegration = 'ProfilingIntegration'

function filterDisabledIntegrations<T extends AllIntegrations> (integrations: T): (keyof T)[] {
  return getIntegrationsKeys(integrations).filter(key => integrations[key])
}

function getIntegrationsKeys<T extends AllIntegrations> (integrations: T): (keyof T)[] {
  return Object.keys(integrations) as (keyof T)[]
}

function isBrowserDefaultIntegration (name: string): name is keyof typeof ServerIntegrations {
  return BROWSER_INTEGRATIONS.includes(name)
}

function isBrowserPluggableIntegration (name: string): name is keyof typeof PluggableIntegrations {
  return BROWSER_PLUGGABLE_INTEGRATIONS.includes(name)
}

function isBrowserVueIntegration (name: string): name is keyof { Replay: Replay } {
  return BROWSER_VUE_INTEGRATIONS.includes(name)
}

function isServerDefaultIntegration (name: string): name is keyof typeof ServerIntegrations {
  return SERVER_INTEGRATIONS.includes(name)
}

function isServerPlugabbleIntegration (name: string): name is keyof typeof PluggableIntegrations {
  return SERVER_PLUGGABLE_INTEGRATIONS.includes(name)
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
  }

  options.tracing = defu(options.tracing, defaultTracingOptions)

  if (options.config.tracesSampleRate === undefined) {
    options.config.tracesSampleRate = options.tracing.tracesSampleRate
  }
}

export type ResolvedClientOptions = {
  BROWSER_INTEGRATIONS: string[]
  BROWSER_PLUGGABLE_INTEGRATIONS: string[]
  BROWSER_VUE_INTEGRATIONS: string[]
  dev: boolean
  runtimeConfigKey: string
  config: Options
  lazy: boolean | LazyConfiguration
  apiMethods: string[]
  clientConfigPath: string | undefined
  customClientIntegrations: string | undefined
  logMockCalls: boolean
  tracing: boolean | TracingConfiguration
  initialize: boolean
  integrations: ClientIntegrations
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
    if (!isBrowserDefaultIntegration(name) && !isBrowserPluggableIntegration(name) && !isBrowserVueIntegration(name)) {
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

  return {
    BROWSER_INTEGRATIONS,
    BROWSER_PLUGGABLE_INTEGRATIONS,
    BROWSER_VUE_INTEGRATIONS,
    dev: nuxt.options.dev,
    runtimeConfigKey: options.runtimeConfigKey,
    config: {
      dsn: options.dsn,
      ...options.config,
    },
    clientConfigPath,
    lazy: options.lazy,
    apiMethods,
    customClientIntegrations,
    logMockCalls: options.logMockCalls, // for mocked only
    tracing: options.tracing,
    initialize: canInitialize(options),
    integrations: filterDisabledIntegrations(options.clientIntegrations)
      .reduce((res, key) => {
        res[key] = options.clientIntegrations[key]
        return res
      }, {} as Record<string, unknown>),
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
      options.serverConfig = (await import(resolvedPath).then(m => m.default || m))()
    } catch (error) {
      logger.error(`Error handling the serverConfig plugin:\n${error}`)
    }
  }

  options.config = defu(getServerRuntimeConfig(nuxt, options), options.serverConfig, options.config)

  for (const name of getIntegrationsKeys(options.serverIntegrations)) {
    if (!isServerDefaultIntegration(name) && !isServerPlugabbleIntegration(name) && name !== SERVER_PROFILING_INTEGRATION) {
      logger.warn(`Sentry serverIntegration "${name}" is not recognized and will be ignored.`)
      delete options.serverIntegrations[name]
    }
  }

  let customIntegrations: Integration[] = []
  if (options.customServerIntegrations) {
    const resolvedPath = resolveAlias(options.customServerIntegrations)
    try {
      customIntegrations = (await import(resolvedPath).then(m => m.default || m))()
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

  options.config.integrations = [
    // Automatically instrument Node.js libraries and frameworks
    ...(options.tracing ? autoDiscoverNodePerformanceMonitoringIntegrations() : []),
    ...filterDisabledIntegrations(options.serverIntegrations)
      .map((name) => {
        const opt = options.serverIntegrations[name]
        try {
          if (isServerDefaultIntegration(name)) {
            // @ts-expect-error Some integrations don't take arguments but it doesn't hurt to pass one.
            return Object.keys(opt as Record<string, unknown>).length ? new ServerIntegrations[name](opt) : new ServerIntegrations[name]()
          } else if (isServerPlugabbleIntegration(name)) {
            // @ts-expect-error Some integrations don't take arguments but it doesn't hurt to pass one.
            // eslint-disable-next-line import/namespace
            return Object.keys(opt as Record<string, unknown>).length ? new PluggableIntegrations[name](opt) : new PluggableIntegrations[name]()
          } else {
            throw new Error(`Unsupported server integration "${name}"`)
          }
        } catch (error) {
          throw new Error(`Failed initializing server integration "${name}".\n${error}`)
        }
      }),
    ...customIntegrations,
  ]

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
