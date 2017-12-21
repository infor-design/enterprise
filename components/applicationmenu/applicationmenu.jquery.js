import { ApplicationMenu, PLUGIN_NAME } from './applicationmenu';


/**
 * jQuery component wrapper for the Application Menu
 * @param {Object} options
 * @returns {ApplicationMenu}
 */
$.fn.applicationmenu = function(settings) {
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, PLUGIN_NAME, new ApplicationMenu(this, settings));
    }
    return instance;
  });
};
