import { computed, reactive, watch } from '@re-active/react';

export interface TodoItem {
  text: string;
  isCompleted: boolean;
  dateCreated: number;
  isEditing: boolean;
}

type Filter = 'all' | 'active' | 'completed';

function getStateFomLocalStorage() {
  return {
    todos: JSON.parse(localStorage.getItem('todos') || '[]') as TodoItem[] as TodoItem[],
    filter: JSON.parse(localStorage.getItem('filter') || '"all"') as Filter,
  };
}

function saveStateToLocalStorage({ filter, todos }: ReturnType<typeof getStateFomLocalStorage>) {
  localStorage.setItem('todos', JSON.stringify(todos));
  localStorage.setItem('filter', JSON.stringify(filter));
}

const state = reactive(getStateFomLocalStorage());

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
};

watch(state, saveStateToLocalStorage, { deep: true });
