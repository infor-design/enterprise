import { Notification, COMPONENT_NAME } from './notification';

/**
 * jQuery Component Wrapper for notification
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.notification = function (settings) {
  return this.each(function () {
    $.data(this, COMPONENT_NAME, new Notification(this, settings));
  });
};
