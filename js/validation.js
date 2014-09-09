/**
* Validate Plugin
*/
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module depending on jQuery.
      define(['jquery'], factory);
  } else {
      // No AMD. Register plugin with global jQuery object.
      factory(window.jQuery || window.Zepto);
  }
}(function ($) {

  // Plugin Constructor
  function Validator(element) {
    this.element = $(element);
    this.init();
  }

  // Plugin Object
  Validator.prototype = {
    init: function() {
      var fields = 'input, textarea, select';

      //If we initialize with a form find all inputs
      this.inputs = this.element.find(fields);

      //Or Just use the current input
      if (this.element.is(fields)) {
        this.inputs = $().add(this.element);
      }

      this.scrErrors = $('#scr-errors');
      if (this.scrErrors.length === 0) {
        this.scrErrors = $('<div id="scr-errors" role="alert" class="scr-only"><span id="message"></span></div>').appendTo('body');
      }
      this.timeout = null;
    },
    attachEvents: function () {
      var self = this,
        attribs = '[data-validate],[data-validation]',
        clickObj = null;

      $(document).on('mousedown.validate',function(e) {
        // The latest element clicked
        clickObj = $(e.target);
      });

      // when 'clickObj == null' on blur, we know it was not caused by a click
      // but maybe by pressing the tab key
      $(document).on('mouseup.validate', function() {
        clickObj = null;
      });

      //Attach required
      this.inputs.each(function () {
        var field = $(this),
        attr = field.attr('data-validate') || field.attr('data-validation');

        if (attr && attr.indexOf('required') > -1) {
          field.addClass('required');
        }
      });

      //Link on to the current object and perform validation.
      this.inputs.filter('input, textarea').filter(attribs).not('input[type=checkbox]').on('blur.validate change.validate', function () {
        var field = $(this);
        if ($(this).css('visibility') === 'is-hidden' || !$(this).is(':visible')) {
          return;
        }

        if (clickObj !==null && (clickObj.is('.dropdown-option') || clickObj.is('.inforTriggerButton') || clickObj.closest('.modal').length === 1)) {
          return;
        }
        self.validate(field, field.closest('.modal-engaged')? false : true);

      });

      this.inputs.filter('input[type=checkbox]').filter(attribs).on('click.validate', function () {
        self.validate($(this), true);
      });

      this.inputs.filter('select').filter(attribs).on('change.validate', function () {
        self.validate($(this), true);
      });

      //Attach to Form Submit and Validate
      if (this.element.is('form')) {

        var submitHandler = function (e) {
          e.stopPropagation();
          e.preventDefault();

          self.validateForm(function (isValid) {
            self.element.off('submit.validate');
            self.element.trigger('validated', isValid);
            self.element.data('isValid', isValid);
            self.element.on('submit.validate', submitHandler);
          });
        };

        this.element.on('submit.validate',submitHandler);
      }
    },
    validateForm: function (callback) {
      var self = this,
        deferreds = [];

      self.inputs.each(function () {
        var dfds = self.validate($(this), false);
        for (var i = 0; i < dfds.length; i++) {
          deferreds.push(dfds[i]);
        }
      });

      $.when.apply($, deferreds).then(function () {
        callback(true);
      }, function () {
        callback(false);
      });
    },
    value: function(field) {
      if (field.is('input[type=checkbox]')) {
        return field.prop('checked');
      }
      return field.val();
    },
    getTypes: function(field) {
      if (field.is('input.dropdown') && field.prev().prev('select').attr('data-validate')) {
        return field.prev().prev('select').attr('data-validate').split(' ');
      }
      if (field.is('input.dropdown') && field.prev().prev('select').attr('data-validation')) {
        return field.prev().prev('select').attr('data-validation').split(' ');
      }
      if (field.attr('data-validation')) {
        return field.attr('data-validation').split(' ');
      }
      if (!field.attr('data-validate')) {
        return true;
      }
      return field.attr('data-validate').split(' ');
    },
    validate: function (field) {
      //call the validation function inline on the element
      var self = this,
        types = self.getTypes(field),
        rule, dfd,
        dfds = [],
        errors = [],
        i,
        value = self.value(field),
        manageResult = function (result) {
          if (!result) {
            self.addError(field, rule.message);
            errors.push(rule.msg);
            dfd.reject();
          } else if (errors.length === 0) {
            self.removeError(field);
            dfd.resolve();
          }
        };

      self.removeError(field);
      field.removeData('data-errormessage');

      for (i = 0; i < types.length; i++) {
        rule = $.fn.validation.rules[types[i]];
        dfd = $.Deferred();

        if (!rule) {
          continue;
        }

        if (rule.async) {
          rule.check(value, manageResult, field);
        } else {
          manageResult(rule.check(value, field));
        }
        dfds.push(dfd);
      }

      return dfds;
    },
    getField: function(field) {
      if (field.parent().is('.inforTriggerField')) {
        field = field.parent();
      } else if (field.is('.inforListBox')) {
        field = field.next('.inforListBox');
      } else if (field.is('.inforSwapList')) {
        field = field.find('.inforSwapListRight div.inforListBox');
      } else if (field.is('select')) {
        field = field.next().next('.dropdown');
      }
      return field;
    },
    hasError: function(field) {
      return this.getField(field).hasClass('error');
    },
    addError: function(field, message) {
      var loc = this.getField(field).addClass('error'),
        icon = $('<i class="icon-error">&nbsp;</i>'),
        appendedMsg = (loc.data('data-errormessage') ? loc.data('data-errormessage') + '<br>' : '') + message;

      loc.data('data-errormessage', appendedMsg);

      if (!loc.next().is('.icon-error') && !loc.is('input[type=checkbox]')) {
        loc.after(icon);
      }

      if (!loc.next().next().is('.icon-error') && loc.is('input[type=checkbox]')) {
        loc.next('.inforCheckboxLabel').after(icon);
      }

      icon.data('field', loc);

      //Add Aria Alert
      var messages = this.scrErrors.find('#message').attr('role', 'alert');
      this.scrErrors.css('clip','auto');
      messages.html(appendedMsg);
      messages.hide().css('display','inline');

      //Append Error
      var svg = '<svg class="icon icon-error" viewBox="0 0 32 32"><use xlink:href="#icon-error"></use></svg></span>',
        span = $('<span role="alert" class="error"></span>');

      if (loc.parent('.field').find('span.error').length === 0) {
        field.parent('.field').append(span.html(appendedMsg + svg));
      } else {
        loc.parent('.field').find('span.error').html(appendedMsg + svg);
      }
    },
    removeError: function(field) {
      var loc = this.getField(field);

      this.inputs.filter('input, textarea').off('focus.validate');
      loc.removeClass('error');
      loc.removeData('data-errormessage');
      loc.next('.icon-error').remove();
      loc.next('.inforCheckboxLabel').next('.icon-error').remove();
      loc.parent('.field').find('span.error').remove();
    }
  };

  //Add a Message to a Field
  $.fn.addError = function(options) {
    var defaults = {message: ''},
      settings = $.extend({}, defaults, options);

    return this.each(function() {
      var instance = new Validator(this, settings);
      instance.addError($(this), settings.message);
    });
  };

  //Remove a Message from a Field
  $.fn.removeError = function(options) {
    var defaults = {message: ''},
      settings = $.extend({}, defaults, options);

    return this.each(function() {
      var instance = new Validator(this, settings);
      instance.removeError($(this));
    });
  };

  $.fn.validate = function(options, args) {

    // Settings and Options
    var pluginName = 'validate',
      defaults = {
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

  //The validation rules object
  var Validation = function () {
    this.rules = {
      required: {
        check: function (value) {
          if (typeof value === 'string' && $.trim(value).length === 0) {
            return false;
          }
          return (value ? true : false);
        },
        message: 'This field is required.'
      }
    };
  };

  //TODO: We will extend this with other settings like accessibility.
  //$.fn.settings = {};
  $.fn.validation = new Validation();

  $.fn.isValid = function() {
    return ($(this).data('isValid') ? true : false);
  };

  //Clear out the stuff on the Form
  $.fn.resetForm = function() {
    var formFields = $(this).find('input, select, textarea');

    //Clear Errors
    formFields.removeClass('error');
    $(this).find('.error').removeClass('error');
    $(this).find('.icon-error').remove();

    setTimeout(function () {
      $('#validation-errors').addClass('is-hidden');
    }, 300);

    //Remove Dirty
    formFields.data('isDirty', false).removeClass('isDirty');
    $(this).find('.isDirty').removeClass('isDirty');

    //reset form data
    if ($(this).is('form')) {
      $(this)[0].reset();
    }
  };

}));
