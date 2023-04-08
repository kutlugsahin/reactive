import { component } from '@re-active/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import styles from './app.module.scss';
import { Header } from './components/header';
import { Navigation } from './components/navigation';
import { store } from './store';
import { Sandpack } from './sandpack';

export default component(() => {
  return (
    <BrowserRouter>
      <Routes>
        <Route key="home" path="/" element={<Navigate replace to={'/component'} />} />
        <Route path='*' element={
          <div className={`${styles.main} ${store.theme === 'light' ? styles.light : styles.dark}`}>
            <Header />
            <div className={styles.content}>
              <Navigation />
              <div className={styles.sandpack}>
                <Sandpack />
              </div>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
});
