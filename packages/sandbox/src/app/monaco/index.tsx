import Editor, { loader, Monaco } from '@monaco-editor/react';
import { useActiveCode, SandpackStack, FileTabs, useSandpack } from '@codesandbox/sandpack-react';

import { setupEditor } from './setup';

import { store } from '../store';
import { component } from '@re-active/react';

import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { useEffect, useRef } from 'react';

window.MonacoEnvironment = {
  getWorker(_: any, label: any) {
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }

    return new editorWorker();
  }
};

loader.config({ monaco });

export const MonacoEditor = component(() => {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const inited = useRef(false);
  const activeFile = useRef('');

  function onBeforeMount(monaco: Monaco) {
    // compiler options
    !inited.current && setupEditor(monaco);

    inited.current = true;
  }

  return (
    <SandpackStack style={{ height: '100%', margin: 0 }}>
      <FileTabs />
      <div style={{ flex: 1 }}>
        <Editor
          width="100%"
          height="100%"
          language="typescript"
          theme={store.editorTheme}
          // key={sandpack.activeFile}
          value={code}
          path={"file:///src/App.tsx"}
          onChange={(value) => {
            if (sandpack.activeFile !== activeFile.current) {
              activeFile.current = sandpack.activeFile;
            } else {
              updateCode(value || '')
            }
          }}
          beforeMount={onBeforeMount}
          // onMount={onMount}
          options={{
            'semanticHighlighting.enabled': true,
            fontSize: 15
          }}
        />
      </div>
    </SandpackStack>
  );
})
