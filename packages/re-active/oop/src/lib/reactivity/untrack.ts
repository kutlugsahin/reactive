import { enableTracking, pauseTracking } from '@vue/reactivity'

export function untrack<T extends () => any>(fn: T) {
  pauseTracking()
  const result = fn()
  enableTracking()
  return result
}
