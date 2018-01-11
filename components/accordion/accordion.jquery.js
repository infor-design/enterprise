import { Accordion, COMPONENT_NAME } from './accordion';

$.fn.accordion = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Accordion(this, settings));
    }
  });
};
