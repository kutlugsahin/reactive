import { component, effect } from '@re-active/react';
import { actions, values } from '../store';
import { ListItem } from './ListItem';

export const List = component(function List() {
  function toggleCheckAll(check: boolean) {
    actions.checkAll(check);
  }

  effect(() => {
    console.log('effect');
    values.todos.length;
  });

  return () => (
    <section className="main">
      <input
        type="checkbox"
        id="toggle-all"
        className="toggle-all"
        onChange={(e) => toggleCheckAll(e.target.checked)}
      />
      <label htmlFor="toggle-all"></label>
      <ul className="todo-list">
        {values.todos.map((todo, i) => (
          <ListItem key={i} todo={todo} />
        ))}
      </ul>
    </section>
  );
});
