import { shallowReactive, shallowReadonly } from '@vue/reactivity'
import { useEffect, useMemo } from 'react'

export function useReactiveProps<P extends object>(props: P) {
  const { reactiveProps, next } = useMemo(() => {
    const reactiveProps = shallowReactive({ ...props })

    return {
      next(nextProps: P) {
        Object.keys(nextProps).forEach((key) => {
          (reactiveProps as any)[key] = (nextProps as any)[key]
        })
      },
      reactiveProps: shallowReadonly(reactiveProps),
    }
  }, [])

  useEffect(() => {
    if (props) {
      next(props)
    }
  }, [next, props])

  return reactiveProps
}
