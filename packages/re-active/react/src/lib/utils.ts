import { useCallback, useRef, useState } from 'react';
import { isRef, reactive, UnwrapNestedRefs } from './reactivity';
import { Dictionary } from './types';

export function useForceRender() {
  const [, forceRender] = useState({});
  return useCallback(() => forceRender({}), []);
}

export function useReactiveProps<P extends object>(props: P): UnwrapNestedRefs<P> {
  // convert props to a reactive object
  const [reactiveProps] = useState(() => reactive({...props} as Dictionary));
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
