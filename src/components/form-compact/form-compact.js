import { utils } from '../../utils/utils';

// Component Name
const COMPONENT_NAME = 'formcompact';

// Settings
const FORMCOMPACT_DEFAULTS = {};

/**
 *
 */
function FormCompact(element, settings) {
  this.settings = utils.mergeSettings(element, settings, FORMCOMPACT_DEFAULTS);
  this.element = element;
}

FormCompact.prototype = {

};

export { FormCompact, COMPONENT_NAME };
