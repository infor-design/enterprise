import { Validation } from './validation';
import { Validator } from './validator';


/**
 * jQuery Component Wrapper for the Validation Component
 */
$.fn.validation = Validation;


/**
 * Returns the errormessage data object for a Field
 *
 * @param options (object) optional
 */
$.fn.getErrorMessage = function(options) {
  var defaults = { },
    settings = $.extend({}, defaults, options);

  var instance = new Validator(this, settings);
  return instance.getField($(this)).data('data-errormessage');
};


/**
 * Returns the specific type message data object for a Field
 *
 * @param options (object) optional
 */
$.fn.getMessage = function(options) {
  var defaults = {type: 'error'},
    settings = $.extend({}, defaults, options);

  var instance = new Validator(this, settings);
  return instance.getField($(this)).data('data-' + settings.type + 'message');
};


/**
 * ScrollIntoView and sets focus on an element
 *
 * @param alignToTop (boolean) optional - true (default) element will be aligned to the top of the visible area of the scrollable ancestor
 * @param options (object) optional
 */
$.fn.scrollIntoView = function(alignToTop, options) {
  if (typeof alignToTop !== 'boolean') {
    alignToTop = undefined;
  }
  var defaults = { },
    settings = $.extend({}, defaults, options);

  var instance = new Validator(this, settings);
  var elem = instance.getField($(this));
  elem[0].scrollIntoView(alignToTop);
  elem.focus();
};


/**
 * Add a Message to a Field
 */
$.fn.addMessage = function(options) {
  var defaults = {message: '', type: 'error', showTooltip: false, inline: true, isAlert: false},
    settings = $.extend({}, defaults, options);

  return this.each(function() {
    var instance = new Validator(this, settings);
    instance.addMessage($(this), settings.message, settings.type, settings.inline, settings.showTooltip, settings.isAlert);
  });
};


/**
 * Add an error Message to a Field
 */
$.fn.addError = function(options) {
  var defaults = {message: '', showTooltip: false, inline: true},
    settings = $.extend({}, defaults, options);

  return this.each(function() {
    var instance = new Validator(this, settings);
    instance.addMessage($(this), settings.message, 'error', settings.inline, settings.showTooltip);
  });
};


/**
 * Remove a Message from a Field
 */
$.fn.removeMessage = function(options) {
  var defaults = {message: '', type: 'error'},
    settings = $.extend({}, defaults, options);

  return this.each(function() {
    var instance = new Validator(this, settings);
    instance.removeMessage($(this), settings.type);
  });
};


/**
 * Remove an error Message from a Field
 */
$.fn.removeError = function(options) {
  var defaults = {message: ''},
    settings = $.extend({}, defaults, options);

  return this.each(function() {
    var instance = new Validator(this, settings),
      field = $(this);

    instance.removeMessage(field, 'error');
    instance.setIconOnParent(field, 'error');
  });
};


/**
 * The Actual Validate Component
 */
$.fn.validate = function(options, args) {
  // Settings and Options
  var pluginName = 'validate',
    defaults = {
      inline: true
    },
    settings = $.extend({}, defaults, options);

  // Initializing the Control Once or Call Methods.
  return this.each(function() {
    var instance = $.data(this, pluginName);

    if (instance) {
      if (typeof instance[options] === 'function') {
        instance[options](args);
      }
      instance.settings = $.extend({}, defaults, options);
    } else {
      instance = $.data(this, pluginName, new Validator(this, settings));
      instance.attachEvents();
    }
  });
};
