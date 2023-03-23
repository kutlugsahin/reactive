import { effect, reactive } from '@re-active/react';

export const store = reactive<{
  theme: 'light' | 'dark';
}>({
  theme: (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light',
});

effect(() => {
  localStorage.setItem('theme', store.theme)
})

export function toggleTheme() {
  store.theme = store.theme === 'dark' ? 'light' : 'dark';
}
