import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

// Settings and Options
const COMPONENT_NAME = 'notification';

const NOTIFICATION_DEFAULTS = {
  message: 'Hi! Im a notification message.',
  type: 'alert',
  parent: '.header',
  link: '#',
  linkText: 'Click here to view.',
  attributes: null
};

/**
 * Notification - Shows a slide in notifcation banner on the top of the page.
 * @class Notification
 * @param {string} element The plugin element for the constuctor
 * @param {string} [settings] The settings element.
 * @param {string} [settings.message] The text message to show in the notification.
 * @param {string} [settings.type] The message type, this influences the icon and color, possible types are 'error', 'alert', 'info' and 'success'
 * @param {string} [settings.parent] The jQuery selector to find where to insert the message into (prepended). By default this will appear under the .header on the page.
 * @param {string} [settings.link] The url to use for the hyperlink
 * @param {string} [settings.linkText] The text to show in the hyperlink. Leave empty for no link.
 * @param {string} [settings.attributes=null] Add extra attributes like id's to the element. e.g. `attributes: { name: 'id', value: 'my-unique-id' }`
 */
function Notification(element, settings) {
  this.settings = utils.mergeSettings(element, settings, NOTIFICATION_DEFAULTS);
  this.element = $(element);
  this.init();
}

// Plugin Methods
Notification.prototype = {

  /**
   * Do initialization, build up and / or add events ect.
   * @private
   * @returns {object} The Notification prototype, useful for chaining.
   */
  init() {
    return this
      .build()
      .handleEvents();
  },

  /**
   * Add any needed markup to the component.
   * @private
   * @returns {object} The Component prototype, useful for chaining.
   */
  build() {
    this.notificationEl = document.createElement('div');

    // IE 10/11 does not support multiple paramets for classList.add()
    this.notificationEl.classList.add('notification');
    this.notificationEl.classList.add(this.settings.type);

    const htmlIcon = `
      <svg class="icon notification-icon icon-${this.settings.type}" focusable="false" aria-hidden="true" role="presentation">
        <use href="#icon-${this.settings.type}"></use>
      </svg>`;

    let htmlText = `<p class="notification-text">${this.settings.message}`;

    if (this.settings.linkText) {
      htmlText += `<a class="notification-link" href="${this.settings.link}">${this.settings.linkText}</a>`;
    }

    htmlText += '</p>';

    const htmlButton = `
      <button type="text" class="notification-close">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-close"></use>
        </svg>
        <span class="audible">${Locale.translate('Close')}</span>
      </button>`;

    this.notificationEl.innerHTML = htmlIcon.concat(htmlText, htmlButton);

    const parentEl = document.querySelector(this.settings.parent);

    parentEl.parentNode.insertBefore(this.notificationEl, parentEl.nextSibling);
    $(this.notificationEl).animateOpen();

    utils.addAttributes($(this.notificationEl), this, this.settings.attributes);
    utils.addAttributes($(this.notificationEl).find('.notification-icon'), this, this.settings.attributes, 'icon');
    utils.addAttributes($(this.notificationEl).find('.notification-text'), this, this.settings.attributes, 'text');
    utils.addAttributes($(this.notificationEl).find('.notification-text a'), this, this.settings.attributes, 'link');
    utils.addAttributes($(this.notificationEl).find('button.notification-close'), this, this.settings.attributes, 'btn-close');
    utils.addAttributes($(this.notificationEl).find('button.notification-close .icon'), this, this.settings.attributes, 'icon-close');

    return this;
  },

  /**
   * Sets up event handlers for this component and its sub-elements.
   * @private
   * @returns {object} The Component prototype, useful for chaining.
   */
  handleEvents() {
    const self = this;

    $(this.notificationEl).off(`click.${COMPONENT_NAME}`).on(`click.${COMPONENT_NAME}`, '.notification-close', () => {
      self.destroy();
    });

    return this;
  },

  /**
   * Handle updated settings and values.
   * @param {object} [settings] incoming settings
   * @returns {object} [description]
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, NOTIFICATION_DEFAULTS);
    }

    return this
      .teardown()
      .init();
  },

  /**
   * Simple Teardown - remove events & rebuildable markup.
   * @private
   * @returns {object} The Component prototype, useful for chaining.
   */
  teardown() {
    this.element.off(`click.${COMPONENT_NAME}`, '.notification-close');
    return this;
  },

  /**
   * Destroy and remove added markup and detatch events.
   */
  destroy() {
    if (this.notificationEl && this.notificationEl.parentNode) {
      this.notificationEl.parentNode.removeChild(this.notificationEl);
    }

    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
   * Close and remove added markup and detatch events.
   */
  close() {
    this.destroy();
  }
};

export { Notification, COMPONENT_NAME };
