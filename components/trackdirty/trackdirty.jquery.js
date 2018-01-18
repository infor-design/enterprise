import { Trackdirty, COMPONENT_NAME } from './trackdirty';

$.fn.trackdirty = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Trackdirty(this, settings));
    }
  });
};
