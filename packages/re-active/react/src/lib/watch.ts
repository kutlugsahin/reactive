import { effect, EffectOptions } from './effect';
import { isReactive, isRef, Ref } from './reactivity';
import { Dispose } from './types';
import { traverse } from './utils';

export type WatchCallback<T> = (newValue: T, oldValue?: T) => void;

export type WatchOptions = EffectOptions & {
  immediate?: boolean;
  deep?: boolean;
};

function traverseAndReturn(source: unknown) {
  traverse(source, new Set());
  return source;
}

export type WatchSource = (() => unknown) | Ref<unknown> | object;

export function watch<T>(source: Ref<T>, clb: WatchCallback<T>, options?: WatchOptions): Dispose;
export function watch<T>(source: () => T, clb: WatchCallback<T>, options?: WatchOptions): Dispose;
export function watch<T extends object>(source: T, clb: WatchCallback<T>, options?: WatchOptions): Dispose;
export function watch<T extends WatchSource>(
  source: T,
  clb: WatchCallback<unknown>,
  options?: WatchOptions
): Dispose {
  let oldValue: unknown;
  let shouldRun = options?.immediate || false;
  let deep = options?.deep;

  let effectBody: () => unknown;

  if (typeof source === 'function') {
    effectBody = source as () => unknown;
  } else if (isRef(source)) {
    effectBody = () => (source as unknown as Ref<unknown>).value;
  } else if (isReactive(source)) {
    // reactive objects are deeply watched by default
    effectBody = () => source;
    deep ??= true;
  }

  return effect(() => {
    const newValue = deep ? traverseAndReturn(effectBody()) : effectBody();

    if (shouldRun) {
      clb(newValue, oldValue);
      oldValue = newValue;
    } else {
      shouldRun = true;
    }
  }, options);
}
