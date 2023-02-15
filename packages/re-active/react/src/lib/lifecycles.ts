import { ComponentState, ImperativeHandle, OnMount, OnUnmount } from './types';

let currentComponentState: ComponentState | undefined;

export function beginRegisterLifecycles(state: ComponentState): void {
  currentComponentState = state;
}

export function endRegisterLifecycles(): void {
  currentComponentState = undefined;
}

export function getCurrentComponentState(): ComponentState | undefined {
  return currentComponentState;
}

export function onMounted(onMount: OnMount) {
  if (currentComponentState) {
    currentComponentState.mounts.push(onMount);
  }
}

export function onUnmounted(onUnmounted: OnUnmount) {
  if (currentComponentState) {
    currentComponentState.unMounts.push(onUnmounted);
  }
}

export function imperativeHandle<T extends ImperativeHandle>(handle: T) {
  if (currentComponentState) {
    currentComponentState.imperativeHandle = handle;
  }
}
