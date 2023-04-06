import { component, imperativeHandle } from '@re-active/react';
import { createRef, useRef } from 'react';
import { Card } from '../shared/card';

interface Handle {
  focus: () => void;
}

/**
 * To create a reactive component with forwarded ref
 * use component.withHandle()
 * and define the handle with imperativeHandle()
 */
const ReactiveComponentWithHandle = component.withHandle(() => {
  const input = createRef<HTMLInputElement>();

  imperativeHandle<Handle>({
    focus() {
      input.current?.focus()
    }
  })

  return () => (
    <Card title='Reactive Component'>
      <input type="text" ref={input} />
    </Card>
  );
});

export default () => {
  const ref = useRef<Handle>(null);

  return (
    <>
      <ReactiveComponentWithHandle ref={ref} />
      <button onClick={() => ref.current?.focus()}>Focus</button>
    </>
  )
}
