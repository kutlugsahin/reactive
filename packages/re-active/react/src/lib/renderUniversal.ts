/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from 'react';
import { effect, effectScope } from './reactivity';
import { queueMicrotaskEffect } from './scheduler';
import { UniversalRenderer, UniversalRenderState } from './types';

export function renderUniversal(state: UniversalRenderState, renderer: UniversalRenderer, willRender?: () => void) {
  state.isEffectQueued = false;
  let shouldRunEffect = true;

  if (!state.scope) {
    state.scope = effectScope();

    state.scope.run(() => {
      state.effectRunner = effect(
        () => {
          const result = renderer();

          if (typeof result === 'function') {
            shouldRunEffect = false;
          }

          state.render = result;
        },
        {
          scheduler: queueMicrotaskEffect(
            () => {
              if (state.isEffectQueued) {
                state.forceRender();
              }
            },
            state,
            willRender
          ),
        }
      );
    });
  } else {
    state.effectRunner?.();
  }

  if (shouldRunEffect) {
    useEffect(() => {
      if (!state.scope) {
        state.forceRender();
      }

      return () => {
        state.scope?.stop();
        state.scope = null;
      };
    }, [state]);
  } else {
    state.scope?.stop();
    state.scope = null;
  }

  return state.render;
}
