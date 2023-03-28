// rollup.config.js
var typescript = require('rollup-plugin-typescript2');

var commonjs = require('@rollup/plugin-commonjs');
var resolve = require('@rollup/plugin-node-resolve');
var copy = require('rollup-plugin-copy');
// import babel from '@rollup/plugin-babel';
var pkg = require('./package.json');

const extensions = ['.ts', '.js'];

const name = 'ReactiveReact';

module.exports = {
  input: './src/index.ts',

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external
  external: ['react'],

  plugins: [
    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    // Compile TypeScript/JavaScript files
    typescript({
      tsconfig: 'tsconfig.lib.json',
      useTsconfigDeclarationDir: true,
    }),

    // Allows node_modules resolution
    resolve({ extensions }),
    copy({
      targets: [
        {
          src: '../../../node_modules/@vue/reactivity/dist/reactivity.d.ts',
          dest: 'dist/types/packages/re-active/react/src/lib',
          rename: 'vue-reactivity.d.ts',
          transform: (contents, filename) => {
            return contents.toString().replace(
              `import { IfAny } from '@vue/shared'`,
              `export type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N`
            );
          },
        },
        {
          src: './src/reactivity.d.ts',
          dest: 'dist/types/packages/re-active/react/src/lib',
        },
      ],
    }),
  ],

  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
    {
      file: pkg.umd,
      format: 'umd',
      name,

      // https://rollupjs.org/guide/en#output-globals-g-globals
      globals: {
        react: 'React',
      },
    },
  ],
};
