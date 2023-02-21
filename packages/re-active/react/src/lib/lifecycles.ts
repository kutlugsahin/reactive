import { ComponentState, ImperativeHandle, OnMount, OnUnmount } from './types';

export function createComponentState(): ComponentState {
  return {
    imperativeHandle: undefined,
    layoutListeners: [],
    updateListeners: [],
    mounts: [],
    unMounts: [],
    mountMounts: [],
    reset() {
      this.imperativeHandle = undefined;
      this.layoutListeners = [];
      this.updateListeners = [];
      this.mounts = [];
      this.unMounts = [];
      this.mountMounts = [];
    },
  };
}

let currentComponentState: ComponentState | undefined;

export function beginRegisterLifecycles(): ComponentState {
  currentComponentState = createComponentState();
  return currentComponentState;
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
