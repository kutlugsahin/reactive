import { EffectScheduler } from './reactivity';
import { UniversalRenderState } from './types';

export const queueMicrotaskEffect: EffectScheduler = (
  callback: () => void,
  state: UniversalRenderState,
  willRender?: () => void,
) => {
  let isRunning = false;

  return () => {
    if (!isRunning) {
      isRunning = true;
      willRender?.();
      state.isEffectQueued = true;
      queueMicrotask(() => {
        isRunning = false;
        callback();
        state.isEffectQueued = false;
      });
    }
  };
};
