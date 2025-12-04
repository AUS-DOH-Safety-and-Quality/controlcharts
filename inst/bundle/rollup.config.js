// rollup.config.js
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from "@rollup/plugin-terser";

export default {
  input: 'linkedom.js',
  output: {
    format: 'iife',
    name: 'linkedom',
    file: '../js/linkedom.js'
  },
  plugins: [
    nodeResolve({ browser: true }),
    commonjs(),
    terser()
  ]
};
