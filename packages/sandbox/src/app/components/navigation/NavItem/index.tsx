import { component } from '@re-active/react';
import { PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './style.module.scss';

export const NavItem = component((props: PropsWithChildren<{ path: string }>) => {
  return () => {
    const navigate = useNavigate();
    const loc = useLocation();
    const isActive = loc.pathname === props.path;

    return (
      <div className={`${styles.navItem} ${isActive ? styles.active : ''}`} onClick={() => navigate(props.path)}>
        <div>{props.children}</div>
      </div>
    );
  };
});
