import { utils } from '../../utils/utils';
import { Autocomplete, COMPONENT_NAME } from './autocomplete';

/**
 * jQuery Component Wrapper for Autocomplete
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} jQuery-wrapped components being acted on
 */
$.fn.autocomplete = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);

    // NOTE: This is modified due to a conflict between a legacy Soho attribute, `data-autocomplete`,
    // having the same value as jQuery's `$.data('autocomplete')`.
    if (typeof instance === 'string') {
      const stringSource = `${instance}`;
      const modifiedSettings = utils.extend({}, settings, {
        source: stringSource || settings.source
      });
      instance = $.data(this, COMPONENT_NAME, new Autocomplete(this, modifiedSettings));
    } else if (!instance) {
      instance = $.data(this, COMPONENT_NAME, new Autocomplete(this, settings));
    } else {
      instance.updated(settings);
    }
  });
};
