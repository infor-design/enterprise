/* eslint-disable import/first */

import * as debug from './utils/debug';
import * as behaviors from './utils/behaviors';
import './components/initialize/initialize.jquery';

// Core ======================================= /
// NOTE: Every item in the "Core" section is required for running the Soho library properly.
// The Soho team will not support any custom builds where these packages are not included.
// ============================================ /
export { version } from '../package.json';
export { debug };
export { uniqueIdCount, utils } from './utils/utils';
export { DOM } from './utils/dom';
export { stringUtils as string } from './utils/string';
export { xssUtils as xss } from './utils/xss';
export { breakpoints } from './utils/breakpoints';
export { Locale } from './components/locale/locale';
export { Environment as env } from './utils/environment';

// a Base Tag reference needs to export itself on the Soho object
export { base } from './utils/base';

// Renderloop needs a single instance of itself
export { renderLoop, RenderLoopItem } from './utils/renderloop';

// Theme/Personalization need single instances of themselves
export { theme } from './components/personalize/personalize';
export { personalization } from './components/personalize/personalize.bootstrap';
export * from './components/personalize/personalize.hooks';

// Behaviors ================================== /
export { behaviors };

// LongPress needs a single instance of itself
export { longPress } from './behaviors/longpress/longpress';

export { Place } from './components/place/place';
//export { Initialize } from './components/initialize/initialize';
export { ListFilter } from './components/listfilter/listfilter';
export { Tmpl } from './components/tmpl/tmpl';

// Component Rules Libraries ================================== /
// These contain modifiable rules for specific components that must be present
// before their Components are loaded.
export { masks } from './components/mask/masks';
export { Validation } from './components/validation/validation';
export { Formatters } from './components/datagrid/datagrid.formatters';
export { Editors } from './components/datagrid/datagrid.editors';
export { GroupBy } from './components/datagrid/datagrid.groupby';
export { excel } from './utils/excel';

// Components ================================= /
import * as components from './components/components';
import * as patterns from './patterns/patterns';

export { components, patterns };
