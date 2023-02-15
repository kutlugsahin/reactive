import { effect, effectScope } from '@vue/reactivity';
import React, { FC, forwardRef, Ref, useEffect, useImperativeHandle, useLayoutEffect, useState } from 'react';
import { beginRegisterLifecycles, endRegisterLifecycles } from './lifecycles';
import { renderEffectScheduler } from './scheduler';
import { ComponentState, ReactiveComponent } from './types';
import { useForceRender, useReactiveProps } from './utils';

// function resetComponentState(state: Partial<ComponentState>): void {
//   state.unMounts?.forEach((p) => p());
//   state.imperativeHandle = undefined;
//   state.layoutListeners = [];
//   state.updateListeners = [];
//   state.mounts = [];
//   state.unMounts = [];
//   state.computedRender = undefined!;
//   state.dispose?.();
// }

function createComponentState(): ComponentState {
  return {
    imperativeHandle: undefined,
    layoutListeners: [],
    updateListeners: [],
    mounts: [],
    unMounts: [],
    computedRender: undefined,
    scope: undefined,
    reset() {
      this.unMounts.forEach((p) => p());
      this.scope?.stop();
      this.imperativeHandle = undefined;
      this.layoutListeners = [];
      this.updateListeners = [];
      this.mounts = [];
      this.unMounts = [];
      this.computedRender = undefined;
    },
  };
}

function setupComponent<P>(
  componentSetup: ReactiveComponent<P>,
  state: ComponentState,
  props: P,
  forceRender: () => void
) {
  // clearState(state);
  const scope = effectScope();
  state.scope = scope;
  let computedRender: JSX.Element;

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

export function createComponent<Props>(componentSetup: ReactiveComponent<Props>): FC<Props> {
  return (props: Props, ref: Ref<unknown>) => {
    const forceRender = useForceRender();
    const reactiveProps = useReactiveProps<Props>(props);

    const [state] = useState<ComponentState>(() => createComponentState());

    // run for first render
    if (state.computedRender == null) {
      state.reset();
      setupComponent(componentSetup, state, reactiveProps, forceRender);
    }

    useEffect(() => {
      if (state.computedRender == null) {
        setupComponent(componentSetup, state, reactiveProps, forceRender);
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
      state.updateListeners.forEach((p) => p());
    });

    useLayoutEffect(() => {
      state.layoutListeners.forEach((p) => p());
    });

    return state.computedRender as JSX.Element;
  };
}

createComponent.withHandle = function <Props, Handle>(component: ReactiveComponent<Props>) {
  const functionalComponent = createComponent(component);
  return forwardRef<Handle, Props>(functionalComponent as React.ForwardRefRenderFunction<Handle, Props>);
};
