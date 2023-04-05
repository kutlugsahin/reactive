import { effect, reactive } from '@re-active/react';

export const store = reactive<{
  theme: 'light' | 'dark';
  themes: string[];
  editorTheme: string;
}>({
  theme: (localStorage.getItem('theme') as 'light' | 'dark') ?? 'dark',
  themes: [],
  editorTheme: localStorage.getItem('editorTheme') ?? 'vs-dark',
});

effect(() => {
  localStorage.setItem('theme', store.theme);
  localStorage.setItem('editorTheme', store.editorTheme);
});

export function toggleTheme() {
  store.theme = store.theme === 'dark' ? 'light' : 'dark';
}

effect(() => {
  store.editorTheme = store.theme === 'dark' ? 'vs-dark-plus' : 'vs-light-plus'
})
