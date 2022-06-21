import { ToolbarFlex, COMPONENT_NAME } from './toolbar-flex';

/**
 * jQuery component wrapper for Toolbar Flex Component
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.toolbarflex = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new ToolbarFlex(this, settings));

      // Remove the jQuery Component reference from $.data
      const oldDestroy = instance.destroy;
      instance.destroy = function () {
        if (typeof oldDestroy === 'function') {
          oldDestroy.call(this);
        }
        if (this.element) $.removeData(this.element, COMPONENT_NAME);
        this.element = undefined;
      };
    }
  });
};
