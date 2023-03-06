import React, {
  FC,
  forwardRef,
  memo,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import { beginRegisterLifecycles, endRegisterLifecycles } from './lifecycles';
import { EffectScope, effectScope } from './reactivity';
import { renderReactive } from './renderReactive';
import { ComponentState, ReactiveComponent, ReactiveProps, RenderResult } from './types';
import { useForceRender, useReactiveProps } from './utils';

function createComponentFunction<Props>(componentSetup: ReactiveComponent<Props>): FC<ReactiveProps<Props>> {
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
    } else {
      if (state.current.contextListeners) {
        state.current.contextListeners.forEach(({ context, callback }) => {
          const contextValue = useContext(context);
          callback(contextValue);
        });
      }
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

export function createComponent<Props>(componentSetup: ReactiveComponent<Props>): FC<ReactiveProps<Props>> {
  return memo(createComponentFunction(componentSetup));
}

createComponent.withHandle = function <Props, Handle>(component: ReactiveComponent<Props>) {
  const functionalComponent = createComponentFunction(component);
  return memo(forwardRef<Handle, Props>(functionalComponent as React.ForwardRefRenderFunction<Handle, Props>));
};
