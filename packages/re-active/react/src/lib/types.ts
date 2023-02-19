import { EffectScope, Ref, UnwrapNestedRefs } from '@vue/reactivity';
import { FC, ReactElement } from 'react';
export type Dictionary = { [key: string]: any };
export type Action = () => void;
export type OnMount = () => void | OnUnmount;
export type OnUnmount = () => void;
export type RenderResult = ReactElement<any, any> | null;
export type Renderer = () => RenderResult;
export type ReactiveProps<P> = { [key in keyof P]: P[key] | Ref<P[key]> };
export type ReactiveComponent<P> = (props: UnwrapNestedRefs<ReactiveProps<P>>) => Renderer;
export type ReactiveComponentWithHandle<P, H> = (props: UnwrapNestedRefs<P>, ref: Ref<H>) => Renderer;

export type ComponentState = {
  scope: EffectScope | undefined;
  computedRender: RenderResult | undefined;
  mounts: OnMount[];
  unMounts: OnUnmount[];
  imperativeHandle?: { [key: string]: () => any };
  updateListeners: Action[];
  layoutListeners: Action[];
  reset(): void;
};

export type Dispose = () => void;

export type ImperativeHandle = {
  [key: string]: (...args: any[]) => any;
};

export type ObserverComponent<P> = FC<UnwrapNestedRefs<ReactiveProps<P>>>;
