import helloWorldFiles from './sandpack/hello-world/files';
import reactivityFiles from './sandpack/reactivity/files';
import componentFiles from './sandpack/component/files';
import propsFiles from './sandpack/props/files';
import effectWatchFiles from './sandpack/effect-watch/files';

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
];
