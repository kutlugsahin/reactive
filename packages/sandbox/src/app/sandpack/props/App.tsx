import { component, ref, updateEffect } from '@re-active/react';
import { Card } from '../shared/card';

interface ChildProps {
  name: string;
}
/**
 * When setting the properties of a reactive component,
 * each prop type T will be exposed as T or Ref<T>.
 * Notice "name" prop of Child is declared as string,
 * Parent can pass name as both 'string' and 'Ref<string>'
 */
const Child = component((props: ChildProps) => {

  /**
   * "props" object is also reactive
   */
  updateEffect(() => {
    console.log(`New name = ${props.name}`)
  })

  return () => <Card title='Child'>Welcome {props.name}</Card>;
});

const Parent = component(() => {
  const name = ref('john');

  function onInputChange(value: string) {
    name.value = value;
  }

  return () => (
    <Card title='Parent'>
      Name: <input type="text" value={name.value} onChange={(e) => onInputChange(e.target.value)} />
      <Child name={name} />
    </Card>
  );
});

export default Parent;
