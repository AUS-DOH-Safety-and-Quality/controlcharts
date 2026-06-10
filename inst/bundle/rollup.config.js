import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import iife from 'rollup-plugin-iife';

export default
  {
    input: ['spc.ts', 'funnel.ts', 'ccD3.ts'],
    output: {
      format: 'es',
      dir: 'dist'
    },
    plugins: [
      typescript({ tsconfig: './tsconfig.json' }),
      json(),
      nodeResolve({ browser: true }),
      commonjs(),
      iife()
    ]
  };
