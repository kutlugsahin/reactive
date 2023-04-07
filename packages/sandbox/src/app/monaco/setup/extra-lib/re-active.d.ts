import React, { ReactElement, FC, Context } from 'react';
import { UnwrapRef as UnwrapRef$1 } from '@vue/reactivity';

type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRefSimple<T>;
/**
 * Creates a reactive copy of the original object.
 *
 * The reactive conversion is "deep"—it affects all nested properties. In the
 * ES2015 Proxy based implementation, the returned proxy is **not** equal to the
 * original object. It is recommended to work exclusively with the reactive
 * proxy and avoid relying on the original object.
 *
 * A reactive object also automatically unwraps refs contained in it, so you
 * don't need to use `.value` when accessing and mutating their value:
 *
 * ```js
 * const count = ref(0)
 * const obj = reactive({
 *   count
 * })
 *
 * obj.count++
 * obj.count // -> 1
 * count.value // -> 1
 * ```
 */
declare function reactive<T extends object>(target: T): UnwrapNestedRefs<T>;
declare const ShallowReactiveMarker: unique symbol;
type ShallowReactive<T> = T & {
    [ShallowReactiveMarker]?: true;
};
/**
 * Return a shallowly-reactive copy of the original object, where only the root
 * level properties are reactive. It also does not auto-unwrap refs (even at the
 * root level).
 */
declare function shallowReactive<T extends object>(target: T): ShallowReactive<T>;
type Primitive = string | number | boolean | bigint | symbol | undefined | null;
type Builtin = Primitive | Function | Date | Error | RegExp;
type DeepReadonly<T> = T extends Builtin ? T : T extends Map<infer K, infer V> ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> : T extends ReadonlyMap<infer K, infer V> ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> : T extends WeakMap<infer K, infer V> ? WeakMap<DeepReadonly<K>, DeepReadonly<V>> : T extends Set<infer U> ? ReadonlySet<DeepReadonly<U>> : T extends ReadonlySet<infer U> ? ReadonlySet<DeepReadonly<U>> : T extends WeakSet<infer U> ? WeakSet<DeepReadonly<U>> : T extends Promise<infer U> ? Promise<DeepReadonly<U>> : T extends Ref<infer U> ? Readonly<Ref<DeepReadonly<U>>> : T extends {} ? {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
} : Readonly<T>;
/**
 * Creates a readonly copy of the original object. Note the returned copy is not
 * made reactive, but `readonly` can be called on an already reactive object.
 */
declare function readonly<T extends object>(target: T): DeepReadonly<UnwrapNestedRefs<T>>;
/**
 * Returns a reactive-copy of the original object, where only the root level
 * properties are readonly, and does NOT unwrap refs nor recursively convert
 * returned properties.
 * This is used for creating the props proxy object for stateful components.
 */
declare function shallowReadonly<T extends object>(target: T): Readonly<T>;
declare function isReactive(value: unknown): boolean;
declare function isReadonly(value: unknown): boolean;
declare function isShallow(value: unknown): boolean;
declare function isProxy(value: unknown): boolean;
declare function toRaw<T>(observed: T): T;
type Raw<T> = T & {
    [RawSymbol]?: true;
};
declare function markRaw<T extends object>(value: T): Raw<T>;

type CollectionTypes = IterableCollections | WeakCollections;
type IterableCollections = Map<any, any> | Set<any>;
type WeakCollections = WeakMap<any, any> | WeakSet<any>;

declare const enum TrackOpTypes {
    GET = "get",
    HAS = "has",
    ITERATE = "iterate"
}
declare const enum TriggerOpTypes {
    SET = "set",
    ADD = "add",
    DELETE = "delete",
    CLEAR = "clear"
}

declare class EffectScope {
    detached: boolean;
    /* removed internal: _active */
    /* removed internal: effects */
    /* removed internal: cleanups */
    /* removed internal: parent */
    /* removed internal: scopes */
    /* removed internal: index */
    constructor(detached?: boolean);
    get active(): boolean;
    run<T>(fn: () => T): T | undefined;
    /* removed internal: on */
    /* removed internal: off */
    stop(fromParent?: boolean): void;
}
declare function effectScope(detached?: boolean): EffectScope;
declare function getCurrentScope(): EffectScope | undefined;
declare function onScopeDispose(fn: () => void): void;

declare const ComputedRefSymbol: unique symbol;
interface ComputedRef<T = any> extends WritableComputedRef<T> {
    readonly value: T;
    [ComputedRefSymbol]: true;
}
interface WritableComputedRef<T> extends Ref<T> {
    readonly effect: ReactiveEffect<T>;
}
type ComputedGetter<T> = (...args: any[]) => T;
type ComputedSetter<T> = (v: T) => void;
interface WritableComputedOptions<T> {
    get: ComputedGetter<T>;
    set: ComputedSetter<T>;
}
declare function computed<T>(getter: ComputedGetter<T>, debugOptions?: DebuggerOptions): ComputedRef<T>;
declare function computed<T>(options: WritableComputedOptions<T>, debugOptions?: DebuggerOptions): WritableComputedRef<T>;

type EffectScheduler = (...args: any[]) => any;
type DebuggerEvent = {
    effect: ReactiveEffect;
} & DebuggerEventExtraInfo;
type DebuggerEventExtraInfo = {
    target: object;
    type: TrackOpTypes | TriggerOpTypes;
    key: any;
    newValue?: any;
    oldValue?: any;
    oldTarget?: Map<any, any> | Set<any>;
};
declare class ReactiveEffect<T = any> {
    fn: () => T;
    scheduler: EffectScheduler | null;
    active: boolean;
    deps: Dep[];
    parent: ReactiveEffect | undefined;
    /* removed internal: computed */
    /* removed internal: allowRecurse */
    /* removed internal: deferStop */
    onStop?: () => void;
    onTrack?: (event: DebuggerEvent) => void;
    onTrigger?: (event: DebuggerEvent) => void;
    constructor(fn: () => T, scheduler?: EffectScheduler | null, scope?: EffectScope);
    run(): T | undefined;
    stop(): void;
}
interface DebuggerOptions {
    onTrack?: (event: DebuggerEvent) => void;
    onTrigger?: (event: DebuggerEvent) => void;
}
interface ReactiveEffectOptions extends DebuggerOptions {
    lazy?: boolean;
    scheduler?: EffectScheduler;
    scope?: EffectScope;
    allowRecurse?: boolean;
    onStop?: () => void;
}
declare function pauseTracking(): void;
declare function enableTracking(): void;

type Dep = Set<ReactiveEffect> & TrackedMarkers;
/**
 * wasTracked and newTracked maintain the status for several levels of effect
 * tracking recursion. One bit per level is used to define whether the dependency
 * was/is tracked.
 */
type TrackedMarkers = {
    /**
     * wasTracked
     */
    w: number;
    /**
     * newTracked
     */
    n: number;
};

declare const RefSymbol: unique symbol;
declare const RawSymbol: unique symbol;
interface Ref<T = any> {
    value: T;
    /**
     * Type differentiator only.
     * We need this to be in public d.ts but don't want it to show up in IDE
     * autocomplete, so we use a private Symbol instead.
     */
    [RefSymbol]: true;
}
declare function isRef<T>(r: Ref<T> | unknown): r is Ref<T>;
declare function ref<T extends object>(value: T): [T] extends [Ref] ? T : Ref<UnwrapRef<T>>;
declare function ref<T>(value: T): Ref<UnwrapRef<T>>;
declare function ref<T = any>(): Ref<T | undefined>;
declare const ShallowRefMarker: unique symbol;
type ShallowRef<T = any> = Ref<T> & {
    [ShallowRefMarker]?: true;
};
declare function shallowRef<T extends object>(value: T): T extends Ref ? T : ShallowRef<T>;
declare function shallowRef<T>(value: T): ShallowRef<T>;
declare function shallowRef<T = any>(): ShallowRef<T | undefined>;
declare function triggerRef(ref: Ref): void;
declare function unref<T>(ref: T | Ref<T>): T;
type CustomRefFactory<T> = (track: () => void, trigger: () => void) => {
    get: () => T;
    set: (value: T) => void;
};
declare function customRef<T>(factory: CustomRefFactory<T>): Ref<T>;
type ToRefs<T = any> = {
    [K in keyof T]: ToRef<T[K]>;
};
declare function toRefs<T extends object>(object: T): ToRefs<T>;
type ToRef<T> = IfAny<T, Ref<T>, [T] extends [Ref] ? T : Ref<T>>;
declare function toRef<T extends object, K extends keyof T>(object: T, key: K): ToRef<T[K]>;
declare function toRef<T extends object, K extends keyof T>(object: T, key: K, defaultValue: T[K]): ToRef<Exclude<T[K], undefined>>;
type BaseTypes = string | number | boolean;
/**
 * This is a special exported interface for other packages to declare
 * additional types that should bail out for ref unwrapping. For example
 * \@vue/runtime-dom can declare it like so in its d.ts:
 *
 * ``` ts
 * declare module '@vue/reactivity' {
 *   export interface RefUnwrapBailTypes {
 *     runtimeDOMBailTypes: Node | Window
 *   }
 * }
 * ```
 */
interface RefUnwrapBailTypes {
}
type ShallowUnwrapRef<T> = {
    [K in keyof T]: T[K] extends Ref<infer V> ? V : T[K] extends Ref<infer V> | undefined ? unknown extends V ? undefined : V | undefined : T[K];
};
type UnwrapRef<T> = T extends ShallowRef<infer V> ? V : T extends Ref<infer V> ? UnwrapRefSimple<V> : UnwrapRefSimple<T>;
type UnwrapRefSimple<T> = T extends Function | CollectionTypes | BaseTypes | Ref | RefUnwrapBailTypes[keyof RefUnwrapBailTypes] | {
    [RawSymbol]?: true;
} ? T : T extends ReadonlyArray<any> ? {
    [K in keyof T]: UnwrapRefSimple<T[K]>;
} : T extends object & {
    [ShallowReactiveMarker]?: never;
} ? {
    [P in keyof T]: P extends symbol ? T[P] : UnwrapRef<T[P]>;
} : T;

type OnMount = () => void | OnUnmount;
type OnUnmount = () => void;
type RenderResult = ReactElement<any, any> | null;
type Renderer = () => RenderResult;
type ReactiveProps<P> = {
    [key in keyof P]: P[key] | Ref<P[key]>;
};
type ReactiveComponent<P> = (props: UnwrapNestedRefs<ReactiveProps<P>>) => Renderer;
type ReactiveComponentWithHandle<P, H> = (props: UnwrapNestedRefs<ReactiveProps<P>>, ref: React.Ref<H>) => Renderer;
type Dispose = () => void;

declare function component<Props>(componentSetup: FC<UnwrapNestedRefs<ReactiveProps<Props>>>): FC<ReactiveProps<Props>>;
declare function component<Props>(componentSetup: ReactiveComponent<Props>): FC<ReactiveProps<Props>>;
declare namespace component {
    var withHandle: <Props, Handle>(component: ReactiveComponentWithHandle<Props, Handle>) => React.MemoExoticComponent<React.ForwardRefExoticComponent<React.PropsWithoutRef<Props> & React.RefAttributes<Handle>>>;
}

type EffectType = 'sync' | 'update' | 'layout';
type Cleanup = () => void;
type EffectCallback = () => void | Cleanup;
type EffectOptions = Pick<ReactiveEffectOptions, 'onTrack' | 'onTrigger'> & {
    type?: EffectType;
};
declare function effect(fn: EffectCallback, options?: EffectOptions): Dispose;
declare function updateEffect(fn: EffectCallback, options?: Omit<EffectOptions, 'type'>): Dispose;
declare function layoutEffect(fn: EffectCallback, options?: Omit<EffectOptions, 'type'>): Dispose;
declare const untracked: <T>(fn: () => T) => T;

declare function onMounted(onMount: OnMount): void;
declare function onUnmounted(onUnmounted: OnUnmount): void;
declare function imperativeHandle<T extends {}>(handle: T): void;

declare function consumeContext<T>(context: Context<T>): ShallowRef<UnwrapRef<T>>;

type ReactiveBoundaryProps<T> = {
    data: T;
    children: (data: UnwrapRef$1<T>) => RenderResult;
} | {
    children: () => RenderResult;
};
declare const ReactiveBoundary: FC<ReactiveBoundaryProps<any>>;

type WatchCallback<T> = (newValue: T, oldValue?: T) => void;
type WatchOptions = EffectOptions & {
    immediate?: boolean;
    deep?: boolean;
};
type WatchSource = (() => unknown) | Ref<unknown> | object;
declare function watch<T>(source: Ref<T>, clb: WatchCallback<T>, options?: WatchOptions): Dispose;
declare function watch<T>(source: () => T, clb: WatchCallback<T>, options?: WatchOptions): Dispose;
declare function watch<T extends object>(source: T, clb: WatchCallback<T>, options?: WatchOptions): Dispose;

export { Cleanup, ComputedGetter, ComputedRef, ComputedSetter, CustomRefFactory, DebuggerOptions, DeepReadonly, Dispose, EffectCallback, EffectOptions, EffectScheduler, EffectScope, EffectType, OnMount, OnUnmount, Raw, ReactiveBoundary, ReactiveComponent, Ref, ShallowReactive, ShallowRef, ShallowUnwrapRef, ToRef, ToRefs, UnwrapNestedRefs, UnwrapRef, WatchCallback, WatchOptions, WatchSource, component, computed, consumeContext, customRef, effect, effectScope, enableTracking, getCurrentScope, imperativeHandle, isProxy, isReactive, isReadonly, isRef, isShallow, layoutEffect, markRaw, onMounted, onScopeDispose, onUnmounted, pauseTracking, reactive, readonly, ref, shallowReactive, shallowReadonly, shallowRef, toRaw, toRef, toRefs, triggerRef, unref, untracked, updateEffect, watch };
