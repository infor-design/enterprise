/* eslint-disable no-underscore-dangle, no-continue, no-nested-ternary */
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { keyboard } from '../../utils/keyboard';
import { theme } from '../theme/theme';
import { excel } from '../../utils/excel';
import { Locale } from '../locale/locale';
import { Tmpl } from '../tmpl/tmpl';
import { debounce } from '../../utils/debounced-resize';
import { stringUtils } from '../../utils/string';
import { xssUtils } from '../../utils/xss';
import { DOM } from '../../utils/dom';
import { Environment as env } from '../../utils/environment';

import { Formatters } from './datagrid.formatters';
import { GroupBy, Aggregators } from './datagrid.groupby';
// eslint-disable-next-line
import { Editors } from '../datagrid/datagrid.editors';

// jQuery components
import '../../utils/animations';
import '../drag/drag.jquery';
import '../emptymessage/emptymessage.jquery';
import '../listview/listview.jquery';
import '../mask/mask-input.jquery';
import '../modal/modal.jquery';
import '../multiselect/multiselect.jquery';
import '../pager/pager.jquery';
import '../popupmenu/popupmenu.jquery';
import '../searchfield/searchfield.jquery';
import '../timepicker/timepicker.jquery';
import '../toolbar/toolbar.jquery';
import '../tooltip/tooltip.jquery';

// The name of this component.
const COMPONENT_NAME = 'datagrid';

/**
 * The Datagrid Component displays and process data in tabular format.
 * @class Datagrid
 * @constructor
 *
 * @param {jQuery[]|HTMLElement} element The component element.
 * @param {object}   [settings] The component settings.
 * @param {boolean}  [settings.actionableMode=false] If actionableMode is "true, tab and shift tab behave like left and right arrow key, if the cell is editable it goes in and out of edit mode. F2 - toggles actionableMode "true" and "false"
 * @param {boolean}  [settings.cellNavigation=true] If cellNavigation is "false, will show border around whole row on focus
 * @param {boolean}  [settings.rowNavigation=true] If rowNavigation is "false, will NOT show border around the row
 * @param {boolean}  [settings.showHoverState=true] If false there will be no hover effect.
 * @param {boolean}  [settings.alternateRowShading=false] Sets shading for readonly grids
 * @param {array}    [settings.columns=[]] An array of columns (see column options)
 * @param {array}    [settings.frozenColumns={ left: [], right: [] }] An object with two arrays of column id's. One for freezing columns to the left side, and one for freezing columns to the right side.
 * @param {boolean}  [settings.frozenColumns.expandRowAcrossAllCells=true] Expand the expandable across all frozen columns.
 * @param {array}    [settings.dataset=[]] An array of data objects
 * @param {boolean}  [settings.columnReorder=false] Allow Column reorder
 * @param {boolean}  [settings.saveColumns=false] Save Column Reorder and resize, this is deprecated, use saveUserSettings
 * @param {object}   [settings.saveUserSettings]
 * @param {object}   [settings.saveUserSettings.columns=true]
 * @param {object}   [settings.saveUserSettings.rowHeight=true]
 * @param {object}   [settings.saveUserSettings.sortOrdertrue]
 * @param {object}   [settings.saveUserSettings.pageSize=true]
 * @param {object}   [settings.saveUserSettings.activePage=true]
 * @param {object}   [settings.saveUserSettings.filter=true]
 * @param {boolean}  [settings.focusAfterSort=false] If true will focus the active cell after sorting.
 * @param {boolean}  [settings.editable=false] Enable editing in the grid, requires column editors.
 * @param {boolean}  [settings.selectOnEdit=true] if true, will select the cell text soon get to edit mode.
 * @param {Function}  [settings.isRowDisabled=null] Allows you to provide a function so you can set some rows to disabled base on data or row index.
 * @param {boolean}  [settings.isList=false] Makes the grid have readonly "list" styling
 * @param {string}   [settings.menuId=null]  ID of the menu to use for a row level right click context menu
 * @param {string}   [settings.menuSelected=null] Callback for the grid level context menu
 * @param {string}   [settings.menuBeforeOpen=null] Callback for the grid level beforeopen menu event
 * @param {string}   [settings.headerMenuId=null] Id of the menu to use for a header right click context menu
 * @param {string}   [settings.headerMenuSelected=false] Callback for the header level context menu
 * @param {string}   [settings.headerMenuBeforeOpen=false] Callback for the header level beforeopen menu event
 * @param {string}   [settings.uniqueId=null] Unique DOM ID to use as local storage reference and internal variable names
 * @param {string}   [settings.rowHeight=normal] Controls the height of the rows / number visible rows. May be (extra-small, small, medium or large) previous values of short, medium, normal are also mapped.
 * @param {number|string|function}   [settings.fixedRowHeight=null] Sets the height of the row to something other then the three built in rowHeights. If `auto` is used the row heights will be calculated, this can be expensive. This can also be a function that returns the row height dynamically.
 * @param {string}   [settings.selectable=false] Controls the selection Mode this may be: false, 'single' or 'multiple' or 'mixed' or 'siblings'
 * @param {null|function} [settings.onBeforeSelect=null] If defined as a function will fire as callback before rows are selected. You can return false to veto row selection.
 * @param {object}   [settings.groupable=null]  Controls fields to use for data grouping Use Data grouping, e.g. `{fields: ['incidentId'], supressRow: true, aggregator: 'list', aggregatorOptions: ['unitName1']}`
 * @param {boolean}  [settings.showNewRowIndicator=true] If true, the new row indicator will display after adding a row.
 * @param {string}   [settings.stretchColumn=null] If 'last' the last column will stretch to the end, otherwise specific columns can be targetted.
 * @param {boolean}  [settings.stretchColumnOnChange=true] If true, column will recalculate its width and stretch if required.
 * @param {boolean}  [settings.spacerColumn=false] If true an extra column will be added to the end that fills the space. This allows columns to not stretch to fill so they are a constant size. This setting cannot be used with percent columns.
 * @param {boolean}  [settings.stickyHeader=false] If true the data grid headers will stick to the top of the container the grid is in when scrolling down.
 * @param {boolean}  [settings.columnSizing='both'] Determines the sizing method for the auto sizing columns. Options are: both | data | header (including filter)
 * @param {boolean}  [settings.clickToSelect=true] Controls if using a selection mode if you can click the rows to select
 * @param {object}   [settings.toolbar=false]  Toggles and appends various toolbar features for example `{title: 'Data Grid Header Title', results: true, keywordFilter: true, filter: true, rowHeight: true, views: true}`
 * @param {boolean}  [settings.selectChildren=true] Will prevent selecting of all child nodes on a multiselect tree.
 * @param {boolean}  [settings.allowSelectAcrossPages=null] Makes it possible to save selections when changing pages on server side paging. You may want to also use showSelectAllCheckBox: false
 * @param {boolean}  [settings.selectAllCurrentPage=false] Select all will effect only on current page and its for client side paging only.
 * @param {boolean}  [settings.initializeToolbar=true] Set to false if you will initialize the toolbar yourself
 * @param {array}    [settings.columnIds=[]] An array of column IDs used to define aria descriptors for selection checkboxes.
 * @param {boolean}  [settings.paging=false] Enable paging mode
 * @param {number}   [settings.pagesize=25] Number of rows per page
 * @param {array}    [settings.pagesizes=[10, 25, 50, 75]] Array of page sizes to show in the page size dropdown.
 * @param {boolean}  [settings.indeterminate=false] Disable the ability to go to a specific page when paging.
 * @param {Function} [settings.source=false]  Callback function for paging
 * @param {boolean}  [settings.hidePagerOnOnePage=false]  If true, hides the pager if there's only one page worth of results.
 * @param {boolean}  [settings.filterable=false] Enable Column Filtering, This will require column filterTypes as well.
 * @param {boolean}  [settings.filterWhenTyping=true] Enable Column Filtering as you stop typing in inputs
 * @param {boolean}  [settings.disableClientFilter=false] Disable Filter Logic client side and let your server do it
 * @param {boolean}  [settings.disableClientSort=false] Disable Sort Logic client side and let your server do it
 * @param {string}   [settings.resultsText=null] Can provide a custom function to adjust results text on the toolbar
 * @param {boolean}  [settings.showFilterTotal=true] Paging results display filter count, change to false to not show filtered count
 * @param {boolean}  [settings.rowReorder=false] If set you can reorder rows. Requires a rowReorder formatter column.
 * @param {boolean}  [settings.resizeMode='flex'] Changes the column resize behavior.
 * `flex` will resize columns independently shifting other columns to fit the table layout if needed.
 * `fit` will resize using the neighbours column width. This is more useful with less columns.
 * If holding the Shift key you can use one of the other modes while dragging as a user.
 * @param {boolean}  [settings.showDirty=false]  If true the dirty indicator will be shown on the rows
 * @param {boolean}  [settings.showSelectAllCheckBox=true] Allow to hide the checkbox header (true to show, false to hide)
 * @param {boolean}  [settings.allowOneExpandedRow=true] Controls if you cna expand more than one expandable row.
 * @param {boolean}  [settings.enableTooltips=false] Process tooltip logic at a cost of performance
 * @param {boolean}  [settings.disableRowDeactivation=false] if a row is activated the user will not be able to deactivate it by clicking on the activated row
 * @param {boolean}  [settings.disableRowDeselection=false] if a row is selected the user will not be able to deselect it by clicking on the selected row again
 * @param {boolean}  [settings.sizeColumnsEqually=false] If true make all the columns equal width
 * @param {boolean}  [settings.expandableRow=false] If true we append an expandable row area without the rowTemplate feature being needed.
 * @param {boolean}  [settings.exportConvertNegative=false] If set to true export data with trailing negative signs moved in front.
 * @param {array}    [settings.columnGroups=null] An array of columns to use for grouped column headers.
 * @param {boolean}  [settings.treeGrid=false] If true a tree grid is expected so addition calculations will be used to calculate of the row children
 * @param {Function} [settings.onPostRenderCell=null] A call back function that will fire and send you the cell container and related information for any cells cells with a component attribute in the column definition.
 * @param {Function} [settings.onDestroyCell=null] A call back that goes along with onPostRenderCel and will fire when this cell is destroyed and you need noification of that.
 * @param {Function} [settings.onEditCell=null] A callback that fires when a cell is edited, the editor object is passed in to the function
 * @param {Function} [settings.onExpandRow=null] A callback function that fires when expanding rows. To be used. when expandableRow is true. The function gets eventData about the row and grid and a response function callback. Call the response function with markup to append and delay opening the row.
 * @param {Function} [settings.onExpandChildren=null] A callback function that fires when expanding children with treeGrid.
 * @param {Function} [settings.onCollapseChildren=null] A callback function that fires when collapseing children with treeGrid.
 * @param {Function} [settings.onKeyDown=null] A callback function that fires when any key is pressed down.
 * @param {boolean}  [settings.searchExpandableRow=true] If true keywordSearch will search in expandable rows (default). If false it will not search expandable rows.
 * @param {object}   [settings.emptyMessage]
 * @param {object}   [settings.emptyMessage.title='No Data Available']
 * @param {object}   [settings.emptyMessage.info='']
 * @param {object}   [settings.emptyMessage.icon='icon-empty-no-data']
 * @param {object}   [settings.emptyMessage.height=null]
 * An empty message will be displayed when there is no rows in the grid. This accepts an object of the form
 * emptyMessage: {title: 'No Data Available', info: 'Make a selection on the list above to see results',
 * icon: 'icon-empty-no-data', button: {text: 'Button Text', click: <function>}, height: null|'small'} set this to null for no message
 * or will default to 'No Data Found with an icon.'
 * height: The empty message container height. If set to 'small' will show only title and all other will not be render (like: icon, button, info)
 * @param {boolean} [settings.allowChildExpandOnMatch=false] Used with filter
 * if true:
 * and if only parent has a match then add all children nodes too
 * or if one or more child node got match then add parent node and all the children nodes
 * if false:
 * and if only parent has a match then make expand/collapse button to be collapsed, disabled
 * and do not add any children nodes
 * or if one or more child node got match then add parent node and only matching children nodes
 * @param {string} [settings.attributes] Add extra attributes like id's to the toast element. For example `attributes: { name: 'id', value: 'my-unique-id' }`
*/
const DATAGRID_DEFAULTS = {
  // F2 - toggles actionableMode "true" and "false"
  // If actionableMode is "true, tab and shift tab behave like left and right arrow key,
  // if the cell is editable it goes in and out of edit mode
  actionableMode: false,
  cellNavigation: true, // If cellNavigation is "false, will show border around whole row on focus
  rowNavigation: true, // If rowNavigation is "false, will NOT show border around the row
  showHoverState: true,
  alternateRowShading: false,
  columns: [],
  frozenColumns: {
    left: [],
    right: [],
    expandRowAcrossAllCells: true
  },
  dataset: [],
  columnReorder: false, // Allow Column reorder
  saveColumns: false, // Save Column Reorder and resize
  saveUserSettings: {},
  focusAfterSort: false, // If true will focus the active cell after sorting.
  editable: false,
  selectOnEdit: true,
  isRowDisabled: null,
  isList: false, // Makes a readonly "list"
  menuId: null, // Id to the right click context menu
  headerMenuId: null, // Id to the right click context menu to use for the header
  menuSelected: null, // Callback for the grid level right click menu
  menuBeforeOpen: null, // Call back for the grid level before open menu event
  headerMenuSelected: null, // Callback for the header level right click menu
  headerMenuBeforeOpen: null, // Call back for the header level before open menu event
  uniqueId: null, // Unique ID for local storage reference and variable names
  rowHeight: 'large', // extra-small, short, medium, normal - or older values: (short, medium or normal)
  fixedRowHeight: null,
  selectable: false, // false, 'single' or 'multiple' or 'siblings'
  selectChildren: true, // can prevent selecting of all child nodes on multiselect
  onBeforeSelect: null,
  allowSelectAcrossPages: null,
  selectAllCurrentPage: false, // Select all will effect only on current page and its for client side paging only
  groupable: null,
  showNewRowIndicator: true,
  stretchColumn: null,
  stretchColumnOnChange: false,
  spacerColumn: false,
  stickyHeader: false,
  columnSizing: 'all',
  twoLineHeader: false,
  clickToSelect: true,
  toolbar: false,
  initializeToolbar: true, // can set to false if you will initialize the toolbar yourself
  columnIds: [],
  // Paging settings
  paging: false,
  pagesize: 25,
  pagesizes: [10, 25, 50, 75],
  showPageSizeSelector: true, // Will show page size selector
  indeterminate: false, // removed ability to go to a specific page.
  source: null, // callback for paging
  hidePagerOnOnePage: false, // If true, hides the pager if there's only one page worth of results.
  // Filtering settings
  filterable: false,
  filterWhenTyping: true,
  disableClientFilter: false, // Disable Filter Logic client side and let your server do it
  disableClientSort: false, // Disable Sort Logic client side and let your server do it
  resultsText: null, // Can provide a custom function to adjust results text
  showFilterTotal: true, // Paging results show filtered count, false to not show.
  virtualized: false, // Prevent Unused rows from being added to the DOM
  virtualRowBuffer: 10, // how many extra rows top and bottom to allow as a buffer
  rowReorder: false, // Allows you to reorder rows. Requires rowReorder formatter
  showDirty: false,
  resizeMode: 'flex',
  showSelectAllCheckBox: true, // Allow to hide the checkbox header (true to show, false to hide)
  allowOneExpandedRow: true, // Only allows one expandable row at a time
  enableTooltips: false, // Process tooltip logic at a cost of performance
  disableRowDeactivation: false,
  disableRowDeselection: false,
  sizeColumnsEqually: false, // If true make all the columns equal width
  expandableRow: false, // Supply an empty expandable row template
  exportConvertNegative: false, // Export data with trailing negative signs moved in front
  columnGroups: null, // The columns to use for grouped column headings
  treeGrid: false,
  onPostRenderCell: null,
  onDestroyCell: null,
  onEditCell: null,
  onExpandRow: null,
  onExpandChildren: null, // Callback fires when expanding children with treeGrid
  onCollapseChildren: null, // Callback fires when collapseing children with treeGrid
  onKeyDown: null,
  emptyMessage: { title: (Locale ? Locale.translate('NoData') : 'No Data Available'), info: '', icon: 'icon-empty-no-data', height: null },
  searchExpandableRow: true,
  allowChildExpandOnMatch: false,
  attributes: null
};

function Datagrid(element, settings) {
  this.settings = utils.mergeSettings(element, settings, DATAGRID_DEFAULTS);
  this.element = $(element);
  if (settings.dataset) {
    this.settings.dataset = settings.dataset;
  }
  if (typeof this.settings.frozenColumns.expandRowAcrossAllCells === 'undefined') {
    this.settings.frozenColumns.expandRowAcrossAllCells = DATAGRID_DEFAULTS.frozenColumns.expandRowAcrossAllCells; // eslint-disable-line
  }
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

/**
* Actual Datagrid prototype
* @private
*/
Datagrid.prototype = {

  /**
   * @returns {Pager} IDS Pager component API.
   */
  get pagerAPI() {
    let api;
    if (this.tableBody && this.tableBody.length) {
      api = this.tableBody.data('pager');
    }
    return api;
  },

  /**
  * Init the datagrid from its uninitialized state.
  * @private
  * @returns {void}
  */
  init() {
    const html = $('html');

    this.isTouch = env.features.touch;
    this.isSafari = html.is('.is-safari');
    this.isWindows = (navigator.userAgent.indexOf('Windows') !== -1);
    this.appendTooltip();
    this.initSettings();
    this.setOriginalColumns();
    this.removeToolbarOnDestroy = false;
    this.nonVisibleCellErrors = [];
    this.recordCount = 0;
    this.canvas = null;
    this.totalWidths = { left: 0, center: 0, right: 0 };
    this.stretchColumnWidth = 0;
    this.stretchColumnDiff = 0;
    this.stretchColumnIdx = -1;
    this.editor = null; // Current Cell Editor thats in Use
    this.activeCell = { node: null, cell: null, row: null }; // Current Active Cell
    this.dontSyncUi = false;
    this.widthPercent = false;
    this.rowSpans = [];
    this.filterRowRendered = false; // Flag used to determine if the header is rendered or not.
    this.scrollLeft = 0;
    this.scrollTop = 0;
    this._selectedRows = [];
    this.restoreColumns();
    this.restoreUserSettings();
    this.appendToolbar();
    this.setTreeDepth();
    this.setRowGrouping();
    this.setTreeRootNodes();
    this.firstRender();
    this.handleEvents();
    this.handleKeys();

    /**
     * Fires after the grid is rendered.
    * @event rendered
    * @memberof Datagrid
    * @property {object} event - The jquery event object
    * @property {array} ui - An array with references to the domElement, header and pagerBar
    */
    this.element.trigger('rendered', [this.element, this.element.find('thead'), this.pagerAPI]);
  },

  /**
  * Initialize internal variables and states.
  * @private
  */
  initSettings() {
    this.ignoredColumnById('rowStatus');
    this.setInlineActionableMode();
    this.sortColumn = { sortField: null, sortAsc: true };
    this.gridCount = $('.datagrid').length + 1;
    this.lastSelectedRow = 0; // Remember index to use shift key

    this.contextualToolbar = this.element.prev('.contextual-toolbar');
    this.contextualToolbar.addClass('datagrid-contextual-toolbar');
  },

  /**
  * Ignore given Column from settings.
  * @private
  * @param {string} columnId for column to be ignored
  * @returns {void}
  */
  ignoredColumnById(columnId) {
    const s = this.settings;
    if (!columnId || !s.columns || (s.columns && !s.columns.length)) {
      return;
    }
    const column = { index: -1 };
    for (let i = 0, l = s.columns.length; i < l; i++) {
      if (s.columns[i].id === columnId) {
        column.index = i;
      }
    }
    if (column.index > -1) {
      s.columns.splice(column.index, 1);
    }
  },

  /**
  * Set `actionableMode` if found inlineEditor.
  * @private
  * @returns {void}
  */
  setInlineActionableMode() {
    const s = this.settings;
    if (!s.columns || (s.columns && !s.columns.length)) {
      return;
    }
    const column = { index: -1 };
    for (let i = 0, l = s.columns.length; i < l; i++) {
      if (s.columns[i].inlineEditor) {
        column.index = i;
      }
    }
    this.inlineMode = column.index > -1;
    if (this.inlineMode) {
      this.element[0].classList.add('has-inline-editor');
      this.settings.actionableMode = true;
    } else {
      this.element[0].classList.remove('has-inline-editor');
    }
  },

  /**
   * Render or render both the header and row area.
   * @param {string} isToggleFilter Check if filterrow type should be passed to the data source request
   * @param {object} pagingInfo information about the pager state
   * @returns {void}
   */
  render(isToggleFilter, pagingInfo) {
    if (!pagingInfo) {
      pagingInfo = {};
    }

    if (isToggleFilter) {
      pagingInfo.type = 'filterrow';
    }

    if (this.settings.source) {
      pagingInfo.preserveSelected = this.settings.allowSelectAcrossPages;
      this.triggerSource(pagingInfo);
      return;
    }

    this.loadData(this.settings.dataset, pagingInfo);
  },

  /**
  * Run the initial render on the Header and Rows.
  * @private
  */
  firstRender() {
    const self = this;
    this.hasLeftPane = this.settings.frozenColumns.left.length > 0;
    this.hasRightPane = this.settings.frozenColumns.right.length > 0;

    if (this.hasLeftPane) {
      self.bodyWrapperLeft = $('<div class="datagrid-wrapper left"></div>');
      self.tableLeft = $('<table></table>').addClass('datagrid').attr('role', this.settings.treeGrid ? 'treegrid' : 'grid').appendTo(self.bodyWrapperLeft);
      self.element.append(self.bodyWrapperLeft);
    }

    self.bodyWrapperCenter = $(`<div class="datagrid-wrapper center scrollable-x${!this.hasRightPane ? ' scrollable-y' : ''}"></div>`);
    self.table = $('<table></table>').addClass('datagrid').attr('role', this.settings.treeGrid ? 'treegrid' : 'grid').appendTo(self.bodyWrapperCenter);
    self.element.append(self.bodyWrapperCenter);

    if (this.hasRightPane) {
      self.bodyWrapperRight = $('<div class="datagrid-wrapper right scrollable-y"></div>');
      self.tableRight = $('<table></table>').addClass('datagrid').attr('role', this.settings.treeGrid ? 'treegrid' : 'grid').appendTo(self.bodyWrapperRight);
      self.element.append(self.bodyWrapperRight);
    }

    this.element.removeClass('datagrid').addClass('datagrid-container').attr('x-ms-format-detection', 'none');

    if (this.settings.stickyHeader) {
      this.element.removeClass('datagrid').addClass('is-sticky');
    }

    // initialize row height by a setting
    if (this.settings.rowHeight !== 'normal' && this.settings.rowHeight !== 'large') {
      let rowHeight = this.settings.rowHeight === 'short' ? 'small' : this.settings.rowHeight;
      rowHeight = this.settings.rowHeight === 'normal' ? 'large' : rowHeight;

      if (this.hasLeftPane) {
        self.tableLeft.addClass(`${rowHeight}-rowheight`);
      }
      self.table.addClass(`${rowHeight}-rowheight`);
      if (this.hasRightPane) {
        self.tableRight.addClass(`${rowHeight}-rowheight`);
      }
      this.element.addClass(`${rowHeight}-rowheight`);
    }

    if (this.settings.isList) {
      $(this.element).addClass('is-gridlist');
    } else {
      $(this.element).removeClass('is-gridlist');
    }

    self.table.empty();
    self.clearCache();
    self.container = self.element.closest('.datagrid-container');
    self.renderRows();
    self.renderHeader();

    if (this.stretchColumnDiff < 0) {
      const currentCol = this.bodyColGroup.find('col').eq(self.getStretchColumnIdx())[0];
      currentCol.style.width = `${this.stretchColumnWidth}px`;
    }

    if (this.settings.emptyMessage) {
      self.setEmptyMessage(this.settings.emptyMessage);
      self.checkEmptyMessage();
    }

    self.buttonSelector = '.btn, .btn-secondary, .btn-primary, .btn-modal-primary, .btn-tertiary, .btn-icon, .btn-actions, .btn-menu, .btn-split';
    $(self.buttonSelector, self.table).button();

    this.handlePaging();
    this.triggerSource('initial');
  },

  /**
  * Add a row of data to the grid and dataset.
  * @param {object} data An data row object
  * @param {string} location Where to add the row. This can be 'bottom' or 'top', default is top.
  */
  addRow(data, location) {
    const self = this;
    let isTop = false;
    let row = 0;
    const cell = 0;
    let args;
    let rowNode;

    // Get first or last index of matching key/value
    function getIndexByKey(array, key, value, isReverse) {
      for (let i = 0, l = array.length; i < l; i++) {
        const idx = isReverse ? ((l - 1) - i) : i;
        if (array[idx][key] === value) {
          return idx;
        }
      }
      return -1;
    }

    if (!location || location === 'top') {
      location = 'top';
      isTop = true;
    }

    // Add row status
    const newRowStatus = { icon: 'new', text: Locale.translate('New'), tooltip: Locale.translate('New') };

    data = data || {};
    data.rowStatus = data.rowStatus || newRowStatus;

    this.saveDirtyRows();

    let dataset = this.settings.dataset;

    if (this.settings.groupable) {
      dataset = this.originalDataset || dataset;
      let targetIndex = -1;
      if (typeof location === 'string') {
        const field = this.settings.groupable.fields[0];
        const idx = getIndexByKey(dataset, field, data[field], !isTop);
        targetIndex = idx > -1 ? (!isTop ? (idx + 1) : idx) : 0;
        dataset.splice(targetIndex, 0, data);
        row = targetIndex;
      } else {
        dataset.splice(location, 0, data);
        row = location;
      }
    } else if (typeof location === 'string') {
      dataset[isTop ? 'unshift' : 'push'](data);
      row = isTop ? row : dataset.length - 1;
    } else {
      dataset.splice(location, 0, data);
      row = location;
    }

    this.restoreDirtyRows();
    this.setRowGrouping();

    if (!this.settings.groupable) {
      this.pagerRefresh(location);
    }

    // Update selected
    this._selectedRows.forEach((selected) => {
      if (typeof selected.pagingIdx !== 'undefined' && selected.pagingIdx >= row) {
        selected.idx++;
        selected.pagingIdx++;
      }
    });

    // Add to ui
    this.clearCache();
    this.renderRows();

    if (this.settings.groupable) {
      rowNode = this.dataRowNode(row);
      row = this.visualRowIndex(rowNode);
    }

    // Sync with others
    this.syncSelectedUI();

    // Set active and fire handler
    setTimeout(() => {
      self.setActiveCell(row, cell);
      if (!this.settings.groupable) {
        rowNode = this.visualRowNode(row);
      }
      args = { row, cell, target: rowNode, value: data, oldValue: {} };

      /**
       * Fires after a row is added via the api.
      * @event addrow
      * @memberof Datagrid
      * @property {object} event The jquery event object
      * @property {number} args.row The row index
      * @property {number} args.cell The cell index
      * @property {HTMLElement} args.target The html element.
      * @property {object} args.value - An object all the row data.
      * @property {object} args.oldValue - Always an empty object added for consistent api.
      */
      self.element.triggerHandler('addrow', args);
    }, 100);
  },

  /**
  * Refresh the pager based on the current page and dataset.
  * @private
  * @param {object} location Can be set to 'top' or left off for bottom pager.
  * @param {boolean} savePage if true the activate page will be restored.
  */
  pagerRefresh(location, savePage) {
    if (!this.pagerAPI) {
      return;
    }

    const pagingInfo = {};

    if (typeof location === 'string') {
      pagingInfo.activePage = location === 'top' ? 1 : this.pagerAPI.state.pages;
    } else if (typeof location === 'number') {
      pagingInfo.activePage = Math.floor(location / (this.pagerAPI.settings.pagesize + 1));
    }

    if (!this.settings.source) {
      pagingInfo.total = this.settings.dataset.length;
      pagingInfo.pagesize = this.settings.pagesize;
    }
    if (savePage) {
      pagingInfo.activePage = this.settings.pagesize * this.pagerAPI.activePage >
        this.settings.dataset.length ? 1 : this.pagerAPI.activePage;
    }
    this.renderPager(pagingInfo, true);
  },

  /**
  * Remove a row of data to the grid and dataset.
  * @param {number} row The row index
  * @param {boolean} noSync Dont sync the selected rows.
  * @param {boolean} noTrigger If true, do not trigger the removerow event.
  * @returns {object|boolean} If noTrigger is true then return the event args otherwise nothing is returned
  */
  removeRow(row, noSync, noTrigger) {
    const rowNode = this.tableBody.find(`tr[aria-rowindex="${row + 1}"]`);
    const arrayToUse = this.settings.groupable &&
        this.originalDataset ? this.originalDataset : this.settings.dataset;
    const rowData = arrayToUse[row];

    this.saveDirtyRows();

    this.unselectRow(row, noSync);
    arrayToUse.splice(row, 1);
    this.restoreDirtyRows();

    if (this.settings.selectable) {
      if (!this.settings.groupable && (this.settings.groupable && this.originalDataset)) {
        this.syncDatasetWithSelectedRows();
      }
    }

    this.preventSelection = true;
    if (!noSync) {
      this.setRowGrouping();
      this.pagerRefresh('top', true);
      this.clearCache();
      this.renderRows();
    }

    if (this.nonVisibleCellErrors.length !== 0) {
      this.nonVisibleCellErrors = $.grep(this.nonVisibleCellErrors, error => error.row !== row);
      this.showNonVisibleCellErrors();
    }
    delete this.preventSelection;
    this.syncSelectedUI();

    const args = { row, cell: null, target: rowNode, item: rowData, oldValue: rowData };

    if (!noTrigger) {
      /**
      *  Fires after a row is removed via the api
      * @event rowremove
      * @memberof Datagrid
      * @property {object} event The jquery event object
      * @property {object} args Object with the arguments
      * @property {number} args.row The row index
      * @property {number} args.cell The cell index
      * @property {HTMLElement} args.target The row node that is being dragged.
      * @property {HTMLElement} args.item The dragged rows data.
      */
      this.element.trigger('rowremove', args);
    } else {
      return args;
    }

    return true;
  },

  /**
  * Remove all selected rows from the grid and dataset.
  * @param {boolean} isTrigger if true will trigger `rowremove` one time only with all selection data for more then one selected.
  */
  removeSelected(isTrigger) {
    this._selectedRows.sort((a, b) => (a.idx < b.idx ? -1 : (a.idx > b.idx ? 1 : 0)));
    const args = [];

    for (let i = this._selectedRows.length - 1; i >= 0; i--) {
      args.push({
        row: this._selectedRows[i].idx,
        item: this._selectedRows[i],
        cell: null,
        target: null
      });
      this.removeRow(this._selectedRows[i].idx, i > 0, isTrigger);
    }

    if (isTrigger) {
      this.element.trigger('rowremove', args);
    }
  },

  /**
  * Send in a new data set to display in the datagrid.
  * @param {object} dataset The array of objects to show in the grid. Should match
  * the column definitions.
  * @param {object} pagerInfo The pager info object with information like activePage ect.
  */
  updateDataset(dataset, pagerInfo) {
    if (this.settings.toolbar && this.settings.toolbar.keywordFilter) {
      const searchField = this.element.parent().find('.toolbar').find('.searchfield');
      searchField.val('');
      searchField.parent().removeClass('has-text');

      this.clearFilter();
    }

    this.loadData(dataset, pagerInfo);
  },

  /**
  * Trigger the source method to call to the backend on demand.
  * @param {object|string} [pagerType=undefined] The pager info object with information like activePage ect.
  * @param {function} callback The call back functions
  * @param {string} [op=undefined] an optional info string that can be applied to identify which operation cause the source call
  */
  triggerSource(pagerType, callback, op) {
    if (!this.settings.source) {
      return;
    }

    const self = this;
    let pagingInfo = {};
    if (this.pagerAPI) {
      pagingInfo = this.pagerAPI.state;
    }

    if (typeof pagerType === 'string') {
      pagingInfo.type = pagerType;
      pagingInfo.trigger = op;
    } else if (pagerType) {
      pagingInfo = utils.extend({}, pagingInfo, pagerType);
    }

    if (callback && typeof callback !== 'function') {
      if (typeof callback.type === 'string') {
        pagingInfo.type = callback.type;
      }
    }

    /**
    * Fires just before changing page. Returning false from the request function will cancel paging.
    * @event beforepaging
    * @memberof Pager
    * @property {object} event - The jquery event object
    * @property {function} request - The paging request info
    */
    const doPaging = this.element.triggerHandler('beforepaging', pagingInfo);
    if (doPaging === false) {
      return;
    }

    function response(data, updatedPagingInfo) {
      if (updatedPagingInfo.activePage > -1) {
        self.activePage = updatedPagingInfo.activePage;
      }

      if (updatedPagingInfo.grandTotal) {
        self.grandTotal = updatedPagingInfo.grandTotal;
      }

      // Set the remote dataset on the grid
      self.loadData(data, updatedPagingInfo);

      if (callback && typeof callback === 'function') {
        callback(true);
      }

      /**
      * Fires after changing paging has completed for source operations.
      * @event afterpaging
      * @memberof Datagrid
      * @property {object} event - The jquery event object
      * @property {object} pagingInfo - The paging info object
      */
      self.element.trigger('afterpaging', pagingInfo);
      self.afterPaging(pagingInfo);
    }

    if (this.sortColumn && this.sortColumn.sortId) {
      pagingInfo.sortAsc = this.sortColumn.sortAsc;
      pagingInfo.sortField = this.sortColumn.sortField;
      pagingInfo.sortId = this.sortColumn.sortId;
    }

    if (this.filterExpr && this.filterExpr.length) {
      pagingInfo.filterExpr = this.filterExpr;
    }

    /**
     * Fires when change page.
     * @event paging
     * @memberof Pager
     * @property {object} event The jquery event object
     * @property {object} request The paging request object
     */
    this.element.trigger('paging', pagingInfo);

    this.settings.source(pagingInfo, response);
  },

  /**
   * Do some work after changing the page
   * @param {object} pagingInfo Info about the paging operation
   * @private
   */
  afterPaging(pagingInfo) {
    if (!this.settings.paging) {
      return;
    }

    if (this.settings.source) {
      // Hide the entire pager bar if we're only showing one page, if applicable
      if (this.pagerAPI && this.pagerAPI.hidePagerBar(pagingInfo)) {
        this.element.removeClass('paginated');
      } else {
        this.element.addClass('paginated');
      }

      if (pagingInfo.total) {
        this.recordCount = pagingInfo.total;
        this.displayCounts(pagingInfo.total);
      }
    }

    if (!this.settings.source && this.filterExpr && this.filterExpr[0] && this.filterExpr[0].column === 'all') {
      this.highlightSearchRows(this.filterExpr[0].value);
    }
  },

  /**
  * Send in a new data set to display in the datagrid. Use better named updateDataset
  * @private
  * @param {object} dataset The array of objects to show in the grid.
  * Should match the column definitions.
  * @param {object} pagerInfo The pager info object with information like activePage ect.
  */
  loadData(dataset, pagerInfo) {
    this.settings.dataset = dataset;

    if (!pagerInfo) {
      pagerInfo = {};
    }

    if (pagerInfo.type === 'filterrow') {
      pagerInfo.activePage = this.pagerAPI && this.pagerAPI.activePage || 1;
      pagerInfo.pagesize = this.settings.pagesize;
      pagerInfo.total = pagerInfo.total || -1;
      pagerInfo.type = 'filterrow';
    }

    if (!pagerInfo.activePage) {
      pagerInfo.activePage = 1;
      pagerInfo.pagesize = this.settings.pagesize;
      pagerInfo.total = -1;

      if (this.settings.treeGrid) {
        pagerInfo.preserveSelected = true;
      }
    }

    if (this.settings.source && pagerInfo.grandTotal) {
      this.grandTotal = pagerInfo.grandTotal;
    } else {
      this.grandTotal = null;
    }

    if (this.pagerAPI) {
      if (this.settings.showDirty && this.settings.source &&
        /first|last|next|prev|sorted/.test(pagerInfo.type)) {
        this.dirtyArray = undefined;
      }
    }

    // Clear groupable
    if (this.settings.groupable &&
      this.settings.dataset[0] &&
      !this.settings.dataset[0].values) {
      this._selectedRows = [];
      this.originalDataset = null;
      this.clearDirty();
    }

    // Update Paging and Clear Rows
    this.setTreeDepth();
    if (this.settings.source) {
      this.originalDataset = null;
      this.setRowGrouping();
    }
    this.setTreeRootNodes();

    // Figure out whether or not to preserve previously selected rows
    if (!pagerInfo.preserveSelected && this.settings.source &&
      !this.settings.allowSelectAcrossPages) {
      if (this.settings.selectAllCurrentPage) {
        this.unSelectAllRowsCurrentPage();
      } else {
        this.unSelectAllRows();
      }
    }
    if (!pagerInfo.preserveSelected && (pagerInfo.type === 'initial' || !pagerInfo.type)) {
      if (this.settings.selectAllCurrentPage) {
        this.unSelectAllRowsCurrentPage();
      } else {
        this.unSelectAllRows();
      }
    }

    if (this.settings.disableClientFilter) {
      this.restoreFilter = true;
      this.restoreSortOrder = true;
      this.savedFilter = this.filterConditions();
    }

    // Resize and re-render if have a new dataset
    // (since automatic column sizing depends on the dataset)
    if (pagerInfo.type === 'initial') {
      this.clearCache();
      this.restoreUserSettings();
      this.renderRows();
      this.renderHeader();
    } else if (this.element.find('.datagrid-filter-wrapper .is-open').length === 0) {
      this.clearCache();
      this.setTreeDepth();
      this.setRowGrouping();
      this.setTreeRootNodes();
      this.renderRows();
    } else {
      // Filter field is open so do not resize
      this.clearCache();
      this.renderRows();
    }

    // Setup focus on the first cell
    this.cellNode(0, 0, true).attr('tabindex', '0');
    this.renderPager(pagerInfo, true);
    this.displayCounts();

    // Highlight search results
    if ((this.settings.paging && this.settings.source &&
      pagerInfo?.filterExpr && pagerInfo.filterExpr[0]?.column === 'all')) {
      this.highlightSearchRows(pagerInfo.filterExpr[0].value);
    }
  },

  /**
  * Generate a unique id based on the page and grid count. Add a suffix.
  * @private
  * @param {object} suffix Add this string to make the id more unique
  * @returns {string} The unique id.
  */
  uniqueId(suffix) {
    suffix = (suffix === undefined || suffix === null) ? '' : suffix;
    const uniqueid = this.settings.uniqueId ?
      `${this.settings.uniqueId}-${suffix}` :
      (`${window.location.pathname.split('/').pop()
        .replace(/\.xhtml|\.shtml|\.html|\.htm|\.aspx|\.asp|\.jspx|\.jsp|\.php/g, '')
        .replace(/[^-\w]+/g, '')
        .replace(/\./g, '-')
        .replace(/ /g, '-')
        .replace(/%20/g, '-')}-${
        this.element.attr('id') || 'datagrid'}-${this.gridCount || 0}${suffix}`);

    return uniqueid.replace(/--/g, '-');
  },

  /**
  * Returns an array with all visible columns.
  * @param {boolean} skipBuiltIn If true then built in columns like selectionCheckbox are skipped.
  * @returns {array} An array with the visible columns.
  */
  visibleColumns(skipBuiltIn) {
    const visible = [];
    for (let j = 0; j < this.settings.columns.length; j++) {
      const column = this.settings.columns[j];

      if (column.hidden) {
        continue;
      }

      if (skipBuiltIn && column.id === 'selectionCheckbox') {
        continue;
      }
      visible.push(column);
    }
    return visible;
  },

  /**
  * Gets an if for the column group used for grouped headers.
  * @private
  * @param {object} idx The index of the column group
  * @returns {string} The name of the column group
  */
  getColumnGroup(idx) {
    let total = 0;
    const colGroups = this.settings.columnGroups;

    for (let l = 0; l < colGroups.length; l++) {
      if (colGroups[l].hidden) {
        continue;
      }
      total += colGroups[l].colspan;

      if (total >= idx) {
        return this.uniqueId(`-header-group-${l}`);
      }
    }

    return '';
  },

  /**
  * Adjust the group row and header groups on column/hide show
  * @private
  * @param {number} colIndex The index of the column effected
  * @param {boolean} hideShow True if we showed the column, false if we hid it.
  */
  updateColumnGroup(colIndex, hideShow) {
    const colGroups = this.settings.columnGroups;
    if (!this.originalColGroups) {
      this.originalColGroups = utils.deepCopy(colGroups);
    }

    // Extend the Group Row to fill the grid for the new totals
    if (this.settings.groupable) {
      const groupHeaders = this.tableBody.find('.datagrid-rowgroup-header');
      const newColspan = this.visibleColumns().length;

      for (let i = 0; i < groupHeaders.length; i++) {
        groupHeaders[i].children[0].setAttribute('colspan', newColspan);
      }
      return;
    }

    if (!colGroups) {
      return;
    }

    // Update the dom
    if (!this.colGroups) {
      return;
    }

    let total = 0;
    let groupIdx = -1;
    this.originalColGroups.forEach((group, i) => {
      const colSpan = parseInt(group.colspan, 10);
      if (colIndex >= total && colIndex <= total + colSpan) {
        groupIdx = i;
      }
      total += colSpan;
    });

    const currColspan = parseInt(this.colGroups[groupIdx].getAttribute('colspan'), 10);
    const wasHidden = this.colGroups[groupIdx].classList.contains('is-hidden');
    if (hideShow && wasHidden) {
      this.colGroups[groupIdx].classList.remove('is-hidden');
      return;
    }

    if (hideShow && !wasHidden) {
      this.colGroups[groupIdx].classList.remove('is-hidden');
      this.colGroups[groupIdx].setAttribute('colspan', currColspan + 1);
      return;
    }

    if (currColspan - 1 === 0) {
      this.colGroups[groupIdx].classList.add('is-hidden');
      return;
    }
    this.colGroups[groupIdx].setAttribute('colspan', currColspan - 1);
  },

  /**
  * Update group headers after column reorder/dragged.
  * @private
  * @param {number} indexFrom The column index dragged from.
  * @param {number} indexTo The column index dragged to.
  * @returns {void}
  */
  updateGroupHeadersAfterColumnReorder(indexFrom, indexTo) {
    const colGroups = this.settings.columnGroups;
    if (!colGroups) {
      return;
    }

    if (!this.originalColGroups) {
      this.originalColGroups = utils.deepCopy(colGroups);
    }

    const groups = colGroups.map(group => parseInt(group.colspan, 10));
    const changed = { from: null, to: null, total: 0 };

    groups.forEach((colspan, i) => {
      changed.total += colspan;

      if (changed.total > indexFrom && changed.from === null) {
        changed.from = i;
      }
      if (changed.total > indexTo && changed.to === null) {
        changed.to = i;
      }
    });

    if (changed.from !== changed.to) {
      colGroups[changed.from].colspan -= 1;
      colGroups[changed.to].colspan += 1;
    }
  },

  /**
  * Returns the text for a header adding built in defaults
  * @private
  * @param {object} col The column id.
  * @returns {string} The current header text
  */
  headerText(col) {
    let text = col.name ? col.name : '';

    if (!text && col.id === 'drilldown') {
      text = Locale.translate('Drilldown');
      return `<span class="audible">${text}</span>`;
    }

    return text;
  },

  /**
   * Get the name of the container (left, right, center) that this column will appear in.
   * @private
   * @param  {string} id The column id to check using the id property.
   * @returns {string} The container that the column appears in.
   */
  getContainer(id) {
    if (this.settings.frozenColumns.left && this.settings.frozenColumns.left.indexOf(id) > -1) {
      return 'left';
    }
    if (this.settings.frozenColumns.right && this.settings.frozenColumns.right.indexOf(id) > -1) {
      return 'right';
    }
    return 'center';
  },

  /**
  * Render the header area.
  * @private
  */
  renderHeader() {
    const self = this;
    const headerRows = { left: '', center: '', right: '' };
    let uniqueId;

    // Handle Nested Headers
    const colGroups = this.settings.columnGroups;
    if (colGroups) {
      this.element.addClass('has-group-headers');

      const columns = this.settings.columns;
      const columnsLen = columns.length;
      const visibleColumnsLen = this.visibleColumns().length;
      const groups = colGroups.map(group => parseInt(group.colspan, 10));
      const getGroupsTotal = () => groups.reduce((a, b) => a + b, 0);
      const getDiff = () => {
        const groupsTotal = getGroupsTotal();
        return groupsTotal > columnsLen ? groupsTotal - columnsLen : columnsLen - groupsTotal;
      };

      headerRows.left += '<tr role="row" class="datagrid-header-groups">';
      headerRows.center += '<tr role="row" class="datagrid-header-groups">';
      headerRows.right += '<tr role="row" class="datagrid-header-groups">';

      const groupsTotal = getGroupsTotal();
      let diff;
      if (groupsTotal > columnsLen) {
        let move = true;
        for (let i = groups.length - 1; i >= 0 && move; i--) {
          diff = getDiff();
          if (groups[i] >= diff) {
            groups[i] -= diff;
            move = false;
          } else {
            groups[i] = 0;
          }
        }
      }

      let i = 0;
      let total = 0;
      groups.forEach((groupColspan, k) => {
        let colspan = groupColspan;
        for (let l = i + groupColspan; i < l; i++) {
          if (i < columnsLen && columns[i].hidden) {
            colspan--;
          }
        }
        const hiddenStr = colGroups[k].hidden || colspan < 1 ? ' class="is-hidden"' : '';
        const colspanStr = ` colspan="${colspan > 0 ? colspan : 1}"`;
        const groupedHeaderAlignmentClass = colGroups[k].align ? `l-${colGroups[k].align}-text` : '';
        uniqueId = self.uniqueId(`-header-group-${k}`);
        if (colspan > 0) {
          total += colspan;
        }

        const container = self.getContainer(self.settings.columns[k].id);
        headerRows[container] += `<th${hiddenStr}${colspanStr} id="${uniqueId}" class="${groupedHeaderAlignmentClass}"><div class="datagrid-column-wrapper"><span class="datagrid-header-text">${colGroups[k].name}</span></div></th>`;
      });

      if (total < visibleColumnsLen) {
        diff = visibleColumnsLen - total;
        const colspanStr = ` colspan="${diff > 0 ? diff : 1}"`;
        if (self.hasRightPane) {
          headerRows.right += `<th${colspanStr}></th>`;
        } else {
          headerRows.center += `<th${colspanStr}></th>`;
        }
      }

      if (this.settings.spacerColumn) {
        headerRows.center += '<th class="datagrid-header-groups-spacer-column"></th>';
      }

      headerRows.left += '</tr><tr>';
      headerRows.center += '</tr><tr>';
      headerRows.right += '</tr><tr>';
    } else {
      headerRows.left += '<tr role="row">';
      headerRows.center += '<tr role="row">';
      headerRows.right += '<tr role="row">';
    }

    for (let j = 0; j < this.settings.columns.length; j++) {
      const column = self.settings.columns[j];
      const container = self.getContainer(column.id);
      const id = self.uniqueId(`-header-${j}`);
      const isSortable = (column.sortable === undefined ? true : column.sortable);
      const isResizable = (column.resizable === undefined ? true : column.resizable);
      const isExportable = (column.exportable === undefined ? true : column.exportable);
      const isSelection = column.id === 'selectionCheckbox';
      const headerAlignmentClass = this.getHeaderAlignmentClass(column);

      // Make frozen columns hideable: false
      if ((self.hasLeftPane || self.hasRightPane) &&
        (self.settings.frozenColumns.left &&
          self.settings.frozenColumns.left.indexOf(column.id) > -1 ||
        self.settings.frozenColumns.right &&
        self.settings.frozenColumns.right.indexOf(column.id) > -1)) {
        column.hideable = false;
      }

      // Ensure hidable columns are marked as such
      if (column.hideable === undefined) {
        column.hideable = true;
      }

      // Assign css classes
      let cssClass = '';
      cssClass += isSortable ? ' is-sortable' : '';
      cssClass += isResizable ? ' is-resizable' : '';
      cssClass += column.hidden ? ' is-hidden' : '';
      cssClass += column.filterType ? ' is-filterable' : '';
      cssClass += column.textOverflow === 'ellipsis' ? ' text-ellipsis' : '';
      cssClass += headerAlignmentClass !== '' ? headerAlignmentClass : '';

      // Apply css classes
      cssClass = cssClass !== '' ? ` class="${cssClass.substr(1)}"` : '';
      let ids = utils.stringAttributes(this, this.settings.attributes, `col-${column.id?.toLowerCase()}`);

      if (!ids) {
        ids = `id="${id}"`;
      }

      headerRows[container] += `<th scope="col" role="columnheader" ${ids} data-column-id="${column.id}"${column.field ? ` data-field="${column.field}"` : ''}${column.headerTooltip ? ` title="${column.headerTooltip}"` : ''}${column.reorderable === false ? ' data-reorder="false"' : ''}${colGroups ? ` headers="${self.getColumnGroup(j)}"` : ''} data-exportable="${isExportable ? 'yes' : 'no'}"${cssClass}>`;

      let sortIndicator = '';
      if (isSortable) {
        sortIndicator = `${'<div class="sort-indicator">' +
          '<span class="sort-asc">'}${$.createIcon({ icon: 'dropdown' })}</span>` +
          `<span class="sort-desc">${$.createIcon({ icon: 'dropdown' })}</div>`;
      }

      // If header text is center aligned, for proper styling,
      // place the sortIndicator as a child of datagrid-header-text.
      headerRows[container] += `<div class="${isSelection ? 'datagrid-checkbox-wrapper ' : 'datagrid-column-wrapper'}${headerAlignmentClass}">
      <span class="datagrid-header-text${column.required ? ' required' : ''}">${self.headerText(this.settings.columns[j])}${headerAlignmentClass === ' l-center-text' ? sortIndicator : ''}</span>`;

      if (isSelection) {
        if (self.settings.showSelectAllCheckBox) {
          headerRows[container] += '<span aria-checked="false" class="datagrid-checkbox" aria-label="Selection" role="checkbox" tabindex="0"></span>';
        } else {
          headerRows[container] += '<span aria-checked="false" class="datagrid-checkbox" aria-label="Selection" role="checkbox" style="display:none" tabindex="0"></span>';
        }
      }

      // Note the space in classname.
      // Place sortIndicator via concatenation if
      // header text is not center aligned.
      if (isSortable && headerAlignmentClass !== ' l-center-text') {
        headerRows[container] += sortIndicator;
      }

      headerRows[container] += `</div>${self.filterRowHtml(column, j)}</th>`;
    }

    // Set Up Spacer column
    if (this.settings.spacerColumn) {
      headerRows.center += '<th class="datagrid-header-spacer-column"></th>';
    }

    headerRows.left += '</tr>';
    headerRows.center += '</tr>';
    headerRows.right += '</tr>';

    // Set Up Header Panes
    if (self.headerRow === undefined) {
      if (self.hasLeftPane) {
        self.headerRowLeft = $(`<thead class="datagrid-header left" role="rowgroup">${headerRows.left}</thead>`);
        self.tableLeft.find('colgroup').after(self.headerRowLeft);
      }

      self.headerRow = $(`<thead class="datagrid-header center"> role="rowgroup"${headerRows.center}</thead>`);
      self.table.find('colgroup').after(self.headerRow);

      if (self.hasRightPane) {
        self.headerRowRight = $(`<thead class="datagrid-header right" role="rowgroup">${headerRows.right}</thead>`);
        self.tableRight.find('colgroup').after(self.headerRowRight);
      }
    } else {
      if (self.hasLeftPane) {
        DOM.html(self.headerRowLeft, headerRows.left, '*');
      }

      DOM.html(self.headerRow, headerRows.center, '*');

      if (self.hasRightPane) {
        DOM.html(self.headerRowRight, headerRows.right, '*');
      }
    }

    if (colGroups && self.headerRow) {
      self.colGroups = $.makeArray(this.container.find('.datagrid-header-groups th'));
    }

    self.syncHeaderCheckbox(this.settings.dataset);
    self.setScrollClass();
    self.attachFilterRowEvents();

    if (self.settings.columnReorder) {
      self.createDraggableColumns();
    }

    this.restoreSortOrder = false;
    this.setSortIndicator(this.sortColumn.sortId, this.sortColumn.sortAsc);

    if (this.restoreFilter) {
      this.restoreFilter = false;
      this.applyFilter(this.savedFilter, 'restore');
      this.savedFilter = null;
    } else if (this.filterExpr && this.filterExpr.length > 0) {
      this.setFilterConditions(this.filterExpr);
    }

    this.activeEllipsisHeaderAll();
  },

  /**
   * Get the alignment class based on settings. Note there is a space at the front of the classname.
   * @private
   * @param {object} column The column info.
   * @returns {string} The class as a string.
   */
  getHeaderAlignmentClass(column) {
    let headerAlignmentClass = '';

    if (column.headerAlign === undefined) {
      headerAlignmentClass = column.align ? ` l-${column.align}-text` : '';
    } else {
      headerAlignmentClass = ` l-${column.headerAlign}-text`;
    }
    return headerAlignmentClass;
  },

  /**
  * Set filter datepicker with range/single date.
  * @private
  * @param {object} input element to target datepicker.
  * @param {string} operator filter type.
  * @param {object} options pass in to datepicker.
  * @returns {void}
  */
  filterSetDatepicker(input, operator, options) {
    const datepickerApi = input.data('datepicker');
    const isRange = input.data('is-range');
    options = options || {};

    // Init datepicker
    const initDatepicker = function () {
      if (datepickerApi && typeof datepickerApi.destroy === 'function') {
        datepickerApi.destroy();
      }
      input.datepicker(options);
    };

    // invoke datepicker
    if ((!datepickerApi || !isRange) && operator === 'in-range') {
      input.data('is-range', true);
      options.range = { useRange: true };
      initDatepicker();
    } else if ((!datepickerApi || isRange) && operator !== 'in-range') {
      options.range = { useRange: false };
      input.removeData('is-range');
      initDatepicker();
    }
  },

  /**
  * Returns the markup for a specific filter row area.
  * @private
  * @param {object} columnDef The column object for the header
  * @param {object} idx The column idx for the header
  * @returns {string} The filter html to use
  */
  filterRowHtml(columnDef, idx) {
    const self = this;
    let filterMarkup = '';
    const headerAlignmentClass = this.getHeaderAlignmentClass(columnDef);

    // Generate the markup for the various Types
    // Supported Filter Types: text, integer, date, select, decimal,
    // lookup, percent, checkbox, contents
    if (columnDef.filterType) {
      const col = columnDef;
      const filterId = self.uniqueId(`-header-filter-${idx}`);
      const filterOptions = Array.isArray(col.filterRowEditorOptions) ?
        col.filterRowEditorOptions : col.options;
      let integerDefaults;
      let emptyOption = '';

      // Set empty option for select filter type
      if (col.filterType === 'select' && filterOptions) {
        let found = false;
        for (let i = 0, l = filterOptions.length; i < l; i++) {
          if (!filterOptions[i].label) {
            found = true;
            break;
          }
        }
        if (!found) {
          emptyOption = '<option></option>';
        }
      }

      filterMarkup = `<div class="datagrid-filter-wrapper${headerAlignmentClass}" ${!self.settings.filterable ? ' style="display:none"' : ''}>${self.filterButtonHtml(col)}<label class="audible" for="${filterId}">${
        col.name}</label>`;

      let attrs = utils.stringAttributes(this, this.settings.attributes, `filter-${col.id?.toLowerCase()}`);
      if (!attrs) {
        attrs = `id="${filterId}"`;
      }

      switch (col.filterType) {
        case 'checkbox':
          // just the button
          break;
        case 'date':
          filterMarkup += `<input ${col.filterDisabled ? ' disabled' : ''} type="text" class="datepicker" ${attrs}/>`;
          break;
        case 'integer': {
          integerDefaults = {
            patternOptions: {
              allowNegative: true,
              allowThousandsSeparator: false,
              allowDecimal: false,
              symbols: {
                thousands: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.group : ',',
                decimal: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.decimal : '.',
                negative: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.minusSign : '-'
              }
            },
            process: 'number'
          };

          col.maskOptions = utils.extend(true, {}, integerDefaults, col.maskOptions);
          filterMarkup += `<input${col.filterDisabled ? ' disabled' : ''} type="text" ${attrs} />`;
          break;
        }
        case 'percent':
        case 'decimal': {
          const decimalDefaults = {
            patternOptions: {
              allowNegative: true,
              allowDecimal: true,
              symbols: {
                thousands: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.group : ',',
                decimal: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.decimal : '.',
                negative: Locale.currentLocale.data.numbers ? Locale.currentLocale.data.numbers.minusSign : '-'
              }
            },
            process: 'number'
          };

          if (col.numberFormat) {
            integerDefaults = {
              patternOptions: { decimalLimit: col.numberFormat.maximumFractionDigits }
            };

            col.maskOptions = utils.extend(
              true,
              {},
              integerDefaults,
              decimalDefaults,
              col.maskOptions
            );
          } else {
            col.maskOptions = utils.extend(true, {}, decimalDefaults, col.maskOptions);
          }

          filterMarkup += `<input${col.filterDisabled ? ' disabled' : ''} type="text" ${attrs} />`;
          break;
        }
        case 'contents':
        case 'select':
          filterMarkup += `<select ${attrs} ${col.filterType === 'select' ? 'class="dropdown"' : 'multiple class="multiselect"'}${col.filterDisabled ? ' disabled' : ''}>${emptyOption}`;
          if (filterOptions) {
            for (let i = 0, l = filterOptions.length; i < l; i++) {
              const option = filterOptions[i];
              const optionValue = col.caseInsensitive && typeof option.value === 'string' ? option.value.toLowerCase() : option.value;
              if (option && optionValue !== '') {
                filterMarkup += `<option value = "${optionValue}">${option.label}</option>`;
              }
            }
          }
          filterMarkup += '</select><div class="dropdown-wrapper"><div class="dropdown"><span></span></div><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-dropdown"></use></svg></div>';

          break;
        case 'multiselect':
          filterMarkup += `<select ${attrs} class="multiselect" multiple${col.filterDisabled ? ' disabled' : ''}>`;
          if (filterOptions) {
            for (let i = 0, l = filterOptions.length; i < l; i++) {
              const option = filterOptions[i];
              const optionValue = col.caseInsensitive && typeof option.value === 'string' ? option.value.toLowerCase() : option.value;
              if (option && typeof option.label === 'string') {
                filterMarkup += `<option value = "${optionValue}">${option.label}</option>`;
              }
            }
          }
          filterMarkup += '</select><div class="dropdown-wrapper"><div class="dropdown"><span></span></div><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-dropdown"></use></svg></div>';

          break;
        case 'time':
          filterMarkup += `<input ${col.filterDisabled ? ' disabled' : ''} type="text" class="timepicker" ${attrs}/>`;
          break;
        case 'lookup':
          filterMarkup += `<input ${col.filterDisabled ? ' disabled' : ''} type="text" class="lookup" ${attrs} >`;
          break;
        default:
          filterMarkup += `<input${col.filterDisabled ? ' disabled' : ''} type="text" ${attrs}/>`;
          break;
      }

      filterMarkup += '</div>';
    }

    if (!columnDef.filterType) {
      filterMarkup = `<div class="datagrid-filter-wrapper is-empty${` ${headerAlignmentClass}`}"></div>`;
    }
    return filterMarkup;
  },

  /**
  * Attach Events and initialize plugins for the filter row.
  * @private
  */
  attachFilterRowEvents() {
    const self = this;

    if (!this.settings.filterable) {
      return;
    }

    this.element.addClass('has-filterable-columns');

    if (this.settings.twoLineHeader) {
      this.element.addClass('has-two-line-header');
    }

    // Attach Keyboard support
    this.element.off('click.datagrid-filter').on('click.datagrid-filter', '.btn-filter', function () {
      const filterBtn = $(this);
      const popupOpts = { trigger: 'immediate', offset: { y: 15 }, placementOpts: { strategies: ['flip', 'nudge'] } };
      const popupmenu = filterBtn.data('popupmenu');

      if (popupmenu) {
        popupmenu.close(true, true);
      } else {
        filterBtn.off('beforeopen.datagrid-filter').on('beforeopen.datagrid-filter', () => {
          const menu = filterBtn.next('.popupmenu-wrapper');
          utils.fixSVGIcons(menu);
          self.hideTooltip();
        }).popupmenu(popupOpts)
          .off('selected.datagrid-filter')
          .on('selected.datagrid-filter', () => {
            const rowElem = filterBtn.closest('th[role="columnheader"]');
            const col = self.columnById(rowElem.attr('data-column-id'))[0];

            // Set datepicker and numbers filter with range/single
            if (col && /date|integer|decimal/.test(col.filterType)) {
              const input = rowElem.find('input');
              const svg = rowElem.find('.btn-filter .icon-dropdown:first');
              const operator = svg.getIconName().replace('filter-', '');
              if (col.filterType === 'date') {
                self.filterSetDatepicker(input, operator, col.editorOptions);
              } else {
                const rangeDelimeter = col.maskOptions?.rangeNumberDelimeter || '-';
                const isRange = operator === 'in-range';
                const maskApi = input.data('mask');
                const settings = isRange ?
                  { process: 'rangeNumber', patternOptions: { delimeter: rangeDelimeter } } :
                  { process: 'number', patternOptions: { delimeter: '' } };

                if (maskApi && maskApi.settings.process !== settings.process) {
                  col.maskOptions = utils.extend(true, {}, col.maskOptions, settings);
                  maskApi.updated(settings);
                }
              }
            }
            self.applyFilter(null, 'selected');
          })
          .off('close.datagrid-filter')
          .on('close.datagrid-filter', function () {
            const data = $(this).data('popupmenu');
            if (data) {
              data.destroy();
            }
          });
      }
      return false;
    });

    let typingTimer;
    this.element.off('keydown.datagrid-filter-input').on('keydown.datagrid-filter-input', '.datagrid-filter-wrapper input', (e) => {
      clearTimeout(typingTimer);
      e.stopPropagation();

      if (e.which === 13) {
        self.applyFilter(null, 'enter');
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      return true;
    });

    if (this.settings.filterWhenTyping) {
      this.element.off('keyup.datagrid-filter-input').on('keyup.datagrid-filter-input', '.datagrid-filter-wrapper input', (e) => {
        if (e.which === 13) {
          return;
        }

        if (this.activeCell && this.activeCell.isFocused) {
          this.activeCell.isFocused = false;
        }

        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
          self.applyFilter(null, 'keyup');
        }, 400);
      });
    }

    this.element.find('.datagrid-header tr:not(.datagrid-header-groups) th').each(function () {
      const col = self.columnById($(this).attr('data-column-id'))[0];
      const elem = $(this);

      if (!col) { // No ID found
        return true;
      }

      elem.find('select.dropdown').each(function () {
        const dropdown = $(this);
        dropdown.dropdown(col.editorOptions).on('selected.datagrid', () => {
          self.applyFilter(null, 'selected');
        }).on('listopened.datagrid', () => {
          const api = dropdown.data('dropdown');
          if (api) {
            if (!utils.isInViewport(api.list[0])) {
              self.adjustPosLeft(api.list[0]);
            }
          }
        });

        // Append the Dropdown's sourceArguments with some row/col meta-data
        const api = dropdown.data('dropdown');
        api.settings.sourceArguments = {
          column: col,
          container: elem,
          grid: self,
          cell: col,
          event: undefined,
          row: -1,
          rowData: {},
          value: undefined
        };
      });

      elem.find('select.multiselect').each(function () {
        const multiselect = $(this);
        multiselect.multiselect(col.editorOptions).on('selected.datagrid', () => {
          // Wierd Hack - Sync to "sync" up the filter row
          const ddElem = $(this);
          $(`#${ddElem.attr('id')}`).val(ddElem.val());
          self.applyFilter(null, 'selected');
        });

        // Append the Dropdown's sourceArguments with some row/col meta-data
        const api = multiselect.data('dropdown');
        api.settings.sourceArguments = {
          column: col,
          container: elem,
          grid: self,
          cell: col,
          event: undefined,
          row: -1,
          rowData: {},
          value: undefined
        };
      });

      if (col.maskOptions) {
        elem.find('input').mask(col.maskOptions);
      }

      if (col.mask) {
        elem.find('input').mask(col.mask);
      }

      const datepickerEl = elem.find('.datepicker');
      if (datepickerEl.length && typeof $().datepicker === 'function') {
        datepickerEl
          .datepicker(col.editorOptions || { dateFormat: col.dateFormat })
          .on('listclosed.datepicker', () => {
            self.applyFilter(null, 'selected');
          });
      }

      const lookupEl = elem.find('.lookup');
      if (lookupEl.length && typeof $().lookup === 'function') {
        if (col.editorOptions) {
          if (col.editorOptions.clickArguments) {
            col.editorOptions.clickArguments.grid = self;
          } else {
            col.editorOptions.clickArguments = {
              grid: self
            };
          }

          if (col.editorOptions.clearArguments) {
            col.editorOptions.clearArguments.grid = self;
          } else {
            col.editorOptions.clearArguments = {
              grid: self
            };
          }
        }

        lookupEl
          .lookup(col.editorOptions || {});

        if (self.settings.filterWhenTyping) {
          lookupEl.on('change', () => {
            self.applyFilter(null, 'selected');
          });
        }
      }

      const timepickerEl = elem.find('.timepicker');
      if (timepickerEl.length && typeof $().timepicker === 'function') {
        timepickerEl.timepicker(col.editorOptions || { timeFormat: col.timeFormat });
      }

      // Attach Mask
      if (col.mask) {
        elem.find('input').mask({ pattern: col.mask, mode: col.maskMode });
      }

      return null;
    });

    self.filterRowRendered = true;
  },

  /**
  * Render one filter item as used in renderFilterButton
  * @private
  * @param {object} icon The icon for the menu item
  * @param {object} text The text for the menu item
  * @param {object} checked If the menu item is selected
  * @returns {string} The html for the filter item.
  */
  filterItemHtml(icon, text, checked) {
    const iconMarkup = $.createIcon({ classes: 'icon icon-filter', icon: `filter-${icon}` });
    return `<li class="${icon} ${checked ? ' is-checked' : ''}"><a href="#">${iconMarkup}<span>${Locale.translate(text)}</span></a></li>`;
  },

  /**
  * Render the Filter Button and Menu based on filterType - which determines the options
  * @private
  * @param {object} col The column object
  * @returns {string} The html for the filter button.
  */
  filterButtonHtml(col) {
    if (!col.filterType) {
      return '';
    }

    const self = this;
    const isDisabled = col.filterDisabled;
    const filterConditions = $.isArray(col.filterConditions) ? col.filterConditions : [];
    const inArray = function (s, array) {
      array = array || filterConditions;
      return ($.inArray(s, array) > -1);
    };
    const render = function (icon, text, checked) {
      const isChecked = filterConditions.length && filterConditions[0] === icon ? true : checked;
      return filterConditions.length && !inArray(icon) ?
        '' : self.filterItemHtml(icon, text, isChecked);
    };
    const attrs = utils.stringAttributes(this, this.settings.attributes, `btn-filter-${col.id?.toLowerCase()}`);

    const renderButton = function (defaultValue, extraClass) {
      return `<button type="button" ${attrs} class="btn-menu btn-filter${extraClass ? ` ${extraClass}` : ''}" data-init="false" ${isDisabled ? ' disabled' : ''}${defaultValue ? ` data-default="${defaultValue}"` : ''} type="button"><span class="audible">Filter</span>` +
      `<svg class="icon-dropdown icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-filter-{{icon}}"></use></svg>${
        $.createIcon({ icon: 'dropdown', classes: 'icon-dropdown' })
      }</button><ul class="popupmenu has-icons is-translatable is-selectable">`;
    };
    const formatFilterText = function (str) {
      str = str
        .split('-')
        .map((s) => {
          s = s.charAt(0).toUpperCase() + s.slice(1);
          return s;
        }).join('');

      switch (str) {
        case 'StartWith':
          str = str.replace('StartWith', 'StartsWith');
          break;
        case 'EndWith':
          str = str.replace('EndWith', 'EndsWith');
          break;
        case 'LessEquals':
          str = str.replace('LessEquals', 'LessOrEquals');
          break;
        case 'GreaterEquals':
          str = str.replace('GreaterEquals', 'GreaterOrEquals');
          break;
        default:
          break;
      }

      return str;
    };

    let btnMarkup = '';
    let btnDefault = '';

    // Just the dropdown
    if (col.filterType === 'contents' || col.filterType === 'select' || col.filterType === 'multiselect') {
      return '';
    }

    if (col.filterType === 'text') {
      btnDefault = filterConditions.length ? filterConditions[0] : 'contains';
      if (filterConditions.length === 0) {
        btnMarkup = renderButton(btnDefault) +
          render('contains', 'Contains', true) +
          render('does-not-contain', 'DoesNotContain') +
          render('equals', 'Equals') +
          render('does-not-equal', 'DoesNotEqual') +
          render('is-empty', 'IsEmpty') +
          render('is-not-empty', 'IsNotEmpty') +
          render('end-with', 'EndsWith') +
          render('does-not-end-with', 'DoesNotEndWith') +
          render('start-with', 'StartsWith') +
          render('does-not-start-with', 'DoesNotStartWith');
        btnMarkup = btnMarkup.replace('{{icon}}', btnDefault);
      } else {
        btnMarkup = renderButton(btnDefault) +
          filterConditions.map(filter => render(filter, formatFilterText(filter))).join('');
        btnMarkup = btnMarkup.replace('{{icon}}', btnDefault);
      }
    }

    if (col.filterType === 'checkbox') {
      btnDefault = filterConditions.length ? filterConditions[0] : 'selected-notselected';
      btnMarkup += renderButton(btnDefault, 'btn-filter-checkbox') +
        render('selected-notselected', 'All', true) +
        render('selected', 'Selected') +
        render('not-selected', 'NotSelected');
      btnMarkup = btnMarkup.replace('{{icon}}', btnDefault);
    }

    if (col.filterType !== 'checkbox' && col.filterType !== 'text') {
      btnDefault = filterConditions.length ? filterConditions[0] : 'equals';
      btnMarkup += renderButton(btnDefault) +
        render('equals', 'Equals', (col.filterType === 'lookup' || col.filterType === 'integer' || col.filterType === 'decimal' || col.filterType === 'date' || col.filterType === 'time')) +
        render('does-not-equal', 'DoesNotEqual') +
        render('is-empty', 'IsEmpty') +
        render('is-not-empty', 'IsNotEmpty');
      btnMarkup = btnMarkup.replace('{{icon}}', btnDefault);
    }

    if (/\b(date|integer|decimal|percent)\b/g.test(col.filterType)) {
      btnMarkup += render('in-range', 'InRange');
    }

    if (/\b(integer|decimal|date|time|percent)\b/g.test(col.filterType)) {
      btnMarkup += `${
        render('less-than', 'LessThan')
      }${render('less-equals', 'LessOrEquals')
      }${render('greater-than', 'GreaterThan')
      }${render('greater-equals', 'GreaterOrEquals')}`;
      btnMarkup = btnMarkup.replace('{{icon}}', 'less-than');
    }

    if (col.filterType === 'lookup') {
      btnDefault = filterConditions.length ? filterConditions[0] : 'contains';
      btnMarkup = renderButton(btnDefault) +
        render('contains', 'Contains', true) +
        render('does-not-contain', 'DoesNotContain') +
        render('equals', 'Equals') +
        render('does-not-equal', 'DoesNotEqual') +
        render('is-empty', 'IsEmpty') +
        render('is-not-empty', 'IsNotEmpty') +
        render('end-with', 'EndsWith') +
        render('does-not-end-with', 'DoesNotEndWith') +
        render('start-with', 'StartsWith') +
        render('does-not-start-with', 'DoesNotStartWith') +
        render('less-than', 'LessThan') +
        render('less-equals', 'LessOrEquals') +
        render('greater-than', 'GreaterThan') +
        render('greater-equals', 'GreaterOrEquals');
      btnMarkup = btnMarkup.replace('{{icon}}', btnDefault);
    }

    btnMarkup += '</ul>';
    return btnMarkup;
  },

  /**
  * Toggle the visibility of the filter row.
  */
  toggleFilterRow() {
    if (this.settings.filterable) {
      this.element.find('.datagrid-filter-wrapper').hide();
      this.settings.filterable = false;
      this.filterRowRendered = false;
      this.element.removeClass('has-filterable-columns');
      this.element.removeClass('has-two-line-header');
      /**
      *  Fires after the filter row is closed by the user.
      * @event closefilterrow
      * @memberof Datagrid
      * @property {object} event The jquery event object
      */
      this.element.triggerHandler('closefilterrow');
    } else {
      this.settings.filterable = true;
      this.filterRowRendered = true;

      this.element.addClass('has-filterable-columns');

      if (this.settings.twoLineHeader) {
        this.element.addClass('has-two-line-header');
      }

      this.element.find('.datagrid-filter-wrapper').show();

      /**
      * Fires after the filter row is opened by the user.
      * @event openfilterrow
      * @memberof Datagrid
      * @property {object} event The jquery event object
      */
      this.element.triggerHandler('openfilterrow');
      this.attachFilterRowEvents();
    }
    this.setupTooltips();
  },

  /**
  * Apply the Filter with the currently selected conditions, or the ones passed in.
  * @param {object} conditions An array of objects with the filter conditions.
  * @param {string} [trigger] A string to identify the triggering action.
  */
  applyFilter(conditions, trigger) {
    const self = this;
    let filterChanged = false;

    // Remove all nested key/value `_isFilteredOut` from given dataset
    const removeFilteredOut = (dataset) => {
      for (let i = 0, len = dataset.length; i < len; i++) {
        if (typeof dataset[i]._isFilteredOut !== 'undefined') {
          delete dataset[i]._isFilteredOut;
        }
        if (dataset[i].children) {
          removeFilteredOut(dataset[i].children);
        }
      }
    };

    if (conditions) {
      this.setFilterConditions(conditions);
    } else {
      conditions = this.filterConditions();
    }
    if (this.filterExpr === undefined) {
      this.filterExpr = [];
    }

    if (this.pagerAPI && JSON.stringify(conditions) !== JSON.stringify(this.filterExpr)) {
      this.filterExpr = conditions;
      filterChanged = true;

      if (this.settings.treeGrid) {
        removeFilteredOut(this.settings.dataset);
      }
    }

    const checkRow = function (rowData) {
      let isMatch = true;

      for (let i = 0; i < conditions.length; i++) {
        const columnDef = self.columnById(conditions[i].columnId)[0];

        if (columnDef === undefined) {
          return false;
        }

        let rowValue = rowData && rowData[columnDef.field] !== undefined ?
          rowData[columnDef.field] : self.fieldValue(rowData, columnDef.field);
        let rowValueStr = (rowValue === null || rowValue === undefined) ? '' : rowValue.toString().toLowerCase();
        let conditionValue = conditions[i].value.toString().toLowerCase();
        let rangeData = null;
        let rangeSeparator = null;
        let rangeValues = null;
        let isRangeNumber = false;

        // Percent filter type
        if (columnDef.filterType === 'percent') {
          conditionValue = (conditionValue / 100).toString();
          if ((`${columnDef.name}`).toLowerCase() === 'decimal') {
            rowValue = Formatters.Decimal(false, false, rowValue, columnDef);
            conditionValue = Formatters.Decimal(false, false, conditionValue, columnDef);
          } else if ((`${columnDef.name}`).toLowerCase() === 'integer') {
            rowValue = Formatters.Integer(false, false, rowValue, columnDef);
            conditionValue = Formatters.Integer(false, false, conditionValue, columnDef);
          }
        }

        // Run Data over the formatter
        if (columnDef.filterType === 'text') {
          const fmt = columnDef.formatter;
          const id = conditions[i].columnId;
          rowValue = self.formatValue(fmt, i, id, rowValue, columnDef, rowData, self);

          // Strip any html markup that might be in the formatters
          const rex = /(<([^>]+)>)|(amp;)|(&lt;([^>]+)&gt;)/ig;
          rowValue = rowValue.replace(rex, '').trim().toLowerCase();

          rowValueStr = (rowValue === null || rowValue === undefined) ? '' : rowValue.toString().toLowerCase();
        }

        if (columnDef.filterType === 'contents' || columnDef.filterType === 'select' || columnDef.filterType === 'multiselect') {
          rowValue = (rowValue === null || rowValue === undefined) ? '' : rowValue.toString().toLowerCase();
        }

        if ((typeof rowValue === 'number' || (!isNaN(rowValue) && rowValue !== '') &&
          !(conditions[i].value instanceof Array)) &&
            !(/^(date|time|text)$/.test(columnDef.filterType))) {
          rowValue = rowValue === null ? rowValue : parseFloat(rowValue);

          if (columnDef && columnDef.maskOptions?.process === 'rangeNumber') {
            let splitter = columnDef.maskOptions.patternOptions?.delimeter;
            splitter = `\u0029${splitter}\u0028`;
            if (conditionValue.substr(0, 1) === '\u0028') {
              conditionValue = conditionValue.substr(1);
            }
            if (conditionValue.substr(-1) === '\u0029') {
              conditionValue = conditionValue.substr(0, conditionValue.length - 1);
            }
            conditionValue = conditionValue.split(splitter).map(x => Locale.parseNumber(x)).sort((a, b) => a - b);
            isRangeNumber = true;
          } else {
            conditionValue = Locale.parseNumber(conditionValue);
            isRangeNumber = false;
          }
        }

        if (columnDef.filterType === 'date' || columnDef.filterType === 'time') {
          if (typeof rowValue === 'string') {
            rowValue = columnDef.formatter(false, false, rowValue, columnDef, true);
          }
          const getValues = (rValue, cValue) => {
            cValue = Locale.parseDate(cValue, conditions[i].format);
            if (cValue) {
              if (columnDef.filterType === 'time') {
                // drop the day, month and year
                cValue.setDate(1);
                cValue.setMonth(0);
                cValue.setYear(0);
              }

              cValue = cValue.getTime();
            }

            if (rValue instanceof Date) {
              // Copy date
              rValue = new Date(rValue.getTime());
              if (columnDef.filterType === 'time') {
                // drop the day, month and year
                rValue.setDate(1);
                rValue.setMonth(0);
                rValue.setYear(0);
              } else if (!(columnDef.editorOptions && columnDef.editorOptions.showTime)) {
                // Drop any time component of the row data for the filter as it is a date only field
                rValue.setHours(0);
                rValue.setMinutes(0);
                rValue.setSeconds(0);
                rValue.setMilliseconds(0);
              }
              rValue = rValue.getTime();
            } else if (typeof rValue === 'string' && rValue) {
              if (!columnDef.sourceFormat) {
                rValue = Locale.parseDate(rValue, { pattern: conditions[i].format });
              } else {
                rValue = Locale.parseDate(rValue, (typeof columnDef.sourceFormat === 'string' ? { pattern: columnDef.sourceFormat } : columnDef.sourceFormat));
              }

              if (rValue) {
                if (columnDef.filterType === 'time') {
                  // drop the day, month and year
                  rValue.setDate(1);
                  rValue.setMonth(0);
                  rValue.setYear(0);
                } else if (!(columnDef.editorOptions && columnDef.editorOptions.showTime)) {
                  // Drop any time component of the row data for the filter
                  // as it is a date only field
                  rValue.setHours(0);
                  rValue.setMinutes(0);
                  rValue.setSeconds(0);
                  rValue.setMilliseconds(0);
                }
                rValue = rValue.getTime();
              }
            }
            return { rValue, cValue };
          };

          let values = null;
          if (conditions[i].operator === 'in-range') {
            const cell = self.settings.columns.indexOf(columnDef);
            const input = self.element.find(`.datagrid-header th:eq(${cell}) .datagrid-filter-wrapper input`);
            const datepickerApi = input.data('datepicker');
            if (datepickerApi) {
              rangeSeparator = datepickerApi.settings.range.separator;
              rangeData = datepickerApi.settings.range.data;
              if (rangeData && rangeData.start) {
                values = getValues(rowValue, rangeData.start);
              } else if (rangeSeparator && conditionValue.indexOf(rangeSeparator) > -1) {
                rangeValues = conditionValue.split(rangeSeparator);
                values = getValues(rowValue, rangeValues[0]);
              }
            }
          } else {
            values = getValues(rowValue, conditions[i].value);
          }
          rowValue = values ? values.rValue : rowValue;
          conditionValue = values ? values.cValue : conditionValue;
        }

        switch (conditions[i].operator) {
          case 'equals':

            // This case is multiselect
            if (conditions[i].value instanceof Array) {
              isMatch = false;

              for (let k = 0; k < conditions[i].value.length; k++) {
                const match = conditions[i].value[k].toLowerCase() === rowValue && (rowValue.toString() !== '' || conditions[i].value[k] === '');
                if (match) {
                  isMatch = true;
                }
              }
            } else {
              isMatch = (rowValue === conditionValue && rowValue !== '');
            }

            break;
          case 'does-not-equal':
            isMatch = (rowValue !== conditionValue);
            break;
          case 'contains':
            isMatch = (rowValueStr.indexOf(conditionValue) > -1 && rowValue.toString() !== '');
            break;
          case 'does-not-contain':
            isMatch = (rowValueStr.indexOf(conditionValue) === -1);
            break;
          case 'end-with':
            isMatch = (rowValueStr.lastIndexOf(conditionValue) === (rowValueStr.length - conditionValue.toString().length) && rowValueStr !== '' && (rowValueStr.length >= conditionValue.toString().length));
            break;
          case 'start-with':
            isMatch = (rowValueStr.indexOf(conditionValue) === 0 && rowValueStr !== '');
            break;
          case 'does-not-end-with':
            isMatch = (rowValueStr.lastIndexOf(conditionValue) === (rowValueStr.length - conditionValue.toString().length) && rowValueStr !== '' && (rowValueStr.length >= conditionValue.toString().length));
            isMatch = !isMatch;
            break;
          case 'does-not-start-with':
            isMatch = !(rowValueStr.indexOf(conditionValue) === 0 && rowValueStr !== '');
            break;
          case 'is-empty':
            isMatch = (rowValueStr === '');
            break;
          case 'is-not-empty':
            if (rowValue === '') {
              isMatch = (rowValue !== '');
              break;
            }
            isMatch = !(rowValue === null);
            break;
          case 'in-range':
            isMatch = false;
            if (rangeData && rangeData.startDate && rangeData.endDate) {
              const d1 = rangeData.startDate.getTime();
              const d2 = rangeData.endDate.getTime();
              isMatch = rowValue >= d1 && rowValue <= d2 && rowValue !== null;
            } else if (rangeValues) {
              let d1 = Locale.parseDate(rangeValues[0], conditions[i].format);
              let d2 = Locale.parseDate(rangeValues[1], conditions[i].format);
              if (d1 && d2) {
                d1 = d1.getTime();
                d2 = d2.getTime();
                isMatch = rowValue >= d1 && rowValue <= d2 && rowValue !== null;
              }
            }
            if (isRangeNumber) {
              const isNotEmpty = rowValue !== '' && rowValue !== null;
              isMatch = (rowValue >= conditionValue[0] && rowValue <= conditionValue[1] && isNotEmpty);
            }
            break;
          case 'less-than':
            isMatch = (rowValue < conditionValue && (rowValue !== '' && rowValue !== null));
            break;
          case 'less-equals':
            isMatch = (rowValue <= conditionValue && (rowValue !== '' && rowValue !== null));
            break;
          case 'greater-than':
            isMatch = (rowValue > conditionValue && (rowValue !== '' && rowValue !== null));
            break;
          case 'greater-equals':
            isMatch = (rowValue >= conditionValue && (rowValue !== '' && rowValue !== null));
            break;
          case 'selected':
            if (columnDef && columnDef.isChecked) {
              isMatch = columnDef.isChecked(rowValue);
              break;
            }
            isMatch = (rowValueStr === '1' || rowValueStr === 'true' || rowValue === true || rowValue === 1) && rowValueStr !== '';
            break;
          case 'not-selected':
            if (columnDef && columnDef.isChecked) {
              isMatch = !columnDef.isChecked(rowValue);
              break;
            }
            isMatch = (rowValueStr === '0' || rowValueStr === 'false' || rowValue === false || rowValue === 0 || rowValueStr === '');
            break;
          case 'selected-notselected':
            isMatch = true;
            break;
          default:
        }

        if (!isMatch) {
          return false;
        }
      }
      return isMatch;
    };

    if (!this.settings.disableClientFilter) {
      if (this.settings.treeGrid) {
        // Check nodes and set key/value `_isFilteredOut` in given dataset
        const checkNodes = (dataset) => {
          let isFiltered = true;
          for (let i = 0, len = dataset.length; i < len; i++) {
            const nodeData = dataset[i];
            let isChildFiltered = true;
            if (nodeData.children) {
              isChildFiltered = checkNodes(nodeData.children);
              if (isChildFiltered) {
                nodeData._isFilteredOut = !checkRow(nodeData);
                if (!nodeData._isFilteredOut) {
                  isFiltered = false;
                }
              } else {
                isFiltered = false;
              }
            } else {
              nodeData._isFilteredOut = !checkRow(nodeData);
              if (!nodeData._isFilteredOut) {
                isFiltered = false;
              }
            }
          }
          return isFiltered;
        };

        // Check empty filter conditions
        const isFilterEmpty = () => {
          let isEmpty = true;
          for (let i = 0, len = conditions.length; i < len; i++) {
            if (conditions[i].filterType === 'checkbox' || conditions[i].value.toString().trim() !== '') {
              isEmpty = false;
            }
          }
          return isEmpty;
        };

        if (isFilterEmpty()) {
          removeFilteredOut(this.settings.dataset);
        } else {
          checkNodes(this.settings.dataset);
        }
      } else if (this.settings.groupable) {
        let isFiltered;
        for (let i = 0, len = this.settings.dataset.length; i < len; i++) {
          let isGroupFiltered = true;
          for (let i2 = 0, dataSetLen = this.settings.dataset[i].values.length; i2 < dataSetLen; i2++) {
            isFiltered = !checkRow(this.settings.dataset[i].values[i2]);
            this.settings.dataset[i].values[i2]._isFilteredOut = isFiltered;

            if (!isFiltered) {
              isGroupFiltered = false;
            }
          }

          this.settings.dataset[i]._isFilteredOut = isGroupFiltered;
        }
      } else {
        let isFiltered;
        for (let i = 0, len = this.settings.dataset.length; i < len; i++) {
          isFiltered = !checkRow(this.settings.dataset[i]);
          this.settings.dataset[i]._isFilteredOut = isFiltered;
        }
      }
    }

    this.setChildExpandOnMatch();

    if (!this.settings.source) {
      this.clearCache();
      this.renderRows();
    }

    if (filterChanged) {
      const pagingInfo = { trigger, type: 'filtered' };
      if (this.settings.source) {
        pagingInfo.preserveSelected = this.settings.allowSelectAcrossPages;
      }
      this.setSearchActivePage(pagingInfo);
    }

    /**
    * Fires after a filter action ocurs
    * @event filtered
    * @memberof Datagrid
    * @property {object} event The jquery event object
    * @property {object} args Object with the arguments
    * @property {number} args.op The filter operation, this can be 'apply', 'clear'
    * @property {object} args.conditions An object with all the condition data.
    * @property {string} args.trigger Info on what was the triggering action. May be render, select or key
    */
    if (this.settings.disableClientFilter && trigger === 'restore') {
      return;
    }

    this.element.trigger('filtered', { op: 'apply', conditions, trigger });
    this.saveUserSettings();
  },

  /**
   * Adjust the left positon for given element to be in viewport
   * @private
   * @param {object} el The element
   * @returns {void}
   */
  adjustPosLeft(el) {
    const padding = 20;
    const b = el.getBoundingClientRect();
    const w = (window.innerWidth || document.documentElement.clientWidth);
    if (b.left < 0 && b.right <= w) {
      el.style.left = `${padding}px`; // Left side
    } else if (b.left >= 0 && !(b.right <= w)) {
      el.style.left = `${(w - b.width) - padding}px`; // Right side
    }
  },

  /**
   * Set child nodes when use filter as
   * settings.allowChildExpandOnMatch === true
   * and if only parent got match then add all children nodes too
   * or if one or more child node got match then add parent node and all the children nodes
   * settings.allowChildExpandOnMatch === false
   * and if only parent got match then make expand/collapse button to be collapsed, disabled
   * and do not add any children nodes
   * or if one or more child node got match then add parent node and only matching children nodes
   * @private
   * @returns {void}
   */
  setChildExpandOnMatch() {
    const s = this.settings;
    if (s.treeGrid) {
      const checkNodes = function (nodeData, depth) {
        for (let i = 0, l = nodeData.length; i < l; i++) {
          const node = nodeData[i];
          const children = node.children;
          const childrenLen = children ? children.length : 0;

          if (childrenLen) {
            if (!node._isFilteredOut) {
              if (s.allowChildExpandOnMatch) {
                for (let i2 = 0; i2 < childrenLen; i2++) {
                  children[i2]._isFilteredOut = false;
                }
              } else {
                let isAllChildrenFiltered = true;
                for (let i2 = 0; i2 < childrenLen; i2++) {
                  if (!children[i2]._isFilteredOut) {
                    isAllChildrenFiltered = false;
                  }
                }
                node.isAllChildrenFiltered = isAllChildrenFiltered;
              }
            }
            checkNodes(children, node, depth++);
          }
        }
      };
      const setParents = function (nodeData) {
        let found = false;
        for (let i = 0, l = nodeData.length; i < l; i++) {
          const node = nodeData[i];
          if (node._isFilteredOut && !found && node.children?.length) {
            node._isFilteredOut = !setParents(node.children);
          }
          if (typeof node._isFilteredOut === 'boolean' && !node._isFilteredOut) {
            found = true;
          }
        }
        return found;
      };
      setParents(s.dataset);
      checkNodes(s.dataset, 0);
    }
  },

  /**
  * Clear the Filter row Conditions and Reset the Data.
  */
  clearFilter() {
    if (!this.settings.filterable) {
      return;
    }

    this.clearFilterFields();

    this.applyFilter();
    this.element.trigger('filtered', { op: 'clear', conditions: [] });
  },

  /**
  * Clear the Filter fields.
  */
  clearFilterFields() {
    if (!this.settings.filterable) {
      return;
    }

    this.element.find('.datagrid-header input, select').each(function () {
      const input = $(this);
      input.val('');
      if (input.is('select')) {
        input.find('option').each(function () {
          $(this).prop('selected', false);
        });
      }
      input.trigger('updated');
    });

    // reset all the filters to first item
    this.element.find('.datagrid-header .btn-filter').each(function () {
      const btn = $(this);
      const ul = btn.next();
      const first = ul.find('li:first');

      btn.find('svg:first > use').attr('href', `#icon-filter-${btn.attr('data-default')}`);
      ul.find('.is-checked').removeClass('is-checked');
      first.addClass('is-checked');
    });
  },

  /**
  * Set the Filter Conditions on the UI Only.
  * @param {object} conditions An array of objects with the filter conditions.
  */
  setFilterConditions(conditions) {
    this.clearFilterFields();
    for (let i = 0; i < conditions.length; i++) {
      // Find the filter row
      const rowElem = this.element.find(`.datagrid-header th[data-column-id="${conditions[i].columnId}"]`);
      const input = rowElem.find('input, select');
      const btn = rowElem.find('.btn-filter');
      const ul = btn.next();

      if (conditions[i].value === undefined) {
        conditions[i].value = '';
      }

      input.val(conditions[i].value);

      // Enable clear button
      if (input.is('.lookup') && input.parent().find('svg.close').length === 1 && conditions[i].value) {
        input.parent().find('svg.close').removeClass('is-empty');
      }

      if (input.is('select')) {
        const firstVal = conditions[i].value instanceof Array ?
          conditions[i].value[0] : conditions[i].value;
        if (conditions[i].innerHTML) {
          input[0].innerHTML = conditions[i].innerHTML;
        }
        if (!input.find(`option[value="${firstVal}"]`).length) {
          const dropdownApi = input.data('dropdown');
          if (dropdownApi) {
            dropdownApi.setCode(conditions[i].value);
          }
        } else if (conditions[i].value instanceof Array && !conditions[i].selectedOptions) {
          const options = input[0].querySelectorAll('option');
          input.val('');
          for (let k = 0; k < options.length; k++) {
            options[k].selected = false;
          }
          for (let j = 0; j < conditions[i].value.length; j++) {
            input.find(`option[value="${conditions[i].value[j]}"]`).prop('selected', true);
          }
        } else {
          input.find(`option[value="${conditions[i].value}"]`).prop('selected', true);
        }
        input.trigger('updated');
      }

      btn.find('svg:first > use').attr('href', `#icon-filter-${conditions[i].operator}`);
      ul.find('.is-checked').removeClass('is-checked');
      ul.find(`.${conditions[i].operator}`).addClass('is-checked');
    }
  },

  /**
  * Get filter conditions in array from whats set in the UI.
  * @returns {array} An array with the currently showing filter conditions.
  */
  filterConditions() {
    // Do not modify keyword search filter expr
    if (this.filterExpr && this.filterExpr.length === 1 && this.filterExpr[0].keywordSearch) {
      delete this.filterExpr[0].keywordSearch;
      return this.filterExpr;
    }

    const filterExpr = [];
    const self = this;

    // Create an array of objects with: field, id, filterType, operator, value
    this.element.find('th.is-filterable').each(function () {
      const rowElem = $(this);
      const btn = rowElem.find('.btn-filter');
      const input = rowElem.find('input, select');
      const isDropdown = input.is('select');
      const svg = btn.find('.icon-dropdown:first');
      let op = null;
      let format = null;

      if (!btn.length && !isDropdown) {
        return;
      }

      op = isDropdown ? 'equals' : svg.getIconName().replace('filter-', '');

      if (op === 'selected-notselected') {
        return;
      }

      if (input.val() === '' && ['is-not-empty', 'is-empty', 'selected', 'not-selected'].indexOf(op) === -1) {
        return;
      }

      if (input.val() instanceof Array && input.val().length === 0) {
        return;
      }

      let value = input.val() ? input.val() : '';
      if (input.attr('data-mask-mode') && input.attr('data-mask-mode') === 'number') {
        value = Locale.parseNumber(value);
      }

      const condition = {
        columnId: rowElem.attr('data-column-id'),
        operator: op,
        value
      };

      if (input.data('datepicker')) {
        format = input.data('datepicker').pattern;
        condition.format = format;
      }

      if (input.data('timepicker')) {
        format = input.data('timepicker').settings.timeFormat;
        condition.format = format;
      }

      if (input.is('select')) {
        condition.innerHTML = input[0].innerHTML;
      }

      const column = self.columnById(condition.columnId);
      if (column && column[0]) {
        condition.filterType = column[0].filterType;
      }
      filterExpr.push(condition);
    });

    return filterExpr;
  },

  /**
  * Get extra top position for current target in header
  * @private
  * @returns {number} the extra top position of the rows depending on rowHeight setting.
  */
  getExtraTop() {
    const s = this.settings;
    const topPositions = {
      default: { extraSmall: 0, short: 0, small: 0, medium: 0, normal: 0, large: 0 },
      filterable: { extraSmall: 0, short: 0, small: 0, medium: 0, normal: 0, large: 0 },
      group: { extraSmall: -22, short: -25, small: -25, medium: -30, normal: -39, large: -39 },
      groupFilter: { extraSmall: -28, short: -29, small: -29, medium: -32, normal: -39, large: -39 }
    };
    let extraTop = 0;
    const prop = s.rowHeight === 'extra-small' ? 'extraSmall' : s.rowHeight;
    if (s.columnGroups) {
      extraTop = s.filterable ?
        topPositions.groupFilter[prop] : topPositions.group[prop];
    } else {
      extraTop = s.filterable ?
        topPositions.filterable[prop] : topPositions.default[prop];
    }
    return extraTop;
  },

  /**
  * Get height for current target in header
  * @private
  * @returns {number} the height of the rows depending on rowHeight setting.
  */
  getTargetHeight() {
    const s = this.settings;
    const heights = {
      default: { extraSmall: 20, short: 20, small: 20, medium: 28, normal: 35, large: 35 },
      filterable: { extraSmall: 47, short: 53, small: 53, medium: 54, normal: 60, large: 60 },
      group: { extraSmall: 43, short: 46, small: 46, medium: 56, normal: 74, large: 74 },
      groupFilter: { extraSmall: 80, small: 80, short: 83, medium: 87, normal: 103, large: 103 }
    };
    let height = 0;
    const prop = s.rowHeight === 'extra-small' ? 'extraSmall' : s.rowHeight;
    if (s.columnGroups) {
      height = s.filterable && this.filterRowRendered ?
        heights.groupFilter[prop] : heights.group[prop];
    } else {
      height = s.filterable && this.filterRowRendered ?
        heights.filterable[prop] : heights.default[prop];
    }
    return height;
  },

  /**
  * Get padding for a row height
  * @private
  * @returns {number} padding (left and right) for the current rowHeight
  */
  getCellPadding() {
    const padding = { 'extra-small': 8, short: 8, small: 8, medium: 16, normal: 16, large: 16 };
    return padding[this.settings.rowHeight];
  },

  /**
  * Create draggable columns
  * @private
  */
  createDraggableColumns() {
    const self = this;
    const headers = self.headerNodes().not('[data-column-id="selectionCheckbox"]').not('.datagrid-header-spacer-column');
    let showTarget = $('.drag-target-arrows', self.element);

    if (!showTarget.length) {
      self.element.prepend(`<span class="drag-target-arrows" style="height: ${self.getTargetHeight()}px;"></span>`);
      showTarget = $('.drag-target-arrows', self.element);
    }

    headers.not('[data-reorder="false"]').prepend(`</span><span class="handle">${$.createIcon({ icon: 'drag' })}</span>`);
    headers.prepend('<span class="is-draggable-target"></span>');
    headers.last().append('<span class="is-draggable-target last"></span>');
    self.element.addClass('has-draggable-columns');

    // Initialize Drag api
    $('.handle', headers).each(function () {
      let clone = null;
      let headerPos = null;
      let offPos = null;
      let extraTopPos = 0;
      const handle = $(this);
      const header = handle.parent();

      handle.on('mousedown.datagrid', (e) => {
        e.preventDefault();

        header.drag({
          clone: true, cloneAppendTo: headers.first().parent().parent(), clonePosIsFixed: true
        })
          .on('dragstart.datagrid', (dragStartEvent, pos, thisClone) => {
            clone = thisClone;

            clone.removeAttr('id').addClass('is-dragging-clone')
              .css({
                left: !Locale.isRTL() ? pos.left : pos.right - clone.width(),
                top: pos.top,
                height: header.height(),
                border: 0
              });

            $('.is-draggable-target', clone).remove();

            self.setDraggableColumnTargets();

            extraTopPos = self.getExtraTop();
            headerPos = header.position();
            offPos = { top: (pos.top - headerPos.top), left: (pos.left - headerPos.left) };

            const index = self.targetColumn(headerPos);
            self.draggableStatus.startIndex = index;
            e.stopImmediatePropagation();
          })
          .on('drag.datagrid', (dragEvent, pos) => {
            clone[0].style.left = `${parseInt(!Locale.isRTL() ? pos.left : ((pos.left + pos.offset.x) - pos.clone.width()), 10)}px`;
            clone[0].style.top = `${parseInt(pos.top, 10)}px`;
            headerPos = { top: (pos.top - offPos.top), left: (pos.left - offPos.left) };

            if (Locale.isRTL()) {
              headerPos.left = parseInt(clone[0].style.left, 10);
            }
            let n = 0;
            let target = null;
            let rect = null;
            const index = self.targetColumn(headerPos);

            $('.is-draggable-target', headers).add(showTarget).removeClass('is-over');

            if (index !== -1) {
              for (let i = 0, l = self.draggableColumnTargets.length; i < l; i++) {
                target = self.draggableColumnTargets[i];
                n = i + 1;

                if (target.index === index && target.index !== self.draggableStatus.startIndex) {
                  if (target.index > self.draggableStatus.startIndex && (n < l)) {
                    target = self.draggableColumnTargets[n];
                  }

                  target.el.addClass('is-over');
                  showTarget.addClass('is-over');
                  rect = target.el[0].getBoundingClientRect();
                  showTarget[0].style.left = `${parseInt(rect.left + (Locale.isRTL() ? 2 : 0), 10)}px`;
                  let lastAdjustment = 0;
                  if (target.el.hasClass('last')) {
                    lastAdjustment = -(header.height() - 3);
                  }
                  showTarget[0].style.top = `${(parseInt(rect.top, 10) + 1) + extraTopPos + lastAdjustment}px`;
                }
              }
            }

            e.stopImmediatePropagation();
          })
          .on('dragend.datagrid', (dragendEvent, pos) => {
            if (!Locale.isRTL()) {
              clone[0].style.left = `${parseInt(pos.left, 10)}px`;
              clone[0].style.top = `${parseInt(pos.top, 10)}px`;
            }

            headerPos = { top: (pos.top - offPos.top), left: (pos.left - offPos.left) };
            if (Locale.isRTL()) {
              headerPos.left = parseInt(clone[0].style.left, 10);
            }
            const index = self.targetColumn(headerPos);
            const dragApi = header.data('drag');
            const tempArray = [];
            let i;
            let l;
            let indexFrom;
            let indexTo;

            // Unbind drag from header
            if (dragApi && dragApi.destroy) {
              dragApi.destroy();
            }

            self.draggableStatus.endIndex = index;
            $('.is-draggable-target', headers).add(showTarget).removeClass('is-over');

            if (self.draggableStatus.endIndex !== -1) {
              if (self.draggableStatus.startIndex !== self.draggableStatus.endIndex) {
                // Swap columns
                for (i = 0, l = self.settings.columns.length; i < l; i++) {
                  if (!self.settings.columns[i].hidden &&
                        self.settings.columns[i].id !== 'selectionCheckbox') {
                    tempArray.push(i);
                  }
                }

                indexFrom = tempArray[self.draggableStatus.startIndex] || 0;
                indexTo = tempArray[self.draggableStatus.endIndex] || 0;

                self.updateGroupHeadersAfterColumnReorder(indexFrom, indexTo);
                self.arrayIndexMove(self.settings.columns, indexFrom, indexTo);
                self.updateColumns(self.settings.columns);
              }
            }
          });
      });
    });
  },

  /**
  * Set draggable columns target elements
  * @private
  */
  setDraggableColumnTargets() {
    const self = this;
    const headers = self.headerNodes()
      .not('.is-hidden')
      .not('[data-column-id="selectionCheckbox"]')
      .not('.datagrid-header-spacer-column');
    let target;
    let pos;
    let extra;

    self.draggableColumnTargets = [];
    self.draggableStatus = {};

    // Move last target if not found in last header
    if (!$('.is-draggable-target.last', headers.last()).length) {
      headers.last().append($('.is-draggable-target.last', self.headerNodes()));
    }

    $('.is-draggable-target', headers).each(function (index) {
      const idx = ($(this).is('.last')) ? index - 1 : index; // Extra target for last header th
      target = headers.eq(idx);
      pos = target.position();
      // Extra space around, if dropped item bit off from drop area
      extra = 20;

      self.draggableColumnTargets.push({
        el: $(this),
        index: idx,
        pos,
        width: target.outerWidth(),
        height: target.outerHeight(),
        dropArea: {
          x1: pos.left - extra,
          x2: pos.left + target.outerWidth() + extra,
          y1: (pos.top - extra) + self.getExtraTop(),
          y2: pos.top + target.outerHeight() + extra
        }
      });
    });
  },

  /**
  * Get column index for dragging columns
  * @private
  * @param {object} pos The position index
  * @returns {number} The column array index
  */
  targetColumn(pos) {
    const self = this;
    let idx = -1;
    let target;
    let i;
    let l;

    for (i = 0, l = self.draggableColumnTargets.length - 1; i < l; i++) {
      target = self.draggableColumnTargets[i];
      if (pos.left > target.dropArea.x1 && pos.left < target.dropArea.x2 &&
          pos.top > target.dropArea.y1 && pos.top < target.dropArea.y2) {
        idx = target.index;

        // In RTL mode return the first one found. In LTR return the last one found.
        if (Locale.isRTL()) {
          return idx;
        }
      }
    }
    return idx;
  },

  /**
  * Move an array element to a different position. May be dups of this function.
  * @private
  * @param {array} arr The array
  * @param {array} from The from position
  * @param {array} to The to position
  */
  arrayIndexMove(arr, from, to) {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
  },

  /**
  * Attach Drag Events to Rows
  * @private
  */
  createDraggableRows() {
    const self = this;

    if (!this.settings.rowReorder) {
      return;
    }

    this.tableBody.children().filter(function () {
      return $(this).find('.datagrid-reorder-icon').length < 1;
    }).attr('data-arrange-exclude', true);

    // Attach the Drag API
    this.tableBody.arrange({
      placeholder: `<tr class="datagrid-reorder-placeholder"><td colspan="${this.visibleColumns().length}"></td></tr>`,
      handle: '.datagrid-reorder-icon',
      isVisualItems: true
    })
      .off('beforearrange.datagrid').on('beforearrange.datagrid', (e, status) => {
        if (self.isSafari) {
          status.start.css({ display: 'inline-block' });
        }
      })
      .off('arrangeupdate.datagrid')
      .on('arrangeupdate.datagrid', (e, status) => {
        if (self.isSafari) {
          status.end.css({ display: '' });
        }

        self.reorderRow(status.startIndex, status.endIndex, status);
      });
  },

  /**
   * Move a row from one position to another.
   * @param {number} startIndex The row to move.
   * @param {boolean} endIndex The end index.
   * @param {object} status The drag event object.
   */
  reorderRow(startIndex, endIndex, status) {
    const moveDown = endIndex > startIndex;
    const startRow = this.tableBody.find('tr').eq(startIndex);
    const endRow = this.tableBody.find('tr').eq(endIndex);

    // Move the elem in the data set
    const dataRowIndex = { start: this.dataRowIndex(status ? status.start : endRow) };
    dataRowIndex.end = dataRowIndex.start + (endIndex - startIndex);
    this.arrayIndexMove(this.settings.dataset, dataRowIndex.start, dataRowIndex.end);

    if (status) {
      // If using expandable rows move the expandable row with it
      if (this.settings.rowTemplate || this.settings.expandableRow) {
        if (moveDown) {
          this.tableBody.find('tr').eq(startIndex * 2).insertAfter(status.end);
          status.end.next().next().insertAfter(status.over);
        } else {
          this.tableBody.find('tr').eq(startIndex * 2).next().insertAfter(status.end);
        }
      }
    } else {
      // Move in the ui
      startRow[moveDown ? 'insertAfter' : 'insertBefore'](endRow);
    }

    // Resequence the rows
    const allRows = this.tableBody.find('tr:not(.datagrid-expandable-row)');
    for (let i = 0; i < allRows.length; i++) {
      allRows[i].setAttribute('data-index', i);
      allRows[i].setAttribute('aria-rowindex', this.pagingRowIndex(i + 1));
    }

    /**
    * Fires after a row is moved via the rowReorder option.
    * @event rowremove
    * @memberof Datagrid
    * @property {object} event The jquery event object
    * @property {object} status Object with row reorder info
    * @property {number} status.endIndex The ending row index
    * @property {number} status.startIndex The starting row index
    * @property {HTMLElement} status.over The row object that was dragged over.
    * @property {HTMLElement} status.start The starting row object.
    */
    this.element.trigger('rowreorder', [{
      endIndex,
      startIndex,
      over: endRow,
      start: startRow,
    }]);
    this.syncSelectedRowsIdx();
  },

  /**
  * Return the value in a field, taking into account nested objects. Fx obj.field.id
  * @private
  * @param {object} obj The object to use
  * @param {string} field The field as a string fx 'field' or 'obj.field.id'
  * @returns {any} The current value in the field.
  */
  fieldValue(obj, field) {
    if (!field || !obj) {
      return '';
    }

    let rawValue;
    if (field.indexOf('.') > -1) {
      rawValue = field.split('.').reduce((o, x) => (o ? o[x] : ''), obj);
    } else {
      rawValue = obj[field];
    }

    let value = (rawValue || rawValue === 0 || rawValue === false ? rawValue : '');
    value = xssUtils.escapeHTML(value);
    return value;
  },

  /**
  * Setup internal tree root nodes array.
  * @private
  */
  setTreeRootNodes() {
    if (!this.settings.treeGrid) {
      return;
    }
    this.settings.treeRootNodes = this.settings.treeDepth
      .filter(node => node.depth === 1);
  },

  /**
   * Setup internal tree depth array.
   * @private
   * @param {array} dataset The json array to use for calculating tree depth.
   */
  setTreeDepth(dataset) {
    if (!this.settings.treeGrid) {
      return;
    }
    const self = this;
    let idx = 0;
    const iterate = function (node, depth, parent = []) {
      idx++;
      self.settings.treeDepth.push({ idx, depth, parents: parent.slice(), node });
      const len = node.children?.length;
      if (len) {
        parent.push(idx - 1);
        for (let i = 0; i < len; i++) {
          iterate(node.children[i], depth + 1, parent.slice());
        }
      }
    };

    dataset = dataset || this.settings.dataset;
    self.settings.treeDepth = [];

    for (let i = 0, len = dataset.length; i < len; i++) {
      iterate(dataset[i], 1);
    }
  },

  /**
  * Setup internal row grouping
  * @private
  */
  setRowGrouping() {
    const groupSettings = this.settings.groupable;
    if (!groupSettings) {
      return;
    }

    if (!this.originalDataset) {
      this.originalDataset = this.settings.dataset.slice();
    } else {
      this.settings.dataset = this.originalDataset;
    }

    if (!groupSettings.aggregator || groupSettings.aggregator === 'none') {
      this.settings.dataset = GroupBy.none(this.settings.dataset, groupSettings.fields);
      return;
    }

    if (groupSettings.aggregator === 'sum') {
      this.settings.dataset = GroupBy.sum(
        this.settings.dataset,
        groupSettings.fields,
        groupSettings.aggregate
      );
      return;
    }

    if (groupSettings.aggregator === 'max') {
      this.settings.dataset = GroupBy.max(
        this.settings.dataset,
        groupSettings.fields,
        groupSettings.aggregate
      );
      return;
    }

    if (groupSettings.aggregator === 'min') {
      this.settings.dataset = GroupBy.min(
        this.settings.dataset,
        groupSettings.fields,
        groupSettings.aggregate
      );
      return;
    }

    if (groupSettings.aggregator === 'avg') {
      this.settings.dataset = GroupBy.avg(
        this.settings.dataset,
        groupSettings.fields,
        groupSettings.aggregate
      );
      return;
    }

    if (groupSettings.aggregator === 'count') {
      this.settings.dataset = GroupBy.count(
        this.settings.dataset,
        groupSettings.fields,
        groupSettings.aggregate
      );
      return;
    }

    if (groupSettings.aggregator === 'list') {
      this.settings.dataset = GroupBy.list(
        this.settings.dataset,
        groupSettings.fields,
        groupSettings.aggregatorOptions
      );
      return;
    }

    this.settings.dataset = GroupBy(this.settings.dataset, groupSettings.fields);
  },

  /**
  * Clear the table body and rows.
  * @private
  */
  renderRows() {
    let tableHtml = '';
    let tableHtmlLeft = '';
    let tableHtmlRight = '';
    let j = 0;
    const self = this;
    const s = self.settings;
    const body = self.table.find('tbody');
    let activePage = 1;
    if (self.pagerAPI) {
      const pagerState = self.pagerAPI.state;
      if (pagerState.filteredActivePage) {
        activePage = pagerState.filteredActivePage;
      } else {
        activePage = pagerState.activePage;
      }
    }

    self.bodyColGroupHtmlLeft = '<colgroup>';
    self.bodyColGroupHtml = '<colgroup>';
    self.bodyColGroupHtmlRight = '<colgroup>';
    self.triggerDestroyCell(); // Trigger Destroy on previous cells

    if (!self.settings.columns || self.settings.columns.length === 0) {
      self.settings.columns.push({ id: 'blank', value: '', field: '' });
    }

    this.currentPageRows = [];

    for (j = 0; j < self.settings.columns.length; j++) {
      const col = self.settings.columns[j];
      const container = self.getContainer(col.id);
      const colWidth = self.columnWidth(col, j);

      switch (container) {
        case 'left':
          self.bodyColGroupHtmlLeft += `<col${colWidth}${col.hidden ? ' class="is-hidden"' : ''}></col>`;
          break;
        case 'right':
          self.bodyColGroupHtmlRight += `<col${colWidth}${col.hidden ? ' class="is-hidden"' : ''}></col>`;
          break;
        default:
          self.bodyColGroupHtml += `<col${colWidth}${col.hidden ? ' class="is-hidden"' : ''}></col>`;
      }

      if (col.colspan) {
        self.hasColSpans = true;
      }
    }

    // Prevent flashing message area on filter / reload
    if (self.emptyMessageContainer) {
      self.emptyMessageContainer.hide();
    }

    if (body.length === 0) {
      if (self.hasLeftPane) {
        self.tableBodyLeft = $('<tbody role="rowgroup"></tbody>');
        self.tableLeft.append(self.tableBodyLeft);
      }
      self.tableBody = $('<tbody role="rowgroup"></tbody>');
      self.table.append(self.tableBody);
      if (self.hasRightPane) {
        self.tableBodyRight = $('<tbody role="rowgroup"></tbody>');
        self.tableRight.append(self.tableBodyRight);
      }
    }

    self.groupArray = [];

    self.recordCount = 0;
    self.filteredCount = 0;
    self.runningCount = 0;

    // Reset recordCount for paging
    if (s.treeGrid && s.paging && !s.source && activePage > 1) {
      self.recordCount = s.treeRootNodes[(s.pagesize * activePage) - s.pagesize].idx - 1;
    }

    if (this.restoreSortOrder) {
      this.sortDataset();
    }

    let rowStatusTooltip = false;
    for (let i = 0; i < s.dataset.length; i++) {
      // For better performance dont render out of page
      if (s.paging && !s.source) {
        if (activePage === 1 && (i - this.filteredCount) >= s.pagesize) {
          if (!s.dataset[i]._isFilteredOut) {
            this.recordCount++;
          } else {
            this.filteredCount++;
          }
          continue; //eslint-disable-line
        }

        if (activePage > 1 && !((i - this.filteredCount) >= s.pagesize * (activePage - 1) &&
          (i - this.filteredCount) < s.pagesize * activePage)) {
          if (!s.dataset[i]._isFilteredOut) {
            if (this.filteredCount) {
              this.recordCount++;
            }
          } else {
            this.filteredCount++;
          }
          continue; //eslint-disable-line
        }
      }

      if (s.virtualized) {
        if (!this.isRowVisible(this.recordCount)) {
          this.recordCount++;
          continue;  //eslint-disable-line
        }
      }

      // Exclude Filtered Rows
      if ((!s.treeGrid && s.dataset[i])._isFilteredOut) {
        this.filteredCount++;
        continue; //eslint-disable-line
      }

      // Handle Grouping
      if (this.settings.groupable) {
        // Filter and sorted
        if (s.dataset[i].values) {
          const thisLength = s.dataset[i].values.length;
          let thisFilterCount = 0;
          for (let k = 0; k < thisLength; k++) {
            if (s.dataset[i].values[k]._isFilteredOut) {
              thisFilterCount++;
            }
          }
          if (thisFilterCount === thisLength) {
            continue; //eslint-disable-line
          }
        }

        // First push group row
        if (!this.settings.groupable.suppressGroupRow) {
          // Show the grouping row
          const groupHtml = self.rowHtml(s.dataset[i], this.recordCount, i, true);
          if (this.hasLeftPane && groupHtml.left) {
            tableHtmlLeft += groupHtml.left;
          }
          if (groupHtml.center) {
            tableHtml += groupHtml.center;
          }
          if (this.hasRightPane && groupHtml.right) {
            tableHtmlRight += groupHtml.right;
          }
        }

        if (this.settings.groupable.showOnlyGroupRow && s.dataset[i].values[0]) {
          const rowData = s.dataset[i].values[0];

          if (s.dataset[i].list) {
            rowData.list = s.dataset[i].list;
          }

          rowData.values = s.dataset[i].values;
          const groupHtml = self.rowHtml(rowData, this.recordCount, i);
          if (this.hasLeftPane && groupHtml.left) {
            tableHtmlLeft += groupHtml.left;
          }
          if (groupHtml.center) {
            tableHtml += groupHtml.center;
          }
          if (this.hasRightPane && groupHtml.right) {
            tableHtmlRight += groupHtml.right;
          }

          this.recordCount++;
          self.groupArray.push({ group: i, node: 0 });
          continue;  //eslint-disable-line
        }

        // Now Push Groups
        for (let k = 0; k < s.dataset[i].values.length; k++) {
          if (!s.dataset[i].values[k]._isFilteredOut) {
            const rowHtml = self.rowHtml(
              s.dataset[i].values[k],
              this.recordCount,
              s.dataset[i].values[k].idx
            );
            if (self.hasLeftPane && rowHtml.left) {
              tableHtmlLeft += rowHtml.left;
            }
            if (rowHtml.center) {
              tableHtml += rowHtml.center;
            }
            if (self.hasRightPane && rowHtml.right) {
              tableHtmlRight += rowHtml.right;
            }
            this.recordCount++;
            self.groupArray.push({ group: i, node: k });
          }
        }

        // Now Push summary rowHtml
        if (this.settings.groupable.groupFooterRow) {
          const rowHtml = self.rowHtml(s.dataset[i], this.recordCount, i, true, true);
          if (self.hasLeftPane && rowHtml.left) {
            tableHtmlLeft += rowHtml.left;
          }
          if (rowHtml.center) {
            tableHtml += rowHtml.center;
          }
          if (self.hasRightPane && rowHtml.right) {
            tableHtmlRight += rowHtml.right;
          }
        }

        continue;  //eslint-disable-line
      }

      let currentCount = i;
      if (s.treeGrid) {
        currentCount = this.recordCount;
      }

      self.runningCount++;
      const rowHtml = self.rowHtml(s.dataset[i], currentCount, i);
      if (self.hasLeftPane && rowHtml.left) {
        tableHtmlLeft += rowHtml.left;
      }
      if (rowHtml.center) {
        tableHtml += rowHtml.center;

        if (s.treeGrid && this.filterExpr?.length) {
          if ($(`<table>${rowHtml.center}</table>`).find('tr:first').is('.is-hidden')) {
            this.filteredCount++;
          }
        }
      }
      if (self.hasRightPane && rowHtml.right) {
        tableHtmlRight += rowHtml.right;
      }

      if (!s.dataset[i]._isFilteredOut) {
        this.recordCount++;
      }
      this.visibleRowCount = currentCount + 1;

      if (s.dataset[i].rowStatus) {
        rowStatusTooltip = true;
      }
    }

    // Append a Summary Row
    if (this.settings.summaryRow) {
      self.element.addClass('has-summary-row');

      const totals = self.calculateTotals();
      const summaryRowHtml = self.rowHtml(totals, this.recordCount, null, false, true);
      if (self.hasLeftPane && summaryRowHtml.left) {
        tableHtmlLeft += summaryRowHtml.left;
      }
      if (summaryRowHtml.center) {
        tableHtml += summaryRowHtml.center;
      }
      if (self.hasRightPane && summaryRowHtml.right) {
        tableHtmlRight += summaryRowHtml.right;
      }
    }

    if (self.bodyColGroupHtml !== '<colgroup>') {
      if (this.settings.spacerColumn) {
        self.bodyColGroupHtml += '<col style="width: 100%">';
      }
      self.bodyColGroupHtmlLeft += '</colgroup>';
      self.bodyColGroupHtml += '</colgroup>';
      self.bodyColGroupHtmlRight += '</colgroup>';

      if (self.bodyColGroupLeft) {
        self.bodyColGroupLeft.remove();
      }

      if (self.bodyColGroup) {
        self.bodyColGroup.remove();
      }

      if (self.bodyColGroupRight) {
        self.bodyColGroupRight.remove();
      }

      if (self.hasLeftPane) {
        self.bodyColGroupLeft = $(self.bodyColGroupHtmlLeft);
        (self.headerRowLeft || self.tableBodyLeft).before(self.bodyColGroupLeft);
      }

      self.bodyColGroup = $(self.bodyColGroupHtml);
      (self.headerRow || self.tableBody).before(self.bodyColGroup);

      if (self.hasRightPane) {
        self.bodyColGroupRight = $(self.bodyColGroupHtmlRight);
        (self.headerRowRight || self.tableBodyRight).before(self.bodyColGroupRight);
      }
    }

    if (self.hasLeftPane) {
      DOM.html(self.tableBodyLeft, tableHtmlLeft, '*');
    }

    DOM.html(self.tableBody, tableHtml, '*');

    if (self.hasRightPane) {
      DOM.html(self.tableBodyRight, tableHtmlRight, '*');
    }
    self.setVirtualHeight();
    self.setScrollClass();
    self.setupTooltips(rowStatusTooltip);
    self.afterRender();
  },

  /**
  * Fire events and do steps needed after a full render.
  * @private
  */
  afterRender() {
    const self = this;

    if (this.settings.fixedRowHeight && this.settings.fixedRowHeight === 'auto' &&
      this.settings.frozenColumns) {
      self.tableBody.find('tr').each(function (i) {
        let leftHeight = 0;
        let centerHeight = 0;
        let rightHeight = 0;
        const row = $(this);
        centerHeight = row.height();

        if (self.tableBodyLeft) {
          leftHeight = self.tableBodyLeft.find('tr').eq(i).height();
        }
        if (self.tableBodyRight) {
          rightHeight = self.tableBodyLeft.find('tr').eq(i).height();
        }

        const maxHeight = Math.max(leftHeight, centerHeight, rightHeight);
        row.css('height', maxHeight);
        if (self.tableBodyLeft) {
          leftHeight = self.tableBodyLeft.find('tr').eq(i).css('height', maxHeight);
        }
        if (self.tableBodyRight) {
          rightHeight = self.tableBodyLeft.find('tr').eq(i).css('height', maxHeight);
        }
        return true;
      });
    }

    // Column column postRender functions
    if (this.settings.onPostRenderCell) {
      for (let i = 0; i < this.settings.columns.length; i++) {
        const col = self.settings.columns[i];

        if (col.component) {
          self.tableBody.find('tr').each(function () {
            const row = $(this);
            const rowIdx = self.settings.treeGrid ?
              self.actualPagingRowIndex(self.actualRowIndex(row)) :
              self.dataRowIndex(row);
            const lineage = row.attr('data-lineage');
            const rowData = self.rowData(rowIdx);
            const colIdx = self.columnIdxById(col.id) - (self.settings.frozenColumns?.left?.length || 0);
            const args = {
              row: lineage || rowIdx,
              cell: colIdx,
              value: rowData,
              rowData,
              col,
              api: self
            };

            self.settings.onPostRenderCell(row.find('td').eq(colIdx).find('.datagrid-cell-wrapper .content')[0], args);
          });
        }
      }
    }

    // Init Inline Elements
    const dropdowns = self.tableBody.find('select.dropdown');
    if (dropdowns.dropdown) {
      dropdowns.dropdown();
    }

    // Commit Edits for inline editing
    self.tableBody.find('.dropdown-wrapper.is-inline').prev('select')
      .on('listclosed', function () {
        const elem = $(this);
        const newValue = elem.val();
        const row = elem.closest('tr');

        self.updateCellNode(row.attr('aria-rowindex'), elem.closest('td').index(), newValue, false, true);
      });

    const spinboxes = self.tableBody.find('.spinbox');
    if (spinboxes.spinbox) {
      spinboxes.spinbox();
    }

    // Set UI elements after dataload
    if (!self.settings.source) {
      self.displayCounts();
    }

    self.setAlternateRowShading();
    self.createDraggableRows();

    const focusedEl = document.activeElement;
    if (self.activeCell.isFocused &&
        (!focusedEl || (focusedEl && focusedEl.tagName.toLowerCase() === 'body'))) {
      self.setActiveCell(self.activeCell.row, self.activeCell.cell);
    }

    // Deselect rows when changing pages
    if (self.settings.paging && self.settings.source && !self.settings.allowSelectAcrossPages) {
      if (!self.preventSelection) {
        self._selectedRows = [];
      }
      self.syncSelectedUI();
    }

    // Restore selected rows when pages change
    if (self.settings.paging && self.settings.source && self.settings.allowSelectAcrossPages) {
      self.syncSelectedRows();
      self.syncSelectedUI();
    }

    // Restore selected rows when pages change for single select
    if (self.settings.paging && !self.settings.source &&
      self.settings.allowSelectAcrossPages === null) {
      self.syncSelectedRows();
      self.syncSelectedUI();
    }

    if (this.stretchColumnDiff < 0) {
      const currentCol = this.bodyColGroup.find('col').eq(self.getStretchColumnIdx())[0];
      currentCol.style.width = `${this.stretchColumnWidth}px`;
    }

    /**
    * Fires after the entire grid is rendered.
    * @event afterrender
    * @memberof Datagrid
    * @property {object} event The jquery event object
    * @property {HTMLElement} body Object table body area
    * @property {HTMLElement} header Object table header area
    * @property {HTMLElement} pager Object pager body area
    */
    setTimeout(() => {
      self.element.trigger('afterrender', { body: self.container.find('tbody'), header: self.container.find('thead'), pager: self.pagerAPI });
      this.activateFirstCell();
    });
  },

  /**
   * Set active node to first cell and focus if possible
   * @private
   */
  activateFirstCell() {
    if (!this.activeCell || !this.activeCell.node) {
      this.activeCell = { node: this.cellNode(0, 0).attr('tabindex', '0'), isFocused: false, cell: 0, row: 0 };
    }
  },

  /**
  * Trigger the onDestroyCell for each cell
  * @private
  */
  triggerDestroyCell() {
    const self = this;

    if (!self.tableBody) {
      return;
    }

    // Call onDestroyCell
    if (this.settings.onPostRenderCell && this.settings.onDestroyCell) {
      const rows = self.tableBody.find('tr');

      if (rows.length === 0) {
        return;
      }

      for (let i = 0; i < this.settings.columns.length; i++) {
        const col = this.settings.columns[i];

        if (col.component) {
          rows.each(function () {
            const row = $(this);
            const rowIdx = row.index();
            const colIdx = self.columnIdxById(col.id);
            const args = {
              row: row.index(),
              cell: colIdx,
              value: self.settings.dataset[rowIdx],
              col,
              api: self
            };

            self.settings.onDestroyCell(row.find('td').eq(colIdx).find('.datagrid-cell-wrapper .content')[0], args);
          });
        }
      }
    }
  },

  /**
  * Cache info on virtual scrolling for better performance.
  * @private
  */
  cacheVirtualStats() {
    const containerHeight = this.element[0].offsetHeight;
    const scrollTop = this.bodyWrapperCenter[0].scrollTop;
    let headerHeight = this.settings.rowHeight === 'normal' || this.settings.rowHeight === 'large' ?
      40 : (this.settings.rowHeight === 'medium' ? 30 : 25);
    const bodyH = containerHeight - headerHeight;
    let rowH = this.settings.rowHeight === 'normal' || this.settings.rowHeight === 'large' ?
      50 : (this.settings.rowHeight === 'medium' ? 40 : 30);

    if (this.settings.rowHeight === 'extra-small') {
      headerHeight = 22;
      rowH = 27;
    }

    this.virtualRange = {
      rowHeight: rowH,
      top: Math.max(scrollTop - ((this.settings.virtualRowBuffer - 1) * rowH), 0),
      bottom: scrollTop + bodyH + ((this.settings.virtualRowBuffer - 1) * rowH),
      totalHeight: rowH * this.settings.dataset.length,
      bodyHeight: bodyH
    };
  },

  /**
  * Check if the row is in the visble scroll area + buffer
  * Just call renderRows() on events that change
  * @private
  * @param  {number} rowIndex Row index to check.
  * @returns {boolean} Current row visibility.
  */
  isRowVisible(rowIndex) {
    if (!this.settings.virtualized) {
      if (this.settings.paging && !this.settings.source && rowIndex && this.pagerAPI) {
        return (this.pagerAPI.activePage - 1) * this.settings.pagesize <= rowIndex &&
            (this.pagerAPI.activePage) * this.settings.pagesize >= rowIndex;
      }

      return true;
    }

    if (rowIndex === 0) {
      this.cacheVirtualStats();
    }

    // determine if the row is in view
    const pos = rowIndex * this.virtualRange.rowHeight;

    if (pos >= this.virtualRange.top && pos < this.virtualRange.bottom) {
      return true;
    }

    return false;
  },

  /**
   * Set the heights on top or bottom based on scroll position
   * @private
   */
  setVirtualHeight() {
    if (!this.settings.virtualized || !this.virtualRange) {
      return;
    }

    const bottom = this.virtualRange.totalHeight - this.virtualRange.bottom;
    const vTop = this.virtualRange.top;

    this.topSpacer = this.tableBody.find('.datagrid-virtual-row-top');
    this.bottomSpacer = this.tableBody.find('.datagrid-virtual-row-bottom');

    if (vTop > 0 && !this.topSpacer.length) {
      this.topSpacer = $(`<tr class="datagrid-virtual-row-top" style="height: ${vTop}px"><td colspan="${this.visibleColumns().length}"></td></tr>`);
      this.tableBody.prepend(this.topSpacer);
    }

    if (vTop > 0 && this.topSpacer.length) {
      this.topSpacer.css('height', `${vTop}px`);
    }

    if (vTop === 0 && (this.topSpacer.length || this.virtualRange.topRow <= 1)) {
      this.topSpacer.remove();
    }

    if (bottom > 0 && !this.bottomSpacer.length) {
      this.bottomSpacer = $(`<tr class="datagrid-virtual-row-bottom" style="height: ${bottom}px"><td colspan="${this.visibleColumns().length}"></td></tr>`);
      this.tableBody.append(this.bottomSpacer);
    }

    if (bottom > 0 && this.bottomSpacer.length) {
      this.bottomSpacer.css('height', `${bottom}px`);
    }

    if (bottom <= 0 && (this.bottomSpacer.length ||
      (this.virtualRange.bottomRow >= this.settings.dataset.length))) {
      this.bottomSpacer.remove();
    }
  },

  /**
   * Set the alternate shading class.
   * @private
   */
  setAlternateRowShading() {
    if (this.settings.alternateRowShading && this.settings.treeGrid) {
      $('tr[role="row"]:visible', this.tableBody)
        .removeClass('alt-shading').filter(':odd').addClass('alt-shading');
    }
  },

  /**
   * The default cell formatters thats used when no formatter is provided.
   * @private
   * @param  {function} formatter The formatter function.
   * @param  {number} row The row index.
   * @param  {number} cell The cell index.
   * @param  {string} fieldValue The current field value.
   * @param  {object} columnDef The column settings.
   * @param  {object} rowData The current row data.
   * @param  {object} api The grid API reference.
   * @returns {void}
   */
  formatValue(formatter, row, cell, fieldValue, columnDef, rowData, api) {
    let formattedValue;
    api = api || this;

    // Use default formatter if undefined
    if (formatter === undefined) {
      formatter = this.defaultFormatter;
    }

    if (typeof formatter === 'string') {
      formattedValue = Formatters[formatter](row, cell, fieldValue, columnDef, rowData, api);
      formattedValue = formattedValue.toString();
    } else {
      formattedValue = formatter(row, cell, fieldValue, columnDef, rowData, api).toString();
    }
    return formattedValue;
  },

  /**
   * Return the html markup for the row.
   * @private
   * @param  {object} rowData The data to use to render the row
   * @param  {number} dataRowIdx The row index.
   * @param  {number} actualIndex The actual data index
   * @param  {boolean} isGroup If true we are building a group row.
   * @param  {object} isFooter If true we are building a footer row.
   * @param  {string} actualIndexLineage Series of actualIndex values to reach a child actualIndex in a tree
   * @param  {boolean} skipChildren If true we dont append children.
   * @returns {string} The html used to construct the row.
   */
  rowHtml(rowData, dataRowIdx, actualIndex, isGroup, isFooter, actualIndexLineage, skipChildren) {
    let isEven = false;
    const self = this;
    const isSummaryRow = this.settings.summaryRow && !isGroup && isFooter;
    const activePage = self.pagerAPI ? self.pagerAPI.activePage : 1;
    const containerHtml = { left: '', center: '', right: '' };
    let d = self.settings.treeDepth ? self.settings.treeDepth[dataRowIdx] : 0;
    let depth = null;
    let j = 0;
    let isHidden = false;
    let skipColumns;

    // Calculate all nested children
    const calculateChildren = (ds, count = 0) => {
      count += ds.length;
      for (let i = 0, l = ds.length; i < l; i++) {
        if (ds[i].children) {
          count = calculateChildren(ds[i].children, count);
        }
      }
      return count;
    };

    if (!rowData) {
      return '';
    }

    let isRowDisabled = false;

    // Run a function that helps check if disabled
    if (self.settings.isRowDisabled && typeof self.settings.isRowDisabled === 'function') {
      const isDisabled = self.settings.isRowDisabled(actualIndex, rowData);

      if (isDisabled) {
        isRowDisabled = true;
      }
    }

    // Or allow the data to determine it
    if (rowData.isRowDisabled) {
      isRowDisabled = true;
    }

    // Default
    d = d ? d.depth : 0;
    depth = d;

    // Determine if the tree rows should be hidden or not
    if (self.settings.treeDepth && self.settings.treeDepth.length) {
      if (rowData._isFilteredOut) {
        isHidden = true;
      } else {
        const nodeData = self.settings.treeDepth[dataRowIdx];
        if (nodeData && nodeData.depth > 1 && nodeData.parents?.length) {
          for (let i = 0, l = nodeData.parents.length; i < l; i++) {
            const parentIdx = nodeData.parents[i];
            const parent = self.settings.treeDepth[parentIdx];
            if (parent.node && parent.node.expanded !== undefined && !parent.node.expanded) {
              isHidden = true;
              break;
            }
          }
        }
      }
    }

    if (this.settings.groupable && !isFooter) {
      const groupSettings = this.settings.groupable;
      isHidden = (groupSettings.expanded === undefined ? false : !groupSettings.expanded);

      if (groupSettings.expanded && typeof groupSettings.expanded === 'function') {
        isHidden = !groupSettings.expanded(dataRowIdx, 0, null, null, rowData, this);
        this.isFooterHidden = isHidden;
      }
    }

    // Group Rows
    const visibleColumnsLeft = this.settings.frozenColumns.left.length;
    const visibleColumnsRight = this.settings.frozenColumns.right.length;
    const visibleColumnsCenter = this.visibleColumns().length -
      visibleColumnsLeft - visibleColumnsRight;

    if (this.settings.groupable && isGroup && !isFooter) {
      const groupRowHtml = Formatters.GroupRow(dataRowIdx, 0, null, null, rowData, this);
      containerHtml.left = `<tr class="datagrid-rowgroup-header${isHidden ? '' : ' is-expanded'}" role="rowgroup"><td role="gridcell" colspan="${visibleColumnsLeft}">${groupRowHtml.left || '<span>&nbsp;</span>'}</td></tr>`;
      containerHtml.center = `<tr class="datagrid-rowgroup-header${isHidden ? '' : ' is-expanded'}" role="rowgroup"><td role="gridcell" colspan="${visibleColumnsCenter}">${groupRowHtml.center || '<span>&nbsp;</span>'}</td></tr>`;
      containerHtml.right = `<tr class="datagrid-rowgroup-header${isHidden ? '' : ' is-expanded'}" role="rowgroup"><td role="gridcell" colspan="${visibleColumnsRight}">${groupRowHtml.right || '<span>&nbsp;</span>'}</td></tr>`;
      return containerHtml;
    }

    if (this.settings.groupable && isGroup && isFooter) {
      const groupFooterHtml = Formatters.GroupFooterRow(dataRowIdx, 0, null, null, rowData, this);
      containerHtml.left = `<tr class="datagrid-row datagrid-rowgroup-footer${this.isFooterHidden ? ' is-hidden' : ''}" role="rowgroup">${groupFooterHtml.left || '<span>&nbsp;</span>'}</tr>`;
      containerHtml.center = `<tr class="datagrid-row datagrid-rowgroup-footer${this.isFooterHidden ? ' is-hidden' : ''}" role="rowgroup">${groupFooterHtml.center || '<span>&nbsp;</span>'}</tr>`;
      containerHtml.right = `<tr class="datagrid-row datagrid-rowgroup-footer${this.isFooterHidden ? ' is-hidden' : ''}" role="rowgroup">${groupFooterHtml.right || '<span>&nbsp;</span>'}</tr>`;
      this.isFooterHidden = false;
      return containerHtml;
    }

    const ariaRowindex = ((dataRowIdx + 1) +
      (self.settings.source && !self.settings.indeterminate ?
        ((activePage - 1) * self.settings.pagesize) : 0));

    isEven = (this.recordCount % 2 === 0);
    const isSelected = this.isRowSelected(rowData);
    const isActivated = rowData._rowactivated;
    const rowStatus = { class: '', svg: '' };

    if (rowData && rowData.rowStatus && (rowData.rowStatus.icon === 'new' ? self.settings.showNewRowIndicator : true)) {
      rowStatus.show = true;
      rowStatus.class = ` rowstatus-row-${rowData.rowStatus.icon}`;
      rowStatus.icon = (rowData.rowStatus.icon === 'success') ? '#icon-check' : '#icon-exclamation';
      rowStatus.title = (rowData.rowStatus.tooltip !== '') ? ` title="${rowData.rowStatus.tooltip}"` : '';
      rowStatus.svg = `<svg class="icon icon-rowstatus" focusable="false" aria-hidden="true" role="presentation"${rowStatus.title}><use href="${rowStatus.icon}"></use></svg>`;
    }

    // Run a function that dynamically gets the rowHeight
    let dynamicRowHeight = '';
    if (this.settings.fixedRowHeight && typeof this.settings.fixedRowHeight === 'function') {
      dynamicRowHeight = ` style="height: ${this.settings.fixedRowHeight(this.recordCount, ariaRowindex, actualIndex, rowData)}"px" `;
    }

    if (this.settings.fixedRowHeight && typeof this.settings.fixedRowHeight === 'number') {
      dynamicRowHeight = ` style="height: ${this.settings.fixedRowHeight}px" `;
    }

    if (this.currentPageRows) {
      const args = {
        ariaRowindex,
        actualIndexLineage,
        dataIndex: actualIndex,
        isFilteredOut: rowData._isFilteredOut
      };
      this.currentPageRows.push(args);
    }

    containerHtml.center = `<tr role="row" aria-rowindex="${ariaRowindex}"` +
      ` data-index="${actualIndex}"${
        actualIndexLineage ? ` data-lineage="${actualIndexLineage}"` : ''
      }${
        self.settings.treeGrid && rowData.children ? ` aria-expanded="${rowData.expanded ? 'true"' : 'false"'}` : ''
      }${self.settings.treeGrid ? ` aria-level="${depth}"` : ''
      }${isRowDisabled ? ' aria-disabled="true"' : ''
      }${isSelected ? ' aria-selected="true"' : ''} class="datagrid-row${rowStatus.class}${
        isHidden ? ' is-hidden' : ''}${
        rowData._isFilteredOut ? ' is-filtered' : ''
      }${isActivated ? ' is-rowactivated' : ''
      }${isRowDisabled ? ' is-rowdisabled' : ''
      }${isSelected ? this.settings.selectable === 'mixed' ? ' is-selected hide-selected-color' : ' is-selected' : ''
      }${self.settings.alternateRowShading && !isEven ? ' alt-shading' : ''
      }${isSummaryRow ? ' datagrid-summary-row' : ''
      }${!self.settings.cellNavigation && self.settings.selectable !== false ? ' is-clickable' : ''
      }${self.settings.treeGrid ? (rowData.children ? ' datagrid-tree-parent' : (depth > 1 ? ' datagrid-tree-child' : '')) : ''
      }"${dynamicRowHeight}>`;

    containerHtml.left = containerHtml.center;
    containerHtml.right = containerHtml.center;

    for (j = 0; j < self.settings.columns.length; j++) {
      const col = self.settings.columns[j];
      const container = this.getContainer(col.id);
      let cssClass = '';
      const defaultFormatter = col.summaryRowFormatter || col.formatter || self.defaultFormatter;
      const formatter = isSummaryRow ? defaultFormatter : col.formatter || self.defaultFormatter;
      let formatted = self.formatValue(
        formatter,
        dataRowIdx,
        j,
        self.fieldValue(rowData, self.settings.columns[j].field),
        self.settings.columns[j],
        rowData,
        self
      );

      if (formatted.indexOf('<span class="is-readonly">') === 0) {
        col.readonly = true;
      }

      if (formatted.indexOf('datagrid-checkbox') > -1 ||
        formatted.indexOf('btn-actions') > -1) {
        cssClass += ' l-center-text';
      }

      if (formatted.indexOf('trigger') > -1) {
        cssClass += ' datagrid-trigger-cell';
      }

      if (formatted.indexOf('trigger') === -1 && col && col.editor) {
        const editorName = this.getEditorName(col.editor);

        if (['colorpicker', 'dropdown', 'time', 'lookup', 'date']
          .indexOf(editorName) >= 0) {
          cssClass += ' datagrid-trigger-cell datagrid-no-default-formatter';
        }
      }

      if (col.editor && this.settings.editable) {
        cssClass += ' has-editor';
      }

      if (col.expanded) {
        self.treeExpansionField = col.expanded;
      }

      if (col.align) {
        cssClass += ` l-${col.align}-text`;
      }

      if (col.textOverflow === 'ellipsis') {
        cssClass += ' text-ellipsis';
      }

      if (col.uppercase) {
        cssClass += ' uppercase-text';
      }

      // Add Column Css Classes

      // Add a readonly class if set on the column
      cssClass += (col.readonly ? ' is-readonly' : '');
      cssClass += (col.hidden ? ' is-hidden' : '');

      // Run a function that helps check if editable
      if (col.isEditable && !col.readonly) {
        const fieldVal = self.fieldValue(rowData, self.settings.columns[j].field);
        const canEdit = col.isEditable(ariaRowindex - 1, j, fieldVal, col, rowData);

        if (!canEdit) {
          cssClass += ' is-readonly';
        }
      }

      // Run a function that helps check if readonly
      let ariaReadonly = (col.id !== 'selectionCheckbox' &&
        (col.readonly || col.editor === undefined)) ?
        'aria-readonly="true"' : '';

      if (cssClass.indexOf('is-readonly') > -1) {
        ariaReadonly = 'aria-readonly="true"';
      }

      if (col.isReadonly && !col.readonly && col.id !== 'selectionCheckbox') {
        const fieldVal = self.fieldValue(rowData, self.settings.columns[j].field);
        const isReadonly = col.isReadonly(this.recordCount, j, fieldVal, col, rowData);

        if (isReadonly) {
          cssClass += ' is-cell-readonly';
          ariaReadonly = 'aria-readonly="true"';
        }
      }

      const cellValue = self.fieldValue(rowData, self.settings.columns[j].field);

      // Run a function that dynamically adds a class
      if (col.cssClass && typeof col.cssClass === 'function') {
        cssClass += ` ${col.cssClass(this.recordCount, j, cellValue, col, rowData)}`;
      }

      if (col.cssClass && typeof col.cssClass === 'string') {
        cssClass += ` ${col.cssClass}`;
      }

      cssClass += (col.focusable ? ' is-focusable' : '');
      cssClass += (formatter.name === 'Actions' ? ' has-btn-actions' : '');

      const rowspan = this.calculateRowspan(cellValue, dataRowIdx, col);

      if (rowspan === '') {
        continue;
      }

      // Run an optional function to calculate a colspan - the spanning is the next N columns given in the function
      let colspan = 0;

      if (skipColumns > 0 && !col.hidden) {
        // From the previous run and a colspan is set then we are skipping columns
        skipColumns -= 1;
        cssClass += ' is-spanned-hidden';

        // Hide or make some cells invisble which are spanned
        const leftColumns = this.settings?.frozenColumns?.left.length;
        if (leftColumns > 0 && j === leftColumns) {
          cssClass = cssClass.replace(' is-spanned-hidden', ' is-spanned-invisible');
          colspan = skipColumns + 1;

          if (colspan > 0 && (this.visibleColumns().length - j === colspan)) {
            cssClass += ' is-spanned-last';
          }
        }

        if (leftColumns > 0 && j < leftColumns) {
          cssClass = cssClass.replace(' is-spanned-hidden', ' is-spanned-last');
        }
      }

      if (col.colspan && typeof col.colspan === 'function' && !skipColumns) {
        const fieldVal = self.fieldValue(rowData, self.settings.columns[j].field);
        colspan = col.colspan(ariaRowindex - 1, j, fieldVal, col, rowData, self);

        // Hide border on the first spanned cell
        if (colspan > 0) {
          skipColumns = colspan - 1;

          const leftColumns = this.settings?.frozenColumns?.left.length;
          if (leftColumns > 0 && j < leftColumns) {
            cssClass += ' is-spanned-last';
          }
        }

        // Hide border on the last frozen span column
        if (colspan > 0) {
          skipColumns = colspan - 1;

          const leftColumns = this.settings?.frozenColumns?.left.length;
          if (leftColumns > 0 && j < leftColumns && cssClass.indexOf('is-spanned-last') === -1) {
            cssClass += ' is-spanned-last';
          }
        }

        // Hide border on the last span if it spans the rest
        if (colspan > 0 && cssClass.indexOf('is-spanned-last') === -1 && (this.visibleColumns().length - 1 === colspan)) {
          cssClass += ' is-spanned-last';
        }
      }

      // Set rowStatus info
      if (j !== 0) {
        rowStatus.class = '';
        rowStatus.svg = '';
      }

      if (rowStatus.class !== '') {
        cssClass += ' rowstatus-cell';
      }

      if (self.isCellDirty(self.settings.groupable ? actualIndex : dataRowIdx, j)) {
        cssClass += ' is-dirty-cell';
      }

      // Trim extra spaces
      if (cssClass !== '') {
        cssClass = cssClass.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
      }

      const idProp = this.settings.attributes?.filter(a => a.name === 'id');
      const ariaDescribedby = `aria-describedby="${idProp?.length === 1 ? `${idProp[0].value}-col-${col.id?.toLowerCase()}` : self.uniqueId(`-header-${j}`)}"`;
      let ariaChecked = '';

      if (col.formatter?.toString().indexOf('function Checkbox') === 0) {
        let isChecked;

        // Use isChecked function if exists
        if (col.isChecked) {
          isChecked = col.isChecked(cellValue);
        } else {
          isChecked = (cellValue === undefined ? false : (cellValue === true || parseInt(cellValue, 10) === 1));
        }
        ariaChecked = ` aria-checked="${isChecked}"`;
      }

      containerHtml[container] += `<td role="gridcell" ${ariaReadonly} aria-colindex="${j + 1}"` +
          ` ${ariaDescribedby
          }${ariaChecked
          }${isSelected ? ' aria-selected="true"' : ''
          }${cssClass ? ` class="${cssClass}"` : ''
          }${colspan ? ` colspan="${colspan}"` : ''
          }${col.tooltip && typeof col.tooltip === 'string' ? ` title="${col.tooltip.replace('{{value}}', cellValue)}"` : ''
          }${self.settings.columnGroups ? `headers = "${self.uniqueId(`-header-${j}`)} ${self.getColumnGroup(j)}"` : ''
          }${rowspan || ''}>${rowStatus.svg}<div class="datagrid-cell-wrapper">`;

      if (col.contentVisible) {
        const canShow = col.contentVisible(dataRowIdx + 1, j, cellValue, col, rowData);
        if (!canShow) {
          formatted = '';
        }
      }

      if (self.settings.onPostRenderCell && col.component) {
        containerHtml[container] += '<div class="content"></div>';
        formatted = '';
      }

      containerHtml[container] += `${formatted}</div></td>`;
    }

    // Set Up Spacer column
    if (this.settings.spacerColumn) {
      containerHtml.center += '<td class="datagrid-spacer-column"></td>';
    }

    containerHtml.left += '</tr>';
    containerHtml.center += '</tr>';
    containerHtml.right += '</tr>';

    if (self.settings.rowTemplate) {
      const tmpl = self.settings.rowTemplate;
      const item = rowData;
      const height = self.settings.rowTemplateHeight || 107;
      let renderedTmpl = '';

      if (Tmpl && item) {
        renderedTmpl = Tmpl.compile(`{{#dataset}}${tmpl}{{/dataset}}`, { dataset: item });
      }

      if (this.hasLeftPane) {
        containerHtml.left += `<tr class="datagrid-expandable-row no-border"><td colspan="${visibleColumnsLeft}">
          <div class="datagrid-row-detail"><div style="height: ${height}px"></div></div>
          </td></tr>`;
      }
      containerHtml.center += `<tr class="datagrid-expandable-row"><td colspan="${visibleColumnsCenter + (this.settings.spacerColumn ? 1 : 0)}">
        <div class="datagrid-row-detail"><div class="datagrid-row-detail-padding">${renderedTmpl}</div></div>
        </td></tr>`;
      if (this.hasRightPane) {
        containerHtml.right += `<tr class="datagrid-expandable-row no-border"><td colspan="${visibleColumnsRight}">
          <div class="datagrid-row-detail"><div style="height: ${height}px"></div></div>
          </td></tr>`;
      }
    }

    if (self.settings.expandableRow) {
      if (this.hasLeftPane) {
        containerHtml.left += `<tr class="datagrid-expandable-row"><td colspan="${visibleColumnsLeft}">
          <div class="datagrid-row-detail"><div class="datagrid-row-detail-padding"></div></div>
          </td></tr>`;
      }
      containerHtml.center += `<tr class="datagrid-expandable-row"><td colspan="${visibleColumnsCenter}">
        <div class="datagrid-row-detail"><div class="datagrid-row-detail-padding"></div></div>
        </td></tr>`;
      if (this.hasRightPane) {
        containerHtml.right += `<tr class="datagrid-expandable-row no-border"><td colspan="${visibleColumnsRight}">
          <div class="datagrid-row-detail"><div class="datagrid-row-detail-padding"></div></div>
          </td></tr>`;
      }
    }

    // Render Tree Children
    if (rowData.children && !skipChildren && !rowData._isFilteredOut) {
      for (let i = 0, l = rowData.children.length; i < l; i++) {
        const lineage = actualIndexLineage ? `${actualIndexLineage}.${actualIndex}` : `${actualIndex}`;
        this.recordCount++;
        const childRowHtml = self.rowHtml(
          rowData.children[i],
          this.recordCount,
          i,
          false,
          false,
          lineage
        );

        containerHtml.left += childRowHtml.left;
        containerHtml.center += childRowHtml.center;
        containerHtml.right += childRowHtml.right;
      }
    } else if (this.settings.treeGrid && !skipChildren && rowData._isFilteredOut) {
      if (rowData.children) {
        const count = calculateChildren(rowData.children);
        this.recordCount += count + (rowData._isFilteredOut && depth === 1 ? 1 : 0);
      } else if (depth === 1) {
        this.recordCount++;
      }
    }

    return containerHtml;
  },

  /**
   * Return the name of the editor.
   * @private
   * @param  {object} editor The editor to check
   * @returns {string} The editors name
   */
  getEditorName(editor) {
    if (!editor) {
      return '';
    }

    let editorName = editor.name;
    // In IE functions do not have names
    if (!(function f() {}).name) {
      const getFnName = function getFnName(fn) {
        return (fn.toString().match(/function (.+?)\(/)||[,''])[1]; //eslint-disable-line
      };
      editorName = getFnName(editor);
    }
    return editorName ? editorName.toLowerCase() : '';
  },

  /**
   * This Function approximates the table auto widthing
   * Except use all column values and compare the text width of the header as max
   * @private
   * @param  {object} columnDef The column to check.
   * @returns {number} The text width.
   */
  calculateTextWidth(columnDef) {
    const title = columnDef.name || '';
    let max = 0;
    let maxWidth = 0;
    let padding = 0;
    let maxText = '';
    let hasButton = false;
    const self = this;

    // Get Data width
    if (columnDef.formatter === Formatters.Colorpicker) {
      maxText = '';
    } else if (columnDef.formatter === Formatters.Dropdown && columnDef.options && this.settings.columnSizing !== 'data') {
      const row = null;
      let val = '';
      // Find Longest option label
      for (let i = 0; i < columnDef.options.length; i++) {
        if (columnDef.options[i].label.length > val.length) {
          val = columnDef.options[i].label;
        }
      }
      val = self.formatValue(columnDef.formatter, 0, 0, val, columnDef, row, self);
      val = xssUtils.stripHTML(val);

      maxText = val;
    } else {
      let len = 0;
      let arrayToTest = this.settings.dataset;
      if (this.settings.groupable) {
        arrayToTest = this.originalDataset;
      }
      // Get max cell value length for this column
      for (let i = 0; i < arrayToTest.length; i++) {
        let val = this.fieldValue(arrayToTest[i], columnDef.field);

        const row = arrayToTest[i];

        // Get formatted value (without html) so we have accurate string that
        // will display for this cell
        val = self.formatValue(columnDef.formatter, i, 0, val, columnDef, row, self);
        hasButton = val.toString().indexOf('btn-secondary') > -1;
        val = xssUtils.stripHTML(val);

        len = val.toString().length;

        if (this.settings.groupable && row) {
          for (let k = 0; k < row.length; k++) {
            let groupVal = this.fieldValue(row[k], columnDef.field);
            groupVal = self.formatValue(columnDef.formatter, i, 0, groupVal, columnDef, row, self);
            groupVal = xssUtils.stripHTML(groupVal);

            len = groupVal.toString().length;
            if (len > max) {
              max = len;
              maxText = groupVal;
            }
          }
        }

        if (len > max) {
          max = len;
          maxText = val;
        }
      }

      // Get any Filter value
      if (this.filterExpr && this.filterExpr.length > 0) {
        const colFilter = $.grep(this.filterExpr, e => e.columnId === columnDef.id);
        if (colFilter && colFilter.length === 1) {
          const val = colFilter[0].value;
          len = val.toString().length;

          if (len > max) {
            max = len;
            maxText = val;
          }
        }
      }

      if (maxText === '' &&
        (columnDef.formatter === Formatters.Date || columnDef.formatter === Formatters.Time)) {
        const row = null;
        let val = new Date(9999, 11, 31, 23, 59, 59, 999);
        val = self.formatValue(columnDef.formatter, 0, 0, val, columnDef, row, self);
        val = xssUtils.stripHTML(val);

        maxText = val;
      }
    }

    const hasTag = columnDef.formatter ?
      columnDef.formatter.toString().indexOf('<span class="tag') > -1 : false;

    const hasAlert = columnDef.formatter ?
      columnDef.formatter.toString().indexOf('datagrid-alert-icon') > -1 : false;

    const hasTrigger = columnDef.formatter === Formatters.Date || columnDef.formatter === Formatters.Time ||
      columnDef.formatter === Formatters.Lookup || columnDef.formatter === Formatters.Colorpicker ||
      columnDef.formatter === Formatters.Dropdown;

    padding += this.getCellPadding() * 2;

    if (hasAlert) {
      padding += 20;
    }

    if (hasTag) {
      padding += 10;
    }

    if (hasButton) {
      padding += 50;
    }

    if (this.settings.editable && columnDef.editor === Editors.Spinbox) {
      padding += 46;
    }

    if (this.settings.editable && (columnDef.formatter === Formatters.Dropdown ||
      columnDef.formatter === Formatters.Lookup ||
      columnDef.editor === Editors.Time)) {
      padding += 10;
    }

    if (this.settings.editable && columnDef.editor === Editors.Date) {
      padding += 5;
    }

    maxWidth = this.calculateTextRenderWidth(maxText) + padding;

    if (columnDef.formatter === Formatters.Colorpicker) {
      maxWidth = 150;
    }

    const isSortable = (columnDef.sortable === undefined ? true : columnDef.sortable);
    const headerPadding = isSortable ? (this.getCellPadding() * 2) + 15 : this.getCellPadding() * 2;
    let minHeaderWidth = this.calculateTextRenderWidth(title, true) + headerPadding;

    // Calculate the width required for the filter field
    if (columnDef.filterType && this.settings.filterable) {
      if (minHeaderWidth < (this.getCellPadding() * 2)) {
        minHeaderWidth = (this.getCellPadding() * 5) + maxWidth + 36;
      }

      if (columnDef.filterType !== 'checkbox') {
        if (maxText !== '') {
          if (minHeaderWidth < maxWidth + (this.getCellPadding() * 2 + 32) && maxText !== '') {
            minHeaderWidth = maxWidth + (this.getCellPadding() * 2 + 32);
          }
        } else if (minHeaderWidth < 100) {
          minHeaderWidth = 100;
        }
      }

      if (columnDef?.textOverflow === 'ellipsis' && (this.settings.rowHeight === 'small' || this.settings.rowHeight === 'extra-small')) {
        minHeaderWidth += 6;
      }
    }

    if (this.settings.columnSizing === 'data') {
      minHeaderWidth = 50 + (this.getCellPadding() * 2) + (hasTrigger ? 25 : 0);
    }

    if (this.settings.columnSizing === 'header') {
      maxWidth = 0;
    }

    return Math.ceil(Math.max(maxWidth, minHeaderWidth));
  },

  /**
   * This Function calculates the width to render a text string
   * @private
   * @param  {string} maxText The text to render.
   * @param  {boolean} isHeader If its a header being calculated
   * @returns {number} the calculated text width in pixels.
   */
  calculateTextRenderWidth(maxText, isHeader) {
    // if given, use cached canvas for better performance, else, create new canvas
    this.canvas = this.canvas || (this.canvas = document.createElement('canvas'));
    const context = this.canvas.getContext('2d');
    const isNewTheme = (theme.currentTheme.id.indexOf('uplift') > -1 || theme.currentTheme.id.indexOf('new') > -1);

    if (!this.fontCached || !this.fontHeaderCached) {
      this.fontCached = theme.currentTheme.id && isNewTheme ?
        '400 16px arial' : '400 14px arial';
      this.fontHeaderCached = theme.currentTheme.id && isNewTheme ?
        '600 14px arial' : '700 12px arial';

      if (this.settings.rowHeight === 'extra-small') {
        this.fontCached = theme.currentTheme.id && isNewTheme ?
          '400 14px arial' : '400 12px arial';
        this.fontHeaderCached = theme.currentTheme.id && isNewTheme ?
          '600 14px arial' : '700 12px arial';
      }
    }

    context.font = this.fontCached;
    if (isHeader) {
      context.font = this.fontHeaderCached;
    }

    return context.measureText(maxText).width;
  },

  /**
   * Set the scroll class if the scrollbar is visible to effect the display.
   * @private
   */
  setScrollClass() {
    const height = parseInt(this.bodyWrapperCenter[0].offsetHeight, 10);
    const headerHeight = this.headerRow ? this.headerRow[0].offsetHeight : 0;
    const tableHeight = parseInt(this.tableBody[0].offsetHeight, 10);
    this.element.removeClass('has-vertical-scroll has-visible-last-row');

    if (tableHeight < height - headerHeight) {
      this.element.addClass('has-visible-last-row');
    }

    if (!this.hasLeftPane && !this.hasRightPane) {
      return;
    }

    const hasScrollBarV = parseInt(this.bodyWrapperCenter[0].scrollHeight, 10) > height + 2;
    const width = parseInt(this.bodyWrapperCenter[0].offsetWidth, 10);
    const hasScrollBarH = parseInt(this.bodyWrapperCenter[0].scrollWidth, 10) > width;

    if (hasScrollBarV) {
      this.element.addClass('has-vertical-scroll');
    }
    if (hasScrollBarH) {
      this.element.addClass('has-horizontal-scroll');
    }
  },

  /**
   * Clear internal header cache info.
   * @private
   * @returns {void}
   */
  clearCache() {
    this.totalWidths.left = 0;
    this.totalWidths.center = 0;
    this.totalWidths.right = 0;
    this.elemWidth = 0;
    this.stretchColumnWidth = 0;
    this.stretchColumnDiff = 0;
    this.stretchColumnIdx = -1;
    this.fontCached = null;
    this.fontHeaderCached = null;
    this.fixColumnIds();
  },

  /**
   * Fix duplicate column Id's
   * @private
   */
  fixColumnIds() {
    for (let i = 0; i < this.settings.columns.length; i++) {
      const col = this.settings.columns[i];

      // Check for duplicate ID's and adjust them.
      const colsById = this.columnById(col.id);
      if (colsById.length > 1) {
        for (let k = 1; k < colsById.length; k++) {
          colsById[k].id = `${colsById[k].id}-${k}`;
        }
      }
    }
  },

  /**
   * Return the index of the stretch column
   * @returns {number} The index of the stretch column
   */
  getStretchColumnIdx() {
    const self = this;
    let stretchColumnIdx = self.stretchColumnIdx;

    if (stretchColumnIdx === -1 && self.settings.stretchColumn !== 'last') {
      self.headerNodes().each(function (i) {
        const col = $(this);

        if (col.attr('data-column-id') === self.settings.stretchColumn) {
          stretchColumnIdx = i;
        }
      });
    }

    return stretchColumnIdx;
  },

  /**
   * Return the width for a column (upfront with no rendering)
   * @private
   * @param  {[type]} col The column object to use
   * @param  {[type]} index The column index
   * @returns {void}
   */
  columnWidth(col, index) {
    if (!this.elemWidth) {
      this.elemWidth = this.element.outerWidth();

      if (this.elemWidth === 0) { // handle on invisible tab container
        this.elemWidth = this.element.closest('.tab-container').outerWidth();
      }

      this.widthSpecified = false;
    }
    return this.calculateColumnWidth(col, index);
  },

  /**
   * Calculate the width for a column (upfront with no rendering)
   * Simulates https://www.w3.org/TR/CSS21/tables.html#width-layout
   * @private
   * @param {object} col The column object to use
   * @param {number} index The column index
   * @returns {void}
   */
  calculateColumnWidth(col, index) {
    let colPercWidth;
    const visibleColumns = this.visibleColumns(true);
    const lastColumn = (index === this.visibleColumns().length - 1);
    const container = this.getContainer(col.id);

    if (!this.elemWidth) {
      this.elemWidth = this.element.outerWidth();

      if (this.elemWidth === 0) { // handle on invisible tab container
        this.elemWidth = this.element.closest('.tab-container').outerWidth();
      }

      this.widthSpecified = false;
      this.widthPixel = false;
    }

    // A column element with a value other than 'auto' for the 'width' property
    // sets the width for that column.
    if (col.width) {
      this.widthSpecified = true;
      this.widthPercent = false;
    }

    if (!this.widthPixel && col.width) {
      this.widthPixel = typeof col.width !== 'string';
    }

    let colWidth = col.width;

    if (typeof col.width === 'string' && col.width.indexOf('px') === -1) {
      this.widthPercent = true;
      colPercWidth = col.width.replace('%', '');
    }

    const textWidth = this.calculateTextWidth(col); // reasonable default on error

    if (!this.widthSpecified || !colWidth) {
      colWidth = Math.max(textWidth, colWidth || 0);
    }

    // Simulate Auto Width Algorithm
    if ((!this.widthSpecified || col.width === undefined) && this.settings.sizeColumnsEqually &&
      (['selectionCheckbox', 'expander', 'drilldown', 'rowStatus', 'favorite'].indexOf(col.id) === -1)) {
      const percentWidth = Math.round(this.elemWidth / visibleColumns.length);
      colWidth = percentWidth - (lastColumn ? 2 : 0); // borders causing scroll

      // Handle Columns where auto width is bigger than the percent width
      if (percentWidth < textWidth) {
        colWidth = textWidth;
      }
    }

    // Some Built in columns
    if (col.id === 'selectionCheckbox' || col.id === 'favorite') {
      colWidth = 43;
      col.width = colWidth;
    }

    if (col.id === 'favorite') {
      colWidth = 62;
      col.width = colWidth;
    }

    if (!col.width && col.formatter?.toString()?.indexOf('ProcessIndicator') > -1) {
      colWidth = 155;
      col.width = colWidth;
    }

    if (col.id === 'expander') {
      colWidth = 55;
      col.width = colWidth;
    }

    if (col.id === 'rowStatus') {
      colWidth = 62;
      col.width = colWidth;
    }

    if (col.id === 'rowReorder') {
      colWidth = 62;
      col.width = colWidth;
    }

    if (col.id === 'drilldown') {
      colWidth = 62;
      col.width = colWidth;
    }

    // make sure that the column is atleast the minimum width
    if (col.minWidth && colWidth < col.minWidth) {
      colWidth = col.minWidth;
    }

    // make sure that the column is no more than the maximum width
    if (col.minWidth && colWidth > col.maxWidth) {
      colWidth = col.maxWidth;
    }

    this.totalWidths[container] += col.hidden ? 0 : colWidth;

    if (this.settings.stretchColumn !== 'last' && this.settings.stretchColumn !== null &&
      this.settings.stretchColumn === col.id) {
      this.stretchColumnIdx = index;
      this.stretchColumnWidth = colWidth;
      return ' style="width: 99%"';
    }

    // For the last column stretch it if it doesnt fit the area
    if (lastColumn) {
      const diff = this.elemWidth - this.totalWidths[container];

      if (this.settings.stretchColumn !== 'last' && this.settings.stretchColumn !== null) {
        this.stretchColumnDiff = diff;
      }

      if (this.hasLeftPane) {
        this.tableLeft.css('width', this.totalWidths.left);
      }

      if (this.hasRightPane) {
        this.tableRight.css('width', this.totalWidths.right);
      }
    }

    if (!this.widthPercent && colWidth === undefined) {
      return '';
    }

    return ` style="width: ${this.widthPercent ? `${colPercWidth}%` : `${colWidth}px`}"`;
  },

  /**
  * Figure out if the row spans and should skip rendiner.
  * @private
  * @param  {any} value Value to check
  * @param  {number} row Row index
  * @param  {number} col Column index
  * @returns {void}
  */
  calculateRowspan(value, row, col) {
    let total = 0;
    let min = null;

    if (!col.rowspan) {
      return null;
    }

    for (let i = 0; i < this.settings.dataset.length; i++) {
      if (value === this.settings.dataset[i][col.field]) {
        total++;
        if (min === null) {
          min = i;
        }
      }
    }

    return row === min ? ` rowspan ="${total}"` : '';
  },

  /**
  * Summary Row Totals use the aggregators
  * @private
  * @returns {number} the total widths
  */
  calculateTotals() {
    this.settings.totals = Aggregators.aggregate(this.settings.dataset, this.settings.columns);
    return this.settings.totals;
  },

  /**
  * Set unit type (pixel or percent)
  * @private
  * @param  {any} v value to check
  * @returns {number} the total widths
  */
  setUnit(v) {
    return v + (/(px|%)/i.test(`${v}`) ? '' : 'px');
  },

  /**
   * Setup tooltips on the cells.
   * @private
   * @param  {boolean} rowstatus true set tootip with row status
   * @param  {boolean} isForced true set tootip
   * @returns {void}
   */
  setupTooltips(rowstatus, isForced) {
    if (!rowstatus && !isForced && !this.settings.enableTooltips) {
      return;
    }

    const self = this;
    const defaultDelay = 400;
    let tooltipTimer;

    // Set selector
    const selector = {
      th: '.datagrid-header th',
      td: '.datagrid-wrapper tbody tr.datagrid-row td[role="gridcell"]:not(.rowstatus-cell)',
      rowstatus: '.datagrid-wrapper tbody tr.datagrid-row td[role="gridcell"] .icon-rowstatus'
    };

    if (this.settings.filterable) {
      selector.headerColumn = `${selector.th} .datagrid-column-wrapper`;
      selector.headerFilter = `${selector.th} .datagrid-filter-wrapper .btn-menu`;
      selector.header = `${selector.headerColumn}, ${selector.headerFilter}`;
    } else {
      selector.header = selector.th;
    }

    selector.iconAlert = `${selector.td} .icon-alert`;
    selector.iconSuccess = `${selector.td} .icon-success`;
    selector.iconError = `${selector.td} .icon-error`;
    selector.iconInfo = `${selector.td} .icon-info`;

    selector.icons = `${selector.iconAlert}, ${selector.iconSuccess}, ${selector.iconError}, ${selector.iconInfo}`;

    // Selector string
    if (rowstatus && this.settings.enableTooltips) {
      selector.str = `${selector.header}, ${selector.td}, ${selector.icons}, ${selector.rowstatus}`;
    } else if (rowstatus) {
      selector.str = `${selector.header}, ${selector.rowstatus}`;
    } else {
      selector.str = `${selector.header}, ${selector.td}, ${selector.icons}`;
    }

    // Handle tooltip to show
    const handleShow = (elem, delay) => {
      delay = typeof delay === 'undefined' ? defaultDelay : delay;
      tooltipTimer = setTimeout(() => {
        const isHeaderColumn = DOM.hasClass(elem, 'datagrid-column-wrapper');
        const isHeaderFilter = DOM.hasClass(elem.parentNode, 'datagrid-filter-wrapper');
        const isPopup = isHeaderFilter ?
          elem.parentNode.querySelectorAll('.popupmenu.is-open').length > 0 : false;
        const tooltip = $(elem).data('gridtooltip') || self.cacheTooltip(elem);
        const containerEl = isHeaderColumn ? elem.parentNode : elem;
        const width = self.getOuterWidth(containerEl);
        if (tooltip && (tooltip.forced || (tooltip.textwidth > (width - 35))) && !isPopup) {
          self.showTooltip(tooltip);
        }
      }, delay);
    };

    // Handle tooltip to hide
    const handleHide = (elem, delay) => {
      delay = typeof delay === 'undefined' ? defaultDelay : delay;
      clearTimeout(tooltipTimer);
      setTimeout(() => {
        self.hideTooltip();
        // Clear cache for header filter, so it can use always current selected
        if (DOM.hasClass(elem.parentNode, 'datagrid-filter-wrapper')) {
          self.removeTooltipData(elem);
        }
      }, delay);
    };

    // Bind events
    this.element
      .off('mouseenter.gridtooltip focus.gridtooltip', selector.str)
      .on('mouseenter.gridtooltip focus.gridtooltip', selector.str, function () {
        handleShow(this);
      })
      .off('mouseleave.gridtooltip click.gridtooltip blur.gridtooltip', selector.str)
      .on('mouseleave.gridtooltip click.gridtooltip blur.gridtooltip', selector.str, function () {
        handleHide(this);
      })
      .off('longpress.gridtooltip', selector.str)
      .on('longpress.gridtooltip', selector.str, function () {
        handleShow(this, 0);
      })
      .off('keydown.gridtooltip', selector.str)
      .on('keydown.gridtooltip', selector.str, function (e) {
        const key = e.which || e.keyCode || e.charCode || 0;
        let handle = false;
        if (e.shiftKey && key === 112) { // Shift + F1
          handleShow(this, 0);
        } else if (key === 27) { // Escape
          handle = self.isGridtooltip();
          handleHide(this, 0);
        }

        if (handle) {
          e.preventDefault();
        }
        return !handle;
      });

    if (this.toolbar && this.toolbar.parent().find('.table-errors').length > 0) {
      this.toolbar.parent().find('.table-errors')
        .off('mouseenter.tableerrortooltip', '.icon')
        .on('mouseenter.tableerrortooltip', '.icon', function () {
          handleShow(this);
        })
        .off('mouseleave.tableerrortooltip click.tableerrortooltip', '.icon')
        .on('mouseleave.tableerrortooltip click.tableerrortooltip', '.icon', function () {
          handleHide(this);
        })
        .off('longpress.tableerrortooltip', '.icon')
        .on('longpress.tableerrortooltip', '.icon', function () {
          handleShow(this, 0);
        });
    }
  },

  /**
   * Get outerWidth for a given element.
   * @private
   * @param  {boolean} element to calculate the outerWidth
   * @returns {number} computed outerWidth
   */
  getOuterWidth(element) {
    const style = getComputedStyle(element);
    let width = element.offsetWidth;
    width += parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);
    return width;
  },

  /**
   * Get closest element of a given element by passing callback to
   * target by class, id, or tag name
   * Callback usage as:
   * const elem = this.element[0].querySelector(selectorString);
   * class: const closestEl = this.closest(elem, el => el.classList.contains('some-class'));
   * id: const closestEl = this.closest(elem, el => el.id === 'some-id');
   * tag: const closestEl = this.closest(elem, el => el.tagName.toLowerCase() === 'some-tag');
   * http://clubmate.fi/jquerys-closest-function-and-pure-javascript-alternatives/
   * @private
   * @param  {object} el The element to start from.
   * @param  {object} fn The callback function.
   * @returns {object} The closest element.
   */
  closest(el, fn) {
    return el && (fn(el) ? el : this.closest(el.parentNode, fn));
  },

  /**
   * Returns all header nodes (not the groups)
   * @private
   * @returns {array} Array with all header dom nodes
   */
  headerNodes() {
    if (!this.headerRow) {
      return $();
    }
    return this.element.find('.datagrid-header tr:not(.datagrid-header-groups) th');
  },

  /**
   * Returns all colgroup nodes
   * @private
   * @returns {array} Array with all colgroups across all panes
   */
  colGroupNodes() {
    if (!this.headerRow) {
      return $();
    }
    return this.element.find('colgroup col');
  },

  /**
   * Refresh one row in the grid
   * @param  {number} idx The row index to update.
   * @param  {object} data The data object.
   * @returns {void}
   */
  updateRow(idx, data) {
    const s = this.settings;
    let rowData = data;

    if (!rowData) {
      rowData = s.treeGrid ? s.treeDepth[idx].node : this.getActiveDataset()[idx];
    }

    for (let j = 0; j < this.settings.columns.length; j++) {
      const col = this.settings.columns[j];

      if (col.hidden) {
        continue;
      }

      this.updateCellNode(idx, j, this.fieldValue(rowData, col.field), true);
    }

    this.settings.dataset[idx] = utils.extend(true, this.settings.dataset[idx], data);

    if (this.settings.rowReorder && this.tableBody.data('arrange')) {
      this.tableBody.data('arrange').updated();
    }
  },

  /**
   * Given a new column set update the rows and reload
   * @param  {array} columns The array with columns to use.
   * @param  {array} columnGroups The array with new columns groups to use.
   * @returns {void}
   */
  updateColumns(columns, columnGroups) {
    if (columnGroups === undefined) {
      columnGroups = null;
    }

    let conditions = [];
    if (this.settings.filterable && this.filterRowRendered) {
      conditions = this.filterConditions();
    }
    this.settings.columns = columns;

    if (columnGroups) {
      this.settings.columnGroups = columnGroups;
    }

    this.rerender();

    /**
    * Fires after the entire grid is rendered.
    * @event columnchange
    * @memberof Datagrid
    * @property {object} event The jquery event object
    * @property {HTMLElement} args Additional arguments
    * @property {string} args.type Info on the type of column change action, can be 'updatecolumns', 'hidecolumn', 'showcolumn', 'resizecolumn'
    * @property {object} args.columns The columns object
    */
    this.element.trigger('columnchange', [{ type: 'updatecolumns', columns: this.settings.columns }]);
    this.saveUserSettings();

    if (this.settings.filterable && this.filterRowRendered) {
      this.setFilterConditions(conditions);
    }
  },

  /**
   * Omit events and save to local storage for supported settings.
   * @returns {void}
   */
  saveUserSettings() {
    /**
    * Fires after settings are changed in some way
    * @event settingschanged
    * @memberof Datagrid
    * @property {object} event The jquery event object
    * @property {object} args Additional arguments
    * @property {number} args.rowHeight The current row height
    * @property {object} args.columns The columns object
    * @property {string} args.sortOrder The current sort column.
    * @property {number} args.pagesize The current page size
    * @property {boolean} args.showPageSizeSelector If the page size selector is shown.
    * @property {number} args.activePage The currently active page.
    * @property {string} args.filter Info on the type of column change action, can be 'updatecolumns'
    */
    this.element.trigger('settingschanged', [{
      rowHeight: this.settings.rowHeight,
      columns: this.settings.columns,
      sortOrder: this.sortColumn,
      pagesize: this.settings.pagesize,
      showPageSizeSelector: this.settings.showPageSizeSelector,
      activePage: this.pagerAPI ? this.pagerAPI.activePage : 1,
      filter: this.filterConditions()
    }]);

    // Save to Local Storage if the settings are set
    const savedSettings = this.settings.saveUserSettings;
    if ($.isEmptyObject(savedSettings) || !this.canUseLocalStorage()) {
      return;
    }

    // Save Columns
    if (savedSettings.columns) {
      localStorage[this.uniqueId('usersettings-columns')] = this.copyThenStringify(this.settings.columns);
    }

    // Save Row Height
    if (savedSettings.rowHeight) {
      localStorage[this.uniqueId('usersettings-row-height')] = this.settings.rowHeight;
    }

    // Save Sort Order
    if (savedSettings.sortOrder) {
      localStorage[this.uniqueId('usersettings-sort-order')] = JSON.stringify(this.sortColumn);
    }

    // Save Page Size
    if (savedSettings.pagesize) {
      localStorage[this.uniqueId('usersettings-pagesize')] = this.settings.pagesize;
    }

    // Save Show Page Size Selector
    if (savedSettings.showPageSizeSelector) {
      localStorage[this.uniqueId('usersettings-show-pagesize-selector')] = this.settings.showPageSizeSelector;
    }

    // Save Page Num
    if (savedSettings.activePage && this.pagerAPI) {
      localStorage[this.uniqueId('usersettings-active-page')] = this.pagerAPI.activePage;
    }

    // Filter Conditions
    if (savedSettings.filter) {
      localStorage[this.uniqueId('usersettings-filter')] = JSON.stringify(this.filterConditions());
    }
  },

  /**
   * Returns true if local storage may be used / is available
   * @private
   * @returns {boolean} If it can be used.
   */
  canUseLocalStorage() {
    try {
      if (localStorage.getItem) {
        return true;
      }
    } catch (exception) {
      return false;
    }

    return false;
  },

  /**
   * Set the original column which may later be reloaded.
   * @private
   */
  setOriginalColumns() {
    this.originalColumns = utils.deepCopy(this.settings.columns);
  },

  /**
   * Parse a JSON array with columns and return the column object.
   * @private
   * @param  {string} columnStr The json representation of the column object.
   * @param  {string} excludeWidth If true do not reset the column width.
   * @returns {array} The array of columns.
   */
  columnsFromString(columnStr, excludeWidth) {
    if (!columnStr) {
      return [];
    }

    const self = this;
    const columns = JSON.parse(columnStr);

    if (!columns) {
      return [];
    }

    // Map back the missing functions/objects
    for (let i = 0; i < columns.length; i++) {
      let isHidden;
      const orgColumn = self.columnById(columns[i].id);
      const width = orgColumn.width;

      if (orgColumn) {
        isHidden = columns[i].hidden;

        $.extend(columns[i], orgColumn[0]);

        if (isHidden !== undefined) {
          columns[i].hidden = isHidden;
        } else {
          delete columns[i].hidden;
        }

        if (excludeWidth) {
          columns[i].width = width;
        }
      }
    }

    return columns;
  },

  /**
  * Restore the columns from a provided list or local storage
  * @param {array} cols - The columns list to restore, if you saved the settings manually.
  */
  restoreColumns(cols) {
    if (!this.settings.saveColumns || !this.canUseLocalStorage()) {
      return;
    }

    if (cols) {
      this.updateColumns(cols);
      return;
    }

    // Done on load as apposed to passed in
    const lsCols = localStorage[this.uniqueId('columns')];

    if (!cols && lsCols) {
      this.originalColumns = utils.deepCopy(this.settings.columns);
      this.settings.columns = this.columnsFromString(lsCols);
    }
  },

  /**
   * Restore the user settings from local Storage or as passed in.
   * @param  {object} settings The object containing the settings to use.
   * @returns {void}
   */
  restoreUserSettings(settings) {
    const options = this.settings.saveUserSettings;

    if (!settings && ($.isEmptyObject(options) || !this.canUseLocalStorage())) {
      return;
    }

    // Restore The data thats passed in
    if (settings) {
      if (settings.columns) {
        this.updateColumns(settings.columns);
      }

      if (settings.rowHeight) {
        this.rowHeight(settings.rowHeight);
      }

      if (settings.sortOrder) {
        this.setSortColumn(settings.sortOrder.sortId, settings.sortOrder.sortAsc);
      }

      if (settings.pagesize) {
        this.settings.pagesize = parseInt(settings.pagesize, 10);
        this.pagerAPI.settings.pagesize = parseInt(settings.pagesize, 10);
        if (!settings.activePage) {
          this.pagerAPI.setActivePage(1, true);
        }
      }

      if (settings.showPageSizeSelector) {
        this.settings.showPageSizeSelector = settings.showPageSizeSelector;
        this.pagerAPI.showPageSizeSelector(settings.showPageSizeSelector);
      }

      if (settings.filter) {
        this.applyFilter(settings.filter, 'restore');
      }

      if (settings.activePage) {
        const savedActivePage = parseInt(settings.activePage, 10);
        this.pagerAPI.setActivePage(savedActivePage, true);
        this.restoreActivePage = true;
      }
      return;
    }

    // Restore Column Width and Order
    if (options.columns) {
      const savedColumns = localStorage[this.uniqueId('usersettings-columns')];
      if (savedColumns) {
        this.settings.columns = this.columnsFromString(savedColumns);
      }
    }

    // Restore Row Height
    if (options.rowHeight) {
      const savedRowHeight = localStorage[this.uniqueId('usersettings-row-height')];

      if (savedRowHeight) {
        this.settings.rowHeight = savedRowHeight;
      }
    }

    // Restore Sort Order
    if (options.sortOrder) {
      const savedSortOrder = localStorage[this.uniqueId('usersettings-sort-order')];
      if (savedSortOrder) {
        this.sortColumn = JSON.parse(savedSortOrder);
        this.restoreSortOrder = true;
      }
    }

    // Restore Page Size
    if (options.pagesize) {
      const savedPagesize = localStorage[this.uniqueId('usersettings-pagesize')];
      if (savedPagesize) {
        this.settings.pagesize = parseInt(savedPagesize, 10);
      }
    }

    // Restore Show Page Size Selector
    if (options.showPageSizeSelector) {
      let savedShowPageSizeSelector = localStorage[this.uniqueId('usersettings-show-pagesize-selector')];
      savedShowPageSizeSelector = savedShowPageSizeSelector.toString().toLowerCase() === 'true';
      if (savedShowPageSizeSelector) {
        this.settings.showPageSizeSelector = savedShowPageSizeSelector;
      }
    }

    // Restore Active Page
    if (options.activePage) {
      const savedActivePage = localStorage[this.uniqueId('usersettings-active-page')];
      if (savedActivePage) {
        this.savedActivePage = parseInt(savedActivePage, 10);
        this.restoreActivePage = true;
      }
    }

    if (options.filter) {
      const savedFilter = localStorage[this.uniqueId('usersettings-filter')];
      if (savedFilter) {
        this.savedFilter = JSON.parse(savedFilter);
        this.restoreFilter = true;
      }
    }
  },

  /**
   * Copy the object and remove some uneeded properties from the object
   * @private
   * @param  {object} columns The column set to stringify.
   * @returns {string} The JSON object as a string
   */
  copyThenStringify(columns) {
    if (!columns) {
      return JSON.stringify(columns);
    }

    const clone = columns.map((col) => {
      const newCol = utils.extend({}, col);
      if (newCol.editorOptions) {
        delete newCol.editorOptions;
      }
      return newCol;
    });
    return JSON.stringify(clone);
  },

  /**
  * Reset Columns to defaults (used on restore menu item)
  */
  resetColumns() {
    if (this.canUseLocalStorage()) {
      localStorage.removeItem(this.uniqueId('columns'));
    }

    if (this.originalColumns) {
      const originalColumns = utils.deepCopy(this.originalColumns);
      const columnGroups = this.settings.columnGroups && this.originalColGroups ?
        this.originalColGroups : null;
      this.updateColumns(originalColumns, columnGroups);
    }

    this.clearFilter();
  },

  /**
  * Hide a column.
  * @param {string} id The id of the column to hide.
  */
  hideColumn(id) {
    let idx = this.columnIdxById(id);

    if (idx === -1 || this.settings.columns[idx]?.hidden) {
      return;
    }

    this.settings.columns[idx].hidden = true;
    this.headerNodes().eq(idx).addClass('is-hidden');
    this.colGroupNodes().eq(idx).addClass('is-hidden');

    const frozenLeft = this.settings?.frozenColumns?.left.length || 0;
    this.tableBody.find(`> tr > td:nth-child(${idx - frozenLeft + 1})`).addClass('is-hidden');
    this.bodyColGroup.find('col').eq(idx - frozenLeft).addClass('is-hidden');

    // Shrink or remove colgroups
    this.updateColumnGroup(idx, false);

    // Handle colSpans if present on the column
    if (this.hasColSpans) {
      let colSpan = this.element.find('.datagrid-header th').eq(idx).attr('colspan');

      if (colSpan && colSpan > 0) {
        colSpan -= 1;
        for (let i = 0; i < colSpan; i++) {
          idx += colSpan;
          this.tableBody.find(`> tr > td:nth-child(${idx + 1})`).addClass('is-hidden');
        }
      }
    }

    // Handle expandable rows
    if (this.settings.rowTemplate || this.settings.expandableRow) {
      this.syncExpandableRowColspan();
    }

    this.element.trigger('columnchange', [{ type: 'hidecolumn', index: idx, columns: this.settings.columns }]);
    this.saveUserSettings();
  },

  /**
  * Sync the colspan on the expandable row. (When column count changes)
  * @private
  */
  syncExpandableRowColspan() {
    const visibleColumnCount = this.visibleColumns().length;
    this.tableBody.find('.datagrid-expandable-row > td').attr('colspan', visibleColumnCount);
  },

  /**
  * Show a hidden column.
  * @param {string} id The id of the column to show.
  */
  showColumn(id) {
    let idx = this.columnIdxById(id);

    if (idx === -1 || !this.settings.columns[idx].hidden) {
      return;
    }

    this.settings.columns[idx].hidden = false;
    this.headerNodes().eq(idx).removeClass('is-hidden');
    this.colGroupNodes().eq(idx).removeClass('is-hidden');

    const frozenLeft = this.settings?.frozenColumns?.left.length || 0;
    this.tableBody.find(`> tr > td:nth-child(${idx - frozenLeft + 1})`).removeClass('is-hidden');
    this.bodyColGroup.find('col').eq(idx - frozenLeft).removeClass('is-hidden');

    // Shrink or add colgroups
    this.updateColumnGroup(idx, true);

    // Handle colSpans if present on the column
    if (this.hasColSpans) {
      let colSpan = this.element.find('.datagrid-header th').eq(idx).attr('colspan');

      if (colSpan && colSpan > 0) {
        colSpan -= 1;
        for (let i = 0; i < colSpan; i++) {
          idx += colSpan;
          this.tableBody.find(`> tr > td:nth-child(${idx + 1})`).removeClass('is-hidden');
        }
      }
    }

    // Handle expandable rows
    if (this.settings.rowTemplate || this.settings.expandableRow) {
      this.syncExpandableRowColspan();
    }

    this.element.trigger('columnchange', [{ type: 'showcolumn', index: idx, columns: this.settings.columns }]);
    this.saveUserSettings();
  },

  /**
  * Export the grid contents to csv
  * @param {string} fileName The desired export filename in the download.
  * @param {string} customDs An optional customized version of the data to use.
  * @param {string} separator (optional) If user's machine is configured for a locale with alternate default separator.
  */
  exportToCsv(fileName, customDs, separator) {
    excel.exportToCsv(fileName, customDs, separator, this);
  },

  /**
  * Export the grid contents to xls format. This may give a warning when opening the file.
  * exportToCsv may be prefered.
  * Consider Deprecated use excel.exportToExcel
  * @param {string} fileName The desired export filename in the download.
  * @param {string} worksheetName A name to give the excel worksheet tab.
  * @param {string} customDs An optional customized version of the data to use.
  */
  exportToExcel(fileName, worksheetName, customDs) {
    excel.exportToExcel(fileName, worksheetName, customDs, this);
  },

  copyToDataSet(pastedValue, rowCount, colIndex, dataSet) {
    excel.copyToDataSet(pastedValue, rowCount, colIndex, dataSet, this);
  },

  /**
  * Open the personalization dialog.
  * @private
  */
  personalizeColumns() {
    const self = this;
    let markup = `<div class="listview-search alternate-bg"><label class="audible" for="gridfilter">Search</label><input class="searchfield" placeholder="${Locale.translate('SearchColumnName')}" name="searchfield" id="gridfilter"></div>`;
    markup += '<div class="listview alternate-bg" id="search-listview"><ul></ul></div>';

    $('body').modal({
      title: Locale.translate('PersonalizeColumns'),
      content: markup,
      cssClass: 'full-width datagrid-columns-dialog',
      buttons: [{
        text: Locale.translate('Close'),
        click(e, modal) {
          modal.close();
          $('body').off('beforeopen.datagrid');
        }
      }]
    }).off('beforeopen.datagrid')
      .on('beforeopen.datagrid', (e, modal) => {
        if (!modal) {
          return;
        }

        self.isColumnsChanged = false;
        modal.element.find('.searchfield').searchfield({ clearable: true, tabbable: false });
        modal.element.find('.listview')
          .listview({
            source: this.settings.columns,
            template: `
            <ul>
            {{#dataset}}
              {{#name}}
              <li>
                <a href="#" target="_self" tabindex="-1">
                  <label class="inline">
                    <input tabindex="-1" type="checkbox" class="checkbox" {{^hideable}}disabled{{/hideable}} {{^hidden}}checked{{/hidden}} data-column-id="{{id}}"/>
                    <span class="label-text">{{name}}</span>
                  </label>
                </a>
              </li>
              {{/name}}
            {{/dataset}}
            </ul>`,
            searchable: true,
            selectOnFocus: false,
            listFilterSettings: {
              filterMode: 'contains',
              searchableTextCallback: item => item.name || item.id
            }
          })
          .off('selected.datagrid')
          .on('selected.datagrid', function (selectedEvent, args) {
            const chk = args.elem.find('.checkbox');
            const id = chk.attr('data-column-id');
            const isChecked = chk.prop('checked');

            args.elem.removeClass('is-selected hide-selected-color');

            if (chk.is(':disabled')) {
              return;
            }
            self.isColumnsChanged = true;

            // Set listview dataset node state, to be in sync after filtering
            const lv = { node: {}, api: $(this).data('listview') };
            if (lv.api) {
              const idx = self.columnIdxById(id);
              if (idx !== -1 && lv.api.settings.dataset[idx]) {
                lv.node = lv.api.settings.dataset[idx];
              }
            }
            if (!isChecked) {
              self.showColumn(id);
              chk.prop('checked', true);
              lv.node.hidden = false;
            } else {
              self.hideColumn(id);
              chk.prop('checked', false);
              lv.node.hidden = true;
            }
            if (self.settings.groupable) {
              self.rerender();
            }
          });

        modal.element.on('close.datagrid', () => {
          self.isColumnsChanged = false;
        });
        modal.element.on('keydown.datagrid', (event) => {
          // Escape Button Code. Make sure to close the modal correctly.
          if (event.keyCode === 27) {
            modal.close();
            $('body').off('beforeopen.datagrid');
          }
        });
      });
  },

  /**
  * Explicitly Set the width of a column
  * @private
  * @param {string} id Specifies if the column info is provide by id or as a node reference.
  * @param {number} width The width of the column
  * @param {boolean} set If true the width will actively be set, else it was set during resize.
  */
  setColumnWidth(id, width, set) {
    const self = this;
    const percent = parseFloat(width);
    const columnSettings = this.columnById(id)[0];
    let idx = -1;

    if (!percent || !id) {
      return;
    }

    if (typeof id === 'string') {
      self.headerNodes().each(function (i) {
        const col = $(this);

        if (col.attr('data-column-id') === id) {
          idx = i;
        }
      });
    }

    // calculate percentage
    if (typeof width !== 'number') {
      width = (percent / 100) * self.element.width();
    }

    // Prevent Sub Pixel Thrashing
    if (Math.abs(width - columnSettings.width) < 2) {
      return;
    }

    // Handle Col Span - as the width is calculated on the total
    if (typeof columnSettings.colspan === 'number') {
      width /= columnSettings.colspan;
    }

    // Save the column back in settings for later
    if (columnSettings) {
      columnSettings.width = width;
    }

    if (set) {
      const currentCol = this.bodyColGroup.find('col').eq(idx)[0];
      currentCol.style.width = `${width}px`;
    }

    this.element.trigger('columnchange', [{ type: 'resizecolumn', index: idx, columns: this.settings.columns }]);
    this.saveUserSettings();
  },

  /**
   * Check if given column header should be able to set active ellipsis
   * @private
   * @param {string} column to check ellipsis
   * @returns {boolean} true if should be able to set ellipsis
   */
  isEllipsisActiveHeader(column) {
    column = column || {};
    const isSortable = (column.sortable === undefined ? true : column.sortable);
    return isSortable && (column.textOverflow === 'ellipsis');
  },

  /**
   * Set active ellipsis on all columns header
   * @private
   * @returns {void}
   */
  activeEllipsisHeaderAll() {
    for (let i = 0, l = this.settings.columns.length; i < l; i++) {
      const id = this.settings.columns[i].id;
      const column = this.columnById(id)[0];
      if (this.isEllipsisActiveHeader(column)) {
        const columnEl = this.element[0].querySelector(`.datagrid-header th[data-column-id="${id}"]`);
        this.activeEllipsisHeader(columnEl);
      }
    }
  },

  /**
   * Set active ellipsis on given column header
   * @private
   * @param {string} columnEl to set ellipsis active
   * @returns {void}
   */
  activeEllipsisHeader(columnEl) {
    if (columnEl) {
      const textEl = columnEl.querySelector('.datagrid-column-wrapper .datagrid-header-text');
      const isEllipsisActive = columnEl.scrollWidth < (textEl.scrollWidth + 65);// 65:sort-icons
      columnEl.classList[isEllipsisActive ? 'add' : 'remove']('is-ellipsis-active');
    }
  },

  /**
  * Generate the ui handles used to resize columns.
  * @private
  */
  createResizeHandle() {
    const self = this;
    if (this.resizeHandle) {
      return;
    }

    this.resizeHandle = $('<div class="resize-handle" aria-hidden="true"></div>');
    if (this.settings.columnGroups) {
      this.resizeHandle[0].style.height = '80px';
    }

    if (this.settings.filterable) {
      this.resizeHandle[0].style.height = '62px';
    }

    this.element.find('table').before(this.resizeHandle);

    let column;
    let columnId;
    let widthToSet;
    let nextWidthToSet;
    let nextColumnId;
    let usingShiftKey = false;

    this.resizeHandle.drag({ axis: 'x' })
      .on('dragstart.datagrid', () => {
        if (!self.currentHeader) {
          return;
        }

        self.dragging = true;
        usingShiftKey = false;

        columnId = self.currentHeader.attr('data-column-id');
        column = self.columnById(columnId)[0];

        if (self.isEllipsisActiveHeader(column)) {
          self.currentHeader[0].classList.add('is-ellipsis-active');
        }
      })
      .on('drag.datagrid', (e, ui) => {
        if (!self.currentHeader || !column) {
          return;
        }

        // Setup enforcement for column or default min and max widths
        const minWidth = column.minWidth || 12;
        const maxWidth = column.maxWidth || 2000;

        const node = self.currentHeader;
        const idx = node.index();
        const isLeftPane = self.getContainer(node.attr('data-column-id')) === 'left';

        this.dragging = true;
        const left = ui.left + 5;
        let currentCol = this.bodyColGroup.find('col').eq(idx)[0];
        if (isLeftPane) {
          currentCol = this.bodyColGroupLeft.find('col').eq(idx)[0];
        }
        const currentColWidth = parseInt(self.currentHeader.width(), 10);
        let cssWidth = parseInt(currentCol.style.width || currentColWidth, 10);

        // Convert from percentage
        if (currentCol.style.width.indexOf('%') > -1) {
          cssWidth = currentColWidth;
        }
        const offsetParentLeft = parseFloat(self.currentHeader.offsetParent().offset().left);
        const offsetLeft = parseFloat(self.currentHeader.offset().left);
        let leftOffset = (idx === 0 ? 0 : (offsetLeft - offsetParentLeft - 2));
        if (self.hasLeftPane && !isLeftPane && idx === 0) {
          leftOffset = (offsetLeft - offsetParentLeft - 2);
        }
        const diff = currentColWidth - (left - leftOffset);

        // Enforce Column or Default min and max widths
        widthToSet = cssWidth - diff;

        if (widthToSet < minWidth || widthToSet > maxWidth) {
          self.resizeHandle.css('cursor', 'inherit');
          return;
        }

        if (widthToSet === cssWidth) {
          return;
        }
        currentCol.style.width = (`${widthToSet}px`);

        const inRange = (idx === this.settings.frozenColumns.left.length - 1) ||
          (idx <= (this.settings.frozenColumns.left.length - 1) && diff > 0);

        if (inRange && this.getContainer(columnId) === 'left') {
          this.totalWidths.left += diff < 0 ? Math.abs(diff) : (-diff);
          this.tableLeft.css('width', this.totalWidths.left);
        }

        if (keyboard.pressedKeys.get('Shift')) {
          usingShiftKey = true;
        }

        if ((this.settings.resizeMode === 'fit' && !usingShiftKey) ||
          (this.settings.resizeMode === 'flex' && usingShiftKey)) {
          const nextIdx = Locale.isRTL() ? idx + 1 : idx - 1;
          const nextColSettings = self.settings.columns[nextIdx];
          if (!nextColSettings) {
            return;
          }
          const nextMinWidth = nextColSettings.minWidth || 12;
          const nextMaxWidth = nextColSettings.maxWidth || 1000;
          const nextColumn = Locale.isRTL() ?
            DOM.getPreviousSibling(self.currentHeader, ':not(.is-hidden)') :
            DOM.getNextSibling(self.currentHeader, ':not(.is-hidden)');

          nextColumnId = nextColumn.getAttribute('data-column-id');
          const nextCol = Locale.isRTL() ?
            DOM.getPreviousSibling(currentCol, ':not(.is-hidden)') :
            DOM.getNextSibling(currentCol, ':not(.is-hidden)');

          const nextColWidth = parseInt(nextColumn.offsetWidth, 10);
          let nextCssWidth = parseInt(nextCol.style.width || nextColWidth, 10);
          // Convert from percentage
          if (nextCol.style.width.indexOf('%') > -1) {
            nextCssWidth = nextColWidth;
          }
          nextWidthToSet = nextCssWidth + diff;

          if (nextWidthToSet < nextMinWidth || nextWidthToSet > nextMaxWidth) {
            self.resizeHandle.css('cursor', 'inherit');
            return;
          }

          if (nextWidthToSet === nextCssWidth || !nextCol) {
            return;
          }

          nextCol.style.width = (`${nextWidthToSet}px`);
        }
      })
      .on('dragend.datagrid', () => {
        this.dragging = false;
        if (self.isEllipsisActiveHeader(column)) {
          self.activeEllipsisHeader(self.currentHeader[0]);
        }

        self.setColumnWidth(columnId, widthToSet);

        if (nextColumnId && ((this.settings.resizeMode === 'fit' && !usingShiftKey) ||
          (this.settings.resizeMode === 'flex' && usingShiftKey))) {
          self.setColumnWidth(nextColumnId, nextWidthToSet);
        }
      });
  },

  /**
  * Show Summary and any other count info
  * @private
  * @param {boolean} totals The total to display on the UI.
  */
  displayCounts(totals) {
    const self = this;
    let count = self.tableBody.find('tr:visible').length;
    let groupCount = 0;
    let groupCountText = '';
    const selectedRowIdx = [];
    const isClientSide = self.settings.paging && !(self.settings.source);
    const formatInteger = v => Locale.formatNumber(v, { style: 'integer' });

    if (isClientSide || (!totals)) {
      this.recordCount = self.settings.dataset.length;
      count = self.settings.dataset.length;
    }

    if (this.settings.treeGrid && isClientSide || (!totals)) {
      this.filteredCount = self.settings.dataset.filter(item => item._isFilteredOut).length;
      count = self.settings.dataset.length;
      this.recordCount = self.settings.dataset.filter(item => !item._isFilteredOut).length;
    }

    if (self.settings.groupable) {
      groupCount = count;
      count = self.originalDataset.length;
      groupCountText = `({0} ${Locale.translate(groupCount === 1 ? 'Group' : 'Groups')})`;
      groupCountText = groupCountText.replace('{0}', formatInteger(groupCount));
    }

    // Update Selected
    if (self.contextualToolbar && self.contextualToolbar.length) {
      self._selectedRows.forEach((i) => {
        selectedRowIdx.push(i.idx);
        const selectedCount = selectedRowIdx.filter((a, b) => selectedRowIdx.indexOf(a) === b);
        self.contextualToolbar.find('.selection-count').text(`${selectedCount.length} ${Locale.translate('Selected')}`);
      });

      if (self.settings.allowSelectAcrossPages) {
        self.contextualToolbar.find('.selection-count').text(`${self._selectedRows.length} ${Locale.translate('Selected')}`);
      }
    }

    if (totals && totals !== -1) {
      count = totals;
    }

    if (totals === undefined && this.settings.source) {
      count = self.settings.dataset.length;
    }

    if (totals === undefined && this.settings.source && this.pagerAPI?.state?.total) {
      count = this.pagerAPI?.state?.total;
    }

    let countText;
    if (self.settings.showFilterTotal && self.filteredCount > 0) {
      countText = `(${Locale.translate(count === 1 ? 'ResultOf' : 'ResultsOf')})`;
      countText = countText.replace('{0}', formatInteger(count - self.filteredCount));
      countText = countText.replace('{1}', formatInteger(count));
    } else {
      const translation = Locale.translate(count === 1 ? 'Result' : 'Results');
      if (translation.indexOf('{0}') === -1) {
        countText = `({0} ${translation})`;
      } else {
        countText = translation;
      }
      countText = countText.replace('{0}', formatInteger(count));
    }

    if (self.settings.resultsText) {
      if (typeof self.settings.resultsText === 'function') {
        if (self.grandTotal) {
          countText = self.settings.resultsText(
            self,
            self.grandTotal, count === self.grandTotal ? 0 : count
          );
        } else {
          const filteredCount = (self.filteredCount === 0 ? 0 : count - self.filteredCount);
          countText = self.settings.resultsText(self, count, filteredCount);
        }
      } else {
        countText = self.settings.resultsText;
      }
    }

    if (self.toolbar) {
      DOM.html(self.toolbar.find('.datagrid-result-count'), countText, '<span>');
      DOM.html(self.toolbar.find('.datagrid-group-count'), groupCountText, '<span>');
      self.toolbar[0].setAttribute('aria-label', self.toolbar.find('.title').text());
      self.toolbar.find('.datagrid-row-count').text(count);

      // Append ID's
      utils.addAttributes(self.toolbar.find('.title'), this, this.settings.attributes, 'title');
      utils.addAttributes(self.toolbar.find('.btn-actions'), this, this.settings.attributes, 'actions');
      const search = self.toolbar.find('#gridfilter');
      utils.addAttributes(search, this, this.settings.attributes, 'search');
      search.prev('label').attr('for', search.attr('id'));
    }
    DOM.html(self.element.closest('.modal').find('.datagrid-result-count'), countText, '<span>');
    this.lastCount = count;

    this.checkEmptyMessage();
  },

  /**
  * Set the content dynamically on the empty message area.
  * @param {object} emptyMessage The update empty message config object.
  */
  setEmptyMessage(emptyMessage) {
    this.element[emptyMessage?.height === 'small' ? 'addClass' : 'removeClass']('empty-message-height-small');
    if (!this.emptyMessage) {
      this.emptyMessageContainer = $('<div class="empty-message-container"><div></div></div>');
      this.element.append(this.emptyMessageContainer).addClass('has-empty-message');
      this.emptyMessage = this.emptyMessageContainer.find('div').emptymessage(emptyMessage).data('emptymessage');
      this.checkEmptyMessage();
    } else {
      this.emptyMessage.settings = emptyMessage;
      this.emptyMessage.updated();
    }
  },

  /**
  * Hide/Show the empty message object should be shown.
  * @private
  */
  checkEmptyMessage() {
    if (this.emptyMessage && this.emptyMessageContainer) {
      if (this.recordCount === 0) {
        this.emptyMessageContainer.show();
        this.element.addClass('is-empty');
      } else {
        this.emptyMessageContainer.hide();
        this.element.removeClass('is-empty');
      }
    }
  },

  /**
  * Trigger event on parent and compose the args
  * @private
  * @param  {strung} eventName Event to trigger
  * @param  {object} e  Actual event
  * @param  {boolean} stopPropagation If stopPropagation should be done
  * @returns {boolean} False when the event should not propagte.
  */
  triggerRowEvent(eventName, e, stopPropagation) {
    const self = this;
    const target = $(e.target);
    const rowElem = target.closest('tr');
    const cellElem = target.closest('td');
    const cell = cellElem.index();
    let row = this.settings.treeGrid ? this.actualRowIndex(rowElem) : this.dataRowIndex(rowElem);
    let isTrigger = true;

    if (target.is('a') || target.closest('a').length) {
      stopPropagation = false;
    }

    if (stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }

    let item = self.settings.dataset[row];

    //  Groupable
    if (this.settings.groupable) {
      if (rowElem.is('.datagrid-rowgroup-header, .datagrid-rowgroup-footer')) {
        isTrigger = false; // No need to trigger if no data item
      } else {
        row = self.actualPagingRowIndex(self.actualRowIndex(rowElem));
        item = self.settings.dataset[self.groupArray[row].group];
        if (item && item.values) {
          item = item.values[self.groupArray[row].node];
        }
      }
    }

    if (isTrigger) {
      const args = { row, rowElem, cell, cellElem, item, originalEvent: e };
      self.element.trigger(eventName, [args]);
    }

    return false;
  },

  /**
   * Sync the containers when scrolling on the y axis.
   * @private
   * @param  {jQuery} e The event object
   */
  handleScrollY(e) {
    const elem = e.currentTarget;
    const top = elem.scrollTop;

    if (top !== this.scrollTop && this.bodyWrapperCenter &&
      (this.bodyWrapperLeft || this.bodyWrapperRight)) {
      this.scrollTop = top;

      if (this.bodyWrapperLeft) {
        this.bodyWrapperLeft[0].scrollTop = this.scrollTop;
      }
      if (this.bodyWrapperRight) {
        this.bodyWrapperRight[0].scrollTop = this.scrollTop;
      }
      this.bodyWrapperCenter[0].scrollTop = this.scrollTop;
    }
  },

  /**
  * Resize event handler.
  * @private
  */
  rerender() {
    this.clearCache();
    this.renderRows();
    this.renderHeader();
  },

  /**
   * Attach All relevant event handlers.
   * @private
   * @returns {void}
   */
  handleEvents() {
    const self = this;

    // Set Focus on rows
    if (!self.settings.cellNavigation && self.settings.rowNavigation) {
      self.element
        .on('focus.datagrid', 'tbody > tr', function () {
          const rowNodes = self.rowNodes($(this));
          rowNodes.addClass('is-active-row');
        })
        .on('blur.datagrid', 'tbody > tr', function () {
          const rowNodes = self.rowNodes($(this));
          rowNodes.removeClass('is-active-row');
        });
    }

    // Handle Paging
    if (this.settings.paging) {
      this.tableBody.on(`page.${COMPONENT_NAME}`, (e, pagingInfo) => {
        if (pagingInfo.type === 'filtered' && this.settings.source) {
          return;
        }
        self.saveUserSettings();
        self.render(null, pagingInfo);
        self.afterPaging(pagingInfo);
      }).on(`pagesizechange.${COMPONENT_NAME}`, (e, pagingInfo) => {
        self.render(null, pagingInfo);
        self.afterPaging(pagingInfo);
      });
    }

    // Handle Hover States
    if (self.settings.showHoverState) {
      self.element
        .off('mouseenter.datagrid, mouseleave.datagrid')
        .on('mouseenter.datagrid', 'tbody > tr', function () {
          const rowNodes = self.rowNodes($(this));
          rowNodes.addClass('is-hover-row');
        }).on('mouseleave.datagrid', 'tbody > tr', function () {
          const rowNodes = self.rowNodes($(this));
          rowNodes.removeClass('is-hover-row');
        });
    }

    // Sync Header and Body During scrolling
    if (this.hasLeftPane || this.hasRightPane) {
      self.element.find('.datagrid-wrapper')
        .on('scroll.table', (e) => {
          self.handleScrollY(e);
        });

      self.element.find('.datagrid-wrapper')
        .on('wheel.table', (e) => {
          if (e.originalEvent.deltaY !== 0) {
            e.currentTarget.scrollTop += (e.originalEvent.deltaY);
            e.preventDefault();
            self.handleScrollY(e);
          }
        });
    }

    if (this.settings.virtualized) {
      let oldScroll = 0;
      let oldHeight = 0;

      self.bodyWrapperCenter
        .on('scroll.vtable', debounce(function () {
          const scrollTop = this.scrollTop;
          const buffer = 25;
          const hitBottom = scrollTop >
            (self.virtualRange.bottom - self.virtualRange.bodyHeight - buffer);
          const hitTop = scrollTop < (self.virtualRange.top + buffer);

          if (scrollTop !== oldScroll && (hitTop || hitBottom)) {
            oldScroll = this.scrollTop;
            self.clearCache();
            self.renderRows();
          }
        }, 0));

      $('body').on('resize.vtable', function () {
        const height = this.offsetHeight;

        if (height !== oldHeight) {
          oldHeight = this.scrollTop;
          self.clearCache();
          self.renderRows();
        }
      });
    }

    // Handle Sorting
    this.element
      .off('click.datagrid-header')
      .on('click.datagrid-header', '.datagrid-header th.is-sortable, .datagrid-header th.btn-filter', function (e) {
        const parent = $(e.target).parent();
        if (parent.is('.datagrid-filter-wrapper') ||
            parent.is('.lookup-wrapper') ||
            parent.is('.has-close-icon-button')) {
          return false;
        }

        // Prevent parent grid from sorting when nested
        e.stopPropagation();
        self.setSortColumn($(this).attr('data-column-id'));
        return false;
      });

    // Prevent redirects
    this.element
      .off('click.datagrid-links')
      .on('click.datagrid-links', 'tbody .datagrid-row a', (e) => {
        const href = e.currentTarget.getAttribute('href');
        if (!href || href === '#') {
          e.preventDefault();
        }
      });

    // Add a paste event for handling pasting from excel
    if (self.settings.editable) {
      this.element.off('paste.datagrid').on('paste.datagrid', (e) => {
        let pastedData;
        if (e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
          pastedData = e.originalEvent.clipboardData.getData('text/plain');
        } else {
          pastedData = window.clipboardData && window.clipboardData.getData ? window.clipboardData.getData('Text') : false;
        }

        const hasLineFeed = /\n/.exec(pastedData);
        const hasCarriageReturn = /\r/.exec(pastedData);
        const hasBoth = /\r\n/.exec(pastedData);

        if (self.activeCell && self.activeCell.node.hasClass('is-readonly')) {
          return; // disallow pasting on non editable cells.
        }

        if (pastedData && hasCarriageReturn || hasLineFeed || hasBoth) {
          let splitData = hasLineFeed ? pastedData.split('\n') : pastedData.split('\r');
          if (hasBoth) {
            splitData = pastedData.split('\r\n');
          }

          splitData.pop();

          const startRowCount = parseInt($(e.target)[0].parentElement.parentElement.parentElement.getAttribute('data-index'), 10);
          const startColIndex = parseInt($(e.target)[0].parentElement.parentElement.getAttribute('aria-colindex'), 10) - 1;

          if (self.editor && self.editor.input) {
            self.commitCellEdit();
          }
          self.copyToDataSet(splitData, startRowCount, startColIndex, self.settings.dataset);
        }
      });
    }

    this.element.off('click.datagrid').on('click.datagrid', 'tbody td', function (e) {
      let rowNode = null;
      let dataRowIdx = null;
      const target = $(e.target);
      const td = target.closest('td');

      if ($(e.currentTarget).closest('.datagrid-expandable-row').length === 1 &&
        $(e.currentTarget).attr('role') !== 'gridcell') {
        return;
      }

      if (td.is('.has-btn-actions') && !target.is('.btn-actions')) {
        self.setActiveCell(td);
        return;
      }

      if (target.parents('td').length > 1) {
        e.preventDefault(); // stop nested clicks from propagating
        e.stopPropagation();
      }

      /**
      * Fires after a row is clicked.
      * @event click
      * @memberof Datagrid
      * @property {object} event The jquery event object
      * @property {object} args Additional arguments
      * @property {number} args.row The current row height
      * @property {number} args.cell The columns object
      * @property {object} args.item The current sort column.
      * @property {object} args.originalEvent The original event object.
      */
      self.triggerRowEvent('click', e, true);
      self.setActiveCell(td);

      // Dont Expand rows or make cell editable when clicking expand button
      if (target.is('.datagrid-expand-btn')) {
        rowNode = $(this).closest('tr');
        dataRowIdx = self.actualRowIndex(rowNode);

        self.toggleRowDetail(dataRowIdx);
        self.toggleGroupChildren(rowNode);
        self.toggleChildren(e, dataRowIdx);
        return false; //eslint-disable-line
      }

      const isSelectionCheckbox = target.is('.datagrid-selection-checkbox') ||
                                target.find('.datagrid-selection-checkbox').length === 1;
      let canSelect = self.settings.clickToSelect ? true : isSelectionCheckbox;

      if (target.is('.datagrid-drilldown')) {
        canSelect = false;
      }

      if (self.settings.selectable === 'mixed') {
        canSelect = isSelectionCheckbox;

        // Then Activate
        if (!canSelect) {
          if (e.shiftKey && self.activatedRow().length) {
            self.selectRowsBetweenIndexes([self.activatedRow()[0].row, target.closest('tr').attr('aria-rowindex') - 1]);
            e.preventDefault();
          }

          self.toggleRowActivation(target.closest('tr'));
        }
      }

      if (canSelect && (self.settings.selectable === 'multiple' || self.settings.selectable === 'mixed') && e.shiftKey) {
        self.selectRowsBetweenIndexes([self.lastSelectedRow, target.closest('tr').attr('aria-rowindex') - 1]);
        e.preventDefault();
      } else if (canSelect) {
        self.toggleRowSelection(target.closest('tr'));
      }

      // Handle Cell Click Event
      const cell = td.attr('aria-colindex') - 1;
      const col = self.columnSettings(cell);

      if (col && !target.is('.datagrid-checkbox') && col.editor === Editors.Checkbox) {
        return;
      }

      const isEditable = self.makeCellEditable(self.activeCell.rowIndex, self.activeCell.cell, e);

      if (col.click && typeof col.click === 'function' && target.is('button, input[checkbox], a, a.search-mode i') || target.parent().is('button')) {   //eslint-disable-line
        const rowElem = $(this).closest('tr');
        let rowIdx = self.actualRowIndex(rowElem);
        dataRowIdx = self.dataRowIndex(rowElem);
        let item = self.settings.treeGrid ?
          self.settings.treeDepth[rowIdx].node :
          self.settings.dataset[dataRowIdx];

        if (td.hasClass('is-focusable')) {
          if (!target.is(self.buttonSelector)) {
            if (!target.parent('button').is(self.buttonSelector)) {
              return;
            }
          }
        }

        if (self.settings.groupable) {
          if (!rowElem.is('.datagrid-rowgroup-header, .datagrid-rowgroup-footer')) {
            rowIdx = self.actualPagingRowIndex(self.actualRowIndex(rowElem));
            item = self.settings.dataset[self.groupArray[rowIdx].group];
            if (item && item.values) {
              item = item.values[self.groupArray[rowIdx].node];
            }
          }
        }

        if (!td.hasClass('is-cell-readonly') && !target.is('[disabled]') && target.is('button, input[checkbox], a, a.search-mode i') || target.parent().is('button')) {  //eslint-disable-line
          col.click(e, [{ row: rowIdx, cell: self.activeCell.cell, item, originalEvent: e }]);
        }
        if (target.is('[disabled]') && col.formatter === Formatters.Hyperlink) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      }

      // Handle Context Menu on Some
      if (col.menuId) {
        self.closePrevPopupmenu();
        const btn = $(this).find('button');
        btn.popupmenu({
          attachToBody: true,
          menuId: col.menuId,
          trigger: 'immediate',
          offset: { y: 5 },
          returnFocus: () => td.focus()
        }).off('close.gridpopupbtn').on('close.gridpopupbtn', function () {
          const el = $(this);
          if (el.data('popupmenu') && !el.data('tooltip')) {
            el.data('popupmenu').destroy();
          }
        });

        if (col.selected) {
          btn.off('selected.gridpopupbtn').on('selected.gridpopupbtn', col.selected);
        }
      }

      // Apply Quick Edit Mode
      if (isEditable) {
        setTimeout(() => {
          if ($('textarea, input', td).length &&
              (!$('.dropdown,' +
              '[type=file],' +
              '[type=image],' +
              '[type=button],' +
              '[type=submit],' +
              '[type=reset],' +
              '[type=checkbox],' +
              '[type=radio]', td).length)) {
            self.quickEditMode = true;
          }
        }, 0);
      }
    });

    if (this.stretchColumn !== 'last') {
      $(window).on('orientationchange.datagrid', () => {
        this.rerender();
      });

      $(window).on('resize.datagrid', () => {
        let j = 0;
        this.clearCache();
        for (j = 0; j < self.settings.columns.length; j++) {
          const col = self.settings.columns[j];
          self.columnWidth(col, j);
        }

        if (self.stretchColumnDiff > 0 || self.stretchColumnWidth > 0) {
          const currentCol = self.bodyColGroup.find('col').eq(self.getStretchColumnIdx())[0];
          currentCol.style.width = `${self.stretchColumnDiff > 0 ? '99%' : `${self.stretchColumnWidth}px`}`;
        }
      });
    }

    /**
    * Fires after a row is double clicked.
    * @event dblclick
    * @memberof Datagrid
    * @property {object} event The jquery event object
    * @property {object} args Additional arguments
    * @property {number} args.row The current row height
    * @property {number} args.cell The columns object
    * @property {object} args.item The current sort column.
    * @property {object} args.originalEvent The original event object.
    */
    this.element.off('dblclick.datagrid').on('dblclick.datagrid', 'tbody tr', (e) => {
      self.triggerRowEvent('dblclick', e, true);
    });

    /**
    * Fires after a row has a right click action.
    * @event contextmenu
    * @memberof Datagrid
    * @property {object} event The jquery event object
    * @property {object} args Additional arguments
    * @property {number} args.row The current row height
    * @property {number} args.cell The columns object
    * @property {object} args.item The current sort column.
    * @property {object} args.originalEvent The original event object.
    */
    this.element.off('contextmenu.datagrid').on('contextmenu.datagrid', 'tbody td', (e) => {
      const td = $(e.currentTarget);
      e.stopPropagation();
      self.closePrevPopupmenu();
      self.triggerRowEvent('contextmenu', e, (!!self.settings.menuId));

      const hasMenu = () => self.settings.menuId && $(`#${self.settings.menuId}`).length > 0;
      if (!hasMenu() || (!utils.isSubscribedTo(self.element[0], e, 'contextmenu', 'datagrid') && !hasMenu())) {
        return true;
      }
      e.preventDefault();

      self.setActiveCell(
        parseInt(td.parent().attr('aria-rowindex'), 10) - 1,
        parseInt(td.attr('aria-colindex'), 10) - 1
      );
      self.activeCell.node.focus();

      td.popupmenu({
        menuId: self.settings.menuId,
        eventObj: e,
        beforeOpen: self.settings.menuBeforeOpen,
        attachToBody: true,
        trigger: 'immediate'
      })
        .off('selected.gridpopuptr')
        .on('selected.gridpopuptr', (selectedEvent, args) => {
          if (self.settings.menuSelected) {
            self.settings.menuSelected(selectedEvent, args);
          }
        })
        .off('close.gridpopuptr')
        .on('close.gridpopuptr', function () {
          const elem = $(this);
          if (elem.data('popupmenu')) {
            elem.data('popupmenu').destroy();
          }
        });

      return false;
    });

    // Move the drag handle to the end or start of the column
    this.headerRow.add(this.headerRowLeft)
      .off('mousemove.datagrid')
      .on('mousemove.datagrid', 'th', (e) => {
        if (self.dragging) {
          return;
        }

        self.currentHeader = $(e.target).closest('th');

        if (!self.currentHeader.hasClass('is-resizable') || self.currentHeader.hasClass('datagrid-header-spacer-column')) {
          return;
        }

        const headerDetail = self.currentHeader.closest('.header-detail');
        const extraMargin = headerDetail.length ? parseInt(headerDetail.css('margin-left'), 10) : 0;
        const leftEdge = (parseInt(self.currentHeader.position().left, 10) - (extraMargin || 0)) +
          self.element.scrollLeft();
        const rightEdge = leftEdge + self.currentHeader.outerWidth();
        const alignToLeft = (e.pageX - leftEdge > rightEdge - e.pageX);
        let leftPos = 0;
        leftPos = (alignToLeft ? (rightEdge - 5) : (leftEdge - 5));
        const idx = self.currentHeader.parent().find('th:visible').index(self.currentHeader);

        // Ignore First Column and last column
        if ((idx === 0 && (Locale.isRTL() ? alignToLeft : !alignToLeft)) ||
          (idx === self.visibleColumns().length)) {
          leftPos = '-999';
        }

        if (!Locale.isRTL() && !alignToLeft) {
          self.currentHeader = self.currentHeader.prevAll(':visible').not('.is-hidden').first();
        }

        if (Locale.isRTL() && !alignToLeft) {
          self.currentHeader = self.currentHeader.nextAll(':visible').not('.is-hidden').first();
        }

        if (!self.currentHeader.hasClass('is-resizable')) {
          return;
        }

        self.createResizeHandle();
        self.resizeHandle[0].style.left = `${leftPos}px`;
        self.resizeHandle[0].style.cursor = '';
      })
      .off('contextmenu.datagrid')
      .on('contextmenu.datagrid', 'th', (e) => {
        if (self.settings.headerMenuId) {
          // Add Header Context Menu Support
          e.preventDefault();
          self.closePrevPopupmenu();

          $(e.currentTarget)
            .popupmenu({
              menuId: self.settings.headerMenuId,
              eventObj: e,
              attachToBody: true,
              beforeOpen: self.settings.headerMenuBeforeOpen,
              trigger: 'immediate'
            })
            .off('selected.gridpopupth')
            .on('selected.gridpopupth', (selectedEvent, args) => {
              self.settings.headerMenuSelected(selectedEvent, args);
            })
            .off('close.gridpopupth')
            .on('close.gridpopupth', function () {
              const elem = $(this);
              if (elem.data('popupmenu')) {
                elem.data('popupmenu').destroy();
              }
            });
          return false;
        }
        return true;
      });

    // Handle Clicking Header Checkbox
    this
      .element
      .off('click.datagrid-header-select')
      .on('click.datagrid-header-select', 'th .datagrid-checkbox', function () {
        const checkbox = $(this);

        if (!checkbox.hasClass('is-checked')) {
          checkbox.addClass('is-checked').attr('aria-checked', 'true');
          if (self.settings.selectAllCurrentPage) {
            self.selectAllRowsCurrentPage();
          } else {
            self.selectAllRows();
          }
        } else {
          checkbox.removeClass('is-checked').attr('aria-checked', 'false');
          if (self.settings.selectAllCurrentPage) {
            self.unSelectAllRowsCurrentPage();
          } else {
            self.unSelectAllRows();
          }
        }
      });

    // Implement Editing Auto Commit Functionality
    this.element.off('focusout.datagrid').on('focusout.datagrid', 'tbody td input, tbody td textarea, tbody div.dropdown', (e) => {
      // Keep icon clickable in edit mode
      const target = e.target;

      if ($(target).is('input.lookup, input.timepicker, input.datepicker, input.spinbox, input.colorpicker')) {
        // Wait for modal popup, if did not found modal popup means
        // icon was not clicked, then commit cell edit
        setTimeout(() => {
          const focusElem = $('*:focus');

          if (!$('.lookup-modal.is-visible, #timepicker-popup, #monthview-popup, #colorpicker-menu').length &&
              self.editor) {
            if (focusElem.is('.spinbox, .trigger, .code-block-actions') || !$(target).is(':visible')) {
              return;
            }

            if (focusElem && self.editor.className &&
              focusElem.closest(self.editor.className).length > 0) {
              return;
            }
            self.commitCellEdit();
          }
        }, 150);

        return;
      }

      // Popups are open
      if ($('#dropdown-list, .autocomplete.popupmenu.is-open, #timepicker-popup, .is-editing .code-block').is(':visible')) {
        return;
      }

      if (self.editor && self.editor.input) {
        self.commitCellEdit();
      }
    });
  },

  /**
  * Close any previous opened popupmenus.
  * @private
  * @returns {void}
  */
  closePrevPopupmenu() {
    const nodes = [].slice.call(this.element[0].querySelectorAll('.is-open:not(.popupmenu)'));
    nodes.forEach((node) => {
      const elem = $(node);
      if (elem.data('popupmenu')) {
        elem.trigger('close');
      }
    });
  },

  /**
  * Refresh the heights based on the rowHeight setting.
  * @private
  */
  refreshSelectedRowHeight() {
    const toolbar = this.element.parent().find('.toolbar:not(.contextual-toolbar)');
    const actions = toolbar.find('.btn-actions').data('popupmenu');
    if (!actions?.wrapper) {
      return;
    }

    const extraSmall = actions.wrapper.find('[data-option="row-extra-small"]');
    const small = actions.wrapper.find('[data-option="row-small"]');
    const short = actions.wrapper.find('[data-option="row-short"]');
    const med = actions.wrapper.find('[data-option="row-medium"]');
    const normal = actions.wrapper.find('[data-option="row-normal"]');
    const large = actions.wrapper.find('[data-option="row-large"]');

    if (this.settings.rowHeight === 'extra-small') {
      extraSmall.parent().addClass('is-checked');
      small.parent().removeClass('is-checked');
      short.parent().removeClass('is-checked');
      med.parent().removeClass('is-checked');
      normal.parent().removeClass('is-checked');
      large.parent().removeClass('is-checked');
    }

    if (this.settings.rowHeight === 'short' || this.settings.rowHeight === 'small') {
      extraSmall.parent().removeClass('is-checked');
      small.parent().addClass('is-checked');
      short.parent().addClass('is-checked');
      med.parent().removeClass('is-checked');
      normal.parent().removeClass('is-checked');
      large.parent().removeClass('is-checked');
    }

    if (this.settings.rowHeight === 'medium') {
      extraSmall.parent().removeClass('is-checked');
      small.parent().removeClass('is-checked');
      short.parent().addClass('is-checked');
      med.parent().addClass('is-checked');
      normal.parent().removeClass('is-checked');
      large.parent().removeClass('is-checked');
    }

    if (this.settings.rowHeight === 'normal' || this.settings.rowHeight === 'large') {
      extraSmall.parent().removeClass('is-checked');
      small.parent().removeClass('is-checked');
      short.parent().addClass('is-checked');
      med.parent().removeClass('is-checked');
      normal.parent().addClass('is-checked');
      large.parent().addClass('is-checked');
    }

    // Set draggable targets arrow height
    $('.drag-target-arrows', this.element).css('height', `${this.getTargetHeight()}px`);
  },

  /**
  * Append all the UI elements for the toolbar above the grid.
  * @private
  */
  appendToolbar() {
    let toolbar = null;
    let title = '';
    let more = null;
    const self = this;

    if (!this.settings.toolbar) {
      return;
    }

    // Allow menu to be added manually
    if (this.element.parent().find('.toolbar:not(.contextual-toolbar), .flex-toolbar:not(.contextual-toolbar)').length === 1) {
      toolbar = this.element.parent().find('.toolbar:not(.contextual-toolbar), .flex-toolbar:not(.contextual-toolbar)');
      this.refreshSelectedRowHeight();
    } else {
      toolbar = $('<div class="toolbar" role="toolbar"></div>');
      this.removeToolbarOnDestroy = true;

      if (this.settings.toolbar.title) {
        title = $(`<div class="title">${this.settings.toolbar.title}  </div>`);
      }

      if (!title) {
        title = toolbar.find('.title');
      }
      toolbar.append(title);

      if (this.settings.toolbar.results) {
        // Actually value filled in displayResults
        title.append('<span class="datagrid-result-count"></span>');
      }

      const buttonSet = $('<div class="buttonset"></div>').appendTo(toolbar);

      if (this.settings.toolbar.keywordFilter) {
        const labelMarkup = $(`<label class="audible" for="gridfilter">${Locale.translate('Keyword')}</label>`);
        const searchfieldMarkup = $(`<input class="searchfield" name="searchfield" placeholder="${Locale.translate('Keyword')}" id="gridfilter">`);

        buttonSet.append(labelMarkup);

        if (!this.settings.toolbar.collapsibleFilter) {
          searchfieldMarkup.attr('data-options', '{ "collapsible": false }');
        }

        buttonSet.append(searchfieldMarkup);
      }

      if (this.settings.toolbar.dateFilter) {
        buttonSet.append(`<button class="btn" type="button">${$.createIcon({ icon: 'calendar' })}<span>${Locale.translate('Date')}</span></button>`);
      }

      if (this.settings.toolbar.actions) {
        more = $('<div class="more"></div>').insertAfter(buttonSet);
        more.append(`<button class="btn-actions" title="More" type="button">${$.createIcon({ icon: 'more' })}<span class="audible">Grid Features</span></button>`);
        toolbar.addClass('has-more-button');
      }

      const menu = $('<ul class="popupmenu"></ul>');

      if (this.settings.toolbar.personalize) {
        menu.append(`<li><a href="#" data-option="personalize-columns">${Locale.translate('PersonalizeColumns')}</a></li>`);
      }

      if (this.settings.toolbar.resetLayout) {
        menu.append(`<li><a href="#" data-option="reset-layout">${Locale.translate('ResetDefault')}</a></li>`);
      }

      if (this.settings.toolbar.exportToExcel) {
        menu.append(`<li><a href="#" data-option="export-to-excel">${Locale.translate('ExportToExcel')}</a></li>`);
      }

      if (this.settings.toolbar.advancedFilter) {
        menu.append(`<li><a href="#">${Locale.translate('AdvancedFilter')}</a></li>`);
      }

      if (this.settings.toolbar.views) {
        menu.append(`<li><a href="#">${Locale.translate('SaveCurrentView')}</a></li> ` +
          '<li class="separator"></li> ' +
          `<li class="heading">${Locale.translate('SavedViews')}</li>` +
          '<li><a href="#">View One</a></li>');
      }

      if (this.settings.toolbar.rowHeight) {
        menu.append(`${'<li class="separator single-selectable-section"></li>' +
          '<li class="heading">'}${Locale.translate('RowHeight')}</li>` +
          `<li class="is-selectable${this.settings.rowHeight === 'extra-small' ? ' is-checked' : ''}"><a href="#" data-option="row-extra-small">${Locale.translate('ExtraSmall')}</a></li>` +
          `<li class="is-selectable${this.settings.rowHeight === 'short' || this.settings.rowHeight === 'small' ? ' is-checked' : ''}"><a href="#" data-option="row-small">${Locale.translate('Small')}</a></li>` +
          `<li class="is-selectable${this.settings.rowHeight === 'medium' ? ' is-checked' : ''}"><a href="#" data-option="row-medium">${Locale.translate('Medium')}</a></li>` +
          `<li class="is-selectable${this.settings.rowHeight === 'normal' || this.settings.rowHeight === 'large' ? ' is-checked' : ''}"><a href="#" data-option="row-large">${Locale.translate('Large')}</a></li>`);
      }

      if (this.settings.toolbar.filterRow === true) {
        menu.append(`${'<li class="separator"></li>' +
          '<li class="heading">'}${Locale.translate('Filter')}</li>` +
          `<li class="${this.settings.filterable ? 'is-checked ' : ''}is-toggleable"><a href="#" data-option="show-filter-row">${Locale.translate('ShowFilterRow')}</a></li>` +
          `<li class="is-indented"><a href="#" data-option="run-filter">${Locale.translate('RunFilter')}</a></li>` +
          `<li class="is-indented"><a href="#" data-option="clear-filter">${Locale.translate('ClearFilter')}</a></li>`);
      }

      if (typeof this.settings.toolbar.filterRow === 'object') {
        let filterOptions = '<li class="separator"></li>';

        if (this.settings.toolbar.filterRow.showFilter) {
          filterOptions += `<li class="${this.settings.filterable ? 'is-checked ' : ''}is-toggleable"><a href="#" data-option="show-filter-row">${Locale.translate('ShowFilterRow')}</a></li>`;
        }

        if (this.settings.toolbar.filterRow.runFilter && !this.settings.filterWhenTyping) {
          filterOptions += `<li class="is-indented"><a href="#" data-option="run-filter">${Locale.translate('RunFilter')}</a></li>`;
        }

        if (this.settings.toolbar.filterRow.clearFilter) {
          filterOptions += `<li class="is-indented"><a href="#" data-option="clear-filter">${Locale.translate('ClearFilter')}</a></li>`;
        }
        menu.append(filterOptions);
      }

      if (this.settings.toolbar.actions) {
        more.append(menu);
      }

      if (this.element.prev().is('.contextual-toolbar')) {
        this.element.prev().before(toolbar);
      } else {
        this.element.before(toolbar);
      }
    }

    const actions = toolbar.find('.btn-actions');
    const isFlex = toolbar.is('.flex-toolbar');

    if (this.settings.stickyHeader) {
      toolbar.addClass('is-sticky');
    }

    if (!isFlex) {
      actions.popupmenu();
    }

    const selectHandler = (e, args, args2) => {
      const action = args.attr ? args.attr('data-option') : args2.attr('data-option');
      if (!action) {
        return;
      }

      if (action === 'row-extra-small' || action === 'row-small' || action === 'row-short' ||
        action === 'row-medium' || action === 'row-normal' || action === 'row-large') {
        self.rowHeight(action.substr(4));
      }

      if (action === 'personalize-columns') {
        self.personalizeColumns();
      }

      if (action === 'reset-layout') {
        self.resetColumns();
      }

      if (action === 'export-to-excel') {
        self.exportToExcel();
      }

      // Filter actions
      if (action === 'show-filter-row') {
        self.toggleFilterRow();
      }
      if (action === 'run-filter') {
        self.applyFilter(null, 'menu');
      }
      if (action === 'clear-filter') {
        self.clearFilter();
      }
    };
    (isFlex ? toolbar : actions).on('selected', selectHandler);

    if (this.settings.initializeToolbar && !toolbar.data('toolbar') && !toolbar.hasClass('flex-toolbar')) {
      const opts = $.fn.parseOptions(toolbar);

      if (this.settings.toolbar.fullWidth) {
        opts.rightAligned = true;
      }

      toolbar.toolbar(opts);
    }

    if (this.settings.initializeToolbar && toolbar.hasClass('flex-toolbar') && !toolbar.data('toolbarFlex')) {
      const opts = $.fn.parseOptions(toolbar);
      toolbar.toolbarFlex(opts);
    }

    if (this.settings.toolbar && this.settings.toolbar.keywordFilter) {
      const thisSearch = toolbar.find('.searchfield');
      const xIcon = thisSearch.parent().find('.close.icon');

      thisSearch.off('keypress.datagrid').on('keypress.datagrid', (e) => {
        if (e.keyCode === 13 || e.type === 'change') {
          e.preventDefault();
          self.keywordSearch(thisSearch.val());
        }
      });

      xIcon.off('click.datagrid').on('click.datagrid', () => {
        self.keywordSearch(thisSearch.val());
      });
    }

    if (this.settings.toolbar && this.settings.toolbar.contextualToolbar) {
      const contextualToolbar = `
        <div class="contextual-toolbar datagrid-contextual-toolbar toolbar is-hidden">
          <div class="title selection-count">1 Selected</div>
        </div>`;

      this.element.before(contextualToolbar);
      this.contextualToolbar = this.element.prev('.contextual-toolbar');
    }

    this.toolbar = toolbar;
    this.element.addClass('has-toolbar');
  },

  /**
   * Get or Set the Row Height.
   * @param  {string} height The row height to use, can be 'extra small', 'small, 'normal' or 'large'
   * @Returns {string} The current row height
   */
  rowHeight(height) {
    const args = [];
    if (height) {
      if (this.settings.rowHeight !== height) {
        args.push({ before: this.settings.rowHeight, after: height });
      }
      this.settings.rowHeight = height;
    }

    let rowHeightClass = this.settings.rowHeight;
    if (rowHeightClass === 'short') {
      rowHeightClass = 'small';
    }
    if (rowHeightClass === 'large') {
      rowHeightClass = 'normal';
    }

    this.element
      .add(this.table)
      .add(this.tableLeft)
      .add(this.tableRight)
      .removeClass('extra-small-rowheight small-rowheight short-rowheight medium-rowheight normal-rowheight large-rowheight')
      .addClass(`${rowHeightClass}-rowheight`);

    if (this.virtualRange && this.virtualRange.rowHeight) {
      this.virtualRange.rowHeight = (height === 'normal' || height === 'large') ? 40 : (height === 'medium' ? 30 : 25);

      if (height === 'extra-small') {
        this.virtualRange.rowHeight = 22;
      }
    }

    this.saveUserSettings();
    this.refreshSelectedRowHeight();
    this.rerender();

    if (args.length) {
      this.element.triggerHandler('rowheightchanged', args);
    }

    return this.settings.rowHeight;
  },

  /**
  * Search a Term across all columns
  * @param  {string} term The term to search for.
  */
  keywordSearch(term) {
    this.element.find('tr[role="row"]').removeClass('is-filtered').show();
    this.filterExpr = [];

    this.element.find('.datagrid-expandable-row').each(function () {
      const row = $(this);
      // Collapse All rows
      row.prev().find('.datagrid-expand-btn').removeClass('is-expanded');
      row.prev().find('.plus-minus').removeClass('active');
      row.removeClass('is-expanded').css('display', '');
      row.find('.datagrid-row-detail').css('height', '');
    });

    this.element.find('.search-mode').each(function () {
      const cell = $(this);
      const text = cell.text();
      cell.text(text.replace('<i>', '').replace('</i>', ''));
    });

    term = (term || '').toLowerCase();
    this.filterExpr.push({ column: 'all', operator: 'contains', value: term, keywordSearch: true });

    this.filterKeywordSearch();
    this.clearCache();
    this.renderRows();
    this.setSearchActivePage({ trigger: 'searched', type: 'filtered' });

    if (!(this.settings.paging && this.settings.source)) {
      this.highlightSearchRows(term);
    }
  },

  /**
   * Sets optional filtering conditions on the pager during changes
   * in searching/filtering of datagrid rows
   * @private
   * @param {object} pagingInfo incoming paging state information
   * @returns {void}
   */
  setSearchActivePage(pagingInfo) {
    if (!this.pagerAPI) {
      return;
    }

    const self = this;
    if (!pagingInfo) {
      pagingInfo = {};
    }

    function reset(obj) {
      obj.activePage = 1;
      if (self.grandTotal) {
        obj.grandTotal = self.grandTotal;
      }
      return obj;
    }

    let useSelfActive = true;

    if (this.filterExpr && this.filterExpr.length === 1) {
      if (this.filterExpr[0].value !== '') {
        pagingInfo.activePage = this.pagerAPI.filteredActivePage || 1;
        if (this.settings.source && this.settings.allowSelectAcrossPages &&
          (pagingInfo.activePage !== this.activePage)) {
          useSelfActive = false;
        }
      } else if (this.filterExpr[0].value === '' && this.pagerAPI.filteredActivePage) {
        pagingInfo = reset(pagingInfo);
      }
    } else if (!this.restoreActivePage) {
      pagingInfo = reset(pagingInfo);
      this.restoreActivePage = false;
    }

    if (useSelfActive) {
      pagingInfo.activePage = this.activePage;
    }
    this.renderPager(pagingInfo);
  },

  /**
   * Filter to keyword search.
   * @private
   */
  filterKeywordSearch() {
    const self = this;
    let dataset;
    let isFiltered;
    let i;
    let len;
    let filterExpr = self.filterExpr;

    const checkRow = function (data, row) {
      let isMatch = false;

      const checkColumn = function (columnId) {
        const column = self.columnById(columnId)[0];

        const fieldValue = self.fieldValue(data, column.field);
        let value;
        const cell = self.settings.columns.indexOf(column);

        // Use the formatted value (what the user sees in the cells)
        // since it's a more reliable match
        value = self.formatValue(column.formatter, row, cell, fieldValue, column, data, self);
        value = value.toLowerCase();

        // Strip any html markup that might be in the formatted value
        value = value.replace(/(<([^>]+)>)|(amp;)|(&lt;([^>]+)&gt;)/ig, '');

        return value.indexOf(filterExpr.value) > -1;
      };

      // Check in all visible columns
      if (filterExpr.column === 'all') {
        self.element.find('th:visible').each(function () { //eslint-disable-line
          const th = $(this);
          const columnId = th.attr('data-column-id');

          if (columnId) {
            isMatch = checkColumn(columnId);
            if (isMatch) {
              return false;
            }
          }
        });
      } else if (filterExpr.columnId) { // Check in only one column, given by columnId
        isMatch = checkColumn(filterExpr.columnId);
      }
      return isMatch;
    };

    // Make sure not more/less than one filter expr
    if (!filterExpr || filterExpr.length !== 1) {
      return;
    }
    filterExpr = filterExpr[0];

    // Check in dataset
    if (self.settings.treeGrid) {
      dataset = self.settings.treeDepth;
      for (i = 0, len = dataset.length; i < len; i++) {
        isFiltered = filterExpr.value === '' ? false : !checkRow(dataset[i].node, i);
        dataset[i].node._isFilteredOut = isFiltered;
      }
    } else {
      dataset = self.settings.dataset;
      for (i = 0, len = dataset.length; i < len; i++) {
        isFiltered = filterExpr.value === '' ? false : !checkRow(dataset[i], i);
        dataset[i]._isFilteredOut = isFiltered;
      }
    }
  },

  /**
   * Highlight the term in the grid.
   * @private
   * @param  {string} term The term to highlight
   * @returns {void}
   */
  highlightSearchRows(term) {
    const self = this;

    if (!term || term === '') {
      return;
    }

    const findInRows = (rowNodes) => {
      let found = false;
      rowNodes.toArray().forEach((row) => {
        [].slice.call(row.querySelectorAll('td')).forEach((cell) => {
          const cellText = cell.innerText.toLowerCase();
          const isSearchExpandableRow = self.settings.searchExpandableRow ? true : !DOM.hasClass(this, 'datagrid-expandable-row');

          if (cellText.indexOf(term) > -1 && isSearchExpandableRow) {
            found = true;
            [].slice.call(cell.querySelectorAll('*')).forEach((node) => {
              [].slice.call(node.childNodes).forEach((childNode) => {
                const parent = childNode.parentElement;
                if (childNode.nodeType === 3 && parent.tagName.toLowerCase() !== 'i' &&
                  xssUtils.unescapeHTML(parent.innerHTML) === childNode.textContent) {
                  const contents = childNode.textContent;
                  const exp = new RegExp(`(${stringUtils.escapeRegExp(term)})`, 'gi');

                  DOM.addClass(parent, 'search-mode');
                  DOM.html(parent, contents.replace(exp, '<i>$1</i>'));
                }
              });
            });
          }
        });
      });
      return found;
    };

    // Move across all visible cells and rows, highlighting
    const visibleRows = self.tableBody.find('tr');
    visibleRows.toArray().forEach((row) => {
      const rowContainers = self.rowNodes(row.getAttribute('aria-rowindex') - 1);
      const found = findInRows(rowContainers);

      // Hide non matching rows and non detail rows
      if (!found && !rowContainers.find('.datagrid-row-detail').length) {
        rowContainers.addClass('is-filtered').hide();
      } else if (self.settings.searchExpandableRow && found && rowContainers.is('.datagrid-expandable-row') && term !== '') {
        rowContainers.prev().show();
        rowContainers.prev().find('.datagrid-expand-btn').addClass('is-expanded');
        rowContainers.prev().find('.plus-minus').addClass('active');
        rowContainers.addClass('is-expanded').css('display', 'table-row');
        rowContainers.find('.datagrid-row-detail').css('height', 'auto');
      }
    });
  },

  /**
   * Get the right dataset object to use depending on settings.
   * @private
   * @returns {array} The dataset to use.
   */
  getActiveDataset() {
    const s = this.settings;
    let dataset = s.treeGrid ? s.treeDepth : s.dataset;
    if (s.groupable) {
      dataset = this.originalDataset;
    }
    return dataset;
  },

  /**
   * Return the current data and remove any adding properties.
   * @returns {array} The current dataset.
   */
  getDataset() {
    const dataset = this.settings.dataset;

    return dataset.map((item) => {
      delete item._isFilteredOut;
      return item;
    });
  },

  /**
  * Select all rows. If serverside paging, this will be only the current page.
  * For client side paging, all rows across all pages are selected.
  */
  selectAllRows() {
    const rows = [];
    const dataset = this.getActiveDataset();

    for (let i = 0, l = dataset.length; i < l; i++) {
      const idx = this.settings.groupable ? i : this.pagingRowIndex(i);

      if (this.filterRowRendered ||
        (this.filterExpr && this.filterExpr[0] && this.filterExpr[0].keywordSearch)) {
        if (!dataset[i]._isFilteredOut && !dataset[i]._selected) {
          rows.push(idx);
        }
      } else if (!dataset[i]._selected) {
        rows.push(idx);
      }
    }

    this.dontSyncUi = true;
    this.selectRows(rows, true, true);
    this.dontSyncUi = false;
    this.syncSelectedUI();

    /**
    * Fires after a row is selected.
    * @event selected
    * @memberof Datagrid
    * @property {object} event The jquery event object
    * @property {object} args Additional arguments
    * @property {array} args.selectedRows An array of selected rows.
    * @property {string} args.trigger The action can be 'selectall', 'deselectall', 'select', 'deselect'
    * @property {object} args.item The current sort column.
    * @property {object} args.originalEvent The original event object.
    */
    this.element.triggerHandler('selected', [this._selectedRows, 'selectall']);
  },

  /**
  * Deselect all rows that are currently selected.
  */
  deSelectAllRows() {
    this.unSelectAllRows();
  },

  /**
  * Deselect all rows that are currently selected.
  * @private
  * @param  {boolean} nosync Do not sync the header
  * @param  {boolean} noTrigger Do not trgger event
  * @returns {void}
  */
  unSelectAllRows(nosync, noTrigger) {
    // Nothing to do
    if (!this._selectedRows || this._selectedRows.length === 0) {
      this.settings.dataset.map((row) => { delete row._selected; }); //eslint-disable-line
      return;
    }
    this.dontSyncUi = true;
    // Unselect each row backwards so the indexes are correct
    for (let i = this._selectedRows.length - 1; i >= 0; i--) {
      if (this._selectedRows[i]) {
        const idx = this.settings.groupable ?
          this._selectedRows[i].idx : this.pagingRowIndex(this._selectedRows[i].idx);
        this.unselectRow(idx, true, true);
      }
    }
    this.settings.dataset.map((row) => { delete row._selected; }); //eslint-disable-line
    // Sync the Ui and call the events
    this.dontSyncUi = false;
    this._selectedRows = [];

    if (!nosync) {
      this.syncSelectedUI();
    }

    if (!noTrigger) {
      this.element.triggerHandler('selected', [this._selectedRows, 'deselectall']);
    }
  },

  /**
  * Deselect all rows on active page only, that are currently selected.
  * @private
  * @param  {boolean} nosync Do not sync the header
  * @returns {void}
  */
  unSelectAllRowsCurrentPage(nosync) {
    const s = this.settings;
    this.dontSyncUi = true;
    this.currentPageRows?.forEach((row) => {
      const idx = s.groupable ? row.dataIndex : this.pagingRowIndex(row.dataIndex);
      this.unselectRow(idx, true, true);
    });
    const dataset = this.getActiveDataset();
    const arrIdx = this.currentPageRows?.map(x => x.dataIndex) || [];
    const currentRows = dataset.filter((d, i) => arrIdx.indexOf(i) > -1);
    currentRows.map(row => (delete row._selected));
    this.dontSyncUi = false;

    if (!nosync) {
      this.syncSelectedUI();
    }
  },

  /**
  * Deselect all rows on active page only, that are currently selected.
  * @private
  * @param  {boolean} nosync Do not sync the header
  * @returns {void}
  */
  selectAllRowsCurrentPage(nosync) {
    this.dontSyncUi = true;
    const arrIdx = this.currentPageRows?.map(x => x.dataIndex) || [];

    if (arrIdx.length) {
      this.selectRowsBetweenIndexes([arrIdx[0], arrIdx[arrIdx.length - 1]]);
    }
    this.dontSyncUi = false;

    if (!nosync) {
      this.syncSelectedUI();
    }
  },

  /**
  * Check if node index is exists in selected nodes
  * @private
  * @param {object} row The row to compare.
  * @returns {boolean} If its selected or not.
  */
  isRowSelected(row) {
    // As of 4.3.3, return the rows that have _selected = true
    return row ? row._selected === true : false;
  },

  /**
   * Select a row node on the UI
   * @private
   * @param {object} elem The row node to select
   * @param {number} index The row index to select
   * @param {object} data The object attached to the row
   * @param {boolean} force Dont check if already selected
   * @returns {void}
   */
  selectNode(elem, index, data, force) {
    let checkbox = null;
    const self = this;
    const selectClasses = `is-selected${self.settings.selectable === 'mixed' ? ' hide-selected-color' : ''}`;

    // do not add if already exists in selected
    if ((!data || self.isRowSelected(data)) && !force) {
      return;
    }

    checkbox = elem.find('.datagrid-selection-checkbox').closest('td');
    elem.addClass(selectClasses).attr('aria-selected', 'true');
    checkbox.find('.datagrid-cell-wrapper .datagrid-checkbox')
      .addClass('is-checked').attr('aria-checked', 'true')
      .attr('aria-label', 'Selected');

    if (data) {
      data._selected = true;
    }
  },

  /**
   * Toggle selection on a single row
   * @param {number} idx The row index to select
   * @param {boolean} nosync Do sync the header
   * @param {boolean} noTrigger Do not trigger events.
   * @returns {void}
   */
  selectRow(idx, nosync, noTrigger) {
    let rowNode = null;
    let dataRowIndex;
    const self = this;
    const s = this.settings;
    let args = {};

    if (idx === undefined || idx === -1 || !s.selectable) {
      return;
    }

    if (this.isRowDisabled(idx)) {
      return;
    }

    rowNode = this.settings.groupable ? this.rowNodesByDataIndex(idx) : this.rowNodes(idx);
    dataRowIndex = this.dataRowIndex(rowNode);

    if (isNaN(dataRowIndex)) {
      dataRowIndex = idx;
    }

    if (!rowNode || (!rowNode.length && s.source)) {
      return;
    }

    if (typeof s.onBeforeSelect === 'function' && !noTrigger) {
      const result = s.onBeforeSelect({ node: rowNode, idx: dataRowIndex });
      if (result === false) { // Boolean false is returned so cancel
        return;
      }
    }

    const isMatch = (i, elem, n) => (n && n.idx === i && n.elem && n.elem.is(elem));
    const isExists = (i, elem) => (!!(this._selectedRows.filter(n => isMatch(i, elem, n)).length));

    if (s.selectable === 'single') {
      let selectedIndex = -1;
      if (this._selectedRows.length > 0) {
        selectedIndex = this._selectedRows[0].pagingIdx;
      } else if (rowNode[0] && rowNode[0].classList.contains('is-selected')) {
        selectedIndex = dataRowIndex;
      }
      if (selectedIndex !== -1) {
        this.unselectRow(selectedIndex, true, true);
        if (!rowNode.length && this._selectedRows.length > 0) {
          this._selectedRows.pop();
        }
      }
    }

    const isServerSideMultiSelect = s.source && s.selectable === 'multiple' && s.allowSelectAcrossPages;

    if (!rowNode.hasClass('is-selected') || isServerSideMultiSelect) {
      let rowData;

      if (s.treeGrid) {
        const level = parseInt(rowNode.attr('aria-level'), 10);
        rowData = s.treeDepth[self.pagerAPI && s.source ? rowNode.index() : idx].node;
        if (rowNode.is('.datagrid-tree-parent') && s.selectable === 'multiple') {
          // Select node and node-children
          rowNode.add(rowNode.nextUntil(`[aria-level="${level}"]`)).each(function (i) {
            const elem = $(this);
            const index = elem.attr('aria-rowindex') - 1;
            const actualIdx = self.actualPagingRowIndex(index);
            const data = s.treeDepth[actualIdx].node;

            // Allow select node if selectChildren is true or only first node
            // if selectChildren is false
            if (s.selectChildren || (!s.selectChildren && i === 0)) {
              const canAdd = (!elem.is(rowNode) && !elem.hasClass('is-selected'));
              self.selectNode(elem, index, data);
              if (canAdd && !isExists(actualIdx, elem)) {
                args = {
                  idx: actualIdx,
                  data,
                  elem,
                  page: self.pagerAPI ? self.pagerAPI.activePage : 1,
                  pagingIdx: actualIdx,
                  pagesize: s.pagesize
                };
                if (self.settings.source && self.settings.allowSelectAcrossPages) {
                  const uniqueRowID = self.getUniqueRowID(data);
                  if (uniqueRowID) {
                    args.uniqueRowID = uniqueRowID;
                  }
                }
                self._selectedRows.push(args);
              }
            }
          });
        } else if (s.selectable === 'siblings') {
          if (self.settings.selectAllCurrentPage) {
            self.unSelectAllRowsCurrentPage(true);
          } else {
            self.unSelectAllRows(true, true);
          }

          // Select node and node-siblings
          let nexts;
          let prevs;

          if (level === 1) {
            nexts = rowNode.parent().find('[aria-level="1"]');
          } else if (level > 1) {
            nexts = rowNode.nextUntil(`[aria-level="${level - 1}"]`).filter(`[aria-level="${level}"]`);
            prevs = rowNode.prevUntil(`[aria-level="${level - 1}"]`).filter(`[aria-level="${level}"]`);
          }

          rowNode.add(nexts).add(prevs).each(function (i) {
            const elem = $(this);
            const index = elem.attr('aria-rowindex') - 1;
            const actualIdx = self.actualPagingRowIndex(index);
            const data = s.treeDepth[actualIdx].node;

            // Allow select node if selectChildren is true or only first node
            // if selectChildren is false
            if (s.selectChildren || (!s.selectChildren && i === 0)) {
              const canAdd = (!elem.is(rowNode) && !elem.hasClass('is-selected'));
              self.selectNode(elem, index, data);
              if (canAdd && !isExists(actualIdx, elem)) {
                args = {
                  idx: actualIdx,
                  data,
                  elem,
                  page: self.pagerAPI ? self.pagerAPI.activePage : 1,
                  pagingIdx: actualIdx,
                  pagesize: s.pagesize
                };
                if (self.settings.source && self.settings.allowSelectAcrossPages) {
                  const uniqueRowID = self.getUniqueRowID(data);
                  if (uniqueRowID) {
                    args.uniqueRowID = uniqueRowID;
                  }
                }
                self._selectedRows.push(args);
              }
            }
          });
        } else { // Default to Single element selection
          self.selectNode(rowNode, idx, rowData);
        }
        self.setNodeStatus(rowNode);
      } else {
        rowData = s.dataset[dataRowIndex];
        if (s.groupable) {
          const row = self.actualPagingRowIndex(self.actualRowIndex(rowNode));
          if (isNaN(row)) {
            return;
          }
          const gData = self.groupArray[row];
          rowData = self.settings.dataset[gData.group].values[gData.node];
          if (!isExists(rowData.idx, rowNode)) {
            args = {
              idx: rowData.idx,
              data: rowData,
              elem: rowNode,
              group: s.dataset[self.groupArray[row].group],
              page: self.pagerAPI ? self.pagerAPI.activePage : 1,
              pagingIdx: dataRowIndex,
              pagesize: self.settings.pagesize
            };
            if (self.settings.source && self.settings.allowSelectAcrossPages) {
              const uniqueRowID = self.getUniqueRowID(rowData);
              if (uniqueRowID) {
                args.uniqueRowID = uniqueRowID;
              }
            }
            this._selectedRows.push(args);
          }
        }
        self.selectNode(rowNode, dataRowIndex, rowData);
        self.lastSelectedRow = idx; // Rememeber index to use shift key
      }

      // Append data to selectedRows
      if (!s.groupable) {
        let actualIdx = self.actualPagingRowIndex(idx);
        if (actualIdx === -1) {
          actualIdx = idx;
        }

        if (!isExists(actualIdx, self.visualRowNode(actualIdx))) {
          args = {
            idx: actualIdx,
            data: rowData,
            elem: self.visualRowNode(actualIdx),
            page: self.pagerAPI ? self.pagerAPI.activePage : 1,
            pagingIdx: idx,
            pagesize: self.settings.pagesize
          };
          if (self.settings.source && self.settings.allowSelectAcrossPages) {
            const uniqueRowID = self.getUniqueRowID(rowData);
            if (uniqueRowID) {
              args.uniqueRowID = uniqueRowID;
            }
          }
          this._selectedRows.push(args);
        }
      }
    }

    if (!nosync) {
      self.syncSelectedUI();
    }

    if (!noTrigger) {
      this.element.triggerHandler('selected', [this._selectedRows, 'select']);
    }
  },

  /**
  * Select rows between indexes
  * @private
  * @param  {array} indexes The ranges to select.
  * @returns {void}
  */
  selectRowsBetweenIndexes(indexes) {
    indexes.sort((a, b) => a - b);
    for (let i = indexes[0]; i <= indexes[1]; i++) {
      this.selectRow(i);
    }

    this.displayCounts();
  },

  /**
  * Set the checkbox on the header based on selections.
  * @private
  * @param  {array} rows The rows to select.
  * @returns {void}
  */
  syncHeaderCheckbox(rows) {
    if (this.headerNodes().length === 0) {
      return;
    }
    const s = this.settings;
    const dataset = this.getActiveDataset();

    const headerCheckbox = this.headerNodes().find('.datagrid-checkbox');
    const rowsLength = rows.length;
    let selectedRowsLength = this._selectedRows.length;
    const status = headerCheckbox.data('selected');

    // Only on active page selected all checkbox
    if (s.selectAllCurrentPage && this.currentPageRows && dataset.length !== rows.length) {
      const arrIdx = this.currentPageRows?.map(x => x.dataIndex) || [];
      const currentRows = dataset.filter((d, i) => arrIdx.indexOf(i) > -1);
      selectedRowsLength = currentRows.filter(x => x._selected).length;
    }

    if (s.source && s.allowSelectAcrossPages) {
      selectedRowsLength = dataset.filter(i => i._selected).length;
    }

    // Do not run if checkbox in same state
    if ((selectedRowsLength !== rowsLength &&
          selectedRowsLength > 0 && status === 'partial') ||
            (selectedRowsLength === rowsLength && status === 'all' && selectedRowsLength !== 0) ||
              (selectedRowsLength === 0 && status === 'none')) {
      return;
    }

    // Sync the header checkbox
    if (selectedRowsLength > 0) {
      headerCheckbox.data('selected', 'partial')
        .addClass('is-checked is-partial')
        .attr('aria-checked', 'mixed');
    }

    if (selectedRowsLength === rowsLength) {
      headerCheckbox.data('selected', 'all')
        .addClass('is-checked').removeClass('is-partial')
        .attr('aria-checked', 'true');
    }

    if (selectedRowsLength === 0) {
      headerCheckbox.data('selected', 'none')
        .removeClass('is-checked is-partial')
        .attr('aria-checked', 'false');
    }
  },

  /**
   * Get unique id for data node
   * @private
   * @param  {object} data The data node.
   * @returns {string} calculated id
   */
  getUniqueRowID(data) {
    let str = null;
    if (this.settings.columnIds.length > 0) {
      str = 'rowId';
      for (let i = 0; i < this.settings.columnIds.length; i++) {
        str += ` ${data[this.settings.columnIds[i]]}`;
      }
      str = str.replace(/([0-9A-Z]+)/g, (m, chr) => ` ${chr}`)
        .replace(/([0-9a-z]+)/g, (m, chr) => `${chr} `)
        .trim();
      str = xssUtils.toCamelCase(str);
    }
    return str;
  },

  /**
   * Mark selected rows on the page as selected
   * @private
   * @returns {void}
   */
  syncSelectedRows() {
    const s = this.settings;
    const dataset = s.groupable && this.originalDataset ? this.originalDataset : s.dataset;
    let idx = null;

    const selectNode = (i) => {
      const elem = s.groupable ? this.dataRowNode(idx) : this.visualRowNode(idx);
      if (elem[0]) {
        this._selectedRows[i].elem = elem;
        this.selectNode(elem, idx, dataset[idx], true);
      }
    };

    const getSelUniqueRowID = node => (node ? node.uniqueRowID : null);

    for (let i = 0, l = this._selectedRows.length; i < l; i++) {
      const selectedUniqueRowID = getSelUniqueRowID(this._selectedRows[i]);
      if (this.settings.source && this.settings.allowSelectAcrossPages && !!selectedUniqueRowID) {
        for (let i2 = 0, l2 = dataset.length; i2 < l2; i2++) {
          if (selectedUniqueRowID === this.getUniqueRowID(dataset[i2])) {
            const elem = s.groupable ? this.dataRowNode(i2) : this.visualRowNode(i2);
            if (elem[0]) {
              this._selectedRows[i].elem = elem;
              this.selectNode(elem, i2, dataset[i2], true);
            }
          }
        }
      } else {
        if (this.pagerAPI && this._selectedRows[i].page === this.pagerAPI.activePage) {
          idx = this._selectedRows[i].idx;
          selectNode(i);
        }

        // Check for rows that changed page
        if (this._selectedRows[i].pagesize !== s.pagesize && !s.groupable) {
          idx = this._selectedRows[i].pagingIdx;

          if (s.dataset[idx]) {
            selectNode(i);
            this._selectedRows[i].idx = idx;
            this._selectedRows[i].page = this.pagerAPI.activePage;
            this._selectedRows[i].pagesize = s.pagesize;
          } else {
            this._selectedRows[i].idx = idx % s.pagesize;
            this._selectedRows[i].page = Math.round(idx / s.pagesize) + 1;
            this._selectedRows[i].pagesize = s.pagesize;
          }
        }
      }
    }
  },

  /**
   * Calculate pager info for given index.
   * @private
   * @param  {number} idx The index number
   * @param  {object} ds custom dataset (optional)
   * @param  {number} pagesize custom pagesize (optional)
   * @returns {object} calculated pager info
   */
  calculatePagerInfo(idx, ds, pagesize) {
    const s = this.settings;
    const dataset = ds || s.treeGrid ? s.treeDepth : s.dataset;
    pagesize = typeof pagesize === 'number' && pagesize > 0 ? pagesize : s.pagesize;
    const pagerInfo = {
      idx,
      page: 1,
      pagesize,
      numOfPages: Math.ceil(dataset.length / pagesize)
    };

    for (let i = 0; i < pagerInfo.numOfPages; i++) {
      if (idx >= ((pagerInfo.page - 1) * pagerInfo.pagesize) &&
        idx < (pagerInfo.page * pagerInfo.pagesize)) {
        pagerInfo.pagingIdx = idx - (pagerInfo.pagesize * i);
        break;
      }
      pagerInfo.page++;
    }

    return pagerInfo;
  },

  /**
   * Run throught the array and remark the idx's after a row reorder.
   * @private
   * @returns {void}
   */
  syncSelectedRowsIdx() {
    const dataset = this.settings.groupable && this.originalDataset ?
      this.originalDataset : this.settings.dataset;
    if (this._selectedRows.length === 0 || dataset.length === 0) {
      return;
    }
    this._selectedRows = [];

    for (let i = 0; i < dataset.length; i++) {
      if (dataset[i]._selected) {
        const selectedRow = {
          idx: i,
          data: dataset[i],
          elem: this.dataRowNode(i),
          pagingIdx: i,
          pagesize: this.settings.pagesize
        };
        if (this.settings.groupable) {
          const rowNode = this.rowNodesByDataIndex(i);
          if (rowNode.length) {
            const row = this.actualPagingRowIndex(this.actualRowIndex(rowNode));
            const group = this.groupArray[row].group;
            selectedRow.group = this.settings.dataset[group];
            selectedRow.page = this.calculatePagerInfo(group).page;
          }
        } else {
          selectedRow.page = this.calculatePagerInfo(i).page;
        }

        this._selectedRows.push(selectedRow);
      }
    }
  },

  /**
   * Set ui elements based on selected rows
   * @private
   * @returns {void}
   */
  syncSelectedUI() {
    const dataset = this.getActiveDataset();
    let currentRows = dataset;

    // Selected all only on active page
    if (this.settings.selectAllCurrentPage) {
      const arrIdx = this.currentPageRows?.map(x => x.dataIndex) || [];
      currentRows = dataset.filter((d, i) => arrIdx.indexOf(i) > -1);
    }

    let rows = currentRows;

    if (this.filterRowRendered) {
      rows = [];
      for (let i = 0, l = currentRows.length; i < l; i++) {
        if (!currentRows[i]._isFilteredOut) {
          rows.push(i);
        }
      }
    }

    this.syncHeaderCheckbox(rows);

    // Open or Close the Contextual Toolbar.
    if (this.contextualToolbar.length !== 1 || this.dontSyncUi) {
      return;
    }

    if (this._selectedRows.length === 0) {
      this.contextualToolbar.one('animateclosedcomplete.datagrid', () => {
        this.contextualToolbar.css('display', 'none');
      }).animateClosed();
    }

    if (this._selectedRows.length > 0 && this.contextualToolbar.height() === 0) {
      this.contextualToolbar.css('display', 'block').one('animateopencomplete.datagrid', function () {
        $(this).triggerHandler('recalculate-buttons');
      }).animateOpen();
    }
  },

  /**
   * Activate a row when in mixed selection mode
   * @param  {number} idx The index.
   */
  activateRow(idx) {
    if (this.activatedRow()[0].row !== idx) {
      this.toggleRowActivation(idx);
    }
  },

  /**
  * Deactivate the currently activated row.
  */
  deactivateRow() {
    const idx = this.activatedRow()[0].row;
    if (idx >= 0) {
      this.toggleRowActivation(idx);
    }
  },

  /**
  * Gets the currently activated row.
  * @returns {object} Information about the activated row.
  */
  activatedRow() {
    let r = [{ row: -1, item: undefined, elem: undefined }];

    if (this.tableBody) {
      const s = this.settings;
      const dataset = s.treeGrid ? s.treeDepth : s.dataset;
      const activatedRow = this.tableBody.find('tr.is-rowactivated');

      if (activatedRow.length) {
        const dataRowIndex = this.dataRowIndex(activatedRow);
        const rowIndex = s.indeterminate ? dataRowIndex : this.actualRowIndex(activatedRow);
        r = [{ row: rowIndex, item: dataset[rowIndex], elem: activatedRow }];
      } else {
        r = null;
        // Activated row may be filtered or on another page, so check all until find it
        for (let i = 0; i < dataset.length; i++) {
          if (dataset[i]._rowactivated) {
            r = [{ row: i, item: dataset[i], elem: undefined }];
            break;
          }
        }

        if (r === null) {
          r = [{ row: -1, item: undefined, elem: activatedRow }];
        }
      }
    }
    return r;
  },

  /**
  * Toggle the current activation state from on to off.
  * @param  {number} idx The row to toggle
  * @returns {void}
  */
  toggleRowActivation(idx) {
    const s = this.settings;
    const dataset = s.treeGrid ? s.treeDepth : s.dataset;
    let row;
    let rowJq;
    let rowIndex;

    if (typeof idx === 'number') {
      row = this.tableBody[0].querySelector(`tr[aria-rowindex="${idx + 1}"]`);
      rowIndex = idx;

      if (this.pagerAPI && s.source && s.indeterminate) {
        const rowIdx = idx + ((this.pagerAPI.activePage - 1) * s.pagesize);
        row = this.tableBody[0].querySelector(`tr[aria-rowindex="${rowIdx + 1}"]`);
      }
    } else {
      rowJq = idx instanceof jQuery ? idx : $(idx);
      row = rowJq[0];
      rowIndex = (s.treeGrid || s.groupable) ?
        this.actualRowIndex(rowJq) : this.dataRowIndex(rowJq);
    }

    if (s.indeterminate && !row) {
      rowJq = this.actualRowNode(rowIndex);
      row = rowJq[0];
    }

    const isActivated = dataset[rowIndex] ? dataset[rowIndex]._rowactivated : false;

    // Toggle it
    if (isActivated) {
      this.deactivateRowNode(rowIndex, dataset);
    } else {
      this.deactivateAllRowNodes(dataset);
      this.activateAllRowNodes(rowIndex, dataset);
    }
  },

  /**
   * Activate given row with mixed selection mode.
   * @private
   * @param  {number} idx The row index to activated
   * @param  {object} dataset Optional data to use
   * @returns {void}
   */
  activateAllRowNodes(idx, dataset) {
    if (typeof idx !== 'number' || idx < 0) {
      return;
    }
    const s = this.settings;

    if (typeof dataset === 'undefined') {
      dataset = s.treeGrid ? s.treeDepth : s.dataset;
    }

    let args = [{ row: idx, item: dataset[idx] }];

    const doRowactivated = () => {
      const rowNodes = s.paging && s.source && s.selectable === 'mixed' ? this.rowNodesByDataIndex(idx).toArray() : this.rowNodes(idx).toArray();
      rowNodes.forEach((rowElem) => {
        rowElem.classList.add('is-rowactivated');
      });
      dataset[idx]._rowactivated = true;
      args = [{ row: idx, item: dataset[idx] }];

      /**
       * Fires after a row is activated in mixed selection mode.
       * @event rowactivated
       * @memberof Datagrid
       * @property {object} event The jquery event object
       * @property {object} args Additional arguments
       * @property {array} args.row An array of selected rows.
       * @property {object} args.item The current sort column.
       */
      this.element.triggerHandler('rowactivated', args);
    };

    if (dataset[idx]) {
      $.when(this.element.triggerHandler('beforerowactivated', args)).done((response) => {
        const isFalse = v => ((typeof v === 'string' && v.toLowerCase() === 'false') ||
          (typeof v === 'boolean' && v === false) ||
          (typeof v === 'number' && v === 0));
        if (!isFalse(response)) {
          doRowactivated();
        }
      });
    }
  },

  /**
  * Deactivate given row with mixed selection mode.
  * @private
  * @param  {number} idx The row index to deactivated
  * @param  {object} dataset Optional data to use
  * @returns {void}
  */
  deactivateRowNode(idx, dataset) {
    if (typeof idx !== 'number' || idx < 0) {
      return;
    }
    const s = this.settings;

    if (typeof dataset === 'undefined') {
      dataset = s.treeGrid ? s.treeDepth : s.dataset;
    }

    if (dataset[idx] && !s.disableRowDeactivation) {
      const rowNodes = this.rowNodes(idx).toArray();
      rowNodes.forEach((row) => {
        row.classList.remove('is-rowactivated');
      });
      delete dataset[idx]._rowactivated;

      /**
       * Fires after a row is deactivated in mixed selection mode.
       * @event rowdeactivated
       * @memberof Datagrid
       * @property {object} event The jquery event object
       * @property {object} args Additional arguments
       * @property {array} args.row An array of selected rows.
       * @property {object} args.item The current sort column.
       */
      this.element.triggerHandler('rowdeactivated', [{ row: idx, item: dataset[idx] }]);
    }
  },

  /**
  * Deactivate all rows with mixed selection mode.
  * @private
  * @param  {object} dataset Optional data to use
  * @returns {void}
  */
  deactivateAllRowNodes(dataset) {
    const s = this.settings;
    let triggerData = null;

    if (typeof dataset === 'undefined') {
      dataset = s.treeGrid ? s.treeDepth : s.dataset;
    }

    // Deselect activated row
    const activated = [].slice.call(this.element[0].querySelectorAll('tr.is-rowactivated'));
    if (activated.length > 0) {
      activated.forEach((row) => {
        row.classList.remove('is-rowactivated');
      });
      const idx = (s.treeGrid || s.groupable) ?
        this.actualRowIndex($(activated)) : this.dataRowIndex($(activated));
      triggerData = { row: idx, item: dataset[idx] };
      if (dataset[idx]) {
        delete dataset[idx]._rowactivated;
      }
    } else {
      // actived row may be filtered or on another page, so check all until find it
      for (let i = 0; i < dataset.length; i++) {
        const data = dataset[i];
        if (data._rowactivated) {
          delete data._rowactivated;
          triggerData = { row: i, item: data };
          break;
        }
      }
    }

    if (triggerData !== null) {
      this.element.triggerHandler('rowdeactivated', [triggerData]);
    }
  },

  /**
  * Toggle the current selection state from on to off.
  * @param  {number} idx The row to select/unselect
  * @returns {void}
  */
  toggleRowSelection(idx) {
    const row = (typeof idx === 'number' ? this.tableBody.find(`tr[aria-rowindex="${idx + 1}"]`) : idx);
    let rowIndex = typeof idx === 'number' ? idx : this.actualRowIndex(row);

    if (this.settings.groupable) {
      rowIndex = this.dataRowIndex(row);
    }

    if (this.settings.selectable === false) {
      return;
    }

    if (this.editor && row.hasClass('is-selected')) {
      return;
    }

    if (this.settings.selectable === 'single' && row.hasClass('is-selected') && !this.settings.disableRowDeselection) {
      this.unselectRow(rowIndex);
      this.displayCounts();
      return this._selectedRows; // eslint-disable-line
    }

    if (row.hasClass('is-selected')) {
      if (!this.settings.disableRowDeselection) {
        this.unselectRow(rowIndex);
      }
    } else {
      this.selectRow(rowIndex);
    }

    this.displayCounts();

    return this._selectedRows; // eslint-disable-line
  },

  /**
  * De-select a selected row.
  * @param  {number} idx The row index
  * @param  {boolean} nosync Do not sync the header
  * @param  {boolean} noTrigger Do not trgger any events
  */
  unselectRow(idx, nosync, noTrigger) {
    const self = this;
    const s = self.settings;
    const rowNode = this.settings.groupable ? this.rowNodesByDataIndex(idx) : this.rowNodes(idx);
    const isServerSideMultiSelect = s.source && s.selectable === 'multiple' && s.allowSelectAcrossPages;
    let checkbox = null;

    if (!rowNode || idx === undefined) {
      return;
    }

    const getSelUniqueRowID = node => (node ? node.uniqueRowID : null);

    // Unselect it
    const unselectNode = function (elem, index) {
      const removeSelected = function (node, selIdx) {
        delete node._selected;
        if (typeof selIdx === 'undefined') {
          selIdx = index;
        }
        for (let i = 0; i < self._selectedRows.length; i++) {
          const selectedUniqueRowID = getSelUniqueRowID(self._selectedRows[i]);
          if (s.source && s.allowSelectAcrossPages && !!selectedUniqueRowID) {
            if (selectedUniqueRowID === self.getUniqueRowID(node)) {
              self._selectedRows.splice(i, 1);
              break;
            }
          } else if (self._selectedRows[i].idx === selIdx) {
            if (isServerSideMultiSelect &&
                self._selectedRows[i].elem && !self._selectedRows[i].elem.is(elem)) {
              continue;
            }
            self._selectedRows.splice(i, 1);
            break;
          }
        }
      };

      const selectClasses = 'is-selected hide-selected-color';
      checkbox = self.cellNode(elem, self.columnIdxById('selectionCheckbox'));
      elem.removeClass(selectClasses).removeAttr('aria-selected');

      if (self.columnIdxById('selectionCheckbox') !== -1) {
        checkbox = self.cellNode(elem, self.columnIdxById('selectionCheckbox'));
        checkbox.find('.datagrid-cell-wrapper .datagrid-checkbox')
          .removeClass('is-checked no-animate')
          .attr('aria-checked', 'false')
          .removeAttr('aria-label');
      }

      if (s.treeGrid) {
        for (let i = 0; i < s.treeDepth.length; i++) {
          if (self.isRowSelected(s.treeDepth[i].node)) {
            if (typeof index !== 'undefined') {
              if (index === s.treeDepth[i].idx - 1) {
                removeSelected(s.treeDepth[i].node);
              }
            } else {
              removeSelected(s.treeDepth[i].node);
            }
          }
        }
      } else {
        const selIdx = elem.length ? self.dataRowIndex(elem) : index;
        let rowData;

        if (selIdx !== undefined && selIdx > -1) {
          rowData = s.dataset[selIdx];
        }
        if (s.groupable) {
          rowData = self.originalDataset[selIdx];
        }
        if (rowData !== undefined) {
          if (s.paging && s.source) {
            removeSelected(rowData, selIdx);
          } else {
            removeSelected(rowData);
          }
        }
      }
    };

    if (s.treeGrid) {
      const level = parseInt(rowNode.attr('aria-level'), 10);
      if (rowNode.is('.datagrid-tree-parent') && s.selectable === 'multiple') {
        // Select node and node-children
        rowNode.add(rowNode.nextUntil(`[aria-level="${level}"]`)).each(function (i) {
          const elem = $(this);
          const index = elem.attr('aria-rowindex') - 1;
          const actualIndex = self.actualPagingRowIndex(index);

          // Allow unselect node if selectChildren is true or only first node
          if (s.selectChildren || (!s.selectChildren && i === 0)) {
            unselectNode(elem, actualIndex);
          }
        });
      } else if (s.selectable === 'siblings') {
        rowNode.parent().find('.is-selected').each(function (i) {
          const elem = $(this);
          const index = elem.attr('aria-rowindex') - 1;
          const actualIndex = self.actualPagingRowIndex(index);

          // Allow unselect node if selectChildren is true or only first node
          if (s.selectChildren || (!s.selectChildren && i === 0)) {
            unselectNode(elem, actualIndex);
          }
        });
      } else { // Single element unselection
        const actualIdx = self.actualPagingRowIndex(idx);
        unselectNode(rowNode, actualIdx);
      }
      self.setNodeStatus(rowNode);
    } else {
      unselectNode(rowNode, idx);
    }

    if (!nosync) {
      self.syncSelectedUI();
    }

    if (!noTrigger) {
      self.element.triggerHandler('selected', [self._selectedRows, 'deselect']);
    }
  },

  /**
   * Set the current status on the row status column
   * @param {HTMLElement} node The node to set the status on
   */
  setNodeStatus(node) {
    const self = this;
    const isMultiselect = self.settings.selectable === 'multiple';
    const s = self.settings;
    const checkbox = self.cellNode(node, self.columnIdxById('selectionCheckbox'));
    let nodes;

    // Not multiselect
    if (!isMultiselect) {
      checkbox.find('.datagrid-cell-wrapper .datagrid-checkbox')
        .removeClass('is-checked is-partial').attr('aria-checked', 'false');

      if (node.is('.is-selected')) {
        checkbox.find('.datagrid-cell-wrapper .datagrid-checkbox')
          .addClass('is-checked').attr('aria-checked', 'true');
      }
      return;
    }

    const setStatus = function (nodeElems, isFirstSkipped) {
      nodeElems.each(function () {
        const nodeToUse = $(this);
        const checkboxToUse = self.cellNode(nodeToUse, self.columnIdxById('selectionCheckbox'));
        const status = self.getSelectedStatus(nodeToUse, isFirstSkipped);

        checkboxToUse.find('.datagrid-cell-wrapper .datagrid-checkbox')
          .removeClass('is-checked is-partial').attr('aria-checked', 'false');

        if (status === 'mixed') {
          checkboxToUse.find('.datagrid-cell-wrapper .datagrid-checkbox')
            .addClass('is-checked is-partial').attr('aria-checked', 'mixed');
        } else if (status) {
          checkboxToUse.find('.datagrid-cell-wrapper .datagrid-checkbox')
            .addClass('is-checked').attr('aria-checked', 'true');
        }
      });
    };

    // Multiselect
    nodes = node.add(node.nextUntil('[aria-level="1"]')).filter('.datagrid-tree-parent');

    // Prevent selecting of parent element when selectChildren is false
    if (s.selectChildren) {
      setStatus(nodes);
    }

    nodes = node;
    if (+node.attr('aria-level') > 1) {
      nodes = nodes.add(node.prevUntil('[aria-level="1"]'))
        .add(node.prevAll('[aria-level="1"]:first'));
    }
    nodes = nodes.filter('.datagrid-tree-parent');

    // Prevent selecting of parent element when selectChildren is false
    if (s.selectChildren) {
      setStatus(nodes);
    }
  },

  /**
  * Get current selection status.
  * @private
  * @param  {object} node The dom element.
  * @returns {object} The status
  */
  getSelectedStatus(node) {
    const s = this.settings;
    let status = false;
    let total = 0;
    let selected = 0;
    let unselected = 0;
    let targetNodes = node.add(node.nextUntil('[aria-level="1"]'));

    if (s.treeGrid && s.selectable === 'multiple') {
      const level = node.attr('aria-level');
      targetNodes = node.add(node.nextUntil(`[aria-level="${level}"]`));
    }

    targetNodes.each(function () {
      total++;
      if ($(this).is('.is-selected')) {
        selected++;
      } else {
        unselected++;
      }
    });

    status = ((total === selected) ? true : ((total === unselected) ? false : 'mixed'));
    return status;
  },

  /**
   * Get the currently selected rows.
   * @returns {array} An array containing the selected rows
   */
  selectedRows() {
    return this._selectedRows;
  },

  /**
   * Set the selected rows by passing the row index or an array of row indexes.
   * @param  {number/array} row A row index or array of row indexes to select.
   * @param  {boolean} nosync Dont sync the header.
   * @param  {boolean} selectAll Internally used.
   * @returns {void}
   */
  selectRows(row, nosync, selectAll) {
    let idx = -1;
    const s = this.settings;
    const isSiblings = s.selectable === 'siblings';
    const dataset = this.getActiveDataset();

    if (typeof row === 'number') {
      row = [row];
    }

    if (!row || row.length === 0) {
      return this._selectedRows;
    }

    if (s.selectable === 'single') {
      // Unselect
      if (this._selectedRows.length) {
        this.unselectRow(this._selectedRows[0].idx, true, true);
      }

      // Select - may be passed array or int
      idx = ((Object.prototype.toString.call(row) === '[object Array]') ? row[0] : row.index());
      this.selectRow(idx, true, true);
    }

    if (s.selectable === 'multiple' || s.selectable === 'mixed' || isSiblings) {
      if (Object.prototype.toString.call(row) === '[object Array]') {
        for (let i = 0; i < row.length; i++) {
          this.selectRow(row[i], true, true);
        }

        if (row.length === 0) {
          for (let j = 0, l = dataset.length; j < l; j++) {
            this.unselectRow(j, true, true);
          }
        }
      } else {
        this.selectRow(row.index(), true, true);
      }
    }

    this.displayCounts();

    if (!nosync) {
      this.syncSelectedUI();
    }
    if (!selectAll) {
      this.element.triggerHandler('selected', [this._selectedRows, 'select']);
    }

    return this._selectedRows;
  },

  /**
   * Returns an array of row numbers for the rows containing the value for the specified field.
   * @param  {string} fieldName The field name to search.
   * @param  {any} value The value to use in search.
   * @returns {array} an array of row numbers.
   */
  findRowsByValue(fieldName, value) {
    const s = this.settings;
    const dataset = this.getActiveDataset();
    let idx = -1;
    const matchedRows = [];
    for (let i = 0, data; i < dataset.length; i++) {
      if (s.groupable) {
        for (let k = 0; k < dataset[i].values.length; k++) {
          idx++;
          data = dataset[i].values[k];
          if (data[fieldName] === value) {
            matchedRows.push(idx);
          }
        }
      } else {
        data = s.treeGrid ? dataset[i].node : dataset[i];
        if (data[fieldName] === value) {
          matchedRows.push(i);
        }
      }
    }
    return matchedRows;
  },

  /**
  * Sets the row status
  * @param {object} idx The index of the row to add status to.
  * @param {string} status The status type 'error', 'info' ect
  * @param {object} tooltip The information for the message/tooltip
  */
  rowStatus(idx, status, tooltip) {
    const arrayToUse = this.getActiveDataset();

    if (!status) {
      delete arrayToUse[idx].rowStatus;
      this.updateRow(idx);
      return;
    }

    if (/dirty/.test(status)) {
      return;
    }

    if (!arrayToUse[idx]) {
      return;
    }

    arrayToUse[idx].rowStatus = {};
    const rowStatus = arrayToUse[idx].rowStatus;

    rowStatus.icon = status;
    status = status.charAt(0).toUpperCase() + status.slice(1);
    status = status.replace('-progress', 'Progress');
    rowStatus.text = Locale.translate(status);

    tooltip = tooltip ? tooltip.charAt(0).toUpperCase() + tooltip.slice(1) : rowStatus.text;
    rowStatus.tooltip = tooltip;

    this.updateRow(idx);
    this.setupTooltips(true);
  },

  /**
  * Get the column object by id
  * @param  {number} id The column id to find
  * @returns {object} The corresponding column.
  */
  columnById(id) {
    return $.grep(this.settings.columns, e => e.id === id);
  },

  /**
  * Get the column index from the col's id
  * @param  {number} id The column id to find
  * @returns {object} The corresponding columns current position.
  */
  columnIdxById(id) {
    const cols = this.settings.columns;
    let idx = -1;

    for (let i = 0; i < cols.length; i++) {
      if (cols[i].id === id) {
        idx = i;
        break;
      }
    }
    return idx;
  },

  /**
  * Handle all keyboard behavior
  * @private
  * @returns {void}
  */
  handleKeys() {
    const self = this;
    const checkbox = $('th .datagrid-checkbox', self.headerRow);

    // Handle header navigation
    self.element.on('keydown.datagrid', 'th', function (e) {
      const key = e.which || e.keyCode || e.charCode || 0;
      const th = $(this);
      const index = self.columnIdxById(th.attr('data-column-id'));
      const last = self.visibleColumns().length - 1;
      let triggerEl;
      let move;

      if ($(e.target).closest('.popupmenu').length > 0) {
        return;
      }

      // Enter or Space
      if (key === 13 || key === 32) {
        triggerEl = (self.settings.selectable === 'multiple' && index === 0) ? $('.datagrid-checkbox', th) : th;
        triggerEl.trigger('click.datagrid').focus();
        const selectionCheckbox = (triggerEl[0].dataset.columnId === 'selectionCheckbox' || triggerEl.prevObject[0].dataset.columnId === 'selectionCheckbox');

        if ((self.settings.selectable === 'multiple' || this.settings.selectable === 'mixed') && selectionCheckbox) {
          checkbox
            .addClass('is-checked')
            .removeClass('is-partial')
            .attr('aria-checked', 'true');

          if (self.recordCount === self._selectedRows.length) {
            if (self.settings.selectAllCurrentPage) {
              self.unSelectAllRowsCurrentPage();
            } else {
              self.unSelectAllRows();
            }
            return;
          }

          if (self.settings.selectAllCurrentPage) {
            self.selectAllRowsCurrentPage();
          } else {
            self.selectAllRows();
          }
        }

        if (key === 32) { // Prevent scrolling with space
          e.preventDefault();
        }
      }

      // Press Home, End, Left and Right arrow to move to first, last, previous or next
      if ([35, 36, 37, 39].indexOf(key) !== -1) {
        move = index;

        // Home, End or Ctrl/Meta + Left/Right arrow to move to the first or last
        if (/35|36/i.test(key) || ((e.ctrlKey || e.metaKey) && /37|39/i.test(key))) {
          if (Locale.isRTL()) {
            move = (key === 36 || ((e.ctrlKey || e.metaKey) && key === 37)) ? last : 0;
          } else {
            move = (key === 35 || ((e.ctrlKey || e.metaKey) && key === 39)) ? last : 0;
          }
        } else if (Locale.isRTL()) { // Left and Right arrow
          move = key === 39 ? (index > 0 ? index - 1 : index) : (index < last ? index + 1 : last);
        } else {
          move = key === 37 ? (index > 0 ? index - 1 : index) : (index < last ? index + 1 : last);
        }
        // Update active cell
        self.activeCell.cell = move;

        // Making moves
        th.removeAttr('tabindex').removeClass('is-active');
        e.preventDefault();
      }

      // Down arrow
      if (key === 40) {
        th.removeAttr('tabindex');
        self.activeCell.node = self.cellNode(0, self.settings.groupable ? 0 : self.activeCell.cell).attr('tabindex', '0').focus();
        e.preventDefault();
      }
    });

    // Handle Editing / Keyboard
    self.element.on('keydown.datagrid', 'td, input', (e) => { //eslint-disable-line
      const key = e.which || e.keyCode || e.charCode || 0;
      let handled = false;

      // F2 - toggles actionableMode "true" and "false"
      // Force to not toggle, if "inlineMode: true"
      if (key === 113 && !this.inlineMode) {
        self.settings.actionableMode = !self.settings.actionableMode;
        handled = true;
      }

      if (handled) {
        e.preventDefault();
        e.stopPropagation();
        return handled;
      }
    });

    // Press PageUp or PageDown to open the previous or next page and set focus to the first row.
    // Press Alt+Up or Alt+Down to set focus to the first or last row on the current page.
    // Press Alt+PageUp or Alt+PageDown to open the first or last page and
    // set focus to the first row.

    // Handle rest of the keyboard
    self.element.on('keydown.datagrid', 'td', function (e) {
      const key = e.which || e.keyCode || e.charCode || 0;
      let handled = false;
      const target = $(e.target);
      const isRTL = Locale.isRTL();
      let node = self.activeCell.node;
      const rowNode = $(this).parent();
      const prevRow = rowNode.prevAll(':not(.is-hidden, .datagrid-expandable-row)').first();
      const nextRow = rowNode.nextAll(':not(.is-hidden, .datagrid-expandable-row)').first();
      let row = self.activeCell.row;
      let cell = self.activeCell.cell;
      const col = self.columnSettings(cell);
      const isGroupRow = rowNode.is('.datagrid-rowgroup-header, .datagrid-rowgroup-footer');
      const item = self.settings.dataset[self.dataRowIndex(rowNode)];
      const visibleRows = self.tableBody.find('tr:visible');
      const getVisibleRows = function (index) {
        const visibleRow = visibleRows.filter(`[aria-rowindex="${index + 1}"]`);
        if (visibleRow.is('.datagrid-rowgroup-header')) {
          return visibleRow.index();
        }
        return self.dataRowIndex(visibleRow);
      };
      if (!node.length) {
        self.activeCell.node = self.cellNode(row, cell);
        node = self.activeCell.node;
      }

      const getGroupCell = function (currentCell, lastCell, prev) {
        const n = self.activeCell.groupNode || node;
        let nextCell = currentCell + (prev ? -1 : +1);

        if (nextCell > lastCell) {
          nextCell = prev ?
            n.prevAll(':visible').last() : n.nextAll(':visible').last();
        } else {
          nextCell = prev ?
            n.prevAll(':visible').first() : n.nextAll(':visible').first();
        }
        return nextCell;
      };

      const getNextVisibleCell = function (currentCell, lastCell, prev) {
        if (isGroupRow) {
          return getGroupCell(currentCell, lastCell, prev);
        }
        let nextCell = currentCell + (prev ? -1 : +1);
        if (nextCell > lastCell) {
          return lastCell;
        }
        while (self.settings.columns[nextCell] && self.settings.columns[nextCell].hidden) {
          nextCell = prev ? nextCell - 1 : nextCell + 1;
        }
        return nextCell;
      };

      const isSelectionCheckbox = !!($('.datagrid-selection-checkbox', node).length);
      const lastRow = visibleRows.last();
      const lastCell = self.settings.columns.length - 1;

      if (self.settings.onKeyDown) {
        const response = (isCancelled) => {
          if (!isCancelled) {
            e.stopPropagation();
            e.preventDefault();
          }
        };

        const args = { activeCell: self.activeCell, row, cell };
        const ret = self.settings.onKeyDown(e, args, response);
        if (ret === false || !response) {
          e.stopPropagation();
          e.preventDefault();
          return;
        }
      }

      // Tab, Left, Up, Right and Down arrow keys.
      if ([9, 37, 38, 39, 40].indexOf(key) !== -1) {
        if (target.closest('.code-block').length &&
          !(key === 9 && e.shiftKey && self.getFocusables(node).index === 0)) {
          return;
        }
        if (key !== 9) {
          if (target.is('.code-block-actions')) {
            return;
          }
          if (target.closest('.popupmenu.is-open').closest('.popupmenu-wrapper').prev().is('.code-block-actions')) {
            return;
          }
        }
      }

      // Tab, Left and Right arrow keys.
      if ([9, 37, 39].indexOf(key) !== -1) {
        if (key === 9 && !self.settings.actionableMode) {
          return;
        }

        if (key !== 9 && e.altKey) {
          // [Alt + Left/Right arrow] to move to the first or last cell on the current row.
          cell = ((key === 37 && !isRTL) || (key === 39 && isRTL)) ? 0 : lastCell;
          self.setActiveCell(row, cell);
        } else if (!self.quickEditMode || (key === 9)) {
          // Handle `shift + tab` for code block formatter, it use sometime `.code-block-actions`
          if (key === 9 && e.shiftKey && target.is('.code-block-actions')) {
            self.focusNextPrev('prev', node);
          } else {
            if ((!isRTL && (key === 37 || key === 9 && e.shiftKey)) || // eslint-disable-line
                (isRTL && (key === 39 || key === 9))) { // eslint-disable-line
              cell = getNextVisibleCell(cell, lastCell, true);
            } else {
              cell = getNextVisibleCell(cell, lastCell);
            }
          }

          if (cell === -1 && !self.settings.actionableMode) {
            return;
          }

          if (cell === -1 && self.settings.actionableMode) {
            row--;
            cell = lastCell;

            if (row === -1) {
              return;
            }
          }

          if (cell === lastCell && lastCell === self.activeCell.cell &&
            self.settings.actionableMode) {
            row++;
            cell = 0;

            if (row === self.visibleRowCount) {
              return;
            }
          }

          if (cell instanceof jQuery) {
            self.setActiveCell(cell);
          } else {
            self.setActiveCell(row, cell);
          }

          if (self.settings.actionableMode) {
            self.makeCellEditable(self.activeCell.rowIndex, cell, e);
            if (self.containsTextField(node) && self.containsTriggerField(node)) {
              self.quickEditMode = true;
            }
          }

          self.quickEditMode = false;
          handled = true;
        }
      }

      // Up arrow key
      if (key === 38 && !self.quickEditMode) {
        // Press [Control + Up] arrow to move to the first row on the first page.
        if (e.altKey || e.metaKey) {
          const firstRow = getVisibleRows(0);
          self.setActiveCell(firstRow, cell);
          handled = true;
        } else { // Up arrow key to navigate by row.
          if (row === 0 && !prevRow.is('.datagrid-rowgroup-header')) {
            node.removeAttr('tabindex');
            self.element.find('th').eq(cell).attr('tabindex', '0').focus();
            return;
          }
          self.setActiveCell(prevRow, cell);
          handled = true;
        }
      }

      // Down arrow key
      if (key === 40 && !self.quickEditMode) {
        // Press [Control + Down] arrow to move to the last row on the last page.
        if (e.altKey || e.metaKey) {
          self.setActiveCell(lastRow, cell);
          handled = true;
        } else { // Down arrow key to navigate by row.
          self.setActiveCell(nextRow, cell);
          handled = true;
        }
      }

      // Press (Control + Spacebar) to announce the current row when using a screen reader.
      if (key === 32 && e.ctrlKey && node) {
        let string = '';
        row = node.closest('tr');

        row.children().each(function () {
          const cellNode = $(this);
          string += `${cellNode.text()} `;
        });

        $('body').toast({ title: '', audibleOnly: true, message: string });
        handled = true;
      }

      // Press Home or End to move to the first or last cell on the current row.
      if (key === 36) {
        self.setActiveCell(row, 0);
        handled = true;
      }

      // Home to Move to the end of the current row
      if (key === 35) {
        self.setActiveCell(row, lastCell);
        handled = true;
      }

      // End to Move to last row of current cell
      if (key === 34) {
        self.setActiveCell(lastRow, cell);
        handled = true;
      }

      // End to Move to first row of current cell
      if (key === 33) {
        self.setActiveCell(getVisibleRows(0), cell);
        handled = true;
      }

      // For mode 'Selectable':
      // Press Space to toggle row selection, or click to activate using a mouse.
      if (key === 32 && (!self.settings.editable || isSelectionCheckbox)) {
        row = node.closest('tr');

        if (target.closest('.datagrid-row-detail').length === 1) {
          return;
        }
        e.preventDefault();

        // Toggle datagrid-expand with Space press
        const btn = target.find('.datagrid-expand-btn, .datagrid-drilldown');
        if (btn && btn.length) {
          btn.trigger('click.datagrid');
          e.preventDefault();
          return;
        }

        if ((self.settings.selectable === 'multiple' || self.settings.selectable === 'mixed') && e.shiftKey) {
          self.selectRowsBetweenIndexes([self.lastSelectedRow, row.attr('aria-rowindex') - 1]);
        } else {
          self.toggleRowSelection(row);
        }
      }

      // For Editable mode - press Enter or Space to edit or toggle a cell,
      // or click to activate using a mouse.
      if (self.settings.editable && key === 32) {
        if (!self.editor) {
          self.makeCellEditable(self.activeCell.rowIndex, cell, e);
        }
      }

      // Action button from Formatters.Actions
      if (key === 13 && node.is('.has-btn-actions')) {
        const btnAction = node.find('.btn-actions');
        if (btnAction.length) {
          btnAction.trigger('click');
        }
      }

      // if column have click function to fire [ie. action button]
      if (key === 13 && col.click && typeof col.click === 'function') {
        if (!node.hasClass('is-cell-readonly')) {
          col.click(e, [{ row, cell, item, originalEvent: e }]);
        }
      }

      if (self.settings.editable && key === 13) {
        // Allow shift to add a new line
        if (target.is('textarea') && e.shiftKey) {
          return;
        }
        // Allow the menu buttons
        if (target.is('.btn-menu') || target.closest('.popupmenu.is-open').length) {
          return;
        }

        if (self.editor) {
          self.quickEditMode = false;
          self.commitCellEdit();
          self.setNextActiveCell(e);
        } else {
          self.makeCellEditable(self.activeCell.rowIndex, cell, e);
          if (self.containsTextField(node) && self.containsTriggerField(node)) {
            self.quickEditMode = true;
          }
        }
        handled = true;
      }

      // Any printable character - well make it editable
      if ([9, 13, 32, 35, 36, 37, 38, 39, 40, 113].indexOf(key) === -1 &&
        !e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && self.settings.editable) {
        if (!self.editor) {
          self.makeCellEditable(self.activeCell.rowIndex, cell, e);
        }
      }

      // If multiSelect or mixedSelect is enabled, press Control+A to toggle select all rows
      if ((self.settings.selectable === 'multiple' || self.settings.selectable === 'mixed') && !self.editor && ((e.ctrlKey || e.metaKey) && key === 65)) {
        checkbox
          .addClass('is-checked')
          .removeClass('is-partial')
          .attr('aria-checked', 'true');

        if (self.recordCount === self._selectedRows.length) {
          if (self.settings.selectAllCurrentPage) {
            self.unSelectAllRowsCurrentPage();
          } else {
            self.unSelectAllRows();
          }
          return;
        }

        if (self.settings.selectAllCurrentPage) {
          self.selectAllRowsCurrentPage();
        } else {
          self.selectAllRows();
        }
        handled = true;
      }

      if (handled) {
        e.preventDefault();
        e.stopPropagation();
        return false; // eslint-disable-line
      }
    });
  },

  /**
   * Get focusable elements in given node
   * @param  {object} node The node to get focusable elements
   * @returns {object} array of focusable elements and current index
   */
  getFocusables(node) {
    const focusables = $(':focusable', node);
    return {
      elements: focusables,
      index: focusables.index($(':focus'))
    };
  },

  /**
   * Set focus to next/prev focusable element in given node
   * @param  {string} opt The element to set focus
   * @param  {object} node The node to get focusable element
   * @returns {void}
   */
  focusNextPrev(opt, node) {
    if (node && typeof opt === 'string') {
      opt = opt.toLowerCase();
      const focusables = this.getFocusables(node);
      const elements = focusables.elements;
      const len = elements.length;
      let index = focusables.index;
      if (/\b(next|prev)\b/g.test(opt)) {
        index = (opt === 'next') ?
          ((index + 1) >= len ? 0 : (index + 1)) :
          ((index - 1) < 0 ? len : (index - 1));
        elements.eq(index).focus();
      }
    }
  },

  /**
   * Does the column editor have a text field.
   * @private
   * @param  {object} container The dom element
   * @returns {boolean} If it does or not
   */
  containsTextField(container) {
    const noTextTypes = ['image', 'button', 'submit', 'reset', 'checkbox', 'radio'];
    let selector = 'textarea, input';
    const l = noTextTypes.length;
    let i;

    selector += l ? ':not(' : '';
    for (i = 0; i < l; i++) {
      selector += `[type=${noTextTypes[i]}],`;
    }
    selector = l ? (`${selector.slice(0, -1)})`) : '';

    return !!($(selector, container).length);
  },

  /**
   * Does the column editor have a picker/trigger field.
   * @private
   * @param  {object} container The dom element
   * @returns {boolean} If it does or not
   */
  containsTriggerField(container) {
    const selector = '.dropdown, .datepicker, .lookup';
    return !($(selector, container).length);
  },

  /**
   * Returns if the row has been disabled.
   * @param  {number} row The row index.
   * @returns {boolean} eturns true if the row is disabled
   */
  isRowDisabled(row) {
    if (this.settings.isRowDisabled && typeof this.settings.isRowDisabled === 'function') {
      const rowNode = this.rowNodes(row);

      if (rowNode.attr('aria-disabled') === 'true') {
        return true;
      }
    }
    return false;
  },

  /**
   * Is a specific row/cell editable?
   * @param  {number} row The row index
   * @param  {number} cell The cell index
   * @returns {boolean} returns true if the cell is editable
   */
  isCellEditable(row, cell) {
    if (!this.settings.editable) {
      return false;
    }

    const col = this.columnSettings(cell);
    if (col.readonly) {
      return false;
    }

    if (this.isRowDisabled(row) || !this.activeCell.node) {
      return false;
    }

    // Check if cell is editable via hook function
    const cellNode = this.activeCell.node.find('.datagrid-cell-wrapper');
    const cellValue = (cellNode.text() ? cellNode.text() :
      this.fieldValue(this.settings.dataset[row], col.field));

    if (col.isEditable) {
      let rowData = this.settings.dataset[row];
      if (this.settings.treeDepth && this.settings.treeDepth[row]) {
        rowData = this.settings.treeDepth[row].node;
      }
      const canEdit = col.isEditable(row, cell, cellValue, col, rowData, this, 'is-editable');

      if (!canEdit) {
        return false;
      }
    }

    if (!col.editor) {
      return false;
    }

    return true;
  },

  /**
   * Invoked in three cases
   * 1) a row click
   * 2) keyboard and enter
   * 3) In actionable mode and tabbing
   * @private
   * @param  {number} row The row index
   * @param  {number} cell The cell index
   * @param  {object} event The event information.
   * @returns {boolean} returns true if the cell is editable
   */
  makeCellEditable(row, cell, event) {
    if (this.activeCell.node.closest('tr').hasClass('datagrid-summary-row')) {
      return;
    }

    // Already in edit mode
    const cellNode = this.activeCell.node.find('.datagrid-cell-wrapper');
    const cellParent = cellNode.parent('td');
    const treeNode = $('.datagrid-tree-node', cellNode).length > 0;
    const treeExpandBtn = $('.datagrid-expand-btn', cellNode).length > 0;

    if (cellParent.hasClass('is-editing') || cellParent.hasClass('is-editing-inline')) {
      return false; // eslint-disable-line
    }

    // Commit Previous Edit
    if (this.editor && this.editor.input) {
      this.commitCellEdit();
    }

    // Locate the Editor
    const col = this.columnSettings(cell);

    // Select the Rows if the cell is editable
    if (!col.editor) {
      if (event.keyCode === 32 && !$(event.currentTarget).find('.datagrid-selection-checkbox').length) {
        this.toggleRowSelection(this.activeCell.node.closest('tr'));
      }
      return false; // eslint-disable-line
    }

    const thisRow = this.actualRowNode(row);
    const idx = this.settings.treeGrid ?
      this.actualPagingRowIndex(this.actualRowIndex(thisRow)) :
      this.dataRowIndex(thisRow);
    const rowData = this.rowData(idx);

    const isEditor = $('.is-editor', cellParent).length > 0;
    const isPlaceholder = $('.is-placeholder', cellNode).length > 0;
    let cellValue = (cellNode.text() ?
      cellNode.text() : this.fieldValue(rowData, col.field));

    if (isEditor || isPlaceholder) {
      cellValue = this.fieldValue(rowData, col.field);
    }

    if (!this.isCellEditable(idx, cell)) {
      return false; // eslint-disable-line
    }

    if (treeExpandBtn || treeNode) {
      if (treeExpandBtn) {
        cellValue = $('> span', cellNode).text();
      }
      if (typeof cellValue === 'string') {
        cellValue = cellValue.replace(/^\s/, '');
      }
    }

    // In Show Editor mode the editor is on form already
    if (!col.inlineEditor) {
      if (isEditor) {
        cellNode.css({ position: 'static', height: cellNode.outerHeight() });
      }
      cellParent.addClass('is-editing');

      cellNode.empty();
    } else {
      cellParent.addClass('is-editing-inline');
    }

    cellValue = xssUtils.sanitizeConsoleMethods(cellValue);

    /**
    * Fires before a cell goes into edit mode. Giving you a chance to adjust column settings.
    * @event beforeentereditmode
    * @memberof Datagrid
    * @property {object} event The jquery event object
    * @property {object} args Additional arguments
    * @property {number} args.row An array of selected rows.
    * @property {number} args.cell An array of selected rows.
    * @property {object} args.item The current sort column.
    * @property {HTMLElement} args.target The cell html element that was entered.
    * @property {any} args.value The cell value.
    * @property {object} args.column The column object
    * @property {object} args.editor The editor object.
    */
    this.element.triggerHandler('beforeentereditmode', [{ row: idx, cell, item: rowData, target: cellNode, value: cellValue, column: col, editor: this.editor }]);

    if (this.visibleColumns().length === 1) {
      cellParent.addClass('has-singlecolumn');
    }

    this.editor =  new col.editor(idx, cell, cellValue, cellNode, col, event, this, rowData); // eslint-disable-line
    this.editor.row = idx;
    this.editor.cell = cell;

    // Certain types we just use contents
    const formatterStr = col.formatter?.toString() || '';
    if (formatterStr.indexOf('function Badge') === 0 ||
      formatterStr.indexOf('function Alert') === 0) {
      this.editor.useValue = true;
    }

    if (this.settings.onEditCell) {
      this.settings.onEditCell(this.editor);
    }

    if (this.editor.useValue) {
      cellValue = this.fieldValue(rowData, col.field);
    }
    this.editor.val(cellValue);

    // Set original data for trackdirty
    if (this.settings.showDirty) {
      let originalVal = cellValue;

      if (originalVal === '' && /checkbox|favorite/i.test(this.getEditorName(this.editor))) {
        originalVal = false;
      }

      const data = { originalVal, isDirty: false };
      this.addToDirtyArray(idx, cell, data);
    }

    this.editor.focus();

    // Make sure the first keydown gets captured and trigger the dropdown
    if (this.editor?.input.is('.dropdown') && event.keyCode && ![9, 13, 32, 37, 38, 39, 40].includes(event.keyCode)) {
      const dropdownApi = this.editor.input.data('dropdown');
      dropdownApi.handleAutoComplete(event);
    }

    /**
    * Fires after a cell goes into edit mode.
    * @event entereditmode
    * @memberof Datagrid
    * @property {object} event The jquery event object
    * @property {object} args Additional arguments
    * @property {number} args.row An array of selected rows.
    * @property {number} args.cell An array of selected rows.
    * @property {object} args.item The current sort column.
    * @property {HTMLElement} args.target The cell html element that was entered.
    * @property {any} args.value The cell value.
    * @property {object} args.column The column object
    * @property {object} args.editor The editor object.
    */
    this.element.triggerHandler('entereditmode', [{ row: idx, cell, item: rowData, target: cellNode, value: cellValue, column: col, editor: this.editor }]);

    return true;  //eslint-disable-line
  },

  /**
   * Get the data for a row node
   * @private
   * @param {object} rowIdx The jquery row node.
   * @returns {object} The row of data from the dataset.
   */
  rowData(rowIdx) {
    if (this.settings.groupable) {
      return this.originalDataset[rowIdx];
    }
    return this.settings.treeGrid ?
      this.settings.treeDepth[rowIdx].node :
      this.settings.dataset[rowIdx];
  },

  /**
   * Commit the cell thats currently in edit mode.
   * @param {boolean} isCallback Indicates a call back so beforeCommitCellEdit is not called.
   */
  commitCellEdit(isCallback) {
    if (!this.editor) {
      return;
    }

    const input = this.editor.input;
    let newValue;
    let cellNode;
    const editorName = this.getEditorName(this.editor);
    const isEditor = editorName === 'editor';
    const isFileupload = editorName === 'fileupload';
    const isUseActiveRow = !(input.is('.timepicker, .datepicker, .lookup, .spinbox, .colorpicker'));

    // Editor.getValue
    if (typeof this.editor.val === 'function') {
      newValue = this.editor.val();
    }

    if (isEditor) {
      cellNode = this.editor.td;
    } else if (isFileupload) {
      if (this.editor.status === 'clear') {
        newValue = '';
      } else if (this.editor.status === 'init' || this.editor.status === 'cancel') {
        newValue = this.editor.originalValue;
      }
      // Fix: Not sure why, but `input.closest('td')` did not work
      cellNode = this.tableBody.find(`#${input.attr('id')}`).closest('td');
      newValue = xssUtils.escapeHTML(newValue);
    } else {
      cellNode = input.closest('td');
      newValue = xssUtils.escapeHTML(newValue);
    }

    let rowIndex;
    let dataRowIndex;
    if (this.settings.source !== null && isUseActiveRow) {
      rowIndex = this.activeCell.rowIndex;
      dataRowIndex = this.activeCell.dataRow;
    } else {
      rowIndex = this.actualRowIndex(cellNode.parent());
      dataRowIndex = this.dataRowIndex(cellNode.parent());
    }

    const cell = cellNode.attr('aria-colindex') - 1;
    const col = this.columnSettings(cell);
    const rowData = this.settings.treeGrid ? this.settings.treeDepth[dataRowIndex].node :
      this.getActiveDataset()[dataRowIndex];
    let oldValue = this.fieldValue(rowData, col.field);

    if (col.beforeCommitCellEdit && !isCallback) {
      const vetoCommit = col.beforeCommitCellEdit({
        cell,
        row: dataRowIndex,
        item: rowData,
        editor: this.editor,
        api: this
      });

      if (vetoCommit === false) {
        return;
      }
    }

    if (!this.editor) {
      return;
    }

    // Sanitize console methods
    oldValue = xssUtils.sanitizeConsoleMethods(oldValue);
    newValue = xssUtils.sanitizeConsoleMethods(newValue);

    // Format Cell again
    const isInline = cellNode.hasClass('is-editing-inline');
    cellNode.removeClass('is-editing is-editing-inline has-singlecolumn');

    // Editor.destroy
    this.editor.destroy();
    this.editor = null;

    // Save the Cell Edit back to the data set
    this.updateCellNode(
      this.settings.groupable ? dataRowIndex : rowIndex,
      cell,
      newValue,
      false,
      isInline
    );
    const value = this.fieldValue(rowData, col.field);

    /**
    * Fires after a cell goes out of edit mode.
    * @event exiteditmode
    * @memberof Datagrid
    * @property {object} event The jquery event object
    * @property {object} args Additional arguments
    * @property {number} args.row An array of selected rows.
    * @property {number} args.cell An array of selected rows.
    * @property {object} args.item The current sort column.
    * @property {HTMLElement} args.target The cell html element that was entered.
    * @property {any} args.value The cell value.
    * @property {any} args.oldValue The previous cell value.
    * @property {object} args.column The column object
    * @property {object} args.editor The editor object.
    */
    this.element.triggerHandler('exiteditmode', [{
      row: rowIndex,
      cell,
      item: rowData,
      target: cellNode,
      value,
      oldValue,
      column: col,
      editor: this.editor
    }]);
  },

  /**
   * Run validation for the column, for a particular cell.
   * @param  {number} row The row index
   * @param  {number} cell The cell index
   */
  validateCell(row, cell) {
    const self = this;
    const column = this.columnSettings(cell);
    const validate = column.validate;
    let validationType;

    if (!validate) {
      return;
    }

    let dfd;
    const dfds = [];
    const rules = column.validate.split(' ');
    const validator = $.fn.validation;
    const cellValue = this.fieldValue(this.settings.dataset[row], column.field);
    const messages = [];
    let messageText = '';
    let i;

    function manageResult(result, displayMessage, ruleName, dfrd) {
      const rule = validator.rules[ruleName];

      validationType = $.fn.validation.ValidationTypes[rule.type] ||
        $.fn.validation.ValidationTypes.error;
      messageText = '';

      if (messages[validationType.type]) {
        messageText = messages[validationType.type];
      }

      if (!result && displayMessage) {
        if (messageText) {
          messageText = ((/^\u2022/.test(messageText)) ? '' : '\u2022 ') + messageText;
          messageText += `<br/>${'\u2022 '}${rule.message}`;
        } else {
          messageText = rule.message;
        }

        messages[validationType.type] = messageText;
      }

      dfrd.resolve();
    }

    for (i = 0; i < rules.length; i++) {
      const rule = validator.rules[rules[i]];
      const gridInfo = { row, cell, item: this.settings.dataset[row], column, grid: self };

      dfd = $.Deferred();

      if (rule.async) {
        rule.check(cellValue, $('<input>').val(cellValue), gridInfo, manageResult, dfd);
      } else {
        manageResult(rule.check(cellValue, $('<input>').val(cellValue), gridInfo), true, rules[i], dfd);
      }
      dfds.push(dfd);
    }

    $.when(...dfds).then(() => {
      const validationTypes = $.fn.validation.ValidationTypes;
      for (const props in validationTypes) {  // eslint-disable-line
        messageText = '';
        validationType = validationTypes[props];
        if (messages[validationType.type]) {
          messageText = messages[validationType.type];
        }
        if (messageText !== '') {
          self.showCellError(row, cell, messageText, validationType.type);
          const rowNode = this.dataRowNode(row);
          self.element.trigger(`cell${validationType.type}`, { row, cell, message: messageText, target: this.cellNode(rowNode, cell), value: cellValue, column });
        } else {
          self.clearCellError(row, cell, validationType.type);
        }
      }
    });
  },

  /**
  * Show the cell errors.
  * @param  {number} row The row index.
  * @param  {number} cell The cell index.
  * @param  {string} message The message text.
  * @param  {string} type The message type (infor, error, alert )
  * @returns {void}
  */
  showCellError(row, cell, message, type) {
    const rowNode = this.dataRowNode(row);
    const node = this.cellNode(rowNode, cell);

    // clear the table nonVisibleCellErrors for the row and cell
    this.clearNonVisibleCellErrors(row, cell, type);

    if (!node.length) {
      // Store the nonVisibleCellError
      this.nonVisibleCellErrors.push({ row, cell, message, type });
      this.showNonVisibleCellErrors();
      return;
    }

    // Add icon and classes
    node.addClass(type).attr(`data-${type}message`, message);

    // Add and show tooltip
    let icon = node.find(`.icon-${type}`);
    if (!icon.length) {
      const wrapper = node.find('.datagrid-cell-wrapper');
      wrapper.append($($.createIcon({ classes: [`icon-${type}`], icon: type })));
      icon = node.find(`.icon-${type}`);

      const tooltip = {
        forced: true,
        placement: 'bottom',
        content: message,
        isError: type === 'error' || type === 'dirtyerror',
        wrapper: icon
      };
      this.cacheTooltip(icon, tooltip);
      this.setupTooltips(false, true);
    }
  },

  /**
   * Show all non visible cell errors
   * @private
   * @returns {void}
   */
  showNonVisibleCellErrors() {
    // Create empty toolbar
    if (!this.toolbar) {
      this.settings.toolbar = { title: ' ' };
      this.appendToolbar();
    }

    if (this.nonVisibleCellErrors.length === 0) {
      // remove table-error when not required
      if (this.toolbar && this.toolbar.parent().find('.table-errors').length === 1) {
        this.toolbar.parent().find('.table-errors').remove();
      }
    } else {
      // process via type
      for (const props in $.fn.validation.ValidationTypes) {  // eslint-disable-line
        const validationType = $.fn.validation.ValidationTypes[props].type;
        const errors = $.grep(this.nonVisibleCellErrors, error => error.type === validationType);
        this.showNonVisibleCellErrorType(errors, validationType);
      }
    }
  },

  /**
   * Show all non visible cell errors, for a given message/validation type.
   * @private
   * @param  {array} nonVisibleCellErrors An array of non visible cells, in error state.
   * @param  {string} type The message type to show
   */
  showNonVisibleCellErrorType(nonVisibleCellErrors, type) {
    let messages;
    let tableerrors;
    let icon;
    let i;
    const nonVisiblePages = [];
    const validationType = $.fn.validation.ValidationTypes[type] ||
      $.fn.validation.ValidationTypes.error;

    if (this.toolbar.parent().find('.table-errors').length === 1) {
      tableerrors = this.toolbar.parent().find('.table-errors');
    }

    if (nonVisibleCellErrors.length === 0) {
      // clear the displayed message
      if (tableerrors && tableerrors.length) {
        icon = tableerrors.find(`.icon-${validationType.type}`);
        this.hideTooltip();
        tableerrors.find(`.icon-${validationType.type}`).remove();
      }
      return;
    }

    // Process message type, so it displays one message per page
    for (i = 0; i < nonVisibleCellErrors.length; i++) {
      const page = Math.floor((nonVisibleCellErrors[i].row + this.settings.pagesize) /
        this.settings.pagesize);
      if ($.inArray(page, nonVisiblePages) === -1) {
        nonVisiblePages.push(page);
      }
    }

    for (i = 0; i < nonVisiblePages.length; i++) {
      messages = `${(messages ? `${messages}<br>` : '') + Locale.translate(validationType.pagingMessageID)} ${nonVisiblePages[i]}`;
    }

    if (this.toolbar.parent().find('.table-errors').length === 0) {
      tableerrors = $('<div class="table-errors"></div>');
    }
    icon = tableerrors.find(`.icon-${type}`);
    if (!icon.length) {
      tableerrors.append($($.createIcon({ classes: [`icon-${type}`], icon: type })));
      icon = tableerrors.find(`.icon-${type}`);
    }

    if (this.element.hasClass('has-toolbar')) {
      // Add Error to the Toolbar
      this.toolbar.children('.title').append(tableerrors);
    }

    this.cacheTooltip(icon, {
      forced: true,
      placement: 'bottom',
      content: messages,
      isError: type === 'error' || type === 'dirtyerror',
      wrapper: icon
    });
    this.setupTooltips(false, true);
  },

  /**
   * Clear all error for a given cell in a row
   * @param {number} row The row index.
   * @param {number} cell The cell index.
   * @returns {void}
   */
  clearAllCellError(row, cell) {
    const validationTypes = $.fn.validation.ValidationTypes;
    for (const props in validationTypes) {  // eslint-disable-line
      const validationType = validationTypes[props];
      this.clearCellError(row, cell, validationType.type);
    }
  },

  /**
   * Clear a cell with an error of a given type
   * @param {number} row The row index.
   * @param {number} cell The cell index.
   * @param {string} type of error.
   * @returns {void}
   */
  clearCellError(row, cell, type) {
    this.clearNonVisibleCellErrors(row, cell, type);
    const rowNode = this.dataRowNode(row);
    const node = this.cellNode(rowNode, cell);

    if (!node.length) {
      return;
    }

    this.clearNodeErrors(node, type);
  },

  /**
   * Clear a non visible cells from errors of a given type
   * @private
   * @param {number} row The row index.
   * @param {number} cell The cell index.
   * @param {string} type of error.
   * @returns {void}
   */
  clearNonVisibleCellErrors(row, cell, type) {
    if (!this.nonVisibleCellErrors.length) {
      return;
    }

    if (this.toolbar && this.toolbar.parent() && this.toolbar.parent().find('.table-errors').length > 0) {
      const icon = this.toolbar.parent().find('.table-errors').find(`.icon-${type}`);
      if (icon.length) {
        const nonVisibleCellTypeErrors = $.grep(this.nonVisibleCellErrors, (error) => {
          if (error.type === type) {
            return error;
          }
          return '';
        });
        // No remaining cell errors of this type
        if (!nonVisibleCellTypeErrors.length) {
          icon.remove();
        }
      }
    }

    this.nonVisibleCellErrors = $.grep(this.nonVisibleCellErrors, (error) => {
      if (!(error.row === row && error.cell === cell && error.type === type)) {
        return error;
      }
      return '';
    });

    if (!this.nonVisibleCellErrors.length) {
      this.showNonVisibleCellErrors();
    }
  },

  /**
   * Clear a row level all errors, alerts, info messages
   * @param {number} row The row index.
   * @returns {void}
   */
  clearRowError(row) {
    const classList = 'error alert rowstatus-row-error rowstatus-row-alert rowstatus-row-info rowstatus-row-in-progress rowstatus-row-success';
    const rowNode = this.dataRowNode(row);

    rowNode.removeClass(classList);
    this.rowStatus(row, '', '');
    for (let cell = 0; cell < this.settings.columns.length; cell++) {
      this.clearAllCellError(row, cell);
    }
  },

  /**
   * Clear all errors, alerts and info messages in entire datagrid.
   * @returns {void}
   */
  clearAllErrors() {
    let rowStatus = 0;
    for (let row = 0; row < this.settings.dataset.length; row++) {
      if (this.settings.dataset[row].rowStatus) {
        delete this.settings.dataset[row].rowStatus;
        rowStatus++;
      }
      for (let cell = 0; cell < this.settings.columns.length; cell++) {
        this.clearAllCellError(row, cell);
      }
    }

    if (rowStatus > 0) {
      this.render();
    }
  },

  /**
   * Remove messages form a cell element.
   * @private
   * @param {object} node cell element.
   * @param {string} type of messages.
   * @returns {void}
   */
  clearNodeErrors(node, type) {
    node = node instanceof jQuery ? node[0] : node;
    node.classList.remove(type);
    node.removeAttribute(`data-${type}message`);

    const icon = node.querySelector(`.icon-${type}`);
    if (icon) {
      icon.parentNode.removeChild(icon);
      this.hideTooltip();
    }
  },

  /**
  * Set the row status on a row to none.
  * @returns {void}
  */
  resetRowStatus() {
    const errors = this.settings.dataset.filter(row => row.rowStatus);
    for (let i = 0; i < errors.length; i++) {
      delete errors[i].rowStatus;
    }
    if (errors.length > 0) {
      this.render();
    }

    // Clear dirty cells
    this.clearDirty();
  },

  /**
   * Clear dirty css class on all cells for given parent element.
   * @private
   * @param  {object} elem The parent element.
   * @returns {void}
   */
  clearDirtyClass(elem) {
    elem = elem instanceof jQuery ? elem[0] : elem;
    if (elem) {
      const cells = [].slice.call(elem.querySelectorAll('.is-dirty-cell'));
      cells.forEach((cell) => {
        cell.classList.remove('is-dirty-cell');
      });
    }
  },

  /**
   * Clear all dirty cells.
   * @returns {void}
   */
  clearDirty() {
    if (this.settings.showDirty) {
      this.clearDirtyClass(this.element);
      this.dirtyArray = undefined;
    }
  },

  /**
   * Clear all dirty cells in given row.
   * @param  {number} row The row index.
   * @returns {void}
   */
  clearDirtyRow(row) {
    if (this.settings.showDirty && typeof row === 'number') {
      const rowNode = this.rowNodes(row);
      this.clearDirtyClass(rowNode);
      if (this.dirtyArray) {
        this.dirtyArray[row] = undefined;
      }
    }
  },

  /**
   * Clear dirty on given cell.
   * @param  {number} row The row index.
   * @param  {number} cell The cell index.
   * @returns {void}
   */
  clearDirtyCell(row, cell) {
    if (this.settings.showDirty && this.dirtyArray &&
      typeof row === 'number' && typeof cell === 'number') {
      const dirtyRow = this.dirtyArray[row];
      if (typeof dirtyRow !== 'undefined') {
        this.cellNode(row, cell).removeClass('is-dirty-cell');
        this.dirtyArray[row][cell] = undefined;
      }
    }
  },

  /**
  * Return all of the currently dirty cells.
  * @returns {array} An array of dirty cells.
  */
  dirtyCells() {
    const s = this.settings;
    const dataset = s.treeGrid ? s.treeDepth : s.dataset;
    const cells = [];

    if (s.showDirty && this.dirtyArray && this.dirtyArray.length) {
      for (let i = 0, l = dataset.length; i < l; i++) {
        const row = this.dirtyArray[i];
        if (typeof row !== 'undefined') {
          for (let i2 = 0, l2 = row.length; i2 < l2; i2++) {
            const col = row[i2];
            if (typeof col !== 'undefined' && col.isDirty) {
              cells.push(s.treeGrid ? dataset[i].node : dataset[i]);
            }
          }
        }
      }
    }
    return cells;
  },

  /**
  * Return all of the currently dirty rows by row index.
  * @returns {array} An array of dirty rows.
  */
  dirtyRows() {
    const s = this.settings;
    const dataset = s.treeGrid ? s.treeDepth : s.dataset;
    const rows = [];

    if (s.showDirty && this.dirtyArray && this.dirtyArray.length) {
      for (let i = 0, l = dataset.length; i < l; i++) {
        const row = this.dirtyArray[i];
        if (typeof row !== 'undefined') {
          for (let i2 = 0, l2 = row.length; i2 < l2; i2++) {
            const col = row[i2];
            if (typeof col !== 'undefined' && col.isDirty) {
              rows.push(s.treeGrid ? dataset[i].node : dataset[i]);
              break;
            }
          }
        }
      }
    }
    return rows;
  },

  /**
  * Return an array containing all of the currently modified rows, the type of modification
  * and the cells that are dirty and the data.
  * @param  {boolean} onlyChangedValues If true will return an array of only changed values
  * @returns {array} An array showing the dirty row info.
  */
  getModifiedRows(onlyChangedValues) {
    const s = this.settings;
    const dataset = s.treeGrid ? s.treeDepth : s.dataset;
    const modified = [];

    for (let i = 0; i < dataset.length; i++) {
      const node = s.treeGrid ? dataset[i].node : dataset[i];
      const data = { row: i, data: node, cells: [] };
      // First add the dirty rows
      if (this.isRowDirty(i)) {
        data.type = 'dirty';
        // No need to run trhu columns loop, if need only changed values to returns
        for (let j = 0; (!onlyChangedValues && (j < this.dirtyArray[i].length)); j++) {
          const cellData = this.dirtyArray[i][j];
          if (typeof cellData !== 'undefined' && cellData.isDirty) {
            data.cells.push({ row: i, col: j, cellData });
          }
        }
      }
      // Now add error and in progress rows
      if (typeof node.rowStatus !== 'undefined' &&
        (node.rowStatus.icon === 'error' || node.rowStatus.icon === 'in-progress')) {
        data.type = data.type === 'dirty' ? ['dirty', node.rowStatus.icon] : node.rowStatus.icon;
      }
      // Add to modified
      if (typeof data.type !== 'undefined') {
        modified.push(onlyChangedValues ? node : data);
      }
    }
    return modified;
  },

  /**
   * Show an error on a row of a given type.
   * @param  {number} row The row index.
   * @param  {string} message The row description.
   * @param  {string} type The error type.
   * @returns {void}
   */
  showRowError(row, message, type) {
    const messageType = type || 'error';
    const rowNode = this.dataRowNode(row);

    rowNode.addClass(type);
    this.rowStatus(row, messageType, message);
  },

  /**
   * Validate all visible cells in a row if they have validation on the column
   * @param  {number} row The row index.
   * @returns {void}
   */
  validateRow(row) {
    if (row === undefined) {
      return;
    }

    for (let i = 0; i < this.settings.columns.length; i++) {
      this.validateCell(row, i);
    }
  },

  /**
   * Validate all rows and cells in the entire grid if they have validation on the column
   * @returns {void}
   */
  validateAll() {
    for (let j = 0; j < this.settings.dataset.length; j++) {
      for (let i = 0; i < this.settings.columns.length; i++) {
        this.validateCell(j, i);
      }
    }
  },

  /**
   * Get the settings for a column by index.
   * @private
   * @param  {number} idx The column index.
   * @returns {array} The settings array
   */
  columnSettings(idx) {
    const foundColumn = this.settings.columns[idx];
    return foundColumn || {};
  },

  /**
   * Attempt to serialize the value back into the dataset
   * @private
   * @param {any} value The new column value
   * @param {any} oldVal The old column value.
   * @param {number} col The column definition
   * @param {number} row  The row index.
   * @param {number} cell The cell index.
   * @returns {void}
   */
  coerceValue(value, oldVal, col, row, cell) {
    let newVal;

    if (col.serialize) {
      const s = this.settings;
      let dataset = s.treeGrid ? s.treeDepth : s.dataset;
      if (this.settings.groupable) {
        dataset = this.originalDataset || dataset;
      }
      const rowData = s.treeGrid ? dataset[row].node : dataset[row];
      newVal = col.serialize(value, oldVal, col, row, cell, rowData);
      return newVal;
    } if (col.sourceFormat) {
      if (value instanceof Date) {
        newVal = Locale.parseDate(value, col.sourceFormat);
      } else {
        newVal = Locale.formatDate(value, { pattern: col.sourceFormat });
      }
    } else if (typeof oldVal === 'number' && value) {
      newVal = Locale.parseNumber(value); // remove thousands sep , keep a number a number
    }

    return newVal;
  },

  /**
   * Update one cell with a specific value
   * @param {number} row  The row index.
   * @param {number} cell The cell index.
   * @param {any} value The value to use.
   * @returns {void}
   */
  updateCell(row, cell, value) {
    const col = this.columnSettings(cell);

    if (value === undefined) {
      value = this.fieldValue(this.settings.dataset[row], col.field);
    }

    this.updateCellNode(row, cell, value, true);
  },

  /**
   * Update one cell with a specific value
   * @private
   * @param {number} row  The row index.
   * @param {number} cell The cell index.
   * @param {any} value The value to use.
   * @param {boolean} fromApiCall Comes from an api call.
   * @param {boolean} isInline If the editor is an inline value.
   * @returns {void}
   */
  updateCellNode(row, cell, value, fromApiCall, isInline) {
    let coercedVal;
    let rowNodes = this.settings.groupable ? this.rowNodesByDataIndex(row) : this.rowNodes(row);
    let cellNode = rowNodes.find('td').eq(cell);
    const col = this.settings.columns[cell] || {};
    let formatted = '';
    const formatter = (col.formatter ? col.formatter : this.defaultFormatter);
    const isEditor = $('.editor', cellNode).length > 0;
    const isTreeGrid = this.settings.treeGrid;
    let dataRowIndex = isTreeGrid ?
      this.actualPagingRowIndex(this.actualRowIndex(rowNodes)) :
      this.dataRowIndex(rowNodes);

    if (dataRowIndex === null || dataRowIndex === undefined || isNaN(dataRowIndex)) {
      dataRowIndex = row;
    }
    const rowData = this.rowData(dataRowIndex);

    if (rowNodes.length === 0 && this.settings.paging) {
      rowNodes = this.visualRowNode(row);
      cellNode = rowNodes.find('td').eq(cell);
    }
    let oldVal = this.fieldValue(rowData, col.field);

    // Coerce/Serialize value if from cell edit
    if (!fromApiCall) {
      coercedVal = this.coerceValue(value, oldVal, col, row, cell);

      // coerced value may be coerced to empty string, null, or 0
      if (coercedVal === undefined) {
        coercedVal = value;
      }
    } else {
      coercedVal = value;
    }

    // Remove rowStatus icon
    if (rowNodes.length && rowData && !rowData.rowStatus) {
      const rowstatusIcon = rowNodes.find('svg.icon-rowstatus');
      if (rowstatusIcon.length) {
        rowstatusIcon.remove();
      }
    }

    // Remove older tooltip data
    this.removeTooltipData(cellNode);

    // Update the value in the dataset
    if (cell === 0 && rowData && rowData.rowStatus) {
      let svg = cellNode.find('svg.icon-rowstatus');

      if (rowNodes && cellNode[0]) {
        for (let i = 0; i < rowNodes.length; i++) {
          rowNodes[i].classList.add(`rowstatus-row-${rowData.rowStatus.icon}`);
        }
        cellNode[0].classList.add('rowstatus-cell');

        if (!svg.length) {
          const svgIcon = rowData.rowStatus.icon === 'success' ? '#icon-check' : '#icon-exclamation';
          cellNode.prepend(`<svg class="icon icon-rowstatus" focusable="false" aria-hidden="true" role="presentation"><use href="${svgIcon}"></use></svg>`);
        }
      }
      if (rowData.rowStatus.tooltip) {
        svg = cellNode.find('svg.icon-rowstatus');
        const statusIcon = rowData.rowStatus.icon;
        this.cacheTooltip(svg, {
          forced: true,
          placement: 'right',
          content: rowData.rowStatus.tooltip,
          isError: statusIcon === 'error' || statusIcon === 'dirtyerror',
          wrapper: cellNode
        });
      }
    }

    coercedVal = xssUtils.unescapeHTML(coercedVal);

    if (col.field && coercedVal !== oldVal) {
      if (col.field.indexOf('.') > -1) {
        let rowDataObj = rowData;
        const nbrParts = col.field.split('.').length;
        col.field.split('.').forEach((part, index) => {
          if (index === nbrParts - 1) {
            rowDataObj[part] = coercedVal;
          } else {
            rowDataObj = rowDataObj[part];
          }
        });
      } else {
        rowData[col.field] = coercedVal;
      }
    }

    // Adjust leading/trailing spaces as `&nbsp;`
    const adj = (thisVal, regx) => {
      const r = (typeof thisVal === 'string' ? thisVal.match(regx) : ['']) || [''];
      return r[0].replace(/\s/g, '&nbsp;');
    };

    // update cell value
    const escapedVal = xssUtils.escapeHTML(coercedVal);
    let val = (isEditor ? coercedVal : escapedVal);
    if (typeof val === 'string') {
      val = `${adj(val, /^\s*/)}${val.trim()}${adj(val, /\s*$/)}`;
    }
    formatted = this.formatValue(formatter, row, cell, val, col, rowData);

    if (col.contentVisible) {
      const canShow = col.contentVisible(row, cell, escapedVal, col, rowData);
      if (!canShow) {
        formatted = '';
      }
    }

    if (!isInline) {
      cellNode.find('.datagrid-cell-wrapper').html(formatted);
    }

    if (!fromApiCall) {
      // Validate the cell
      this.validateCell(dataRowIndex, cell);

      // Update and set trackdirty
      if (!this.isDirtyCellUndefined(row, cell)) {
        this.dirtyArray[row][cell].value = value;
        this.dirtyArray[row][cell].coercedVal = coercedVal;
        this.dirtyArray[row][cell].escapedCoercedVal = xssUtils.escapeHTML(coercedVal);
        this.dirtyArray[row][cell].cellNodeText = cellNode.text();
        this.dirtyArray[row][cell].cell = cell;
        this.dirtyArray[row][cell].column = this.settings.columns[cell];
        this.setDirtyCell(row, cell);
      }
    }

    // resize on change
    if (this.settings.stretchColumnOnChange && col) {
      let newWidth = this.calculateTextWidth(col);
      // make sure that the column is at least the minimum width
      if (col.minWidth && newWidth < col.minWidth) {
        newWidth = col.minWidth;
      }
      // make sure that the column is no more than the maximum width
      if (col.minWidth && newWidth > col.maxWidth) {
        newWidth = col.maxWidth;
      }
      if (newWidth > 0 && ((newWidth - this.stretchColumnWidth) > this.stretchColumnDiff)) {
        this.stretchColumnWidth = newWidth;
        this.stretchColumnDiff = 0;
        this.setColumnWidth(col.id, newWidth, true);
      }
    }

    // Sanitize console methods
    oldVal = xssUtils.sanitizeConsoleMethods(oldVal);
    coercedVal = xssUtils.sanitizeConsoleMethods(coercedVal);

    let isCellChange;
    if (typeof oldVal === 'string' && typeof coercedVal === 'string') {
      // Some reasion compare spaces not in match, use `&nbsp;` leading/trailing spaces
      const values = {
        oldVal: `${adj(oldVal, /^\s*/)}${oldVal.trim()}${adj(oldVal, /\s*$/)}`,
        coercedVal: `${adj(coercedVal, /^\s*/)}${coercedVal.trim()}${adj(coercedVal, /\s*$/)}`
      };
      isCellChange = (values.coercedVal !== values.oldVal && !fromApiCall);
    } else {
      isCellChange = (coercedVal !== oldVal && !fromApiCall);
    }

    if (isCellChange) {
    // if (coercedVal !== oldVal && !fromApiCall) {
      const args = {
        row: this.settings.source !== null ? dataRowIndex : row,
        relativeRow: row,
        cell,
        target: cellNode,
        value: coercedVal,
        oldValue: oldVal,
        column: col,
        api: this
      };
      args.rowData = isTreeGrid && this.settings.treeDepth[row] ?
        this.settings.treeDepth[row].node : rowData;

      /**
       * Fires when a cell value is changed via the editor.
       * @event cellchange
       * @memberof Datagrid
       * @property {object} event The jquery event object
       * @property {object} args Additional arguments
       * @property {number} args.row An array of selected rows.
       * @property {number} args.cell An array of selected rows.
       * @property {HTMLElement} args.target The cell html element that was entered.
       * @property {any} args.value The cell value.
       * @property {any} args.oldValue The previous cell value.
       * @property {object} args.column The column object
       */
      this.element.trigger('cellchange', args);
      this.wasJustUpdated = true;
    }
  },

  /**
   * Function to check if given row has true value for isDirty in any cell in it
   * @private
   * @param {number} rowIndex The row index
   * @returns {boolean} true if isDirty
   */
  isRowDirty(rowIndex) {
    let isDirty = false;
    if (typeof rowIndex === 'number' && this.dirtyArray && this.dirtyArray.length) {
      const row = this.dirtyArray[rowIndex];
      if (typeof row !== 'undefined') {
        for (let i = 0, l = row.length; i < l; i++) {
          const col = row[i];
          if (typeof col !== 'undefined' && col.isDirty) {
            isDirty = true;
            break;
          }
        }
      }
    }
    return isDirty;
  },

  /**
   * Function to check if given cell has true value for isDirty
   * @private
   * @param {number} row The row index
   * @param {number} cell The cell index
   * @returns {boolean} true if isDirty
   */
  isCellDirty(row, cell) {
    return this.isDirtyCellUndefined(row, cell) ?
      false : this.dirtyArray[row][cell].isDirty;
  },

  /**
   * Function to add a dirty entry to the array
   * @param {number} row  The row index
   * @param {number} cell The cell index
   * @param {object} data The cell data to add
   */
  addToDirtyArray(row, cell, data) {
    if (typeof this.dirtyArray === 'undefined') {
      this.dirtyArray = [];
    }

    if (typeof this.dirtyArray[row] === 'undefined') {
      this.dirtyArray[row] = [];
      this.dirtyArray[row][cell] = data;
    } else if (typeof this.dirtyArray[row][cell] === 'undefined') {
      this.dirtyArray[row][cell] = data;
    }
  },

  /**
   * Set a cell to dirty and add the dirty icon internally.
   * @private
   * @param {number} row The row index
   * @param {number} cell The cell index
   * @param {object} dirtyOptions The cell dirty options
   * @returns {void}
   */
  setDirtyCell(row, cell, dirtyOptions) {
    const cellNode = this.cellNode(row, cell);

    if (dirtyOptions) {
      this.addToDirtyArray(row, cell, dirtyOptions);
    }

    const d = this.dirtyArray[row][cell];
    if ((d.originalVal === d.value) ||
      (d.originalVal === d.coercedVal) ||
      (d.originalVal === d.escapedCoercedVal) ||
      (d.originalVal === d.cellNodeText)) {
      this.dirtyArray[row][cell].isDirty = false;
      this.setDirtyIndicator(row, cell, false);
    } else {
      this.dirtyArray[row][cell].isDirty = true;
      cellNode[0].classList.add('is-dirty-cell');
      this.setDirtyIndicator(row, cell, true);
    }
  },

  /**
   *  Set a cell to dirty and add the dirty icon visually.
   * @param {number} row The row index
   * @param {number} cell The cell index
   * @param {boolean} toggle True to set it and false to remove it
   * @param {object} data Adds dirty data to the internal tracker
   */
  setDirtyIndicator(row, cell, toggle, data) {
    const cellNode = this.cellNode(row, cell);

    if (data) {
      this.addToDirtyArray(row, cell, data);
    }

    if (row < 0 || cell < 0 || !cellNode.length) {
      return;
    }

    if (toggle) {
      cellNode[0].classList.add('is-dirty-cell');
    } else {
      cellNode[0].classList.remove('is-dirty-cell');
    }
  },

  /**
   * Function to check given cell is cache to dirtyArray
   * @private
   * @param {number} row The row index
   * @param {number} cell The cell index
   * @returns {boolean} true if found
   */
  isDirtyCellUndefined(row, cell) {
    return !(this.settings.showDirty &&
      typeof row === 'number' &&
      typeof cell === 'number' &&
      row > -1 && cell > -1 &&
      typeof this.dirtyArray !== 'undefined' &&
      typeof this.dirtyArray[row] !== 'undefined' &&
      typeof this.dirtyArray[row][cell] !== 'undefined');
  },

  /**
   * For the row node get the index adjusting for paging / invisible rowsCache
   * @private
   * @param {number} row The row index
   * @returns {number} The row index adjusted for paging/non visible rows.
   */
  visualRowIndex(row) {
    const selector = 'tr:visible:not(.is-hidden, .datagrid-expandable-row)';
    let idx = this.tableBody.find(selector).index(row);
    if (idx === -1 && this.tableBodyLeft) {
      idx = this.tableBodyLeft.find(selector).index(row);
    }
    if (idx === -1 && this.tableBodyRight) {
      idx = this.tableBodyRight.find(selector).index(row);
    }
    return idx;
  },

  /**
   * For the row index get the node adjusting for paging / invisible rowsCache
   * @private
   * @param {number} idx The row index
   * @returns {object} The row node adjusted for paging/non visible rows.
   */
  visualRowNode(idx) {
    let rowIdx = idx;

    if (this.settings.paging && this.settings.source) {
      rowIdx += ((this.pagerAPI.activePage - 1) * this.settings.pagesize);
    }

    if (!this.isRowVisible(idx)) {
      return $([]);
    }

    return this.tableBody.find(`tr[aria-rowindex="${rowIdx + 1}"]`);
  },

  /**
   * For an internal row index, get the dataset row index
   * @private
   * @param {number} idx The row index
   * @returns {object} The row index in the dataset.
   */
  actualRowNode(idx) {
    return this.tableBody.find(`tr[aria-rowindex="${idx + 1}"]`);
  },

  /**
   * Returns the row dom jQuery node.
   * @param  {number} row The row index.
   * @returns {object} The dom jQuery node
   */
  rowNodes(row) {
    let container = this.element;

    if (row instanceof jQuery) {
      container = row.closest('.datagrid-container');
      row = row.attr('aria-rowindex') - 1;
    }
    return container.find(`> .datagrid-wrapper > table > tbody > tr[aria-rowindex="${row + 1}"]`);
  },

  /**
   * Returns the row dom jQuery node.
   * @private
   * @param  {number} row The row index.
   * @returns {object} The dom jQuery node
   */
  rowNodesByDataIndex(row) {
    if (row instanceof jQuery) {
      row = row.attr('data-index');
    }
    const leftNodes = this.tableBodyLeft ? this.tableBodyLeft.find(`tr[data-index="${row}"]`) : $();
    const centerNodes = this.tableBody.find(`tr[data-index="${row}"]`);
    const rightNodes = this.tableBodyRight ? this.tableBodyRight.find(`tr[data-index="${row}"]`) : $();

    return $(centerNodes)
      .add(leftNodes)
      .add(rightNodes);
  },

  /**
   * Returns the cell dom node.
   * @param  {number} row The row index.
   * @param  {number} cell The cell index.
   * @returns {object} The dom node
   */
  cellNode(row, cell) {
    const cells = this.settings.groupable ?
      this.rowNodesByDataIndex(row).find('td') :
      this.rowNodes(row).find('td');

    return cells.eq(cell >= cells.length ? cells.length - 1 : cell);
  },

  /**
   * For an internal row node, get the dataset row index.
   * @private
   * @param {number} row The row node.
   * @returns {object} The row index in the dataset.
   */
  actualRowIndex(row) {
    row = row instanceof jQuery ? row : $(row);
    return row.attr('aria-rowindex') - 1;
  },

  /**
   * For an internal row index, get row index across page number.
   * This may or may not be the one in the dataset.
   * @private
   * @param {number} idx The row idx.
   * @returns {object} The row index
   */
  pagingRowIndex(idx) {
    let rowIdx = idx;

    if (this.settings.paging && this.settings.source && !this.settings.indeterminate) {
      rowIdx += ((this.pagerAPI.activePage - 1) * this.settings.pagesize);
    }
    return rowIdx;
  },

  /**
   * For an internal row index, get row index across page number.
   * This may or may not be the one in the dataset.
   * @private
   * @param {number} idx The row idx.
   * @returns {object} The row index
   */
  actualPagingRowIndex(idx) {
    let rowIdx = idx;

    if (this.settings.paging && this.settings.source && !this.settings.indeterminate) {
      rowIdx -= ((this.pagerAPI.activePage - 1) * this.settings.pagesize);
    }
    return rowIdx;
  },

  /**
   * Return the data node for a row. This is the newer way of getting this info.
   * @private
   * @param {number} idx The row idx to find
   * @returns {object} The row node
   */
  dataRowNode(idx) {
    return this.tableBody.find(`tr[data-index="${idx}"]`);
  },

  /**
   * Return the data index for a row. This is the newer way of getting this info.
   * @private
   * @param {number} row The row idx
   * @returns {number} The row index in the dataset.
   */
  dataRowIndex(row) {
    row = row instanceof jQuery ? row : $(row);
    return parseInt(row.attr('data-index'), 10);
  },

  /**
   * Sets focus on a cell.
   * @param  {number} row The row index
   * @param  {number} cell The cell index
   */
  setActiveCell(row, cell) {
    const self = this;
    const prevCell = self.activeCell;
    let rowElem = row;
    let rowNum;
    let rowIndex;
    let dataRowNum;
    let isGroupRow = row instanceof jQuery && row.is('.datagrid-rowgroup-header, .datagrid-rowgroup-footer');

    if (row instanceof jQuery && row.length === 0) {
      return;
    }

    if (typeof row === 'number') {
      rowNum = row;
      rowElem = this.tableBody.find('tr:visible').eq(row);
      rowIndex = this.actualRowIndex(rowElem);
      dataRowNum = this.dataRowIndex(rowElem);
    }

    // Support passing the td in to focus that cell
    if (row instanceof jQuery && row.is('td')) {
      isGroupRow = row.parent().is('.datagrid-rowgroup-header, .datagrid-rowgroup-footer');
      if (isGroupRow) {
        rowElem = row.parent();
      }
      cell = row.attr('aria-colindex') - 1;
      rowNum = this.visualRowIndex(row.parent());
      rowIndex = this.actualRowIndex(row.parent());
      dataRowNum = this.dataRowIndex(row.parent());
      rowElem = row.parent();
    }

    if (row instanceof jQuery && row.is('tr')) {
      rowNum = this.visualRowIndex(row);
      rowIndex = this.actualRowIndex(row);
      dataRowNum = this.dataRowIndex(row);
      rowElem = row;
    }

    if (rowNum < 0 || cell < 0) {
      return;
    }

    // Remove previous tab index
    if (prevCell.node && prevCell.node.length === 1) {
      self.activeCell.node
        .removeAttr('tabindex')
        .removeClass('is-active');
    }

    // Hide any cell tooltips (Primarily for validation)
    if (prevCell.cell !== cell || prevCell.row !== row) {
      self.hideTooltip();
    }

    // Find the cell if it exists
    self.activeCell.node = self.cellNode((isGroupRow || rowElem ? rowElem : (rowIndex > -1 ? rowIndex : rowNum)), cell).attr('tabindex', '0');

    if (self.activeCell.node && prevCell.node.length === 1) {
      self.activeCell.row = rowNum;
      self.activeCell.cell = cell;
      rowIndex = this.actualRowIndex(self.activeCell.node.parent());
      dataRowNum = this.dataRowIndex(self.activeCell.node.parent());
    } else {
      self.activeCell = prevCell;
    }

    if ((!$('input, select, button:not(.btn-secondary, .row-btn, .datagrid-expand-btn, .datagrid-drilldown, .btn-icon)', self.activeCell.node).length) || (self.activeCell.node.is('.has-btn-actions') && self.activeCell.node.find('.btn-actions').length)) {
      self.activeCell.node.focus();
      if (isGroupRow) {
        self.activeCell.groupNode = self.activeCell.node;
      }
    }

    if (self.activeCell.node.is('.is-focusable')) {
      self.activeCell.node.find('button').focus();
    }

    if (dataRowNum !== undefined) {
      self.activeCell.dataRow = dataRowNum;
    }

    if (rowIndex !== undefined) {
      self.activeCell.rowIndex = rowIndex;
    }

    const colSpan = +rowElem.find('td[colspan]').attr('colspan');

    if (isGroupRow && self.activeCell.node && prevCell.node && !(row instanceof jQuery && row.is('td'))) {
      if (cell < colSpan) {
        rowElem.find('td[colspan]').attr('tabindex', '0').focus();
        self.activeCell.groupNode = rowElem.find('td[colspan]');
      } else if (cell >= colSpan) {
        rowElem.find('td').eq((cell - colSpan) + 1).attr('tabindex', '0').focus();
        self.activeCell.groupNode = rowElem.find('td').eq((cell - colSpan) + 1);
      } else {
        rowElem.find('td').eq(cell).attr('tabindex', '0').focus();
        self.activeCell.groupNode = rowElem.find('td').eq(cell);
      }
    }

    if (isGroupRow && row instanceof jQuery && row.is('td')) {
      self.activeCell.cell = (colSpan - 1) + cell;
      if (row.is('[colspan]')) {
        self.activeCell.cell = cell;
      }
    }

    if (this.settings.cellNavigation) {
      const headers = self.headerNodes();
      let prevSpans = 0;

      // Check if any previous rows are spanned
      if (this.hasColSpans) {
        prevSpans = 0;

        headers.eq(cell).prevAll('[colspan]').each((i, elem) => {
          const span = $(elem).attr('colspan') - 1;
          prevSpans += span;
        });

        cell -= prevSpans;
      }

      headers.removeClass('is-active');
      headers.eq(cell).addClass('is-active');
    }
    this.activeCell.isFocused = true;

    // Expand On Activate Feature
    const col = this.settings.columns[cell];
    if (col && col.expandOnActivate && this.activeCell && this.activeCell.node) {
      self.activeCell.node.addClass('is-active');
    }

    /**
    * Fires when a cell is focued.
    * @event activecellchange
    * @memberof Datagrid
    * @property {object} event The jquery event object
    * @property {object} args Additional arguments
    * @property {HTMLElement} args.node  The cell element that was entered.
    * @property {number} args.cell The selected cell
    * @property {number} args.row The selected row
    */
    self.element.trigger('activecellchange', { node: this.activeCell.node, row: this.activeCell.row, cell: this.activeCell.cell, api: self });
  },

  /**
   * Sets focus to the next active cell, depending on a key.
   * @private
   * @param {object} e The event object
   */
  setNextActiveCell(e) {
    const self = this;
    if (e.type === 'keydown') {
      if (this.settings.actionableMode) {
        const keyCode = (e.keyCode === 13) ? 40 : e.keyCode;
        if (keyCode === 32) {
          return;
        }
        setTimeout(() => {
          const evt = $.Event('keydown.datagrid');
          evt.keyCode = keyCode;

          self.activeCell.node.trigger(evt);
        }, 0);
      } else {
        this.setActiveCell(this.activeCell.row, this.activeCell.cell);
      }
    }
  },

  /**
   * Add children to treegrid dataset
   * @private
   * @param {object} parent The parent object
   * @param {object} data The data for the child
   */
  addChildren(parent, data) {
    if (!data || (data && !data.length) || parent < 0) {
      return;
    }
    const node = this.settings.treeDepth[parent].node;
    node.children = node.children || [];

    // Make sure it's not reference pointer to data object, make copy of data
    data = JSON.parse(JSON.stringify(data));

    for (let i = 0, len = data.length; i < len; i++) {
      node.children.push(data[i]);
    }
    this.updateDataset(this.settings.dataset);
  },

  /**
   * Set the expanded property in the dataset
   * @private
   * @param {number} dataRowIndex The index in the dataset.
   * @param {boolean} isExpanded Expanded value to set.
   */
  setExpandedInDataset(dataRowIndex, isExpanded) {
    this.settings.treeDepth[dataRowIndex].node.expanded = isExpanded;
  },

  /**
   * Expand the tree children
   * @private
   * @param {object} e The event data from the click or keyboard event.
   * @param {number} dataRowIndex Index in the dataset
   */
  toggleChildren(e, dataRowIndex) {
    if (this.settings.groupable) {
      return;
    }
    const self = this;
    const s = this.settings;
    let rowElement = this.rowNodes(dataRowIndex);
    let expandButton = rowElement.find('.datagrid-expand-btn');
    const level = parseInt(rowElement.attr('aria-level'), 10);
    const isExpanded = expandButton.hasClass('is-expanded');
    const args = [{ grid: self, row: dataRowIndex, item: rowElement }];

    if (self.settings.treeDepth && self.settings.treeDepth[dataRowIndex]) {
      args[0].rowData = self.settings.treeDepth[dataRowIndex].node;
    }

    if (!rowElement.hasClass('datagrid-tree-parent') ||
        (!$(e.target).is(expandButton) &&
          (self.settings.editable || self.settings.selectable))) {
      return;
    }

    const toggleExpanded = function () {
      rowElement = self.rowNodes(dataRowIndex);
      expandButton = rowElement.find('.datagrid-expand-btn');
      const children = rowElement.nextUntil(`[aria-level="${level}"]`);
      const parentRowIdx = self.settings.treeGrid && self.settings.source && self.settings.paging ?
        self.dataRowIndex(rowElement) : dataRowIndex;

      if (isExpanded) {
        rowElement.attr('aria-expanded', false);
        expandButton.removeClass('is-expanded')
          .find('.plus-minus').removeClass('active');
      } else {
        rowElement.attr('aria-expanded', true);
        expandButton.addClass('is-expanded')
          .find('.plus-minus').addClass('active');
      }
      self.setExpandedInDataset(parentRowIdx, !isExpanded);

      const setChildren = function (elem, lev, expanded) {
        const nodes = elem.nextUntil(`[aria-level="${lev}"]`);

        if (expanded) {
          nodes.each(function () {
            const node = $(this);
            const nodeLevel = parseInt(node.attr('aria-level'), 10);
            if (nodeLevel > lev) {
              node.addClass('is-hidden');
            }
          });
        } else {
          nodes.each(function () {
            const node = $(this);
            const nodeLevel = parseInt(node.attr('aria-level'), 10);

            // Handles that child rows get the right states
            if (nodeLevel === (lev + 1)) {
              if (!node.hasClass('is-filtered')) {
                node.removeClass('is-hidden');

                if (self.settings.frozenColumns) {
                  const rowindex = node.attr('aria-rowindex');
                  self.tableBody.find(`[aria-rowindex="${rowindex}"]`).removeClass('is-hidden');
                }
              }
              if (node.is('.datagrid-tree-parent')) {
                const nodeIsExpanded = node.find('.datagrid-expand-btn.is-expanded').length > 0;
                if (nodeIsExpanded) {
                  setChildren(node, nodeLevel, !nodeIsExpanded);
                }
              }
            }
          });
        }
      };

      setChildren(rowElement, level, isExpanded);
      self.setAlternateRowShading();
      args.children = children;
    };

    /**
    * Fires when a row is collapsed to show its detail.
    * @event collapserow
    * @memberof Datagrid
    * @property {object} event The jquery event object
    * @property {object} args Additional arguments
    * @property {object} args.self The grid api.
    * @property {number} args.row The selected row index
    * @property {object} args.item The selected row data.
    * @property {array} args.children The selected rows children (tree grid)
    */

    /**
    * Fires when a row is expanded to show its detail.
    * @event expandrow
    * @memberof Datagrid
    * @property {object} event The jquery event object
    * @property {object} args Additional arguments
    * @property {object} args.self The grid api.
    * @property {number} args.row The selected row index
    * @property {object} args.item The selected row data.
    * @property {array} args.children The selected rows children (tree grid)
    */
    const triggerEvent = isExpanded ? 'collapserow' : 'expandrow';
    $.when(self.element.triggerHandler(triggerEvent, args)).done((response) => {
      const isFalse = v => ((typeof v === 'string' && v.toLowerCase() === 'false') ||
        (typeof v === 'boolean' && v === false) ||
        (typeof v === 'number' && v === 0));
      if (!isFalse(response)) {
        if (typeof s.onExpandChildren === 'function' && !isExpanded) {
          $.when(s.onExpandChildren(args[0])).done((res) => {
            if (!isFalse(res)) {
              toggleExpanded();
            }
          });
        } else if (typeof s.onCollapseChildren === 'function' && isExpanded) {
          $.when(s.onCollapseChildren(args[0])).done((res) => {
            if (!isFalse(res)) {
              toggleExpanded();
            }
          });
        } else {
          toggleExpanded();
        }
      }
    });
  },

  /**
   * Expand Detail Row Or Tree Row
   * @param  {number} dataRowIndex The row to toggle
   * @returns {void}
   */
  toggleRowDetail(dataRowIndex) {
    const self = this;
    let rowElement = self.rowNodes(dataRowIndex);
    if (!rowElement.length && self.settings.paging &&
      (self.settings.rowTemplate || self.settings.expandableRow)) {
      dataRowIndex += ((self.pagerAPI.activePage - 1) * self.settings.pagesize);
      rowElement = self.dataRowNode(dataRowIndex);
    }
    const expandRow = rowElement.next();
    const expandButton = rowElement.find('.datagrid-expand-btn');
    const detail = expandRow.find('.datagrid-row-detail');
    const item = self.settings.dataset[self.dataRowIndex(rowElement)];

    if (rowElement.hasClass('datagrid-tree-parent')) {
      return;
    }

    if (self.settings.allowOneExpandedRow && self.settings.groupable === null) {
      // collapse any other expandable rows
      const tableBody = self.tableBody.add(self.tableBodyLeft).add(self.tableBodyRight);
      const prevExpandRow = tableBody.find('tr.is-expanded');
      const prevExpandButton = prevExpandRow.prev().find('.datagrid-expand-btn');
      const parentRow = prevExpandRow.prev();
      const parentRowIdx = self.actualRowNode(parentRow);
      const parentdataRowIdx = self.dataRowIndex(parentRow);

      if (prevExpandRow.length && expandRow.index() !== prevExpandRow.index()) {
        const prevDetail = prevExpandRow.find('.datagrid-row-detail');

        prevExpandRow.add(prevExpandButton).removeClass('is-expanded');
        parentRow.removeClass('is-rowactivated');
        parentRow.find('.plus-minus').removeClass('active');
        prevDetail.animateClosed().on('animateclosedcomplete', () => {
          prevExpandRow.removeClass('is-expanded');
          self.element.triggerHandler('collapserow', [{ grid: self, row: parentRowIdx, detail: prevDetail, item: self.settings.dataset[parentdataRowIdx] }]);
        });

        const prevActionBtn = prevExpandRow.prev().find('.btn-primary');
        if (prevActionBtn.length) {
          prevActionBtn.attr('class', prevActionBtn.attr('class').replace('btn-primary', 'btn-secondary'));
        }
      }

      // Toggle the button to make it primary
      const isExpanded = !expandRow.hasClass('is-expanded');
      const actionButton = expandRow.prev().find(isExpanded ? '.btn-secondary' : '.btn-primary');

      if (actionButton.length > 0 && parentRow && actionButton) {
        const currentClass = actionButton.attr('class') || '';

        actionButton.attr('class', currentClass.replace(
          isExpanded ? 'btn-secondary' : 'btn-primary',
          isExpanded ? 'btn-primary' : 'btn-secondary'
        ));
      }
    }

    if (expandRow.hasClass('is-expanded')) {
      // expandRow.removeClass('is-expanded');
      detail.one('animateclosedcomplete', () => {
        expandRow.removeClass('is-expanded');
      }).animateClosed();

      expandButton.removeClass('is-expanded')
        .find('.plus-minus').removeClass('active');

      if (self.settings.allowOneExpandedRow) {
        rowElement.removeClass('is-rowactivated');
      }

      // detail.animateClosed();
      self.element.triggerHandler('collapserow', [{ grid: self, row: dataRowIndex, detail, item }]);
    } else {
      expandRow.addClass('is-expanded');
      expandButton.addClass('is-expanded')
        .find('.plus-minus').addClass('active');

      // Optionally Contstrain the width
      expandRow.find('.constrained-width').css('max-width', this.element.outerWidth());

      const eventData = [{ grid: self, row: dataRowIndex, detail, item }];
      self.element.triggerHandler('expandrow', eventData);

      if (self.settings.allowOneExpandedRow && this.settings.selectable !== 'multiple') {
        rowElement.addClass('is-rowactivated');
      }

      if (self.settings.onExpandRow) {
        const response = function (markup) {
          if (markup) {
            detail.find('.datagrid-row-detail-padding').empty().append(markup);
          }
          self.adjustExpandRowHeight(detail);
          detail.animateOpen();
        };

        self.settings.onExpandRow(eventData[0], response);
      } else {
        self.adjustExpandRowHeight(detail);
        detail.animateOpen();
      }

      // Expandable row for frozen columns expand across all cells
      if (self.settings.frozenColumns.expandRowAcrossAllCells) {
        self.frozenExpandRowAcrossAllCells();
      }
      if (self.settings.frozenColumns.left.length || self.settings.frozenColumns.right.length) {
        const elms = { left: detail.eq(0)[0], center: detail.eq(1)[0], right: detail.eq(2)[0] };
        const changedEventStr = {
          theme: `themechanged.${COMPONENT_NAME}`,
          rowheight: `rowheightchanged.${COMPONENT_NAME}`
        };
        $('html').off(changedEventStr.theme).on(changedEventStr.theme, () => {
          self.frozenExpandRowSetHeight(elms);
        });
        self.element.off(changedEventStr.rowheight).on(changedEventStr.rowheight, () => {
          self.frozenExpandRowSetHeight(elms);
        });
      }
    }
  },

  /**
   * Adjust height to expandable row for frozen columns
   * @private
   * @param {jQuery[]} expandRowElms The expandable row elements
   * @returns {void}
   */
  adjustExpandRowHeight(expandRowElms) {
    if (expandRowElms.length) {
      if (this.settings.frozenColumns.left.length || this.settings.frozenColumns.right.length) {
        const elms = {
          left: expandRowElms.eq(0)[0] ? expandRowElms.eq(0)[0].children[0] : null,
          center: expandRowElms.eq(1)[0],
          right: expandRowElms.eq(2)[0] ? expandRowElms.eq(2)[0].children[0] : null
        };
        let height = 0;
        if (elms.center) {
          elms.center.style.height = 'auto';
          height = elms.center.offsetHeight - 1;
          elms.center.style.height = '';
        }
        if (height > 0) {
          if (elms.left) {
            elms.left.style.height = `${height}px`;
          }
          if (elms.right) {
            elms.right.style.height = `${height}px`;
          }
        }
      }
    }
  },

  /**
   * Set height to expandable row for frozen columns
   * @private
   * @param {object} elms The expandable row `.detail` elements
   * @returns {void}
   */
  frozenExpandRowSetHeight(elms) {
    if (this.settings.frozenColumns.left.length || this.settings.frozenColumns.right.length) {
      let height = 0;
      if (elms && elms.center) {
        elms.padding = elms.center.querySelector('.datagrid-row-detail-padding');
        height = elms.padding.offsetHeight;
      }
      if (height) {
        elms.center.style.height = `${height}px`;
        if (elms.left) {
          elms.left.style.height = `${height}px`;
        }
        if (elms.right) {
          elms.right.style.height = `${height}px`;
        }
        if (this.settings.frozenColumns.expandRowAcrossAllCells) {
          const rect = {
            container: this.element[0].getBoundingClientRect(),
            centerEl: elms.center.getBoundingClientRect()
          };
          const top = `${rect.centerEl.top - rect.container.top}px`;
          elms.padding.style.top = top;
        }
      }
    }
  },

  /**
   * Expand the expandable row to all columns for frozen
   * @private
   * @returns {void}
   */
  frozenExpandRowAcrossAllCells() {
    if (this.settings.frozenColumns.left.length || this.settings.frozenColumns.right.length) {
      // Selector
      const selector = { row: '.datagrid-expandable-row.is-expanded' };
      selector.detail = `${selector.row} > td .datagrid-row-detail`;
      selector.padding = `${selector.detail} .datagrid-row-detail-padding`;

      const table = {
        left: this.tableBodyLeft ? this.tableBodyLeft[0] : null,
        center: this.tableBody ? this.tableBody[0] : null,
        right: this.tableBodyRight ? this.tableBodyRight[0] : null
      };

      // Elements
      const elms = {
        rows: {
          left: table.left ? table.left.querySelector(selector.row) : null,
          center: table.center ? table.center.querySelector(selector.row) : null,
          right: table.right ? table.right.querySelector(selector.row) : null
        },
        details: {
          left: table.left ? table.left.querySelector(selector.detail) : null,
          center: table.center ? table.center.querySelector(selector.detail) : null,
          right: table.right ? table.right.querySelector(selector.detail) : null
        },
        padding: this.tableBody[0].querySelector(selector.padding)
      };

      if (elms.padding && (elms.details.left || elms.details.right)) {
        const cssClass = 'is-expanded-frozen';
        elms.padding.style.opacity = '0';
        if (elms.rows.left) {
          elms.rows.left.classList.add(cssClass);
        }
        if (elms.rows.right) {
          elms.rows.right.classList.add(cssClass);
        }

        $(elms.details.center)
          .one('animateopencomplete.datagrid.expandedfrozen', () => {
            if (elms.details.left || elms.details.right) {
              setTimeout(() => {
                elms.rows.center.classList.add(cssClass);
                this.frozenExpandRowSetHeight(elms.details);
                elms.padding.style.opacity = '';

                $(window).on('resize.datagrid.expandedfrozen', () => {
                  this.frozenExpandRowSetHeight(elms.details);
                });
              }, 10);
            }
          })
          .one('animateclosedstart.datagrid.expandedfrozen', () => {
            $(window).off('resize.datagrid.expandedfrozen');
            elms.padding.style.opacity = '0';
            elms.padding.style.top = '';
            elms.rows.center.classList.remove(cssClass);
            if (elms.rows.left) {
              elms.rows.left.classList.remove(cssClass);
            }
            if (elms.rows.right) {
              elms.rows.right.classList.remove(cssClass);
            }
          })
          .one('animateclosedcomplete.datagrid.expandedfrozen', () => {
            elms.padding.style.opacity = '';
          });
      }
    }
  },

  /**
   * Expand the grouped row children
   * @private
   * @param {object} rowElement The row DOM element
   */
  toggleGroupChildren(rowElement) {
    if (!this.settings.groupable) {
      return;
    }

    const self = this;
    const rowIdx = rowElement.index();
    let childrenLeft = $();
    let children = $();
    let childrenRight = $();

    if (this.hasLeftPane) {
      childrenLeft = this.tableLeft.find('tbody tr').eq(rowIdx).nextUntil('.datagrid-rowgroup-header');
    }
    children = this.table.find('tbody tr').eq(rowIdx).nextUntil('.datagrid-rowgroup-header');
    if (this.hasRightPane) {
      childrenRight = this.tableRight.find('tbody tr').eq(rowIdx).nextUntil('.datagrid-rowgroup-header');
    }
    const expandButton = rowElement.find('.datagrid-expand-btn');

    if (rowElement.hasClass('is-expanded')) {
      expandButton.removeClass('is-expanded')
        .find('.plus-minus').removeClass('active');

      childrenLeft.hide();
      childrenLeft.addClass('is-hidden');
      children.hide();
      children.addClass('is-hidden');
      childrenRight.hide();
      childrenRight.addClass('is-hidden');
      self.element.triggerHandler('collapserow', [{ grid: self, row: rowElement.index(), detail: children, item: {} }]);

      rowElement.removeClass('is-expanded');
    } else {
      expandButton.addClass('is-expanded')
        .find('.plus-minus').addClass('active');

      childrenLeft.show();
      childrenLeft.removeClass('is-hidden');
      children.show();
      children.removeClass('is-hidden');
      childrenRight.show();
      childrenRight.removeClass('is-hidden');
      self.element.triggerHandler('expandrow', [{ grid: self, row: rowElement.index(), detail: children, item: {} }]);

      rowElement.addClass('is-expanded');
    }
  },

  /**
   * Set the current datagrid sort column
   * @param {string} id The column id
   * @param {boolean} ascending Set the sort in ascending or descending order
   */
  setSortColumn(id, ascending) {
    let sortColumnChanged = true;
    // Set Direction based on if passed in or toggling existing field
    if (ascending !== undefined) {
      if (this.sortColumn.sortAsc === ascending && this.sortColumn.sortId === id) {
        sortColumnChanged = false;
      }
      this.sortColumn.sortAsc = ascending;
    } else {
      if (this.sortColumn.sortId === id) {
        this.sortColumn.sortAsc = !this.sortColumn.sortAsc;
      } else {
        this.sortColumn.sortAsc = true;
      }
      ascending = this.sortColumn.sortAsc;
    }

    this.sortColumn.sortId = id;
    this.sortColumn.sortField = (this.columnById(id)[0] ? this.columnById(id)[0].field : id);
    this.sortColumn.sortAsc = ascending;

    // Do Sort on Data Set
    this.setSortIndicator(id, ascending);
    if (sortColumnChanged) {
      this.sortDataset();
    }

    if (!this.settings.focusAfterSort && this.activeCell && this.activeCell.isFocused) {
      this.activeCell.isFocused = false;
    }

    if (sortColumnChanged) {
      const wasFocused = this.activeCell.isFocused;

      if (!this.settings.source) {
        this.setTreeDepth();
        this.setRowGrouping();
        this.setTreeRootNodes();
        this.clearCache();
        this.renderRows();
        // Update selected and Sync header checkbox
        this.syncSelectedUI();
      }

      if (wasFocused && this.activeCell.node.length === 1) {
        this.setActiveCell(this.activeCell.row, this.activeCell.cell);
      }

      if (this.filterExpr && this.filterExpr[0] && this.filterExpr[0].column === 'all') {
        this.highlightSearchRows(this.filterExpr[0].value);
      }

      if (this.settings.source) {
        this.triggerSource({ type: 'sorted' });
      }
    }
    this.tableBody.removeClass('is-loading');
    this.saveUserSettings();
    this.validateAll();
    this.element.trigger('sorted', [this.sortColumn]);
  },

  /**
   * Sort the currently attached dataset.
   * @private
   */
  sortDataset() {
    if (this.settings.disableClientSort) {
      this.restoreSortOrder = true;
      return;
    }

    if (this.settings.groupable && this.originalDataset) {
      this.settings.dataset = this.originalDataset;
    }
    const sort = this.sortFunction(this.sortColumn.sortId, this.sortColumn.sortAsc);

    this.saveDirtyRows();
    this.settings.dataset.sort(sort);
    this.setTreeDepth();
    this.restoreDirtyRows();

    // Resync the _selectedRows array
    if (this.settings.selectable) {
      this.syncDatasetWithSelectedRows();
    }
  },

  /**
   * Set current data to sync up dirtyArray before sort
   */
  saveDirtyRows() {
    const s = this.settings;
    let dataset = s.treeGrid ? s.treeDepth : s.dataset;
    if (this.settings.groupable) {
      dataset = this.originalDataset || dataset;
    }
    if (s.showDirty && !this.settings.source && this.dirtyArray && this.dirtyArray.length) {
      for (let i = 0, l = dataset.length; i < l; i++) {
        if (typeof this.dirtyArray[i] !== 'undefined') {
          const node = s.treeGrid ? dataset[i].node : dataset[i];
          node.tempNodeIndex = i;
        }
      }
    }
  },

  /**
  * Set current data to sync up dirtyArray after sort
  * @private
  * @returns {void}
  */
  restoreDirtyRows() {
    const s = this.settings;
    let dataset = s.treeGrid ? s.treeDepth : s.dataset;
    if (this.settings.groupable) {
      dataset = this.originalDataset || dataset;
    }
    if (s.showDirty && this.dirtyArray && this.dirtyArray.length) {
      const changes = [];
      for (let i = 0, l = dataset.length; i < l; i++) {
        const node = s.treeGrid ? dataset[i].node : dataset[i];
        if (typeof node.tempNodeIndex !== 'undefined') {
          changes.push({ newIdx: i, oldIdx: node.tempNodeIndex });
          delete node.tempNodeIndex;
        }
      }
      const newDirtyArray = [];
      for (let i = 0, l = changes.length; i < l; i++) {
        newDirtyArray[changes[i].newIdx] = this.dirtyArray[changes[i].oldIdx];
      }
      this.dirtyArray = newDirtyArray;
    }
  },

  /**
  * Sync the dataset._selected elements with the _selectedRows array
  * @private
  */
  syncDatasetWithSelectedRows() {
    const s = this.settings;
    if (s.source && s.paging && s.allowSelectAcrossPages && s.columnIds?.length) {
      return;
    }

    this._selectedRows = [];
    const dataset = s.treeGrid ? s.treeDepth : s.dataset;
    let idx = -1;

    for (let i = 0, data; i < dataset.length; i++) {
      if (s.groupable && !this.originalDataset) {
        // Object.values is not supported in IE11; hence usage of Object.keys and Map
        for (let k = 0; k < Object.keys(dataset[i]).length; k++) {
          idx++;
          data = Object.keys(dataset[i]).map(v => dataset[i][v]);
          if (this.isRowSelected(data)) {
            this._selectedRows.push({
              idx,
              data,
              elem: this.dataRowNode(idx),
              group: dataset[i],
              page: this.pagerAPI ? this.pagerAPI.activePage : 1,
              pagingIdx: idx,
              pagesize: this.settings.pagesize
            });
          }
        }
      } else {
        data = s.treeGrid ? dataset[i].node : dataset[i];
        if (this.isRowSelected(data)) {
          this._selectedRows.push({
            idx: i,
            data,
            elem: this.visualRowNode(i),
            pagesize: this.settings.pagesize,
            page: this.pagerAPI ? this.pagerAPI.activePage : 1,
            pagingIdx: i
          });
        }
      }
    }
  },

  /**
   * Set the sort indicator on the column.
   * @private
   * @param {string} id The column id
   * @param {boolean} ascending Set the sort in ascending or descending order
   */
  setSortIndicator(id, ascending) {
    if (!this.headerRow) {
      return;
    }

    this.sortColumn = {
      sortId: id,
      sortAsc: ascending,
      sortField: (this.columnById(id)[0] ? this.columnById(id)[0].field : id)
    };

    // Set Visual Indicator
    this.element.find('.is-sorted-asc, .is-sorted-desc')
      .removeClass('is-sorted-asc is-sorted-desc');

    this.element.find(`[data-column-id="${id}"]`)
      .addClass(ascending ? 'is-sorted-asc' : 'is-sorted-desc')
      .attr('aria-sort', ascending ? 'ascending' : 'descending');
  },

  /**
  * Overridable function to conduct array sorting
  * @param {string} id The matching field/id in the array to sort on
  * @param {boolean} ascending Determines direction of the sort.
  * @returns {boolean} If found.
  */
  sortFunction(id, ascending) {
    const column = this.columnById(id);
    // Assume the field and id match if no column found
    const col = column.length === 0 ? null : column[0];
    const field = col === null ? id : col.field;

    const self = this;
    const primer = function (a) {
      a = (a === undefined || a === null ? '' : a);

      if (typeof a === 'string') {
        a = a.toUpperCase();

        if ($.isNumeric(a)) {
          a = parseFloat(a);
        }
      }
      return a;
    };

    let key = function (x) { return primer(self.fieldValue(x, field)); };
    if (col && col.sortFunction) {
      key = function (x) { return col.sortFunction(self.fieldValue(x, field)); };
    }

    ascending = !ascending ? -1 : 1;

    return function (a, b) {
      a = key(a);
      b = key(b);

      if (typeof a !== typeof b) {
        a = a.toString().toLowerCase();
        b = b.toString().toLowerCase();
      }

      return ascending * ((a > b) - (b > a));
    };
  },

  /**
   * The default formatter to use (just plain text). When no formatter is specified.
   * @param  {number} row The rowindex
   * @param  {number} cell The cell index
   * @param  {any} value The data value
   * @returns {string} The html string
   */
  defaultFormatter(row, cell, value) {
    return ((value === null || value === undefined || value === '') ? '' : value.toString());
  },

  /**
  * Add the pager and paging functionality.
  * @private
  */
  handlePaging() {
    if (!this.settings.paging) {
      return;
    }

    this.element.addClass('paginated');
    this.tableBody.pager({
      componentAPI: this,
      dataset: this.settings.dataset,
      hideOnOnePage: this.settings.hidePagerOnOnePage,
      source: this.settings.source,
      pagesize: this.settings.pagesize,
      indeterminate: this.settings.indeterminate,
      rowTemplate: this.settings.rowTemplate,
      pagesizes: this.settings.pagesizes,
      pageSizeSelectorText: this.settings.groupable ? 'GroupsPerPage' : 'RecordsPerPage',
      showPageSizeSelector: this.settings.showPageSizeSelector,
      activePage: this.restoreActivePage ? parseInt(this.savedActivePage, 10) : 1
    });

    if (this.restoreActivePage) {
      this.savedActivePage = null;
      this.restoreActivePage = false;
    }
  },

  /**
  * Add the pager and paging functionality.
  * @param {string} pagingInfo The paging object with activePage ect used by pager.js
  * @param {boolean} isResponse Internal flag used to prevent callbacks from rexecuting.
  * @param {function} callback The callback function.
  */
  renderPager(pagingInfo, isResponse, callback) {
    if (!this.pagerAPI) {
      return;
    }

    if (!this.settings.source) {
      this.pagerAPI.settings.dataset = this.settings.dataset;
      pagingInfo.isFilteredClientside = true;
    }

    this.pagerAPI.updatePagingInfo(pagingInfo, isResponse);

    if (!isResponse) {
      this.triggerSource(pagingInfo, callback);
    }

    // Update selected and Sync header checkbox
    this.syncSelectedUI();
  },

  /**
   * Reliably gets all the pre-rendered elements in the container and returns them for use.
   * @private
   * @returns {array} TThe pagable items
   */
  getPageableElements() {
    let elements = this.element.children().not('.datagrid-expandable-row');
    if (elements.is('table')) {
      elements = elements.find('tbody tr');
    }
    return elements;
  },

  /**
  * Add grid tooltip to the page.
  * @private
  * @param {string} extraClass class to add to target uniqueness
  * @returns {void}
  */
  appendTooltip(extraClass) {
    const defaultClass = 'grid-tooltip';
    const regExp = new RegExp(`\\b${defaultClass}\\b`, 'g');

    // Set default css class
    if (typeof extraClass === 'string') {
      if (!regExp.test(extraClass)) {
        extraClass += ` ${defaultClass}`;
      }
    } else {
      extraClass = defaultClass;
    }

    // Unique id for tooltip
    const tooltipId = this.uniqueId('tooltip');
    this.tooltip = document.getElementById(tooltipId);

    if (!this.tooltip) {
      const tooltip = '' +
        `<div id="${tooltipId}" class="tooltip ${extraClass} is-hidden">
          <div class="arrow"></div>
          <div class="tooltip-content"></div>
        </div>`;
      document.body.insertAdjacentHTML('beforeend', tooltip);

      this.tooltip = document.getElementById(tooltipId);

      if (this.isTouch) {
        this.tooltip.style.pointerEvents = 'auto';
        $(this.tooltip).on('touchend.gridtooltip', () => {
          this.hideTooltip();
        });
      }
    }
  },

  /**
   * Cache tooltip content so it can use for more then once
   * @private
   * @param  {object} elem The element to be cached.
   * @param  {object} tooltip Optional to cache given data.
   * @returns {object} tooltip object.
   */
  cacheTooltip(elem, tooltip) {
    if (typeof tooltip === 'undefined') {
      const contentTooltip = elem.querySelector('.is-editor.content-tooltip');
      const aTitle = elem.querySelector('a[title]');
      const isRowstatus = DOM.hasClass(elem, 'rowstatus-cell');
      const isSvg = elem.tagName.toLowerCase() === 'svg';
      const isTh = elem.tagName.toLowerCase() === 'th';
      const isHeaderColumn = DOM.hasClass(elem, 'datagrid-column-wrapper');
      const isHeaderFilter = DOM.hasClass(elem.parentNode, 'datagrid-filter-wrapper');
      const cell = elem.getAttribute('aria-colindex') - 1;
      const col = this.columnSettings(cell);
      let title;

      tooltip = { content: '', wrapper: elem.querySelector('.datagrid-cell-wrapper') };

      if (isTh || isHeaderColumn || isHeaderFilter) {
        tooltip.wrapper = elem;
        tooltip.distance = isHeaderFilter ? 15 : null;
        tooltip.placement = isHeaderColumn ? 'top' : 'bottom';
      }

      // Cache rowStatus cell
      if (isRowstatus || isSvg) {
        const rowNode = this.closest(elem, el => DOM.hasClass(el, 'datagrid-row'));
        const classList = rowNode ? rowNode.classList : [];
        tooltip.isError = classList.contains('rowstatus-row-error');
        tooltip.placement = 'right';

        // For nonVisibleCellErrors
        if (isSvg) {
          tooltip.wrapper = this.closest(elem, el => el.tagName.toLowerCase() === 'td');
        }
      }

      if (contentTooltip) {
        // Used with rich text editor
        const width = col.editorOptions &&
          col.editorOptions.width ? this.setUnit(col.editorOptions.width) : false;

        // Width for tooltip can be come from column options
        const newContentTooltip = $(contentTooltip).clone()[0];
        newContentTooltip.style.width = width || `${elem.offsetWidth}px`;
        const tooltipHTML = newContentTooltip.outerHTML;

        if (xssUtils.stripHTML(tooltipHTML) !== '') {
          tooltip.content = tooltipHTML;
          tooltip.extraClassList = ['popover', 'alternate', 'content-tooltip'];
        }
      } else if (aTitle) {
        // Title attribute on links `a`
        tooltip.content = aTitle.getAttribute('title');
        aTitle.removeAttribute('title');
      } else {
        title = elem.getAttribute('title');
        if (title) {
          const disableButton = elem.querySelector('.row-btn[disabled]');
          // Title attribute on current element
          tooltip.content = disableButton ? '' : title;
          elem.removeAttribute('title');
        } else if (isTh && !isHeaderFilter) {
          const targetEl = elem.querySelector('.datagrid-header-text');
          tooltip.content = targetEl ? xssUtils.stripHTML(targetEl.textContent) : '';
        } else if (isHeaderFilter) {
          // Disabled filterable headers
          const filterDisabled = elem.parentNode.querySelectorAll('.dropdown.is-disabled, input[type="text"][disabled], .btn-filter[disabled]').length > 0;
          if (!filterDisabled) {
            const targetEl = elem.parentNode.querySelector('.is-checked');
            tooltip.content = targetEl ? xssUtils.stripHTML(targetEl.textContent) : '';
          }
        } else {
          // Default use wrapper content
          if (tooltip.wrapper.querySelector('.datagrid-expand-btn')) {
            Array.prototype.filter
              .call(tooltip.wrapper.children, node => !node.matches('.datagrid-expand-btn'))
              .forEach((node) => {
                tooltip.content = node.textContent;
              });
          } else {
            tooltip.content = tooltip.wrapper.textContent;
          }
          tooltip.content = xssUtils.stripHTML(tooltip.content).trim();
        }
      }

      // Clean up text in selects
      const select = tooltip.wrapper.querySelector('select');
      if (select && select.selectedIndex &&
        select.options[select.selectedIndex] &&
        select.options[select.selectedIndex].innerHTML) {
        tooltip.content = env.features.touch ? '' : select.options[select.selectedIndex].innerHTML.trim();
      }

      if (isTh) {
        tooltip.content = tooltip.content.trim();
      }

      if (tooltip.content !== '') {
        const isEllipsis = DOM.hasClass((isHeaderColumn ? elem.parentNode : elem), 'text-ellipsis');
        const icons = [].slice.call(elem.querySelectorAll('.icon'));
        let extraWidth = isEllipsis ? 8 : 0;
        icons.forEach((icon) => {
          const rect = typeof icon.getBBox === 'function' ? icon.getBBox() : icon.getBoundingClientRect();
          extraWidth += rect.width + 8;
        });

        // Treegrid handle indented area (1st column)
        if (this.settings.treeGrid) {
          const presenceOf = selector => !!tooltip.wrapper.querySelector(selector);
          if (presenceOf('.datagrid-tree-node') || presenceOf('.datagrid-expand-btn')) {
            const rowElem = this.closest(tooltip.wrapper, el => DOM.hasClass(el, 'datagrid-row'));
            const level = parseInt(rowElem.getAttribute('aria-level'), 10);
            if (level) {
              extraWidth += (level * 30); // Each level 30px margin
            }
          }
        }

        if (isEllipsis && isHeaderColumn) {
          const textEl = elem.querySelector('.datagrid-header-text');
          tooltip.textwidth = textEl.scrollWidth + (select ? 0 : extraWidth);
        } else {
          tooltip.textwidth = stringUtils.textWidth(tooltip.content) + (select ? 0 : extraWidth);
        }

        if (isTh) {
          tooltip.textwidth = stringUtils.textWidth(tooltip.content);
        }

        tooltip.content = contentTooltip ? tooltip.content : `<p>${tooltip.content}</p>`;
        if (title || isHeaderFilter) {
          tooltip.forced = true;
        }
      }

      if (typeof col.tooltip === 'function') {
        const rowElem = this.closest(elem, el => DOM.hasClass(el, 'datagrid-row'));
        let rowIdx;
        let rowData;

        if (this.settings.treeGrid && this.settings.treeDepth) {
          rowIdx = this.actualRowIndex(rowElem);
          rowData = this.settings.treeDepth[rowIdx].node;
        } else {
          rowIdx = this.dataRowIndex(rowElem);
          rowData = this.settings.dataset[rowIdx];
        }

        const value = this.fieldValue(rowData, col.field);
        tooltip.content = col.tooltip(rowIdx, cell, value, col, rowData, this);
        tooltip.textwidth = stringUtils.textWidth(tooltip.content) + 20;
        if (tooltip.content !== undefined && tooltip.content !== null && tooltip.content !== '') {
          tooltip.forced = true;
        }
      }
    }

    elem = elem instanceof jQuery ? elem : $(elem);
    elem.data('gridtooltip', tooltip);
    return tooltip;
  },

  /**
   * Show Tooltip
   * @private
   * @param  {object} [options] for tooltip.
   * @param  {string} [options.content] The tooltip contents.
   * @param  {object} [options.wrapper] The parent DOM element.
   * @param  {boolean} [options.isError] True for if is error color.
   * @param  {string} [options.placement] 'top'|'right'|'bottom'|'left'.
   * @param  {array} [options.extraClassList] list of css classes to be added to tooltip.
   * @returns {void}
   */
  showTooltip(options) {
    if (this.tooltip) {
      const tooltip = $(this.tooltip);
      const tooltipContentEl = this.tooltip.querySelector('.tooltip-content');
      if (tooltipContentEl) {
        tooltipContentEl.innerHTML = options.content;
        this.tooltip.classList.remove('is-hidden', 'top', 'right', 'bottom', 'left');
        this.tooltip.style.display = '';
        this.tooltip.classList.add(options.placement || 'top');

        if (options.isError) {
          this.tooltip.classList.add('is-error');
        }
        if (options.extraClassList) {
          options.extraClassList.map(className => this.tooltip.classList.add(className));
        }

        const distance = typeof options.distance === 'number' ? options.distance : 10;
        const placeOptions = {
          x: 0,
          y: distance,
          container: this.element.closest('.page-container.scrollable') || $('body'),
          containerOffsetX: options.wrapper.offsetLeft,
          containerOffsetY: options.wrapper.offsetTop,
          parent: $(options.wrapper),
          placement: options.placement || 'top',
          strategies: ['flip', 'nudge']
        };
        if (placeOptions.placement === 'left' || placeOptions.placement === 'right') {
          placeOptions.x = distance;
          placeOptions.y = 0;
        }

        tooltip
          .one('afterplace.gridtooltip', (e, placementObj) => {
            this.handleAfterPlaceTooltip(e, tooltip, placementObj);
          })
          .on('click.gridtooltip', () => {
            this.hideTooltip();
          });

        // If not already have place instance
        if (!tooltip.data('place')) {
          tooltip.place(placeOptions);
        }

        // Apply place
        tooltip.data('place').place(placeOptions);

        // Flag to mark as gridtooltip
        tooltip.data('gridtooltip', true);

        // Hide the tooltip when the page scrolls.
        $('body, .scrollable').off('scroll.gridtooltip').on('scroll.gridtooltip', () => {
          this.hideTooltip();
        });
      }
    }
  },

  /**
   * Placement behavior's "afterplace" handler.
   * @private
   * @param {jquery.event} e custom `afterPlace` event
   * @param {jquery} tooltip element
   * @param {placementobject} placementObj object containing placement settings
   * @returns {void}
   */
  handleAfterPlaceTooltip(e, tooltip, placementObj) {
    const elem = tooltip || $('#tooltip');
    if (elem[0]) {
      elem.data('place').setArrowPosition(e, placementObj, elem);
      elem.triggerHandler('tooltipafterplace', [placementObj]);
    }
  },

  /**
   * Hide the visible tooltip.
   * @private
   * @returns {void}
   */
  hideTooltip() {
    if (this.tooltip) {
      this.removeTooltipData(this.tooltip); // Remove flag as gridtooltip
      this.tooltip.classList.add('is-hidden');
      this.tooltip.classList.remove('is-error', 'popover', 'alternate', 'content-tooltip');
      this.tooltip.style.left = '-999px';
    }

    // Remove scroll events
    $('body, .scrollable').off('scroll.gridtooltip', () => {
      this.hideTooltip();
    });
  },

  /**
   * Check for tooltip type gridtooltip or component
   * @private
   * @returns {boolean} True if is gridtooltip
   */
  isGridtooltip() {
    let isGridtooltipType = false;
    if (this.tooltip) {
      const tooltipJQ = this.tooltip instanceof jQuery ? this.tooltip : $(this.tooltip);
      if (tooltipJQ.data('gridtooltip')) {
        isGridtooltipType = true;
      }
    }
    return isGridtooltipType;
  },

  /**
   * Remove the tooltip data from given node
   * @private
   * @param {object} elem The DOM element to remove data
   * @returns {void}
   */
  removeTooltipData(elem) {
    elem = elem instanceof jQuery ? elem : $(elem);
    if (elem.data('gridtooltip')) {
      $.removeData(elem[0], 'gridtooltip');
    }
  },

  /**
   * Remove the tooltip from the DOM
   * @private
   * @returns {void}
   */
  removeTooltip() {
    if (this.tooltip) {
      const tooltip = $(this.tooltip);

      // Set selector
      const selector = {
        th: '.datagrid-header th',
        td: '.datagrid-wrapper tbody tr.datagrid-row td[role="gridcell"]:not(.rowstatus-cell)',
        rowstatus: '.datagrid-wrapper tbody tr.datagrid-row td[role="gridcell"] .icon-rowstatus'
      };
      selector.str = `${selector.th}, ${selector.td}, ${selector.rowstatus}`;

      // Unbind events
      $('body, .scrollable').off('scroll.gridtooltip');
      tooltip.off('touchend.gridtooltip');
      this.element.off('mouseenter.gridtooltip mouseleave.gridtooltip click.gridtooltip longpress.gridtooltip keydown.gridtooltip', selector.str);

      if (this.toolbar && this.toolbar.parent().find('.table-errors').length > 0) {
        this.toolbar.parent().find('.table-errors')
          .off('mouseenter.tableerrortooltip', '.icon')
          .off('mouseleave.tableerrortooltip click.tableerrortooltip', '.icon')
          .off('longpress.tableerrortooltip', '.icon');
      }

      // Remove the place component
      const placeApi = tooltip.data('place');
      if (placeApi) {
        placeApi.destroy();
      }

      // Remove cached tooltip data
      const nodes = [].slice.call(this.element[0].querySelectorAll(selector.str));
      nodes.forEach(node => this.removeTooltipData(node));

      if (this.tooltip.parentNode) {
        this.tooltip.parentNode.removeChild(this.tooltip);
      }
    }
    this.tooltip = undefined;
  },

  /**
  * Unwrap the grid back to a simple div, and destory all events and pointers.
  * @returns {object} The plugin api for chaining.
  */
  destroy() {
    // Remove grid tooltip
    this.removeTooltip();

    $('html').off(`themechanged.${COMPONENT_NAME}`);

    // Unbind context menu events
    this.element.add(this.element.find('*'))
      .off('selected.gridpopupth close.gridpopupth selected.gridpopuptr close.gridpopuptr selected.gridpopupbtn close.gridpopupbtn');

    // UnBind the pager
    if (this.pagerAPI) {
      this.tableBody.off(`page.${COMPONENT_NAME} pagesizechange.${COMPONENT_NAME}`);
      this.pagerAPI.destroy();
    }

    // Remove the toolbar, clean the div out and remove the pager
    this.element.off().empty().removeClass('datagrid-container');
    const toolbar = this.element.prev('.toolbar');

    this.triggerDestroyCell();

    if (this.removeToolbarOnDestroy && this.settings.toolbar &&
      this.settings.toolbar.keywordFilter) {
      const searchfield = toolbar.find('.searchfield');
      const searchfieldApi = searchfield.data('searchfield');
      const xIcon = searchfield.parent().find('.close.icon');
      searchfield.off('keypress.datagrid');
      xIcon.off('click.datagrid');
      if (searchfieldApi && typeof searchfieldApi.destroy === 'function') {
        searchfieldApi.destroy();
      }
      searchfield.removeData('options');
    }

    if (this.removeToolbarOnDestroy) {
      // only remove toolbar if it was created by this datagrid
      if (toolbar.data('toolbar')) {
        toolbar.data('toolbar').destroy();
      }
      toolbar.remove();
    }

    this.element.next('.pager-toolbar').remove();
    $.removeData(this.element[0], COMPONENT_NAME);

    this.element.off();
    $(document).off('touchstart.datagrid touchend.datagrid touchcancel.datagrid click.datagrid touchmove.datagrid');
    $('body').off('resize.vtable resize.datagrid');
    $(window).off('orientationchange.datagrid');
    $(window).off('resize.datagrid');
    return this;
  },

  /**
  * Update the datagrid and optionally apply new settings.
  * @param  {object} settings the settings to update to.
  * @returns {object} The plugin api for chaining.
  */
  updated(settings) {
    this.settings = utils.mergeSettings(this.element, settings, this.settings);

    if (this.pagerAPI && typeof this.pagerAPI.destroy === 'function') {
      this.pagerAPI.destroy();
    }

    if (settings && settings.frozenColumns) {
      this.headerRow = undefined;
      this.element.empty();
      this.firstRender();
    }

    if (settings && settings.dataset) {
      this.settings.dataset = settings.dataset;
    }

    if (settings && settings.columns) {
      this.settings.columns = settings.columns;
    }

    this.render();
    this.handlePaging();

    return this;
  }
};

export { Datagrid, COMPONENT_NAME };
