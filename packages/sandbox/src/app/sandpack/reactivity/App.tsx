import { component, computed, reactive, ref, updateEffect } from '@re-active/react';
import { Card } from '../shared/card';

const ComponentWithRef = component(() => {
  const count = ref(0);

  return () => (
    <Card title="Component with ref">
      <button onClick={() => count.value++}>Count: {count.value}</button>
    </Card>
  );
});

const ComponentWithReactive = component(() => {
  const state = reactive({
    name: 'John',
    lastName: 'Doe',
  });

  const fullName = computed(() => `${state.name} ${state.lastName}`);

  updateEffect(() => {
    console.log(`Full Name changed to ${fullName.value}`);
  });

  function clearName() {
    state.name = 'John';
    state.lastName = 'Doe';
  }

  return () => (
    <Card title="Component with reactive state">
      <input type="text" value={state.name} onChange={(e) => (state.name = e.target.value)} />
      <input type="text" value={state.lastName} onChange={(e) => (state.lastName = e.target.value)} />
      <button onClick={clearName}>Clear</button>
      <div>
        Welcome: {fullName.value}
      </div>
    </Card>
  );
});

export default component(() => (
  <div>
    <ComponentWithRef />
    <ComponentWithReactive />
  </div>
));
