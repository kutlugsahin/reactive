import { component } from '@re-active/react';
import { routes } from '../../routes';
import { NavItem } from './NavItem';
import styles from './styles.module.scss';

export const Navigation = component(() => {
  return (
    <div className={styles.navigation}>
      {routes.map((route) => (
        <NavItem key={route.route} path={route.route}>{route.title}</NavItem>
      ))}
    </div>
  );
});
