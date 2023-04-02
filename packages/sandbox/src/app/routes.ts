import { sandpackRoutes } from './sandpack/sandpack-routes';

import helloWorldFiles from './sandpack/hello-world/files';
import reactivityFiles from './sandpack/reactivity/files';
import componentFiles from './sandpack/component/files';
import propsFiles from './sandpack/props/files';
import effectWatchFiles from './sandpack/effect-watch/files';
import reactiveBoundaryFiles from './sandpack/reactive-boundary/files';
import computedFiles from './sandpack/computed/files';
import refFiles from './sandpack/ref/files';

type AppRoute<T> = T extends readonly (infer R)[] ? R : never;
type RouteTypes = AppRoute<typeof sandpackRoutes>;
type Files = { [key: string]: string };
type Routes = {
  route: RouteTypes['route'];
  title: string;
  files: Files;
};

export const routes: Routes[] = [
  {
    title: 'Hello World',
    route: '/hello-world',
    files: helloWorldFiles,
  },
  {
    title: 'Reactivity',
    route: '/reactivity',
    files: reactivityFiles,
  },
  {
    title: 'Component',
    route: '/component',
    files: componentFiles,
  },
  {
    title: 'Props',
    route: '/props',
    files: propsFiles,
  },
  {
    title: 'Effect-watch',
    route: '/effect-watch',
    files: effectWatchFiles,
  },
  {
    title: 'ReactiveBoundary',
    route: '/reactive-boundary',
    files: reactiveBoundaryFiles,
  },
  {
    title: 'computed',
    route: '/computed',
    files: computedFiles,
  },
  {
    title: 'ref()',
    route: '/ref',
    files: refFiles,
  },
];
