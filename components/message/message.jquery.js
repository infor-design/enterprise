import { Message } from './message';

/**
 * jQuery Component Wrapper for Messages
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.message = function (settings) {
  // Support Chaining and Init the Control or Set Settings
  return this.each(function () {
    return new Message(this, settings);
  });
};
