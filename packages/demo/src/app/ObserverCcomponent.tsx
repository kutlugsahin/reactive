import { observer, ref } from '@re-active';
import { useState } from 'react';

type Props = {
  count: number;
};

export const ObserverComponent = observer((props: Props) => {
  const [innerCount, setInnerCount] = useState(0);
  const [reactiveVal] = useState(() => ref(0))

  return (
    <div>
      Observer component
      <div>Prop: {props.count}</div>
      <div>State: {innerCount}</div>
      <div>Ref: {reactiveVal.value}</div>
      <div>
        <button onClick={() => setInnerCount((p) => p + 1)}>inc</button>
      </div>
      <div>
        <button onClick={() => reactiveVal.value++}>inc</button>
      </div>
    </div>
  );
});
