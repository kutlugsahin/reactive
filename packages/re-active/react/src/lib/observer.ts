/* eslint-disable react-hooks/rules-of-hooks */
import { FC, memo, useRef } from 'react';
import { createUniversalState, renderUniversal } from './renderUniversal';
import { RenderResult } from './types';

type ReactiveBoundaryProps<T> = { data: T; children: (data: T) => RenderResult } | { children: () => RenderResult };

function ReactiveBoundaryComponent<T>(props: { data: T; children: (data: T) => RenderResult }) {
  return renderUniversal(useRef(createUniversalState()).current, () => props.children(props.data)) as RenderResult;
}

export const ReactiveBoundary = memo(ReactiveBoundaryComponent) as FC<ReactiveBoundaryProps<any>>;
