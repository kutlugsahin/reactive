import { component, onMounted, onUnmounted, ref } from '@re-active/react';
import { Card } from '../shared/card';

const Interval = component(() => {
  const count = ref(0);

  onMounted(() => {
    console.log('Component mounted');
  })

  onMounted(() => {
    const interval = setInterval(() => {
      count.value++;
    }, 1000)

    /**
     * OnMounted callbacks can return cleanup functions which is called on unmount
     */
    return () => {
      clearInterval(interval);
      console.log('interval cleared');
    }
  })

  onUnmounted(() => {
    console.log('Component unmounted')
  })

  return () => (
    <Card title='Interval'>
      {count.value}
    </Card>
  );
});

export default component(() => {
  const show = ref(true);

  return () => (
    <>
      {show.value && <Interval />}
      <button onClick={() => show.value = !show.value}>toggle component</button>
    </>
  )
})
