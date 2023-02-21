/* eslint-disable react-hooks/rules-of-hooks */
import { UnwrapNestedRefs } from '@vue/reactivity';
import { FC, memo, MemoExoticComponent } from 'react';
import { renderReactive } from './renderReactive';
import { ReactiveProps, RenderResult } from './types';
import { useReactiveProps } from './utils';

export function observer<P extends object>(
  component: FC<UnwrapNestedRefs<ReactiveProps<P>>>
): MemoExoticComponent<FC<ReactiveProps<P>>> {
  return memo((props: ReactiveProps<P>) => {
    const reactiveProps = useReactiveProps<ReactiveProps<P>>(props);
    return renderReactive(() => component(reactiveProps));
  });
}

export const Observer = memo((props: { children: () => RenderResult }) => {
  return renderReactive(props.children);
});
