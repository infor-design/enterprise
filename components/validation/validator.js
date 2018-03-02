import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';
import { Validation } from './validation';

// jQuery Components
import '../icons/icons.jquery';
import '../toast/toast.jquery';

// Component Name
const COMPONENT_NAME = 'Validator';

/**
 * Validation Message Defaults
 * @namespace
 * @property {boolean} inline
 * @property {boolean} isAlert
 * @property {string} message
 * @property {string} type
 * @property {boolean} showTooltip
 */
const VALIDATION_MESSAGE_DEFAULTS = {
  inline: true,
  isAlert: false,
  message: '',
  type: 'error',
  showTooltip: false
};

/**
 * @class Validator
 * @constructor
 * @param {jQuery[]|HTMLElement} element the base element
 * @param {object} [settings] incoming settings
 */
function Validator(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, VALIDATION_MESSAGE_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Object
Validator.prototype = {

  /**
   * @private
   * @returns {void}
   */
  init() {
    this.fields = 'input, textarea, select, div[data-validate], div[data-validation]';
    this.isPlaceholderSupport = !!('placeholder' in document.createElement('input'));// placeholder native support is-exists

    // If we initialize with a form find all inputs
    this.inputs = this.element.find(this.fields);

    // Or Just use the current input
    if (this.element.is(this.fields)) {
      this.inputs = $().add(this.element);
    }

    this.element.addClass('validation-active');
    this.timeout = null;

    this.attachEvents();
  },

  /**
   * Gets a list of events
   * @private
   * @param {string} events a single event name, or a JSON-representation of several events
   * @returns {void}
   */
  extractEvents(events) {
    if (events.indexOf('{') > -1) {
      events = JSON.parse(events.replace(/'/g, '"'));
    }

    if (typeof events === 'object') {
      let e = '';
      for (const k in events) { // eslint-disable-line
        if (e.indexOf(events[k]) === -1) {
          e += `${events[k]} `;
        }
      }
      e = e.split(' ').join('.validate ');
      events = e;
    }

    return events;
  },

  /**
   * @private
   * @param {string} events a single event name, or a JSON-representation of several events
   * @param {string} type a type of event to filter against
   * @returns {array} of event types in string format
   */
  filterValidations(events, type) {
    const validations = [];

    if (!events) {
      return [];
    }

    if (events.indexOf('{') > -1) {
      events = JSON.parse(events.replace(/'/g, '"'));
    }

    if (typeof events === 'object') {
      for (const k in events) { // eslint-disable-line
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
  attachEvents() {
    const self = this;
    const attribs = '[data-validate],[data-validation]';

    // Attach required
    this.inputs.each(function () {
      const field = $(this);
      const attr = field.attr('data-validate') || field.attr('data-validation');

      if (attr && attr.indexOf('required') > -1) {
        field.addClass('required');
      }
    });

    // Link on to the current object and perform validation.
    this.inputs.filter('input, textarea, div').filter(attribs).not('input[type=checkbox]').each(function () {
      const field = $(this);
      const eventAttr = field.attr('data-validation-events');
      const events = self.extractEvents(eventAttr || 'blur.validate change.validate keyup.validate');

      // Custom enter event
      if (events.indexOf('enter.validate') > -1) {
        field.off('keypress.enter.validate').on('keypress.enter.validate', function (e) {
          const thisField = $(this);
          if (e.which === 13) {
            self.validate(thisField, true, e);
          }
        });
      }

      field.off(events).on(events, function (e) {
        const thisField = $(this);
        const handleEventData = thisField.data(`handleEvent${[(e.type || '')]}`);

        if (thisField.is('[readonly]') && !thisField.parent().is('.field-fileupload')) {
          return;
        }

        if (handleEventData &&
            handleEventData.type === e.type &&
            e.handleObj.namespace === 'validate' &&
            !thisField.closest('.modal:visible').length) {
          return;
        }
        thisField.data(`handleEvent${[(e.type || '')]}`, e.handleObj);

        // Skip on Tab
        if (e.type === 'keyup' && e.keyCode === 9) {
          return;
        }

        setTimeout(() => {
          if (thisField.attr('data-disable-validation') === 'true' || thisField.hasClass('disable-validation') || thisField[0].style.visibility === 'is-hidden' || !thisField.is(':visible')) {
            return;
          }

          if (thisField.closest('.modal-engaged').length && !thisField.closest('.modal-body').length) {
            return;
          }

          if (thisField.data('isValid') === false && e.type === 'blur') {
          //  return;
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

    const selects = this.inputs.filter('select').filter(attribs);

    if (selects.length) {
      selects.on('change.validate', function (e) {
        self.validate($(this), true, e);
      }).on('listopened.validate', function () {
        const thisField = $(this);
        const tooltip = thisField.data('tooltip');

        thisField.next('.dropdown-wrapper').next('.error-message').hide();
        if (tooltip && document.activeElement === thisField.data('dropdown').searchInput[0]) {
          tooltip.hide();
        }
        $('#validation-tooltip').hide();
      }).on('listclosed.validate', function () {
        const thisField = $(this);
        let tooltip = thisField.data('tooltip');
        const dropdownApi = thisField.data('dropdown');

        if (dropdownApi && dropdownApi.wrapper) {
          tooltip = dropdownApi.wrapper
            .find('.icon-error').data('tooltip');
        }

        thisField.next('.dropdown-wrapper').next('.error-message').show();
        if (tooltip && document.activeElement !== thisField.data('dropdown').searchInput[0]) {
          tooltip.show();
        }
      });

      selects.filter(function () {
        return $(this).data('dropdown') !== undefined;
      }).data('dropdown').pseudoElem.on('blur.validate', function (e) {
        const select = $(this).closest('.field, .field-short').find('select');
        self.validate(select, true, e);
      });
    }

    // Attach to Form Submit and Validate
    if (this.element.is('form')) {
      const submitHandler = function (e) {
        e.stopPropagation();
        e.preventDefault();
        self.validateForm((isValid) => {
          self.element.off('submit.validate');
          self.element.triggerHandler('validated', isValid);
          self.element.data('isValid', isValid);
          self.element.on('submit.validate', submitHandler);
        });
      };

      this.element.on('submit.validate', submitHandler);
    }
  },

  /**
   * Validates all elements inside of a form
   * @private
   * @param {function} callback method to call when the form's validation completes.
   */
  validateForm(callback) {
    const self = this;
    const deferreds = [];

    self.inputs = this.element.find(self.fields);
    self.inputs.each(function (e) {
      const field = $(this);
      if (field.attr('data-validate')) {
        if (field.attr('data-disable-validation') === 'true' || field.hasClass('disable-validation')) {
          return;
        }

        const dfds = self.validate(field, false, e);
        for (let i = 0; i < dfds.length; i++) {
          deferreds.push(dfds[i]);
        }
      }
    });

    $.when(...deferreds).then(() => {
      callback(true);
    }, () => {
      callback(false);
    });
  },

  /**
   * Set disable/enable primary button in modal
   * @private
   * @param {jQuery[]|HTMLElement} field the target element
   * @param {jQuery[]|HTMLElement} modalBtn the button that needs to be set to primary.
   * @returns {void}
   */
  setModalPrimaryBtn(field, modalBtn) {
    const modal = field.closest('.modal');
    const modalFields = modal.find('[data-validate]:visible, select[data-validate], :checkbox[data-validate]');
    let allValid = true;

    if (modalFields.length > 0) {
      modalFields.each(function () {
        const modalField = $(this);

        if (modalField.closest('.datagrid-filter-wrapper').length > 0) {
          return;
        }
        const isVisible = modalField[0].offsetParent !== null;
        if (modalField.is('.required')) {
          if ((isVisible || modalField.is('select, :checkbox')) && !modalField.val()) {
            allValid = false;
          }
        }
        if ((isVisible || modalField.is('select, :checkbox')) && !modalField.isValid()) {
          allValid = false;
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
   * @param {jQuery[]} field the field being checked.
   * @returns {any} the value of the field.
   */
  value(field) {
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
   * @param {jQuery[]} field the field being checked
   * @param {jQuery.Event} e the `validate` event
   * @returns {array} an array of types
   */
  getTypes(field, e) {
    const filters = this.filterValidations(field.attr('data-validation-events'), e.type);
    let validations;

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

    // Filter out not needed events
    if (filters.length > 0) {
      validations = validations.filter(n => filters.indexOf(n) !== -1);
    }

    // Filter out specific events that should not use keyup
    if (e.type === 'keyup') {
      validations = validations.filter(n => n !== 'date' && n !== 'time');
    }

    return validations;
  },

  /**
   * Set icon on parent tabs/expandable
   * @private
   * @param {jQuery[]} field the field being appended to.
   * @param {string} type the type of icon being appended.
   * @returns {void}
   */
  setIconOnParent(field, type) {
    const errorIcon = $.createIcon({ classes: [`icon-${type}`], icon: type });
    const parent = field.closest('.tab-panel, .expandable-pane');
    let iconTarget = parent.attr('id');
    let parentContainer = field.closest('.tab-container, .tab-panel-container, .expandable-area');
    let iconContainer;
    let dropdown;
    let dropdownParent;

    // Tabs
    if (parentContainer.is('.tab-panel-container')) {
      parentContainer = parentContainer.prev('.tab-container');
    }
    if (parentContainer.is('.tab-container')) {
      // Default Tabs
      iconContainer = $(`.tab-list a[href="#${iconTarget}"]`, parentContainer).closest('.tab');

      // Tabs with Counts
      if (iconContainer.length) {
        if ($('.count', iconContainer).length) {
          iconContainer = $('.count', iconContainer);
        }
      } else {
        // Dropdown Tabs (with popupmenu)
        iconTarget = $(`a[href="#${iconTarget}"]`, '.popupmenu').closest('.popupmenu').attr('id');
        iconContainer = $(`.tab-list .tab[aria-controls="${iconTarget}"]`, parentContainer);
        dropdown = iconTarget;
      }
    } else if (parentContainer.is('.expandable-area')) {
      // Expandable
      iconContainer = $(`.expandable-header[aria-controls="${iconTarget}"] .title`, parentContainer);
    } else {
      // No action
      return;
    }

    // if Dropdown Tabs set each menu item to check
    if (dropdown && dropdown.length) {
      dropdownParent = parent.add($($(dropdown).attr('href')));
      $('a[role="menuitem"]', `#${dropdown}`).each(function () {
        dropdownParent = dropdownParent.add($($(this).attr('href')));
      });
    }
    const menuitem = $(`a[href="#${parent.attr('id')}"]`, `#${iconTarget}`);

    // Add icon
    if ((!!parent && $(`.${type}`, parent).length) ||
        (!!dropdownParent && $(`.${type}`, dropdownParent).length)) {
      // if Dropdown Tabs and current menu item has no error remove icon
      if (!$(`.${type}`, parent).length) {
        menuitem.removeClass(`is-${type}`);
        $(`.icon-${type}`, menuitem).remove();
      }

      // if Dropdown Tabs and current menu item has error add icon
      if ($(`.${type}`, parent).length &&
          $(`.${type}`, dropdownParent).length &&
          !$(`.icon-${type}`, menuitem).length) {
        menuitem.addClass(`is-${type}`).append(errorIcon);
      }

      // Add icon to main tab area
      if (!($(`.icon-${type}`, iconContainer).length)) {
        iconContainer.addClass(`is-${type}`).append(errorIcon);
      }
    } else {
      // Remove icon
      iconContainer = iconContainer.add(menuitem);
      iconContainer.removeClass(`is-${type}`);
      $(`.icon-${type}`, iconContainer).remove();
    }
  },

  /**
   * @private
   * @param {jQuery[]} field the field being validated
   * @param {boolean} showTooltip whether or not this field should display its
   *  validation message in a tooltip
   * @param {jQuery.Event} e the `validate` event
   * @returns {Array} of jQuery deferred objects
   */
  validate(field, showTooltip, e) {
    field.data(`handleEvent${[(e.type || '')]}`, null);

    // call the validation function inline on the element
    const self = this;
    const types = self.getTypes(field, e) || [];
    let rule;
    let dfd;
    const dfds = [];
    const results = [];
    let i;
    let l;
    let validationType;
    const value = self.value(field);
    const placeholder = field.attr('placeholder');

    function manageResult(result, type) {
      // Only remove if "false", not any other value ie.. undefined
      if (rule.positive === false) {
        self.removePositive(field);
      }

      validationType = Validation.ValidationTypes[rule.type] || Validation.ValidationTypes.error;

      if (!result) {
        if (!self.isPlaceholderSupport && (value === placeholder) &&
           (rule.message !== Locale.translate('Required'))) {
          return;
        }

        self.addMessage(field, rule.message, rule.type, field.attr(`data-${validationType.type}-type`) !== 'tooltip', showTooltip);
        results.push(rule.type);

        if (validationType.errorsForm) {
          dfd.reject();
        } else {
          dfd.resolve();
        }
      } else if ($.grep(results, res => res === validationType.type).length === 0) {
        self.removeMessage(field, validationType.type);
        dfd.resolve();

        if (rule.positive) {
          // FIX: In Contextual Action Panel control not sure why but need to add error,
          // otherwise "icon-confirm" get misaligned,
          // so for this fix adding and then removing error here
          self.addMessage(field, rule.message, rule.type, rule.inline, showTooltip);
          self.removeMessage(field, rule.type);
          dfd.resolve();

          self.addPositive(field);
        }
      }

      self.setIconOnParent(field, rule.type);
      self.validationStatus[type] = result;

      if (self.eventsStatus(types) && type !== 'required' && !self.validationStatus.triggerValid) {
        self.validationStatus.triggerValid = true;
        field.triggerHandler('valid', { field, message: '' });
      }
      field.triggerHandler('isvalid', [result]);
    }

    const validationTypes = Object.keys(Validation.ValidationTypes);
    validationTypes.forEach((prop) => {
      validationType = Validation.ValidationTypes[prop];
      self.removeMessage(field, validationType.type);
      field.removeData(`data-${validationType.type}message`);
    });

    self.validationStatus = {};
    for (i = 0, l = types.length; i < l; i++) {
      self.validationStatus[types[i]] = false;
      rule = Validation.rules[types[i]];
      dfd = $.Deferred();

      if (!rule) {
        continue;
      }

      if ($('#calendar-popup').is(':visible')) {
        continue; // dont show validation message while selecting
      }

      if (rule.async) {
        rule.check(value, field, manageResult);
      } else {
        manageResult(rule.check(value, field), showTooltip, types[i]);
      }
      dfds.push(dfd);
    }

    return dfds;
  },

  /**
   * Retrive the actionble element that should have an error class/icon appended to it.
   * @private
   * @param {jQuery[]} field the field being checked
   * @returns {jQuery[]} the field to be checked
   */
  getField(field) {
    if (field.is('select') && field.data('dropdown') !== undefined) {
      field = field.data('dropdown').pseudoElem;
    }
    return field;
  },

  /**
   * Returns true if the given object has an error
   * @param {jQuery[]} field the field being checked
   * @returns {boolean} whether or not the field currently has an error
   */
  hasError(field) {
    return this.getField(field).hasClass('error');
  },

  /**
   * Adds a validation message/icon to a form field.
   * @param {jQuery[]} field the field to be appended
   * @param {string} message the validation message text
   * @param {string} type the type of validation (error, alert, info, etc)
   * @param {boolean} inline whether or not the text should appear inside the input field
   *  (like a placeholder), or underneath the input field
   * @param {boolean} showTooltip whether or not the legacy validation Tooltip will contain the
   * message instead of placing it underneath
   * @param {boolean} isAlert whether or not this validation message type is "alert"
   */
  addMessage(field, message, type, inline, showTooltip, isAlert) {
    if (message === '') {
      return;
    }

    isAlert = isAlert || false;

    const loc = this.getField(field);
    const dataMsg = loc.data(`data-${type}message`);
    let appendedMsg = message;
    const validationType = Validation.ValidationTypes[type] || Validation.ValidationTypes.error;

    if (!isAlert) {
      loc.addClass(type);
    }

    if (dataMsg) {
      appendedMsg = (/^\u2022/.test(dataMsg)) ? '' : '\u2022 ';
      appendedMsg += `${dataMsg}<br>\u2022 ${message}`;
    }

    loc.data(`data-${validationType.type}message`, appendedMsg);

    // Add Aria
    if ($.fn.toast !== undefined) {
      $('body').toast({
        title: Locale.translate(validationType.titleMessageID),
        audibleOnly: true,
        message: appendedMsg
      });
    }

    if (!inline) {
      this.showTooltipMessage(field, appendedMsg, validationType.type, showTooltip);
      return;
    }

    field.data('isValid', false);

    // Disable primary button in modal
    const modalBtn = field.closest('.modal').find('.btn-modal-primary').not('.no-validation');
    if (modalBtn.length) {
      this.setModalPrimaryBtn(field, modalBtn);
    }

    this.showInlineMessage(field, message, validationType.type, isAlert);
  },

  /**
   * Shows an error icon
   *
   * @private
   * @param {jQuery[]} field the field being appended
   * @param {string} type the error type
   * @returns {jQuery[]} the new icon's markup
   */
  showIcon(field, type) {
    const loc = this.getField(field).addClass(type);
    let svg = $.createIconElement({ classes: [`icon-${type}`], icon: type });
    const closestField = loc.closest('.field, .field-short');
    const parent = field.parent();

    if (closestField.find(`svg.icon-${type}`).length === 0) {
      if (parent.is('.editor-container')) {
        field.parent().addClass('is-error');
      }

      if (field.parent(':not(.editor-container)').find('.btn-actions').length === 1) {
        parent.find('.btn-actions').before(svg);
      } else if (parent.find('.data-description').length === 1) {
        parent.find('.data-description').before(svg);
      } else if (parent.find('.field-info').length === 1) {
        parent.find('.field-info').before(svg);
      } else if (field.is('textarea')) {
        field.after(svg);
      } else if (field.is('.dropdown, .multiselect')) {
        parent.find('.dropdown-wrapper').append(svg);
      } else if (field.is('.spinbox')) {
        parent.append(svg);
      } else if (field.is('.lookup')) {
        parent.append(svg);
      } else {
        parent.append(svg);
      }

      $('.icon-confirm', closestField).remove();
    } else {
      svg = closestField.find('svg.icon-error');
    }

    return svg;
  },

  /**
   * Shows an tooltip error
   *
   * @private
   * @param {jQuery[]} field the field being appended
   * @param {string} message text content containing the validation message.
   * @param {string} type the validation type (error, alert, info, etc)
   * @param {boolean} showTooltip whther or not to show a tooltip
   */
  showTooltipMessage(field, message, type, showTooltip) {
    if (field.is(':radio')) {
      return;
    }

    const icon = this.showIcon(field, type);
    let representationField = field;

    // Add error classes to pseudo-markup for certain controls
    if (field.is('.dropdown, .multiselect') && field.data('dropdown') !== undefined) {
      const input = field.data('dropdown').pseudoElem;
      representationField = input;
      input.addClass(type);
    }

    let tooltipAPI = icon.data('tooltip');

    // Error tooltips should be positioned on the 'x' so that they sit directly
    // underneath the fields that they are indicating.
    function tooltipPositionCallback(placementObj) {
      const fieldRect = representationField[0].getBoundingClientRect();
      const elRect = tooltipAPI.tooltip[0].getBoundingClientRect();
      const rtl = $('html').is('[dir="rtl"]');
      const currX = placementObj.x;
      let xAdjustment = 0;

      if (rtl) {
        if (elRect.left < fieldRect.left) {
          xAdjustment += (fieldRect.left - elRect.left);
        }
      } else if (elRect.right > fieldRect.right) {
        xAdjustment += (elRect.right - fieldRect.right) * -1;
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

    field.on('focus.validate', () => {
      if (!tooltipAPI) { return; }
      tooltipAPI.show();
    }).on('blur.validate', () => {
      if (!tooltipAPI) { return; }
      tooltipAPI.hide();
    });

    if (showTooltip && tooltipAPI) {
      field.attr('data-error-type', 'tooltip');
      tooltipAPI.show();
    }
  },

  /**
   * Shows an tooltip error
   *
   * @private
   * @param {jQuery[]} field the field being toggled
   * @param {string} message text content containing the validation message
   * @param {string} type (error, alert, info, etc.)
   * @param {HTMLElement} markup existing HTML markup to use
   * @param {boolean} isShow whether or not the message is already showing
   */
  toggleRadioMessage(field, message, type, markup, isShow) {
    let all;
    let loc;
    const name = field.attr('name');

    if (name && name.length) {
      all = $(`:radio[name="${name}"], :radio[name="${name}"] + label`);
      loc = field.parent().is('.inline') ?
        $(`:radio[name="${name}"]:last`).parent() :
        $(`:radio[name="${name}"]:last + label`);

      if (isShow) {
        all.addClass(type);
        $(markup).addClass(`radio-group-${type}`).insertAfter(loc);
      } else {
        all.removeClass(type);
        loc.next(`.radio-group-${type}`).remove();
      }
    }
  },

  /**
   * Shows an inline error message on a field
   * @private
   *
   * @param {jQuery[]} field the field being modified
   * @param {string} message text content containing the validation message
   * @param {string} type the validation type (error, warn, info, etc).
   * @param {boolean} isAlert whether or not the validation type is "alert"
   */
  showInlineMessage(field, message, type, isAlert) {
    isAlert = isAlert || false;

    const loc = this.getField(field);
    const validationType = Validation.ValidationTypes[type] || Validation.ValidationTypes.error;
    const markup = `
    <div class="${validationType.type}-message">
      ${$.createIcon({ classes: [`icon-${validationType.type}`], icon: validationType.type })}
      <pre class="audible">
        ${Locale.translate(validationType.titleMessageID)}
      </pre>
      <p class="message-text">${message}</p>
    </div>`;

    if (!isAlert) {
      loc.addClass(type);
    }

    if (field.is(':radio')) { // Radio button handler
      this.toggleRadioMessage(field, message, validationType.type, markup, true);
    } else { // All other components
      loc.closest('.field, .field-short').find('.formatter-toolbar').addClass(validationType.type);
      loc.closest('.field, .field-short').append(markup);
      loc.closest('.field, .field-short').find('.colorpicker-container').addClass('error');
    }

    // Remove positive errors
    if (validationType.type === 'error') {
      field.parent().find('.icon-confirm').remove();
    }
    // Trigger an event
    field.triggerHandler(validationType.type, { field, message });
    field.closest('form').triggerHandler(validationType.type, { field, message });
  },

  /**
   * Shows an inline error message on a field
   *
   * @private
   * @param {jQuery[]} field the field being modified
   */
  addPositive(field) {
    const svg = $.createIcon({ icon: 'confirm', classes: 'icon-confirm' });

    if (!$('.icon-confirm', field.parent('.field, .field-short')).length) {
      field.parent('.field, .field-short').append(svg);
    }
  },

  /**
   * Remove the message form the field if there is
   * one and mark the field valid.
   *
   * @private
   * @param {jQuery[]} field the field which is having its error removed
   * @param {string} type the type of message (error, alert, info, etc)
   */
  removeMessage(field, type) {
    const loc = this.getField(field);
    const isRadio = field.is(':radio');
    const errorIcon = field.closest('.field, .field-short').find('.icon-error');
    let tooltipAPI = errorIcon.data('tooltip');
    const hasTooltip = field.attr(`data-${type}-type`) || !!tooltipAPI;
    const hasError = field.getMessage({ type: 'error' });

    this.inputs.filter('input, textarea').off('focus.validate');
    field.removeClass(type);
    field.removeData(`data-${type}message`);

    if (hasTooltip) {
      tooltipAPI = field.find(`.icon.${type}`).data('tooltip') || tooltipAPI;

      if (tooltipAPI) {
        tooltipAPI.destroy();
      }
      if (field.attr('aria-describedby') === 'validation-tooltip') {
        field.removeAttr('aria-describedby');
        $('#validation-tooltip').remove();
      }
    }

    if (isRadio) {
      this.toggleRadioMessage(field, '', type);
    } else {
      field.next(`.icon-${type}`).off('click.validate').remove();
    }

    if (field.hasClass('dropdown') || field.hasClass('multiselect')) {
      field.next().next().removeClass(type); // #shdo
      field.next().find('div.dropdown').removeClass(type).removeData(`data-${type}message`);
      field.parent().find(`.dropdown-wrapper > .icon-${type}`).off('click.validate').remove(); // SVG Error Icon
    }

    if (!isRadio) {
      field.next().next(`.icon-${type}`).remove();
      field.next('.inforCheckboxLabel').next(`.icon-${type}`).remove();
      field.parent('.field, .field-short').find(`span.${type}`).remove();
      field.parent().find(`.icon-${type}`).remove();
      field.off('focus.validate focus.tooltip');
    }

    if (loc.attr('data-placeholder')) {
      loc.attr('placeholder', loc.attr('data-placeholder'));
      loc.removeAttr('data-placeholder');
    }

    // Remove error classes from pseudo-markup for certain controls
    if (field.is('.dropdown, .multiselect')) {
      field.data('dropdown').pseudoElem.removeClass(type).removeAttr('placeholder');
    }

    if (field.parent().is('.editor-container')) {
      field.parent().removeClass(`is-${type}`);
    }
    field.parent('.colorpicker-container').removeClass('error');

    if (field.closest('.field-fileupload').length > -1) {
      field.closest('.field-fileupload').find(`input.${type}`).removeClass(type);
    }

    // Stuff for the inline error
    field.closest('.field, .field-short').find(`.${type}-message`).remove();
    field.parent('.field, .field-short').find('.formatter-toolbar').removeClass(type);

    if (type === 'error' && hasError) {
      field.triggerHandler('valid', { field, message: '' });
      field.closest('form').triggerHandler('valid', { field, message: '' });
    }

    field.data('isValid', true);

    // Test Enabling primary button in modal
    const modalBtn = field.closest('.modal').find('.btn-modal-primary').not('.no-validation');
    if (modalBtn.length) {
      this.setModalPrimaryBtn(field, modalBtn);
    }
  },

  /**
   * Check if all given events are true/valid
   * @param {array} types a list of event types
   * @returns {boolean} whether or not the types are valid
   */
  eventsStatus(types) {
    let r;
    const status = this.validationStatus;

    if (status) {
      r = true;

      if (types) {
        for (let i = 0, l = types.length; i < l; i++) {
          if (!status[types[i]]) {
            r = false;
          }
        }
      } else {
        const statusKeys = Object.prototype.hasOwnProperty.call(status);
        statusKeys.forEach((key) => {
          if (!status[key]) {
            r = false;
          }
        });
      }
    } else {
      r = false;
    }
    return r;
  },

  /**
   * Shows an inline error message on a field
   *
   * @private
   * @param {jQuery[]} field the field being modified
   */
  removePositive(field) {
    $('.icon-confirm', field.parent('.field, .field-short')).remove();
  },

  /**
   * Update method
   * @param {object} [settings] incoming settings
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }
  }

};

export { Validator, COMPONENT_NAME };
