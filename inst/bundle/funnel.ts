import { registerChart } from 'powerbi-visuals-core/frontends';
import { frontend } from './node_modules/powerbi-funnels/src/frontend';

registerChart('funnel', frontend);

export { defaultSettings } from './node_modules/powerbi-funnels/src/settings';
export { Visual } from './node_modules/powerbi-funnels/src/visual';
