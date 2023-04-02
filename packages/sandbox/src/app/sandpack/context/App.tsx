import { component, consumeContext, ref } from '@re-active/react';
import { createContext, useContext } from 'react';
import { Card } from '../shared/card';

const ContextWithRef = createContext(ref(0));

/**
 * consumeContext usage for reactive component definition
 */
const Consumer1 = component(() => {
  const context = consumeContext(ContextWithRef);

  return () => <Card>{context.value}</Card>;
});

/**
 * useContext usage for functional component
 */
const Consumer2 = component(() => {
  const context = useContext(ContextWithRef);

  return <Card>{context.value}</Card>;
});

export default component(() => {
  const countRef = ref(0);

  return () => (
    <Card>
      <ContextWithRef.Provider value={countRef}>
        <Consumer1 />
        <Consumer2 />
        <div>
          <button onClick={() => countRef.value++}>increment countRef</button>
        </div>
      </ContextWithRef.Provider>
    </Card>
  );
});
