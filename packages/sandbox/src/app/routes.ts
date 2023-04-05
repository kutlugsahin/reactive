import { sandpackRoutes } from './sandpack/sandpack-routes';

import helloWorldFiles from './sandpack/hello-world/files';
import reactivityFiles from './sandpack/reactivity/files';
import componentFiles from './sandpack/component/files';
import propsFiles from './sandpack/props/files';
import effectWatchFiles from './sandpack/effect-watch/files';
import reactiveBoundaryFiles from './sandpack/reactive-boundary/files';
import computedFiles from './sandpack/computed/files';
import refFiles from './sandpack/ref/files';
import contextFiles from './sandpack/context/files';

type AppRoute<T> = T extends readonly (infer R)[] ? R : never;
type RouteTypes = AppRoute<typeof sandpackRoutes>;
type Files = { [key: string]: string };
type Routes = {
  route: RouteTypes['route'];
  title: string;
  files: Files;
  group: 'Reactivity' | 'Context' | 'Component'
};

export const routes: Routes[] = [
  {
    title: 'Hello World',
    route: '/hello-world',
    files: helloWorldFiles,
    group: 'Component',
  },
  {
    title: 'Reactivity',
    route: '/reactivity',
    files: reactivityFiles,
    group: 'Reactivity',
  },
  {
    title: 'Component',
    route: '/component',
    files: componentFiles,
    group: 'Component',
  },
  {
    title: 'Props',
    route: '/props',
    files: propsFiles,
    group: 'Component',
  },
  {
    title: 'Effect-watch',
    route: '/effect-watch',
    files: effectWatchFiles,
    group: 'Reactivity',
  },
  {
    title: 'ReactiveBoundary',
    route: '/reactive-boundary',
    files: reactiveBoundaryFiles,
    group: 'Component',
  },
  {
    title: 'computed',
    route: '/computed',
    files: computedFiles,
    group: 'Reactivity',
  },
  {
    title: 'ref()',
    route: '/ref',
    files: refFiles,
    group: 'Reactivity',
  },
  {
    title: 'context',
    route: '/context',
    files: contextFiles,
    group: 'Context',
  },
];
