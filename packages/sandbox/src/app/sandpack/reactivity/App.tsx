import { createComponent, ref } from '@re-active/react';
import { store } from './store';

export default createComponent(() => {
  const count = ref(0);

  return () => (
    <div>
      <button onClick={() => count.value++}>
        {count.value} {store.count}
      </button>
    </div>
  );
});
