import { injectable as tInjectable, Lifecycle, scoped as tScoped } from 'tsyringe'

import { Constructor } from '../types'
import { injectableMetadataKey } from '../utils/symbols'

type Scope = 'resolution-scoped' | 'container-scoped'

export function injectable<T extends Constructor>(): (t: T) => void
export function injectable<T extends Constructor>(scope: Scope): (t: T) => void
export function injectable<T extends Constructor>(scope?: Scope) {
  return function (target: T) {
    if (scope != null) {
      tScoped(scope === 'container-scoped' ? Lifecycle.ContainerScoped : Lifecycle.ResolutionScoped)(target)
    } else {
      tInjectable()(target)
    }

    Reflect.metadata(injectableMetadataKey, true)(target)
  }
}
