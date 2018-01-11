import { BusyIndicator, COMPONENT_NAME } from './busyindicator';

$.fn.busyindicator = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new BusyIndicator(this, settings));
    }
  });
};
