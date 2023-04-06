import { component, ref } from '@re-active/react';
import { useState } from 'react';
import { Card } from '../shared/card';

const globalCount = ref(0);

/**
 * React functional component wrapped with component()
 * Works like ordinary react components but it's also reactive!!
 */
const FunctionalComponent = component(() => {
  const [count, setCount] = useState(0);

  return (
    <Card title='Functional Component'>
      <button onClick={() => setCount(p => p + 1)}>count: {count}</button>
      <button onClick={() => globalCount.value++}>global count: {globalCount.value}</button>
    </Card>
  );
});

export default () => <FunctionalComponent />
