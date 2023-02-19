import { reactive, isRef, UnwrapNestedRefs } from '@vue/reactivity';
import { useCallback, useRef, useState } from 'react';
import { ComponentState, Dictionary } from './types';
import { useEffectOnce } from './useEffectOnce';

export function createComponentState(): ComponentState {
  return {
    imperativeHandle: undefined,
    layoutListeners: [],
    updateListeners: [],
    mounts: [],
    unMounts: [],
    computedRender: undefined,
    scope: undefined,
    reset() {
      this.unMounts.forEach((p) => p());
      this.scope?.stop();
      this.imperativeHandle = undefined;
      this.layoutListeners = [];
      this.updateListeners = [];
      this.mounts = [];
      this.unMounts = [];
      this.computedRender = undefined;
    },
  };
}

export function useForceRender() {
  const [, forceRender] = useState({});
  return useCallback(() => forceRender({}), []);
}

export function useReactiveProps<P extends object>(props: P): UnwrapNestedRefs<P> {
  // convert props to a reactive object
  const [reactiveProps] = useState(() => reactive({...props } as Dictionary)) ;
  // keep the old props object for future comparison
  const prevProps = useRef<P>(props);

  const prev = prevProps.current;

  for (const key in props) {
    if (prev[key] !== props[key]) {
      (reactiveProps[key] as unknown) = props[key];
    }
  }

  for (const key in reactiveProps) {
    if (key in (props as { [key: string]: unknown }) === false) {
      delete reactiveProps[key];
    }
  }

  prevProps.current = props;

  // now we return a reactive props object which will also react to parent renders
  return reactiveProps as UnwrapNestedRefs<P>;
}

export function useMountUnmountHooks(state: ComponentState) {
  useEffectOnce(() => {
    state.mounts.forEach((p) => {
      const unmount = p();
      if (typeof unmount === 'function') {
        state.unMounts.push(unmount);
      }
    });
    return () => {
      state.unMounts.forEach((p) => p());
      state.imperativeHandle = undefined;
      state.layoutListeners = [];
      state.updateListeners = [];
      state.mounts = [];
      state.unMounts = [];
      // state.dispose();
    };
  });
}

export const isArray = Array.isArray;
export const isObject = (val: any): val is Record<any, any> => val !== null && typeof val === 'object';

export function traverse(value: any, seen: Set<any> = new Set()) {
  if (!isObject(value) || seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (value instanceof Map) {
    value.forEach((v, key) => {
      // to register mutation dep for existing keys
      traverse(value.get(key), seen);
    });
  } else if (value instanceof Set) {
    value.forEach((v) => {
      traverse(v, seen);
    });
  } else {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}
