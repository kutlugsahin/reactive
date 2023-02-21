import { observer, ref } from '@re-active';
import { useEffect, useState } from 'react';

type Props = {
  count: number;
};

export const ObserverComponent = observer((props: Props) => {
  const [innerCount, setInnerCount] = useState(1);
  const [innerCount2, setInnerCount2] = useState(1);
  const [reactiveVal] = useState(() => ref(-1));

  useEffect(() => {
    console.log('observer mount');
    return () => {
      console.log('observer unmount');
    };
  }, []);

  return (
    <div>
      Observer component!
      <div>Prop: {props.count}</div>
      <div>
        State: {innerCount} / {innerCount2}
      </div>
      <div>Ref: {reactiveVal.value}</div>
      <div>
        <button
          onClick={() => {
            setInnerCount((p) => p + 1);
            setInnerCount2((p) => p + 1);
          }}
        >
          inc useState
        </button>
      </div>
      <div>
        <button onClick={() => reactiveVal.value++}>inc Ref</button>
      </div>
      <div>
        <button
          onClick={() => {
            setInnerCount((p) => p + 1);
            reactiveVal.value++;
            reactiveVal.value++;
          }}
        >
          inc both
        </button>
      </div>
    </div>
  );
});
