import { createComponent, reactive, Observer as OBS } from '@re-active';

export const Observer = createComponent(() => {
  const state = reactive({
    name: 0,
    count: 0,
  });

  return () => {
    return (
      <div>
        <div>
          Count -- {state.count} <button onClick={() => state.count++}>inc</button>
        </div>
        <OBS>
          {() => (
            <div>
              name: {state.name} <button onClick={() => state.name++}>inc name</button>
            </div>
          )}
        </OBS>
      </div>
    );
  };
});
