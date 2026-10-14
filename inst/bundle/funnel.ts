import { registerChart } from 'powerbi-visuals-core/frontends';
import { frontend } from './PowerBI-Funnels/src/frontend';

registerChart('funnel', frontend);

export { defaultSettings } from './PowerBI-Funnels/src/settings';
export { Visual } from './PowerBI-Funnels/src/visual';
