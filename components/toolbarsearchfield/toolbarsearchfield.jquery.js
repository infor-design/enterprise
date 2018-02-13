import { ToolbarSearchfield, COMPONENT_NAME } from './toolbarsearchfield';

/**
 * jQuery Component Wrapper for Toolbar Searchfield
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.toolbarsearchfield = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new ToolbarSearchfield(this, settings));
    }
  });
};
