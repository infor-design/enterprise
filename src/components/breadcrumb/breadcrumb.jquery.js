import { Breadcrumb, COMPONENT_NAME } from './breadcrumb';

/**
 * jQuery Component Wrapper for the IDS Breadcrumb Component
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} jQuery-wrapped components being acted on
 */
$.fn.breadcrumb = function jQueryBreadcrumb(settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Breadcrumb(this, settings));
    }
  });
};
