/* eslint-disable react-hooks/rules-of-hooks */
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
import { ComponentState, ComponentDefinition, ReactiveProps, RenderResult } from './types';
import { useReactiveProps } from './utils';

function renderAsFunctionalComponent(
  setupScope: React.MutableRefObject<EffectScope | null>,
  renderer: React.MutableRefObject<() => RenderResult>
) {
  useEffect(
    () => () => {
      setupScope.current?.stop();
    },
    []
  );
  return renderReactive(renderer.current);
}

function createComponentFunction<Props>(componentSetup: ComponentDefinition<Props>): FC<ReactiveProps<Props>> {
  const FunctionalComponent: FC<ReactiveProps<Props>> = (props: ReactiveProps<Props>, ref: Ref<unknown>) => {
    const reactiveProps = useReactiveProps(props);
    const state = useRef<ComponentState>(null!);
    const renderer = useRef<() => RenderResult>(null!);
    const setupScope = useRef<EffectScope | null>(null);
    const shouldTriggerMounts = useRef(false);
    const isFunctionalComponent = useRef(false);

    /**
     * componentSetup is in form of FC so we render as FC and return
     */
    if (isFunctionalComponent.current) {
      return renderAsFunctionalComponent(setupScope, renderer);
    }

    // run for first render
    if (setupScope.current == null) {
      setupScope.current = effectScope();
      setupScope.current.run(() => {
        state.current = beginRegisterLifecycles();
        const setupResult = componentSetup(reactiveProps, ref);
        endRegisterLifecycles();

        // if setup result is a function set renderer to setupResult
        if (typeof setupResult === 'function') {
          renderer.current = setupResult;
        } else {
          // if setup result is not function, it means we have a classic FC
          isFunctionalComponent.current = true;
          return setupResult;
        }
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

    /**
     * Strict mode only for handling second mount
     */
    useEffect(() => {
      if (shouldTriggerMounts.current && setupScope.current) {
        shouldTriggerMounts.current = false;
        queueMicrotask(() => {
          triggerMounts();
        });
      }
    });

    useEffect(() => {
      if (setupScope.current == null) {
        /**
         * For strict mode second mounted call:
         * renderReactive will forceRender and before that happen set shouldTriggerMounts flag to true
         * to be handled by the useEffect above to call triggerMount
         */
        shouldTriggerMounts.current = true;
      } else if (!shouldTriggerMounts.current) {
        /**
         * This runs only for the first mount!! (second mount only in strict mode)
         * if shouldTriggerMounts is set to true,(which means running the strict mode second mount) skip triggerMounts since
         * we need to wait for next render to rebind effect scope
         */
        triggerMounts();
      }

      return () => {
        state.current.unMounts.forEach((p) => p());
        state.current.mountMounts.forEach((p) => p());
        state.current.reset();
        setupScope.current?.stop();
        setupScope.current = null;
      };
    }, [triggerMounts]);

    if (state.current.imperativeHandle) {
      useImperativeHandle(ref, () => state.current.imperativeHandle);
    }

    useEffect(() => {
      state.current.updateListeners.forEach((p) => p());
      state.current.willRender = false;
    });

    useLayoutEffect(() => {
      state.current.layoutListeners.forEach((p) => p());
    });

    return renderReactive(renderer.current, () => {
      state.current.willRender = true;
    });
  };

  FunctionalComponent.displayName = componentSetup.name;

  return FunctionalComponent;
}

export function component<Props>(componentSetup: ComponentDefinition<Props>): FC<ReactiveProps<Props>> {
  return memo(createComponentFunction(componentSetup));
}

component.withHandle = function <Props, Handle>(component: ComponentDefinition<Props>) {
  const functionalComponent = createComponentFunction(component);
  return memo(forwardRef<Handle, Props>(functionalComponent as React.ForwardRefRenderFunction<Handle, Props>));
};
