import { PopupMenu, COMPONENT_NAME } from './popupmenu';

/**
 * jQuery Component Wrapper for Popupmenu
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.popupmenu = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new PopupMenu(this, settings));
    }
  });
};
