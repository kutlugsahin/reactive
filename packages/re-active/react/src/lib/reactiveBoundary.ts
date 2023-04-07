/* eslint-disable react-hooks/rules-of-hooks */
import { UnwrapRef } from '@vue/reactivity';
import { FC, memo, useRef } from 'react';
import { createRenderComponentState, renderComponent } from './renderComponent';
import { RenderResult } from './types';
import { useReactiveProps } from './utils';

function ReactiveBoundaryComponent(props: { data: undefined; children: () => RenderResult }): ReturnType<FC>;
function ReactiveBoundaryComponent<T>(props: {
  data: T;
  children: (data: UnwrapRef<T>) => RenderResult;
}): ReturnType<FC>;
function ReactiveBoundaryComponent<T>(props: { data?: T; children: (data?: UnwrapRef<T>) => RenderResult }) {
  const reactiveProps = useReactiveProps(props);
  return renderComponent(useRef(createRenderComponentState()).current, () =>
    reactiveProps.children(reactiveProps.data)
  ) as RenderResult;
}

export const ReactiveBoundary = memo(ReactiveBoundaryComponent) as typeof ReactiveBoundaryComponent;
