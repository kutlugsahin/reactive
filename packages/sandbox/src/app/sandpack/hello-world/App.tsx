import { component, ref } from '@re-active/react';

export default component(() => {
  const count = ref(0);

  function increment() {
    count.value++;
  }

  return () => (
    <div className='card'>
      Current Value: {count.value}
      <br />
      <button onClick={increment}>increment</button>
    </div>
  );
});
