// Core ======================================= /
// NOTE: Every item in the "Core" section is required for running the Soho library properly.
// The Soho team will not support any custom builds where these packages are not included.
// ============================================ /
export { version } from '../package.json';
export * from './utils/debug';
export { uniqueIdCount, utils, DOM } from './utils/utils';
export { stringUtils as string } from './utils/string';
export { breakpoints } from './utils/breakpoints';
export { Locale } from './locale/locale';
export { Environment } from './utils/environment';
export { theme } from './utils/theme';

// Behaviors ======================== /
export { Personalize } from './personalize/personalize';
export { HideFocus, smoothScrollTo, defer } from './utils/behaviors';
export { Initialize } from './initialize/initialize';

// Components ======================= /
export { Button } from './button/button';

// Patterns ========================= /
