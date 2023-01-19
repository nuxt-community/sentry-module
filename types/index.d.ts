import { Module } from '@nuxt/types'
import { ModuleConfiguration, SentryHandlerProxy } from './sentry'
import './extend'
import './node'

type SentryModule = Module<ModuleConfiguration>

export { ModuleConfiguration, SentryHandlerProxy }
export default SentryModule
