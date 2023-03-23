import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackFileExplorer,
  SandpackFiles,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
  Sandpack as CodeSandpack,
  defaultDark,
  SandpackStack,
} from '@codesandbox/sandpack-react';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import {
  atomDark,
  githubLight,
  gruvboxLight,
  ecoLight,
  aquaBlue,
  gruvboxDark,
  sandpackDark,
  freeCodeCampDark,
} from '@codesandbox/sandpack-themes';
import { forwardRef, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { routes as appRoutes } from '../routes';

import app from './App.tsx?raw';
import index from './sandbox-index.tsx?raw';
import routes from './sandpack-routes?raw';
import styleCss from './styles.css?raw';

import styles from '../app.module.scss';

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
};

function getAllFiles(): SandpackFiles {
  return appRoutes.reduce((acc, route) => {
    return {
      ...acc,
      ...route.files,
    };
  }, {} as SandpackFiles);
}

const Dispatcher = () => {
  const location = useLocation();
  const { dispatch } = useSandpack();

  const path = location.pathname;

  useEffect(() => {
    dispatch({
      type: 'urlchange',
      url: path,
      back: false,
      forward: true,
    });
  }, [path]);

  return null;
};

export const Sandpack = forwardRef(() => {
  const location = useLocation();
  const path = location.pathname;

  const files = appRoutes.find((p) => p.route === path)?.files;
  const visibleFiles = files ? Object.keys(files) : [];

  // useEffect(() => {
  //   const iframe = document.querySelector('iframe') as HTMLIFrameElement;

  //   if (iframe) {
  //     iframe.contentWindow?.postMessage({ type: 'urlchange', url: path }, '*');
  //   }
  // }, [path]);

  return (
    // <CodeSandpack
    //   template="react-ts"
    //   theme={atomDark}
    //   customSetup={{
    //     dependencies: {
    //       '@re-active/react': '1.1.2',
    //       'react-router-dom': '6.9.0',
    //       typescript: '4.9.5',
    //     },
    //   }}
    //   files={{
    //     ...defaultFiles,
    //     ...getAllFiles(),
    //   }}
    //   options={{
    //     showConsole: true,
    //     showConsoleButton: true,
    //     showNavigator: true,
    //     visibleFiles,
    //     activeFile: `${path}/App.tsx`,

    //   }}
    // />
    <SandpackProvider
      template="react-ts"
      theme={freeCodeCampDark}
      customSetup={{
        dependencies: {
          react: '18.2.0',
          'react-dom': '18.2.0',
          '@re-active/react': '1.1.2',
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
      <Dispatcher />
      <SandpackLayout>
        {/* <SandpackFileExplorer autoHiddenFiles/> */}
        <SandpackCodeEditor
          style={{ fontSize: 16 }}
          extensions={[autocompletion()]}
          extensionsKeymap={[...completionKeymap]}
        />
        {/* <MonacoEditor /> */}
        <div className={styles.rightPanel}>
          <SandpackPreview />
          <SandpackConsole />
        </div>
      </SandpackLayout>
    </SandpackProvider>
  );
});
