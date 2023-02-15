import { effect, effectScope } from '@vue/reactivity';
import { FC, forwardRef, Ref, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { beginRegisterLifecycles, endRegisterLifecycles } from './lifecycles';
import { renderEffectScheduler } from './scheduler';
import { ComponentState, ReactiveComponent } from './types';
import { useForceRender, useMountUnmountHooks, useReactiveProps } from './utils';

function clearState(state: Partial<ComponentState>): void {
  state.unMounts?.forEach((p) => p());
  state.imperativeHandle = undefined;
  state.layoutListeners = [];
  state.updateListeners = [];
  state.mounts = [];
  state.unMounts = [];
  state.computedRender = undefined!;
  state.dispose?.();
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
    state.dispose = () => scope.stop();
  });
}

export function createComponent<Props>(componentSetup: ReactiveComponent<Props>): FC<Props> {
  return (props: Props, ref: Ref<unknown>) => {
    const forceRender = useForceRender();
    const reactiveProps = useReactiveProps<Props>(props);

    const state = useRef<Partial<ComponentState>>({});

    const fullState = state.current as ComponentState;

    // run for first render
    if (!fullState.computedRender) {
      clearState(fullState);
      setupComponent(componentSetup, fullState, reactiveProps, forceRender);
    }

    useEffect(() => {
      if (!fullState.computedRender) {
        forceRender();
      }

      fullState.mounts.forEach((p) => {
        const unmount = p();
        if (typeof unmount === 'function') {
          fullState.unMounts.push(unmount);
        }
      });

      return () => {
        clearState(fullState);
      };
    }, []);

    if (fullState.imperativeHandle) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      useImperativeHandle(ref, () => fullState.imperativeHandle);
    }

    // if (fullState.updateListeners.length) {
    useEffect(() => {
      fullState.updateListeners.forEach((p) => p());
    });
    // }

    // if (fullState.layoutListeners.length) {
    useLayoutEffect(() => {
      fullState.layoutListeners.forEach((p) => p());
    });
    // }

    // useMountUnmountHooks(fullState);

    return fullState.computedRender;
  };
}

createComponent.withHandle = function <Props, Handle>(component: ReactiveComponent<Props>) {
  const functionalComponent = createComponent(component);
  return forwardRef<Handle, Props>(functionalComponent as React.ForwardRefRenderFunction<Handle, Props>);
};
