import helloWorldFiles from './sandpack/hello-world/files';
import reactivityFiles from './sandpack/reactivity/files';

export const routes = [
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
];
