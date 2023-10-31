import { fileURLToPath } from 'url'
import { resolve } from 'path'
import { defu } from 'defu'
import type { ConsolaInstance } from 'consola'
import type { Configuration as WebpackConfig } from 'webpack'
import type { SentryWebpackPluginOptions } from '@sentry/webpack-plugin'
import type { Options } from '@sentry/types'
import * as Sentry from '@sentry/node'
import { addPluginTemplate, addTemplate, addWebpackPlugin } from './kit-shim'
import type { Nuxt } from './kit-shim'
import type { ModuleConfiguration } from './types/configuration'
import { clientSentryEnabled, serverSentryEnabled, canInitialize } from './utils'
import { resolveRelease, ResolvedClientOptions, resolveClientOptions, ResolvedServerOptions, resolveServerOptions } from './options'
import type { SentryHandlerProxy } from './options'

const RESOLVED_RELEASE_FILENAME = 'sentry.release.config.mjs'

export async function buildHook (nuxt: Nuxt, moduleOptions: ModuleConfiguration, logger: ConsolaInstance): Promise<void> {
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
  if (pluginOptionClient !== 'mocked') {
    addTemplate({
      src: resolve(templateDir, 'client.shared.js'),
      filename: 'sentry.client.shared.js',
      options: clientOptions,
    })
  }

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

  // Tree shake RRWEB code if Replay integration not enabled.
  if (!clientOptions.integrations.Replay) {
    const webpack = await import('webpack').then(m => m.default || m)
    addWebpackPlugin(new webpack.DefinePlugin({
      __RRWEB_EXCLUDE_CANVAS__: true,
      __RRWEB_EXCLUDE_IFRAME__: true,
      __RRWEB_EXCLUDE_SHADOW_DOM__: true,
    }))
  }
}

export async function webpackConfigHook (nuxt: Nuxt, webpackConfigs: WebpackConfig[], options: ModuleConfiguration, logger: ConsolaInstance): Promise<void> {
  let WebpackPlugin: typeof import('@sentry/webpack-plugin')
  try {
    WebpackPlugin = await (import('@sentry/webpack-plugin').then(m => m.default || m))
  } catch {
    throw new Error('The "@sentry/webpack-plugin" package must be installed as a dev dependency to use the "publishRelease" option.')
  }

  const publishRelease: SentryWebpackPluginOptions = defu(options.publishRelease)
  if (!publishRelease.sourcemaps) {
    publishRelease.sourcemaps = {}
  }
  if (!publishRelease.sourcemaps.ignore) {
    publishRelease.sourcemaps.ignore = []
  }
  if (!Array.isArray(publishRelease.sourcemaps.ignore)) {
    publishRelease.sourcemaps.ignore = [publishRelease.sourcemaps.ignore]
  }
  if (!publishRelease.release) {
    publishRelease.release = {}
  }
  publishRelease.release.name = publishRelease.release.name || options.config.release || await resolveRelease(options)
  if (!publishRelease.release.name) {
    // We've already tried to determine "release" manually using Sentry CLI so to avoid webpack plugin crashing, we'll just bail here.
    logger.warn('Sentry release will not be published because "config.release" or "publishRelease.release.name" was not set nor it ' +
                'was possible to determine it automatically from the repository.')
    return
  }

  for (const config of webpackConfigs) {
    config.devtool = options.sourceMapStyle
    config.plugins = config.plugins || []
    config.plugins.push(WebpackPlugin.sentryWebpackPlugin(publishRelease))
  }
}

export async function initializeServerSentry (nuxt: Nuxt, moduleOptions: ModuleConfiguration, sentryHandlerProxy: SentryHandlerProxy, logger: ConsolaInstance): Promise<void> {
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

  process.sentry = Sentry

  if (canInitialize(moduleOptions)) {
    Sentry.init(config)
    sentryHandlerProxy.errorHandler = Sentry.Handlers.errorHandler()
    sentryHandlerProxy.requestHandler = Sentry.Handlers.requestHandler(moduleOptions.requestHandlerConfig)
    if (serverOptions.tracing) {
      sentryHandlerProxy.tracingHandler = Sentry.Handlers.tracingHandler()
    }
  }
}

export async function shutdownServerSentry (): Promise<void> {
  if (process.sentry) {
    await process.sentry.close()
    // @ts-expect-error not mutable in types
    process.sentry = undefined
  }
}
