import { ApplicationMenu, COMPONENT_NAME } from './applicationmenu';


/**
 * jQuery component wrapper for the Application Menu
 * @param {object} options
 * @returns {ApplicationMenu}
 */
$.fn.applicationmenu = function(settings) {
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new ApplicationMenu(this, settings));
    }
    return instance;
  });
};
