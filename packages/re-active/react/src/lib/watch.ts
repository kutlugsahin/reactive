import { effect, EffectOptions } from './effect';
import { ComputedRef, isReactive, isRef, Ref } from './reactivity';
import { Dispose } from './types';
import { traverse } from './utils';

export type WatchCallback<T> = (newValue: T, oldValue?: T) => void;

export type CoreWatchOptions = EffectOptions & {
  immediate?: boolean;
  deep?: boolean;
};

function traverseAndReturn(source: any) {
  traverse(source, new Set());
  return source;
}

export type WatchSource = (() => any) | Ref<any> | ComputedRef<any> | object;

export function watch<T>(source: Ref<T>, clb: WatchCallback<T>, options?: CoreWatchOptions): Dispose;
export function watch<T>(source: () => T, clb: WatchCallback<T>, options?: CoreWatchOptions): Dispose;
export function watch<T>(source: ComputedRef<T>, clb: WatchCallback<T>, options?: CoreWatchOptions): Dispose;
export function watch<T extends object>(source: T, clb: WatchCallback<T>, options?: CoreWatchOptions): Dispose;
export function watch<T extends WatchSource>(source: T, clb: WatchCallback<any>, options?: CoreWatchOptions): Dispose {
  let oldValue: any;
  let shouldRun = options?.immediate || false;

  let effectBody: () => any;

  if (typeof source === 'function') {
    effectBody = source as () => any;
  } else if (isRef(source)) {
    if (options?.deep) {
      effectBody = () => traverseAndReturn(source);
    } else {
      effectBody = () => (source as unknown as Ref<any>).value;
    }
  } else if (isReactive(source)) {
    if (options?.deep) {
      effectBody = () => traverseAndReturn(source);
    } else {
      // watching first level fields
      effectBody = () => ({ ...source });
    }
  }

  return effect(() => {
    const newValue = effectBody();

    if (shouldRun) {
      clb(newValue, oldValue);
      oldValue = newValue;
    } else {
      shouldRun = true;
    }
  }, options);
}
