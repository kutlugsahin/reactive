/* eslint-disable react-hooks/rules-of-hooks */
import { Context, useContext } from 'react';
import { registerContextConsumer } from './lifecycles';
import { ShallowRef, shallowRef, unref, UnwrapRef } from './reactivity';

export function consumeContext<T>(context: Context<T>): ShallowRef<UnwrapRef<T>> {
  const value = useContext(context);

  const result = shallowRef<T>(value);

  registerContextConsumer(context, (value) => {
    result.value = unref(value);
  });

  return result as ShallowRef<UnwrapRef<T>>;
}
