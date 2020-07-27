import { resolve, posix } from 'path'
import consola from 'consola'
import deepMerge from 'deepmerge'
import * as Sentry from '@sentry/node'
import * as Integrations from '@sentry/integrations'
import WebpackPlugin from '@sentry/webpack-plugin'

const SERVER_CONFIG_FILENAME = 'sentry.server.config.js'
const logger = consola.withScope('nuxt:sentry')

const filterDisabledIntegration = integrations => Object.keys(integrations)
  .filter(key => integrations[key])

/** @type {import('@nuxt/types').Module} */
export default function SentryModule (moduleOptions) {
  const defaults = {
    lazy: false,
    dsn: process.env.SENTRY_DSN || false,
    disabled: process.env.SENTRY_DISABLED || false,
    initialize: process.env.SENTRY_INITIALIZE || true,
    disableClientSide: process.env.SENTRY_DISABLE_CLIENT_SIDE || false,
    disableServerSide: process.env.SENTRY_DISABLE_SERVER_SIDE || false,
    publishRelease: process.env.SENTRY_PUBLISH_RELEASE || false,
    disableServerRelease: process.env.SENTRY_DISABLE_SERVER_RELEASE || false,
    disableClientRelease: process.env.SENTRY_DISABLE_CLIENT_RELEASE || false,
    logMockCalls: true,
    attachCommits: process.env.SENTRY_AUTO_ATTACH_COMMITS || false,
    sourceMapStyle: 'source-map',
    repo: process.env.SENTRY_RELEASE_REPO || false,
    clientIntegrations: {
      Dedupe: {},
      ExtraErrorData: {},
      ReportingObserver: {},
      RewriteFrames: {},
      Vue: { attachProps: true }
    },
    serverIntegrations: {
      Dedupe: {},
      ExtraErrorData: {},
      RewriteFrames: {},
      Transaction: {}
    },
    config: {
      environment: this.options.dev ? 'development' : 'production'
    },
    serverConfig: {},
    clientConfig: {},
    webpackConfig: {
      include: [],
      ignore: [
        'node_modules',
        '.nuxt/dist/client/img'
      ],
      configFile: '.sentryclirc'
    }
  }

  const topLevelOptions = this.options.sentry || {}
  const options = deepMerge.all([defaults, topLevelOptions, moduleOptions])

  const canInitialize = Boolean(options.initialize && options.dsn)
  const clientSentryEnabled = !options.disabled && !options.disableClientSide
  const serverSentryEnabled = !options.disabled && !options.disableServerSide

  if (serverSentryEnabled) {
    this.nuxt.hook('render:setupMiddleware', app => app.use(Sentry.Handlers.requestHandler()))
    this.nuxt.hook('render:errorMiddleware', app => app.use(Sentry.Handlers.errorHandler()))
    this.nuxt.hook('generate:routeFailed', ({ route, errors }) => {
      errors.forEach(({ error }) => Sentry.withScope((scope) => {
        scope.setExtra('route', route)
        Sentry.captureException(error)
      }))
    })
  }

  const boolToText = value => value ? 'enabled' : 'disabled'
  if (canInitialize && (clientSentryEnabled || serverSentryEnabled)) {
    const status = `(client side: ${boolToText(clientSentryEnabled)}, server side: ${boolToText(serverSentryEnabled)})`
    logger.success(`Sentry reporting is enabled ${status}`)
  } else {
    let why
    if (options.disabled) {
      why = '"disabled" option has been set'
    } else if (!options.dsn) {
      why = 'no DSN has been provided'
    } else if (!options.initialize) {
      why = '"initialize" option has been set to false'
    } else {
      why = 'both client and server side clients are disabled'
    }
    logger.info(`Sentry reporting is disabled (${why})`)
  }

  this.nuxt.hook('build:before', async () => {
    if (!options.config.release) {
      // Determine "config.release" automatically from local repo if not provided.
      const SentryCli = (await import('@sentry/cli')).default
      const cli = new SentryCli(null, { silent: true })
      options.config.release = await cli.releases.proposeVersion()
        .then(version => `${version}`.trim())
        .catch()
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

      options.lazy = Object.assign({}, defaultLazyOptions, options.lazy)

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

    // Register the client plugin
    const pluginOptionClient = clientSentryEnabled ? (options.lazy ? 'lazy' : 'client') : 'mocked'
    this.addPlugin({
      src: resolve(__dirname, `plugin.${pluginOptionClient}.js`),
      fileName: 'sentry.client.js',
      mode: 'client',
      options: {
        dev: this.options.dev,
        config: {
          dsn: options.dsn,
          ...options.clientConfig
        },
        lazy: options.lazy,
        apiMethods,
        logMockCalls: options.logMockCalls, // for mocked only
        initialize: canInitialize,
        integrations: filterDisabledIntegration(options.clientIntegrations)
          .reduce((res, key) => {
            res[key] = options.clientIntegrations[key]
            return res
          }, {})
      }
    })

    // Register the server plugin
    const pluginOptionServer = serverSentryEnabled ? 'server' : 'mocked'
    this.addPlugin({
      src: resolve(__dirname, `plugin.${pluginOptionServer}.js`),
      fileName: 'sentry.server.js',
      mode: 'server',
      options: {
        dev: this.options.dev,
        lazy: options.lazy,
        apiMethods,
        logMockCalls: options.logMockCalls // for mocked only
      }
    })

    if (serverSentryEnabled) {
      this.addTemplate({
        src: resolve(__dirname, 'templates', 'options.ejs'),
        fileName: SERVER_CONFIG_FILENAME,
        options: {
          config: options.serverConfig
        }
      })

      await initSentry()
    }
  })

  if (serverSentryEnabled) {
    this.nuxt.hook('listen', async () => {
      await initSentry()
    })
  }

  // Enable publishing of sourcemaps
  if (options.publishRelease && !options.disabled && !this.options.dev) {
    this.nuxt.hook('webpack:config', (webpackConfigs) => {
      if (!options.webpackConfig.urlPrefix) {
        // Set urlPrefix to match resources on the client. That's not technically correct for the server
        // source maps, but it is what it is for now.
        const publicPath = posix.join(this.options.router.base, this.options.build.publicPath)
        options.webpackConfig.urlPrefix = publicPath.startsWith('/') ? `~${publicPath}` : publicPath
      }

      if (typeof options.webpackConfig.include === 'string') {
        options.webpackConfig.include = [options.webpackConfig.include]
      }

      const { buildDir } = this.options

      if (!options.disableServerRelease) {
        options.webpackConfig.include.push(`${buildDir}/dist/server`)
      }
      if (!options.disableClientRelease) {
        options.webpackConfig.include.push(`${buildDir}/dist/client`)
      }

      if (options.config.release && !options.webpackConfig.release) {
        options.webpackConfig.release = options.config.release
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

      logger.info('Enabling uploading of release sourcemaps to Sentry')
    })
  }

  async function initSentry () {
    // Initializes server-side Sentry directly from the module.
    try {
      const optionsPath = resolve(this.options.buildDir, SERVER_CONFIG_FILENAME)
      const { config } = await import(optionsPath)
      options.serverConfig = config
    } catch {
      // Ignored
    }

    if (canInitialize) {
      Sentry.init({
        dsn: options.dsn,
        ...options.serverConfig,
        integrations: filterDisabledIntegration(options.serverIntegrations)
          .map(name => new Integrations[name](options.serverIntegrations[name]))
      })
    }

    process.sentry = Sentry
  }
}

async function getBrowserApiMethods () {
  const SentryBrowser = await import('@sentry/browser')

  const browserMethods = []
  for (const key in SentryBrowser) {
    if (typeof SentryBrowser[key] === 'function') {
      browserMethods.push(key)
    }
  }

  return browserMethods
}
