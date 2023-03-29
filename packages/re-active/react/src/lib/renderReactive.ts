/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef } from 'react';
import { effect, EffectScope, effectScope, ReactiveEffectRunner } from './reactivity';
import { queueMicrotaskEffect } from './scheduler';
import { RenderResult } from './types';
import { useForceRender } from './utils';

export function renderReactive(renderer: () => RenderResult, willRender?: () => void) {
  const forceRender = useForceRender();
  const scope = useRef<EffectScope | null>(null);
  const render = useRef<RenderResult>(null);
  const effectRunner = useRef<ReactiveEffectRunner<unknown> | null>(null);
  const effectQueueState = useRef<{
    isEffectQueued: boolean;
  }>({ isEffectQueued: false });

  effectQueueState.current.isEffectQueued = false;

  if (!scope.current) {
    scope.current = effectScope();

    scope.current.run(() => {
      effectRunner.current = effect(
        () => {
          render.current = renderer();
        },
        {
          scheduler: queueMicrotaskEffect(
            () => {
              if (effectQueueState.current.isEffectQueued) {
                forceRender();
              }
            },
            effectQueueState.current,
            willRender
          ),
        }
      );
    });
  } else {
    effectRunner.current?.();
  }

  useEffect(() => {
    if (!scope.current) {
      forceRender();
    }

    return () => {
      scope.current?.stop();
      scope.current = null;
    };
  }, [forceRender]);

  return render.current;
}
