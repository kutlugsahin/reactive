import { component, ref, effect } from '@re-active/react';
import { Card } from '../shared/card';

/**
 * refs can be any type of objects and primitives
 */
const countRef = ref(0);

/**
 * Arrays Maps and Sets and their all methods are also reactive
 */
const numbersRef = ref([1, 2, 3, 4, 5]);
const setRef = ref(new Set());
const mapRef = ref(new Map());

/**
 * ref makes the object deeply reactive
 */
const nestedObject = ref({
  foo: 'foo',
  bar: [{
    baz: 0
  }]
});

effect(() => {
  console.log(`counter ref: ${countRef.value}`);
});

/** prints the array */
effect(() => {
  console.log([...numbersRef.value]);
});

/** prints the set */
effect(() => {
  console.log([...setRef.value]);
});

/** prints the map */
effect(() => {
  console.log([...mapRef.value]);
});

/** prints the value in a nested array */
effect(() => {
  console.log(nestedObject.value.bar[0].baz);
});

export default component(() => {
  return () => (
    <div>
      <p>You can observe the effects from the terminal below</p>
      <Card title="primitive">
        <button onClick={() => countRef.value++}>inc. counter ref</button>
      </Card>
      <Card title="Array">
        <button onClick={() => numbersRef.value.push(numbersRef.value.length)}>Add number</button>
        <button onClick={() => numbersRef.value[0]++}>inc. first number in the array</button>
      </Card>
      <Card title="Set & Map">
        <button onClick={() => setRef.value.add(setRef.value.size)}>Add to Set</button>
        <button onClick={() => setRef.value.add(10)}>Add 10 to set</button>
        {' / '}
        <button onClick={() => mapRef.value.set(mapRef.value.size, mapRef.value.size)}>Add to Map</button>
        <button onClick={() => mapRef.value.set(0, mapRef.value.get(0) + 1)}>inc. first value</button>
      </Card>
    </div>
  );
});
