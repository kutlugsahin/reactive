// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createComponent, onMounted } from '@re-active/react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { List } from './components/List';
import { actions } from './store';

export const App = createComponent(() => {
  onMounted(() => {
    actions.populateStore();
  });

  return () => (
    <section className="todoapp">
      <div>
        <Header />
        <List />
        <Footer />
      </div>
    </section>
  );
});

export default App;
