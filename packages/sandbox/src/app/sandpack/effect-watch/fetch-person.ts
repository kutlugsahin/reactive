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
