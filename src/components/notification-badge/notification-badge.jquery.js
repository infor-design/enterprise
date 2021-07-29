import { NotificationBadge, COMPONENT_NAME } from './notification-badge';

/**
 * jQuery Component wrapper for Notification Badge
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements being acted on
 */
$.fn.notificationbadge = function (settings) {
  return this.each(function () {
    let instance = $.data(this, COMPONENT_NAME);
    if (instance) {
      instance.updated(settings);
    } else {
      instance = $.data(this, COMPONENT_NAME, new NotificationBadge(this, settings));
    }
  });
};
