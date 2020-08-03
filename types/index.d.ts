import { Module } from '@nuxt/types'
import { ModuleConfiguration } from './sentry'
import './extend'
import './node'

type SentryModule = Module<ModuleConfiguration>

export { ModuleConfiguration }
export default SentryModule
