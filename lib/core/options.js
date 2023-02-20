import merge from 'lodash.mergewith'
import * as Integrations from '@sentry/integrations'
import { canInitialize } from './utils'

export const PLUGGABLE_INTEGRATIONS = ['CaptureConsole', 'Debug', 'Dedupe', 'ExtraErrorData', 'HttpClient', 'ReportingObserver', 'RewriteFrames']
export const BROWSER_INTEGRATIONS = ['InboundFilters', 'FunctionToString', 'TryCatch', 'Breadcrumbs', 'GlobalHandlers', 'LinkedErrors', 'HttpContext']
const SERVER_INTEGRATIONS = ['CaptureConsole', 'Debug', 'Dedupe', 'ExtraErrorData', 'RewriteFrames', 'Modules', 'Transaction']

/** @param {import('../../types/sentry').IntegrationsConfiguration} integrations */
const filterDisabledIntegrations = integrations => Object.keys(integrations).filter(key => integrations[key])

/**
 * @param {string} packageName
 */
async function getApiMethods (packageName) {
  const packageApi = await import(packageName)

  const apiMethods = []
  for (const key in packageApi) {
    // @ts-ignore
    if (typeof packageApi[key] === 'function') {
      apiMethods.push(key)
    }
  }

  return apiMethods
}

/**
 * @param {import('../../types/sentry').ResolvedModuleConfiguration} moduleOptions
 * @return {Promise<string | undefined>}
 */
export async function resolveRelease (moduleOptions) {
  if (!('release' in moduleOptions.config)) {
    // Determine "config.release" automatically from local repo if not provided.
    try {
      // @ts-ignore
      const SentryCli = await (import('@sentry/cli').then(m => m.default || m))
      const cli = new SentryCli()
      return (await cli.releases.proposeVersion()).trim()
    } catch {
      // Ignore
    }
  }
}

/**
 * @param {import('../../types/sentry').ResolvedModuleConfiguration} options
 * @param {string[]} apiMethods
 * @param {import('consola').Consola} logger
 */
function resolveLazyOptions (options, apiMethods, logger) {
  if (options.lazy) {
    const defaultLazyOptions = {
      injectMock: true,
      injectLoadHook: false,
      mockApiMethods: true,
      chunkName: 'sentry',
      webpackPrefetch: false,
      webpackPreload: false,
    }

    options.lazy = /** @type {Required<import('../../types/sentry').LazyConfiguration>} */(
      merge({}, defaultLazyOptions, options.lazy)
    )

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
}

/**
 * @param {import('../../types/sentry').ModuleConfiguration} options
 * @param {NonNullable<import('../../types/sentry').ModuleConfiguration['config']>} config
 */
function resolveTracingOptions (options, config) {
  if (!options.tracing) {
    return
  }
  /** @type {NonNullable<import('../../types/sentry').TracingConfiguration>} */
  const defaultOptions = {
    tracesSampleRate: 1,
    browserTracing: {},
    vueOptions: {
      trackComponents: true,
    },
  }
  const userOptions = typeof options.tracing === 'boolean' ? {} : options.tracing
  /** @type {NonNullable<import('../../types/sentry').TracingConfiguration>} */
  const tracingOptions = merge(defaultOptions, userOptions)
  if (config.tracesSampleRate === undefined) {
    config.tracesSampleRate = tracingOptions.tracesSampleRate
  }
  options.tracing = tracingOptions
}

/**
 * @param {ThisParameterType<import('@nuxt/types').Module>} moduleContainer
 * @param {import('../../types/sentry').ResolvedModuleConfiguration} moduleOptions
 * @param {import('consola').Consola} logger
 * @return {Promise<any>}
 */
export async function resolveClientOptions (moduleContainer, moduleOptions, logger) {
  /** @type {import('../../types/sentry').ResolvedModuleConfiguration} */
  const options = merge({}, moduleOptions)
  options.config = merge({}, options.config)

  let clientConfigPath
  if (typeof (options.clientConfig) === 'string') {
    clientConfigPath = moduleContainer.nuxt.resolver.resolveAlias(options.clientConfig)
  } else {
    options.config = merge(options.config, options.clientConfig)
  }

  const apiMethods = await getApiMethods('@sentry/vue')
  resolveLazyOptions(options, apiMethods, logger)
  resolveTracingOptions(options, options.config)

  for (const name of Object.keys(options.clientIntegrations)) {
    if (!PLUGGABLE_INTEGRATIONS.includes(name) && !BROWSER_INTEGRATIONS.includes(name)) {
      logger.warn(`Sentry clientIntegration "${name}" is not recognized and will be ignored.`)
      delete options.clientIntegrations[name]
    }
  }

  let customClientIntegrations
  if (options.customClientIntegrations) {
    if (typeof (options.customClientIntegrations) === 'string') {
      customClientIntegrations = moduleContainer.nuxt.resolver.resolveAlias(options.customClientIntegrations)
    } else {
      logger.warn(`Invalid customClientIntegrations option. Expected a file path, got "${typeof (options.customClientIntegrations)}".`)
    }
  }

  return {
    PLUGGABLE_INTEGRATIONS,
    BROWSER_INTEGRATIONS,
    dev: moduleContainer.options.dev,
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
        // @ts-ignore
        res[key] = options.clientIntegrations[key]
        return res
      }, {}),
  }
}

/**
 * @param {ThisParameterType<import('@nuxt/types').Module>} moduleContainer
 * @param {import('../../types/sentry').ResolvedModuleConfiguration} moduleOptions
 * @param {import('consola').Consola} logger
 * @return {Promise<any>}
 */
export async function resolveServerOptions (moduleContainer, moduleOptions, logger) {
  /** @type {import('../../types/sentry').ResolvedModuleConfiguration} */
  const options = merge({}, moduleOptions)

  for (const name of Object.keys(options.serverIntegrations)) {
    if (!SERVER_INTEGRATIONS.includes(name)) {
      logger.warn(`Sentry serverIntegration "${name}" is not recognized and will be ignored.`)
      delete options.serverIntegrations[name]
    }
  }

  let customIntegrations = []
  if (options.customServerIntegrations) {
    const resolvedPath = moduleContainer.nuxt.resolver.resolveAlias(options.customServerIntegrations)
    try {
      customIntegrations = (await import(resolvedPath).then(m => m.default || m))()
      if (!Array.isArray(customIntegrations)) {
        logger.error(`Invalid value returned from customServerIntegrations plugin. Expected an array, got "${typeof (customIntegrations)}".`)
      }
    } catch (error) {
      logger.error(`Error handling the customServerIntegrations plugin:\n${error}`)
    }
  }

  const defaultConfig = {
    dsn: options.dsn,
    intergrations: [
      ...filterDisabledIntegrations(options.serverIntegrations)
        .map((name) => {
          const opt = options.serverIntegrations[name]
          // @ts-ignore
          return Object.keys(opt).length ? new Integrations[name](opt) : new Integrations[name]()
        }),
      ...customIntegrations,
    ],
  }

  let serverConfig = options.serverConfig
  if (typeof (serverConfig) === 'string') {
    const resolvedPath = moduleContainer.nuxt.resolver.resolveAlias(options.serverConfig)
    try {
      serverConfig = (await import(resolvedPath).then(m => m.default || m))()
    } catch (error) {
      logger.error(`Error handling the serverConfig plugin:\n${error}`)
    }
  }

  options.config = merge(defaultConfig, options.config, serverConfig, getRuntimeConfig(moduleContainer, options))

  const apiMethods = await getApiMethods('@sentry/node')
  resolveLazyOptions(options, apiMethods, logger)
  resolveTracingOptions(options, options.config)

  return {
    config: options.config,
    apiMethods,
    lazy: options.lazy,
    logMockCalls: options.logMockCalls, // for mocked only
  }
}

/**
 * @param {ThisParameterType<import('@nuxt/types').Module>} moduleContainer
 * @param {import('../../types/sentry').ResolvedModuleConfiguration} options
 * @return {import('../../types/sentry').ModuleConfiguration['config']}
 */
function getRuntimeConfig (moduleContainer, options) {
  const { publicRuntimeConfig } = moduleContainer.options
  const { runtimeConfigKey } = options
  if (publicRuntimeConfig && typeof (publicRuntimeConfig) !== 'function' && runtimeConfigKey in publicRuntimeConfig) {
    return merge(options.config, publicRuntimeConfig[runtimeConfigKey].config, publicRuntimeConfig[runtimeConfigKey].serverConfig)
  }
}
