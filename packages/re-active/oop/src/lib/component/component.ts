import { effect, ReactiveEffectRunner, stop } from '@vue/reactivity';
import { createElement, FC, memo, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { DependencyContainer } from 'tsyringe';

import { Context } from '../context/context';
import { Constructor, RendererViewModel } from '../types';
import { setCurrentComponentContainerRef, useViewModel } from './hooks/useViewModel';

function useForceUpdate() {
  const [_, setVal] = useState({});

  return useCallback(() => {
    setVal({});
  }, []);
}

function debounceMicrotask(fn: () => void) {
  let called = false;

  return () => {
    if (!called) {
      called = true;
      queueMicrotask(() => {
        called = false;
        fn();
      });
    }
  };
}

export function component<P>(component: FC<P>) {
  return memo((props: P) => {
    const forceUpdate = useForceUpdate();
    const renderResult = useRef<ReactElement | null>(null);
    const runner = useRef<ReactiveEffectRunner>();
    const propsRef = useRef<P>(props);
    const isDirty = useRef(false);
    const componentContainer = useRef<DependencyContainer>();

    propsRef.current = props;
    isDirty.current = false;

    if (!runner.current) {
      const render = debounceMicrotask(() => {
        if (isDirty.current) {
          forceUpdate();
        }
      });

      runner.current = effect(
        () => {
          setCurrentComponentContainerRef(componentContainer);
          renderResult.current = component(propsRef.current);
        },
        {
          scheduler() {
            isDirty.current = true;
            render();
          },
        }
      );
    } else {
      runner.current?.();
    }

    useEffect(
      () => () => {
        if (runner.current) {
          stop(runner.current);
        }
        runner.current = undefined;

        if (componentContainer.current) {
          componentContainer.current.dispose();
          componentContainer.current = undefined;
        }
      },
      []
    );

    if (componentContainer.current) {
      return createElement(Context.Provider, { value: componentContainer.current }, renderResult.current);
    }

    return renderResult.current;
  }) as FC<P>;
}

component.fromViewModel = <P extends object>(viewModel: Constructor<RendererViewModel>) => {
  const comp = component<P>((props) => {
    const vm = useViewModel(viewModel, props);
    return vm.render();
  });

  comp.displayName = viewModel.name.replace('ViewModel', '');

  return comp;
};
