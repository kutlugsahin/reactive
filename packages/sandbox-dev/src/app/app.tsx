/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import styles from './app.module.scss';
import { component } from '@re-active/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from 'packages/sandbox/src/app/components/header';
import { Navigation } from 'packages/sandbox/src/app/components/navigation';
import { sandpackRoutes } from 'packages/sandbox/src/app/sandpack/sandpack-routes';
import { store } from 'packages/sandbox/src/app/store';

export default component(() => {
  return (
    <BrowserRouter>
      <div className={`${styles.main} ${store.theme === 'light' ? styles.light : styles.dark}`}>
        <Header />
        <div className={styles.content}>
          <Navigation />
          <div className={`${styles.sandpack} appContainer`}>
            <Routes>
              <Route key="home" path="/" element={<Navigate replace to={'/component'} />} />
              {sandpackRoutes.map((route, index) => {
                return <Route path={route.route} key={route.route} Component={route.component} />;
              })}
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
});
