import { useEffect } from 'react';
import type { DependencyContainer } from 'tsyringe';

import type { ServiceInstance } from '../types';
import { isMounted } from '../utils/symbols';

export function useHandleLifecycle(container: DependencyContainer, resolvedServices: Set<ServiceInstance>) {
  useEffect(() => {
    const disposers = [...resolvedServices].map((service) => {
      if (!service[isMounted]) {
        service[isMounted] = true;
        service.onMount?.();

        return () => {
          if (service[isMounted]) {
            service[isMounted] = false;
            service.onUnmount?.();
          }
        };
      }
    });

    return () => {
      disposers.forEach((dispose) => {
        dispose?.();
      });
      container.dispose();
    };
  }, [container]);

  return resolvedServices;
}
