// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { component, createComponent, onMounted, onUnmounted, reactive, ref } from '@re-active/react';
import { useEffect, useRef } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { List } from './components/List';

// export default createComponent(() => {
//   onMounted(() => {
//     console.log('mounted');
//   });

//   onUnmounted(() => {
//     console.log('unmounted');
//   });

//   return () => {
//     console.log('rendered');
//     return (
//       <section className="todoapp">
//         <div>
//           <Header/>
//           <List />
//           <Footer />
//         </div>
//       </section>
//     );
//   };
// });

const Child = (props: { count: number }) => {

  useEffect(() => {
    console.log('child mount');

    return () => {
      console.log('child unmount');
    };
  });

  console.log('child render');

  return (
    <div>
      {props.count}{' '}
      <div>
        {/* {state.current.count} <button onClick={() => state.current.count++}>inc</button> */}
      </div>
    </div>
  );
};

export default component(() => {
  const state = reactive({
    count: 1,
  });

  onMounted(() => {
    console.log('parent mount');
    return () => {
      console.log('parent unmount');
    };
  })

  return () => {
    console.log('parent render');
    return (
      <div>
        Parent
        <div>
          {state.count} <button onClick={() => state.count++}>inc</button>
        </div>
        <Child count={state.count} />
      </div>
    )
  }
});
