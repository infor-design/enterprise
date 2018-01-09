import { Arrange, COMPONENT_NAME } from './arrange';

// Initialize the plugin (Once)
$.fn.arrange = function (settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new Arrange(this, settings));
    }
  });
};
