import { effect, effectScope, UnwrapNestedRefs } from '@vue/reactivity';
import React, { FC, forwardRef, Ref, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { beginRegisterLifecycles, endRegisterLifecycles } from './lifecycles';
import { renderEffectScheduler } from './scheduler';
import { ComponentState, ReactiveComponent, ReactiveProps, RenderResult } from './types';
import { createComponentState, useForceRender, useReactiveProps } from './utils';

function setupComponent<P>(
  componentSetup: ReactiveComponent<P>,
  state: ComponentState,
  props: UnwrapNestedRefs<ReactiveProps<P>>,
  forceRender: () => void
) {
  // clearState(state);
  const scope = effectScope();
  state.scope = scope;
  let computedRender: RenderResult;

  scope.run(() => {
    beginRegisterLifecycles(state);
    const renderer = componentSetup(props);
    endRegisterLifecycles();

    const eff = effect(
      () => {
        if (!computedRender) {
          computedRender = renderer();
        } else {
          state.computedRender = renderer();
          forceRender();
        }
      },
      { scheduler: renderEffectScheduler(() => eff) }
    );

    state.computedRender = computedRender;
  });
}

export function createComponent<Props>(componentSetup: ReactiveComponent<Props>): FC<ReactiveProps<Props>> {
  return (props: ReactiveProps<Props>, ref: Ref<unknown>) => {
    const forceRender = useForceRender();
    const reactiveProps = useReactiveProps<ReactiveProps<Props>>(props);
    const shouldTriggerOnMount = useRef(false);
    const [state] = useState<ComponentState>(() => createComponentState());

    // run for first render
    if (state.computedRender == null) {
      state.reset();
      setupComponent(componentSetup, state, reactiveProps, forceRender);
    }

    useEffect(() => {
      if (state.computedRender == null) {
        // setupComponent(componentSetup, state, reactiveProps, forceRender);
        shouldTriggerOnMount.current = true;
        forceRender();
      }

      state.mounts.forEach((p) => {
        const unmount = p();
        if (typeof unmount === 'function') {
          state.unMounts.push(unmount);
        }
      });

      return () => {
        state.reset();
      };
    }, [state, reactiveProps, forceRender]);

    if (state.imperativeHandle) {
      useImperativeHandle(ref, () => state.imperativeHandle);
    }

    useEffect(() => {
      if (shouldTriggerOnMount.current) {
        state.mounts.forEach((p) => p());
      }
    });

    useEffect(() => {
      state.updateListeners.forEach((p) => p());
    });

    useLayoutEffect(() => {
      state.layoutListeners.forEach((p) => p());
    });

    return state.computedRender as RenderResult;
  };
}

createComponent.withHandle = function <Props, Handle>(component: ReactiveComponent<Props>) {
  const functionalComponent = createComponent(component);
  return forwardRef<Handle, Props>(functionalComponent as React.ForwardRefRenderFunction<Handle, Props>);
};
