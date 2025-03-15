import { effect, stop } from '@vue/reactivity'

import { Dictionary, Dispose } from '../types'
import { triggerMetadataKey } from '../utils/symbols'

export function trigger(target: any, propertyKey: string) {
  const propNames = Reflect.getMetadata(triggerMetadataKey, target) ?? []
  propNames.push(propertyKey)
  return Reflect.metadata(triggerMetadataKey, propNames)(target)
}

type InitParams = {
  instance: Dictionary
  disposers: Dispose[]
}

export function initTrigger({ instance, disposers }: InitParams) {
  const triggerProperties = Reflect.getMetadata(triggerMetadataKey, instance)

  if (triggerProperties) {
    triggerProperties.forEach((propName: string) => {
      const effectFn = instance[propName] as () => unknown

      const runner = effect(() => {
        effectFn.call(instance)
      })

      disposers.push(() => {
        stop(runner)
      })

      Object.defineProperty(instance, propName, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: () => {
          runner()
        },
      })
    })
  }
}
