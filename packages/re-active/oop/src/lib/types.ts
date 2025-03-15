import { ReactElement, ReactNode } from 'react';
import type { ClassProvider, FactoryProvider, InjectionToken, TokenProvider, ValueProvider } from 'tsyringe';

import type { isLifecycleHandled, isMounted } from './utils/symbols';

export type Constructor<T = any> = new (...args: any[]) => T;

export type InstanceLifecycle = 'singleton' | 'transient' | 'container' | 'resolution';

export type RegisterType<T = any> = {
  token: Constructor<T>;
  factory: ClassProvider<T>;
};

export type Provider<T = any> =
  | ValueProvider<T>
  | ClassProvider<T>
  | FactoryProvider<T>
  | TokenProvider<T>
  | Constructor<T>;

export type Registration<T = any> = {
  token: InjectionToken<T>;
  provider: Provider<T>;
  lifecycle: InstanceLifecycle;
};

export type ProviderProps<P extends object> = {
  readonly provide: readonly (
    | Constructor
    | Registration
    | [InjectionToken, ClassProvider<any>['useClass']]
    | [InjectionToken, ClassProvider<any>['useClass'], InstanceLifecycle]
  )[];
  props?: P;
};

export type Dispose = () => void;

export type OnMount = {
  onMount(): void | Dispose;
};

export type OnUnmount = {
  onUnmount(): void;
};

export type ServiceInstance = OnMount &
  OnUnmount & {
    [isMounted]: boolean;
    [isLifecycleHandled]: boolean;
  };

export type Dictionary<T = any> = {
  [key: string]: T;
};

export type StateMetadata = {
  propertyKey: string;
  type: StateType;
};

export type StateType = 'shallow' | 'deep' | 'ref';

export interface RendererViewModel {
  render(): ReactElement | null;
}
