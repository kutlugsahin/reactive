import { component, ref, updateEffect } from '@re-active/react';
import { Card } from '../shared/card';
import { fetchPerson, Person } from './fetch-person';

export const EffectCleanup = component(() => {
  const userId = ref(1);
  const person = ref<Person>();

  updateEffect(() => {
    const { cancel, result } = fetchPerson(userId.value);

    result.then((p) => (person.value = p));

    return () => {
      cancel();
    };
  });

  return () => {
    const { gender, height, name } = person.value ?? {};

    return (
      <Card title="effect cleanup">
        {name} {gender} {height}
        <div>
          <button onClick={() => userId.value--}>prev</button>
          <button onClick={() => userId.value++}>next</button>
        </div>
      </Card>
    );
  };
});
