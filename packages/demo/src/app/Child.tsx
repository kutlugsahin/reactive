import { useEffect, useId, useState } from 'react';

let i = 0;

export function Child() {
  const id = useId();
  const [val, setVal] = useState(0);

  const [state] = useState(() => {
    console.log('create state', i, id);
    return { i: i++ };
  });

  useEffect(() => {
    console.log('mounts', state, id);

    return () => {
      console.log('unmounts', state, id);
    };
  });

  console.log('renders', state, id);

  return <div>Child!!
    <button onClick={() => setVal(p => p+1)}>icn</button>
  </div>;
}
