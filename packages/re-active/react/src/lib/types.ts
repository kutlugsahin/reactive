import { EffectScope } from '@vue/reactivity';
import React from 'react';
export type Action = () => void;
export type OnMount = () => void | OnUnmount;
export type OnUnmount = () => void;
export type ReactiveComponent<Props> = (props: Props) => () => JSX.Element;
export type ReactiveComponentWithHandle<Props, Handle> = (props: Props, ref: React.Ref<Handle>) => () => JSX.Element;

export type ComponentState = {
  scope: EffectScope;
  computedRender: JSX.Element;
  dispose: () => void;
  mounts: OnMount[];
  unMounts: OnUnmount[];
  imperativeHandle?: { [key: string]: () => any };
  updateListeners: Action[];
  layoutListeners: Action[];
};

export type Dispose = () => void;

export type ImperativeHandle = {
  [key: string]: (...args: any[]) => any;
};
