var dts = require('rollup-plugin-dts');
var copy = require('rollup-plugin-copy');

module.exports = [
  // …
  {
    input: './dist/types/packages/re-active/react/src/index.d.ts',
    output: [{ file: 'dist/re-active.d.ts', format: 'es' }],
    plugins: [
      copy({
        targets: [
          {
            src: 'dist/types/packages/re-active/react/src/lib/reactivity.d.ts',
            dest: 'dist/types/packages/re-active/react/src/lib',
            transform: (contents, filename) => contents.toString().replace('@vue/reactivity', './vue-reactivity')
          },
        ],
      }),
      dts.default(),
    ],
  },
];
