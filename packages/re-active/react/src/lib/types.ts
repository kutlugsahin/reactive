import { Ref, UnwrapNestedRefs } from './reactivity';
import React, { Context, FC, ReactElement } from 'react';
export type Dictionary = { [key: string]: any };
export type Action = () => void;
export type OnMount = () => void | OnUnmount;
export type OnUnmount = () => void;
export type RenderResult = ReactElement<any, any> | null;
export type Renderer = () => RenderResult;
export type ReactiveProps<P> = { [key in keyof P]: P[key] | Ref<P[key]> };
export type ReactiveComponent<P> = (props: UnwrapNestedRefs<ReactiveProps<P>>) => Renderer;
export type ReactiveComponentWithHandle<P, H> = (props: UnwrapNestedRefs<ReactiveProps<P>>, ref: React.Ref<H>) => Renderer;
export type ComponentState = {
  mounts: OnMount[];
  unMounts: OnUnmount[];
  mountMounts: OnUnmount[];
  imperativeHandle?: { [key: string]: () => any };
  updateListeners: Action[];
  layoutListeners: Action[];
  contextListeners: {
    context: Context<any>;
    callback: (value: any) => void;
  }[];
  reset(): void;
  willRender: boolean;
};

export type Dispose = () => void;

export type ImperativeHandle = {
  [key: string]: (...args: any[]) => any;
};

export type ObserverComponent<P> = FC<UnwrapNestedRefs<ReactiveProps<P>>>;
