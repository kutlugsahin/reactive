import { component } from '@re-active/react';
import styles from './styles.module.scss';
import { BsGithub } from 'react-icons/bs';
import { HiSun } from 'react-icons/hi';
import { MdOutlineNightlightRound } from 'react-icons/md';
import { store, toggleTheme } from '../../store';
import { HiDocumentText } from 'react-icons/hi';

export const Header = component(() => {
  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <img className={styles.logo} src={store.theme === 'dark' ? 'reactive_logo_dark_bg.svg' : 'reactive_logo_white_bg.svg'} alt="" />
      </div>
      <div className={styles.actions}>
        {/* <select onChange={p => store.editorTheme = p.target.value}>
          {store.themes.map(p => <option value={p}>{p}</option>)}
        </select> */}
        <a className={styles.item} href="https://kutlugsahin.gitbook.io/re-active/" target="_blank" rel='noreferrer'>
          <HiDocumentText size={32} color={store.theme === 'dark' ? 'white' : 'black'} />
          Docs
        </a>
        <a className={styles.item} href="https://github.com/kutlugsahin/reactive" target="_blank" rel='noreferrer'>
          <BsGithub size={32} color={store.theme === 'dark' ? 'white' : 'black'} />
          GitHub
        </a>
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
