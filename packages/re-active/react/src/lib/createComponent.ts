import { effect, effectScope } from '@vue/reactivity';
import { FC, forwardRef, Ref, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { beginRegisterLifecycles, endRegisterLifecycles } from './lifecycles';
import { renderEffectScheduler } from './scheduler';
import { ComponentState, ReactiveComponent } from './types';
import { useForceRender, useMountUnmountHooks, useReactiveProps } from './utils';

export function createComponent<Props>(componentSetup: ReactiveComponent<Props>): FC<Props> {
  return (props: Props, ref: Ref<unknown>) => {
    const forceRender = useForceRender();
    const reactiveProps = useReactiveProps<Props>(props);

    const state = useRef<Partial<ComponentState>>({
      mounts: [],
      unMounts: [],
      updateListeners: [],
      layoutListeners: [],
    });

    const fullState = state.current as ComponentState;

    if (!fullState.computedRender) {
      const scope = effectScope();
      fullState.scope = scope;
      let computedRender: JSX.Element;

      scope.run(() => {
        beginRegisterLifecycles(fullState);
        const renderer = componentSetup(reactiveProps);
        endRegisterLifecycles();

        const eff = effect(
          () => {
            if (!computedRender) {
              computedRender = renderer();
            } else {
              fullState.computedRender = renderer();
              forceRender();
            }
          },
          { scheduler: renderEffectScheduler(() => eff) }
        );

        fullState.computedRender = computedRender;
        fullState.dispose = () => scope.stop();
      });
    }

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

    useMountUnmountHooks(fullState);

    return fullState.computedRender;
  };
}

createComponent.withHandle = function <Props, Handle>(component: ReactiveComponent<Props>) {
  const functionalComponent = createComponent(component);
  return forwardRef<Handle, Props>(functionalComponent as React.ForwardRefRenderFunction<Handle, Props>);
};
