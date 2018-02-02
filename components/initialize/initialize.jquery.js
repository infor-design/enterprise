import { Initialize } from './initialize';

/**
 * jQuery Component Wrapper for Initialize
 * @param {object} settings The settings to apply.
 * @returns {jQuery[]} The jquery object for chaining.
 */
$.fn.initialize = function (settings) {
  return this.each(function () {
    return new Initialize(this, settings);
  });
};
