/* start-amd-strip-block */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
/* end-amd-strip-block */

  /**
   * @class Validator
   * @constructor
   * @param {Object} element
   */
  function Validator(element) {
    this.element = $(element);
    Soho.logTimeStart('Validator');
    this.init();
    Soho.logTimeEnd('Validator');
  }

  // Plugin Object
  Validator.prototype = {

    /**
     * @private
     * @returns {undefined}
     */
    init: function() {
      this.fields = 'input, textarea, select, div[data-validate], div[data-validation]';
      this.isPlaceholderSupport = !!('placeholder' in document.createElement('input'));//placeholder native support is-exists

      //If we initialize with a form find all inputs
      this.inputs = this.element.find(this.fields);

      //Or Just use the current input
      if (this.element.is(this.fields)) {
        this.inputs = $().add(this.element);
      }

      this.timeout = null;
    },

    /**
     * Gets a list of events
     * @private
     */
    extractEvents: function (events) {
      if (events.indexOf('{') > -1) {
        events = JSON.parse(events.replace(/'/g, '"'));
      }

      if (typeof events === 'object') {
        var e = '';
        for (var k in events) {
          if (e.indexOf(events[k]) === -1) {
            e += events[k] +' ';
          }
        }
        e = e.split(' ').join('.validate ');
        events = e;
      }

      return events;
    },

    /**
     * @private
     */
    filterValidations: function (events, type) {
      var validations = [];

      if (!events) {
        return [];
      }

      if (events.indexOf('{') > -1) {
        events = JSON.parse(events.replace(/'/g, '"'));
      }

      if(typeof events === 'object') {
        for (var k in events) {
          if (type && events[k].indexOf(type) > -1) {
            validations.push(k);
          }
        }
      }

      return validations;
    },

    /**
     * @private
     */
    attachEvents: function () {
      var self = this,
        attribs = '[data-validate],[data-validation]';

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
        events = (attribs ? attribs : 'blur.validate change.validate keyup.validate');

        if (field.is('[readonly]') && !field.parent().is('.field-fileupload')) {
          return;
        }

        events = self.extractEvents(events);

        field.on(events, function (e) {

          //Skip on Tab
          if (e.type === 'keyup' && e.keyCode === 9) {
            return;
          }

          var field = $(this);
          setTimeout(function () {
            if (field.attr('data-disable-validation') === 'true' || field.hasClass('disable-validation') || field[0].style.visibility === 'is-hidden' || !field.is(':visible')) {
              return;
            }

            if (field.closest('.modal-engaged').length && !field.closest('.modal-body').length) {
              return;
            }

            self.validate(field, true, e);
          }, 300);
        });
      });

      this.inputs.filter('input[type=checkbox]').filter(attribs).on('click.validate', function (e) {
        self.validate($(this), true, e);
      });

      this.inputs.filter(':radio').on('click.validate', function (e) {
        self.validate($(this), true, e);
      });

      var selects = this.inputs.filter('select').filter(attribs);

      if (selects.length) {
        selects.on('change.validate', function (e) {
          self.validate($(this), true, e);
        }).on('listopened.validate', function() {
          var field = $(this),
            tooltip = field.data('tooltip');

          field.next('.dropdown-wrapper').next('.error-message').hide();
          if (tooltip && document.activeElement === field.data('dropdown').searchInput[0]) {
            tooltip.hide();
          }
          $('#validation-tooltip').hide();

        }).on('listclosed.validate', function() {
          var field = $(this),
            tooltip = field.data('tooltip');

          field.next('.dropdown-wrapper').next('.error-message').show();
          if (tooltip && document.activeElement !== field.data('dropdown').searchInput[0]) {
            tooltip.show();
          }
        });

        selects.filter(function() {
          return $(this).data('dropdown') !== undefined;
        }).data('dropdown').pseudoElem.on('blur.validate', function(e) {
          var select = $(this).closest('.field, .field-short').find('select');
          self.validate(select, true, e);
        });
      }

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

        this.element.on('submit.validate', submitHandler);
      }

    },

    /**
     * @private
     */
    validateForm: function (callback) {
      var self = this,
        deferreds = [];

      self.inputs = this.element.find(self.fields);
      self.inputs.each(function (e) {
        var field = $(this);
        if (field.attr('data-validate')) {

          if (field.attr('data-disable-validation') === 'true' || field.hasClass('disable-validation')) {
            return true;
          }

          var dfds = self.validate(field, false, e);
          for (var i = 0; i < dfds.length; i++) {
            deferreds.push(dfds[i]);
          }
        }

      });

      $.when.apply($, deferreds).then(function () {
        callback(true);
      }, function () {
        callback(false);
      });
    },

    /**
     * Set disable/enable primary button in modal
     * @private
     */
    setModalPrimaryBtn: function(field, modalBtn, isValid) {
      var modal = field.closest('.modal'),
        modalFields = modal.find('[data-validate]:visible, select[data-validate], :checkbox[data-validate]'),
        allValid = true;

      if (modalFields.length > 0) {
        modalFields.each(function () {
          var modalField = $(this);
          modalField.data('isValid', isValid);
          if (modalField.closest('.datagrid-filter-wrapper').length > 0) {
            return;
          }
          var isVisible = modalField[0].offsetParent !== null;
          if (modalField.is('.required')) {
            if ((isVisible || modalField.is('select, :checkbox'))  && !modalField.val()) {
              allValid = false;
            }
          } else {
            if ((isVisible  || modalField.is('select, :checkbox')) && !modalField.isValid()) {
              allValid = false;
            }
          }
        });
      }

      if (allValid) {
        modalBtn.removeAttr('disabled');
      } else {
        modalBtn.attr('disabled', 'disabled');
      }
    },

    /**
     * Gets the current value of a field
     * @private
     * @param {jQuery[]} field
     * @returns {?}
     */
    value: function(field) {
      if (field.is('input[type=checkbox]')) {
        return field.prop('checked');
      }
      if (field.is('div')) { // contentEditable div (Rich Text)
        return field[0].innerHTML;
      }
      return field.val();
    },

    /**
     *
     * @private
     * @param {jQuery[]}
     * @param {jQuery.Event} e
     * @returns {Array}
     */
    getTypes: function(field, e) {
      var filters = this.filterValidations(field.attr('data-validation-events'), e.type),
        validations;

      if (field.is('input.dropdown') && field.prev().prev('select').attr('data-validate')) {
        validations = field.prev().prev('select').attr('data-validate').split(' ');
      } else if (field.is('input.dropdown') && field.prev().prev('select').attr('data-validation')) {
        validations = field.prev().prev('select').attr('data-validation').split(' ');
      } else if (field.attr('data-validation')) {
        validations = field.attr('data-validation').split(' ');
      } else if (field.attr('data-validate')) {
        validations = field.attr('data-validate').split(' ');
      } else {
        validations = [];
      }

      //Filter out not needed events
      if (filters.length > 0) {
        validations = validations.filter(function(n) {
          return filters.indexOf(n) !== -1;
        });
      }

      //Filter out specific events that should not use keyup
      if (e.type === 'keyup') {
        validations = validations.filter(function(n) {
          return n !== 'date' && n !== 'time';
        });
      }

      return validations;
    },

    /**
     * Set Error icon on parent tabs/expandable
     * @private
     * @param {jQuery[]} field
     * @returns {undefined}
     */
    setErrorOnParent: function (field) {
      var errorIcon = $.createIcon({ classes: ['icon-error'], icon: 'error' }),
        parent = field.closest('.tab-panel, .expandable-pane'),
        parentContainer = field.closest('.tab-container, .tab-panel-container, .expandable-area'),
        iconTarget = parent.attr('id'),
        iconContainer,
        dropdown,
        dropdownParent,
        menuitem;

      //Tabs
      if (parentContainer.is('.tab-panel-container')) {
        parentContainer = parentContainer.prev('.tab-container');
      }
      if (parentContainer.is('.tab-container')) {
        //Default Tabs
        iconContainer = $('.tab-list a[href="#'+ iconTarget +'"]', parentContainer).closest('.tab');

        //Tabs with Counts
        if (iconContainer.length) {
          if ($('.count', iconContainer).length) {
            iconContainer = $('.count', iconContainer);
          }
        }
        //Dropdown Tabs(with popupmenu)
        else {
          iconTarget = $('a[href="#'+ iconTarget +'"]', '.popupmenu').closest('.popupmenu').attr('id');
          iconContainer = $('.tab-list .tab[aria-controls="'+ iconTarget +'"]', parentContainer);
          dropdown = iconTarget;
        }
      }

      //Expandable
      else if (parentContainer.is('.expandable-area')) {
        iconContainer = $('.expandable-header[aria-controls="'+ iconTarget +'"] .title', parentContainer);
      }

      //No action
      else {
        return;
      }

      //if Dropdown Tabs set each menu item to check
      if (dropdown && dropdown.length) {
        dropdownParent = parent.add($($(dropdown).attr('href')));
        $('a[role="menuitem"]', '#'+ dropdown).each (function () {
          dropdownParent = dropdownParent.add($($(this).attr('href')));
        });
      }
      menuitem = $('a[href="#'+ parent.attr('id') +'"]', '#'+ iconTarget);

      //Add Error icon
      if ((!!parent && $('.error', parent).length) ||
          (!!dropdownParent && $('.error', dropdownParent).length)) {

        //if Dropdown Tabs and current menu item has no error remove icon
        if (!$('.error', parent).length) {
          menuitem.removeClass('is-error');
          $('.icon-error', menuitem).remove();
        }

        //if Dropdown Tabs and current menu item has error add icon
        if ($('.error', parent).length &&
            $('.error', dropdownParent).length &&
            !$('.icon-error', menuitem).length) {
            menuitem.addClass('is-error').append(errorIcon);
        }

        //Add icon to main tab area
        if (!($('.icon-error', iconContainer).length)) {
          iconContainer.addClass('is-error').append(errorIcon);
        }
      }

      //Remove Error icon
      else {
        iconContainer = iconContainer.add(menuitem);
        iconContainer.removeClass('is-error');
        $('.icon-error', iconContainer).remove();
      }
    },

    /**
     *
     * @private
     * @param {jQuery[]} field
     * @param {boolean} showTooltip
     * @param {jQuery.Event} e
     */
    validate: function (field, showTooltip, e) {
      //call the validation function inline on the element
      var self = this,
        types = self.getTypes(field, e) || [],
        rule, dfd,
        dfds = [],
        errors = [],
        i, l,
        value = self.value(field),
        placeholder = field.attr('placeholder'),

        manageResult = function (result, showTooltip) {
          // Only remove if "false", not any other value ie.. undefined
          if (rule.positive === false) {
            self.removePositive(field);
          }

          if (!result) {
            if (!self.isPlaceholderSupport && (value === placeholder) &&
               (rule.message !== Locale.translate('Required'))) {
              return;
            }

            self.addError(field, rule.message, field.attr('data-error-type') === 'tooltip' ? false: true, showTooltip);
            errors.push(rule.msg);
            dfd.reject();
          }   else if (errors.length === 0) {
            self.removeError(field);
            dfd.resolve();

            if (rule.positive) {
              // FIX: In Contextual Action Panel control not sure why but need to add error,
              // otherwise "icon-confirm" get misaligned,
              // so for this fix adding and then removing error here
              self.addError(field, rule.message, rule.inline, showTooltip);
              self.removeError(field);
              dfd.resolve();

              self.addPositive(field);
            }
          }

          self.setErrorOnParent(field);
          field.triggerHandler('isvalid', [result]);

        };

      self.removeError(field);
      field.removeData('data-errormessage');

      for (i = 0, l = types.length; i < l; i++) {
        rule = $.fn.validation.rules[types[i]];
        dfd = $.Deferred();

        if (!rule) {
          continue;
        }

        if ($('#calendar-popup').is(':visible')) {
          continue; //dont show validation message while selecting
        }

        if (rule.async) {
          rule.check(value, field, manageResult);
        } else {
          manageResult(rule.check(value, field), showTooltip);
        }
        dfds.push(dfd);
      }

      return dfds;
    },

    /**
     * Retrive the actionble element that should have an error class/icon appended to it.
     * @private
     * @param {jQuery[]} field
     * @returns {jQuery[]}
     */
    getField: function(field) {
      if (field.is('select') && field.data('dropdown') !== undefined) {
        field = field.data('dropdown').pseudoElem;
      }
      return field;
    },

    /**
     * Returns true if the given object has an error
     *
     * @param {jQuery[]} field
     * @returns {boolean}
     */
    hasError: function(field) {
      return this.getField(field).hasClass('error');
    },

    /**
     * Adds an error message/icon to a form field.
     *
     * @param {jQuery[]} field
     * @param {String} message
     * @param {boolean} inline
     * @param {boolean} showTooltip
     */
    addError: function(field, message, inline, showTooltip) {
      var loc = this.getField(field).addClass('error'),
         dataMsg = loc.data('data-errormessage'),
         appendedMsg = message;

      if (dataMsg) {
        appendedMsg = (/^\u2022/.test(dataMsg)) ? '' : '\u2022 ';
        appendedMsg += dataMsg + '<br>\u2022 ' + message;
      }

      loc.data('data-errormessage', appendedMsg);

      //Add Aria Alert
      if ($.fn.toast !== undefined) {
        $('body').toast({title: Locale.translate('Error'), audibleOnly: true, message: appendedMsg});
      }

      if (!inline) {
        this.showTooltipError(field, appendedMsg, showTooltip);
        return;
      }

      // Disable primary button in modal
      var modalBtn = field.closest('.modal').find('.btn-modal-primary').not('.no-validation');
      if (modalBtn.length) {
        this.setModalPrimaryBtn(field, modalBtn, false);
      }

      this.showInlineError(field, message);
    },

    /**
     * Shows an error icon
     *
     * @private
     * @param {jQuery[]} field
     * @returns {jQuery[]}
     */
    showErrorIcon: function(field) {
      var loc = this.getField(field).addClass('error'),
        svg = $.createIconElement({ classes: ['icon-error'], icon: 'error' });

      if (loc.parent('.field, .field-short').find('svg.icon-error').length === 0) {

        if (field.parent().is('.editor-container')) {
          field.parent().addClass('is-error');
        }

        if (field.parent(':not(.editor-container)').find('.btn-actions').length ===1) {
          field.parent().find('.btn-actions').before(svg);
        } else if (field.parent().find('.data-description').length ===1) {
          field.parent().find('.data-description').before(svg);
        } else if (field.parent().find('.field-info').length ===1) {
          field.parent().find('.field-info').before(svg);
        } else if (field.is('textarea')) {
          field.after(svg);
        } else if (field.is('.dropdown, .multiselect')) {
          field.parent().find('.dropdown-wrapper').append(svg);
        } else if (field.is('.spinbox')) {
          field.parent().append(svg);
        } else if (field.is('.lookup')) {
          field.parent().append(svg);
        } else {
          field.parent().append(svg);
        }

        $('.icon-confirm', loc.parent('.field, .field-short')).remove();
      } else {
        svg = loc.parent('.field, .field-short').find('svg.icon-error');
      }

      return svg;
    },

    /**
     * Shows an tooltip error
     *
     * @private
     * @param {jQuery[]} field
     * @param {string} message
     * @param {boolean} showTooltip
     */
    showTooltipError: function(field, message, showTooltip) {
      if (field.is(':radio')) {
        return;
      }

      var icon = this.showErrorIcon(field);
      var representationField = field;

      //Add error classes to pseudo-markup for certain controls
      if (field.is('.dropdown, .multiselect') && field.data('dropdown') !== undefined) {
        var input = field.data('dropdown').pseudoElem;
        representationField = input;
        input.addClass('error');
      }

      var tooltipAPI = icon.data('tooltip');

      // Error tooltips should be positioned on the 'x' so that they sit directly underneath the fields
      // that they are indicating.
      function tooltipPositionCallback(placementObj) {
        var fieldRect = representationField[0].getBoundingClientRect(),
          elRect = tooltipAPI.tooltip[0].getBoundingClientRect(),
          rtl = $('html').is('[dir="rtl"]'),
          currX = placementObj.x,
          xAdjustment = 0;

        if (rtl) {
          if (elRect.left < fieldRect.left) {
            xAdjustment += (fieldRect.left - elRect.left);
          }
        } else {
          if (elRect.right > fieldRect.right) {
            xAdjustment += (elRect.right - fieldRect.right) * -1;
          }
        }

        placementObj.setCoordinate('x', currX + xAdjustment);
        if (!placementObj.nudges) {
          placementObj.nudges = {};
        }
        placementObj.nudges.x = xAdjustment;

        return placementObj;
      }

      // Build Tooltip
      if (!tooltipAPI) {
        icon.tooltip({
          content: message,
          placement: 'bottom',
          placementOpts: {
            callback: tooltipPositionCallback
          },
          trigger: 'focus',
          isError: true,
          tooltipElement: '#validation-tooltip'
        });
        tooltipAPI = icon.data('tooltip');
      } else {
        tooltipAPI.content = message;
      }

      field.on('focus.validate', function() {
        if (!tooltipAPI) { return; }
        tooltipAPI.show();
      }).on('blur.validate', function() {
        if (!tooltipAPI) { return; }
        tooltipAPI.hide();
      });

      if (showTooltip && tooltipAPI) {
        tooltipAPI.show();
      }
    },

    /**
     * Shows an tooltip error
     *
     * @private
     * @param {jQuery[]} field
     * @param {string} message
     * @param {HTMLElement} markup
     * @param {boolean} isShow
     */
    toggleRadioError:  function (field, message, markup, isShow) {
      var all, loc,
        name = field.attr('name');

      if (name && name.length) {
        all = $(':radio[name="'+ name +'"], :radio[name="'+ name +'"] + label');
        loc = field.parent().is('.inline') ?
          $(':radio[name="'+ name +'"]:last').parent() :
          $(':radio[name="'+ name +'"]:last + label');

        if (isShow) {
          all.addClass('error');
          $(markup).addClass('radio-group-error').insertAfter(loc);
        }
        else {
          all.removeClass('error');
          loc.next('.radio-group-error').remove();
        }
      }
    },

    /**
     * Shows an inline error message on a field
     * @private
     *
     * @param {jQuery[]} field
     * @param {string} message
     */
    showInlineError: function (field, message) {
      var loc = this.getField(field).addClass('error'),
        markup = '<div class="error-message">' +
          $.createIcon({ classes: ['icon-error'], icon: 'error' }) +
          '<pre class="audible">'+ Locale.translate('Error') +'</pre>' +
          '<p class="message-text">' + message +'</p>' +
          '</div>';

      if (field.is(':radio')) { // Radio button handler
        this.toggleRadioError(field, message, markup, true);
      } else { // All other components
        loc.closest('.field, .field-short').find('.formatter-toolbar').addClass('error');
        loc.closest('.field, .field-short').append(markup);
      }

      //Remove positive errors
      field.parent().find('.icon-confirm').remove();

      // Trigger an event
      field.trigger('error', {field: field, message: message});
      field.closest('form').trigger('error', {field: field, message: message});
    },

    /**
     * Shows an inline error message on a field
     *
     * @private
     * @param {jQuery[]} field
     */
    addPositive: function(field) {
      var svg = $.createIcon({ icon: 'confirm', classes: 'icon-confirm'});

      if (!$('.icon-confirm', field.parent('.field, .field-short')).length) {
        field.parent('.field, .field-short').append(svg);
      }
    },

    /**
     * Shows an inline error message on a field
     *
     * @private
     * @param {jQuery[]} field
     */
    removeError: function(field) {
      var loc = this.getField(field),
        isRadio = field.is(':radio'),
        hasTooltip = field.attr('data-error-type');

      this.inputs.filter('input, textarea').off('focus.validate');
      field.removeClass('error');
      field.removeData('data-errormessage');

      if (hasTooltip) {
        var tooltipAPI = field.find('.icon.error').data('tooltip');

        if (tooltipAPI) {
          tooltipAPI.destroy();
        }
        if (field.attr('aria-describedby') === 'validation-tooltip') {
          field.removeAttr('aria-describedby');
          $('#validation-tooltip').remove();
        }
      }

      if (isRadio) {
        this.toggleRadioError(field);
      }
      else {
        field.next('.icon-error').off('click.validate').remove();
      }

      if (field.hasClass('dropdown') || field.hasClass('multiselect')) {
        field.next().next().removeClass('error'); // #shdo
        field.next().find('div.dropdown').removeClass('error').removeData('data-errormessage');
        field.parent().find('.dropdown-wrapper > .icon-error').off('click.validate').remove(); // SVG Error Icon
      }

      if (!isRadio) {
        field.next().next('.icon-error').remove();
        field.next('.inforCheckboxLabel').next('.icon-error').remove();
        field.parent('.field, .field-short').find('span.error').remove();
        field.parent().find('.icon-error').remove();
        field.off('focus.validate focus.tooltip');
      }

      if (loc.attr('data-placeholder')) {
        loc.attr('placeholder',loc.attr('data-placeholder'));
        loc.removeAttr('data-placeholder');
      }

      //Remove error classes from pseudo-markup for certain controls
      if (field.is('.dropdown, .multiselect')) {
        field.data('dropdown').pseudoElem.removeClass('error').removeAttr('placeholder');
      }

      if (field.parent().is('.editor-container')) {
        field.parent().removeClass('is-error');
      }

      if (field.closest('.field-fileupload').length > -1) {
        field.closest('.field-fileupload').find('input.error').removeClass('error');
      }

      // Enable primary button in modal
      var modalBtn = field.closest('.modal').find('.btn-modal-primary').not('.no-validation');
      if (modalBtn.length) {
        this.setModalPrimaryBtn(field, modalBtn, true);
      }

      //Stuff for the inline error
      field.closest('.field, .field-short').find('.error-message').remove();
      field.parent('.field, .field-short').find('.formatter-toolbar').removeClass('error');
      field.trigger('valid', {field: field, message: ''});
      field.closest('form').trigger('valid', {field: field, message: ''});

    },

    /**
     * Shows an inline error message on a field
     *
     * @private
     * @param {jQuery[]} field
     */
    removePositive: function(field) {
      $('.icon-confirm', field.parent('.field, .field-short')).remove();
    }
  };

  $.fn.getErrorMessage = function(options) {
    var defaults = { },
      settings = $.extend({}, defaults, options);

    var instance = new Validator(this, settings);
    return instance.getField($(this)).data('data-errormessage');
  };

  //Add a Message to a Field
  $.fn.addError = function(options) {
    var defaults = {message: '', showTooltip: false, inline: true},
      settings = $.extend({}, defaults, options);

    return this.each(function() {
      var instance = new Validator(this, settings);
      instance.addError($(this), settings.message, settings.inline, settings.showTooltip);
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

  //The validation rules object
  var Validation = function () {
    var self = this;
    this.rules = {
      required: {
        isNotEmpty: function(value, field) {
          var supportsPlaceholder = !!('placeholder' in document.createElement('input'));

          if (!supportsPlaceholder && field &&
              (value === field.attr('placeholder') || value === Locale.translate('Required'))) {
            return false;
          }

          if (typeof value === 'string') {
            // strip out any HTML tags and focus only on text content.
            value = $.trim(value.replace(/<\/?[^>]*>/g, ''));
            if ($.trim(value).length === 0) {
              return false;
            }
            return true;
          }

          if (typeof value === 'number') {
            if (isNaN(value)) {
              return false;
            }
            return true;
          }

          return (value ? true : false);
        },

        // Check if at least one radio button checked in group
        isRadioChecked: function (field) {
          var name = field.attr('name');
          return (name && name.length && $('input[name="'+ name +'"]:radio:checked').length);
        },

        check: function (value, field) {
          var self = this;

          //Check all required fields filled on modal

          var allFilled = true;
          field.closest('.modal').find('input.required, textarea.required, select.required').not(':hidden').each(function () {
            if (!self.isNotEmpty($(this).val())) {
              allFilled = false;
            }
          });

          if (allFilled) {
            field.closest('.modal').find('.btn-modal-primary').not('.no-validation').removeAttr('disabled');
          } else {
            field.closest('.modal').find('.btn-modal-primary').not('.no-validation').attr('disabled', 'disabled');
          }

          this.message = Locale.translate('Required');
          return field.is(':radio') ? this.isRadioChecked(field) : this.isNotEmpty(value, field);
        },
        message: 'Required'
      },

      //date: Validate date, datetime (24hr or 12hr am/pm)
      date: {
        check: function (value, field) {
          this.message = Locale.translate('InvalidDate');

          if (value instanceof Date) {
            return value && value.getTime && !isNaN(value.getTime());
          }

          var dateFormat = (value.indexOf(':') > -1) ? Locale.calendar().dateFormat.datetime: Locale.calendar().dateFormat.short;

          if (field && field.data('datepicker')) {
            dateFormat = field.data('datepicker').pattern;
          }

          var isStrict = !(dateFormat === 'MMMM d' || dateFormat === 'yyyy'),
            parsedDate = Locale.parseDate(value, dateFormat, isStrict);
          return ((parsedDate === undefined) && value !== '') ? false : true;
        },
        message: 'Invalid Date'
      },

      //Validate date, disable dates
      availableDate: {
        check: function (value, field) {
          this.message = Locale.translate('UnavailableDate');
          var check = true;

          if(value !== '' && self.rules.date.check(value)) { //if valid date
            var d, i, l, min, max,
              d2 = new Date(value),
              options = field.data('datepicker').settings;

            if (options) {

              min = (new Date(options.disable.minDate)).setHours(0,0,0,0);
              max = (new Date(options.disable.maxDate)).setHours(0,0,0,0);

              //dayOfWeek
              if(options.disable.dayOfWeek.indexOf(d2.getDay()) !== -1) {
                check = false;
              }

              d2 = d2.setHours(0,0,0,0);

              //min and max
              if((d2 <= min) || (d2 >= max)) {
                check = false;
              }

              //dates
              if (options.disable.dates.length && typeof options.disable.dates === 'string') {
                options.disable.dates = [options.disable.dates];
              }
              for (i=0, l=options.disable.dates.length; i<l; i++) {
                d = new Date(options.disable.dates[i]);
                if(d2 === d.setHours(0,0,0,0)) {
                  check = false;
                  break;
                }
              }
            }
            check = ((check && !options.disable.isEnable) || (!check && options.disable.isEnable)) ? true : false;
          }

          return check;
        },
        message: 'Unavailable Date'
      },

      email: {
        check: function (value) {
          this.message = Locale.translate('EmailValidation');
          var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,16}(?:\.[a-z]{2})?)$/i;

          return (value.length) ? regex.test(value) : true;
        },
        message: 'EmailValidation'
      },

      enableSubmit: {
        check: function (value, field) {
          var submit = field.closest('.signin').find('button[type="submit"]'),
            ok = ((value.length) && (self.rules.email.check(value) || self.rules.passwordConfirm.check(value, field)));

          if (ok) {
            submit.enable();
          } else {
            submit.disable();
          }
          return true;
        },
        message: ''
      },

      emailPositive: {
        check: function (value, field) {
          if($.trim(value).length && !field.is('[readonly]')) {
            self.rules.emailPositive.positive = true;
            this.message = Locale.translate('EmailValidation');

            var isValid = self.rules.email.check(value, field);

            if (isValid) {
              this.message = '';
            }

            return isValid;
          } else {
            self.rules.emailPositive.positive = false;
            return true;
          }
        },
        message: 'EmailValidation'
      },

      passwordReq: {
        check: function (value) {
         this.message = Locale.translate('PasswordValidation');
          /* Must be at least 10 characters which contain at least
          ** one lowercase letter,
          ** one uppercase letter,
          ** one numeric digit
          ** and one special character */
          var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{10,}$/;
          return (value.length) ? value.match(regex) : true;
        },
        message: 'PasswordValidation'
      },

      passwordConfirm: {
        check: function (value, field) {
          this.message = Locale.translate('PasswordConfirmValidation');
          var passwordValue = $('input[type="password"]:not('+ field.attr('id') +')', field.closest('.signin')).eq(0).val(),
            check = ((value === passwordValue) && (self.rules.passwordReq.check(passwordValue)));
          return (value.length) ? check : true;
        },
        message: 'PasswordConfirmValidation'
      },

      time: {
        check: function(value, field) {
          value = value.replace(/ /g, '');
          this.message = Locale.translate('InvalidTime');
          var timepicker = field && field.data('timepicker'),
		    timepickerSettings = timepicker ? field.data('timepicker').settings : {},
            pattern = timepickerSettings && timepickerSettings.timeFormat ? timepickerSettings.timeFormat : Locale.calendar().timeFormat,
            is24Hour = (pattern.match('HH') || []).length > 0,
            maxHours = is24Hour ? 24 : 12,
            sep = value.indexOf(Locale.calendar().dateFormat.timeSeparator),
            valueHours = 0,
            valueMins = 0,
			valueSecs = 0,
			valueM,
			timeparts;

          if (value === '') {
            return true;
          }

		  valueHours = parseInt(value.substring(0, sep));
          valueMins = parseInt(value.substring(sep + 1,sep + 3));

		  //getTimeFromField
		  if (timepicker) {
			  timeparts = timepicker.getTimeFromField();

			  valueHours = timeparts.hours;
			  valueMins = timeparts.minutes;

			  if (timepicker.hasSeconds()) {
			    valueSecs = timeparts.seconds;
			  }
		  }

          if (valueHours.toString().length < 1 || isNaN(valueHours) || parseInt(valueHours) < 0 || parseInt(valueHours) > maxHours) {
            return false;
          }
          if (valueMins.toString().length < 1 || isNaN(valueMins) || parseInt(valueMins) < 0 || parseInt(valueMins) > 59) {
            return false;
          }
          if (valueSecs.toString().length < 1 || isNaN(valueSecs) || parseInt(valueSecs) < 0 || parseInt(valueSecs) > 59) {
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
      },

      //Test validation function, always returns false
      test: {

        check: function(value) {
          return value === '1' ? true : false;
        },

        message: 'Value is not valid (test).'
      }
    };
  };

  $.fn.validation = new Validation();

  $.fn.isValid = function() {
    return ($(this).data('isValid') ? true : false);
  };

 //Check validation manually
  $.fn.checkValidation = function() {
    var field = $(this),
      api = field.data('validate'),
      doAction = function(isValid) {
        field.data('isValid', isValid);
        field.triggerHandler('isvalid', [isValid]);
      };

    if (api && api.validate) {
      var fx = api.validate(field, false, 0);
      $.when.apply($, fx).always(function() {
        // [fail] returns the first fail, so we have to loop deferred objects
        $.each(fx, function() {
          this.done(function() {
            doAction(true);
          }).fail(function() {
            doAction(false);
          });
        });
      });
    }
  };

  //Clear out the stuff on the Form
  $.fn.resetForm = function() {
    var formFields = $(this).find('input, select, textarea');

    //Clear Errors
    formFields.removeClass('error');
    $(this).find('.error').removeClass('error');
    $(this).find('.icon-error').remove();
    $(this).find('.icon-confirm').remove();
    $(this).find('.error-message').remove();

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

/* start-amd-strip-block */
}));
/* end-amd-strip-block */
