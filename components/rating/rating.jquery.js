import { Rating, COMPONENT_NAME } from './rating';

// Initialize the plugin (Once)
$.fn.rating = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Rating(this, settings));
    }
  });
};
