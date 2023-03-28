import { component, onMounted, reactive, updateEffect } from '@re-active/react';

const Counter = component(() => {
  const counters = reactive([0, 0, 0]);
  const refs = Array<HTMLButtonElement>(3);

  function increment(index: number) {
    return () => {
      counters[index]++;
    };
  }

  function setRef(index: number) {
    return (r: HTMLButtonElement) => (refs[index] = r);
  }

  updateEffect(() => {
    console.log(`Counter 0 value === text in button`, counters[0] === +refs[0].innerHTML);
  });

  onMounted(() => {
    console.log('dssdfs');
  });

  return () => (
    <div>
      <button ref={setRef(0)} onClick={increment(0)}>
        {counters[0]}
      </button>
      <button ref={setRef(1)} onClick={increment(1)}>
        {counters[1]}
      </button>
      <button ref={setRef(2)} onClick={increment(2)}>
        {counters[2]}
      </button>
    </div>
  );
});

export default Counter;
