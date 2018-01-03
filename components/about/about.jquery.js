import { About, PLUGIN_NAME } from './about';

$.fn.about = function (settings) {
  return this.each(function () {
    let instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new About(this, settings));
    }
  });
};
