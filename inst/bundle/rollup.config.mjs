import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
// Core's package exports do not expose its rollup config
import bundleConfig from './node_modules/powerbi-visuals-core/config/rollup.mjs';

const lib = '../htmlwidgets/lib';

export default bundleConfig({ typescript, nodeResolve, commonjs, json, terser }, {
  ccCore: [`${lib}/UTILS/ccCore.js`, `${lib}/UTILS/ccCore.min.js`],
  spc: [`${lib}/PBISPC/PBISPC.js`, `${lib}/PBISPC/PBISPC.min.js`],
  funnel: [`${lib}/PBIFUN/PBIFUN.js`, `${lib}/PBIFUN/PBIFUN.min.js`],
  ccHeadless: [`${lib}/UTILS/ccHeadless.js`, `${lib}/UTILS/ccHeadless.min.js`],
  ccInteractive: [`${lib}/UTILS/ccInteractive.js`, `${lib}/UTILS/ccInteractive.min.js`],
  minidom: ['../js/minidom.js', '../js/minidom.min.js']
});
