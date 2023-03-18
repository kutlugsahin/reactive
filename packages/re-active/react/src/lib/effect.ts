import { getCurrentComponentState } from './lifecycles';
import { effect as coreEffect, ReactiveEffectOptions } from './reactivity';
import { Dispose } from './types';

type ListenerEffectType = 'update' | 'layout';
type EffectType = 'sync' | ListenerEffectType;

export type EffectOptions = Pick<ReactiveEffectOptions, 'onTrack' | 'onTrigger'> & {
  type?: EffectType;
};

export function effect(fn: () => void, options?: EffectOptions): Dispose {
  if (getCurrentComponentState()) {
    if (options?.type === 'update') return updateEffect(fn, options);
    if (options?.type === 'layout') return layoutEffect(fn, options);
  }

  return coreEffect(fn, options).effect.stop;
}

function listenerEffect(fn: () => void, type: ListenerEffectType, options?: Omit<EffectOptions, 'type'>): Dispose {
  const currentComponentState = getCurrentComponentState();

  if (currentComponentState) {
    let shouldRun = false;

    const triggerEffect = () => {
      if (shouldRun) {
        effectRunner.effect.run();
        shouldRun = false;
      }
    };

    const flushListener =
      type === 'update' ? currentComponentState.updateListeners : currentComponentState.layoutListeners;

    flushListener.push(triggerEffect);

    const effectRunner = coreEffect(fn, {
      ...options,
      scheduler: () => {
        shouldRun = true;
        queueMicrotask(() => {
          if (!currentComponentState.willRender) {
            triggerEffect();
          }
        });
      },
    });
    return effectRunner.effect.stop;
  }

  return coreEffect(fn, options).effect.stop;
}

export function updateEffect(fn: () => void, options?: Omit<EffectOptions, 'type'>): Dispose {
  return listenerEffect(fn, 'update', options);
}

export function layoutEffect(fn: () => void, options?: Omit<EffectOptions, 'type'>): Dispose {
  return listenerEffect(fn, 'layout', options);
}
