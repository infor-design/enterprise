import { ListDetail, COMPONENT_NAME } from './list-detail';

/**
 * jQuery Component Wrapper for List/Detail Pattern
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} jQuery-wrapped components being acted on
 */
$.fn.listdetail = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new ListDetail(this, settings));
      instance.destroy = function destroy() {
        this.teardown();
        $.removeData(this, COMPONENT_NAME);
      };
    }
  });
};
