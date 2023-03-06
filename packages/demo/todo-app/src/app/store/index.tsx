import { computed, effect, reactive, watch } from '@re-active/react';

export interface TodoItem {
  text: string;
  isCompleted: boolean;
  dateCreated: number;
  isEditing: boolean;
}

type Filter = 'all' | 'active' | 'completed';

const state = reactive({
  todos: [] as TodoItem[],
  filter: 'all' as Filter,
});

export const values = reactive({
  leftTodosCount: computed(() => state.todos.filter((p) => !p.isCompleted).length),
  todos: computed(() => {
    switch (state.filter) {
      case 'all':
        return state.todos;
      case 'active':
        return state.todos.filter((p) => !p.isCompleted);
      case 'completed':
        return state.todos.filter((p) => p.isCompleted);
      default:
        return [];
    }
  }),
  filter: computed(() => state.filter),
  todosAll: computed(() => state.todos),
});

export const actions = {
  setFilter(filter: Filter) {
    state.filter = filter;
  },
  createTodo(text: string) {
    state.todos.unshift({
      text,
      dateCreated: Date.now(),
      isCompleted: false,
      isEditing: false,
    });
  },
  removeTodo(todo: TodoItem) {
    state.todos.splice(state.todos.indexOf(todo), 1);
  },
  checkAll(check: boolean) {
    state.todos.forEach((p) => (p.isCompleted = check));
  },
  clearCompleted() {
    state.todos = state.todos.filter((p) => !p.isCompleted);
  },
  populateStore() {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]') as TodoItem[];
    const filter = JSON.parse(localStorage.getItem('filter') || '"all"') as Filter;

    state.todos = todos;
    state.filter = filter;
    saveChanges();
  },
};

function saveChanges() {
  watch(
    () => {
      return {
        todos: values.todosAll,
        filter: values.filter,
      };
    },
    ({ todos, filter }) => {
      localStorage.setItem('todos', JSON.stringify(todos));
      localStorage.setItem('filter', JSON.stringify(filter));
    }
  );

  effect(() => {
    console.log(values.todosAll[0]);
  });
}
