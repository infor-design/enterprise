import { Datagrid, COMPONENT_NAME } from './datagrid'; //eslint-disable-line

/**
 * jQuery Component Wrapper for Datagrid
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.datagrid = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Datagrid(this, settings));
    }
  });
};
