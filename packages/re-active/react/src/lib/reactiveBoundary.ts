/* eslint-disable react-hooks/rules-of-hooks */
import { UnwrapRef } from '@vue/reactivity';
import { FC, memo, useRef } from 'react';
import { createRenderComponentState, renderComponent } from './renderComponent';
import { RenderResult } from './types';
import { useReactiveProps } from './utils';

type ReactiveBoundaryProps<T> = { data: T; children: (data: UnwrapRef<T>) => RenderResult } | { children: () => RenderResult };

function ReactiveBoundaryComponent<T>(props: { data: T; children: (data: UnwrapRef<T>) => RenderResult }) {
  const reactiveProps = useReactiveProps(props);
  return renderComponent(useRef(createRenderComponentState()).current, () =>
    reactiveProps.children(reactiveProps.data)
  ) as RenderResult;
}

export const ReactiveBoundary = memo(ReactiveBoundaryComponent) as FC<ReactiveBoundaryProps<any>>;
