import { consumeContext, createComponent, reactive } from '@re-active';
import { createContext } from 'react';

type Ctx = {
  data: number;
};

const DataContext = createContext<Ctx>(
  reactive({
    data: 4,
  })
);

export const ContextComponent = createComponent(() => {
  const contextState = reactive<Ctx>({
    data: 3,
  });

  return () => {
    return (
      <fieldset>
        <legend>Context Provider</legend>
        <button onClick={() => contextState.data++}>Inc context value</button>
        <DataContext.Provider value={contextState}>
          <ContextConsumer />
        </DataContext.Provider>
      </fieldset>
    );
  };
});

export const ContextConsumer = createComponent(() => {
  const context = consumeContext(DataContext);
  const context2 = consumeContext(DataContext);

  return () => (
    <fieldset>
      <legend>Context Consumer</legend>
      Ctx : {context.value.data} / {context2.value.data}
    </fieldset>
  );
});
