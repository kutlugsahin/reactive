import { Ref, ref, shallowRef } from '@vue/reactivity'

import { Dictionary, StateMetadata } from '../types'
import { stateMetadataKey } from '../utils/symbols'

function registerStateMetadata(target: any, metadata: StateMetadata) {
  const statePropMetadata: StateMetadata[] = Reflect.getMetadata(stateMetadataKey, target) ?? []
  statePropMetadata.push(metadata)
  return Reflect.metadata(stateMetadataKey, statePropMetadata)(target)
}

export function state(target: any, propertyKey: string) {
  return registerStateMetadata(target, {
    propertyKey,
    type: 'deep',
  })
}

state.shallow = shallowState

function shallowState(target: any, propertyKey: string) {
  return registerStateMetadata(target, {
    propertyKey,
    type: 'ref',
  })
}

type InitParams = {
  instance: Dictionary
}

export function initState({ instance }: InitParams) {
  const stateValueMap = new Map<string, Ref<any>>()

  const stateProperties: StateMetadata[] = Reflect.getMetadata(stateMetadataKey, instance)

  if (stateProperties) {
    stateProperties.forEach(({ propertyKey, type }) => {
      const initialValue = instance[propertyKey]

      const reactiveState = type === 'deep' ? ref(initialValue) : shallowRef(initialValue)

      stateValueMap.set(propertyKey, reactiveState)

      Object.defineProperty(instance, propertyKey, {
        get() {
          return stateValueMap.get(propertyKey)?.value
        },
        set(newValue) {
          const refValue = stateValueMap.get(propertyKey)

          if (refValue) {
            refValue.value = newValue
          } else {
            console.error(`No ref value found for ${propertyKey}`)
          }
        },
      })
    })
  }
}
