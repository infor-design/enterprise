import { Tooltip } from '../tooltip/tooltip';

// The Tooltip Component and Popover Component use the same prototype with different settings.
// Simply setup the Popover to be the same thing as the Tooltip.
$.fn.popover = function (settings) {
  return this.each(function () {
    let instance = $.data(this, 'popover');
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, 'popover', new Tooltip(this, settings));
    }
  });
};

