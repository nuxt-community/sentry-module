export const canInitialize = options => Boolean(options.initialize && options.dsn)
export const clientSentryEnabled = options => !options.disabled && !options.disableClientSide
export const serverSentryEnabled = options => !options.disabled && !options.disableServerSide
