import { createComponent, ref } from '@re-active/react';

export default createComponent(() => {
  const count = ref(0);

  function increment() {
    count.value++;
  }

  return () => (
    <div>
      Current Value: {count.value}
      <br />
      <button onClick={increment}>increment</button>
    </div>
  );
});
