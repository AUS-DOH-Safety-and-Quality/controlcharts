import { registerChart } from 'powerbi-visuals-core/frontends';
import { frontend } from './PowerBI-SPC/src/frontend';

registerChart('spc', frontend);

export { defaultSettings } from './PowerBI-SPC/src/settings';
export { Visual } from './PowerBI-SPC/src/visual';
