// Shim created based on v3.2.3 of @nuxt/kit

import { existsSync } from 'node:fs'
import { consola } from 'consola'
import { defu } from 'defu'
import hash from 'hash-sum'
import { basename, parse, normalize, resolve } from 'pathe'
import { resolveAlias as _resolveAlias } from 'pathe/utils'
import type { Hookable } from 'hookable'
import type { WebpackPluginInstance, Configuration as WebpackConfig } from 'webpack'
import type { NuxtOptions } from '@nuxt/types'

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

type NuxtHooks = Record<string, any>
export interface Nuxt {
    /** The resolved Nuxt configuration. */
    options: NuxtOptions
    hooks: Hookable<NuxtHooks>
    hook: Nuxt['hooks']['hook']
    callHook: Nuxt['hooks']['callHook']
    addHooks: Nuxt['hooks']['addHooks']
    ready: () => Promise<void>
    close: () => Promise<void>
    /** The production or development server. */
    server?: any
    vfs: Record<string, string>
}

interface ModuleMeta {
    /** Module name. */
    name?: string
    /** Module version. */
    version?: string
    /**
     * The configuration key used within `nuxt.config` for this module's options.
     * For example, `@nuxtjs/axios` uses `axios`.
     */
    configKey?: string
}
/** The options received.  */
type ModuleOptions = Record<string, any>
type Awaitable<T> = T | Promise<T>
/** Input module passed to defineNuxtModule. */
interface ModuleDefinition<T extends ModuleOptions = ModuleOptions> {
    meta?: ModuleMeta
    defaults?: T | ((nuxt: Nuxt) => T)
    schema?: T
    hooks?: Partial<NuxtHooks>
    setup?: (this: void, resolvedOptions: T, nuxt: Nuxt) => Awaitable<void>
}
export interface NuxtModule<T extends ModuleOptions = ModuleOptions> {
    (this: void, inlineOptions: T, nuxt: Nuxt): void
    getOptions?: (inlineOptions?: T, nuxt?: Nuxt) => Promise<T>
    getMeta?: () => Promise<ModuleMeta>
}

/** Direct access to the Nuxt context - see https://github.com/unjs/unctx. */
let nuxtCtx: Nuxt | null = null

// TODO: Use use/tryUse from unctx. https://github.com/unjs/unctx/issues/6

/**
 * Get access to Nuxt instance.
 *
 * Throws an error if Nuxt instance is unavailable.
 *
 * @example
 * ```js
 * const nuxt = useNuxt()
 * ```
 */
export function useNuxt (): Nuxt {
  const instance = nuxtCtx
  if (!instance) {
    throw new Error('Nuxt instance is unavailable!')
  }
  return instance
}

/**
 * Get access to Nuxt instance.
 *
 * Returns null if Nuxt instance is unavailable.
 *
 * @example
 * ```js
 * const nuxt = tryUseNuxt()
 * if (nuxt) {
 *  // Do something
 * }
 * ```
 */
export function tryUseNuxt (): Nuxt | null {
  return nuxtCtx
}

// -- Nuxt 2 compatibility shims --
const NUXT2_SHIMS_KEY = '__nuxt2_shims_key__'
function nuxt2Shims (nuxt: Nuxt) {
  // Avoid duplicate install and only apply to Nuxt2
  // @ts-expect-error nuxt2
  if (!isNuxt2(nuxt) || nuxt[NUXT2_SHIMS_KEY]) { return }
  // @ts-expect-error nuxt2
  nuxt[NUXT2_SHIMS_KEY] = true

  // Allow using nuxt.hooks
  // @ts-expect-error Nuxt 2 extends hookable
  nuxt.hooks = nuxt

  // Allow using useNuxt()
  if (!nuxtCtx) {
    nuxtCtx = nuxt
    nuxt.hook('close', () => { nuxtCtx = null })
  }
}

export function defineNuxtModule<OptionsT extends ModuleOptions> (definition: ModuleDefinition<OptionsT>): NuxtModule<OptionsT> {
  // Normalize definition and meta
  if (!definition.meta) { definition.meta = {} }
  if (definition.meta.configKey === undefined) {
    definition.meta.configKey = definition.meta.name
  }

  // Resolves module options from inline options, [configKey] in nuxt.config, defaults and schema
  function getOptions (inlineOptions?: OptionsT) {
    const nuxt = useNuxt()
    const configKey = definition.meta!.configKey || definition.meta!.name!
    const _defaults = definition.defaults instanceof Function ? definition.defaults(nuxt) : definition.defaults
    const _options = defu(inlineOptions, nuxt.options[configKey as keyof NuxtOptions], _defaults) as OptionsT
    return Promise.resolve(_options)
  }

  // Module format is always a simple function
  async function normalizedModule (this: any, inlineOptions: OptionsT) {
    const nuxt = this.nuxt

    // Avoid duplicate installs
    const uniqueKey = definition.meta!.name || definition.meta!.configKey
    if (uniqueKey) {
      nuxt.options._requiredModules = nuxt.options._requiredModules || {}
      if (nuxt.options._requiredModules[uniqueKey]) {
        return false
      }
      nuxt.options._requiredModules[uniqueKey] = true
    }

    // Nuxt 3 shims
    nuxt2Shims(nuxt)

    // Resolve module and options
    const _options = await getOptions(inlineOptions)
    const res = await definition.setup?.call(null as any, _options, nuxt) ?? {}

    // Return module install result
    return defu(res, {})
  }

  // Define getters for options and meta
  normalizedModule.getMeta = () => Promise.resolve(definition.meta)
  normalizedModule.getOptions = getOptions

  return normalizedModule as NuxtModule<OptionsT>
}

export const logger = consola

export function useLogger (tag?: string): typeof consola {
  return tag ? logger.withTag(tag) : logger
}

export function isNuxt2 (): boolean {
  return true
}

interface NuxtTemplate<Options = Record<string, any>> {
    /** resolved output file path (generated) */
    dst?: string
    /** The target filename once the template is copied into the Nuxt buildDir */
    filename?: string
    /** An options object that will be accessible within the template via `<% options %>` */
    options?: Options
    /** The resolved path to the source file to be template */
    src?: string
    /** Provided compile option instead of src */
    getContents?: (data: Options) => string | Promise<string>
    /** Write to filesystem */
    write?: boolean
}
interface ResolvedNuxtTemplate<Options = Record<string, any>> extends NuxtTemplate<Options> {
    filename: string
    dst: string
}
interface NuxtPlugin {
    /** @deprecated use mode */
    ssr?: boolean
    src: string
    mode?: 'all' | 'server' | 'client'
}
type _TemplatePlugin<Options> = Omit<NuxtPlugin, 'src'> & NuxtTemplate<Options>
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NuxtPluginTemplate<Options = Record<string, any>> extends _TemplatePlugin<Options> {}

/**
 * Resolve path aliases respecting Nuxt alias options
 */
export function resolveAlias (path: string, alias?: Record<string, string>): string {
  if (!alias) {
    alias = tryUseNuxt()?.options.alias || {}
  }
  return _resolveAlias(path, alias)
}

/**
 * Normalize a nuxt plugin object
 */
export function normalizePlugin (plugin: NuxtPlugin | string): NuxtPlugin {
  // Normalize src
  if (typeof plugin === 'string') {
    plugin = { src: plugin }
  } else {
    plugin = { ...plugin }
  }

  if (!plugin.src) {
    throw new Error('Invalid plugin. src option is required: ' + JSON.stringify(plugin))
  }

  // TODO: only scan top-level files #18418
  const nonTopLevelPlugin = plugin.src.match(/\/plugins\/[^/]+\/index\.[^/]+$/i)
  if (nonTopLevelPlugin && nonTopLevelPlugin.length > 0 && !useNuxt().options.plugins.find(i => (typeof i === 'string' ? i : i.src).endsWith(nonTopLevelPlugin[0]))) {
    console.warn(`[warn] [nuxt] [deprecation] You are using a plugin that is within a subfolder of your plugins directory without adding it to your config explicitly. You can move it to the top-level plugins directory, or include the file '~${nonTopLevelPlugin[0]}' in your plugins config (https://nuxt.com/docs/api/configuration/nuxt-config#plugins-1) to remove this warning.`)
  }

  // Normalize full path to plugin
  plugin.src = normalize(resolveAlias(plugin.src))

  // Normalize mode
  if (plugin.ssr) {
    plugin.mode = 'server'
  }
  if (!plugin.mode) {
    const [, mode = 'all'] = plugin.src.match(/\.(server|client)(\.\w+)*$/) || []
    plugin.mode = mode as 'all' | 'client' | 'server'
  }

  return plugin
}

/**
 * Registers a nuxt plugin and to the plugins array.
 *
 * Note: You can use mode or .client and .server modifiers with fileName option
 * to use plugin only in client or server side.
 *
 * Note: By default plugin is prepended to the plugins array. You can use second argument to append (push) instead.
 *
 * @example
 * ```js
 * addPlugin({
 *   src: path.resolve(__dirname, 'templates/foo.js'),
 *   filename: 'foo.server.js' // [optional] only include in server bundle
 * })
 * ```
 */
export interface AddPluginOptions { append?: boolean }
export function addPlugin (_plugin: NuxtPlugin | string, opts: AddPluginOptions = {}): NuxtPlugin {
  const nuxt = useNuxt()

  // Normalize plugin
  const plugin = normalizePlugin(_plugin)

  // Remove any existing plugin with the same src
  nuxt.options.plugins = nuxt.options.plugins.filter(p => normalizePlugin(p).src !== plugin.src)

  // Prepend to array by default to be before user provided plugins since is usually used by modules
  nuxt.options.plugins[opts.append ? 'push' : 'unshift'](plugin)

  return plugin
}

/**
 * Adds a template and registers as a nuxt plugin.
 */
export function addPluginTemplate (plugin: NuxtPluginTemplate | string, opts: AddPluginOptions = {}): NuxtPlugin {
  const normalizedPlugin: NuxtPlugin = typeof plugin === 'string'
    ? { src: plugin }
    // Update plugin src to template destination
    : { ...plugin, src: addTemplate(plugin).dst! }

  return addPlugin(normalizedPlugin, opts)
}

/**
 * Renders given template using lodash template during build into the project buildDir
 */
export function addTemplate (_template: NuxtTemplate<any> | string): ResolvedNuxtTemplate<any> {
  const nuxt = useNuxt()

  // Normalize template
  const template = normalizeTemplate(_template)

  // Remove any existing template with the same filename
  nuxt.options.build.templates = (nuxt.options.build.templates as any[])
    .filter(p => normalizeTemplate(p).filename !== template.filename)

  // Add to templates array
  nuxt.options.build.templates.push(template)

  return template
}

/**
 * Normalize a nuxt template object
 */
export function normalizeTemplate (template: NuxtTemplate<any> | string): ResolvedNuxtTemplate<any> {
  if (!template) {
    throw new Error('Invalid template: ' + JSON.stringify(template))
  }

  // Normalize
  if (typeof template === 'string') {
    template = { src: template }
  } else {
    template = { ...template }
  }

  // Use src if provided
  if (template.src) {
    if (!existsSync(template.src)) {
      throw new Error('Template not found: ' + template.src)
    }
    if (!template.filename) {
      const srcPath = parse(template.src)
      template.filename = (template as any).fileName ||
        `${basename(srcPath.dir)}.${srcPath.name}.${hash(template.src)}${srcPath.ext}`
    }
  }

  if (!template.src && !template.getContents) {
    throw new Error('Invalid template. Either getContents or src options should be provided: ' + JSON.stringify(template))
  }

  if (!template.filename) {
    throw new Error('Invalid template. Either filename should be provided: ' + JSON.stringify(template))
  }

  // Always write declaration files
  if (template.filename.endsWith('.d.ts')) {
    template.write = true
  }

  // Resolve dst
  if (!template.dst) {
    const nuxt = useNuxt()
    template.dst = resolve(nuxt.options.buildDir, template.filename)
  }

  return template as ResolvedNuxtTemplate<any>
}

interface ExtendConfigOptions {
  /**
   * Install plugin on dev
   *
   * @default true
   */
   dev?: boolean
   /**
    * Install plugin on build
    *
    * @default true
    */
   build?: boolean
  /**
   * Install plugin on server side
   *
   * @default true
   */
  server?: boolean
  /**
   * Install plugin on client side
   *
   * @default true
   */
  client?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ExtendWebpackConfigOptions extends ExtendConfigOptions {}

/**
 * Append webpack plugin to the config.
 */
export function addWebpackPlugin (plugin: WebpackPluginInstance | WebpackPluginInstance[], options?: ExtendWebpackConfigOptions): void {
  extendWebpackConfig((config) => {
    config.plugins = config.plugins || []
    if (Array.isArray(plugin)) {
      config.plugins.push(...plugin)
    } else {
      config.plugins.push(plugin)
    }
  }, options)
}

/**
 * Extend webpack config
 *
 * The fallback function might be called multiple times
 * when applying to both client and server builds.
 */
export function extendWebpackConfig (
  fn: ((config: WebpackConfig)=> void),
  options: ExtendWebpackConfigOptions = {},
): void {
  const nuxt = useNuxt()

  if (options.dev === false && nuxt.options.dev) {
    return
  }
  if (options.build === false && nuxt.options.build) {
    return
  }

  nuxt.hook('webpack:config', (configs: WebpackConfig[]) => {
    if (options.server !== false) {
      const config = configs.find(i => i.name === 'server')
      if (config) {
        fn(config)
      }
    }
    if (options.client !== false) {
      const config = configs.find(i => i.name === 'client')
      if (config) {
        fn(config)
      }
    }
  })
}
