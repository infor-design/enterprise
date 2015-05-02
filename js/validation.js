/**
* Validate Plugin
*/

function Validator(element) {
  this.element = $(element);
  this.init();
}

// Plugin Object
Validator.prototype = {

  init: function() {
    this.fields = 'input, textarea, select, div[data-validate], div[data-validation]';

    //If we initialize with a form find all inputs
    this.inputs = this.element.find(this.fields);

    //Or Just use the current input
    if (this.element.is(this.fields)) {
      this.inputs = $().add(this.element);
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
    this.inputs.filter('input, textarea, div').filter(attribs).not('input[type=checkbox]').each(function () {
      var field = $(this),
      attribs = field.attr('data-validation-events'),
      events = (attribs ? attribs : 'blur.validate change.validate');

      field.on(events, function () {

        var field = $(this);
        if ($(this).css('visibility') === 'is-hidden' || !$(this).is(':visible')) {
          return;
        }

        if (clickObj !== null && clickObj.is('.dropdown-option')) {
          return;
        }

        setTimeout(function () {
          self.validate(field, field.closest('.modal-engaged').length === 1 ? false : true);
        }, 150);
      });
    });

    this.inputs.filter('input[type=checkbox]').filter(attribs).on('click.validate', function () {
      self.validate($(this), true);
    });

    this.inputs.filter('select').filter(attribs).on('change.validate', function () {
      self.validate($(this), true);
    }).on('dropdownopen.validate', function() {
      var field = $(this),
        tooltip = field.data('tooltip');
        if (tooltip && document.activeElement === field.data('dropdown').searchInput[0]) {
          tooltip.hide();
        }
    }).on('dropdownclose.validate', function() {
      var field = $(this),
        tooltip = field.data('tooltip');
        if (tooltip && document.activeElement !== field.data('dropdown').searchInput[0]) {
          tooltip.show();
        }
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

    self.inputs = this.element.find(self.fields);
    self.inputs.filter(':visible').each(function () {
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
    if (field.is('div')) { // contentEditable div (Rich Text)
      return field[0].innerHTML;
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

  validate: function (field, showTooltip) {
    //call the validation function inline on the element
    var self = this,
      types = self.getTypes(field),
      rule, dfd,
      dfds = [],
      errors = [],
      i,
      value = self.value(field),
      manageResult = function (result, showTooltip) {
        if (!result) {
          self.addError(field, rule.message, rule.inline, showTooltip);
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

      if (rule.async) { //TODO: Document Breaking Change - swapped params
        rule.check(value, field, manageResult);
      } else {
        manageResult(rule.check(value, field), showTooltip);
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

  addError: function(field, message, inline, showTooltip) {
    var loc = this.getField(field).addClass('error'),
       appendedMsg = (loc.data('data-errormessage') ? loc.data('data-errormessage') + '<br>' : '') + message;

    loc.data('data-errormessage', appendedMsg);

    //Add Aria Alert
    if ($.fn.toast !== undefined) {
      $('body').toast({title: Locale.translate('Error'), audibleOnly: true, message: appendedMsg});
    }

    //Append Error
    var svg = $('<svg class="icon icon-error" focusable="false" aria-hidden="true"><use xlink:href="#icon-error"></use></svg>');

    if (loc.parent('.field').find('svg.icon-error').length === 0) {

      if (field.is('textarea')) {
        field.after(svg);
      } else {
        field.parent('.field').append(svg);
      }
    }

    //setup tooltip with appendedMsg
    if (inline) {
      field.attr('data-placeholder', field.attr('placeholder'));
      field.attr('placeholder', appendedMsg);
      return;
    }

    // Build Tooltip
    if (!field.data('tooltip')) {
      field.tooltip({
        content: message,
        placement: 'offset',
        trigger: 'focus',
        isError: true,
        tooltipElement: '#validation-tooltip'
      });
    } else {
      field.data('tooltip').content = message;
    }

    field.on('focus.validate', function() {
     field.data('tooltip').show();
    }).on('blur.validate', function() {
      if (field.data('tooltip')) {
        field.data('tooltip').hide();
      }
    });

    svg.on('click.validate', function() {
      field.data('tooltip').show();
    });

    if (showTooltip) {
      field.data('tooltip').show();
    }
  },

  removeError: function(field) {
    var loc = this.getField(field);

    this.inputs.filter('input, textarea').off('focus.validate');
    field.removeClass('error');
    field.removeData('data-errormessage');

    field.next('.icon-error').off('click.validate').remove();
    if (field.hasClass('dropdown') || field.hasClass('multiselect')) {
      field.next().next().removeClass('error') // #shdo
        .next().next().off('click.validate').remove(); // SVG Error Icon
    }
    field.next().next('.icon-error').remove();
    field.next('.inforCheckboxLabel').next('.icon-error').remove();
    field.parent('.field').find('span.error').remove();
    field.off('focus.validate focus.tooltip');
    if (field.data('tooltip')) {
      field.data('tooltip').destroy();
    }
    if (field.attr('aria-describedby') === 'validation-tooltip') {
      field.removeAttr('aria-describedby');
      $('#validation-tooltip').remove();
    }

    if (loc.attr('data-placeholder')) {
      loc.attr('placeholder',loc.attr('data-placeholder'));
      loc.removeAttr('data-placeholder');
    }
  }
};

//Add a Message to a Field
$.fn.addError = function(options) {
  var defaults = {message: ''},
    settings = $.extend({}, defaults, options);

  return this.each(function() {
    var instance = new Validator(this, settings);
    instance.addError($(this), settings.message, settings.inline);
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
        this.message = Locale.translate('Required');
        if (typeof value === 'string') {
          // strip out any HTML tags and focus only on text content.
          value = $.trim(value.replace(/<\/?[^>]*>/g, ''));
          if ($.trim(value).length === 0) {
            return false;
          }
          return true;
        }
        return (value ? true : false);
      },
      inline: true,
      message: 'Required'
    },
    date: {
      check: function(value) {
        this.message = Locale.translate('InvalidDate');
        value = value.replace(/ /g, '');
        var dateFormat = Locale.calendar().dateFormat.short,
        parsedDate = Locale.parseDate(value);

        if (parsedDate === undefined && dateFormat) {
          parsedDate = Locale.parseDate(value, dateFormat);
        }

        if (parsedDate === undefined && value !== '') {
          return false;
        }

        return true;
      },
      message: 'Invalid Date'
    },
    time: {
      check: function(value, field) {
        value = value.replace(/ /g, '');
        var pattern = field && field.attr('data-time-format') !== undefined ? field.attr('data-time-format') : Locale.calendar().timeFormat,
          is24Hour = (pattern.match('HH') || []).length > 0,
          maxHours = is24Hour ? 24 : 12,
          colon = value.indexOf(':'),
          valueHours = 0,
          valueMins,
          valueM;

        if (value === '') {
          return true;
        }

        valueHours = parseInt(value.substring(0, colon));
        valueMins = parseInt(value.substring(colon + 1, colon + 3));

        if (valueHours.toString().length < 1 || isNaN(valueHours) || parseInt(valueHours) < 0 || parseInt(valueHours) > maxHours) {
          return false;
        }
        if (valueMins.toString().length < 1 || isNaN(valueMins) || parseInt(valueMins) < 0 || parseInt(valueMins) > 59) {
          return false;
        }

        // AM/PM
        if (!is24Hour) {
          if (parseInt(valueHours) < 1) {
            return false;
          }
          var period0 = new RegExp(Locale.calendar().dayPeriods[0], 'i'),
            period1 = new RegExp(Locale.calendar().dayPeriods[1], 'i');

          valueM = value.match(period0) || value.match(period1) || [];
          if (valueM.length === 0) {
            return false;
          }
        }

        return true;
      },
      message: 'Invalid Time'
    }
  };
};

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
