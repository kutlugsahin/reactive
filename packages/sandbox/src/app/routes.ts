import { sandpackRoutes } from './sandpack/sandpack-routes';

import componentFiles from './sandpack/component/files';
import functionalComponentFiles from './sandpack/functional-component/files';
import propsFiles from './sandpack/props/files';
import reactiveBoundaryFiles from './sandpack/reactive-boundary/files';
import computedFiles from './sandpack/computed/files';
import refFiles from './sandpack/ref/files';
import contextFiles from './sandpack/context/files';
import lifecycleFiles from './sandpack/lifecycles/files';
import withHandle from './sandpack/with-handle/files';
import effect from './sandpack/effect/files';
import effectCleanup from './sandpack/effect-cleanup/files';

type AppRoute<T> = T extends readonly (infer R)[] ? R : never;
type RouteTypes = AppRoute<typeof sandpackRoutes>;
type Files = { [key: string]: string };
type Routes = {
  route: RouteTypes['route'];
  title: string;
  files: Files;
  group: 'Reactivity' | 'Context' | 'Component';
};

export const routes: Routes[] = [
  {
    title: 'component()',
    route: '/component',
    files: componentFiles,
    group: 'Component',
  },
  {
    title: 'component() - functional',
    route: '/functional-component',
    files: functionalComponentFiles,
    group: 'Component',
  },
  {
    title: 'Props',
    route: '/props',
    files: propsFiles,
    group: 'Component',
  },
  {
    title: 'ReactiveBoundary',
    route: '/reactive-boundary',
    files: reactiveBoundaryFiles,
    group: 'Component',
  },
  {
    title: 'context',
    route: '/context',
    files: contextFiles,
    group: 'Context',
  },
  {
    title: 'Lifecycles',
    route: '/lifecycles',
    files: lifecycleFiles,
    group: 'Component',
  },
  {
    title: 'Ref forwarding',
    route: '/with-handle',
    files: withHandle,
    group: 'Component',
  },
  {
    title: 'ref()',
    route: '/ref',
    files: refFiles,
    group: 'Reactivity',
  },
  {
    title: 'computed()',
    route: '/computed',
    files: computedFiles,
    group: 'Reactivity',
  },
  {
    title: 'effect()',
    route: '/effect',
    files: effect,
    group: 'Reactivity',
  },
  {
    title: 'effect() - cleanup',
    route: '/effect-cleanup',
    files: effectCleanup,
    group: 'Reactivity',
  },
];
