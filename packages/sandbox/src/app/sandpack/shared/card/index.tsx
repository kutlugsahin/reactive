import { PropsWithChildren, useEffect, useRef } from 'react';

export const Card = (props: PropsWithChildren<{ title?: string, highlightOnRender?: boolean }>) => {
  const container = useRef<HTMLFieldSetElement>(null);

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (props.highlightOnRender) {
      setTimeout(() => {
        container.current?.classList.add('flash');
      }, 10);

      t = setTimeout(() => {
        container.current?.classList.remove('flash');
      }, 1000);
    }

    return () => {
      if (props.highlightOnRender) {
        clearTimeout(t);
        container.current?.classList.remove('flash');
      }
    };
  });

  return (
    <fieldset className='card' ref={container}>
      {props.title && <legend>{props.title}</legend>}
      {props.children}
    </fieldset>
  );
};
