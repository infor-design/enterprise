/* eslint no-continue: "off" */
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

// jQuery Components
import '../datagrid/datagrid.jquery';
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
  typeahead: false, // Future TODO
  autoApply: true,
  validator: null,
  autoWidth: false
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
    this.icon = $('<span class="trigger" tabindex="-1"></span>').append($.createIcon('search-list'));
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

    if (this.settings.autoWidth) {
      this.applyAutoWidth();
    }

    // Add Masking to show the #
    if (lookup.attr('data-mask')) {
      lookup.mask();
    }

    if (this.element.is(':disabled')) {
      this.disable();
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
  },

  /**
   * Add/Update Aria
   * @private
   * @returns {void}
   */
  addAria() {
    const self = this;

    setTimeout(() => {
      self.label = self.isInlineLabel ? self.inlineLabelText : $(`label[for="${self.element.attr('id')}"]`);

      if (self.label) {
        self.label.append(`<span class="audible">${Locale.translate('UseEnter')}</span>`);
      }
    }, 500);
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
   * Create and Open the Dialog
   * @private
   * @param {jquery.event} e click or keyup event
   * @returns {void}
   */
  openDialog(e) {
    const self = this;
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
      self.settings.click(e, this);
      return;
    }

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
          self.element.focus();
          modal.close();
        }
      }, {
        text: Locale.translate('Apply'),
        click(e, modal) {
          const selectedRows = self.grid.selectedRows();
          modal.close();
          self.insertRows(selectedRows);
        },
        isDefault: true
      }];
    }

    if (this.settings.options && this.settings.options.selectable === 'single' && buttons.length === 0 && self.settings.autoApply) {
      buttons = [{
        text: Locale.translate('Cancel'),
        click(e, modal) {
          self.element.focus();
          modal.close();
        }
      }];
    }

    const hasKeywordSearch = this.settings.options && this.settings.options.toolbar &&
      this.settings.options.toolbar.keywordFilter;

    $('body').modal({
      title: labelText,
      content,
      buttons,
      cssClass: `lookup-modal${!hasKeywordSearch ? ' lookup-no-search' : ''}`
    }).off('open.lookup').on('open.lookup', () => {
      self.createGrid();
    })
      .off('close.lookup')
      .on('close.lookup', () => {
        self.element.focus();
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
      });

    self.modal = $('body').data('modal');
    if (!this.settings.title) {
      self.modal.element.find('.modal-title').append(' <span class="datagrid-result-count"></span>');
    }

    self.modal.element.off('beforeclose.lookup').on('beforeclose.lookup', () => {
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

    if (search.data() && search.data('toolbarsearchfield')) {
      search.data('toolbarsearchfield').destroy();
      search.removeData();
    }
    search = null;

    if (!this.grid) {
      this.grid.destroy();
    }
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
      self.modal.element.find('.title').remove();
    }

    const hasKeywordSearch = this.settings.options && this.settings.options.toolbar &&
      this.settings.options.toolbar.keywordFilter;

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
    if (val) {
      self.selectGridRows(val);
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
          setTimeout(() => {
            self.modal.close();
            self.insertRows();
          }, 100);
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

    if (!val) {
      return;
    }

    // Multi Select
    if (selectedId.indexOf(',') > 1) {
      const selectedIds = selectedId.split(',');

      for (let i = 0; i < selectedIds.length; i++) {
        this.selectRowByValue(this.settings.field, selectedIds[i]);
      }
      return;
    }

    this.selectRowByValue(this.settings.field, selectedId);
  },

  /**
   * Find the row and select it based on select value / function / field value
   * @param {string} field the ID of the field whose value is to be returned.
   * @param {string} value the value to set.
   * @returns {void}
   */
  selectRowByValue(field, value) {
    if (!this.settings.options) {
      return;
    }

    const data = this.settings.options.dataset;
    const selectedRows = [];

    for (let i = 0; i < data.length; i++) {
      if (typeof this.settings.match === 'function') {
        if (this.settings.match(value, data[i], this.element, this.grid)) {
          selectedRows.push(i);
        }

        continue;
      }

      if (data[i][field] === value) {
        selectedRows.push(i);
      }
    }

    if (this.grid) {
      this.grid.selectedRows(selectedRows);
    }
  },

  /**
   * Get the selected rows and return them to the UI
   * @returns {void}
   */
  insertRows() {
    let value = '';

    this.selectedRows = this.grid.selectedRows();

    for (let i = 0; i < this.selectedRows.length; i++) {
      let currValue = '';

      if (typeof this.settings.field === 'function') {
        currValue = this.settings.field(this.selectedRows[i].data, this.element, this.grid);
      } else {
        currValue = this.selectedRows[i].data[this.settings.field];
      }

      value += (i !== 0 ? ',' : '') + currValue;
    }

    /**
      * Fires on input value change.
      *
      * @event change
      * @memberof Lookup
      * @property {object} event - The jquery event object
      * @property {object} selected rows
      */
    this.element.val(value).trigger('change', [this.selectedRows]);
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
  * Teardown events and objects.
  * @returns {void}
  */
  destroy() {
    $.removeData(this.element[0], COMPONENT_NAME);
    this.element.off('click.dropdown keypress.dropdown');

    this.icon.remove();
    this.element.unwrap();

    if (this.label && this.label != null) {
      this.label.find('.audible').remove();
    }
  }
};

export { Lookup, COMPONENT_NAME };
