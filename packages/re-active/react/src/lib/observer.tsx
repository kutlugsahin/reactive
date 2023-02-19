import { computed, effect, EffectScope, effectScope, UnwrapNestedRefs } from '@vue/reactivity';
import { FC, memo, MemoExoticComponent, useEffect, useMemo, useRef } from 'react';
import { renderEffectScheduler } from './scheduler';
import { ReactiveProps, RenderResult } from './types';
import { useForceRender, useReactiveProps } from './utils';

export function observer<P extends object>(
  component: FC<UnwrapNestedRefs<ReactiveProps<P>>>
): MemoExoticComponent<FC<ReactiveProps<P>>> {
  return memo((props: ReactiveProps<P>) => {
    const forceRender = useForceRender();
    const scope = useRef<EffectScope | null>(null);
    const render = useRef<RenderResult>(null);
    scope.current?.stop();
    scope.current = null;
    render.current = null;

    const reactiveProps = useReactiveProps<ReactiveProps<P>>(props);

    if (!scope.current) {
      scope.current = effectScope();

      scope.current.run(() => {
        const eff = effect(
          () => {
            if (render.current) {
              forceRender();
            } else {
              render.current = component(reactiveProps);
            }
          },
          { scheduler: renderEffectScheduler(() => eff) }
        );
      });
    }

    useEffect(() => {
      if (!scope.current) {
        forceRender();
      }

      return () => {
        scope.current?.stop();
        scope.current = null;
      };
    }, [forceRender]);

    return render.current;
  });
}

export const Observer = (props: { children: () => RenderResult }) => {
  const forceRender = useForceRender();
  const scope = useRef<EffectScope | null>(null);
  const render = useRef<RenderResult>(null);
  scope.current?.stop();
  scope.current = null;
  render.current = null;

  if (!scope.current) {
    scope.current = effectScope();

    scope.current.run(() => {
      const eff = effect(
        () => {
          if (render.current) {
            forceRender();
          } else {
            render.current = props.children();
          }
        },
        { scheduler: renderEffectScheduler(() => eff) }
      );
    });
  }

  useEffect(() => {
    if (!scope.current) {
      forceRender();
    }

    return () => {
      scope.current?.stop();
      scope.current = null;
    };
  }, [forceRender]);

  return render.current;
};
