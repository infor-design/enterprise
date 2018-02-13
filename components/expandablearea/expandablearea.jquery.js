import { ExpandableArea, COMPONENT_NAME } from './expandablearea';

$.fn.expandablearea = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new ExpandableArea(this, settings));
    }
  });
};
