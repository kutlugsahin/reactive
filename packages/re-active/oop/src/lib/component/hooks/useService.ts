import { useContext } from 'react'

import { Context } from '../../context/context'
import { Constructor } from '../../types'

export function useService<T extends Constructor>(service: T): InstanceType<T> {
  return useContext(Context).resolve(service)
}
