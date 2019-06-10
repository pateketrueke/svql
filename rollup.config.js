import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const isDev = process.env.ROLLUP_WATCH;
const isProd = process.env.NODE_ENV === 'production';

function bundle(file, format) {
  return {
    sourcemap: false,
    name: 'svql',
    format,
    file,
  };
}

export default {
  input: isProd ? 'src/main.js' : 'tests/main.js',
  output: isProd ? [
    bundle('dist/svql.js', 'cjs'),
    bundle('dist/svql.es.js', 'es'),
    bundle('dist/svql.min.js', 'umd'),
  ] : bundle('docs/test.js', 'iife'),
  external: isProd ? ['svelte', 'svelte/store', 'svelte/internal'] : [],
  plugins: [
    svelte({
      dev: isDev,
    }),
    resolve(),
    commonjs(),
    isProd && terser(),
  ],
};
