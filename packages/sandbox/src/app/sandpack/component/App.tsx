import { component, ref } from '@re-active/react';
import { Card } from '../shared/card';

const ReactiveComponent = component(() => {
  /**
   * component local scope
   * This scope will get initialized once for each component
   * This is where we define state, callbacks etc.
   */

  /**
   * simple state of a counter
   */
  const count = ref(0);

  /**
   * component renderer function to be called for re-renders
   */
  return () => (
    <Card title='Reactive Component'>
      <button onClick={() => count.value++}>ref value: {count.value}</button>
    </Card>
  );
});

export default () => <ReactiveComponent />
