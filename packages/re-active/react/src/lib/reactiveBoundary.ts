/* eslint-disable react-hooks/rules-of-hooks */
import { FC, memo, useRef } from 'react';
import { createRenderComponentState, renderComponent } from './renderComponent';
import { RenderResult } from './types';

type ReactiveBoundaryProps<T> = { data: T; children: (data: T) => RenderResult } | { children: () => RenderResult };

function ReactiveBoundaryComponent<T>(props: { data: T; children: (data: T) => RenderResult }) {
  return renderComponent(useRef(createRenderComponentState()).current, () => props.children(props.data)) as RenderResult;
}

export const ReactiveBoundary = memo(ReactiveBoundaryComponent) as FC<ReactiveBoundaryProps<any>>;
