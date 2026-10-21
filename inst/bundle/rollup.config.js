import fs from 'node:fs';
import path from 'node:path';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

const terserOptions = JSON.parse(fs.readFileSync('terser.json', 'utf8'));
const coreSource = path.resolve('node_modules/powerbi-visuals-core/src') + path.sep;

// The visuals import Core by package name; Core's frontends import its other modules by relative path
const visualImports = source => /^powerbi-visuals-core\//.test(source);
const coreImports = (source, importer) => importer?.startsWith(coreSource) === true && source.startsWith('.');

function bundle(name, external) {
  return {
    input: `${name}.ts`,
    external,
    output: [
      {
        format: 'iife',
        name,
        file: `dist/${name}.js`,
        globals: () => 'ccCore'
      },
      {
        format: 'iife',
        name,
        file: `dist/${name}.min.js`,
        globals: () => 'ccCore',
        plugins: [terser(terserOptions)]
      }
    ],
    plugins: [
      typescript({ tsconfig: './tsconfig.json' }),
      json(),
      nodeResolve({ browser: true }),
      commonjs()
    ]
  };
}

export default [
  bundle('ccCore'),
  bundle('spc', visualImports),
  bundle('funnel', visualImports),
  bundle('ccHeadless', coreImports),
  bundle('ccInteractive', coreImports),
  bundle('minidom')
];
