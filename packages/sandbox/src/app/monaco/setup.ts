import { languages } from 'monaco-editor';

import { loadWASM } from 'onigasm';
import { Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';
import typescriptReactTM from './TypeScriptReact.tmLanguage.json';
import cssTM from './css.tmLanguage.json';

import React from './react.d.ts?raw';
import Reactive from './re-active.d.ts?raw';
import Globals from './global.d.ts?raw';
import JSXRUNTIME from './jsx-runtime.d.ts?raw';
import { Monaco } from '@monaco-editor/react';
import Card from '../sandpack/shared/card/index.tsx?raw';
import { addThemes } from './themes';
import onigasm from 'onigasm/lib/onigasm.wasm?url';

export function setupEditor(monaco: Monaco) {
  // Tell monaco about the file from solid-js
  function cm(source: string, path: string) {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(source, path);
    monaco.languages.typescript.javascriptDefaults.addExtraLib(source, path);
  }

  cm(Globals, `file:///node_modules/@types/react/global.d.ts`);
  cm(JSXRUNTIME, `file:///node_modules/@types/react/jsx-runtime.d.ts`);
  cm(`declare module 'react' { ${React} }`, `file:///node_modules/@types/react/index.d.ts`);
  cm(`declare module '@re-active/react' { ${Reactive} }`, `file:///node_modules/@re-active/react/index.d.ts`);
  cm(Card, `file:///shared/card/index.tsx`);

  const compilerOptions: languages.typescript.CompilerOptions = {
    strict: true,
    target: languages.typescript.ScriptTarget.ESNext,
    module: languages.typescript.ModuleKind.ESNext,
    moduleResolution: languages.typescript.ModuleResolutionKind.NodeJs,
    jsx: languages.typescript.JsxEmit.Preserve,
    jsxFactory: 'React.createElement',
    jsxImportSource: 'React',
    reactNamespace: 'React',
    typeRoots: ['node_modules/@types'],
    allowNonTsExtensions: true,
    esModuleInterop: true,
    skipLibCheck: true,
  };

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions);

  addThemes(monaco);

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  let loadingWasm: Promise<void>;

  const registry = new Registry({
    async getGrammarDefinition(scopeName) {
      return {
        format: 'json',
        content: typescriptReactTM,
      };
    },
  });

  const grammars = new Map();
  grammars.set('typescript', 'App.tsx');

  const hookLanguages = monaco.languages.setLanguageConfiguration;

  monaco.languages.setLanguageConfiguration = (languageId: string, configuration: languages.LanguageConfiguration) => {
    liftOff();
    return hookLanguages(languageId, configuration);
  };

  async function liftOff(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!loadingWasm) loadingWasm = loadWASM(onigasm);
    await loadingWasm;

    // wireTmGrammars only cares about the language part, but asks for all of monaco
    // we fool it by just passing in an object with languages
    await wireTmGrammars({ languages } as any, registry, grammars);
  }

  liftOff();
}
