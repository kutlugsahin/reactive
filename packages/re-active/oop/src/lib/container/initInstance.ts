import { initState } from '../reactivity';
import { initDerived } from '../reactivity/derived';
import { initTrigger } from '../reactivity/trigger';
import { Dictionary, Dispose } from '../types';
import { bindMethods, patchClassInstanceMethod } from '../utils/object';
import { isInitialized as initialized } from '../utils/symbols';

export function initInstance<T extends Dictionary>(instance: T) {
  if (!isInitialized(instance)) {
    try {
      const disposers: Dispose[] = [];
      setInitialized(instance);

      patchClassInstanceMethod(instance, 'onUnmount', function dispose() {
        disposers.forEach((dispose) => {
          dispose();
        });
      });

      const params = {
        instance,
        disposers,
      };

      initState(params);
      initDerived(params);
      initTrigger(params);
      bindMethods(instance);
      instance['init']?.();
    } catch (error) {
      console.error('Impair Error initializing instance', instance, error);
      setInitialized(instance, false);
    }
  }

  return instance;
}

function setInitialized(instance: any, value = true) {
  instance[initialized] = value;
}

function isInitialized(instance: any): boolean {
  return instance[initialized] ?? false;
}
