import helloWorldApp from './hello-world/App';
import reactivityApp from './reactivity/App';

export const sandpackRoutes = [
  {
    title: 'Hello World',
    route: 'hello-world',
    component: helloWorldApp,
  },
  {
    title: 'Reactivity',
    route: '/reactivity',
    component: reactivityApp,
  },
];
