import React from 'react';
import { EffectScheduler } from './reactivity';

export const queueMicrotaskEffect: EffectScheduler = (
  callback: () => void,
  isEffectQueued: React.MutableRefObject<boolean>
) => {
  let isRunning = false;

  return () => {
    if (!isRunning) {
      isRunning = true;
      isEffectQueued.current = true;
      queueMicrotask(() => {
        isRunning = false;
        callback();
        isEffectQueued.current = false;
      });
    }
  };
};
