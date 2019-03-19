import * as debug from '../../utils/debug';
import { warnAboutDeprecation } from '../../utils/deprecated';
import { utils } from '../../utils/utils';
import { Validation } from './validation';
import { Validator, COMPONENT_NAME as VALIDATOR_COMPONENT_NAME } from './validator';

// Component Name
const VALIDATE_COMPONENT_NAME = 'validate';

// Settings specific to error messages.
// Used for backwards compatibility.
const ERROR_MESSAGE_DEFAULTS = {
  type: 'error',
  inline: true
};

/**
 * jQuery Component Wrapper for the Validation Component
 */
$.fn.validation = Validation;

/**
 * Returns the specific type message data object for a Field
 * @param {object} [settings] incoming settings
 * @returns {string} messages as a string for the specific type
 */
$.fn.getMessage = function (settings) {
  if (!settings) {
    settings = { type: 'error' };
  }
  const dataAttr = `${settings.type}message`;
  const messages = $.fn.getField($(this)).data(dataAttr);
  let strMessages = '';

  if (messages) {
    if (messages.length === 1) {
      return messages[0].message;
    }

    for (let i = 0; i < messages.length; i++) {
      strMessages += `\u2022 ${messages[i].message}`;
    }
  }

  return strMessages;
};

/**
 * Returns all messages on an object as an array.
 * @param {object} [settings] incoming settings
 * @returns {array} message data for the specific type
 */
$.fn.getMessages = function (settings) {
  if (!settings) {
    settings = { type: 'error' };
  }
  const dataAttr = `${settings.type}message`;

  let messages = $.fn.getField($(this)).data(dataAttr);
  if (!messages) {
    messages = [];
  }
  return messages;
};

/**
 * Retrive the actionble element that should have an error class/icon appended to it.
 * @private
 * @param {jQuery[]} field the field being checked
 * @returns {jQuery[]} the field to be checked
 */
$.fn.getField = function (field) {
  if (field.is('select') && field.data('dropdown') !== undefined) {
    field = field.data('dropdown').pseudoElem;
  }
  return field;
};

/**
 * Returns the errormessage data object for a Field.
 * This method is slated to be removed in a future v4.10.0 or v5.0.0.
 * @deprecated as of v4.4.0.  Please use `$.fn.getMessage()` instead.
 * @param {object} [settings] incoming settings
 * @returns {object} error message data
 */
$.fn.getErrorMessage = function (settings) {
  warnAboutDeprecation('$.fn.getMessage', '$.fn.getErrorMessage');
  settings = utils.extend({}, settings, ERROR_MESSAGE_DEFAULTS);
  return $(this).getMessage(settings);
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
 * @returns {jQuery[]} elements receiving messages
 */
$.fn.addMessage = function (settings) {
  return this.each(function () {
    let instance = $.data(this, VALIDATOR_COMPONENT_NAME);
    if (!instance) {
      instance = $.data(this, VALIDATOR_COMPONENT_NAME, new Validator(this, settings));
    }

    const rule = {
      message: settings.message,
      type: settings.type,
      triggerEvents: settings.triggerEvents,
      icon: settings.icon,
      id: settings.id || settings.message,
    };

    instance.addMessage(
      $(this),
      rule,
      settings.inline,
      settings.showTooltip
    );
  });
};

/**
 * Add an error Message to a Field.
 * This method is slated to be removed in a future v4.10.0 or v5.0.0.
 * @deprecated as of v4.4.0.  Please use `$.fn.addMessage()` instead.
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements receiving errors
 */
$.fn.addError = function (settings) {
  warnAboutDeprecation('$.fn.addMessage', '$.fn.addError');
  let inline = true;
  if (typeof settings.inline === 'boolean' && settings.inline === false) {
    inline = false;
  }
  settings = utils.extend({}, settings, ERROR_MESSAGE_DEFAULTS);
  settings.inline = inline;
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
  if (!settings) {
    settings = { type: 'error' };
  }

  return this.each(function () {
    let instance = $.data(this, VALIDATOR_COMPONENT_NAME);
    if (!instance) {
      instance = $.data(this, VALIDATOR_COMPONENT_NAME, new Validator(this, settings));
    }

    const field = $(this);
    const dataAttr = `${settings.type}message`;
    const errors = $.fn.getField(field).data(dataAttr);
    if (!errors) {
      return;
    }

    for (let i = 0; i < errors.length; i++) {
      instance.removeMessage(field, errors[i], settings.triggerEvents);
    }
    instance.setIconOnParent(field, settings.type);

    $.removeData(this, VALIDATOR_COMPONENT_NAME);
  });
};

/**
 * Remove an error Message from a Field.
 * This method is slated to be removed in a future v4.10.0 or v5.0.0.
 * @deprecated as of v4.4.0.  Please use `$.fn.removeMessage()` instead.
 * @param {object} [settings] incoming settings
 * @returns {jQuery[]} elements having errors removed
 */
$.fn.removeError = function (settings) {
  warnAboutDeprecation('$.fn.removeMessage', '$.fn.removeError');
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
    if (instance && typeof instance !== 'string') {
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
