import * as debug from './utils/debug';
import * as behaviors from './utils/behaviors';

// Core ======================================= /
// NOTE: Every item in the "Core" section is required for running the Soho library properly.
// The Soho team will not support any custom builds where these packages are not included.
// ============================================ /
export { version } from '../package.json';
export { debug };
export { uniqueIdCount, utils, DOM } from './utils/utils';
export { stringUtils as string } from './utils/string';
export { breakpoints } from './utils/breakpoints';
export { Locale } from './locale/locale';
export { Environment as env } from './utils/environment';

// Renderloop needs a single instance of itself
import { renderLoop, RenderLoopItem } from './utils/renderloop';
renderLoop.start();
export { renderLoop, RenderLoopItem };

// Theme/Personalization need single instances of themselves
export { theme } from './personalize/personalize';
export * from './personalize/personalize.hooks';

export { masks } from './mask/masks';
export { Validation } from './validation/validation';

// Behaviors ================================== /
export { behaviors };
export { Place } from './place/place';
export { Initialize } from './initialize/initialize';
export { ListFilter } from './listfilter/listfilter';
export { Tmpl } from './tmpl/tmpl';

// Components ================================= /
import * as components from './components';
export { components };
