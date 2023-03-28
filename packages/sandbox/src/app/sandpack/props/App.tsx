import { component, onMounted, ref, updateEffect } from '@re-active/react';

interface ChildProps {
  name: string;
}

const Child = component((props: ChildProps) => {
  updateEffect(() => {
    console.log(`Props are reactive: ${props.name}`);
  });

  onMounted(() => {
    console.log('child mounted');
  });

  return () => <div>Welcome {props.name}</div>;
});

export default component(() => {
  const name = ref('john');

  onMounted(() => {
    console.log('parent mounted');
  });

  return () => (
    <div>
      <Child name={name} />
      <input type="text" value={name.value} onChange={(e) => (name.value = e.target.value)} />
    </div>
  );
});
