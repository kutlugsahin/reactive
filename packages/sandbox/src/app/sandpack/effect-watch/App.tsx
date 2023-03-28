import { component } from '@re-active/react';
import { EffectCleanup } from './effect-cleanup';
import { EffectTypes } from './effect-types';

export default component(() => {
  return (
    <div>
      <EffectTypes />
      <EffectCleanup />
    </div>
  );
});
