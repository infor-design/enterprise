import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';

// Settings and Options
const COMPONENT_NAME = 'notificationbadge';

// Options for the position of dot
const NOTIFICATION_BADGE_POSITION_OPTIONS = ['upper-left', 'upper-right', 'lower-left', 'lower-right'];

// Options for the color of dot
const NOTIFICATION_BADGE_COLOR_OPTIONS = ['alert', 'warning', 'yield', 'complete', 'progress', 'caution'];

const NOTIFICATION_BADGE_DEFAULTS = {
  position: NOTIFICATION_BADGE_POSITION_OPTIONS[1],
  color: NOTIFICATION_BADGE_COLOR_OPTIONS[0],
  attribute: null
};

/**
 * Notification Badge - show and indicates that something has change.
 * @class NotificationBadge
 * @param {string} element The plugin element for the constuctor
 * @param {string} [settings] The settings element.
 * @param {string} [settings.position] The placement of notification badge.
 * @param {string} [settings.color] The color of the notification badge.
 * @param {array|object} [settings.attributes=null] Add extra attributes like id's to the element e.g. `attributes: { name: 'id', value: 'my-unique-id' }`
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
    if (this.element.hasClass('btn-tertiary') || (this.element.hasClass('btn-icon') && !this.element.hasClass('application-menu-trigger'))) {
      const svgEl = this.element.find('svg');

      this.notificationBadgeContainerEl = $('<span class="notification-badge-container"></span>');
      this.notificationBadgeContainerEl.insertAfter(svgEl);
    } else {
      this.notificationBadgeContainerEl = this.element.append('<span class="notification-badge-container"></span>');
    }

    const htmlNotificationBadge = `
      <span class="notification-dot notification-dot-${this.settings.position} notification-dot-${this.settings.color}"></span>`;

    this.element.find('.notification-badge-container').append(htmlNotificationBadge);

    utils.addAttributes(this.element.find('.notification-badge-container'), this, this.settings.attributes, 'container');
    utils.addAttributes(this.element.find('.notification-badge-container .notification-dot'), this, this.settings.attributes, 'dot');

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
   * Handle updated settings and values.
   * @returns {object} [description]
   */
  updated() {
    return this
      .teardown()
      .init();
  },

  /**
    * Enable a disabled badge.
    * @returns {void}
    */
  show() {
    this.element.find('.notification-dot').removeClass('is-disabled');
  },

  /**
    * Disable a badge.
    * @returns {void}
    */
  hide() {
    this.element.find('.notification-dot').addClass('is-disabled');
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
    if (this.element) {
      this.element.find('.notification-badge-container').remove();
      $.removeData(this.element[0], COMPONENT_NAME);
    }
  }
};

export { NotificationBadge, COMPONENT_NAME };
