// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createComponent, onMounted, onUnmounted } from '@re-active/react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { List } from './components/List';
import { actions } from './store';

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
          <Header />
          <List />
          <Footer />
        </div>
      </section>
    );
  };
});
