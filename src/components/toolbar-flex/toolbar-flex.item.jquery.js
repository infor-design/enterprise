import { ToolbarFlexItem, COMPONENT_NAME } from './toolbar-flex.item';

/**
 * jQuery component wrapper for Toolbar Flex Item Component
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.toolbarflexitem = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new ToolbarFlexItem(this, settings));

      // Remove the jQuery Component reference from $.data
      const oldDestroy = instance.destroy;
      instance.destroy = function () {
        if (typeof oldDestroy === 'function') {
          oldDestroy.call(this);
        }
        $.removeData(this, COMPONENT_NAME);
      };
    }
  });
};
