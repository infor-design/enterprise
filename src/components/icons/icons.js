import * as debug from '../../utils/debug';
import { base } from '../../utils/base';
import { utils } from '../../utils/utils';

// component name
const COMPONENT_NAME = 'icon';

// Default Options
const ICON_DEFAULTS = {
  use: 'user-profile', // Match this to one of the IDS Enterprise icons, prefixed with an ID of '#icon-'
  focusable: false
};

/**
 * Icon Control
 * Wraps SVG Icons with a Javascript control that can change the icon type, reference
 * relative or absolute URLs, and clean up after itself.  Works with the Base tag.
 * @constructor
 * @param {jQuery[]|HTMLElement} element the base element
 * @param {object} [settings] incoming settings
 * @param {string} [settings.use = 'user-profile'] the type of icon that will appear.
 *  (gets added to the `<use>` tag's `href` property)
 * @param {boolean} [settings.focusable = false] whether or not this icon gets a `tabIndex` and
 *  becomes a focusable element on the page.
 */
function Icon(element, settings) {
  this.settings = utils.mergeSettings(element, settings, ICON_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Methods
Icon.prototype = {

  /**
   * @private
   * @chainable
   * @returns {this} component instance
   */
  init() {
    this.getExistingUseTag();

    // Do other init (change/normalize settings, load externals, etc)
    return this
      .render()
      .handleEvents();
  },

  /**
   * Add markup to the control
   * @private
   * @chainable
   * @returns {this} component instance
   */
  render() {
    const self = this;
    this.element.addClass('icon');

    if (!this.element.is('svg')) {
      // TODO: Possibly work with span-based icons here?
      return this;
    }

    // Get a "base-tag-proof" version of the Use tag's definition.
    // jQuery can't work with SVG elements, so we just modify it with regular DOM APIs
    const use = this.element[0].getElementsByTagName('use')[0];
    if (!use) {
      return this;
    }

    if (use.getAttribute('href') !== self.getBasedUseTag()) {
      use.setAttribute('href', self.getBasedUseTag());
    }

    return this;
  },

  /**
   * Gets the currently used base tag.
   * @returns {string} a version of this icon's definition prefixed with the current base tag's URL.
   */
  getBasedUseTag() {
    return base.getBaseURL(`#icon-${this.settings.use}`);
  },

  /**
   * Changes this icon instance's `use` setting to match an existing `<use> tag's
   * `href` attribute. In the event that a <use> tag pre-exists on an icon,
   * we want to retain it, and simply replace the settings.
   * @chainable
   * @returns {this} component instance
   */
  getExistingUseTag() {
    if (!this.element.is('svg')) {
      return this;
    }

    const useTag = this.element.children('use');
    if (!useTag.length) {
      return this;
    }

    // Store the icon's name under the `use` setting.
    // Strip out all extraneous items including the `base` URL.
    let href = useTag.attr('href');
    if (!href && useTag.attr('xlink:href')) {
      href = useTag.attr('xlink:href');
    }

    const baseUrl = base.url;
    if (href && base.element.length && baseUrl.length) {
      href = href.replace(baseUrl, '');
    }
    href = href.replace('#icon-', '');
    this.settings.use = href;

    return this;
  },

  /**
   * Sets up event handlers for this control and its sub-elements
   * @private
   * @chainable
   * @returns {this} component instance
   */
  handleEvents() {
    const self = this;

    this.element.on(`updated.${COMPONENT_NAME}`, () => {
      self.updated();
    });

    return this;
  },

  /**
   * Handle Updating Settings
   * @chainable
   * @param {object} [settings] incoming settings
   * @returns {this} component instance
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
   * Simple Teardown - remove events & rebuildable markup.
   * @chainable
   * @returns {this} component instance
   */
  teardown() {
    this.element.off(`updated.${COMPONENT_NAME}`);
    return this;
  },

  /**
   * Teardown - Remove added markup and events
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Icon, COMPONENT_NAME };
