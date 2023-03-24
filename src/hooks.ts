import { fileURLToPath } from 'url'
import { resolve, posix } from 'path'
import { defu } from 'defu'
import type { Consola } from 'consola'
import type { Configuration as WebpackConfig } from 'webpack'
import type { SentryCliPluginOptions } from '@sentry/webpack-plugin'
import type { Options } from '@sentry/types'
import * as Sentry from '@sentry/node'
import { addPluginTemplate, addTemplate, addWebpackPlugin } from './kit-shim'
import type { Nuxt } from './kit-shim'
import type { ModuleConfiguration } from './types/configuration'
import { clientSentryEnabled, serverSentryEnabled, envToBool, canInitialize } from './utils'
import { resolveRelease, ResolvedClientOptions, resolveClientOptions, ResolvedServerOptions, resolveServerOptions } from './options'
import type { SentryHandlerProxy } from './options'

const RESOLVED_RELEASE_FILENAME = 'sentry.release.config.mjs'

export async function buildHook (nuxt: Nuxt, moduleOptions: ModuleConfiguration, logger: Consola): Promise<void> {
  const release = await resolveRelease(moduleOptions)

  const templateDir = fileURLToPath(new URL('./templates', import.meta.url))

  const pluginOptionClient = clientSentryEnabled(moduleOptions) && canInitialize(moduleOptions) ? (moduleOptions.lazy ? 'lazy' : 'client') : 'mocked'
  const clientOptions: ResolvedClientOptions = defu({ config: { release } }, await resolveClientOptions(nuxt, moduleOptions, logger))
  addPluginTemplate({
    src: resolve(templateDir, `plugin.${pluginOptionClient}.js`),
    filename: 'sentry.client.js',
    mode: 'client',
    options: clientOptions,
  })

  const pluginOptionServer = serverSentryEnabled(moduleOptions) ? 'server' : 'mocked'
  const serverOptions: ResolvedServerOptions = defu({ config: { release } }, await resolveServerOptions(nuxt, moduleOptions, logger))
  addPluginTemplate({
    src: resolve(templateDir, `plugin.${pluginOptionServer}.js`),
    filename: 'sentry.server.js',
    mode: 'server',
    options: serverOptions,
  })

  if (serverSentryEnabled(moduleOptions)) {
    addTemplate({
      src: resolve(templateDir, 'options.ejs'),
      filename: RESOLVED_RELEASE_FILENAME,
      options: { release },
    })
  }

  // Tree shake debugging code if not running in dev mode and Sentry debug option is not enabled on the client.
  if (!clientOptions.dev && !clientOptions.config.debug) {
    const webpack = await import('webpack').then(m => m.default || m)
    addWebpackPlugin(new webpack.DefinePlugin({
      __SENTRY_DEBUG__: 'false',
    }))
  }
}

export async function webpackConfigHook (nuxt: Nuxt, webpackConfigs: WebpackConfig[], options: ModuleConfiguration & { publishRelease: SentryCliPluginOptions }, logger: Consola): Promise<void> {
  let WebpackPlugin: typeof import('@sentry/webpack-plugin')
  try {
    WebpackPlugin = await (import('@sentry/webpack-plugin').then(m => m.default || m))
  } catch {
    throw new Error('The "@sentry/webpack-plugin" package must be installed as a dev dependency to use the "publishRelease" option.')
  }

  const publishRelease: SentryCliPluginOptions = defu({}, options.publishRelease)
  const nuxtOptions = nuxt.options

  if (!publishRelease.urlPrefix) {
    // Set urlPrefix to match resources on the client. That's not technically correct for the server source maps, but it is what it is for now.
    if (typeof (nuxtOptions.router.base) === 'string' && typeof (nuxtOptions.build.publicPath) === 'string') {
      const publicPath = posix.join(nuxtOptions.router.base, nuxtOptions.build.publicPath)
      publishRelease.urlPrefix = publicPath.startsWith('/') ? `~${publicPath}` : publicPath
    }
  }

  if (!Array.isArray(publishRelease.include)) {
    const { include } = publishRelease
    publishRelease.include = [...(include ? [include] : [])]
  }

  const { buildDir } = nuxtOptions

  if (!options.disableServerRelease) {
    publishRelease.include.push(`${buildDir}/dist/server`)
  }
  if (!options.disableClientRelease) {
    publishRelease.include.push(`${buildDir}/dist/client`)
  }

  publishRelease.release = options.config.release || publishRelease.release || await resolveRelease(options)

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

export async function initializeServerSentry (nuxt: Nuxt, moduleOptions: ModuleConfiguration, sentryHandlerProxy: SentryHandlerProxy, logger: Consola): Promise<void> {
  if (process.sentry) {
    return
  }

  let release: string | undefined
  try {
    const path = resolve(nuxt.options.buildDir, RESOLVED_RELEASE_FILENAME)
    release = (await import(path)).release
  } catch {
    // Ignored
  }

  const serverOptions = await resolveServerOptions(nuxt, moduleOptions, logger)
  const config: Options = defu({ release }, serverOptions.config)

  if (canInitialize(moduleOptions)) {
    Sentry.init(config)
    sentryHandlerProxy.errorHandler = Sentry.Handlers.errorHandler()
    sentryHandlerProxy.requestHandler = Sentry.Handlers.requestHandler(moduleOptions.requestHandlerConfig)
    if (serverOptions.tracing) {
      // Triggers initialization of the tracing integration as a side effect.
      await import('@sentry/tracing')
      sentryHandlerProxy.tracingHandler = Sentry.Handlers.tracingHandler()
    }
  }

  process.sentry = Sentry
}

export async function shutdownServerSentry (): Promise<void> {
  if (process.sentry) {
    await process.sentry.close()
    // @ts-expect-error not mutable in types
    process.sentry = undefined
  }
}
