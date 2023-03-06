import { createComponent, ref } from '@re-active/react';
import { actions } from '../store';

export const Header = createComponent(() => {
  const todoText = ref('');

  function createTodoItem() {
    actions.createTodo(todoText.value);
    todoText.value = '';
  }

  return () => {
    return (
      <div className="header">
        <h1>todos</h1>
        <input
          type="text"
          className="new-todo"
          value={todoText.value}
          onChange={(e) => (todoText.value = e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              createTodoItem();
            }
          }}
        />
      </div>
    );
  };
});
