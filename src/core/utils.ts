import type { ModuleConfiguration } from '../../types'

/**
 * Returns a human-readable representation of the boolean value.
 *
 * @param      {boolean} value
 * @return     {string} The human-readable string.
 */
export const boolToText = (value: boolean): 'enabled' | 'disabled' => value ? 'enabled' : 'disabled'

/**
  * Returns evaluated boolean value for given boolean-like env variable.
  *
  * @param      {string | undefined} env The environement variable
  * @return     {boolean} Evaluated value
  */
export const envToBool = (env: string | undefined): boolean => Boolean(env && env.toLowerCase() !== 'false' && env !== '0')

/**
  * Determines if Sentry can be initialized.
  *
  * @param      {ModuleConfiguration} options The module options.
  * @return     {boolean} True if able to initialize, False otherwise.
  */
export const canInitialize = (options: ModuleConfiguration): boolean => Boolean(options.initialize && options.dsn)

/**
  * Returns true if browser Sentry is enabled.
  *
  * @param      {ModuleConfiguration} options The module options.
  * @return     {boolean} True if browser Sentry is enabled.
  */
export const clientSentryEnabled = (options: ModuleConfiguration): boolean => !options.disabled && !options.disableClientSide

/**
  * Returns true if node Sentry is enabled.
  *
  * @param      {ModuleConfiguration} options The module options.
  * @return     {boolean} True if node Sentry is enabled.
  */
export const serverSentryEnabled = (options: ModuleConfiguration): boolean => !options.disabled && !options.disableServerSide
