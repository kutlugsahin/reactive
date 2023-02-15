import { createComponent, onMounted, onUnmounted, reactive, effect, watch, toRef, updateEffect } from '@re-active';

interface ReactiveComponentProps {
  data: string;
}

export const ReactiveComponent = createComponent((props: ReactiveComponentProps) => {
  const state = reactive({
    count: 5,
    unused: 0,
  });

  function inc() {
    state.count++;
    state.count++;
    state.count++;
    state.count++;
  }

  function incUnused() {
    state.unused++;
  }

  effect(() => {
    console.log('effect is running', props.data);
  });

  const data = toRef(props, 'data');

  watch(
    data,
    (newVal, oldVal) => {
      console.log(`watch running new:${newVal}, old: ${oldVal}`);
    },
    { immediate: true }
  );

  updateEffect(() => {
    console.log('state effect running', state.count);
  });

  onUnmounted(() => {
    console.log('unmounted');
  });

  onMounted(() => {
    console.log('mounted');

    return () => {
      console.log('mounted / unmounted');
    };
  });

  return () => {
    console.log('reactive comp render');
    return (
      <div>
        AAAA!!!!
        {state.count} / {props.data}
        <button onClick={inc}>inc</button>
        <button onClick={incUnused}>inc unused</button>
      </div>
    );
  };
});
