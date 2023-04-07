import { component, reactive, updateEffect, effect, layoutEffect } from '@re-active/react';
import { createRef } from 'react';

const EffectTypes = component(() => {
  const counters = reactive([0, 0, 0]);

  const buttonRefs = Array(3).fill(null).map(() => createRef<HTMLButtonElement>());

  function increment(index: number) {
    counters[index]++;
  }

  function getButtonText(index: number) {
    return Number(buttonRefs[index].current?.innerHTML);
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
   * so the counter[2] value will be updated before the dom is updated
   */
  effect(() => {
    console.log(`effect() Counter 2 value !== text in button => ${counters[2] !== getButtonText(2)}`);
  });

  return () => (
    <div>
      <button ref={buttonRefs[0]} onClick={() => increment(0)}>
        {counters[0]}
      </button>
      <button ref={buttonRefs[1]} onClick={() => increment(1)}>
        {counters[1]}
      </button>
      <button ref={buttonRefs[2]} onClick={() => increment(2)}>
        {counters[2]}
      </button>
    </div>
  );
});


export default EffectTypes;
