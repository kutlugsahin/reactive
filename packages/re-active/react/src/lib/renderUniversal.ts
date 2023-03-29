/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from 'react';
import { effect, effectScope } from './reactivity';
import { queueMicrotaskEffect } from './scheduler';
import { UniversalRenderer, UniversalRenderState } from './types';
import { useForceRender } from './utils';

export function createUniversalState() {
  return {
    forceRender: useForceRender(),
    effectRunner: null,
    isEffectQueued: false,
    render: null,
    scope: null,
  };
}

export function renderUniversal(state: UniversalRenderState, renderer: UniversalRenderer, willRender?: () => void) {
  state.isEffectQueued = false;
  let isInSetupStep = false;

  if (!state.scope) {
    state.scope = effectScope();

    state.scope.run(() => {
      state.effectRunner = effect(
        () => {
          const result = renderer();

          /**
           * renderer returns function meaning we are in setup phase
           */
          if (typeof result === 'function') {
            isInSetupStep = true;
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

  /**
   * Don't run if this is for setup
   */
  if (isInSetupStep === false) {
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
    // if renderer returns a function (renderer) which means reactive component
    // stop the effect because we just needed the renderer function
    state.effectRunner?.effect.stop();
    state.scope = null;
  }

  return state.render;
}
