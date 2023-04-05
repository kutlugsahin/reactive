import { component } from '@re-active/react';
import { routes } from '../../routes';
import { Group } from './Group';
import { NavItem } from './NavItem';
import styles from './styles.module.scss';

export const Navigation = component(() => {
  const reactivity = routes.filter(p => p.group === 'Reactivity');
  const component = routes.filter(p => p.group === 'Component');
  const context = routes.filter(p => p.group === 'Context');
  return (
    <div className={styles.navigation}>
      <Group name={'Component'}>
        {component.map((route) => (
          <NavItem key={route.route} path={route.route}>{route.title}</NavItem>
        ))}
      </Group>
      <Group name={'Reactivity'}>
        {reactivity.map((route) => (
          <NavItem key={route.route} path={route.route}>{route.title}</NavItem>
        ))}
      </Group>
      <Group name={'Context'}>
        {context.map((route) => (
          <NavItem key={route.route} path={route.route}>{route.title}</NavItem>
        ))}
      </Group>
    </div>
  );
});
