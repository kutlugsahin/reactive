import { provideMetadataKey } from '../utils/symbols';
import { Constructor, ProviderProps } from '../types';

export function provider(registrations: ProviderProps<any>['provide']) {
  return function <T extends Constructor>(target: T) {
    Reflect.metadata(provideMetadataKey, registrations)(target);
  };
}
