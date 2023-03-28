import helloWorldApp from './hello-world/App';
import reactivityApp from './reactivity/App';
import componentApp from './component/App';
import propsApp from './props/App';
import effectWatch from './effect-watch/App';

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
] as const;
