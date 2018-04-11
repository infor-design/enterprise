import { Modal, COMPONENT_NAME } from './modal';

/**
* jQuery Component Wrapper for Modal
* @param {object} settings The settings to apply.
* @returns {jQuery[]} The jquery object for chaining.
*/
$.fn.modal = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    const elem = $(this);

    if (!elem.is('.modal')) {
      instance = elem.closest('.modal').data(COMPONENT_NAME);
    }

    if (instance && settings) {
      instance.updated(settings);
      // This was added for backwards compatability when using:
      // `$(this).modal('close');`
      // Examples have been updated to not show this.
      if (typeof instance[settings] === 'function') {
        instance[settings]();
        return;
      }

      if (settings.trigger === 'immediate') {
        instance.open();
      }
      return;
    }

    if (instance && !settings) {
      return;
    }

    instance = $.data(this, COMPONENT_NAME, new Modal(this, settings));
  });
};
