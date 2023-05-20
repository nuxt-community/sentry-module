import { describe, test, expect } from 'vitest'
import { defu } from 'defu'
import { ResolvedClientOptions, ResolvedServerOptions, resolveClientOptions, resolveServerOptions } from '../src/options'
import { nuxtCtx, Nuxt, NuxtModule, useLogger } from '../src/kit-shim'
import { ModuleConfiguration } from '../src/types'
import SentryModule from '../src/module'
import { PartialModuleConfiguration } from 'src/types/configuration'

const DUMMY_LOGGER = useLogger('nuxt:sentry:test')
const DUMMY_NUXT = {
  options: {
    dev: false,
    buildDir: '',
  },
} as Nuxt
// Set mocked Nuxt in context.
nuxtCtx.value = DUMMY_NUXT

async function createOptions (options: PartialModuleConfiguration): Promise<ModuleConfiguration> {
  const { getOptions } = (SentryModule as NuxtModule<ModuleConfiguration>)
  return defu(options, getOptions ? await getOptions() : {}) as ModuleConfiguration
}

describe('Resolve Client Options', () => {
  test('includes default values', async () => {
    const options = await createOptions({
      dsn: '123',
    })
    const resolvedOptions = await resolveClientOptions(DUMMY_NUXT, options, DUMMY_LOGGER)
    expect(resolvedOptions).toMatchObject<Partial<ResolvedClientOptions>>({
      config: {
        dsn: '123',
        environment: 'production',
      },
      integrations: {
        ExtraErrorData: {},
        ReportingObserver: {},
        RewriteFrames: {},
      },
      lazy: false,
      logMockCalls: true,
      tracing: false,
    })
  })

  test('can override dsn in clientConfig', async () => {
    const options = await createOptions({
      dsn: '123',
      clientConfig: {
        dsn: '321',
      },
    })
    const resolvedOptions = await resolveClientOptions(DUMMY_NUXT, options, DUMMY_LOGGER)
    expect(resolvedOptions).toMatchObject<Partial<ResolvedClientOptions>>({
      config: {
        dsn: '321',
      },
    })
  })

  test('resolves tracing options', async () => {
    const options = await createOptions({
      dsn: '123',
      tracing: true,
    })
    const resolvedOptions = await resolveClientOptions(DUMMY_NUXT, options, DUMMY_LOGGER)
    expect(resolvedOptions).toMatchObject<Partial<ResolvedClientOptions>>({
      config: {
        dsn: '123',
        environment: 'production',
      },
      integrations: {
        ExtraErrorData: {},
        ReportingObserver: {},
        RewriteFrames: {},
      },
      lazy: false,
      logMockCalls: true,
      tracing: {
        browserTracing: {},
        tracesSampleRate: 1,
        vueOptions: {
          trackComponents: true,
        },
      },
    })
  })

  test('can override tracesSampleRate', async () => {
    const options = await createOptions({
      dsn: '123',
      tracing: {
        tracesSampleRate: 0.8,
      },
    })
    const resolvedOptions = await resolveClientOptions(DUMMY_NUXT, options, DUMMY_LOGGER)
    expect(resolvedOptions).toMatchObject<Partial<ResolvedClientOptions>>({
      config: {
        tracesSampleRate: 0.8,
      },
    })
  })
})

describe('Resolve Server Options', () => {
  test('includes default values', async () => {
    const options = await createOptions({
      dsn: '123',
    })
    const resolvedOptions = await resolveServerOptions(DUMMY_NUXT, options, DUMMY_LOGGER)
    expect(resolvedOptions).toMatchObject<Partial<ResolvedServerOptions>>({
      config: {
        dsn: '123',
        environment: 'production',
      },
      lazy: false,
      logMockCalls: true,
      tracing: false,
    })
    const integrations = Array.isArray(resolvedOptions.config.integrations) ? resolvedOptions.config.integrations : null
    expect(integrations).toBeTruthy()
    expect(integrations?.map(integration => integration.name)).toEqual(expect.arrayContaining(['Dedupe', 'ExtraErrorData', 'RewriteFrames', 'Transaction']))
  })

  test('can override dsn in serverConfig', async () => {
    const options = await createOptions({
      dsn: '123',
      serverConfig: {
        dsn: '321',
      },
    })
    const resolvedOptions = await resolveServerOptions(DUMMY_NUXT, options, DUMMY_LOGGER)
    expect(resolvedOptions).toMatchObject<Partial<ResolvedServerOptions>>({
      config: {
        dsn: '321',
      },
    })
  })

  test('resolves tracing options', async () => {
    const options = await createOptions({
      dsn: '123',
      tracing: true,
    })
    const resolvedOptions = await resolveServerOptions(DUMMY_NUXT, options, DUMMY_LOGGER)
    expect(resolvedOptions).toMatchObject<Partial<ResolvedServerOptions>>({
      config: {
        dsn: '123',
        environment: 'production',
        tracesSampleRate: 1,
      },
      tracing: {
        browserTracing: {},
        tracesSampleRate: 1,
        vueOptions: {
          trackComponents: true,
        },
      },
    })
    const integrations = Array.isArray(resolvedOptions.config.integrations) ? resolvedOptions.config.integrations : null
    expect(integrations).toBeTruthy()
    expect(integrations?.map(integration => integration.name)).toEqual(expect.arrayContaining(['Http', 'Dedupe', 'ExtraErrorData', 'RewriteFrames', 'Transaction']))
  })

  test('can override tracesSampleRate', async () => {
    const options = await createOptions({
      dsn: '123',
      tracing: {
        tracesSampleRate: 0.8,
      },
    })
    const resolvedOptions = await resolveServerOptions(DUMMY_NUXT, options, DUMMY_LOGGER)
    expect(resolvedOptions).toMatchObject<Partial<ResolvedServerOptions>>({
      config: {
        tracesSampleRate: 0.8,
      },
    })
  })
})
