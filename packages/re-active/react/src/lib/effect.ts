import { getCurrentComponentState } from './lifecycles';
import { effect as coreEffect, ReactiveEffectOptions } from './reactivity';
import { Dispose } from './types';

export type EffectOptions = Pick<ReactiveEffectOptions, 'onStop' | 'onTrack' | 'onTrigger'> & {
  type?: 'sync' | 'update' | 'layout';
};

export function effect(fn: () => void, options?: EffectOptions): Dispose {
  if (getCurrentComponentState()) {
    if (options?.type === 'update') return updateEffect(fn, options);
    if (options?.type === 'layout') return layoutEffect(fn, options);
  }

  return coreEffect(fn, options).effect.stop;
}

export function updateEffect(fn: () => void, options?: Omit<EffectOptions, 'type'>): Dispose {
  const currentComponentState = getCurrentComponentState();

  if (currentComponentState) {
    let shouldRun = false;

    currentComponentState.updateListeners.push(() => {
      if (shouldRun) {
        effectRunner.effect.run();
        shouldRun = false;
      }
    });

    const effectRunner = coreEffect(fn, {
      ...options,
      scheduler: () => {
        shouldRun = true;
      },
    });
    return effectRunner.effect.stop;
  }

  return coreEffect(fn, options).effect.stop;
}

export function layoutEffect(fn: () => void, options?: Omit<EffectOptions, 'type'>): Dispose {
  const currentComponentState = getCurrentComponentState();
  if (currentComponentState) {
    let shouldRun = false;
    currentComponentState.layoutListeners.push(() => {
      if (shouldRun) {
        effectRunner.effect.run();
        shouldRun = false;
      }
    });
    const effectRunner = coreEffect(fn, {
      ...options,
      scheduler: () => {
        shouldRun = true;
      },
    });
    return effectRunner.effect.stop;
  }

  return coreEffect(fn, options).effect.stop;
}
