import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { stringUtils as str } from '../utils/string';
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
    <select class="dropdown no-init">
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

      const compiledTmpl = Tmpl.compile(s.template);
      const renderedTmpl = compiledTmpl.render({ dataset: !s.dropdownOpts.source ? dataset : [] });
      const emptyTmpl = '' +
        `<label for="ffdropdown-empty" class="audible">
          ${Locale.translate('FieldFilter')}
        </label>
        <select id="ffdropdown-empty" name="ffdropdown-empty" class="dropdown no-init"></select>`;

      if (dataset.length > 0) {
        this.element.before(renderedTmpl);
      } else if (dataset.length === 0) {
        this.element.before(renderedTmpl || emptyTmpl);
      }

      // Set element id
      let id = this.element.attr('id') || this.element.attr('name');
      if (typeof id === 'undefined') {
        id = $.fn.uniqueId('fieldfilter-');
        this.element.attr('id', id);
      }
      const ffId = `${id}-ff`;

      // Set Field
      this.field = this.element.closest('.field');

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
      this.ffdropdown = this.field.find('select.dropdown');
      this.ffdropdown
        .attr({ id: ffId, named: ffId })
        .dropdown(s.dropdownOpts)
        .prev('label')
        .addClass('audible')
        .attr('for', ffId);

      // Add css classes
      this.field.addClass('fieldfilter-wrapper')
        .find('div.dropdown span').addClass('audible');

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
   * Attach Events used by the Control
   * @private
   * @returns {object} The api
   */
  handleEvents() {
    this.ffdropdown
      .on(`listopened.${COMPONENT_NAME}`, () => {
        // drowpdownWidth - border (52)
        $('#dropdown-list ul').width(this.element.outerWidth() + 52);
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
