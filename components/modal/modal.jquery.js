import { Modal, COMPONENT_NAME } from './modal';

/**
* jQuery Component Wrapper for Modal
* @param  {object} settings The settings to apply.
* @returns {object} The jquery object for chaining.
*/
$.fn.modal = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    const elem = $(this);

    if (!elem.is('.modal')) {
      instance = elem.closest('.modal').data(COMPONENT_NAME);
    }

    if (instance) {
      instance.updated(settings);

      if (typeof instance[settings] === 'function') {
        instance[settings]();
        return;
      }

      if (settings.trigger === 'immediate') {
        instance.open();
      }
      return;
    }

    instance = $.data(this, COMPONENT_NAME, new Modal(this, settings));
  });
};
