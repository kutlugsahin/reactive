import { effect, EffectOptions } from './effect';
import { ComputedRef, isReactive, isRef, Ref } from './reactivity';
import { Dispose } from './types';
import { traverse } from './utils';

export type WatchCallback<T> = (newValue: T, oldValue?: T) => void;

export type CoreWatchOptions = EffectOptions & {
  immediate?: boolean;
  deep?: boolean;
};

function traverseAndReturn(source: unknown) {
  traverse(source, new Set());
  return source;
}

export type WatchSource = (() => unknown) | Ref<unknown> | ComputedRef<unknown> | object;

export function watch<T>(source: Ref<T>, clb: WatchCallback<T>, options?: CoreWatchOptions): Dispose;
export function watch<T>(source: () => T, clb: WatchCallback<T>, options?: CoreWatchOptions): Dispose;
export function watch<T>(source: ComputedRef<T>, clb: WatchCallback<T>, options?: CoreWatchOptions): Dispose;
export function watch<T extends object>(source: T, clb: WatchCallback<T>, options?: CoreWatchOptions): Dispose;
export function watch<T extends WatchSource>(
  source: T,
  clb: WatchCallback<unknown>,
  options?: CoreWatchOptions
): Dispose {
  let oldValue: unknown;
  let shouldRun = options?.immediate || false;

  let effectBody: () => unknown;

  if (typeof source === 'function') {
    effectBody = source as () => unknown;
  } else if (isRef(source)) {
    effectBody = () => (source as unknown as Ref<unknown>).value;
  } else if (isReactive(source)) {
    // watching first level fields
    effectBody = () => ({ ...source });
  }

  return effect(() => {
    const newValue = options?.deep ? traverseAndReturn(effectBody()) : effectBody();

    if (shouldRun) {
      clb(newValue, oldValue);
      oldValue = newValue;
    } else {
      shouldRun = true;
    }
  }, options);
}
