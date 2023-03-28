import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import {
  SandpackCodeEditor,
  SandpackConsole, SandpackFiles,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack
} from '@codesandbox/sandpack-react';
import { aquaBlue, freeCodeCampDark } from '@codesandbox/sandpack-themes';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { routes as appRoutes } from '../routes';

import app from './App.tsx?raw';
import index from './sandbox-index.tsx?raw';
import routes from './sandpack-routes?raw';
import styleCss from './styles.css?raw';

import { component } from '@re-active/react';
import styles from '../app.module.scss';
import { store } from '../store';

import Card from './shared/card/index.tsx?raw';

const defaultFiles: SandpackFiles = {
  '/styles.css': {
    code: styleCss,
    hidden: true,
  },
  '/App.tsx': {
    code: app,
    hidden: true,
  },
  '/index.tsx': {
    code: index,
    hidden: true,
  },
  '/sandpack-routes.ts': {
    code: routes,
    hidden: true,
  },
  '/shared/card/index.tsx': {
    code: Card,
  },
};

function getAllFiles(): SandpackFiles {
  return appRoutes.reduce((acc, route) => {
    return {
      ...acc,
      ...route.files,
    };
  }, {} as SandpackFiles);
}

const Dispatcher = component(({ loaded }: { loaded: () => void }) => {
  const location = useLocation();
  const { dispatch } = useSandpack();

  const path = location.pathname;

  useEffect(() => {
    function listen(ev: MessageEvent) {
      if (ev.data.type === 'app-loaded') {
        dispatch({
          type: 'urlchange',
          url: path,
          back: false,
          forward: true,
        });

        loaded();
      }
    }

    window.addEventListener('message', listen);

    return () => {
      window.removeEventListener('message', listen);
    };
  }, [path, dispatch, loaded]);

  useEffect(() => {
    dispatch({
      type: 'urlchange',
      url: path,
      back: false,
      forward: true,
    });
  }, [path]);
  return null;
});

export const Sandpack = component(() => {
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const path = location.pathname;

  const files = appRoutes.find((p) => p.route === path)?.files;
  const visibleFiles = files ? Object.keys(files) : [];

  return (
    <SandpackProvider
      template="react-ts"
      theme={store.theme === 'dark' ? freeCodeCampDark : aquaBlue}
      customSetup={{
        dependencies: {
          react: '18.2.0',
          'react-dom': '18.2.0',
          '@re-active/react': '1.1.7',
          'react-router-dom': '6.9.0',
          typescript: '4.9.5',
        },
      }}
      files={{
        ...defaultFiles,
        ...getAllFiles(),
      }}
      options={{
        activeFile: `${path}/App.tsx`,
        visibleFiles,
      }}
    >
      <Dispatcher loaded={() => setIsLoaded(true)} />
      <SandpackLayout>
        {/* <SandpackFileExplorer autoHiddenFiles /> */}
        <SandpackCodeEditor
          // style={{fontSize:16}}
          extensions={[autocompletion()]}
          extensionsKeymap={[...completionKeymap]}
          showLineNumbers
          initMode="immediate"
        />
        <div className={styles.rightPanel}>
          <div className={styles.preview}>
            <SandpackPreview />
            {!isLoaded && (
              <div className={styles.loading}>
                <span>Loading...</span>
              </div>
            )}
          </div>
          <SandpackConsole title="Console" />
        </div>
      </SandpackLayout>
    </SandpackProvider>
  );
});
