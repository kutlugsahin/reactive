// rollup.config.js
var typescript = require('rollup-plugin-typescript2');

var commonjs = require('@rollup/plugin-commonjs');
var resolve = require('@rollup/plugin-node-resolve');
var copy = require('rollup-plugin-copy');
// import babel from '@rollup/plugin-babel';
var pkg = require('./package.json');

const extensions = ['.ts', '.js'];

const name = 'ReactiveOop';

module.exports = {
  input: './src/index.ts',

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external
  external: ['react', '@vue/reactivity', 'tsyringe'],

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
