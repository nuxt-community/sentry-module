/**
 * Returns a human-readable representation of the boolean value.
 *
 * @param      {boolean} value
 * @return     {string} The human-readable string.
 */
export const boolToText = value => value ? 'enabled' : 'disabled'

/**
 * Returns evaluated boolean value for given boolean-like env variable.
 *
 * @param      {string | undefined} env The environement variable
 * @return     {boolean} Evaluated value
 */
export const envToBool = env => Boolean(env && env.toLowerCase() !== 'false' && env !== '0')

/**
 * Determines if Sentry can be initialized.
 *
 * @param      {import('../../types/sentry').ResolvedModuleConfiguration} options The module options.
 * @return     {boolean} True if able to initialize, False otherwise.
 */
export const canInitialize = options => Boolean(options.initialize && options.dsn)

/**
 * Returns true if browser Sentry is enabled.
 *
 * @param      {import('../../types/sentry').ResolvedModuleConfiguration} options The module options.
 * @return     {boolean} True if browser Sentry is enabled.
 */
export const clientSentryEnabled = options => !options.disabled && !options.disableClientSide

/**
 * Returns true if node Sentry is enabled.
 *
 * @param      {import('../../types/sentry').ResolvedModuleConfiguration} options The module options.
 * @return     {boolean} True if node Sentry is enabled.
 */
export const serverSentryEnabled = options => !options.disabled && !options.disableServerSide
