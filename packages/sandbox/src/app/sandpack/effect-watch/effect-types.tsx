import { component, reactive, updateEffect, effect, layoutEffect } from '@re-active/react';

export const EffectTypes = component(() => {
  const counters = reactive([0, 0, 0]);
  const refs = Array<HTMLButtonElement | null>(3);

  function increment(index: number) {
    counters[index]++;
  }

  function setRef(ref: HTMLButtonElement | null, index: number) {
    refs[index] = ref;
  }

  function getButtonText(index: number) {
    return Number(refs[index]?.innerHTML);
  }

  /**
   * updateEffect runs the effect callback after the component is rendered with the dependent reactive value.
   * If the dependent value won't cause a render updateEffect will run in the next tick
   */
  updateEffect(() => {
    console.log(`updateEffect() Counter 0 value === text in button => ${counters[0] === getButtonText(0)}`);
  });

  /**
   * layoutEffect runs the effect callback after the component is rendered (but before paint) with the dependent reactive value.
   * If the dependent value won't cause a render layoutEffect will run in the next tick
   */
  layoutEffect(() => {
    console.log(`layoutEffect() Counter 1 value === text in button => ${counters[1] === getButtonText(1)}`);
  });

  /**
   * effect runs sync
   */
  effect(() => {
    console.log(`effect() Counter 2 value !== text in button => ${counters[2] !== getButtonText(2)}`);
  });

  return () => (
    <div>
      <button ref={(ref) => setRef(ref, 0)} onClick={() => increment(0)}>
        {counters[0]}
      </button>
      <button ref={(ref) => setRef(ref, 1)} onClick={() => increment(1)}>
        {counters[1]}
      </button>
      <button ref={(ref) => setRef(ref, 2)} onClick={() => increment(2)}>
        {counters[2]}
      </button>
    </div>
  );
});
