import { ModuleOptions } from '../../../../src/types'

export default function (): ModuleOptions['serverConfig'] {
  return {
    beforeSend (event, _hint) {
      event.extra = {
        foo: '1',
      }
      return event
    },
  }
}
