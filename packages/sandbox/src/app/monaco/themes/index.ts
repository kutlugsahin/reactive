import vsDark from './vs_dark_good.json';
import vsLight from './vs_light_good.json';
// import amy from './Amy.json';
// import githubDark from './GitHub Dark.json';
// import github from './GitHub.json';
// import chromeDev from './Chrome DevTools.json';
// import nightOwl from './Night Owl.json';
// import nord from './Nord.json';
// import BrillianceBlack from './Brilliance Black.json';
// import Monokai from './Monokai.json';
// import Blackboard from './Blackboard.json';
// import SolarizedDark from './Solarized-dark.json';
// import SolarizedLight from './Solarized-light.json';
// import OceanicNext from './Oceanic Next.json';

import { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { store } from '../../store';

export function addThemes(monaco: Monaco) {
  const add = getDefineTheme(monaco);

  add('vs-dark-plus', vsDark);
  add('vs-light-plus', vsLight);
  // add('github-dark', githubDark);
  // add('github', github);
  // add('amy', amy);
  // add('chromeDev', chromeDev);
  // add('nord', nord);
  // add('nightOwl', nightOwl);
  // add('BrillianceBlack', BrillianceBlack);
  // add('Monokai', Monokai);
  // add('Blackboard', Blackboard);
  // add('SolarizedDark', SolarizedDark);
  // add('SolarizedLight', SolarizedLight);
  // add('OceanicNext', OceanicNext);
}

function getDefineTheme(monaco: Monaco) {
  return defineTheme.bind(null, monaco);
}

function defineTheme(monaco: Monaco, themeName: string, themeData: unknown) {
  monaco.editor.defineTheme(themeName, themeData as editor.IStandaloneThemeData);
  store.themes.push(themeName)
}
