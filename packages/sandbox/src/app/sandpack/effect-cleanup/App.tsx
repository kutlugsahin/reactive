import { component, ref, updateEffect } from '@re-active/react';
import { Card } from '../shared/card';

export interface Person {
  name: string;
  height: string;
  gender: string;
}

export function fetchPerson(id: number) {
  const abortController = new AbortController();
  const result: Promise<Person> = fetch(`https://swapi.dev/api/people/${id}`, { signal: abortController.signal }).then(
    (p) => p.json()
  );

  return {
    result,
    cancel() {
      abortController.abort();
    },
  };
}

export const EffectCleanup = component(() => {
  const userId = ref(1);
  const person = ref<Person>();

  updateEffect(() => {
    const { cancel, result } = fetchPerson(userId.value);

    result.then((p) => (person.value = p)).catch((err: DOMException) => {
      if (err.name === 'AbortError') {
        console.log('fetch aborted')
      }
    });

    /**
     * An optional function can be returned for cleanup things / cancel calls etc.
     */
    return () => {
      cancel();
    };
  });

  return () => {
    const { gender, height, name } = person.value ?? {};

    return (
      <Card title="effect cleanup">
        <Card title='Person'>
          <div>
            Name: {name}
          </div>
          <div>
            Gender: {gender}
          </div>
          <div>
            Height: {height}
          </div>
        </Card>
        <div>
          <button onClick={() => userId.value--}>prev</button>
          <button onClick={() => userId.value++}>next</button>
        </div>
      </Card>
    );
  };
});

export default EffectCleanup;
