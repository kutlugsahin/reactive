import React, {
  FC,
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import { beginRegisterLifecycles, endRegisterLifecycles } from './lifecycles';
import { renderReactive } from './renderReactive';
import { EffectScope, effectScope } from './reactivity';
import { useForceRender, useReactiveProps } from './utils';
import { ComponentState, ReactiveComponent, ReactiveProps, RenderResult } from './types';

export function createComponent<Props>(componentSetup: ReactiveComponent<Props>): FC<ReactiveProps<Props>> {
  return (props: ReactiveProps<Props>, ref: Ref<unknown>) => {
    const forceRender = useForceRender();
    const reactiveProps = useReactiveProps<ReactiveProps<Props>>(props);
    const state = useRef<ComponentState>(null!);
    const renderer = useRef<() => RenderResult>(null!);
    const setupScope = useRef<EffectScope | null>(null);
    const shouldTriggerMounts = useRef(false);

    // run for first render
    if (setupScope.current == null) {
      setupScope.current = effectScope();
      setupScope.current.run(() => {
        state.current = beginRegisterLifecycles();
        renderer.current = componentSetup(reactiveProps);
        endRegisterLifecycles();
      });
    }

    const triggerMounts = useCallback(() => {
      state.current.mounts.forEach((p) => {
        const unmount = p();
        if (typeof unmount === 'function') {
          state.current.mountMounts.push(unmount);
        }
      });
    }, []);

    useEffect(() => {
      if (setupScope.current == null) {
        shouldTriggerMounts.current = true;
        // will be triggered from renderReactive
        // forceRender();
      } else {
        triggerMounts();
      }

      return () => {
        state.current.unMounts.forEach((p) => p());
        state.current.mountMounts.forEach((p) => p());
        state.current.reset();
        setupScope.current?.stop();
        setupScope.current = null;
      };
    }, [triggerMounts, forceRender]);

    if (state.current.imperativeHandle) {
      useImperativeHandle(ref, () => state.current.imperativeHandle);
    }

    useEffect(() => {
      if (shouldTriggerMounts.current && setupScope.current) {
        shouldTriggerMounts.current = false;
        triggerMounts();
      }
      state.current.updateListeners.forEach((p) => p());
    });

    useLayoutEffect(() => {
      state.current.layoutListeners.forEach((p) => p());
    });

    return renderReactive(renderer.current);
  };
}

createComponent.withHandle = function <Props, Handle>(component: ReactiveComponent<Props>) {
  const functionalComponent = createComponent(component);
  return forwardRef<Handle, Props>(functionalComponent as React.ForwardRefRenderFunction<Handle, Props>);
};
