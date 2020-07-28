/* eslint-disable no-underscore-dangle */
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

// jQuery Components
import '../datagrid/datagrid.jquery'; //eslint-disable-line
import '../icons/icons.jquery';
import '../modal/modal.jquery';

// Component Name
const COMPONENT_NAME = 'lookup';

// Lookup components are "modal" (one on-screen at any given time)
let LOOKUP_GRID_ID = 'lookup-datagrid';

/**
 * Input element that opens a dialog with a list for selection.
 * @class Lookup
 * @param {jquery[]|htmlelement} element the base element
 * @param {object} [settings] incoming settings
 * @param {function} [settings.click] Provide a special function to run when the dialog opens to customize the interaction entirely.
 * @param {string} [settings.clickArguments={}] If a click method is defined, this flexible object can be passed
 * into the click method, and augmented with parameters specific to the implementation.
 * @param {string} [settings.field='id'] Field name to return from the dataset or can be a function which returns a string on logic
 * @param {string} [settings.title] Dialog title to show, or befault shows  field label + "Lookup"
 * @param {array} [settings.buttons] Pass dialog buttons or Cancel / Apply
 * @param {object} [settings.options] Options to pass to the datagrid
 * @param {function} [settings.beforeShow] Call back that executes async before the lookup is opened.
 * @param {string} [settings.modalContent] Custom modal markup can be sent in here
 * @param {boolean} [settings.editable=true] Can the user type text in the field
 * @param {boolean} [settings.autoApply=true] If set to false the dialog wont apply the value on clicking a value.
 * @param {function} [settings.validator] A function that fires to let you validate form items on open and select
 * @param {boolean} [settings.autoWidth=false] If true the field will grow/change in size based on the content selected.
 * @param {char} [settings.delimiter=','] A character being used to separate data strings
 * @param {int} [settings.minWidth=400] Applys a minimum width to the lookup
 * @param {boolean} [settings.clearable=false] Add an ability to clear the lookup field. If "true", it will affix an "x" button to the right section of the field.
 */
const LOOKUP_DEFAULTS = {
  click: null,
  field: 'id',
  title: null,
  buttons: [],
  options: null,
  beforeShow: null,
  modalContent: null,
  editable: true,
  autoApply: true,
  validator: null,
  autoWidth: false,
  clickArguments: {},
  delimiter: ',',
  minWidth: null,
  clearable: false
};

function Lookup(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, LOOKUP_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

Lookup.prototype = {

  /**
   * @returns {boolean} true if the Lookup is currently the active element.
   */
  get isFocused() {
    const active = document.activeElement;
    const inputIsActive = this.element.is(active);
    const wrapperHasActive = this.element.parent('.lookup-wrapper')[0].contains(active);
    const lookupModalHasActive = this.modal?.element[0].contains(active);
    return (inputIsActive || wrapperHasActive || lookupModalHasActive);
  },

  /**
   * @private
   * @returns {void}
   */
  init() {
    this.inlineLabel = this.element.closest('label');
    this.inlineLabelText = this.inlineLabel.find('.label-text');
    this.isInlineLabel = !!this.inlineLabelText.length;
    this.build();
    this.handleEvents();
    this.grid = null;
    this.selectedRows = null;
  },

  /**
   * Build the UI for the Lookup
   * @private
   * @returns {void}
   */
  build() {
    const lookup = this.element;

    // appends a wrapper to the lookup field.
    function getWrapperCSSClass() {
      let str = 'lookup-wrapper';

      if (lookup.is('.input-xs')) {
        str += ' xs';
      }
      if (lookup.is('.input-sm')) {
        str += ' sm';
      }
      if (lookup.is('.input-lg')) {
        str += ' lg';
      }

      return str;
    }
    let cssClass = getWrapperCSSClass();

    if (this.element.is('.has-actions')) {
      cssClass += ' has-actions-wrapper';
    }

    // Add Button
    this.icon = $('<span class="trigger"></span>').append($.createIcon('search-list'));
    if (this.isInlineLabel) {
      this.inlineLabel.addClass(cssClass);
    } else {
      this.container = $(`<span class="${cssClass}"></span>`);

      if (this.element.is('.field-options')) {
        const field = this.element.closest('.field');
        const fieldOptionsTrigger = field.find('.btn-actions');

        lookup
          .add(fieldOptionsTrigger)
          .add(fieldOptionsTrigger.next('.popupmenu'))
          .wrapAll(this.container);
      } else {
        lookup.wrap(this.container);
      }
    }

    lookup.after(this.icon);

    // Hide icon if lookup input is hidden
    if (lookup.hasClass('hidden')) {
      this.icon.addClass('hidden');
    }

    if (this.settings.autoWidth) {
      this.applyAutoWidth();
    }

    if (!this.minWidth) {
      this.settings.minWidth = this.settings.options && this.settings.options.paging ? 482 : 400;
    }

    // Add Masking to show the #
    if (lookup.attr('data-mask')) {
      lookup.mask();
    }

    if (this.element.is(':disabled')) {
      this.disable();
    }

    if (this.settings.clearable) {
      lookup.searchfield({ clearable: true });
    }

    if (!this.settings.editable) {
      this.element.attr('readonly', 'true').addClass('is-not-editable');
    }

    // Fix field options in case lookup is initialized after
    const wrapper = this.element.parent('.lookup-wrapper');
    if (wrapper.next().is('.btn-actions')) {
      if (this.element.data('fieldoptions')) {
        this.element.data('fieldoptions').destroy();
      }
      this.element.fieldoptions();
    }

    this.addAria();

    if (lookup.attr('autocomplete') === undefined) lookup.attr('autocomplete', 'off');
  },

  /**
   * Add/Update Aria
   * @private
   * @returns {void}
   */
  addAria() {
    const self = this;
    self.label = self.isInlineLabel ? self.inlineLabelText : $(`label[for="${self.element.attr('id')}"]`);
  },

  /**
   * Handle events on the field
   * @private
   * @returns {void}
   */
  handleEvents() {
    const self = this;

    this.icon.on('click.lookup', (e) => {
      self.openDialog(e);
    });

    // Down Arrow opens the dialog in this field
    this.element.on('keyup.lookup', (e) => {
      // If autocomplete open dont open list
      if ($('#autocomplete-list').length > 0) {
        return;
      }

      if (e.which === 40) {
        self.openDialog(e);
      }
    });
  },

  /**
   * Triggers tooltip
   * @private
   * @returns {void}
   */
  setTooltip() {
    setTimeout(() => {
      const isOverlapping = this.element[0].scrollWidth > this.element[0].offsetWidth;
      const tooltipApi = this.element.data('tooltip');

      if (isOverlapping) {
        this.element.tooltip({
          content: this.element.val()
        });
      } else if (tooltipApi && !isOverlapping) {
        tooltipApi.destroy();
      }
    }, 100);
  },

  /**
   * Create and Open the Dialog
   * @private
   * @param {jquery.event} e click or keyup event
   * @returns {void}
   */
  openDialog(e) {
    const self = this;

    // Don't try to re-open the lookup if it's already open.
    if (this.isOpen) {
      return;
    }

    /**
      * Fires before open dialog.
      *
      * @event beforeopen
      * @memberof Lookup
      * @property {object} event - The jquery event object
      */
    const canOpen = self.element.triggerHandler('beforeopen');
    if (canOpen === false) {
      return;
    }

    if (self.isDisabled() || (self.isReadonly() && !self.element.hasClass('is-not-editable'))) {
      return;
    }

    if (self.settings.click) {
      self.settings.click(e, this, self.settings.clickArguments);
      return;
    }

    this.isOpen = true;

    if (this.settings.beforeShow) {
      const response = function (grid) {
        if (grid) {
          self.createGrid(grid);
        }

        if (typeof grid === 'boolean' && grid === false) {
          return false;
        }

        self.createModal();
        /**
          * Fires on complete dialog open (for busy indicator).
          *
          * @event complete
          * @memberof Lookup
          * @property {object} event - The jquery event object
          */
        self.element.triggerHandler('complete'); // for Busy Indicator

        /**
          * Fires on open dialog.
          *
          * @event open
          * @memberof Lookup
          * @property {object} event - The jquery event object
          * @property {object} modal instance
          * @property {object} grid in lookup
          */
        self.element.trigger('open', [self.modal, self.grid]);

        if (self.settings.validator) {
          self.settings.validator(self.element, self.modal, self.grid);
        }
        return true;
      };

      /**
        * Fires before start open dialog (for busy indicator).
        *
        * @event start
        * @memberof Lookup
        * @property {object} event - The jquery event object
        */
      this.element.triggerHandler('start'); // for Busy Indicator
      this.settings.beforeShow(this, response);
      return;
    }

    if (!this.settings.options) {
      return;
    }

    self.createModal();
    self.element.trigger('open', [self.modal, self.grid]);
    self.modal.element.find('.btn-actions').removeClass('is-selected');

    // Set tabindex on first row
    if (self.grid) {
      self.grid.cellNode(0, 0, true).attr('tabindex', '0');
    }

    // Fix: IE-11 more button was not showing
    const thisMoreBtn = self.modal.element.find('.toolbar .more > .btn-actions');
    if (thisMoreBtn.length) {
      setTimeout(() => {
        utils.fixSVGIcons(thisMoreBtn);
      }, 600);
    }

    /**
      * Fires after open dialog.
      *
      * @event afteropen
      * @memberof Lookup
      * @property {object} event - The jquery event object
      * @property {object} modal instance
      * @property {object} grid in lookup
      */
    self.element.trigger('afteropen', [self.modal, self.grid]);

    if (self.settings.validator) {
      self.settings.validator(self.element, self.modal, self.grid);
    }
  },

  /**
   * Overidable function to create the modal dialog
   * @returns {void}
   */
  createModal() {
    const self = this;
    let content = `<div id="${LOOKUP_GRID_ID}"></div>`;
    const thisLabel = $(`label[for="${self.element.attr('id')}"]`);

    function getLabelText() {
      if (self.isInlineLabel) {
        return self.inlineLabelText;
      }
      if (thisLabel.length) {
        return thisLabel.clone().find('span').remove().end()
          .text();
      }
      if (self.settings.title) {
        return self.settings.title;
      }
      if (self.settings?.options?.toolbar?.title) {
        return self.settings?.options?.toolbar?.title;
      }
      return '';
    }
    const labelText = getLabelText();

    const settingContent = this.settings.modalContent;
    if (settingContent && settingContent instanceof jQuery) {
      content = settingContent;
      settingContent.show();
    }

    if (settingContent && !(settingContent instanceof jQuery)) {
      content = settingContent;
    }

    let buttons = this.settings.buttons;
    if (this.settings.options && this.settings.options.selectable === 'multiple' && buttons.length === 0 || (!self.settings.autoApply && buttons.length === 0)) {
      buttons = [{
        text: Locale.translate('Cancel'),
        click(e, modal) {
          modal.oldActive = self.element;
          modal.close();
        }
      }, {
        text: Locale.translate('Apply'),
        click(e, modal) {
          modal.oldActive = self.element;
          modal.close();
          self.insertRows();
        },
        isDefault: true
      }];
    }

    if (this.settings.options && this.settings.options.selectable === 'single' && buttons.length === 0 && self.settings.autoApply) {
      buttons = [{
        text: Locale.translate('Cancel'),
        click(e, modal) {
          modal.oldActive = self.element;
          modal.close();
        }
      }, {
        text: Locale.translate('Apply'),
        click(e, modal) {
          modal.oldActive = self.element;
          modal.close();
          self.insertRows();
        },
        isDefault: true
      }];
    }

    const hasKeywordSearch = this.settings.options && this.settings.options.toolbar &&
      this.settings.options.toolbar.keywordFilter;

    $('body').modal({
      triggerButton: this.element,
      title: labelText,
      content,
      buttons,
      cssClass: `lookup-modal${!hasKeywordSearch ? ' lookup-no-search' : ''}`
    }).off('open.lookup').on('open.lookup', () => {
      self.createGrid();
    })
      .off('close.lookup')
      .on('close.lookup', () => {
        delete self.isOpen;
        /**
          * Fires on close dialog.
          *
          * @event close
          * @memberof Lookup
          * @property {object} event - The jquery event object
          * @property {object} modal instance
          * @property {object} grid in lookup
          */
        self.element.triggerHandler('close', [self.modal, self.grid]);
        self.setTooltip();
      });

    self.modal = $('body').data('modal');
    if (!this.settings.title) {
      self.modal.element.find('.modal-title').append(' <span class="datagrid-result-count"></span>');
    }

    self.modal.element.off('afterclose.lookup').on('afterclose.lookup', () => {
      self.closeTearDown();
    });

    // Wait until search field available
    setTimeout(() => {
      $('.modal.is-visible .searchfield').on('keypress.lookup', (e) => {
        if (e.keyCode === 13) {
          return false; // Prevent for closing modal
        }
        return true;
      });
    }, 300);
  },

  /**
   * Tears down the modal/grid elements by removing events, markup, and component instances.
   * @private
   * @returns {void}
   */
  closeTearDown() {
    let search = $('.modal.is-visible .searchfield').off('keypress.lookup');
    if (search.data() && search.data('searchfield')) {
      search.data('searchfield').destroy();
    }

    if (search.data() && search.data('searchfield')) {
      search.data('searchfield').destroy();
      search.removeData();
    }
    search = null;

    if (this.grid && this.grid.destroy) {
      this.grid.deSelectAllRows();
      this.grid.clearFilter();
      this.grid.destroy();
      this.grid = null;
    }
  },

  /**
   * Take any number of arrays and merges them.
   * @private
   * @param {array} args any number of arrays
   * @returns {array} merged array
   */
  doMerge(...args) {
    const hash = {};
    const arr = [];
    for (let i = 0; i < args.length; i++) {
      for (let j = 0; j < args[i].length; j++) {
        if (hash[args[i][j]] !== true) {
          arr[arr.length] = args[i][j];
          hash[args[i][j]] = true;
        }
      }
    }
    return arr;
  },

  /**
   * Overridable Function in which we create the grid on the current UI dialog.
   * @interface
   * @param {jquery[]} grid jQuery wrapped element containing a pre-invoked datagrid instance
   * @returns {void}
   */
  createGrid(grid) {
    const self = this;
    let lookupGrid;

    if (grid) {
      lookupGrid = grid;
      LOOKUP_GRID_ID = grid.attr('id');
      self.settings.options = grid.data('datagrid').settings;
    } else {
      lookupGrid = self.modal.element.find(`#${LOOKUP_GRID_ID}`);
    }

    if (this.settings.minWidth) {
      lookupGrid = this.applyMinWidth(lookupGrid);
    }

    if (self.settings.options) {
      if (self.settings.options.selectable === 'single' && self.settings.autoApply) {
        self.settings.options.cellNavigation = false;
        lookupGrid.find('tr').addClass('is-clickable');
      }

      self.settings.options.isList = true;

      // Create grid (unless already exists from passed in grid)
      if (!lookupGrid.data('datagrid')) {
        lookupGrid.datagrid(self.settings.options);
      }
    }

    self.grid = lookupGrid.data('datagrid');
    if (!this.settings.title && self.modal) {
      self.modal.element.find('.title').not('.selection-count').remove();
    }

    const hasKeywordSearch = this.settings?.options?.toolbar?.keywordFilter;

    if (!hasKeywordSearch && self.modal) {
      self.modal.element.find('.toolbar').appendTo(self.modal.element.find('.modal-header'));
    }

    // Reset keyword search from previous loads
    if (hasKeywordSearch && self.grid) {
      if (!self.grid.filterExpr || (
        self.grid.filterExpr &&
        self.grid.filterExpr[0] &&
        self.grid.filterExpr[0].value !== '')) {
        self.grid.keywordSearch('');
      }
    }

    // Mark selected rows
    lookupGrid.off('selected.lookup');
    const val = self.element.val();
    if (val && !this.settings.options.source) {
      self.selectGridRows(val);
    }

    // Restore selected rows when pages change
    if (this.settings.options.source) {
      lookupGrid.off('afterpaging.lookup').on('afterpaging.lookup', () => {
        const fieldVal = self.element.val();
        this.selectGridRows(fieldVal);
      });
    }

    if (this.settings.options) {
      lookupGrid.on('selected.lookup', (e, selectedRows) => {
        // Only proceed if a row is selected
        if (!selectedRows || selectedRows.length === 0) {
          return;
        }

        if (self.settings.validator) {
          self.settings.validator(self.element, self.modal, self.grid);
        }

        if (self.settings.options.selectable === 'single' && self.settings.autoApply) {
          self.modal.close();
          self.insertRows();
        }
      });
    }

    // Set init values after render the grid
    if (this.settings.options.source) {
      this.grid.element.one('afterrender.lookup', () => {
        if (!this.initValues || (this.initValues && !this.initValues.length)) {
          this.initValues = [];
          const isMatch = (node, v) => ((node[this.settings.field] || '').toString() === v.toString());
          const fieldVal = this.element.val();
          if (fieldVal) {
            const fieldValues = (fieldVal.indexOf(this.settings.delimiter) > 1) ?
              fieldVal.split(this.settings.delimiter) : [fieldVal];
            fieldValues.forEach((v) => {
              this.initValues.push({
                value: v,
                visited: !!(this.grid.settings.dataset.filter(node => isMatch(node, v)).length) // eslint-disable-line
              });
            });
          }
        }
      });
    }
  },

  /**
   * Given a field value, select the row
   * @param {object} val incoming value from the grid row
   * @returns {void}
   */
  selectGridRows(val) {
    const selectedId = val;
    let adjust = false;

    if (!val) {
      return;
    }

    if (this.grid && this.settings.options.source) {
      for (let i = (this.grid._selectedRows.length - 1); i > -1; i--) {
        if (isNaN(this.grid._selectedRows[i].idx)) {
          this.grid._selectedRows.splice(i, 1);
        }
      }
    }

    // Multi Select
    if (selectedId.indexOf(this.settings.delimiter) > 1) {
      const selectedIds = selectedId.split(this.settings.delimiter);
      let isFound = false;

      for (let i = 0; i < selectedIds.length; i++) {
        isFound = this.selectRowByValue(this.settings.field, selectedIds[i]);

        if (this.grid && this.settings.options.source && !isFound) {
          const data = {};
          let foundInData = false;
          for (let j = 0; j < this.grid._selectedRows.length; j++) {
            if (this.grid._selectedRows[j].data[this.settings.field].toString() ===
              selectedIds[i].toString()) {
              foundInData = true;
            }
          }

          if (!foundInData) {
            data[this.settings.field] = selectedIds[i];
            this.grid._selectedRows.push({ data });
          }
          adjust = true;
        }
      }

      // There are rows selected off page. Update the count.
      if (adjust) {
        this.modal.element.find('.contextual-toolbar .selection-count').text(`${selectedIds.length} ${Locale.translate('Selected')}`);
      }
      return;
    }

    this.selectRowByValue(this.settings.field, selectedId);
  },

  /**
   * Find the row and select it based on select value / function / field value
   * @param {string} field the ID of the field whose value is to be returned.
   * @param {string} value the value to set.
   * @returns {boolean} True if the id is found.
   */
  selectRowByValue(field, value) {
    if (!this.settings.options) {
      return false;
    }

    const data = this.settings.options.source ?
      this.grid.settings.dataset :
      this.settings.options.dataset;
    const selectedRows = [];

    // in this case we will recall on source - server side paging
    if (!data) {
      return false;
    }

    for (let i = 0; i < data.length; i++) {
      let isMatch = false;
      if (typeof this.settings.match === 'function') {
        if (this.settings.match(value, data[i], this.element, this.grid)) {
          isMatch = true;
        }
      }

      if (typeof this.settings.match !== 'function' &&
        data[i][field]?.toString() === value?.toString()) {
        isMatch = true;
      }

      if (isMatch) {
        const rowIndex = this.grid.settings.source ? this.grid.actualRowIndex(this.grid.tableBody.find('tr').eq(i)) : i;
        selectedRows.push(rowIndex);
      }
    }

    if (this.grid && selectedRows.length > 0) {
      this.grid.selectRows(selectedRows, false, true);
      return true;
    }

    return false;
  },

  /**
   * Get the selected rows and return them to the UI
   * @returns {void}
   */
  insertRows() {
    let value = [];

    this.selectedRows = this.grid.selectedRows();

    for (let i = 0; i < this.selectedRows.length; i++) {
      let currValue = '';

      if (typeof this.settings.field === 'function') {
        currValue = this.settings.field(this.selectedRows[i].data, this.element, this.grid);
      } else {
        currValue = this.selectedRows[i].data[this.settings.field];
      }

      // Push the value/s to the Array.
      value.push(currValue);

      // Clear _selected tag
      const idx = this.selectedRows[i].idx;
      if (this.settings.options.dataset && this.settings.options.dataset[idx]) {
        delete this.settings.options.dataset[idx]._selected;
      }
    }

    // Eliminate duplicate values.
    value = value.filter((a, b) => value.indexOf(a) === b);

    /**
      * Fires on input value change.
      *
      * @event change
      * @memberof Lookup
      * @property {object} event - The jquery event object
      * @property {object} selected rows
      */
    this.element.val(value.join(this.settings.delimiter)).trigger('change', [this.selectedRows]);
    this.element.trigger('input', [this.selectedRows]);
    this.applyAutoWidth();
    this.element.focus();
  },

  /**
   * Enable the input.
   * @returns {void}
   */
  enable() {
    this.element.prop('disabled', false).prop('readonly', false);
    this.element.parent().removeClass('is-disabled');
  },

  /**
   * Disable the input.
   * @returns {void}
   */
  disable() {
    this.element.prop('disabled', true);
    this.element.parent().addClass('is-disabled');
  },

  /**
   * Make the input readonly.
   * @returns {void}
   */
  readonly() {
    this.element.prop('readonly', true);
  },

  /**
   * Make the input the size of the text.
   * @private
   * @returns {void}
   */
  applyAutoWidth() {
    const value = this.element.val();
    const length = value.length;
    const isUpperCase = (value === value.toUpperCase());
    const isNumber = !isNaN(value);

    this.element.attr('size', length + (isUpperCase && !isNumber ? 2 : 1));
  },

  /**
   * Apply the min width setting to the datagrid.
   * @private
   * @param {jquery[]} lookupGrid jQuery wrapped element
   * @returns {jquery[]} grid jQuery wrapped element with the css applied
   */
  applyMinWidth(lookupGrid) {
    if (this.settings.minWidth == null) {
      return lookupGrid;
    }

    // check that the minWidth is less than the windows width, so
    // that the control remains responsive
    if ($(window).width() > this.settings.minWidth) {
      this.modal.element.addClass('has-minwidth');
      const minWidth = `${this.settings.minWidth}px`;
      lookupGrid.css({
        'min-width': minWidth
      });
    }

    return lookupGrid;
  },

  /**
   * Input is disabled or not
   * @returns {boolean} whether or not the Input is disabled
   */
  isDisabled() {
    return this.element.prop('disabled');
  },

  /**
   * Input is readonly or not
   * @returns {boolean} whether or not the Input is readonly
   */
  isReadonly() {
    return this.element.prop('readonly');
  },

  /**
   * Updates the lookup instance with new settings
   * @param {object} settings incoming settings
   * @returns {void}
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }
  },

  /**
  * Send in a new data set to display in the datagrid in the lookup.
  * This will work whether or not the lookup is open or closed.
  * @param {object} dataset The array of data to show in the datagridgrid.
  * @param {object} pagerInfo The extra pager info object with information like activePage and pagesize.
  */
  updateDataset(dataset, pagerInfo) {
    this.settings.options.dataset = dataset;

    if (pagerInfo && pagerInfo.activePage) {
      this.settings.options.activePage = pagerInfo.activePage;
    }

    if (pagerInfo && pagerInfo.pagesize) {
      this.settings.options.pagesize = pagerInfo.pagesize;
    }

    if (this.grid) {
      this.grid.updateDataset(dataset, pagerInfo);
    }
  },

  /**
  * Teardown events and objects.
  * @returns {void}
  */
  destroy() {
    $('.modal .searchfield').off('keypress.lookup');
    $('body').off('open.lookup close.lookup');

    this.icon.off('click.lookup');
    this.icon.remove();

    this.element.off('keyup.lookup');
    this.element.unwrap();

    if (this.modal && this.modal.element) {
      this.modal.element.off('afterclose.lookup');
      if (typeof this.modal.destroy === 'function') {
        this.modal.destroy();
      }
    }

    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Lookup, COMPONENT_NAME };
