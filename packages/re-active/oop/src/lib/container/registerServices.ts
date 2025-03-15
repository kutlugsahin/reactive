import { DependencyContainer, Lifecycle } from 'tsyringe';

import { InstanceLifecycle, ProviderProps, Registration, ServiceInstance } from '../types';
import { isLifecycleHandled } from '../utils/symbols';

function toLifecycle(lifecycle: InstanceLifecycle): Lifecycle {
  switch (lifecycle) {
    case 'singleton':
      return Lifecycle.Singleton;
    case 'transient':
      return Lifecycle.Transient;
    case 'container':
      return Lifecycle.ContainerScoped;
    case 'resolution':
      return Lifecycle.ResolutionScoped;
    default:
      throw new Error('Invalid lifecycle');
  }
}

function getRegistrationOptions(registration: ProviderProps<any>['provide'][0]): Registration {
  /**
   * If the registration is a function,
   * it means that it is a class to be registered as singleton
   */
  if (typeof registration === 'function') {
    const serviceClass = registration;
    return {
      token: serviceClass,
      provider: {
        useClass: serviceClass,
      },
      lifecycle: 'singleton',
    };
  }

  /**
   * The registration is a tuple of token and useClass,
   */
  if (Array.isArray(registration)) {
    const [serviceToken, providedClass, lifecycle = 'singleton'] = registration;
    return {
      token: serviceToken,
      provider: {
        useClass: providedClass,
      },
      lifecycle,
    };
  }

  /**
   * If the registration is an object,
   * it means that it is a custom registration
   */
  if (typeof registration === 'object') {
    if (!registration.lifecycle) {
      return {
        ...registration,
        lifecycle: 'singleton',
      };
    }

    return registration;
  }

  throw new Error('Invalid service provider registration');
}

export function registerServices(container: DependencyContainer, services: ProviderProps<any>['provide']) {
  const resolvedServices = new Set<ServiceInstance>();
  services.forEach((serviceInfo) => {
    const { provider, token, lifecycle } = getRegistrationOptions(serviceInfo);

    container.register(token, provider as any, {
      lifecycle: toLifecycle(lifecycle),
    });

    container.afterResolution(
      token,
      (_, result) => {
        if (!result[isLifecycleHandled]) {
          result[isLifecycleHandled] = true;
          resolvedServices.add(result);
        }
      },
      { frequency: 'Once' }
    );
  });

  return resolvedServices;
}
