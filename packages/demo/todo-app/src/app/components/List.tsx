import { createComponent } from '@re-active/react';
import { actions, values } from '../store';
import { ListItem } from './ListItem';

export const List = createComponent(() => {
  function toggleCheckAll(check: boolean) {
    actions.checkAll(check);
  }

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
