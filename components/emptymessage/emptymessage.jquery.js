import { EmptyMessage, COMPONENT_NAME } from './emptymessage';

// Empty Message jQuery wrapper
$.fn.emptymessage = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new EmptyMessage(this, settings));
    }
  });
};
