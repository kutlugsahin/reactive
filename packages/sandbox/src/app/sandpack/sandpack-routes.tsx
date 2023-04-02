import helloWorldApp from './hello-world/App';
import reactivityApp from './reactivity/App';
import componentApp from './component/App';
import propsApp from './props/App';
import effectWatch from './effect-watch/App';
import reactiveBoundary from './reactive-boundary/App';
import computed from './computed/App';
import ref from './ref/App';

export const sandpackRoutes = [
  {
    route: '/hello-world',
    component: helloWorldApp,
  },
  {
    route: '/reactivity',
    component: reactivityApp,
  },
  {
    route: '/component',
    component: componentApp,
  },
  {
    route: '/props',
    component: propsApp,
  },
  {
    route: '/effect-watch',
    component: effectWatch,
  },
  {
    route: '/reactive-boundary',
    component: reactiveBoundary,
  },
  {
    route: '/computed',
    component: computed,
  },
  {
    route: '/ref',
    component: ref,
  },
] as const;
