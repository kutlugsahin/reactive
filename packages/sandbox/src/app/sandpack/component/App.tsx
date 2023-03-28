import { component, ref } from '@re-active/react';
import { useState } from 'react';
import { Card } from '../shared/card';

/**
 * Example of reactive component declaration
 * It has it's own local scope which is initialized once
 */
const ReactiveComponent = component(() => {
  const count = ref(0);

  return () => (
    <Card title='Reactive Component'>
      <button onClick={() => count.value++}>ref value: {count.value}</button>
    </Card>
  );
});

/**
 * Example of functional component declaration
 * Same as ordinary react functional component
 * It reacts to reactive data defined by 'reactive' or 'ref
 */
const FunctionalComponent = component(() => {
  const [count, setCount] = useState(0);
  const [reactiveCount] = useState(ref(0));

  return (
    <Card title="Functional Component">
      <button onClick={() => setCount((p) => p + 1)}>state value: {count}</button>
      <button onClick={() => reactiveCount.value++}>ref value: {reactiveCount.value}</button>
    </Card>
  );
});

export default () => {
  return (
    <div>
      <ReactiveComponent />
      <FunctionalComponent />
    </div>
  );
};
