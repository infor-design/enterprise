import { utils } from './utils';
import { Environment } from './environment';
import { Initialize } from '../initialize/initialize';

let DEFAULT_BOOTSTRAP_OPTIONS = {
  doInitialize: true,
  locale: 'en-US'
};

/**
 * Soho Bootstrapper
 * @param { DEFAULT_BOOTSTRAP_OPTIONS } [options]
 */
export function bootstrapper(options) {
  // Set options
  options = utils.extend({}, DEFAULT_BOOTSTRAP_OPTIONS, options);

  // Set the environment
  Environment.set();

  // If we want to use the built-in initializer, pass it
  if (!options.doInitialize) {
    return;
  }
  new Initialize(document.body, {
    locale: options.locale
  });
}
