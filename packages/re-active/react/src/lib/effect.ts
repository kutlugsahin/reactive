import { getCurrentComponentState } from './lifecycles';
import { effect as coreEffect, enableTracking, pauseTracking, ReactiveEffectOptions, ReactiveEffectRunner } from './reactivity';
import { Dispose } from './types';

type ListenerEffectType = Exclude<EffectType, 'sync'>;
export type EffectType = 'sync' | 'update' | 'layout';
export type Cleanup = () => void;
export type EffectCallback = () => void | Cleanup;

export type EffectOptions = Pick<ReactiveEffectOptions, 'onTrack' | 'onTrigger'> & {
  type?: EffectType;
};


function createEffect(fn: EffectCallback, options?: ReactiveEffectOptions): ReactiveEffectRunner<any> {
  let cleanup: Dispose;

  return coreEffect(() => {
    cleanup?.();

    const effectResult = fn();

    if (typeof effectResult === 'function') {
      cleanup = effectResult;
    }
  }, options);
}

export function effect(fn: EffectCallback, options?: EffectOptions): Dispose {
  if (getCurrentComponentState()) {
    if (options?.type === 'update') return updateEffect(fn, options);
    if (options?.type === 'layout') return layoutEffect(fn, options);
  }

  return createEffect(fn, options).effect.stop;
}

function listenerEffect(fn: EffectCallback, type: ListenerEffectType, options?: Omit<EffectOptions, 'type'>): Dispose {
  const currentComponentState = getCurrentComponentState();

  if (currentComponentState) {
    let shouldRun = false;
    let isMounted = false;

    let effectCallback = () => {
      return;
    };

    const onMounted = () => {
      isMounted = true;
      shouldRun = true;
      effectCallback = fn;
      triggerEffect();
    };

    currentComponentState.mounts.push(onMounted);

    const triggerEffect = () => {
      if (shouldRun) {
        effectRunner();
        shouldRun = false;
      }
    };

    const flushListener =
      type === 'update' ? currentComponentState.updateListeners : currentComponentState.layoutListeners;

    flushListener.push(triggerEffect);

    const effectRunner = createEffect(() => effectCallback(), {
      ...options,
      scheduler: () => {
        shouldRun = true;
        queueMicrotask(() => {
          if (!currentComponentState.willRender && isMounted) {
            triggerEffect();
          }
        });
      },
    });
    return effectRunner.effect.stop;
  }

  return createEffect(fn, options).effect.stop;
}

export function updateEffect(fn: EffectCallback, options?: Omit<EffectOptions, 'type'>): Dispose {
  return listenerEffect(fn, 'update', options);
}

export function layoutEffect(fn: EffectCallback, options?: Omit<EffectOptions, 'type'>): Dispose {
  return listenerEffect(fn, 'layout', options);
}

export const untracked = <T>(fn: () => T) => {
  try {
    pauseTracking();
    return fn();
  } finally {
    enableTracking();
  }
};
