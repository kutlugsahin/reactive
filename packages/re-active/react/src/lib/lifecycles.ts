import { Context } from 'react';
import { ComponentState, ImperativeHandle, OnMount, OnUnmount } from './types';

export function createComponentState(): ComponentState {
  return {
    imperativeHandle: undefined,
    layoutListeners: [],
    updateListeners: [],
    mounts: [],
    unMounts: [],
    mountMounts: [],
    contextListeners: [],
    willRender: false,
    reset() {
      this.imperativeHandle = undefined;
      this.layoutListeners = [];
      this.updateListeners = [];
      this.mounts = [];
      this.unMounts = [];
      this.mountMounts = [];
      this.contextListeners = [];
      this.willRender = false;
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

export function imperativeHandle<T extends {}>(handle: T) {
  if (currentComponentState) {
    currentComponentState.imperativeHandle = handle;
  }
}

export function registerContextConsumer<T>(context: Context<T>, callback: (value: T) => void) {
  if (currentComponentState) {
    currentComponentState.contextListeners.push({
      context,
      callback,
    });
  }
}
