import { Environment as env } from '../../utils/environment';
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

// jQuery Components
import '../button/button.jquery';
import '../mask/mask-input.jquery';

// Component Name
const COMPONENT_NAME = 'spinbox';

// Component Defaults
const SPINBOX_DEFAULTS = {
  autocorrectOnBlur: true,
  min: -2147483647,
  max: 2147483647,
  step: null,
  maskOptions: null
};

/**
 * The Spinbox component provides easy access to modification of a numeric input field.
 * @class Spinbox
 * @constructor
 * @param {jQuery[]|HTMLElement} element the base element
 * @param {object} [settings] incoming settings
 * @param {boolean} [settings.autocorrectOnBlur = true] If true the input will adjust to the nearest step on blur.
 * @param {Number} [settings.min = -2147483647] if defined, provides a minimum numeric limit
 * @param {Number} [settings.max = 2147483647]  if defined, provides a maximum numeric limit
 * @param {Number} [settings.maskOptions = null]  if defined this is passed to the internal mask component
 * @param {null|Number} [settings.step = null]  if defined, increases or decreases the spinbox value
 *  by a specific interval whenever the control buttons are used.
 *  the spinbox value after the spinbox has lost focus.
 */
function Spinbox(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, SPINBOX_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Methods
Spinbox.prototype = {

  /**
   * @private
   * @returns {boolean} whether or not touch controls are available
   */
  get isTouch() {
    return env.features.touch;
  },

  /**
   * @returns {boolean} "true" if this spinbox is inside a wrapper.
   */
  get isWrapped() {
    return this.element.parent().is('.spinbox-wrapper');
  },

  /**
   * @returns {boolean} "true" if this spinbox is part of an inline label.
   */
  get isInlineLabel() {
    return this.element.parent().is('.inline');
  },

  /**
   * @private
   */
  init() {
    this.inlineLabel = this.element.closest('label');
    this.inlineLabelText = this.inlineLabel.find('.label-text');

    if (this.element.is(':disabled')) {
      this.element.closest('.field').addClass('is-disabled');
    }

    this
      .setInitialValue()
      .addMarkup()
      .bindEvents()
      .setWidth();
  },

  /**
   * Sets the width of the spinbox input field.
   * @private
   * @returns {this} component instance
   */
  setWidth() {
    const style = this.element[0].style;

    if (style.width) {
      this.element.parent()[0].style.width = `${parseInt(style.width, 10) + (this.element.parent().find('.down').outerWidth() * 2)}px`;
    }

    return this;
  },

  /**
   * Sanitize the initial value of the input field.
   * @private
   * @returns {this} component instance
   */
  setInitialValue() {
    const self = this;
    const val = self.checkForNumeric(self.element.val());

    this.element.val(val);
    // If using Dirty Tracking, reset the "original" value of the dirty tracker to the current value
    // of the input, since it may have changed after re-invoking the input field.
    if (this.element.attr('data-trackdirty')) {
      this.element.data('original', val);
    }

    // allow numeric input on iOS
    const iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    if (iOS) {
      this.element.attr('pattern', '\\d*');
    }

    if (this.element.attr('max')) {
      this.settings.max = this.element.attr('max');
    } else if (this.settings.max) {
      this.element.attr('max', this.settings.max);
    }

    if (this.element.attr('step')) {
      this.settings.max = this.element.attr('step');
    } else if (this.settings.step) {
      this.element.attr('step', this.settings.step);
    }

    if (this.element.attr('min')) {
      this.settings.min = this.element.attr('min');
    } else if (this.settings.min) {
      this.element.attr('min', this.settings.min);
    }

    return this;
  },

  /**
   * Appends extra control markup to a Spinbox field.
   * @private
   * @returns {this} component instance
   */
  addMarkup() {
    const self = this;
    if (this.isInlineLabel) {
      this.inlineLabel.addClass('spinbox-wrapper');
    } else if (!this.isWrapped) {
      const spinboxWrapper = '<span class="spinbox-wrapper"></span>';
      if (this.element.is('.field-options')) {
        const field = this.element.closest('.field');
        const fieldOptionsTrigger = field.find('.btn-actions');

        this.element
          .add(fieldOptionsTrigger)
          .add(fieldOptionsTrigger.next('.popupmenu'))
          .wrapAll(spinboxWrapper);
      } else {
        this.element.wrap(spinboxWrapper);
      }
    }

    if (this.isWrapped) {
      this.buttons = {
        down: this.element.parent().find('.down'),
        up: this.element.parent().find('.up')
      };
    }

    if (!this.buttons.up.length) {
      this.buttons.up = $(`<span ${this.isTouch ? '' : 'aria-hidden="true"'} class="spinbox-control up">+</span>`).insertAfter(this.element);
      this.buttons.up.button();
    }

    if (!this.buttons.down.length) {
      this.buttons.down = $(`<span ${this.isTouch ? '' : 'aria-hidden="true"'} class="spinbox-control down">-</span>`).insertBefore(this.element);
      this.buttons.down.button();
    }

    const sizes = ['input-xs', 'input-sm', 'input-mm', 'input-md', 'input-lg'];
    const elemClasses = this.element[0].className;
    sizes.forEach((size) => {
      if (elemClasses.indexOf(size) > -1) {
        const spinboxSize = size.replace('input', 'spinbox');
        if (this.isWrapped) {
          this.element.parent('.spinbox-wrapper').addClass(spinboxSize);
        } else if (this.isInlineLabel) {
          this.inlineLabel.addClass(spinboxSize);
        }
      }
    });

    // Figure out minimum/maximum and data-masking attributes.  The user can provide the spinbox
    // plugin either the min/max or the mask, and the plugin will automatically figure out how to
    // use them.
    const min = this.element.attr('min');
    let max = this.element.attr('max');
    const attributes = {
      role: 'spinbutton'
    };

    // Define a default Max value if none of these attributes exist, to ensure the mask plugin will
    // work correctly.  Cannot define a Min value here because the plugin must be able to invoke
    // itself with a NULL value.
    if (!min && !max) {
      max = '9999999';
    }

    // If no negative symbol exists in the mask, the minimum value must be zero.
    attributes.min = min || 0;
    attributes.max = max;

    // Destroy the Mask Plugin if it's already been invoked.  We will reinvoke it later
    // on during initialization.  Check to make sure its the actual Mask plugin object,
    // and not the "data-mask" pattern string.
    if (this.element.data('mask') && typeof this.element.data('mask') === 'object') {
      this.element.data('mask').destroy();
    }

    // Add Aria Properties for valuemin/valuemax
    attributes['aria-valuemin'] = min || 0;
    attributes['aria-valuemax'] = max || 0;
    this.element.attr(attributes);

    // Set an initial "aria-valuenow" value.
    this.updateAria(self.element.val());

    // Invoke the mask plugin
    const maskOptions = {
      process: 'number',
      patternOptions: {
        allowDecimal: false,
        allowThousandsSeparator: false,
        allowNegative: Math.min(this.settings.min, this.settings.max) < 0,
        decimalLimit: 0,
        integerLimit: String(this.settings.max).length
      }
    };

    this.element.mask(this.settings.maskOptions || maskOptions);

    // Disable in full if the settings have determined we need to disable on init.
    if (this.isDisabled()) {
      this.disable();
    }

    if (this.element.attr('readonly')) {
      this.readonly();
    }

    return this;
  },

  /**
   * Enables Long Pressing one of the Spinbox control buttons.
   * @private
   * @param {jQuery.Event} e jQuery `touchstart` or `mousedown` events
   * @param {Spinbox} self this component instance
   * @returns {void}
   */
  enableLongPress(e, self) {
    self.addButtonStyle(e);
    self.longPressInterval = setInterval(() => {
      if ($(e.currentTarget).is(':hover')) {
        self.handleClick(e);
      }
    }, 250);
  },

  /**
   * Disables Long Pressing one of the Spinbox control buttons.
   * @private
   * @param {jQuery.Event} e jQuery `touchend` or `mouseup` events
   * @param {Spinbox} self this component instance
   * @returns {void}
   */
  disableLongPress(e, self) {
    self.removeButtonStyle(e);
    clearInterval(self.longPressInterval);
    self.longPressInterval = null;
  },

  /**
   * Event handler for 'click' events
   * @private
   * @param {jQuery.Event} e jQuery `click` event
   * @returns {void}
   */
  handleClick(e) {
    e.preventDefault();

    if (this.isDisabled() || e.which !== 1 || this.isReadonly()) {
      return;
    }
    const target = $(e.currentTarget);
    if (target.hasClass('up')) {
      this.increaseValue();
    } else {
      this.decreaseValue();
    }

    this.element.focus();
  },

  /**
   * Event handler for 'keydown' events
   * @private
   * @param {jQuery.Event} e jQuery `keydown` event
   * @param {Spinbox} self component instance
   */
  handleKeyDown(e, self) {
    const key = e.which;
    const validKeycodes = [35, 36, 37, 38, 39, 40];

    if ($.inArray(key, validKeycodes) === -1) {
      return;
    }

    if (this.isReadonly()) {
      return;
    }

    // If the keycode got this far, it's an arrow key, HOME, or END.
    switch (key) {
      case 35: // End key sets the spinbox to its minimum value
        if (self.element.attr('min')) { self.element.val(self.element.attr('min')); }
        break;
      case 36: // Home key sets the spinbox to its maximum value
        if (self.element.attr('max')) { self.element.val(self.element.attr('max')); }
        break;
      case 38: // Up increases the spinbox value
        self.addButtonStyle(self.buttons.up);
        self.increaseValue();
        break;
      case 40: // Down decreases the spinbox value
        self.addButtonStyle(self.buttons.down);
        self.decreaseValue();
        break;
      default:
        break;
    }
  },

  /**
   * Event handler for 'keyup' events
   * @private
   * @param {jQuery.Event} e jQuery `input` event
   * @param {Spinbox} self this component instance
   * @returns {void}
   */
  handleKeyup(e, self) {
    if (self.isDisabled() || this.isReadonly()) {
      return;
    }
    const key = e.which;

    // Spinbox Control Button styles are added/removed on keyup.
    switch (key) {
      case 38: case 39:
        if (Locale.isRTL() && key === 39) {
          self.removeButtonStyle(self.buttons.down);
        } else {
          self.removeButtonStyle(self.buttons.up);
        }
        break;
      case 37: case 40:
        if (Locale.isRTL() && key === 39) {
          self.removeButtonStyle(self.buttons.up);
        } else {
          self.removeButtonStyle(self.buttons.down);
        }
        break;
      default:
        break;
    }

    self.updateAria(self.element.val());
  },

  /**
   * Change a newly pasted value to this element's min or max values, if the pasted
   * value goes beyond either of those limits.  Listens to an event emitted by the
   * Mask plugin after pasted content is handled.
   * @private
   * @param {Spinbox} self this component instance
   * @returns {void}
   */
  handleAfterPaste(self) {
    const min = Number(self.element.attr('min'));
    const max = Number(self.element.attr('max'));
    let val = Number(self.element.val());

    if (val < min) {
      val = min;
    }
    if (val > max) {
      val = max;
    }

    self.updateVal(val);
  },

  /**
   * Fixes a value that may have been entered programmatically, or by paste,
   * if it goes out of the range boundaries.
   * @private
   * @param {jQuery.Event} e jQuery `input` event
   * @returns {void}
   */
  correctValue(e) {
    const num = Number(this.element.val());
    const min = parseInt(this.element.attr('min'), 10);
    const max = parseInt(this.element.attr('max'), 10);

    if (num < min) {
      if (e) {
        e.preventDefault();
      }
      return this.updateVal(min);
    }
    if (num > max) {
      if (e) {
        e.preventDefault();
      }
      return this.updateVal(max);
    }
    return undefined;
  },

  /**
   * Increases the value of the Spinbox field, constrained by the step interval and maximum limit.
   * @returns {void}
   */
  increaseValue() {
    const max = this.element.attr('max');
    const val = this.checkForNumeric(this.element.val()) + Number(this.element.attr('step') || 1);

    if (max && val > max) {
      return this.updateVal(max);
    }
    return this.updateVal(val);
  },

  /**
   * Decreases the value of the Spinbox field, constrained by the step interval and minimum limit.
   * @returns {void}
   */
  decreaseValue() {
    const min = this.element.attr('min');
    const val = this.checkForNumeric(this.element.val()) - Number(this.element.attr('step') || 1);

    if (min && val < min) {
      return this.updateVal(min);
    }
    return this.updateVal(val);
  },

  /**
   * Sets a new spinbox value and focuses the spinbox.
   * @param {Number|String} newVal the value to set on the spinbox
   * @returns {void}
   */
  updateVal(newVal) {
    this.element.val(newVal).trigger('change');
    this.updateAria(newVal);
  },

  /**
   * Sanitizes the value of the input field to an integer if it isn't already established.
   * @private
   * @param {Number|String} val will be converted to a number if it's a string.
   * @returns {number} a numeric version of the value provided, or a corrected value.
   */
  checkForNumeric(val) {
    // Allow for NULL
    if (val === '') {
      return val;
    }
    if ($.isNumeric(val)) {
      return Number(val);
    }
    val = parseInt(val, 10);
    if ($.isNumeric(val)) {
      return Number(val);
    }
    // Zero out the value if a number can't be made out of it.
    return 0;
  },

  /**
   * Updates the "aria-valuenow" property on the spinbox element if the value is currently set
   * @private
   * @param {number} val the new value to be set on the spinbox
   * @returns {void}
   */
  updateAria(val) {
    const min = this.element.attr('min');
    const max = this.element.attr('max');

    val = this.checkForNumeric(val);
    this.element[0].setAttribute('aria-valuenow', val || '0');
    this.element[0].setAttribute('autocomplete', 'off');

    // Toggle min/max buttons
    this.setIsDisabled(this.buttons.up, (val !== '' && max && val >= max) ? 'disable' : 'enable');
    this.setIsDisabled(this.buttons.down, (val !== '' && min && val <= min) ? 'disable' : 'enable');
  },

  /**
   * Adds a "pressed-in" styling for one of the spinner buttons.
   * @private
   * @param {jQuery.Event|jQuery[]} e either an incoming event, or a button element to be acted on
   * @returns {void}
   */
  addButtonStyle(e) {
    if (this.isDisabled() || this.isReadonly()) {
      return;
    }
    let target = e;
    if (e.currentTarget) {
      target = $(e.currentTarget);
    }
    target.addClass('is-active');
  },

  /**
   * Removes "pressed-in" styling for one of the spinner buttons
   * @private
   * @param {jQuery.Event|jQuery[]} e either an incoming event, or a button element to be acted on
   * @returns {void}
   */
  removeButtonStyle(e) {
    if (this.isDisabled() || this.isReadonly()) {
      return;
    }
    let target = e;
    if (e.currentTarget) {
      target = $(e.currentTarget);
    }
    target.removeClass('is-active');
  },

  /**
   * Enables the Spinbox
   * @returns {void}
   */
  enable() {
    this.element.prop('disabled', false);
    this.element.parent('.spinbox-wrapper').removeClass('is-disabled is-readonly');
    this.element.prop('readonly', false);
  },

  /**
   * Disables the Spinbox
   * @returns {void}
   */
  disable() {
    this.element.prop('disabled', true);
    this.element.attr('disabled', 'disabled');
    this.element.parent('.spinbox-wrapper').addClass('is-disabled');

    setTimeout(() => {
      this.element.parent('.spinbox-wrapper').addClass('is-disabled');
    });
  },

  /**
   * Makes the Spinbox readonly
   * @returns {void}
   */
  readonly() {
    this.element.prop('readonly', true);
    this.element.parent('.spinbox-wrapper').addClass('is-readonly');
  },

  /**
   * Checks if the Spinbox is readonly
   * @returns {void}
   */
  isReadonly() {
    return this.element.prop('readonly');
  },

  /**
   * Determines whether or not the spinbox is disabled.
   * @returns {boolean} whether or not the spinbox is disabled.
   */
  isDisabled() {
    return this.element.prop('disabled');
  },

  /**
   * Toggle whther or not the component is disabled.
   * @private
   * @param {jQuery[]} button the button element to be disabled
   * @param {booelan} [isDisabled] whether or not to force a change to the button's state.
   * @returns {void}
   */
  setIsDisabled(button, isDisabled) {
    isDisabled = isDisabled === undefined ? true :
      !((!isDisabled || isDisabled === 'enable'));

    button[isDisabled ? 'addClass' : 'removeClass']('is-disabled');
  },

  /**
   * Updated
   * @param {object} [settings] incoming settings
   * @returns {this} component instance
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }
    return this;
  },

  /**
   * Teardown
   * @returns {void}
   */
  destroy() {
    const mask = this.element.data('mask');
    if (mask && typeof mask.destroy === 'function') {
      mask.destroy();
    }

    for (const button in this.buttons) { // eslint-disable-line
      const buttonAPI = $(button).data('button');

      if (buttonAPI) {
        buttonAPI.destroy();
      }
    }

    this.buttons.up.off('click.spinbox mousedown.spinbox');
    this.buttons.up.remove();
    this.buttons.down.off('click.spinbox mousedown.spinbox');
    this.buttons.down.remove();
    this.element.off('focus.spinbox blur.spinbox keydown.spinbox keyup.spinbox');
    this.element.unwrap();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
  *  Fires when the input gains focus.
  * @event focus
  * @memberof Spinbox
  * @property {object} event - The jquery event object
  */
  /**
   * Fires when the input looses focus.
   * @event blur
   * @memberof Spinbox
   * @property {object} event - The jquery event object
   */
  /**
    * Fires when a key is pressed down.
    * @event keydown
    * @memberof Spinbox
    * @property {object} event - The jquery event object
  */
  /**
    * Fires when a key is pressed.
    * @event keypress
    * @memberof Spinbox
    * @property {object} event - The jquery event object
  */
  /**
    * Fires when a key is pressed up.
    * @event keyup
    * @memberof Spinbox
    * @property {object} event - The jquery event object
  */
  /**
    * Fires after input is pasted in.
    * @event afterpaste
    * @memberof Spinbox
    * @property {object} event - The jquery event object
  */

  /**
   * Sets up event handlers for this control and its sub-elements
   * @private
   * @returns {void}
   */
  bindEvents() {
    const self = this;
    let preventClick = false;

    // Main Spinbox Input
    this.element.on('focus.spinbox', () => {
      self.element.parent('.spinbox-wrapper').addClass('is-focused');
    }).on('blur.spinbox', () => {
      self.element.parent('.spinbox-wrapper').removeClass('is-focused');
      if (self.settings.autocorrectOnBlur) {
        self.correctValue();
      }
    }).on('keydown.spinbox', (e) => {
      self.handleKeyDown(e, self);
    }).on('keyup.spinbox', (e) => {
      self.handleKeyup(e, self);
    })
      .on('afterpaste.mask', () => {
        self.handleAfterPaste(self);
      });

    // Up and Down Buttons
    const buttons = this.buttons.up.add(this.buttons.down[0]);
    buttons.on('touchstart.spinbox mousedown.spinbox', (e) => {
      if (e.which === 1) {
        if (!preventClick) {
          self.handleClick(e);
        }

        if (self.isTouch) {
          return;
        }

        preventClick = true;
        self.enableLongPress(e, self);

        $(document).one('mouseup', () => {
          self.disableLongPress(e, self);
          preventClick = false;
          self.element.focus();
        });
      }
    });

    return this;
  }
};

export { Spinbox, COMPONENT_NAME };
