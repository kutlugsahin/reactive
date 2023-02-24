import { Context } from 'react';
import { registerContextConsumer } from './lifecycles';
import { Ref, shallowRef } from './reactivity';

export function consumeContext<T>(context: Context<T>): Ref<T> {
  const result = shallowRef<T>();

  registerContextConsumer(context, (value) => {
    result.value = value;
  });

  return result as Ref<T>;
}
