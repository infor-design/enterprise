/* eslint-disable no-underscore-dangle */
import * as debug from '../../utils/debug';
import { Environment as env } from '../../utils/environment';
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

// When passing on attributes from the Lookup component to its subcomponents (modal/grid),
// This helper appends suffixes representing those components to each attribute.
function addSuffixToAttributes(parentAttrs = [], childAttrs = [], suffix) {
  let attrs = [];
  if (!parentAttrs?.length && !childAttrs?.length) {
    return attrs;
  }

  // If no child attributes exist, just pass the parents on with the prefix
  if (!childAttrs?.length) {
    attrs = parentAttrs.map(obj => ({
      name: obj.name,
      value: `${obj.value}-${suffix}`
    }));
    return attrs;
  }

  if (!parentAttrs.length) {
    return childAttrs;
  }

  // If child attributes exist, only append the ones from the parent
  // that aren't defined in the child
  parentAttrs.forEach((attr) => {
    const childAttr = childAttrs.find(toolbarAttrs => toolbarAttrs.name === attr.name);
    attrs.push(childAttr || {
      name: attr.name,
      value: `${attr.value}-${suffix}`
    });
  });
  return attrs;
}

/**
 * Input element that opens a dialog with a list for selection.
 * @class Lookup
 * @param {jquery[]|htmlelement} element the base element
 * @param {object} [settings] incoming settings
 * @param {function} [settings.click] Provide a special function to run when the dialog opens to customize the interaction entirely.
 * @param {string} [settings.clickArguments={}] If a click method is defined, this flexible object can be passed
 * into the click method, and augmented with parameters specific to the implementation.
 * @param {function} [settings.clear] Provide a special function to run when the clear x is pressed
 * @param {string} [settings.clearArguments={}] If a clear method is defined, this flexible object can be passed
 * into the clear method, and augmented with parameters specific to the implementation.
 * @param {string} [settings.field='id'] Field name to return from the dataset or can be a function which returns a string on logic
 * @param {string} [settings.title] Dialog title to show, or befault shows  field label + "Lookup"
 * @param {string} [settings.icon] Swap out the lookup id for any other icon in the icon set by name
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
 * @param {boolean} [settings.tabbable=true] If true, causes the Lookup's trigger icon to be focusable with the keyboard.
 * @param {boolean} [settings.allowDuplicates=false] If true, will show all duplicate selected values in input element.
 */
const LOOKUP_DEFAULTS = {
  click: null,
  field: 'id',
  title: null,
  icon: 'icon-search-list',
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
  clearable: false,
  attributes: null,
  tabbable: true,
  allowDuplicates: false,
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

    // Add Button
    const next = this.element.next();
    if (next.is('button.trigger')) {
      this.icon = next;
    } else {
      this.icon = $(`<button class="btn-icon trigger" type="button">
        <span class="audible"></span>
        ${$.createIcon(this.settings.icon)}
      </button>`);

      const iconEl = this.icon.children('.icon');
      if (this.settings.icon !== 'icon-search-list') {
        iconEl.addClass('has-custom-icon');
      } else if (env.rtl) {
        iconEl.addClass('icon-rtl-rotate');
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

    if (!this.settings.editable) {
      this.element.attr('readonly', 'true').addClass('is-not-editable');
    }

    this.makeTabbable(this.settings.tabbable);

    if (this.settings.clearable) {
      lookup.searchfield({
        clearable: true,
        attributes: this.settings.attributes,
        tabbable: false
      });
    }

    if (this.settings.clearable && this.settings.clear) {
      lookup.on('cleared', (e) => {
        this.settings.clear(e, this, this.settings.clearArguments);
      });
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

    // Set attributes, if applicable
    if (Array.isArray(this.settings.attributes)) {
      utils.addAttributes(lookup, this, this.settings.attributes, 'input');
      utils.addAttributes(this.icon, this, this.settings.attributes, 'trigger');
    }
  },

  /**
   * Add/Update Aria
   * @private
   * @returns {void}
   */
  addAria() {
    this.label = this.isInlineLabel ? this.inlineLabelText : $(`label[for="${this.element.attr('id')}"]`);
    const pressDownMsg = `${Locale.translate('Lookup')}. ${Locale.translate('PressDown')}`;
    const span = this.label.children('span.audible');

    if (span.length) {
      span.text(pressDownMsg);
    } else {
      this.label.append(`<span class="audible">${pressDownMsg}</span>`);
    }

    // Add audible text to the trigger button
    const triggerBtnText = Locale.translate('LookupTriggerButton');
    this.icon.children('span.audible').text(triggerBtnText);
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
    this.isChanged = false;

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
          self.isOpen = false;
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
          modal.oldActive = self.icon;
          modal.close();
        }
      }, {
        text: Locale.translate('Apply'),
        click(e, modal) {
          modal.oldActive = self.icon;
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
          modal.oldActive = self.icon;
          modal.close();
        }
      }, {
        text: Locale.translate('Apply'),
        click(e, modal) {
          modal.oldActive = self.icon;
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
      cssClass: `lookup-modal${!hasKeywordSearch ? ' lookup-no-search' : ''}`,
      attributes: addSuffixToAttributes(this.settings.attributes, [], 'modal')
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
      $(this.grid.element).off('selected.lookup');
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

      if (self.settings.attributes) {
        self.settings.options.attributes = addSuffixToAttributes(
          self.settings.attributes,
          [],
          'datagrid'
        );
      }

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
      lookupGrid.off('afterpaging.lookup').on('afterpaging.lookup', (e, pagingInfo) => {
        const fieldVal = self.element.val();
        this.selectGridRows(fieldVal);
        this.element.trigger('afterpaging', [pagingInfo, this]);
      });
    }

    if (this.settings.options) {
      lookupGrid.on('selected.lookup', (e, selectedRows, op, rowData) => {
        this.isChanged = true;
        if (op === 'deselect') {
          if (!self.grid.recentlyRemoved) {
            self.grid.recentlyRemoved = [];
          }
          self.grid.recentlyRemoved.push(rowData);
        }

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
        self.element.trigger('selected', [selectedRows, op, rowData]);
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
      let isRemoved = false;

      for (let i = 0; i < selectedIds.length; i++) {
        isRemoved = false;

        if (this.grid.recentlyRemoved) {
          for (let j = 0; j < this.grid.recentlyRemoved.length; j++) {
            if (this.grid.recentlyRemoved[j][this.settings.field].toString() ===
              selectedIds[i].toString()) {
              isRemoved = true;
            }
          }
        }

        if (isRemoved) {
          continue;
        }
        isFound = this.selectRowByValue(this.settings.field, selectedIds[i]);

        if (this.grid && this.settings.options.source && !isFound) {
          let foundInData = false;
          for (let j = 0; j < this.grid._selectedRows.length; j++) {
            if (this.grid._selectedRows[j].data[this.settings.field].toString() ===
              selectedIds[i].toString()) {
              foundInData = true;
            }
          }

          if (this.grid.recentlyRemoved) {
            for (let j = 0; j < this.grid.recentlyRemoved.length; j++) {
              if (this.grid.recentlyRemoved[j][this.settings.field].toString() ===
                selectedIds[i].toString()) {
                foundInData = true;
              }
            }
          }

          if (!foundInData) {
            const data = {};
            data[this.settings.field] = selectedIds[i];
            this.grid._selectedRows.push({ data });
          }
          adjust = true;
        }
      }

      // There are rows selected off page. Update the count.
      if (adjust) {
        const self = this;
        self.modal.element.find('.contextual-toolbar .selection-count').text(`${selectedIds.length} ${Locale.translate('Selected')}`);
        this.grid.syncSelectedUI();
      }
    } else {
      // For Single Record Select
      const selectedIds = [];
      selectedIds.push(selectedId);
      let isFound = false;
      let isRemoved = false;

      for (let i = 0; i < selectedIds.length; i++) {
        if (this.grid.recentlyRemoved) {
          for (let j = 0; j < this.grid.recentlyRemoved.length; j++) {
            if (this.grid.recentlyRemoved[j][this.settings.field].toString() ===
              selectedIds[i].toString()) {
              isRemoved = true;
            }
          }
        }

        if (isRemoved) {
          continue;
        }
        isFound = this.selectRowByValue(this.settings.field, selectedIds[i]);

        if (this.grid && this.settings.options.source && !isFound) {
          let foundInData = false;
          for (let j = 0; j < this.grid._selectedRows.length; j++) {
            if (this.grid._selectedRows[j].data[this.settings.field].toString() ===
              selectedIds[i].toString()) {
              foundInData = true;
            }
          }

          if (this.grid.recentlyRemoved) {
            for (let j = 0; j < this.grid.recentlyRemoved.length; j++) {
              if (this.grid.recentlyRemoved[j][this.settings.field].toString() ===
                selectedIds[i].toString()) {
                foundInData = true;
              }
            }
          }

          if (!foundInData) {
            const data = {};
            data[this.settings.field] = selectedIds[i];
          }
          adjust = true;
        }

        if (isFound && this.grid.recentlyRemoved) {
          for (let j = 0; j < this.grid.recentlyRemoved.length; j++) {
            if (this.grid.recentlyRemoved[j][this.settings.field].toString() ===
              selectedIds[i].toString()) {
              adjust = false;
            }
          }
        }
      }

      // There are rows selected off page. Update the count.
      if (adjust) {
        const self = this;
        self.modal.element.find('.contextual-toolbar .selection-count').text(`${selectedIds.length} ${Locale.translate('Selected')}`);
        this.grid.syncSelectedUI();
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
    if (!this.isChanged) {
      return;
    }
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
    if (!this.settings.allowDuplicates) {
      value = value.filter((a, b) => value.indexOf(a) === b);
    }

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
    this.element.prop('disabled', false).prop('readonly', false).removeClass('is-not-editable');
    this.element.parent().removeClass('is-disabled');
    this.icon.prop('disabled', false);
  },

  /**
   * Disable the input.
   * @returns {void}
   */
  disable() {
    this.element.prop('disabled', true);
    this.element.parent().addClass('is-disabled');
    this.icon.prop('disabled', true);
  },

  /**
   * Make the input readonly.
   * @returns {void}
   */
  readonly() {
    this.element.prop('readonly', true);
    this.icon.prop('disabled', false);
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
   * @param {boolean} val if true, sets the trigger button to a focusable tab index
   */
  makeTabbable(val) {
    this.icon.attr('tabIndex', val ? 0 : -1);
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
