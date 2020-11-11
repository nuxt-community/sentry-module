import { resolve, posix } from 'path'
import deepMerge from 'deepmerge'
import * as Integrations from '@sentry/integrations'
import * as Sentry from '@sentry/node'
import WebpackPlugin from '@sentry/webpack-plugin'
import { canInitialize, clientSentryEnabled, serverSentryEnabled } from './utils'

const SERVER_CONFIG_FILENAME = 'sentry.server.config.js'
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
 * @param      {Required<import('../../types/sentry').ModuleConfiguration>} options The module options
 * @param      {import('consola').Consola} logger The logger
 * @return     {Promise<void>}
 */
export async function buildHook (moduleContainer, options, logger) {
  if (!options.config.release) {
    // Determine "config.release" automatically from local repo if not provided.
    try {
      // @ts-ignore
      const SentryCli = (await import('@sentry/cli')).default
      const cli = new SentryCli()
      options.config.release = (await cli.releases.proposeVersion()).trim()
    } catch {
      // Ignore
    }
  }

  options.serverConfig = deepMerge.all([options.config, options.serverConfig])
  options.clientConfig = deepMerge.all([options.config, options.clientConfig])

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
      Object.assign({}, defaultLazyOptions, options.lazy)
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
    options.tracing = deepMerge.all([{
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
    }, typeof options.tracing === 'boolean' ? {} : options.tracing])
    options.clientConfig.tracesSampleRate = options.tracing.tracesSampleRate
  }

  // Register the client plugin
  const pluginOptionClient = clientSentryEnabled(options) ? (options.lazy ? 'lazy' : 'client') : 'mocked'
  moduleContainer.addPlugin({
    src: resolve(__dirname, '..', `plugin.${pluginOptionClient}.js`),
    fileName: 'sentry.client.js',
    mode: 'client',
    options: {
      dev: moduleContainer.options.dev,
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
 * @param      {Required<import('../../types/sentry').ModuleConfiguration>} options The module options
 * @param      {import('consola').Consola} logger The logger
 * @return     {void}
 */
export function webpackConfigHook (moduleContainer, webpackConfigs, options, logger) {
  if (!options.webpackConfig.urlPrefix) {
    // Set urlPrefix to match resources on the client. That's not technically correct for the server
    // source maps, but it is what it is for now.
    const publicPath = posix.join(moduleContainer.options.router.base, moduleContainer.options.build.publicPath)
    options.webpackConfig.urlPrefix = publicPath.startsWith('/') ? `~${publicPath}` : publicPath
  }

  if (typeof options.webpackConfig.include === 'string') {
    options.webpackConfig.include = [options.webpackConfig.include]
  }

  const { buildDir } = moduleContainer.options

  if (!options.disableServerRelease) {
    options.webpackConfig.include.push(`${buildDir}/dist/server`)
  }
  if (!options.disableClientRelease) {
    options.webpackConfig.include.push(`${buildDir}/dist/client`)
  }

  if (options.config.release && !options.webpackConfig.release) {
    options.webpackConfig.release = options.config.release
  }

  if (!options.webpackConfig.release) {
    // We've already tried to determine "release" manually using Sentry CLI so to avoid webpack
    // plugin crashing, we'll just bail here.
    logger.warn('Sentry release will not be published because "config.release" was not set nor it ' +
                'was possible to determine it automatically from the repository')
    return
  }

  if (options.attachCommits) {
    options.webpackConfig.setCommits = {
      auto: true
    }

    if (options.repo) {
      options.webpackConfig.setCommits.repo = options.repo
    }
  }

  for (const config of webpackConfigs) {
    config.devtool = options.sourceMapStyle
  }

  // Add WebpackPlugin to last build config

  const config = webpackConfigs[webpackConfigs.length - 1]

  config.plugins = config.plugins || []
  config.plugins.push(new WebpackPlugin(options.webpackConfig))
}

/**
 * Initializes the sentry.
 *
 * @param      {any} moduleContainer The module container
 * @param      {Required<import('../../types/sentry').ModuleConfiguration>} options The module options
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

  if (canInitialize(options)) {
    Sentry.init({
      dsn: options.dsn,
      ...options.serverConfig,
      integrations: filterDisabledIntegration(options.serverIntegrations)
        // @ts-ignore
        .map(name => new Integrations[name](options.serverIntegrations[name]))
    })
  }

  process.sentry = Sentry
}
