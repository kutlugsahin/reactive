import { createElement, type PropsWithChildren } from 'react';

import { useRegisteredContainer } from '../container/useRegisteredContainer';
import { Context } from '../context/context';
import type { ProviderProps } from '../types';

export function ServiceProvider<P extends object>({
  provide,
  children,
  props = {} as P,
}: PropsWithChildren<ProviderProps<P>>) {
  const container = useRegisteredContainer(props, provide);
  return createElement(Context.Provider, { value: container }, children);
}
