import React from 'react';

import type { PropsWithChildren } from 'react';

import { useRegisteredContainer } from '../container/useRegisteredContainer';
import { Context } from '../context/context';
import type { ProviderProps } from '../types';

export function ServiceProvider<P extends object>({
  provide,
  children,
  props = {} as P,
}: PropsWithChildren<ProviderProps<P>>) {
  const container = useRegisteredContainer(props, provide);
  return <Context.Provider value={container}>{children}</Context.Provider>;
}
