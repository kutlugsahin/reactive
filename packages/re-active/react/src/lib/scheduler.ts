import { EffectScheduler } from './reactivity';

type IsEffectQueuedState = {
  isEffectQueued: boolean;
};

export const queueMicrotaskEffect = (
  callback: () => void,
  state: IsEffectQueuedState,
  willRender?: () => void
): EffectScheduler => {
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
