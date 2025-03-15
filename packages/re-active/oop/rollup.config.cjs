const { withNx } = require('@nx/rollup/with-nx');

module.exports = withNx(
  {
    main: './src/index.ts',
    outputPath: '../../../dist/packages/re-active/oop',
    tsConfig: './tsconfig.json',
    compiler: 'tsc',
    format: ['esm', 'cjs'],
    assets: [{ input: '{projectRoot}', output: '.', glob: '*.md' }],
  },
  {
    // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
    // e.g.
    // output: { sourcemap: true },
  }
);
