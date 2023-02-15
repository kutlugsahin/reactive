import { useState } from 'react';

export function Child() {
  const [state] = useState(() => {

    return 4;
  })

  return <div>Child!!</div>;
}
