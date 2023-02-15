import { createComponent, imperativeHandle } from '@re-active';

type Props = {
  data: number;
};

export type Handle = {
  reset: () => void;
};

export const RCWithHandle = createComponent.withHandle<Props, Handle>((props) => {
  imperativeHandle<Handle>({
    reset() {
      window.alert('!!!!');
    },
  });

  return () => {
    return <div>RCWithHandle!</div>;
  };
});
