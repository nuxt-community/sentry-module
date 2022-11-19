import type { ModuleConfiguration } from '../../types'

export const boolToText = (value: boolean): 'enabled' | 'disabled' => value ? 'enabled' : 'disabled'

export const envToBool = (env: string | undefined): boolean => Boolean(env && env.toLowerCase() !== 'false' && env !== '0')

export const canInitialize = (options: ModuleConfiguration): boolean => Boolean(options.initialize && options.dsn)

export const clientSentryEnabled = (options: ModuleConfiguration): boolean => !options.disabled && !options.disableClientSide

export const serverSentryEnabled = (options: ModuleConfiguration): boolean => !options.disabled && !options.disableServerSide
