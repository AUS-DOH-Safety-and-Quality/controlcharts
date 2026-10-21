import { registerChart } from 'powerbi-visuals-core/frontends';
import { frontend } from './node_modules/powerbi-spc/src/frontend';

registerChart('spc', frontend);

export { defaultSettings } from './node_modules/powerbi-spc/src/settings';
export { Visual } from './node_modules/powerbi-spc/src/visual';
