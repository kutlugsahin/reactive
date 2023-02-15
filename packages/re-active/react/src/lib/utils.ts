import { reactive, isRef } from '@vue/reactivity';
import { useRef, useState } from 'react';
import { ComponentState } from './types';
import { useEffectOnce } from './useEffectOnce';

export function useForceRender() {
  const [, forceRender] = useState({});
  return () => forceRender({});
}

export function useReactiveProps<P>(props: P): P {
  // convert props to a reactive object
  const { current: reactiveProps } = useRef(reactive({ ...(props as { [key: string]: unknown }) }));
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
  return reactiveProps as P;
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
      state.dispose();
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
