import { createComponent, reactive, ref } from '@re-active';

const Inner = createComponent<{data: number}>((props) => {
  const state = reactive({
    count: 0,
  });



  return () => {
    console.log('inner renders');
    return (
      <div>
        Inner: {state.count} / Prop: {props.data}
        <button onClick={() => state.count++}>inc</button>
      </div>
    );
  };
});

export const Outer = createComponent(() => {
  const state = reactive({
    count: 0,
  });

  const innerProp = ref(0);

  return () => {
    console.log('outer renders')
    return (
      <div>
        Outer: {state.count}
        <button onClick={() => state.count++}>inc</button>
        <button onClick={() => innerProp.value++}>inc inner prop</button>
        <Inner data={innerProp as any}/>
      </div>
    );
  };
});
