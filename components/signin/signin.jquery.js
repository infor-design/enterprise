import { SignIn, COMPONENT_NAME } from './signin';

// Initialize the plugin (Once)
$.fn.signin = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new SignIn(this, settings));
    }
  });
};
