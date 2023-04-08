import { component, reactive, effect } from '@re-active/react';
import { Card } from '../shared/card';

/**
 * Arrays Maps and Sets and their all methods are also reactive
 */
const numbers = reactive([1, 2, 3, 4, 5]);
const set = reactive(new Set());
const map = reactive(new Map());

/**
 * reactive() makes the object deeply reactive
 */
const nestedObject = reactive({
  foo: 'foo',
  bar: [{
    baz: 0
  }]
});

/** prints the array */
effect(() => {
  console.log([...numbers]);
});

/** prints the set */
effect(() => {
  console.log([...set]);
});

/** prints the map */
effect(() => {
  console.log([...map]);
});

/** prints the value in a nested array */
effect(() => {
  console.log(nestedObject.bar[0].baz);
});

export default component(() => {
  return () => (
    <div>
      <p>You can observe the effects from the terminal below</p>
      <Card title="Array">
        <button onClick={() => numbers.push(numbers.length)}>Add number</button>
        <button onClick={() => numbers[0]++}>inc. first number in the array</button>
      </Card>
      <Card title="Set & Map">
        <button onClick={() => set.add(set.size)}>Add to Set</button>
        <button onClick={() => set.add(10)}>Add 10 to set</button>
        {' / '}
        <button onClick={() => map.set(map.size, map.size)}>Add to Map</button>
        <button onClick={() => map.set(0, map.get(0) + 1)}>inc. first value</button>
      </Card>
    </div>
  );
});
