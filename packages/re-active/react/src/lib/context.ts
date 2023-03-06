/* eslint-disable react-hooks/rules-of-hooks */
import { Context, useContext } from 'react';
import { registerContextConsumer } from './lifecycles';
import { Ref, shallowRef } from './reactivity';

export function consumeContext<T>(context: Context<T>): Ref<T> {
  const value = useContext(context);

  const result = shallowRef<T>(value);

  registerContextConsumer(context, (value) => {
    result.value = value;
  });

  return result as Ref<T>;
}
