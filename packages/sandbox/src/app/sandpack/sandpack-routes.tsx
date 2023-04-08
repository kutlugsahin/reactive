import componentApp from './component/App';
import functionalComponent from './functional-component/App';
import propsApp from './props/App';
import reactiveBoundary from './reactive-boundary/App';
import computed from './computed/App';
import ref from './ref/App';
import context from './context/App';
import lifecycles from './lifecycles/App';
import withHandle from './with-handle/App';
import effect from './effect/App';
import effectCleanup from './effect-cleanup/App';
import reactive from './reactive/App';
import watch from './watch/App';

export const sandpackRoutes = [
  {
    route: '/component',
    component: componentApp,
  }, {
    route: '/functional-component',
    component: functionalComponent,
  },
  {
    route: '/props',
    component: propsApp,
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
  {
    route: '/context',
    component: context,
  },
  {
    route: '/lifecycles',
    component: lifecycles,
  }, {
    route: '/with-handle',
    component: withHandle,
  }, {
    route: '/effect',
    component: effect,
  }, {
    route: '/effect-cleanup',
    component: effectCleanup,
  }, {
    route: '/reactive',
    component: reactive,
  }, {
    route: '/watch',
    component: watch,
  },
] as const;
