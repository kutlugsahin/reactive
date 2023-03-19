// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createComponent, onMounted, onUnmounted, ref } from '@re-active/react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { List } from './components/List';

export default createComponent(() => {
  onMounted(() => {
    console.log('mounted');
  });

  onUnmounted(() => {
    console.log('unmounted');
  });

  return () => {
    console.log('rendered');
    return (
      <section className="todoapp">
        <div>
          <Header/>
          <List />
          <Footer />
        </div>
      </section>
    );
  };
});
