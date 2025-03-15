import { useContext, useMemo } from 'react';
import { DependencyContainer } from 'tsyringe';

import { createChildContainer } from '../container/createChildContainer';
import { Context } from '../context/context';
import { Container } from '../injectables/container';
import { Props } from '../injectables/tokens';
import { ProviderProps } from '../types';
import { useReactiveProps } from '../utils/useReactiveProps';
import { registerServices } from './registerServices';
import { useHandleLifecycle } from './useHandleLifecycle';

export function useRegisteredContainer<P>(
  props: P,
  services: ProviderProps<any>['provide'],
  existingContainer?: DependencyContainer
) {
  const parentContainer = useContext(Context);

  const mappedProps = useReactiveProps(props ?? {});

  const { container, resolvedServices } = useMemo(() => {
    const container = existingContainer ?? createChildContainer(parentContainer);

    if (!container.isRegistered(Container)) {
      container.register(Container, {
        useValue: new Container(container),
      });
    }

    if (!container.isRegistered(Props)) {
      container.register(Props, {
        useValue: mappedProps,
      });
    }

    const resolvedServices = registerServices(container, services);

    return {
      container,
      resolvedServices,
    };
  }, [existingContainer, parentContainer]);

  useHandleLifecycle(container, resolvedServices);

  return container;
}
