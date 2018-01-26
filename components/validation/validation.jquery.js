import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Validation } from './validation';
import { Validator, COMPONENT_NAME as VALIDATOR_COMPONENT_NAME } from './validator';

// Component Name
const VALIDATE_COMPONENT_NAME = 'validate';

// Settings specific to error messages.
// Used for backwards compatibility.
const ERROR_MESSAGE_DEFAULTS = {
  type: 'error'
};

/**
 * jQuery Component Wrapper for the Validation Component
 */
$.fn.validation = Validation;

/**
 * Returns the specific type message data object for a Field
 * @param {object} [settings] incoming settings
 * @returns {object} error message data
 */
$.fn.getMessage = function (settings) {
  const dataAttr = `data-${settings.type}message`;

  return this.each(function () {
    let instance = $.data(this, VALIDATOR_COMPONENT_NAME);
    if (!instance) {
      instance = $.data(this, VALIDATOR_COMPONENT_NAME, new Validator(this, settings));
    }
    return instance.getField($(this)).data(dataAttr);
  });
};

/**
 * Returns the errormessage data object for a Field
 * @deprecated as of v4.4.0
 * @param {object} [settings] incoming settings
 * @returns {object} error message data
 */
$.fn.getErrorMessage = function (settings) {
  settings = utils.extend({}, settings, ERROR_MESSAGE_DEFAULTS);
  return this.each(function () {
    $(this).getMessage(settings);
  });
};

/**
 * ScrollIntoView and sets focus on an element
 * @param {boolean} [alignToTop] true (default) element will be aligned to the
 *  top of the visible area of the scrollable ancestor
 * @param {object} [settings] incoming settings
 */
$.fn.scrollIntoView = function (alignToTop, settings) {
  if (typeof alignToTop !== 'boolean') {
    alignToTop = undefined;
  }

  const instance = new Validator(this, settings);
  const elem = instance.getField($(this));
  elem[0].scrollIntoView(alignToTop);
  elem.focus();
};

/**
 * Add a Message to a Field
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements receiving errors
 */
$.fn.addMessage = function (settings) {
  return this.each(function () {
    let instance = $.data(this, VALIDATOR_COMPONENT_NAME);
    if (!instance) {
      instance = $.data(this, VALIDATOR_COMPONENT_NAME, new Validator(this, settings));
    }

    instance.addMessage(
      $(this),
      settings.message,
      settings.type,
      settings.inline,
      settings.showTooltip,
      settings.isAlert
    );
  });
};

/**
 * Add an error Message to a Field
 * @deprecated as of v4.4.0
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements receiving errors
 */
$.fn.addError = function (settings) {
  settings = utils.extend({}, settings, ERROR_MESSAGE_DEFAULTS);
  return this.each(function () {
    $(this).addMessage(settings);
  });
};

/**
 * Remove a Message from a Field
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements having errors removed
 */
$.fn.removeMessage = function (settings) {
  return this.each(function () {
    let instance = $.data(this, VALIDATOR_COMPONENT_NAME);
    if (!instance) {
      instance = $.data(this, VALIDATOR_COMPONENT_NAME, new Validator(this, settings));
    }

    const field = $(this);
    instance.removeMessage(field, settings.type);
    instance.setIconOnParent(field, settings.type);

    $.removeData(this, VALIDATOR_COMPONENT_NAME);
  });
};

/**
 * Remove an error Message from a Field
 * @deprecated as of v4.4.0
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements having errors removed
 */
$.fn.removeError = function (settings) {
  settings = utils.extend({}, settings, ERROR_MESSAGE_DEFAULTS);
  return this.each(function () {
    return $(this).removeMessage(settings);
  });
};

/**
 * The Actual Validate Component
 * @param {object|string} [settings] incoming settings, or an API method name
 * @param {object} args that can be passed to an API method, if called via string settings
 * @returns {jQuery[]} components being acted on
 */
$.fn.validate = function (settings, args) {
  const settingsAreAPIFunction = typeof settings === 'string';

  return this.each(function () {
    let instance = $.data(this, VALIDATE_COMPONENT_NAME);
    if (instance) {
      // If settings are a string, assume the string is a function on the instance API
      // that needs to be called, and attempt to call it.
      if (settingsAreAPIFunction) {
        if (typeof instance[settings] === 'function') {
          instance[settings](args);
        } else {
          debug.log('warn', `No method with name "${settings}" found on "${VALIDATE_COMPONENT_NAME}" component API.`);
        }
        return;
      }

      // Settings are object-based, and can be handled normally
      instance.updated(settings);
    } else {
      instance = $.data(this, VALIDATE_COMPONENT_NAME, new Validator(this, settings));
    }
  });
};
