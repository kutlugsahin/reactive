import helloWorldApp from './hello-world/App';
import reactivityApp from './reactivity/App';
import componentApp from './component/App';
import propsApp from './props/App';
import effectWatch from './effect-watch/App';

export const sandpackRoutes = [
  {
    // title: 'Hello World',
    route: 'hello-world',
    component: helloWorldApp,
  },
  {
    // title: 'Reactivity',
    route: '/reactivity',
    component: reactivityApp,
  },
  {
    // title: 'Component',
    route: '/component',
    component: componentApp,
  },
  {
    // title: 'Props',
    route: '/props',
    component: propsApp,
  },
  {
    // title: 'Effect watch',
    route: '/effect-watch',
    component: effectWatch,
  },
];
