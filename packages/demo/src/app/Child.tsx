import { useRef, useState } from 'react';

export function Child() {
  const val = useRef({x:1});

  if (val.current.x === 1) {
    val.current.x = 3;
  }

  const [state] = useState(() => {

    return 4;
  })

  return <div>Child!!</div>;
}
