import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

function bundle(name) {
  return {
    input: `${name}.ts`,
    external: /^powerbi-visuals-core\//,
    output: {
      format: 'iife',
      name,
      file: `dist/${name}.js`,
      globals: () => 'ccCore'
    },
    plugins: [
      typescript({ tsconfig: './tsconfig.json' }),
      json(),
      nodeResolve({ browser: true }),
      commonjs()
    ]
  };
}

export default [bundle('ccCore'), bundle('spc'), bundle('funnel')];
