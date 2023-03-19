import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
  SandpackFiles,
} from '@codesandbox/sandpack-react';
import { atomDark } from '@codesandbox/sandpack-themes';

import viteConfig from './template/vite.config.js?raw';
import app from './template/App.jsx?raw';
import html from './template/index.html?raw';
import index from './template/index.jsx?raw';
import style from './template/styles.css?raw';

function getTemplateFiles(): SandpackFiles {
  return {
    // 'index.html': {
    //   code: html,
    // },
    'App.js': {
      code: app,
    },
    // 'index.jsx': {
    //   code: index,
    // },
    // 'vite.config.js': {
    //   code: viteConfig,
    // },
    'styles.css': {
      code: style,
    },
  };
}

export default () => (
  <SandpackProvider
    template="react"
    theme={atomDark}
    customSetup={{
      dependencies: {
        '@re-active/react': '1.1.2',
        typescript: '4.9.5',
      },
    }}
    files={getTemplateFiles()}

  >
    <SandpackLayout>
      <SandpackFileExplorer/>
      <SandpackCodeEditor showLineNumbers closableTabs/>
      <SandpackPreview />
    </SandpackLayout>
  </SandpackProvider>
);
