import { CompositeForm, COMPONENT_NAME } from './compositeform';

/*
 * jQuery Component Wrapper for Composite Form
 */
$.fn.compositeform = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new CompositeForm(this, settings));
    }
  });
};
