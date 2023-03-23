import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import styles from './app.module.scss';
import { Sandpack } from './sandpack';
import { routes } from './routes';
import { NavItem } from './sandpack/components/NavItem';

export default () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route key="home" path="/" element={<Navigate replace to={'/hello-world'} />} />
      </Routes>
      <div className={styles.main}>
        <div className={styles.header}></div>
        <div className={styles.content}>
          <div className={styles.navigation}>
            {routes.map((route) => (
              <Link to={route.route} >
                <NavItem key={route.route}>{route.title}</NavItem>
              </Link>
            ))}
          </div>
          <div className={styles.sandpack}>
            <Sandpack />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};
