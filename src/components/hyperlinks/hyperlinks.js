import { utils } from '../../utils/utils';
import { HideFocus } from '../../utils/behaviors';

const COMPONENT_NAME = 'hyperlink';

/**
 * Soho component wrapper for Hyperlinks.
 * @class Hyperlink
 *
 * @param {HTMLElement} element the base Hyperlink element
 * @param {object} [settings] incoming settings
 * @returns {this} component instance
 */

const HYPERLINK_DEFAULTS = {};

function Hyperlink(element, settings) {
  return this.init(element, settings);
}

Hyperlink.prototype = {
  init(element, settings) {
    if (!this.element && element instanceof HTMLElement) {
      this.element = element;
    }

    if (typeof settings === 'object') {
      const previousSettings = this.settings || HYPERLINK_DEFAULTS;
      this.settings = utils.mergeSettings(this.element, settings, previousSettings);
    }

    this.element.classList.add('hyperlink');

    if (!this.focusBehavior) {
      this.focusBehavior = new HideFocus(this.element);
    }

    return this;
  },

  /**
   * Attach Events used by the Hyperlinks
   * @private
   * @returns {this} The component api for chaining.
   */
  handleEvents() {
    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    return this
      .teardown()
      .init();
  },

  /**
   * Removes the events and pseudo-markup created by the hyperlinks
   * @returns {this} component instance
   */
  teardown() {
    return this;
  }
};

export { Hyperlink, COMPONENT_NAME };
