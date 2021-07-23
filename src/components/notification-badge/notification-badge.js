import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';

// Settings and Options
const COMPONENT_NAME = 'notificationbadge';

const NOTIFICATION_BADGE_DEFAULTS = {
  propertyName: 'notificationbadge'
};

/**
 * Notification Badge - show and indicates that there are new events
 * @class NotificationBadge
 * @param {string} element The plugin element for the constuctor
 * @param {string} [settings] The settings element.
 */
function NotificationBadge(element, settings) {
  this.settings = utils.mergeSettings(element, settings, NOTIFICATION_BADGE_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeStart(COMPONENT_NAME);
}

// Plugin Methods
NotificationBadge.prototype = {

  /**
   * Do initialization, build up and / or add events ect.
   * @returns {object} The Component prototype, useful for chaining.
   */
  init() {
    // Do initialization. Build or Events ect
    return this
      .build()
      .handleEvents();
  },

  /**
   * Add any needed markup to the component.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  build() {
    console.log('test');
    return this;
  },

  /**
   * Sets up event handlers for this component and its sub-elements.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  handleEvents() {
    const self = this;

    this.element.on(`updated.${COMPONENT_NAME}`, () => {
      self.updated();
    });

    return this;
  },

  /**
   * Example Method.
   * @returns {void}
   */
  someMethod() {
    // do something with this.settings not settings.
  },

  /**
   * Handle updated settings and values.
   * @returns {object} [description]
   */
  updated() {
    return this
      .teardown()
      .init();
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @returns {object} The Component prototype, useful for chaining.
   * @private
   */
  teardown() {
    this.element.off(`updated.${COMPONENT_NAME}`);
    return this;
  },

  /**
   * Teardown - Remove added markup and events.
   * @private
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { NotificationBadge, COMPONENT_NAME };
