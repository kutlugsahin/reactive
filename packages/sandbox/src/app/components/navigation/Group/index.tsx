import { component } from '@re-active/react';
import { PropsWithChildren } from 'react';
import style from './styles.module.scss';

export const Group = component((props: PropsWithChildren<{name: string}>) => {

  return () => (
    <div className={style.group}>
      <div className={style.title}>{props.name}</div>
      <div className={style.content}>
        {props.children}
      </div>
    </div>
  )
});
