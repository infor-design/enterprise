import { Modal, COMPONENT_NAME } from './modal';

/**
 * jQuery Component Wrapper for Modal
 */
$.fn.modal = function(settings) {

  // Support Chaining and Init the Control or Set Settings
  return this.each(function() {
    var instance = $.data(this, COMPONENT_NAME),
      elem = $(this);

    if (!elem.is('.modal')) {
      instance = elem.closest('.modal').data(COMPONENT_NAME);
    }

    if (instance) {
      instance.updated(settings);

      if (settings.trigger === 'immediate') {
        instance.open();
      }
      return;
    }

    instance = $.data(this, COMPONENT_NAME, new Modal(this, settings));
  });
};
