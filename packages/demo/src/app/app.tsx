// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRef, useState } from 'react';
import { Child } from './Child';
import { ContextComponent } from './ContextComponent';
import { Outer } from './Nested';
import { Observer } from './Observer';
import { ObserverComponent } from './ObserverCcomponent';
import { Handle } from './RCWithHandle';
import { ReactiveComponent } from './ReactiveComponent';

export function App() {
  const [val, setVal] = useState(0);

  const [show, setShow] = useState(true);

  const handle = useRef<Handle>(null);

  return (
    <div>
      Helloo {val}
      <button onClick={() => setShow((p) => !p)}>Toggle</button>
      {/* {show && <Child />} */}
      {/* <ClassComp /> */}
      <div>{show && <ReactiveComponent data={String(val)} />}</div>
      <button onClick={() => setVal((p) => p + 1)}>inc data</button>
      {/* <RCWithHandle data={0} ref={handle}></RCWithHandle> */}
      <button onClick={() => handle.current?.reset()}>run handler</button>
      <div>
        {/* <Outer /> */}
      </div>
      {/* <ObserverComponent count={val} /> */}
      {/* <Observer/> */}
      <ContextComponent/>
    </div>
  );
}

export default App;
