import { createComponent } from '@re-active/react';
import { actions, TodoItem } from '../store';

interface ListItemProps {
  todo: TodoItem;
}

export const ListItem = createComponent((props: ListItemProps) => {
  function getItemClass() {
    const classes = [];

    if (props.todo.isCompleted) classes.push('completed');
    if (props.todo.isEditing) classes.push('editing');

    return classes.join(' ');
  }

  function removeTodoItem() {
    actions.removeTodo(props.todo);
  }

  function onCheckChanged(checked: boolean) {
    props.todo.isCompleted = checked;
  }

  function setIsEditing(isEditing: boolean) {
    props.todo.isEditing = isEditing;
  }

  function updateTodoText(text: string) {
    props.todo.text = text;
  }

  return () => (
    <li className={getItemClass()}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={props.todo.isCompleted}
          onChange={(e) => onCheckChanged(e.target.checked)}
        />
        <label onDoubleClick={() => setIsEditing(true)}>{props.todo.text}</label>
        <button className="destroy" onClick={removeTodoItem}></button>
      </div>
      <input
        className="edit"
        value={props.todo.text}
        onChange={(e) => updateTodoText(e.target.value)}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            setIsEditing(false);
          }
        }}
      />
    </li>
  );
});
