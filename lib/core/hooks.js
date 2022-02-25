import { resolve, posix } from 'path'
import merge from 'lodash.mergewith'
import * as Sentry from '@sentry/node'
import { canInitialize, clientSentryEnabled, envToBool, serverSentryEnabled } from './utils'
import { resolveRelease, resolveClientOptions, resolveServerOptions } from './options'

const RESOLVED_RELEASE_FILENAME = 'sentry.release.config.js'

/**
 * Handler for the 'build:before' hook.
 *
 * @param      {any} moduleContainer The module container
 * @param      {import('../../types/sentry').ResolvedModuleConfiguration} moduleOptions The module options
 * @param      {import('consola').Consola} logger The logger
 * @return     {Promise<void>}
 */
export async function buildHook (moduleContainer, moduleOptions, logger) {
  const release = await resolveRelease(moduleOptions)

  const pluginOptionClient = clientSentryEnabled(moduleOptions) ? (moduleOptions.lazy ? 'lazy' : 'client') : 'mocked'
  const clientOptions = merge({ config: { release } }, await resolveClientOptions(moduleContainer, moduleOptions, logger))
  moduleContainer.addPlugin({
    src: resolve(__dirname, '..', `plugin.${pluginOptionClient}.js`),
    fileName: 'sentry.client.js',
    mode: 'client',
    options: clientOptions
  })

  const pluginOptionServer = serverSentryEnabled(moduleOptions) ? 'server' : 'mocked'
  const serverOptions = merge({ config: { release } }, await resolveServerOptions(moduleContainer, moduleOptions, logger))
  moduleContainer.addPlugin({
    src: resolve(__dirname, '..', `plugin.${pluginOptionServer}.js`),
    fileName: 'sentry.server.js',
    mode: 'server',
    options: serverOptions
  })

  if (serverSentryEnabled(moduleOptions)) {
    moduleContainer.addTemplate({
      src: resolve(__dirname, '..', 'templates', 'options.ejs'),
      fileName: RESOLVED_RELEASE_FILENAME,
      options: { release }
    })
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
 * @param      {any} moduleContainer
 * @param      {import('../../types/sentry').ResolvedModuleConfiguration} moduleOptions
 * @param      {import('consola').Consola} logger
 * @return     {Promise<void>}
 */
export async function initializeServerSentry (moduleContainer, moduleOptions, logger) {
  if (process.sentry) {
    return
  }

  let release
  try {
    const path = resolve(moduleContainer.options.buildDir, RESOLVED_RELEASE_FILENAME)
    release = (await import(path)).release
  } catch {
    // Ignored
  }

  const serverOptions = await resolveServerOptions(moduleContainer, moduleOptions, logger)
  const config = merge({ release }, serverOptions.config)

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
