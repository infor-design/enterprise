import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

// Component Name
const COMPONENT_NAME = 'tag';

/**
 * Default Tag Options
 * @namespace
 */
const TAG_DEFAULTS = {
};

/**
*
* @class Tag
* @param {String} element The component element.
* @param {String} settings The component settings.
*/
function Tag(element, settings) {
  this.settings = utils.mergeSettings(element, settings, TAG_DEFAULTS);

  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Tag Methods
Tag.prototype = {

  init() {
    this.element.hideFocus();
    this.handleEvents();
  },

  /**
   * Remove the tag from the DOM
   * @private
   * @param {Object} event Type.
   * @param {String} el The element.
   * @returns {void}
   */
  remove(event, el) {
    el = el instanceof jQuery ? el : $(el);
    const parent = el.parent();

    /**
    * Fires before tag remove.
    *
    * @event beforetagremove
    * @type {Object}
    * @property {Object} event - The jquery event object
    * @property {Object} The event used for removing and element
    */
    this.element.triggerHandler('beforetagremove', { event, element: el });
    el.remove();

    /**
    * Fires after tag remove.
    *
    * @event aftertagremove
    * @type {Object}
    * @property {Object} event - The jquery event object
    * @property {Object} The event used for removing
    */
    parent.triggerHandler('aftertagremove', { event });
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {Object} The api
   */
  unbind() {
    this.element.off('keydown.tag');
    $('.dismissable-btn, .dismissible-btn', this.element).off('click.tag').remove();
    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {Object} settings The settings to apply.
   * @returns {Object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, TAG_DEFAULTS);
    }
    return this
      .unbind()
      .init();
  },

  /**
   * Destroy this component instance and remove the link from its base element.
   * @returns {void}
   */
  destroy() {
    this.unbind();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
   * Attach Events used by the Control
   * @private
   * @returns {void}
   */
  handleEvents() {
    const self = this;
    const btnDismissable = $('' +
      `<span class="dismissible-btn">
        ${$.createIcon('close')}
        <span class="audible"> ${Locale.translate('Close')}</span>
      </span>`);
    const dismissibleClass = '.is-dismissable, .is-dismissible';

    // EPC: Deprecating "dismissable" in favor of "dismissible" as of 4.3.0
    if (self.element.is(dismissibleClass)) {
      self.element.append(btnDismissable);

      /**
      * Fires when the tag is clicked (if enabled).
      *
      * @event click
      * @type {Object}
      * @property {Object} event - The jquery event object
      */
      // Handle Click
      btnDismissable.on('click.tag', (event) => {
        this.remove(event, this.element);
      });

      /**
      * Fires when the tag is focused.
      *
      * @event keydown
      * @type {Object}
      * @property {Object} event - The jquery event object
      */
      // Handle Keyboard
      this.element.on('keydown.tag', function (event) {
        const e = event || window.event;
        if (e.keyCode === 8) { // Backspace
          self.remove(event, this);
        }
      });
    }
  }
};

export { Tag, COMPONENT_NAME };
