export * from './lib/createComponent';
export * from './lib/observer';
export { onMounted, onUnmounted, imperativeHandle } from './lib/lifecycles';
export * from './lib/effect';
export * from './lib/watch';
export {
  computed,
  reactive,
  readonly,
  ref,
  isRef,
  unref,
  toRef,
  toRefs,
  isProxy,
  isReactive,
  isReadonly,
  shallowRef,
  triggerRef,
  customRef,
  shallowReactive,
  shallowReadonly,
  toRaw,
  markRaw,
  effectScope,
  getCurrentScope,
  onScopeDispose,
  isShallow,
} from '@vue/reactivity';
export type { Dispose, OnMount, ReactiveComponent, OnUnmount } from './lib/types';
