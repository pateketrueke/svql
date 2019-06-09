import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'tests/main.js',
  output: {
    sourcemap: false,
    format: 'iife',
    name: 'svql',
    file: 'docs/test.js',
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
    }),
    resolve(),
    commonjs(),
  ],
};
