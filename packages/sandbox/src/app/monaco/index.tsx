import { SandpackStack, useActiveCode, useSandpack } from '@codesandbox/sandpack-react';
import Editor, { loader, Monaco } from '@monaco-editor/react';

import { setupEditor } from './setup/setup';

import { component } from '@re-active/react';
import { store } from '../store';

import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { useEffect, useRef, useState } from 'react';

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
  // const location = useLocation();
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const inited = useRef(false);
  const activeFile = useRef('');
  const monacoRef = useRef<Monaco>();

  const [editorCode, setEditorCode] = useState(code);

  // useEffect(() => {
  //   const path = location.pathname;

  //   const files = routes.find((p) => p.route === path)?.files;
  //   const visibleFiles = files ? Object.keys(files) : [];

  //   if (monacoRef.current) {
  //     visibleFiles.filter(p => p.indexOf('/App.tsx') === -1).forEach(file => {
  //       const path = "file:///src/" + file.split('/')[2];

  //       import(`../sandpack${file}?raw`).then(p => {
  //         monacoRef.current!.languages.typescript.typescriptDefaults.addExtraLib(p.default, path);
  //         monacoRef.current!.languages.typescript.javascriptDefaults.addExtraLib(p.default, path);
  //       })
  //     })
  //   }

  // }, [location.pathname])
  useEffect(() => {
    setEditorCode(code);
  }, [code, setEditorCode])


  useEffect(() => {
    const timer = setTimeout(() => {
      if (sandpack.activeFile !== activeFile.current) {
        activeFile.current = sandpack.activeFile;
      } else {
        if (code !== editorCode) {
          updateCode(editorCode || '')
        }
      }
    }, 500)


    return () => {
      clearTimeout(timer);
    }
  }, [editorCode, updateCode, sandpack.activeFile, code])


  function onBeforeMount(monaco: Monaco) {
    // compiler options
    !inited.current && setupEditor(monaco);

    inited.current = true;
    monacoRef.current = monaco;
  }

  return (
    <SandpackStack style={{ height: '100%', margin: 0 }}>
      {/* <FileTabs /> */}
      <div style={{ flex: 1 }}>
        <Editor
          width="100%"
          height="100%"
          language="typescript"
          theme={store.editorTheme}
          // key={sandpack.activeFile}
          value={editorCode}
          path={"file:///src/App.tsx"}
          onChange={(value) => {
            setEditorCode(value || '');

          }}
          beforeMount={onBeforeMount}
          // onMount={onMount}
          options={{
            'semanticHighlighting.enabled': true,
            fontSize: 15,
          }}
        />
      </div>
    </SandpackStack>
  );
})
