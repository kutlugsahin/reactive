import { PropsWithChildren } from 'react';
import styles from './style.module.scss';

export function NavItem(
  props: PropsWithChildren<{
    onClick?: React.DOMAttributes<HTMLDivElement>['onClick'];
  }>
) {
  return (
    <div className={styles.navItem} onClick={props.onClick}>
      {props.children}
    </div>
  );
}
