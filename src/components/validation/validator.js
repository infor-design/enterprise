import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { theme } from '../theme/theme';

import { Locale } from '../locale/locale';
import { Validation } from './validation';

// jQuery Components
import '../icons/icons.jquery';
import '../toast/toast.jquery';
import { Environment as env } from '../../utils/environment';

// Component Name
const COMPONENT_NAME = 'Validator';

/**
 * Validation Message Defaults
 * @namespace
 * @property {boolean} inline
 * @property {string} message
 * @property {string} type
 * @property {boolean} showTooltip
 * @property {boolean} isHelpMessage
 */
const VALIDATION_MESSAGE_DEFAULTS = {
  inline: true,
  message: '',
  type: 'error',
  showTooltip: false,
  isHelpMessage: false
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
   * Set error icon opacity for tooltip types, to avoid overlap text in the field
   * @private
   * @param {object} field validation element
   * @returns {void}
   */
  setErrorIconOpacity(field) {
    if (field.is(':text') && field.is('[data-error-type="tooltip"]')) {
      const textWidth = this.calculateTextWidth(field.val());
      const fieldWidth = field.outerWidth() - 35; // 35: icon width + padding/margin
      field.closest('.field, .field-short')
        .find('.icon-error')[(textWidth > fieldWidth) ? 'addClass' : 'removeClass']('lower-opacity');
    }
  },

  /**
   * Calculate the width for given text
   * @param {string} text to calculate the width
   * @param {string} font used with given text (e.g. `14px arial`).
   * @returns {number} the calculated width
   */
  calculateTextWidth(text, font) {
    // use cached canvas for better performance, else, create new canvas
    this.canvas = this.canvas || (this.canvas = document.createElement('canvas'));
    const context = this.canvas.getContext('2d');
    context.font = font || '14px arial';
    const metrics = context.measureText(text);
    return metrics.width;
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
    this.inputs.filter('input, textarea, div').filter(attribs).not('input[type=file]').each(function () {
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
        if (e.type === 'keyup') {
          // Skip on Tab
          if (e.keyCode === 9) {
            return;
          }
          self.setErrorIconOpacity(field);
        }

        const thisField = $(this);
        const handleEventData = thisField.data(`handleEvent${[(e.type || '')]}`);

        if (thisField.is('[readonly]') && !thisField.parent().is('.field-fileupload') &&
          !thisField.is('.lookup.is-not-editable')) {
          return;
        }

        if (handleEventData &&
            handleEventData.type === e.type &&
            e.handleObj.namespace === 'validate' &&
            !thisField.is('.lookup') &&
            !thisField.closest('.modal:visible').length) {
          return;
        }
        thisField.data(`handleEvent${[(e.type || '')]}`, e.handleObj);

        setTimeout(() => {
          if (thisField.closest('.modal-engaged').length && !thisField.closest('.modal-body').length) {
            return;
          }

          self.validate(field, true, e);
        }, 300);
      });
    });

    this.inputs.filter('input[type=checkbox]').filter(attribs).off('click.validate').on('click.validate', function (e) {
      self.validate($(this), true, e);
    });

    this.inputs.filter(':radio').off('click.validate').on('click.validate', function (e) {
      const first = $(this).parent().find('.radio').first();
      self.validate(first, true, e);
    });

    const selects = this.inputs.filter('select').filter(attribs);

    if (selects.length) {
      selects.off('change.validate listopened.validate listclosed.validate').on('change.validate', function (e) {
        self.validate($(this), true, e);
      }).on('listopened.validate', function () {
        const thisField = $(this);
        const tooltip = thisField.data('tooltip');

        if (tooltip && document.activeElement === thisField.data('dropdown').searchInput[0]) {
          tooltip.hide();
        }
        $('#validation-tooltip').hide();
      }).on('listclosed.validate', function () {
        const thisField = $(this);
        let tooltip = thisField.data('tooltip');
        const dropdownApi = thisField.data('dropdown');

        if (env.features.touch) {
          dropdownApi.pseudoElem.focus();
          setTimeout(() => {
            dropdownApi.pseudoElem.blur();
          }, 100);
        }

        if (dropdownApi && dropdownApi.wrapper) {
          tooltip = dropdownApi.wrapper
            .find('.icon-error').data('tooltip');
        }

        if (tooltip && document.activeElement !== thisField.data('dropdown').searchInput[0]) {
          tooltip.show();
        }
      });

      selects.filter(function () {
        return $(this).data('dropdown') !== undefined;
      }).each(function () {
        const pseudoElem = $(this).data('dropdown').pseudoElem;
        pseudoElem.off('blur.validate').on('blur.validate', function (e) {
          const select = $(this).closest('.field, .field-short').find('select');
          self.validate(select, true, e);
        });
      });
    }

    // Attach to Form Submit and Validate
    if (this.element.is('form') && this.element.attr('data-validate-on')) {
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

      this.element.off('submit.validate').on('submit.validate', submitHandler);
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
   * Set disable/enable primary button if a container of fields is valid
   * @private
   * @param {jQuery[]|HTMLElement} container to validate.
   * @param {jQuery[]|HTMLElement} modalBtn the button that needs to be set to primary.
   * @returns {void}
   */
  setPrimaryBtn(container, modalBtn) {
    const fields = container.find('[data-validate]:visible, select[data-validate], :checkbox[data-validate]');
    let allValid = true;

    if (fields.length > 0) {
      fields.each(function () {
        const field = $(this);

        if (field.closest('.datagrid-filter-wrapper').length > 0) {
          return;
        }
        const isVisible = field[0].offsetParent !== null;
        if (field.is('.required')) {
          if (isVisible && field.is('.editor') && !field.html()) {
            allValid = false;
          }
          if ((isVisible || field.is('select, :checkbox')) && !field.val() && !field.is('.editor')) {
            allValid = false;
          }
        }
        if ((isVisible || field.is('select, :checkbox')) && !field.isValid()) {
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
   * Get the types of validation from a field.
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
    const errorIcon = $.createIcon({ classes: [`icon-${type}`], icon: `${type}-alert` });
    const parent = field.closest('.tab-panel, .expandable-pane');
    const flexRow = field.closest('.row.flex-align-bottom');
    let iconTarget = parent.attr('id');
    let parentContainer = field.closest('.tab-container, .tab-panel-container, .expandable-area');
    let iconContainer;
    let dropdown;
    let dropdownParent;

    // Flex Row
    if (flexRow && flexRow.length) {
      if ($(`.${type}`, flexRow).length) {
        flexRow.addClass('has-messages');
      } else {
        flexRow.removeClass('has-messages');
      }
    }

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

      const tabsAPI = parentContainer.data('tabs');
      if (tabsAPI) {
        tabsAPI.sizeBar();
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
   * @param {boolean} showTooltip whether or not this field should display its validation message in a tooltip
   * @param {jQuery.Event} e the `validate` event
   * @returns {array} of jQuery deferred objects
   */
  validate(field, showTooltip, e) {
    field.data(`handleEvent${[(e.type || '')]}`, null);

    if (field.attr('data-disable-validation') === 'true' || field.hasClass('disable-validation') || field.is(':disabled')) {
      return [];
    }

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

    function manageResult(result, showResultTooltip, type, dfrd) {
      rule = Validation.rules[type];
      // Only remove if "false", not any other value ie.. undefined
      if (rule.positive === false) {
        self.removePositive(field);
      }

      validationType = Validation.ValidationTypes[rule.type] || Validation.ValidationTypes.error;
      const isInline = field.attr(`data-${validationType.type}-type`) !== 'tooltip';

      if (!result) {
        if (!self.isPlaceholderSupport && (value === placeholder) &&
           (rule.message !== Locale.translate('Required'))) {
          return;
        }
        self.addMessage(field, rule, isInline, showResultTooltip);
        results.push(rule.type);

        if (validationType.errorsForm) {
          dfrd.reject();
        } else {
          dfrd.resolve();
        }
      } else if ($.grep(results, res => res === validationType.type).length === 0) {
        dfrd.resolve();

        if (rule.positive) {
          // FIX: In Contextual Action Panel control not sure why but need to add error,
          // otherwise "icon-success" get misaligned,
          // so for this fix adding and then removing error here

          self.addMessage(field, rule, isInline, showResultTooltip);
          self.removeMessage(field, rule, true);
          dfrd.resolve();

          self.addPositive(field);
        }
      } else if (!validationType.errorsForm) {
        // Rules that do not error the form need to resolve
        dfrd.resolve();
      }

      self.setIconOnParent(field, rule.type);
      const loc = self.getField(field);
      const data = loc.data(`${validationType.type}message`);

      if (result && data && data.filter(rules => rules.id === rule.id || rule.message).length > 0) {
        self.removeMessage(field, rule, true);
      }

      // Test Enabling primary button in modal
      const modalBtn = field.closest('.modal').find('.btn-modal-primary').not('.no-validation');
      if (modalBtn.length) {
        self.setPrimaryBtn(field.closest('.modal'), modalBtn);
      }

      // Test Enabling primary button in Calendar Popup
      const calendarPopupBtn = field.closest('#calendar-popup').find('.btn-modal-primary').not('.no-validation');
      if (calendarPopupBtn.length) {
        self.setPrimaryBtn(field.closest('#calendar-popup'), calendarPopupBtn);
      }

      if (rule.type === 'error') {
        field.closest('form').triggerHandler('aftervalidate', { field, rule, isValid: result });
      }
    }

    for (i = 0, l = types.length; i < l; i++) {
      rule = Validation.rules[types[i]];

      dfd = $.Deferred();

      if (!rule) {
        continue;
      }

      if (rule.async) {
        rule.check(value, field, manageResult, dfd);
      } else {
        manageResult(rule.check(value, field), showTooltip, types[i], dfd);
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
   * @private
   * @param {jQuery[]} field the field to be appended
   * @param {object} rule The validation message text
   * @param {boolean} inline whether or not the text should appear inside the input field
   *  (like a placeholder), or underneath the input field
   * @param {boolean} showTooltip whether or not the legacy validation Tooltip will contain the
   * message instead of placing it underneath
   * @param {boolean} isHelpMessage whether or not this validation message type is "alert"
   */
  addMessage(field, rule, inline, showTooltip, isHelpMessage) {
    if (rule.message === '') {
      return;
    }

    if (field.is('.dropdown, .multiselect') && $('#dropdown-list').is(':visible')) {
      return;
    }

    isHelpMessage = isHelpMessage || false;

    const loc = this.getField(field);
    let dataMsg = loc.data(`${rule.type}message`);
    const validationType = Validation.ValidationTypes[rule.type] ||
      Validation.ValidationTypes.error;

    if (!isHelpMessage) {
      loc.addClass(rule.type === 'icon' ? 'custom-icon' : rule.type);
    }

    // Inline messages are now an array
    if (dataMsg && dataMsg === rule.message) {
      // No need to add new message
      return;
    }

    if (dataMsg &&
      dataMsg.filter(rules => (rules.id || rules.message) === (rule.id || rule.message) &&
        rules.message === rule.message).length > 0) {
      // No need to add new message
      return;
    }

    let appendedMsg = rule.message;

    if (dataMsg) {
      for (let i = 0; i < dataMsg.length; i++) {
        appendedMsg = `\u2022 ${dataMsg[i].message}`;
      }
      appendedMsg += `<br>\u2022 ${rule.message}`;
    }

    if (!dataMsg) {
      dataMsg = [];
    }

    // Find the message by id and remove
    field.closest('.field, .field-short').find(`[data-rule-id="${rule.id || rule.message}"]`).remove();
    if (field.hasClass('dropdown') || field.hasClass('multiselect')) {
      field.parent().find(`.dropdown-wrapper > [data-rule-id="${rule.id || rule.message}"]`).off('click.validate').remove();
    }

    // Remove the rule if it exists in the dataMsg
    dataMsg = dataMsg.filter(rules => rules.id !== rule.id);

    dataMsg.push({ id: rule.id, message: rule.message, type: rule.type });
    loc.data(`${validationType.type}message`, dataMsg);

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
    this.showInlineMessage(field, rule, isHelpMessage);
  },

  /**
   * Shows an error icon
   * @private
   * @param {jQuery[]} field the field being appended
   * @param {string} type the error type
   * @returns {jQuery[]} the new icon's markup
   */
  showIcon(field, type) {
    const loc = this.getField(field).addClass(type === 'icon' ? 'custom-icon' : type);
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

      $('.icon-success', closestField).remove();
    } else {
      svg = closestField.find('svg.icon-error');
    }

    return svg;
  },

  /**
   * Shows an tooltip error
   * @private
   * @param {jQuery[]} field the field being appended
   * @param {string} message text content containing the validation message.
   * @param {string} type the validation type (error, alert, info, etc)
   * @param {boolean} showTooltip whether or not to initially show the tooltip
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
      input.addClass(type === 'icon' ? 'custom-icon' : type);
    }
    field.closest('.field, .field-short').find('.formatter-toolbar').addClass(type === 'icon' ? 'custom-icon' : type);

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

    if (tooltipAPI) {
      field.attr('data-error-type', 'tooltip');
    }

    this.setErrorIconOpacity(field);

    if (showTooltip && tooltipAPI) {
      tooltipAPI.show();
    }
  },

  /**
   * Shows an tooltip error
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
        all.addClass(type === 'icon' ? 'custom-icon' : type);
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
   * @param {jQuery[]} field the field being modified
   * @param {string} rule The validation rule data.
   * @param {boolean} isHelpMessage whether or not the validation type is "alert"
   */
  showInlineMessage(field, rule, isHelpMessage) {
    isHelpMessage = isHelpMessage || false;

    const loc = this.getField(field);
    const validationType = Validation.ValidationTypes[rule.type] ||
      Validation.ValidationTypes.error;
    rule.icon = rule.icon || validationType.icon;

    let markup;
    let icon;

    if (rule.type === 'error') {
      icon = `${validationType.type}-alert`;
    } else {
      icon = theme.currentTheme.id && theme.currentTheme.id.indexOf('uplift') > -1 ? `${validationType.type}-alert` : `${validationType.type}`;
    }

    if (rule.type === 'icon') {
      markup = '' +
        `<div class="custom-icon-message" data-rule-id="${rule.id || rule.message}">
          ${$.createIcon({ classes: ['icon-custom'], icon: rule.icon })}
          <pre class="audible">
            ${Locale.translate(validationType.titleMessageID)}
          </pre>
          <p class="message-text">${rule.message}</p>
        </div>`;
    } else {
      markup = '' +
        `<div class="${validationType.type}-message" data-rule-id="${rule.id || rule.message}">
          ${$.createIcon({ classes: [`icon-${validationType.type}`], icon })}
          <pre class="audible">
            ${Locale.translate(validationType.titleMessageID)}
          </pre>
          <p class="message-text">${rule.message}</p>
        </div>`;
    }

    if (!isHelpMessage) {
      loc.addClass(rule.type === 'icon' ? 'custom-icon' : rule.type);
    }

    if (field.is(':radio')) {
      this.toggleRadioMessage(field, rule.message, validationType.type, markup, true);
    } else { // All other components
      loc.closest('.field, .field-short').find('.formatter-toolbar').addClass(validationType.type === 'icon' ? 'custom-icon' : validationType.type);
      loc.closest('.field, .field-short').append(markup);
      loc.closest('.field, .field-short').find('.colorpicker-container').addClass(validationType.type === 'icon' ? 'custom-icon' : validationType.type);
    }

    if (field.is('.spinbox')) {
      loc.closest('.spinbox-wrapper').addClass(validationType.type === 'icon' ? 'custom-icon' : validationType.type);
    }

    // Remove positive errors
    if (validationType.type === 'error') {
      field.parent().find('.icon-success').remove();
    }

    // Trigger an event
    field.triggerHandler(validationType.type, { field, message: rule.message });
    field.closest('form').triggerHandler(validationType.type, { field, message: rule.message });
  },

  /**
   * Shows an inline error message on a field
   * @private
   * @param {jQuery[]} field the field being modified
   */
  addPositive(field) {
    const svg = $.createIcon({ icon: 'success', classes: 'icon-success' });

    if (!$('.icon-success', field.parent('.field, .field-short')).length) {
      field.parent('.field, .field-short').append(svg);
    }
  },

  /**
   * Remove the message form the field if there is one and mark the field valid, if no other messages.
   * @private
   * @param {jQuery[]} field the field which is having its error removed
   * @param {string} rule The validation rule to remove
   * @param {boolean} triggerEvents If true events will be fired
  */
  removeMessage(field, rule, triggerEvents = true) {
    // see if anything to remove
    const loc = this.getField(field);
    const oldData = loc.data(`${rule.type}message`);
    const ruleId = rule.id || rule.message;

    if (!rule) {
      return;
    }

    if (rule.type === 'error' && !oldData || oldData.filter(rules => rules.id === ruleId).length === 0) {
      return;
    }

    // Remove the message from the array
    const newData = oldData.filter(rules => rules.id !== ruleId);
    const noMoreMessages = newData.length === 0;

    if (noMoreMessages) {
      loc.removeData(`${rule.type}message`);
    } else {
      loc.data(`${rule.type}message`, newData);
    }

    // Find the message by id and remove
    field.closest('.field, .field-short').find(`[data-rule-id="${rule.id || rule.message}"]`).remove();

    if (field.hasClass('dropdown') || field.hasClass('multiselect')) {
      field.parent().find(`.dropdown-wrapper > [data-rule-id="${rule.id || rule.message}"]`).off('click.validate').remove();
    }

    // Trigger valid and remove error / message classes
    if (noMoreMessages && rule.type === 'error' && triggerEvents) {
      field.triggerHandler('valid', { field, message: '' });
      field.closest('form').triggerHandler('valid', { field, message: '' });
    }

    if (!noMoreMessages) {
      return;
    }

    field.removeClass(`${rule.type} custom-icon`).data('isValid', true);

    if (field.hasClass('dropdown') || field.hasClass('multiselect')) {
      field.next().next().removeClass(`${rule.type} custom-icon`);
      field.next().find('div.dropdown').removeClass(`${rule.type} custom-icon`);
    }

    if (field.is(':radio')) {
      this.toggleRadioMessage(field, '', rule.type, '', false);
    }

    if (field.hasClass('spinbox')) {
      field.closest('.spinbox-wrapper').removeClass(`${rule.type} custom-icon`);
    }
    if (field.hasClass('colorpicker')) {
      field.parent('.colorpicker-container').removeClass(rule.type);
    }
    if (field.closest('.field-fileupload').length > 0) {
      field.closest('.field-fileupload').find(`input.${rule.type}`).removeClass(rule.type);
    }

    // Remove tooltip style message and tooltip
    if (field.attr(`data-${rule.type}-type`) === 'tooltip') {
      const errorIcon = field.closest('.field, .field-short').find('.icon-error');
      const tooltipAPI = errorIcon.data('tooltip');
      // Destroy tooltip
      if (tooltipAPI) {
        tooltipAPI.destroy();
      }
      if (this.inputs) {
        this.inputs.filter('input, textarea').off('focus.validate');
      }
      // Remove icon
      field.parent().find(`.dropdown-wrapper > .icon-${rule.type}`).off('click.validate').remove(); // SVG Error Icon
      field.parent().find(`.icon-${rule.type}`).remove();
      field.next(`.icon-${rule.type}`).off('click.validate').remove();
      field.parent('.field, .field-short').find(`.icon-${rule.type}`).remove();
      field.next('.inforCheckboxLabel').next(`.icon-${rule.type}`).remove();
    }
  },

  /**
   * Shows an inline error message on a field
   * @private
   * @param {jQuery[]} field the field being modified
   */
  removePositive(field) {
    $('.icon-success', field.parent('.field, .field-short')).remove();
  },

  /**
   * Reset all form errors and values
   * @param {jQuery[]} form The form to reset.
   */
  resetForm(form) {
    const formFields = form.find('input, select, textarea');

    // Clear Errors
    formFields.removeClass('error');
    form.find('.error').removeClass('error');
    form.find('.icon-error').remove();
    form.find('.icon-success').remove();
    form.find('.error-message').remove();

    // Clear Warnings
    formFields.removeClass('alert');
    form.find('.alert').removeClass('alert');
    form.find('.icon-alert').remove();
    form.find('.alert-message').remove();

    // Clear Informations
    formFields.removeClass('info');
    form.find('.info').removeClass('info');
    form.find('.icon-info').remove();
    form.find('.info-message').remove();

    setTimeout(() => {
      $('#validation-errors').addClass('is-hidden');
    }, 300);

    // Remove Dirty
    formFields.data('isDirty', false).removeClass('isDirty');
    form.find('.isDirty').removeClass('isDirty');

    // reset form data
    if (form.is('form')) {
      form[0].reset();
    }

    const validationTypes = $.fn.validation.ValidationTypes;
    Object.keys(validationTypes).forEach((validationType) => {
      formFields.removeData(`${validationType}message`);
    });
  },

  /**
   * See if any form errors and check for any empty required fields.
   * @param {jQuery[]} form The form to check.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  isFormValid(form) {
    if ($(form).find('.error-message').length > 0) {
      return false;
    }

    const formFields = $(form).find('[data-validate*="required"]');
    for (let i = 0; i < formFields.length; i++) {
      const field = $(formFields[i]);
      const value = this.value(field);

      if ((field.is(':visible') || field.is('select')) && !value) {
        return false;
      }
    }

    return true;
  },

  /**
   * Update method
   * @param {object} [settings] incoming settings
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }
    this.init();
  }

};

export { Validator, COMPONENT_NAME };
