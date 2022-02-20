import { resolve, posix } from 'path'
import merge from 'lodash.mergewith'
import * as Integrations from '@sentry/integrations'
import * as Sentry from '@sentry/node'
import { canInitialize, clientSentryEnabled, envToBool, serverSentryEnabled } from './utils'

const SERVER_CONFIG_FILENAME = 'sentry.server.config.js'
const SENTRY_PLUGGABLE_INTEGRATIONS = ['CaptureConsole', 'Debug', 'Dedupe', 'ExtraErrorData', 'ReportingObserver', 'RewriteFrames', 'Vue']
const SENTRY_BROWSER_INTEGRATIONS = ['InboundFilters', 'FunctionToString', 'TryCatch', 'Breadcrumbs', 'GlobalHandlers', 'LinkedErrors', 'UserAgent']
const SENTRY_SERVER_INTEGRATIONS = ['CaptureConsole', 'Debug', 'Dedupe', 'ExtraErrorData', 'RewriteFrames', 'Modules', 'Transaction']

/** @param {import('../../types/sentry').IntegrationsConfiguration} integrations */
const filterDisabledIntegration = integrations => Object.keys(integrations).filter(key => integrations[key])

async function getBrowserApiMethods () {
  const SentryBrowser = await import('@sentry/browser')

  const browserMethods = []
  for (const key in SentryBrowser) {
    // @ts-ignore
    if (typeof SentryBrowser[key] === 'function') {
      browserMethods.push(key)
    }
  }

  return browserMethods
}

/**
 * Handler for the 'build:before' hook.
 *
 * @param      {any} moduleContainer The module container
 * @param      {import('../../types/sentry').ResolvedModuleConfiguration} options The module options
 * @param      {import('consola').Consola} logger The logger
 * @return     {Promise<void>}
 */
export async function buildHook (moduleContainer, options, logger) {
  if (!('release' in options.config)) {
    // Determine "config.release" automatically from local repo if not provided.
    try {
      // @ts-ignore
      const SentryCli = await (import('@sentry/cli').then(m => m.default || m))
      const cli = new SentryCli()
      options.config.release = (await cli.releases.proposeVersion()).trim()
    } catch {
      // Ignore
    }
  }

  options.serverConfig = merge({}, options.config, options.serverConfig)
  options.clientConfig = merge({}, options.config, options.clientConfig)

  const apiMethods = await getBrowserApiMethods()

  // Set "lazy" defaults.
  if (options.lazy) {
    const defaultLazyOptions = {
      injectMock: true,
      injectLoadHook: false,
      mockApiMethods: true,
      chunkName: 'sentry',
      webpackPrefetch: false,
      webpackPreload: false
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
        logger.warn('Some specified methods to mock weren\'t found in @sentry/browser:', notfoundMethods)
      }

      if (!options.lazy.mockApiMethods.includes('captureException')) {
        // always add captureException if a sentry mock is requested
        options.lazy.mockApiMethods.push('captureException')
      }
    }
  }
  if (options.tracing) {
    options.tracing = merge({
      tracesSampleRate: 1.0,
      vueOptions: {
        tracing: true,
        tracingOptions: {
          hooks: ['mount', 'update'],
          timeout: 2000,
          trackComponents: true
        }
      },
      browserOptions: {}
    }, typeof options.tracing === 'boolean' ? {} : options.tracing)
    options.clientConfig.tracesSampleRate = options.tracing.tracesSampleRate
  }

  for (const name of Object.keys(options.clientIntegrations)) {
    if (!SENTRY_PLUGGABLE_INTEGRATIONS.includes(name) && !SENTRY_BROWSER_INTEGRATIONS.includes(name)) {
      logger.warn(`Sentry clientIntegration "${name}" is not recognized and will be ignored.`)
      delete options.clientIntegrations[name]
    }
  }

  for (const name of Object.keys(options.serverIntegrations)) {
    if (!SENTRY_SERVER_INTEGRATIONS.includes(name)) {
      logger.warn(`Sentry serverIntegration "${name}" is not recognized and will be ignored.`)
      delete options.serverIntegrations[name]
    }
  }

  // Register the client plugin
  const pluginOptionClient = clientSentryEnabled(options) ? (options.lazy ? 'lazy' : 'client') : 'mocked'
  moduleContainer.addPlugin({
    src: resolve(__dirname, '..', `plugin.${pluginOptionClient}.js`),
    fileName: 'sentry.client.js',
    mode: 'client',
    options: {
      SENTRY_PLUGGABLE_INTEGRATIONS,
      SENTRY_BROWSER_INTEGRATIONS,
      dev: moduleContainer.options.dev,
      runtimeConfigKey: options.runtimeConfigKey,
      config: {
        dsn: options.dsn,
        ...options.clientConfig
      },
      lazy: options.lazy,
      apiMethods,
      logMockCalls: options.logMockCalls, // for mocked only
      tracing: options.tracing,
      initialize: canInitialize(options),
      integrations: filterDisabledIntegration(options.clientIntegrations)
        .reduce((res, key) => {
          // @ts-ignore
          res[key] = options.clientIntegrations[key]
          return res
        }, {})
    }
  })

  // Register the server plugin
  const pluginOptionServer = serverSentryEnabled(options) ? 'server' : 'mocked'
  moduleContainer.addPlugin({
    src: resolve(__dirname, '..', `plugin.${pluginOptionServer}.js`),
    fileName: 'sentry.server.js',
    mode: 'server',
    options: {
      dev: moduleContainer.options.dev,
      runtimeConfigKey: options.runtimeConfigKey,
      lazy: options.lazy,
      apiMethods,
      logMockCalls: options.logMockCalls // for mocked only
    }
  })

  if (serverSentryEnabled(options)) {
    moduleContainer.addTemplate({
      src: resolve(__dirname, '..', 'templates', 'options.ejs'),
      fileName: SERVER_CONFIG_FILENAME,
      options: {
        config: options.serverConfig
      }
    })

    await initializeServerSentry(moduleContainer, options)
  }
}

/**
 * Handler for the 'webpack:config' hook
 *
 * @param      {any} moduleContainer The module container
 * @param      {any[]} webpackConfigs The webpack configs
 * @param      {Required<import('../../types/sentry').ResolvedModuleConfiguration>} options The module options
 * @param      {import('consola').Consola} logger The logger
 * @return     {Promise<void>}
 */
export async function webpackConfigHook (moduleContainer, webpackConfigs, options, logger) {
  /** @type {typeof import('@sentry/webpack-plugin')} */
  let WebpackPlugin
  try {
    WebpackPlugin = await (import('@sentry/webpack-plugin').then(m => m.default || m))
  } catch {
    logger.error('The "@sentry/webpack-plugin" package must be installed as a dev dependency to use the "publishRelease" option.')
    return
  }

  /** @type {import('@sentry/webpack-plugin').SentryCliPluginOptions} */
  const publishRelease = merge({}, options.publishRelease)

  if (!publishRelease.urlPrefix) {
    // Set urlPrefix to match resources on the client. That's not technically correct for the server
    // source maps, but it is what it is for now.
    const publicPath = posix.join(moduleContainer.options.router.base, moduleContainer.options.build.publicPath)
    publishRelease.urlPrefix = publicPath.startsWith('/') ? `~${publicPath}` : publicPath
  }

  if (!Array.isArray(publishRelease.include)) {
    const { include } = publishRelease
    publishRelease.include = [...(include ? [include] : [])]
  }

  const { buildDir } = moduleContainer.options

  if (!options.disableServerRelease) {
    publishRelease.include.push(`${buildDir}/dist/server`)
  }
  if (!options.disableClientRelease) {
    publishRelease.include.push(`${buildDir}/dist/client`)
  }

  if (options.config.release && !publishRelease.release) {
    publishRelease.release = options.config.release
  }

  if (!publishRelease.release) {
    // We've already tried to determine "release" manually using Sentry CLI so to avoid webpack
    // plugin crashing, we'll just bail here.
    logger.warn('Sentry release will not be published because "config.release" was not set nor it ' +
                'was possible to determine it automatically from the repository')
    return
  }

  const attachCommits = envToBool(process.env.SENTRY_AUTO_ATTACH_COMMITS)

  if (attachCommits) {
    publishRelease.setCommits = publishRelease.setCommits || {}

    const { setCommits } = publishRelease

    if (setCommits.auto === undefined) {
      setCommits.auto = true
    }

    const repo = process.env.SENTRY_RELEASE_REPO || ''

    if (repo && setCommits.repo === undefined) {
      setCommits.repo = repo
    }
  }

  for (const config of webpackConfigs) {
    config.devtool = options.sourceMapStyle
  }

  // Add WebpackPlugin to the last build config

  const config = webpackConfigs[webpackConfigs.length - 1]

  config.plugins = config.plugins || []
  config.plugins.push(new WebpackPlugin(publishRelease))
}

/**
 * Initializes the sentry.
 *
 * @param      {any} moduleContainer The module container
 * @param      {import('../../types/sentry').ResolvedModuleConfiguration} options The module options
 * @return     {Promise<void>}
 */
export async function initializeServerSentry (moduleContainer, options) {
  if (process.sentry) {
    return
  }

  // Initializes server-side Sentry directly from the module.
  try {
    const optionsPath = resolve(moduleContainer.options.buildDir, SERVER_CONFIG_FILENAME)
    const { config } = await import(optionsPath)
    options.serverConfig = config
  } catch {
    // Ignored
  }

  const { publicRuntimeConfig } = moduleContainer.options
  const { runtimeConfigKey } = options
  if (publicRuntimeConfig && runtimeConfigKey && publicRuntimeConfig[runtimeConfigKey]) {
    merge(options.serverConfig, publicRuntimeConfig[runtimeConfigKey].config, publicRuntimeConfig[runtimeConfigKey].serverConfig)
  }

  if (canInitialize(options)) {
    Sentry.init({
      dsn: options.dsn,
      ...options.serverConfig,
      integrations: filterDisabledIntegration(options.serverIntegrations)
        .map((name) => {
          const opt = options.serverIntegrations[name]
          // @ts-ignore
          return Object.keys(opt).length ? new Integrations[name](opt) : new Integrations[name]()
        })
    })
  }

  process.sentry = Sentry
}

export async function shutdownServerSentry () {
  if (process.sentry) {
    await process.sentry.close()
    // @ts-ignore
    process.sentry = undefined
  }
}
