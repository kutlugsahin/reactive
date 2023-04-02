export * from './lib/component';
export * from './lib/effect';
export { imperativeHandle, onMounted, onUnmounted } from './lib/lifecycles';
export * from './lib/context';
export { ReactiveBoundary } from './lib/reactiveBoundary';
export {
  ref,
  computed,
  reactive,
  readonly,
  /* ----------- */
  isRef,
  unref,
  toRef,
  toRefs,
  isProxy,
  isReactive,
  isReadonly,
  /* ----------- */
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
  pauseTracking,
  enableTracking,
} from './lib/reactivity';
export type { Dispose, OnMount, OnUnmount, ReactiveComponent } from './lib/types';
export type {
  ComputedGetter,
  ComputedSetter,
  ComputedRef,
  Ref,
  DebuggerOptions,
  CustomRefFactory,
  EffectScheduler,
  EffectScope,
  Raw,
  UnwrapNestedRefs,
  DeepReadonly,
  UnwrapRef,
  ToRef,
  ToRefs,
  ShallowRef,
  ShallowReactive,
  ShallowUnwrapRef,
} from './lib/reactivity';
export * from './lib/watch';
