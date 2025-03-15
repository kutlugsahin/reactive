import { computed, ComputedRefImpl, effectScope } from '@vue/reactivity'

import { Dictionary, Dispose } from '../types'
import { derivedMetadataKey } from '../utils/symbols'

export function derived(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const propNames = Reflect.getMetadata(derivedMetadataKey, target) ?? []
  propNames.push({
    propertyKey,
    descriptor,
  })
  return Reflect.metadata(derivedMetadataKey, propNames)(target)
}

type InitParams = {
  instance: Dictionary
  disposers: Dispose[]
}

export function initDerived({ disposers, instance }: InitParams) {
  const cachedProperties = Reflect.getMetadata(derivedMetadataKey, instance)

  if (cachedProperties) {
    cachedProperties.forEach(({ propertyKey, descriptor }: any) => {
      const getter = descriptor.get

      let computedValue: ComputedRefImpl

      const scope = effectScope()

      scope.run(() => {
        computedValue = computed(() => {
          return getter.call(instance)
        }) as unknown as ComputedRefImpl
      })

      disposers.push(() => {
        scope.stop()
      })

      Object.defineProperty(instance, propertyKey, {
        enumerable: true,
        configurable: true,
        get() {
          return computedValue.value
        },
      })
    })
  }
}
