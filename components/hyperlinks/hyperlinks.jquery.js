import { Hyperlink, COMPONENT_NAME } from './hyperlinks';

/**
 * jQuery Component Wrapper for Hyperlink
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} jQuery-wrapped components being acted on
 */
$.fn.hyperlink = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Hyperlink(this, settings));
      instance.destroy = function destroy() {
        this.teardown();
        $.removeData(this, COMPONENT_NAME);
      };
    }
  });
};
