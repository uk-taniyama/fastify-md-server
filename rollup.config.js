const json = require('@rollup/plugin-json');
const { default: resolve } = require('@rollup/plugin-node-resolve');
const { default: dts } = require('rollup-plugin-dts');
const { default: esbuild } = require('rollup-plugin-esbuild');
const styles = require('rollup-plugin-styles');

const pkg = require('./package.json');

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 * (c) ${new Date().getFullYear()} ${pkg.name} Contributors
 * Released under the MIT License
 */`;

const buildPlugins = [
  json(),
  esbuild({
    target: 'es2021',
    exclude: ['**/*test*', 'src/e2e/**'],
    sourceMap: true,
    banner,
  }),
  resolve({
    mainFields: ['module', 'main'],
    extensions: ['.ts', '.mjs', '.cjs', '.js', '.jsx', '.json', '.node', '.css'],
    modulesOnly: true,
  }),
  styles({
    mode: ['extract', 'styles.css'],
    minimize: true,
  }),
];

const watch = process.env.ROLLUP_WATCH === 'true';

const dtsPlugins = [
  dts(),
  styles({
    mode: ['inject', () => ''],
  }),
];

const onwarn = (warning, defaultHandler) => {
  // NOTE next warning is not a bug. https://github.com/d3/d3-interpolate/issues/58
  if (warning.code === 'CIRCULAR_DEPENDENCY') {
    if (warning.importer.indexOf('d3-interpolate')) return;
  }
  // console.error(warning);
  defaultHandler(warning);
};

module.exports = [
  { format: 'esm', ext: '.js', plugins: buildPlugins },
  { format: 'es', ext: '.d.ts', plugins: dtsPlugins },
]
  // .filter(({ format }) => format==='esm')
  .map(({ format, ext, plugins }) => ({
    plugins,
    input: 'src/index.ts',
    output: {
      format,
      file: `dist/index${ext}`,
      assetFileNames: '[name][extname]',
    },
    onwarn,
    external: [
      /node_modules/,
    ],
  }));
