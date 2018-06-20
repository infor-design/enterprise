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
export { breakpoints } from './utils/breakpoints';
export { Locale } from './components/locale/locale';
export { Environment as env } from './utils/environment';

// a Base Tag reference needs to export itself on the Soho object
export { base } from './utils/base';

// Renderloop needs a single instance of itself
import { renderLoop, RenderLoopItem } from './utils/renderloop';

renderLoop.start();
export { renderLoop, RenderLoopItem };

// Theme/Personalization need single instances of themselves
export { theme } from './components/personalize/personalize';
export { personalization } from './components/personalize/personalize.bootstrap';
export * from './components/personalize/personalize.hooks';

export { masks } from './components/mask/masks';
export { Validation } from './components/validation/validation';

// Behaviors ================================== /
export { behaviors };
export { Place } from './components/place/place';
export { Initialize } from './components/initialize/initialize';
export { ListFilter } from './components/listfilter/listfilter';
export { Tmpl } from './components/tmpl/tmpl';

// Needed for Datagrid (Previous Globals) ====== /
export { Formatters } from './components/datagrid/datagrid.formatters';
export { Editors } from './components/datagrid/datagrid.editors';
export { GroupBy } from './components/datagrid/datagrid.groupby';
export { excel } from './utils/excel';

// Components ================================= /
import * as components from './components/components';
import * as patterns from './patterns/patterns';

export { components, patterns };
