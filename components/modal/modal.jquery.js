import { Modal, PLUGIN_NAME } from './modal';

/**
 * jQuery Component Wrapper for Modal
 */
$.fn.modal = function(settings) {

  // Support Chaining and Init the Control or Set Settings
  return this.each(function() {
    var instance = $.data(this, PLUGIN_NAME),
      elem = $(this);

    if (!elem.is('.modal')) {
      instance = elem.closest('.modal').data(PLUGIN_NAME);
    }

    if (instance) {
      instance.updated(settings);

      if (settings.trigger === 'immediate') {
        instance.open();
      }
      return;
    }

    instance = $.data(this, PLUGIN_NAME, new Modal(this, settings));
  });
};
