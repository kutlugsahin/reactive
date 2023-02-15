import { EffectScheduler, ReactiveEffectRunner } from '@vue/reactivity';

export const renderEffectScheduler: EffectScheduler = (
  getEffect: () => ReactiveEffectRunner<unknown>
) => {
  let isRunning = false;

  return () => {
    const effect = getEffect();
    if (!isRunning) {
      isRunning = true;
      queueMicrotask(() => {
        effect();
        isRunning = false;
      });
    }
  };
};
