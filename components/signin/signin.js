/* jshint esversion:6 */
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

/**
 * Component Name
 */
const COMPONENT_NAME = 'signin';

/**
 * Default SignIn Options
 */
const SIGNIN_DEFAULTS = {
};

/**
*
* @class SignIn
* @param {String} element The component element.
* @param {String} settings The component settings.
*/
function SignIn(element, settings) {
  this.settings = utils.mergeSettings(element, settings, SIGNIN_DEFAULTS);

  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Methods
SignIn.prototype = {

  init() {
    this.handleKeys();
  },

  /**
   * Checks a keyboard event for a CAPS LOCK modifier.
   * @private
   * @param {Object} e jQuery.Event
   * @returns {Boolean} true if caps lock
   */
  isCapslock(e) {
    e = e || window.event;
    let charCode = false;
    let shifton = false;

    if (e.which) {
      charCode = e.which;
    } else if (e.keyCode) {
      charCode = e.keyCode;
    }

    if (e.shiftKey) {
      shifton = e.shiftKey;
    } else if (e.modifiers) {
      shifton = !!(e.modifiers & 4);// eslint-disable-line
    }

    if (charCode >= 97 && charCode <= 122 && shifton) {
      return true;
    }
    if (charCode >= 65 && charCode <= 90 && !shifton) {
      return true;
    }
    return false;
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {Object} The api
   */
  unbind() {
    $('body').off('keypress.signin blur.signin change.signin');
    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {Object} settings The settings to apply.
   * @returns {Object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element, settings, SIGNIN_DEFAULTS);
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
  handleKeys() {
    const self = this;
    const cssIcon = $.createIconElement({ classes: 'icon-capslock', icon: 'capslock' });

    // Disable default [caps lock on] popup in IE
    document.msCapsLockWarningOff = true;

    this.element
      /**
      * Fires when keypress.
      *
      * @event keypress
      * @type {Object}
      * @property {Object} event - The jquery event object
      */
      .on('keypress.signin', '[type="password"]', function (e) {
        const field = $(this);
        const fieldParent = field.parent('.field');
        const iconCapslock = $('.icon-capslock', fieldParent);

        if (self.isCapslock(e) && !field.hasClass('error')) {
          if (!iconCapslock.length) {
            fieldParent.append(cssIcon);
            $('body').toast({ audibleOnly: true, message: Locale.translate('CapsLockOn') });
          }
        } else {
          iconCapslock.remove();
        }
      })

      /**
      * Fires when blur.
      *
      * @event blur
      * @type {Object}
      * @property {Object} event - The jquery event object
      */
      .on('blur.signin change.signin', '[type="password"]', function () {
        const field = $(this);
        const fieldParent = field.closest('.field');
        const iconCapslock = $('.icon-capslock', fieldParent);

        /**
        * Fires when change.
        *
        * @event change
        * @type {Object}
        * @property {Object} event - The jquery event object
        */
        // Wait for error class to be added
        setTimeout(() => {
          if (iconCapslock && iconCapslock.length) {
            if (field.hasClass('error')) {
              iconCapslock.remove();
            } else {
              fieldParent.append(cssIcon);
            }
          }
        }, 150);
      });
  }
};

export { SignIn, COMPONENT_NAME };
