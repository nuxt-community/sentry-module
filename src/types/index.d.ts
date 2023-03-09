import { DeepPartialModuleConfiguration, ModuleConfiguration } from './configuration'
import './extend'
import './node'

type ModuleOptions = DeepPartialModuleConfiguration
type ModulePublicRuntimeConfig = DeepPartialModuleConfiguration
type ModulePrivateRuntimeConfig = DeepPartialModuleConfiguration

export { ModuleOptions, ModulePublicRuntimeConfig, ModulePrivateRuntimeConfig, DeepPartialModuleConfiguration, ModuleConfiguration }
