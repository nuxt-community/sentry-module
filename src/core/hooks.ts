import { fileURLToPath } from 'url'
import { resolve, posix } from 'path'
import type { Nuxt } from '@nuxt/schema'
import type { Consola } from 'consola'
import { defu } from 'defu'
import { addPluginTemplate, addTemplate } from '@nuxt/kit'
import type { Configuration as WebpackConfig } from 'webpack'
import type { SentryCliPluginOptions } from '@sentry/webpack-plugin'
import type { Options } from '@sentry/types'
import * as Sentry from '@sentry/node'
import type { ModuleConfiguration } from '../../types'
import { clientSentryEnabled, serverSentryEnabled, envToBool, canInitialize } from './utils'
import { resolveRelease, resolvedClientOptions, resolveClientOptions, resolvedServerOptions, resolveServerOptions } from './options'

const RESOLVED_RELEASE_FILENAME = 'sentry.release.config.js'

/**
 * Resolves the options and creates the plugins and the templates at build time.
 *
 * @param      {Nuxt} nuxt
 * @param      {ModuleConfiguration} moduleOptions The module options
 * @param      {Consola} logger The logger
 * @return     {Promise<void>}
 */
export async function buildHook (nuxt: Nuxt, moduleOptions: ModuleConfiguration, logger: Consola): Promise<void> {
  const release = await resolveRelease(moduleOptions)

  const templateDir = fileURLToPath(new URL('./templates', import.meta.url))

  const pluginOptionClient = clientSentryEnabled(moduleOptions) ? (moduleOptions.lazy ? 'lazy' : 'client') : 'mocked'
  const clientOptions: resolvedClientOptions = defu({ config: { release } }, await resolveClientOptions(nuxt, moduleOptions, logger))
  addPluginTemplate({
    src: resolve(templateDir, `plugin.${pluginOptionClient}.js`),
    fileName: 'sentry.client.js',
    mode: 'client',
    options: clientOptions,
  })

  const pluginOptionServer = serverSentryEnabled(moduleOptions) ? 'server' : 'mocked'
  const serverOptions: resolvedServerOptions = defu({ config: { release } }, await resolveServerOptions(nuxt, moduleOptions, logger))
  addPluginTemplate({
    src: resolve(templateDir, `plugin.${pluginOptionServer}.js`),
    fileName: 'sentry.server.js',
    mode: 'server',
    options: serverOptions,
  })

  if (serverSentryEnabled(moduleOptions)) {
    addTemplate({
      src: resolve(templateDir, 'options.ejs'),
      fileName: RESOLVED_RELEASE_FILENAME,
      options: { release },
    })
  }
}

/**
 * Handler for the 'webpack:config' hook
 *
 * @param      {Nuxt} nuxt
 * @param      {WebpackConfig} webpackConfigs The webpack configs
 * @param      {ModuleConfiguration & { publishRelease: SentryCliPluginOptions }} options The module options
 * @param      {Consola} logger The logger
 * @return     {Promise<void>}
 */
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
    // @ts-ignore
    if (typeof (nuxtOptions.router.base) === 'string' && typeof (nuxtOptions.build.publicPath) === 'string') {
      // @ts-ignore
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

/**
 * Initializes the sentry.
 *
 * @param      {Nuxt} nuxt
 * @param      {ModuleConfiguration} moduleOptions
 * @param      {Consola} logger
 * @return     {Promise<void>}
 */
export async function initializeServerSentry (nuxt: Nuxt, moduleOptions: ModuleConfiguration, logger: Consola): Promise<void> {
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
