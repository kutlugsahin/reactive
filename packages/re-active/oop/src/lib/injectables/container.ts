import { DependencyContainer } from 'tsyringe';

import { initInstance } from '../container/initInstance';
import { Constructor } from '../types';

export class Container {
  constructor(private container: DependencyContainer) {}

  resolve<T extends Constructor>(token: T) {
    return initInstance(this.container.resolve<InstanceType<T>>(token));
  }

  register = this.container.register.bind(this.container);
}
