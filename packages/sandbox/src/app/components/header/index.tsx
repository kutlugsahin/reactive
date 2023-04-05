import { component } from '@re-active/react';
import styles from './styles.module.scss';
import { BsGithub } from 'react-icons/bs';
import { HiSun } from 'react-icons/hi';
import { MdOutlineNightlightRound } from 'react-icons/md';
import { store, toggleTheme } from '../../store';

export const Header = component(() => {
  return (
    <div className={styles.header}>
      <div className={styles.title}>Reactive Sandbox</div>
      <div className={styles.actions}>
        <select onChange={p => store.editorTheme = p.target.value}>
          {store.themes.map(p => <option value={p}>{p}</option>)}
        </select>
        <button className={styles.item}>
          <BsGithub size={32} color={store.theme === 'dark' ? 'white' : 'black'} />
        </button>
        <button className={styles.item} onClick={toggleTheme}>
          {store.theme === 'dark' ? (
            <HiSun size={32} color="white" />
          ) : (
            <MdOutlineNightlightRound size={32} color="black" />
          )}
        </button>
      </div>
    </div>
  );
});
