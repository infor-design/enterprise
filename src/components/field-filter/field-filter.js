import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { stringUtils as str } from '../../utils/string';
import { Tmpl } from '../tmpl/tmpl';
import { Locale } from '../locale/locale';

// jQuery components
import '../dropdown/dropdown.jquery';

// Component Name
const COMPONENT_NAME = 'fieldfilter';

/**
 * Ability to have a dropdown next to the field.
 *
 * @class FieldFilter
 * @constructor
 *
 * @param {jQuery[]|HTMLElement} element The component element.
 * @param {object} [settings] The component settings.
 * @param {array} [settings.dataset]  Array of data
 * @param {object} [settings.dropdownOpts]  Gets passed to this control's dropdown
 * @param {string} [settings.template] An Html String with the mustache template for the view.
 */
const FIELDFILTER_DEFAULTS = {
  dataset: [],
  dropdownOpts: {}, // Dropdown custom settings
  template: '' +
  `<label>${Locale.translate('FieldFilter')}</label>
    <select class="dropdown no-init field-filter-dropdown">
      {{#dataset}}
        <option
          {{#value}} value="{{value}}"{{/value}}
          {{#selected}} selected{{/selected}}
          {{#disabled}} class="is-disabled" disabled{{/disabled}}
          {{#icon}} data-icon="{{icon}}"{{/icon}}
        >{{text}}</option>
      {{/dataset}}
    </select>`
};
function FieldFilter(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, FIELDFILTER_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// FieldFilter Methods
FieldFilter.prototype = {

  init() {
    this.render();
    this.handleEvents();
    this.setFiltered();
  },

  /**
   * Render the template against the dataset.
   * @private
   * @param {array} dataset  The dataset to use
   * @returns {void}
   */
  render(dataset) {
    const s = this.settings;
    dataset = dataset || s.dataset;
    // Render "mustache" Template
    if (typeof Tmpl === 'object' && dataset && s.template) {
      // create a copy of an inlined template
      if (s.template instanceof $) {
        s.template = `${s.template.html()}`;
      } else if (typeof s.template === 'string') {
        // If a string doesn't contain HTML elments,
        // assume it's an element ID string and attempt to select with jQuery
        if (!str.containsHTML(s.template)) {
          s.template = $(`#${s.template}`).html();
        }
      }

      const renderedTmpl = Tmpl.compile(s.template, { dataset: !s.dropdownOpts.source ? dataset : [] });  // eslint-disable-line
      const emptyTmpl = '' +
        `<label for="ffdropdown-empty" class="audible">
          ${Locale.translate('FieldFilter')}
        </label>
        <select id="ffdropdown-empty" name="ffdropdown-empty" class="dropdown no-init field-filter-dropdown"></select>`;

      if (dataset.length > 0) {
        this.element.before(renderedTmpl);
      } else if (dataset.length === 0) {
        this.element.before(renderedTmpl || emptyTmpl);
      }

      // Set element id
      let id = this.element.attr('id') || this.element.attr('name');
      if (typeof id === 'undefined') {
        id = utils.uniqueId(this.element, 'fieldfilter-');
        this.element[0].setAttribute('id', id);
      }
      const ffId = `${id}-ff`;

      // Set Field
      this.field = this.element.closest('.field, .field-short');

      // RTL list x-position
      const isRTL = Locale.isRTL();
      s.dropdownOpts = s.dropdownOpts || {};
      if (isRTL && typeof s.dropdownOpts === 'object') {
        if (s.dropdownOpts.placementOpts) {
          s.dropdownOpts.placementOpts.x = this.element.outerWidth();
        } else {
          s.dropdownOpts.placementOpts = { x: this.element.outerWidth() };
        }
      }

      // Set Dropdown
      s.dropdownOpts.cssClass = s.dropdownOpts.cssClass ? `${s.dropdownOpts.cssClass} ffdropdown` : 'ffdropdown';
      s.dropdownOpts.noSearch = true;

      // Find the field filter dropdown
      this.ffdropdown = this.field.find('select.dropdown.field-filter-dropdown');
      this.ffdropdown
        .dropdown(s.dropdownOpts)
        .prev('label')
        .addClass('audible');

      this.ffdropdown[0].setAttribute('id', ffId);
      this.ffdropdown[0].setAttribute('name', ffId);
      this.ffdropdown.prev('label')[0].setAttribute('for', ffId);

      // Add css classes
      const labelText = this.ffdropdown.prev('label').prev('label').text();
      this.field.addClass('fieldfilter-wrapper');
      this.field.find('div.dropdown span.audible').text(labelText);
      this.field.find('div.dropdown span').addClass('audible');

      // Dropdown api
      this.ddApi = this.ffdropdown.data('dropdown');
      if (this.ddApi && this.ddApi.icon) {
        this.ddApi.icon.addClass('ffdropdown-icon');
      }
    }
  },

  /**
   * Set currently filtered item
   * @private
   * @returns {object} The api
   */
  setFiltered() {
    if (this.ddApi) {
      const item = this.ddApi.element.find('option:selected');
      this.filtered = this.getTriggerData(item);
    }
    return this;
  },

  /**
   * Get currently triggerData for given item args
   * @private
   * @param {object} args selected item.
   * @returns {object} The api
   */
  getTriggerData(args) {
    const s = this.settings;
    const dataset = s.dropdownOpts.source && this.ddApi ? this.ddApi.dataset : s.dataset;
    return { idx: args.index(), item: args, data: dataset[args.index()] };
  },

  /**
   * Get current filter type
   * @returns {object} The current filter type
   */
  getFilterType() {
    this.setFiltered();
    return this.filtered;
  },

  /**
   * Set filter type to given value
   * @param {number|string} value to be set, index or value.
   * @returns {void}
   */
  setFilterType(value) {
    if (this.ddApi) {
      let newIdx = -1;
      const s = this.settings;
      const dataset = s.dropdownOpts.source && this.ddApi ? this.ddApi.dataset : s.dataset;

      if (typeof value === 'number' && value > -1 && value < dataset.length) {
        newIdx = value;
      } else if (typeof value === 'string') {
        let option = this.ffdropdown.find(`option[value="${value}"]`);
        if (!option.length) {
          option = this.ffdropdown.find('option').filter(function () {
            return $(this).text() === value;
          });
        }
        if (option.length) {
          newIdx = option.index();
        }
      }

      // Make filtered
      if (newIdx !== -1 && newIdx !== this.ffdropdown[0].selectedIndex) {
        this.ffdropdown[0].selectedIndex = newIdx;
        this.ddApi.updated();
        this.ffdropdown.triggerHandler('change');
        this.setFiltered();
        this.element.triggerHandler('filtered', [this.filtered]);
      }
    }
  },

  /**
   * Attach Events used by the Control
   * @private
   * @returns {object} The api
   */
  handleEvents() {
    this.ffdropdown
      .on(`listopened.${COMPONENT_NAME}`, () => {
        // drowpdownWidth - border (52)
        const extra = this.field.is('.field-short') ? 42 : 52;
        $('#dropdown-list ul').width(this.element.outerWidth() + extra);
      })
      .on(`selected.${COMPONENT_NAME}`, (e, args) => {
        /**
         * Fires after the value in the dropdown is selected.
         * @event filtered
         * @memberof FieldFilter
         * @property {object} event The jquery event object.
         * @property {object} data for selected item.
         */
        const triggerData = this.getTriggerData(args);
        this.element.triggerHandler('filtered', [triggerData]);
      });

    return this;
  }, // END: Handle Events -------------------------------------------------

  /**
   * Set component to readonly.
   * @returns {object} The api
   */
  readonly() {
    this.ffdropdown.readonly();
    return this;
  },

  /**
   * Set component to enabled.
   * @returns {object} The api
   */
  enable() {
    this.ffdropdown.enable();
    return this;
  },

  /**
   * Set component to disabled.
   * @returns {object} The api
   */
  disable() {
    this.ffdropdown.disable();
    return this;
  },

  /**
   * Removes event bindings from the instance.
   * @private
   * @returns {object} The api
   */
  unbind() {
    this.ffdropdown.off(`.${COMPONENT_NAME}`);

    // Remove Dropdown
    if (this.ddApi && typeof this.ddApi.destroy === 'function') {
      this.ddApi.destroy();
    }
    this.ffdropdown.add(this.ffdropdown.prev('label')).remove();

    return this;
  },

  /**
   * Resync the UI and Settings.
   * @param {object} settings The settings to apply.
   * @returns {object} The api
   */
  updated(settings) {
    if (typeof settings !== 'undefined') {
      this.settings = utils.mergeSettings(this.element[0], settings, FIELDFILTER_DEFAULTS);
    }
    return this
      .unbind()
      .init();
  },

  /**
   * Teardown process for this plugin
   * @returns {void}
   */
  destroy() {
    this.unbind();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { FieldFilter, COMPONENT_NAME };
