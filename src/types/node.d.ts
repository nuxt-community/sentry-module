declare namespace NodeJS {
    interface Process {
        sentry: typeof import('@sentry/node')
    }
}
