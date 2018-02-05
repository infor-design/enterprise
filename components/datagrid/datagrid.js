/* eslint-disable no-underscore-dangle, no-continue, no-nested-ternary */
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { excel } from '../utils/excel';
import { Locale } from '../locale/locale';
import { Tmpl } from '../tmpl/tmpl';
import { debounce } from '../utils/debounced-resize';

import { Formatters } from '../datagrid/datagrid.formatters';
import { GroupBy, Aggregators } from '../datagrid/datagrid.groupby';
// eslint-disable-next-line
import { Editors } from '../datagrid/datagrid.editors'; // jshint ignore:line

// The name of this component.
const COMPONENT_NAME = 'datagrid';

/**
* @namespace
* @property {boolean} actionableMode If actionableMode is "true, tab and shift tab
* behave like left and right arrow key, if the cell is editable it goes in and out of edit mode.
* F2 - toggles actionableMode "true" and "false"
* @property {boolean} cellNavigation If cellNavigation is "false, will show border
* around whole row on focus
* @property {boolean} rowNavigation If rowNavigation is "false, will NOT show border
* around the row
* @property {boolean} alternateRowShading Sets shading for readonly grids
* @property {array} columns An array of columns (see column options)
* @property {array} dataset An array of data objects
* @property {boolean} columnReorder Allow Column reorder
* @property {boolean} saveColumns Save Column Reorder and resize
* @property {object} saveUserSettings Save one or all of the following to local
* storage : columns: true, rowHeight: true, sortOrder: true, pagesize: true, activePage: true,
* filter: true
* @property {boolean} editable Enable editing in the grid, requires column editors.
* @property {boolean} isList Makes the grid have readonly "list" styling
* @property {string} menuId  &nbsp;-&nbspId of the menu to use for a row level right click
* context menu
* @property {string} menuSelected Callback for the grid level context menu
* @property {string} menuBeforeOpen Callback for the grid level beforeopen menu event
* @property {string} headerMenuId Id of the menu to use for a header right click
* context menu
* @property {string} headerMenuSelected Callback for the header level context menu
* @property {string} headerMenuBeforeOpen Callback for the header level beforeopen
* menu event
* @property {string} uniqueId Unique ID to use as local storage reference and internal
* variable names
* @property {string} rowHeight Controls the height of the rows / number visible rows.
* May be (short, medium or normal)
* @property {string} selectable Controls the selection Mode this may be:
* false, 'single' or 'multiple' or 'mixed' or 'siblings'
* @property {object} groupable  Controls fields to use for data grouping Use Data
* grouping fx. {fields: ['incidentId'], supressRow: true, aggregator: 'list',
* aggregatorOptions: ['unitName1']}
* @property {boolean} clickToSelect Controls if using a selection mode if you can
* click the rows to select
* @property {object} toolbar  Toggles and appends toolbar features fx..
* @property {Boolean} selectChildren Can prevent selecting of all child nodes on multiselect
* {title: 'Data Grid Header Title', results: true, keywordFilter: true, filter: true,
* rowHeight: true, views: true}
* @property {boolean} initializeToolbar Set to false if you will initialize the
* toolbar yourself
* @property {boolean} paging Enable paging mode
* @property {number} pagesize Number of rows per page
* @property {array} pagesizes Array of page sizes to show in the page size dropdown.
* @property {boolean} indeterminate Disable the ability to go to a specific page when paging.
* @property {Function} source  Callback function for paging
* @property {boolean} hidePagerOnOnePage  If true, hides the pager if there's only
* one page worth of results.
* @property {boolean} filterable Enable Column Filtering, This will require column
* filterTypes as well.
* @property {boolean} disableClientFilter Disable Filter Logic client side and let your
* server do it
* @property {boolean} disableClientSort Disable Sort Logic client side and let your
* server do it
* @property {string} resultsText Can provide a custom function to adjust results text
*  on the toolbar
* @property {boolean} showFilterTotal Paging results display filter count, change to
*  false to not show filtered count
* @property {boolean} rowReorder If set you can reorder rows. Requires rowReorder
*  formatter
* @property {boolean} showDirty  If true the dirty indicator will be shown on the rows
* @property {boolean} showSelectAllCheckBox Allow to hide the checkbox header
* (true to show, false to hide)
* @property {boolean} allowOneExpandedRow Controls if you cna expand more than one
* expandable row.
* @property {boolean} enableTooltips Process tooltip logic at a cost of performance
* @property {boolean} disableRowDeactivation if a row is activated the user should not
*  be able to deactivate it by clicking on the activated row
* @property {boolean} sizeColumnsEqually If true make all the columns equal width
* @property {boolean} expandableRow If true we append an expandable row area without
* the rowTemplate feature being needed.
* @property {boolean} redrawOnResize If set to false we skip redraw logic on the resize
* of the page.
* @property {boolean} exportConvertNegative If set to true export data with trailing
* negative signs moved in front.
* @property {array} columnGroups An array of columns to use for grouped column headers.
* @property {boolean} treeGrid: If true a tree grid is expected so addition
* calculations will be used to calculate of the row children
* @property {Function} onPostRenderCell A call back function that will fire and send
* you the cell container and related information for any cells cells with a component attribute in
* the column definition.
* @property {Function} onDestroyCell A call back that goes along with onPostRenderCel
* and will fire when this cell is destroyed and you need noification of that.
* @property {Function} onEditCell A callback that fires when a cell is edited, the
* editor object is passed in to the function
* @property {Function} onExpandRow A callback function that fires when expanding rows.
* To be used when expandableRow is true. The function gets eventData about the row and grid and a
* response function callback. Call the response function with markup to append and delay opening
* the row.
* @property {object} emptyMessage An empty message will be displayed when there is no
* rows in the grid. This accepts an object of the form emptyMessage: {title: 'No Data Available',
* info: 'Make a selection on the list above to see results', icon: 'icon-empty-no-data',
* button: {text: 'xxx', click: <function>}} set this to null for no message or will default to
* 'No Data Found with an icon.'
*/
const DATAGRID_DEFAULTS = {
  // F2 - toggles actionableMode "true" and "false"
  // If actionableMode is "true, tab and shift tab behave like left and right arrow key,
  // if the cell is editable it goes in and out of edit mode
  actionableMode: false,
  cellNavigation: true, // If cellNavigation is "false, will show border around whole row on focus
  rowNavigation: true, // If rowNavigation is "false, will NOT show border around the row
  alternateRowShading: false,
  columns: [],
  dataset: [],
  columnReorder: false, // Allow Column reorder
  saveColumns: false, // Save Column Reorder and resize
  saveUserSettings: {},
  editable: false,
  isList: false, // Makes a readonly "list"
  menuId: null, // Id to the right click context menu
  headerMenuId: null, // Id to the right click context menu to use for the header
  menuSelected: null, // Callback for the grid level right click menu
  menuBeforeOpen: null, // Call back for the grid level before open menu event
  headerMenuSelected: null, // Callback for the header level right click menu
  headerMenuBeforeOpen: null, // Call back for the header level before open menu event
  uniqueId: null, // Unique ID for local storage reference and variable names
  rowHeight: 'normal', // (short, medium or normal)
  selectable: false, // false, 'single' or 'multiple' or 'siblings'
  selectChildren: true, // can prevent selecting of all child nodes on multiselect
  groupable: null,
  clickToSelect: true,
  toolbar: false,
  initializeToolbar: true, // can set to false if you will initialize the toolbar yourself
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
  disableClientFilter: false, // Disable Filter Logic client side and let your server do it
  disableClientSort: false, // Disable Sort Logic client side and let your server do it
  resultsText: null, // Can provide a custom function to adjust results text
  showFilterTotal: true, // Paging results show filtered count, false to not show.
  virtualized: false, // Prevent Unused rows from being added to the DOM
  virtualRowBuffer: 10, // how many extra rows top and bottom to allow as a buffer
  rowReorder: false, // Allows you to reorder rows. Requires rowReorder formatter
  showDirty: false,
  showSelectAllCheckBox: true, // Allow to hide the checkbox header (true to show, false to hide)
  allowOneExpandedRow: true, // Only allows one expandable row at a time
  enableTooltips: false, // Process tooltip logic at a cost of performance
  disableRowDeactivation: false,
  sizeColumnsEqually: false, // If true make all the columns equal width
  expandableRow: false, // Supply an empty expandable row template
  redrawOnResize: true, // Run column redraw logic on resize
  exportConvertNegative: false, // Export data with trailing negative signs moved in front
  columnGroups: null, // The columns to use for grouped column headings
  treeGrid: false,
  onPostRenderCell: null,
  onDestroyCell: null,
  onEditCell: null,
  onExpandRow: null,
  emptyMessage: { title: (Locale ? Locale.translate('NoData') : 'No Data Available'), info: '', icon: 'icon-empty-no-data' }
};

/**
 * The Datagrid Component displays and process data in tabular format.
 * @class Datagrid
 * @constructor
 * @param {jQuery[]|HTMLElement} element The component element.
 * @param {object} settings The component settings.
 */
function Datagrid(element, settings) {
  this.settings = utils.mergeSettings(element, settings, DATAGRID_DEFAULTS);
  this.element = $(element);
  if (settings.dataset) {
    this.settings.dataset = settings.dataset;
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
  * Init the datagrid from its uninitialized state.
  * @private
  * @returns {void}
  */
  init() {
    const html = $('html');

    this.isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.isFirefoxMac = (navigator.platform.indexOf('Mac') !== -1 && navigator.userAgent.indexOf(') Gecko') !== -1);
    this.isIe = html.is('.ie');
    this.isIe9 = html.is('.ie9');
    this.isSafari = html.is('.is-safari');
    this.isWindows = (navigator.userAgent.indexOf('Windows') !== -1);
    this.initSettings();
    this.originalColumns = this.columnsFromString(JSON.stringify(this.settings.columns));
    this.removeToolbarOnDestroy = false;
    this.nonVisibleCellErrors = [];

    this.restoreColumns();
    this.restoreUserSettings();
    this.appendToolbar();
    this.setTreeDepth();
    this.setRowGrouping();
    this.setTreeRootNodes();
    this.firstRender();
    this.handlePaging();
    this.handleEvents();
    this.handleKeys();

    /**
    * Fires when the grid is complete done rendering
    *
    * @event close
    * @property {object} event - The jquery event object
    * @property {array} ui - An array with references to the domElement, header and pagerBar
    */
    setTimeout(() => {
      this.element.trigger('rendered', [this.element, this.headerRow, this.pagerBar]);
    }, 0);
  },

  /**
  * Initialize internal variables and states.
  * @private
  */
  initSettings() {
    this.sortColumn = { sortField: null, sortAsc: true };
    this.gridCount = $('.datagrid').length + 1;
    this.lastSelectedRow = 0; // Remember index to use shift key

    this.contextualToolbar = this.element.prev('.contextual-toolbar');
    this.contextualToolbar.addClass('datagrid-contextual-toolbar');
  },

  /**
  * Render or render both the header and row area.
  */
  render() {
    this.loadData(this.settings.dataset);
  },

  /**
  * Run the initial render on the Header and Rows.
  * @private
  */
  firstRender() {
    const self = this;

    self.contentContainer = $('<div class="datagrid-body"></div>');

    if (this.settings.dataset === 'table') {
      self.table = $(this.element).addClass('datagrid');

      const wrapper = $(this.element).closest('.datagrid-container');
      if (wrapper.length === 0) {
        self.table.wrap('<div class="datagrid-container"></div>');
        this.element = self.table.closest('.datagrid-container');
      }

      self.settings.dataset = self.htmlToDataset();
      self.table.remove();
      self.table = $('<table></table>').addClass('datagrid').attr('role', 'grid').appendTo(self.contentContainer);
    } else {
      self.table = $('<table></table>').addClass('datagrid').attr('role', this.settings.treeGrid ? 'treegrid' : 'grid').appendTo(self.contentContainer);
      this.element.addClass('datagrid-container').attr('x-ms-format-detection', 'none');
    }

    if (this.isWindows) {
      this.element.addClass('is-windows'); // need since scrollbars are visible
    }

    // initialize row height by a setting
    if (this.settings.rowHeight !== 'normal') {
      self.table.addClass(`${this.settings.rowHeight}-rowheight`);
      this.element.addClass(`${this.settings.rowHeight}-rowheight`);
    }

    // A treegrid is considered not editable unless otherwise specified.
    if (this.settings.treeGrid && !this.settings.editable) {
      self.table.attr('aria-readonly', 'true');
    }

    if (this.settings.isList) {
      $(this.element).addClass('is-gridlist');
    } else {
      $(this.element).removeClass('is-gridlist');
    }

    self.table.empty();
    self.clearHeaderCache();
    self.renderRows();
    self.element.append(self.contentContainer);
    self.renderHeader();
    self.container = self.element.closest('.datagrid-container');

    if (this.settings.emptyMessage) {
      self.setEmptyMessage(this.settings.emptyMessage);
    }

    self.settings.buttonSelector = '.btn, .btn-secondary, .btn-primary, .btn-modal-primary, .btn-tertiary, .btn-icon, .btn-actions, .btn-menu, .btn-split';
    $(self.settings.buttonSelector, self.table).button();
  },

  /**
  * If the datagrid is a html table, convert that table to an internal dataset to use.
  * @private
  * @returns {void}
  */
  htmlToDataset() {
    const rows = $(this.element).find('tbody tr');
    const self = this;
    const specifiedCols = (self.settings.columns.length > 0);
    const dataset = [];

    // Geneate the columns if not supplier
    if (!specifiedCols) {
      const headers = $(this.element).find('thead th');
      const firstRow = self.element.find('tbody tr:first()');

      headers.each((i, col) => {
        const colSpecs = {};
        const column = $(col);
        const colName = `column${i}`;

        colSpecs.id = column.text().toLowerCase();
        colSpecs.name = column.text();
        colSpecs.field = colName;

        const link = firstRow.find('td').eq(i).find('a');
        if (link.length > 0) {
          colSpecs.formatter = Formatters.Hyperlink;
          colSpecs.href = link.attr('href');
        }

        self.settings.columns.push(colSpecs);
      });
    }

    rows.each(function () {
      const cols = $(this).find('td');
      const newRow = {};

      cols.each((i, col) => {
        const column = $(col);
        const colName = `column${i}`;

        if (self.settings.columns[i].formatter) {
          newRow[colName] = column.text();
        } else {
          newRow[colName] = column.html();
        }

        if (specifiedCols) {
          self.settings.columns[i].field = colName;
        }
      });

      dataset.push(newRow);
    });

    return dataset;
  },

  /**
  * Add a row of data to the grid and dataset.
  * @param {object} data An data row object
  * @param {string} location Where to add the row. This can be 'top' or leave off for 'bottom'
  */
  addRow(data, location) {
    const self = this;
    let isTop = false;
    let row = 0;
    const cell = 0;
    let args;
    let rowNode;

    if (!location || location === 'top') {
      location = 'top';
      isTop = true;
    }
    // Add row status
    data.rowStatus = { icon: 'new', text: 'New', tooltip: 'New' };

    // Add to array
    if (typeof location === 'string') {
      self.settings.dataset[isTop ? 'unshift' : 'push'](data);
    } else {
      self.settings.dataset.splice(location, 0, data);
    }

    // Add to ui
    self.renderRows();

    // Sync with others
    self.syncSelectedUI();

    // Set active and fire handler
    setTimeout(() => {
      row = isTop ? row : self.settings.dataset.length - 1;
      self.setActiveCell(row, cell);

      rowNode = self.tableBody.find(`tr[aria-rowindex="${row + 1}"]`);
      args = { row, cell, target: rowNode, value: data, oldValue: [] };

      self.pagerRefresh(location);
      self.element.triggerHandler('addrow', args);
    }, 10);
  },

  /**
  * Refresh the pager based on the current page and dataset.
  * @param {object} location Deprecated - Can be set to 'top' or left off for bottom pager.
  */
  pagerRefresh(location) {
    if (this.pager) {
      if (typeof location === 'string') {
        this.pager.activePage = location === 'top' ? 1 : this.pager._pageCount;
      } else if (typeof location === 'number') {
        this.pager.activePage = Math.floor(location / (this.pager.settings.pagesize + 1));
      }

      if (!this.settings.source) {
        this.pager.pagingInfo = $.extend({}, this.pager.pagingInfo, {
          activePage: this.pager.activePage,
          total: this.settings.dataset.length,
          pagesize: this.settings.pagesize
        });
      }
      this.renderPager(this.pager.pagingInfo, true);
    }
  },

  /**
  * Remove a row of data to the grid and dataset.
  * @param {number} row The row index
  * @param {boolean} nosync Dont sync the selected rows.
  */
  removeRow(row, nosync) {
    const rowNode = this.tableBody.find(`tr[aria-rowindex="${row + 1}"]`);
    const rowData = this.settings.dataset[row];

    this.unselectRow(row, nosync);
    this.settings.dataset.splice(row, 1);
    this.renderRows();
    this.element.trigger('rowremove', { row, cell: null, target: rowNode, value: [], oldValue: rowData });
  },

  /**
  * Remove all selected rows from the grid and dataset.
  */
  removeSelected() {
    const self = this;
    const selectedRows = this.selectedRows();

    for (let i = selectedRows.length - 1; i >= 0; i--) {
      self.removeRow(selectedRows[i].idx, true);
    }
    this.pagerRefresh();
    this.syncSelectedUI();
  },

  /**
  * Send in a new data set to display in the datagrid.
  * @param {object} dataset The array of objects to show in the grid. Should match
  * the column definitions.
  * @param {object} pagerInfo The pager info object with information like activePage ect.
  */
  updateDataset(dataset, pagerInfo) {
    this.loadData(dataset, pagerInfo);
  },

  /**
  * Trigger the source method to call to the backend on demand.
  *
  * @param {object} pagerType The pager info object with information like activePage ect.
  * @param {function} callback Thecall back functions
  */
  triggerSource(pagerType, callback) {
    this.pager.pagerInfo = this.pager.pagerInfo || {};
    this.pager.pagerInfo.type = pagerType;

    if (pagerType !== 'refresh') {
      this.pager.pagerInfo.activePage = 1;
    }

    this.renderPager(this.pager.pagerInfo, false, () => {
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  },

  /**
  * Send in a new data set to display in the datagrid. Use better named updateDataset
  * @deprecated
  * @private
  * @param {object} dataset The array of objects to show in the grid.
  * Should match the column definitions.
  * @param {object} pagerInfo The pager info object with information like activePage ect.
  * @param {object} isResponse Called internally if the load data is response
  */
  loadData(dataset, pagerInfo, isResponse) {
    this.settings.dataset = dataset;

    if (!pagerInfo) {
      pagerInfo = {};
    }

    if (!pagerInfo.activePage) {
      pagerInfo.activePage = 1;
      pagerInfo.pagesize = this.settings.pagesize;
      pagerInfo.total = -1;
      pagerInfo.type = 'initial';
    }

    if (this.settings.source && pagerInfo.grandTotal) {
      this.grandTotal = pagerInfo.grandTotal;
    } else {
      this.grandTotal = null;
    }

    if (this.pager) {
      if (pagerInfo.activePage > -1) {
        this.pager.activePage = pagerInfo.activePage;
      }
      this.pager.settings.dataset = dataset;
    }

    // Update Paging and Clear Rows
    this.setTreeDepth();
    this.setRowGrouping();
    this.setTreeRootNodes();

    if (pagerInfo && !pagerInfo.preserveSelected) {
      this.unSelectAllRows();
    }

    // Resize and re-render if have a new dataset
    // (since automatic column sizing depends on the dataset)
    if (pagerInfo.type === 'initial') {
      this.clearHeaderCache();
      this.restoreUserSettings();
      this.renderRows();
      this.renderHeader();
    } else {
      this.renderRows();
    }

    this.renderPager(pagerInfo, isResponse);
    this.syncSelectedUI();
    this.displayCounts(pagerInfo.total);
  },

  /**
  * Generate a unique id based on the page and grid count. Add a suffix.
  * @deprecated
  * @private
  * @param {object} suffix Add this string to make the id more unique
  * @returns {string} The unique id.
  */
  uniqueId(suffix) {
    const uniqueid = this.settings.uniqueId ?
      `${this.settings.uniqueId}-${suffix}` :
      (`${window.location.pathname.split('/').pop()
        .replace(/\.xhtml|\.shtml|\.html|\.htm|\.aspx|\.asp|\.jspx|\.jsp|\.php/g, '')
        .replace(/[^-\w]+/g, '')
        .replace(/\./g, '-')
        .replace(/ /g, '-')
        .replace(/%20/g, '-')}-${
        this.element.attr('id') || 'datagrid'}-${this.gridCount}${suffix}`);

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
  * Returns the index of the last column.
  * @private
  * @returns {number} The last columns index.
  */
  lastColumnIdx() {
    let last = 0;

    if (this.lastColumn) {
      return this.lastColumn;
    }

    for (let j = 0; j < this.settings.columns.length; j++) {
      const column = this.settings.columns[j];

      if (column.hidden) {
        continue;
      }

      last = j;
    }

    this.lastColumn = last;
    return last;
  },

  /**
  * Gets an if for the column group used for grouped headers.
  * @param {object} idx The index of the column group
  * @returns {string} The name of the column group
  */
  getColumnGroup(idx) {
    let total = 0;
    const colGroups = this.settings.columnGroups;

    for (let l = 0; l < colGroups.length; l++) {
      total += colGroups[l].colspan;

      if (total >= idx) {
        return this.uniqueId(`-header-group-${l}`);
      }
    }

    return '';
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
  * Render the header area.
  * @private
  */
  renderHeader() {
    const self = this;
    let headerRow = '';
    let headerColGroup = '<colgroup>';
    let cols = '';
    let uniqueId;
    let hideNext = 0;

    // Handle Nested Headers
    const colGroups = this.settings.columnGroups;
    if (colGroups) {
      this.element.addClass('has-group-headers');

      let total = 0;

      headerRow += '<tr role="row" class="datagrid-header-groups">';

      for (let k = 0; k < colGroups.length; k++) {
        total += parseInt(colGroups[k].colspan, 10);
        uniqueId = self.uniqueId(`-header-group-${k}`);

        headerRow += `<th colspan="${colGroups[k].colspan}" id="${uniqueId}"><div class="datagrid-column-wrapper "><span class="datagrid-header-text">${colGroups[k].name}</span></div></th>`;
      }

      if (total < this.visibleColumns().length) {
        headerRow += `<th colspan="${this.visibleColumns().length - total}"></th>`;
      }
      headerRow += '</tr><tr>';
    } else {
      headerRow += '<tr role="row">';
    }

    for (let j = 0; j < this.settings.columns.length; j++) {
      const column = self.settings.columns[j];
      const id = self.uniqueId(`-header-${j}`);
      const isSortable = (column.sortable === undefined ? true : column.sortable);
      const isResizable = (column.resizable === undefined ? true : column.resizable);
      const isExportable = (column.exportable === undefined ? true : column.exportable);
      const isSelection = column.id === 'selectionCheckbox';
      const alignmentClass = (column.align === 'center' ? ` l-${column.align}-text` : '');// Disable right align for now as this was acting wierd

      if (hideNext <= 0) {
        headerRow += `<th scope="col" role="columnheader" class="${isSortable ? 'is-sortable' : ''}${isResizable ? ' is-resizable' : ''
        }${column.hidden ? ' is-hidden' : ''}${column.filterType ? ' is-filterable' : ''
        }${alignmentClass || ''}"${column.colspan ? ` colspan="${column.colspan}"` : ''
        } id="${id}" data-column-id="${column.id}"${column.field ? ` data-field="${column.field}"` : ''
        }${column.headerTooltip ? `title="${column.headerTooltip}"` : ''
        }${column.reorderable === false ? ' data-reorder="false"' : ''
        }${colGroups ? ` headers="${self.getColumnGroup(j)}"` : ''}${isExportable ? 'data-exportable="yes"' : 'data-exportable="no"'}>`;

        headerRow += `<div class="${isSelection ? 'datagrid-checkbox-wrapper ' : 'datagrid-column-wrapper'}${column.align === undefined ? '' : ` l-${column.align}-text`}"><span class="datagrid-header-text${column.required ? ' required' : ''}">${self.headerText(this.settings.columns[j])}</span>`;
        cols += `<col${this.calculateColumnWidth(column, j)}${column.colspan ? ` span="${column.colspan}"` : ''}${column.hidden ? ' class="is-hidden"' : ''}>`;
      }

      if (isSelection) {
        if (self.settings.showSelectAllCheckBox) {
          headerRow += '<span aria-checked="false" class="datagrid-checkbox" aria-label="Selection" role="checkbox"></span>';
        } else {
          headerRow += '<span aria-checked="false" class="datagrid-checkbox" aria-label="Selection" role="checkbox" style="display:none"></span>';
        }
      }

      if (isSortable) {
        headerRow += `${'<div class="sort-indicator">' +
          '<span class="sort-asc">'}${$.createIcon({ icon: 'dropdown' })}</span>` +
          `<span class="sort-desc">${$.createIcon({ icon: 'dropdown' })}</div>`;
      }

      // Skip the next column when using colspan
      if (hideNext > 0) {
        hideNext--;
      }

      if (column.colspan) {
        hideNext = column.colspan - 1;
      }
      headerRow += `</div>${self.filterRowHtml(column, j)}</th>`;
    }
    headerRow += '</tr>';

    headerColGroup += `${cols}</colgroup>`;

    if (self.headerRow === undefined) {
      self.headerContainer = $(`<div class="datagrid-header"><table role="grid" ${this.headerTableWidth()}></table></div>`);
      self.headerTable = self.headerContainer.find('table');
      self.headerColGroup = $(headerColGroup).appendTo(self.headerTable);
      self.headerRow = $(`<thead>${headerRow}</thead>`).appendTo(self.headerContainer.find('table'));
      self.element.prepend(self.headerContainer);
    } else {
      self.headerContainer.find('table').css('width', this.totalWidth);
      self.headerRow.html(headerRow);
      self.headerColGroup.html(cols);
    }

    self.syncHeaderCheckbox(this.settings.dataset);

    if (this.settings.enableTooltips) {
      self.headerRow.find('th[title]').tooltip();
    }

    if (self.settings.columnReorder) {
      self.createDraggableColumns();
    }

    this.attachFilterRowEvents();

    if (this.restoreSortOrder) {
      this.setSortIndicator(this.sortColumn.sortId, this.sortColumn.sortAsc);
      this.restoreSortOrder = false;
    }

    if (this.restoreFilter) {
      this.applyFilter(this.savedFilter);
      this.restoreFilter = false;
      this.savedFilter = null;
    }
  },

  /**
  * Flag used to determine if the header is rendered or not.
  */
  filterRowRendered: false,

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

    // Generate the markup for the various Types
    // Supported Filter Types: text, integer, date, select, decimal,
    // lookup, percent, checkbox, contents
    if (columnDef.filterType) {
      const col = columnDef;
      const filterId = self.uniqueId(`-header-filter-${idx}`);
      let integerDefaults;

      filterMarkup = `<div class="datagrid-filter-wrapper" ${!self.settings.filterable ? ' style="display:none"' : ''}>${self.filterButtonHtml(col)}<label class="audible" for="${filterId}">${
        col.name}</label>`;

      switch (col.filterType) {
        case 'checkbox':
          // just the button
          break;
        case 'date':
          filterMarkup += `<input ${col.filterDisabled ? ' disabled' : ''} type="text" class="datepicker" id="${filterId}"/>`;
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
          filterMarkup += `<input${col.filterDisabled ? ' disabled' : ''} type="text" id="${filterId}" />`;
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
          }

          col.maskOptions = utils.extend(true, {}, decimalDefaults, col.maskOptions);
          filterMarkup += `<input${col.filterDisabled ? ' disabled' : ''} type="text" id="${filterId}" />`;
          break;
        }
        case 'contents':
        case 'select':

          filterMarkup += `<select ${col.filterDisabled ? ' disabled' : ''}${col.filterType === 'select' ? ' class="dropdown"' : ' multiple class="multiselect"'}id="${filterId}">`;
          if (col.options) {
            if (col.filterType === 'select') {
              filterMarkup += '<option></option>';
            }

            for (let i = 0; i < col.options.length; i++) {
              const option = col.options[i];
              const optionValue = col.caseInsensitive && typeof option.value === 'string' ? option.value.toLowerCase() : option.value;
              filterMarkup += `<option value = "${optionValue}">${option.label}</option>`;
            }
          }
          filterMarkup += '</select><div class="dropdown-wrapper"><div class="dropdown"><span></span></div><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-dropdown"></use></svg></div>';

          break;
        case 'time':
          filterMarkup += `<input ${col.filterDisabled ? ' disabled' : ''} type="text" class="timepicker" id="${filterId}"/>`;
          break;
        default:
          filterMarkup += `<input${col.filterDisabled ? ' disabled' : ''} type="text" id="${filterId}"/>`;
          break;
      }

      filterMarkup += '</div>';
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

    // Attach Keyboard support
    this.headerRow.off('click.datagrid-filter').on('click.datagrid-filter', '.btn-filter', function () {
      const popupOpts = { trigger: 'immediate', offset: { y: 15 }, attachToBody: $('html').hasClass('ios'), placementOpts: { strategies: ['flip', 'nudge'] } };
      const popupmenu = $(this).data('popupmenu');

      if (popupmenu) {
        popupmenu.close(true, true);
      } else {
        $(this).off('beforeopen.datagrid-filter').on('beforeopen.datagrid-filter', function () {
          const menu = $(this).next('.popupmenu-wrapper');
          utils.fixSVGIcons(menu);
        }).popupmenu(popupOpts)
          .off('selected.datagrid-filter')
          .on('selected.datagrid-filter', () => {
            self.applyFilter();
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

    this.headerRow.off('keydown.datagrid').on('keydown.datagrid', '.datagrid-filter-wrapper input', function (e) {
      e.stopPropagation();

      if (e.which === 13) {
        e.preventDefault();
        $(this).trigger('change');
      }
    }).off('change.datagrid').on('change.datagrid', '.datagrid-filter-wrapper input', () => {
      self.applyFilter();
    });

    this.headerRow.find('tr:last th').each(function () {
      const col = self.columnById($(this).attr('data-column-id'))[0];
      const elem = $(this);

      if (!col) { // No ID found
        return true;
      }

      elem.find('select.dropdown').dropdown(col.editorOptions).on('selected.datagrid', () => {
        self.applyFilter();
      });

      elem.find('select.multiselect').multiselect(col.editorOptions).on('selected.datagrid', () => {
        self.applyFilter();
      });

      if (col.maskOptions) {
        elem.find('input').mask(col.maskOptions);
      }

      if (col.mask) {
        elem.find('input').mask(col.mask);
      }

      if (typeof elem.find('.datepicker').datepicker === 'function') {
        elem.find('.datepicker').datepicker(col.editorOptions ? col.editorOptions : { dateFormat: col.dateFormat });
      }

      if (typeof elem.find('.timepicker').datepicker === 'function') {
        elem.find('.timepicker').timepicker(col.editorOptions ? col.editorOptions : { timeFormat: col.timeFormat });
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
    return `<li ${checked ? 'class="is-checked"' : ''}><a href="#">${iconMarkup}<span>${Locale.translate(text)}</span></a></li>`;
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
      return filterConditions.length && !inArray(icon) ?
        '' : self.filterItemHtml(icon, text, checked);
    };
    const renderButton = function (defaultValue) {
      return `<button type="button" class="btn-menu btn-filter" data-init="false" ${isDisabled ? ' disabled' : ''}${defaultValue ? ` data-default="${defaultValue}"` : ''} type="button"><span class="audible">Filter</span>` +
      `<svg class="icon-dropdown icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-filter-{{icon}}"></use></svg>${
        $.createIcon({ icon: 'dropdown', classes: 'icon-dropdown' })
      }</button><ul class="popupmenu has-icons is-translatable is-selectable">`;
    };
    let btnMarkup = '';

    // Just the dropdown
    if (col.filterType === 'contents' || col.filterType === 'select') {
      return '';
    }

    if (col.filterType === 'text') {
      btnMarkup = renderButton('contains') +
        render('contains', 'Contains', true) +
        render('does-not-contain', 'DoesNotContain') +
        render('equals', 'Equals') +
        render('does-not-equal', 'DoesNotEqual') +
        render('is-empty', 'IsEmpty') +
        render('is-not-empty', 'IsNotEmpty');
      btnMarkup = btnMarkup.replace('{{icon}}', 'contains');
    }

    if (col.filterType === 'checkbox') {
      btnMarkup += renderButton('selected-notselected') +
        render('selected-notselected', 'All', true) +
        render('selected', 'Selected') +
        render('not-selected', 'NotSelected');
      btnMarkup = btnMarkup.replace('{{icon}}', 'selected-notselected');
    }

    if (col.filterType !== 'checkbox' && col.filterType !== 'text') {
      btnMarkup += renderButton('equals') +
        render('equals', 'Equals', (col.filterType === 'integer' || col.filterType === 'date' || col.filterType === 'time')) +
        render('does-not-equal', 'DoesNotEqual') +
        render('is-empty', 'IsEmpty') +
        render('is-not-empty', 'IsNotEmpty');
      btnMarkup = btnMarkup.replace('{{icon}}', 'equals');
    }

    if (/\b(integer|decimal|date|time|percent)\b/g.test(col.filterType)) {
      btnMarkup += `${
        render('less-than', 'LessThan')
      }${render('less-equals', 'LessOrEquals')
      }${render('greater-than', 'GreaterThan')
      }${render('greater-equals', 'GreaterOrEquals')}`;
      btnMarkup = btnMarkup.replace('{{icon}}', 'less-than');
    }

    if (col.filterType === 'text') {
      btnMarkup += `${
        render('end-with', 'EndsWith')
      }${render('does-not-end-with', 'DoesNotEndWith')
      }${render('start-with', 'StartsWith')
      }${render('does-not-start-with', 'DoesNotStartWith')}`;
      btnMarkup = btnMarkup.replace('{{icon}}', 'end-with');
    }

    btnMarkup += '</ul>';
    return btnMarkup;
  },

  /**
  * Toggle the visibility of the filter row.
  */
  toggleFilterRow() {
    if (this.settings.filterable) {
      this.headerRow.removeClass('is-filterable');
      this.headerRow.find('.is-filterable').removeClass('is-filterable');
      this.headerRow.find('.datagrid-filter-wrapper').hide();
      this.settings.filterable = false;
      this.filterRowRendered = false;
      this.element.removeClass('has-filterable-columns');
    } else {
      this.settings.filterable = true;

      if (!this.filterRowRendered) {
        this.render();
      }

      this.element.addClass('has-filterable-columns');

      this.headerRow.addClass('is-filterable');
      this.headerRow.find('.is-filterable').addClass('is-filterable');
      this.headerRow.find('.datagrid-filter-wrapper').show();
    }
  },

  /**
  * Apply the Filter with the currently selected conditions, or the ones passed in.
  * @param {object} conditions An array of objects with the filter conditions.
  */
  applyFilter(conditions) {
    const self = this;
    this.filteredDataset = null;

    if (conditions) {
      this.setFilterConditions(conditions);
    } else {
      conditions = this.filterConditions();
    }

    const checkRow = function (rowData) {
      let isMatch = true;

      for (let i = 0; i < conditions.length; i++) {
        const columnDef = self.columnById(conditions[i].columnId)[0];
        let rowValue = self.fieldValue(rowData, columnDef.field);
        let rowValueStr = (rowValue === null || rowValue === undefined) ? '' : rowValue.toString().toLowerCase();
        let conditionValue = conditions[i].value.toString().toLowerCase();

        // Percent filter type
        if (columnDef.filterType === 'percent') {
          conditionValue = (conditionValue / 100).toString();
          if ((`${columnDef.name}`).toLowerCase() === 'decimal') {
            rowValue = window.Formatters.Decimal(false, false, rowValue, columnDef);
            conditionValue = window.Formatters.Decimal(false, false, conditionValue, columnDef);
          } else if ((`${columnDef.name}`).toLowerCase() === 'integer') {
            rowValue = window.Formatters.Integer(false, false, rowValue, columnDef);
            conditionValue = window.Formatters.Integer(false, false, conditionValue, columnDef);
          }
        }

        // Run Data over the formatter
        if (columnDef.filterType === 'text') {
          const fmt = columnDef.formatter;
          const id = conditions[i].columnId;
          rowValue = self.formatValue(fmt, i, id, rowValue, columnDef, rowData, self);

          // Strip any html markup that might be in the formatters
          const rex = /(<([^>]+)>)|(&lt;([^>]+)&gt;)/ig;
          rowValue = rowValue.replace(rex, '').trim().toLowerCase();

          rowValueStr = (rowValue === null || rowValue === undefined) ? '' : rowValue.toString().toLowerCase();
        }

        if (columnDef.filterType === 'contents' || columnDef.filterType === 'select') {
          rowValue = rowValue.toLowerCase();
        }

        if ((typeof rowValue === 'number' || (!isNaN(rowValue) && rowValue !== '')) &&
              columnDef.filterType !== 'date' && columnDef.filterType !== 'time') {
          rowValue = parseFloat(rowValue);
          conditionValue = Locale.parseNumber(conditionValue);
        }

        if (columnDef.filterType === 'date' || columnDef.filterType === 'time') {
          conditionValue = Locale.parseDate(conditions[i].value, conditions[i].format);
          if (conditionValue) {
            if (columnDef.filterType === 'time') {
              // drop the day, month and year
              conditionValue.setDate(1);
              conditionValue.setMonth(0);
              conditionValue.setYear(0);
            }

            conditionValue = conditionValue.getTime();
          }

          if (rowValue instanceof Date) {
            // Copy date
            rowValue = new Date(rowValue.getTime());
            if (columnDef.filterType === 'time') {
              // drop the day, month and year
              rowValue.setDate(1);
              rowValue.setMonth(0);
              rowValue.setYear(0);
            } else if (!(columnDef.editorOptions && columnDef.editorOptions.showTime)) {
              // Drop any time component of the row data for the filter as it is a date only field
              rowValue.setHours(0);
              rowValue.setMinutes(0);
              rowValue.setSeconds(0);
              rowValue.setMilliseconds(0);
            }
            rowValue = rowValue.getTime();
          } else if (typeof rowValue === 'string' && rowValue) {
            if (!columnDef.sourceFormat) {
              rowValue = Locale.parseDate(rowValue, { pattern: conditions[i].format });
            } else {
              rowValue = Locale.parseDate(rowValue, (typeof columnDef.sourceFormat === 'string' ? { pattern: columnDef.sourceFormat } : columnDef.sourceFormat));
            }

            if (rowValue) {
              if (columnDef.filterType === 'time') {
                // drop the day, month and year
                rowValue.setDate(1);
                rowValue.setMonth(0);
                rowValue.setYear(0);
              } else if (!(columnDef.editorOptions && columnDef.editorOptions.showTime)) {
                // Drop any time component of the row data for the filter as it is a date only field
                rowValue.setHours(0);
                rowValue.setMinutes(0);
                rowValue.setSeconds(0);
                rowValue.setMilliseconds(0);
              }
              rowValue = rowValue.getTime();
            }
          }
        }

        switch (conditions[i].operator) {
          case 'equals':

            // This case is multiselect
            if (conditions[i].value instanceof Array) {
              isMatch = false;

              for (let k = 0; k < conditions[i].value.length; k++) {
                const match = conditions[i].value[k].toLowerCase().indexOf(rowValue) >= 0 && (rowValue.toString() !== '' || conditions[i].value[k] === '');
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
            isMatch = (rowValue === '');
            break;
          case 'is-not-empty':
            isMatch = (rowValue !== '');
            break;
          case 'less-than':
            isMatch = (rowValue < conditionValue && rowValue !== '');
            break;
          case 'less-equals':
            isMatch = (rowValue <= conditionValue && rowValue !== '');
            break;
          case 'greater-than':
            isMatch = (rowValue > conditionValue && rowValue !== '');
            break;
          case 'greater-equals':
            isMatch = (rowValue >= conditionValue && rowValue !== '');
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
            isMatch = (rowValueStr === '0' || rowValueStr === 'false' || rowValue === false || rowValue === 0) && rowValueStr !== '';
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
      let dataset;
      let isFiltered;
      let i;
      let len;

      if (this.settings.treeGrid) {
        dataset = this.settings.treeDepth;
        for (i = 0, len = dataset.length; i < len; i++) {
          isFiltered = !checkRow(dataset[i].node);
          dataset[i].node.isFiltered = isFiltered;
        }
      } else {
        for (i = 0, len = this.settings.dataset.length; i < len; i++) {
          isFiltered = !checkRow(this.settings.dataset[i]);
          this.settings.dataset[i].isFiltered = isFiltered;
        }
      }
    }

    if (!this.settings.source) {
      this.renderRows();
    }
    this.setSearchActivePage();
    this.element.trigger('filtered', { op: 'apply', conditions });
    this.resetPager('filtered');
    this.saveUserSettings();
  },

  /**
  * Clear the Filter row Conditions and Reset the Data.
  */
  clearFilter() {
    if (!this.settings.filterable) {
      return;
    }

    this.headerRow.find('input, select').val('').trigger('updated');
    // reset all the filters to first item
    this.headerRow.find('.btn-filter').each(function () {
      const btn = $(this);
      const ul = btn.next();
      const first = ul.find('li:first');

      btn.find('svg:first > use').attr('xlink:href', `#icon-filter-${btn.attr('data-default')}`);
      ul.find('.is-checked').removeClass('is-checked');
      first.addClass('is-checked');
    });

    this.applyFilter();
    this.element.trigger('filtered', { op: 'clear', conditions: [] });
  },

  /**
  * Set the Filter Conditions on the UI Only.
  * @param {object} conditions An array of objects with the filter conditions.
  */
  setFilterConditions(conditions) {
    for (let i = 0; i < conditions.length; i++) {
      // Find the filter row
      const rowElem = this.headerRow.find(`th[data-column-id="${conditions[i].columnId}"]`);
      const input = rowElem.find('input, select');
      const btn = rowElem.find('.btn-filter');

      if (conditions[i].value === undefined) {
        conditions[i].value = '';
      }

      input.val(conditions[i].value);

      if (input.is('select') && conditions[i].value instanceof Array) {
        for (let j = 0; j < conditions[i].value.length; j++) {
          input.find(`option[value="${conditions[i].value[j]}"]`).prop('selected', true);
        }
        input.trigger('updated');
      }

      btn.find('svg:first > use').attr('xlink:href', `#icon-filter-${conditions[i].operator}`);
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

    const self = this;
    this.filterExpr = [];

    // Create an array of objects with: field, id, filterType, operator, value
    this.headerRow.find('th').each(function () {
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
        format = input.data('datepicker').settings.dateFormat;
        if (format === 'locale') {
          format = Locale.calendar().dateFormat.short;
        }
        condition.format = format;
      }

      if (input.data('timepicker')) {
        format = input.data('timepicker').settings.timeFormat;
        condition.format = format;
      }

      self.filterExpr.push(condition);
    });

    return self.filterExpr;
  },

  // Get height for current target in header
  getTargetHeight() {
    const h = this.settings.filterable ?
      { short: 48, medium: 51, normal: 56 } : { short: 20, medium: 28, normal: 35 };
    return h[this.settings.rowHeight];
  },

  /**
  * Create draggable columns
  * @private
  */
  createDraggableColumns() {
    const self = this;
    const headers = self.headerNodes().not('[data-column-id="selectionCheckbox"]');
    let showTarget = $('.drag-target-arrows', self.element);

    if (!showTarget.length) {
      self.element.prepend(`<span class="drag-target-arrows" style="height: ${self.getTargetHeight()}px;"></span>`);
      showTarget = $('.drag-target-arrows', self.element);
    }

    headers.not('[data-reorder="false"]').prepend('</span><span class="handle">&#8286;</span>');
    headers.prepend('<span class="is-draggable-target"></span>');
    headers.last().append('<span class="is-draggable-target last"></span>');
    self.element.addClass('has-draggable-columns');

    // Initialize Drag api
    $('.handle', headers).each(function () {
      let clone = null;
      let headerPos = null;
      let offPos = null;
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
              .css({ left: pos.left, top: pos.top, height: header.height(), border: 0 });

            $('.is-draggable-target', clone).remove();

            self.setDraggableColumnTargets();

            headerPos = header.position();
            offPos = { top: (pos.top - headerPos.top), left: (pos.left - headerPos.left) };

            const index = self.targetColumn(headerPos);
            self.draggableStatus.startIndex = index;
            e.stopImmediatePropagation();
          })
          .on('drag.datagrid', (dragEvent, pos) => {
            clone[0].style.left = `${parseInt(pos.left, 10)}px`;
            clone[0].style.top = `${parseInt(pos.top, 10)}px`;
            headerPos = { top: (pos.top - offPos.top), left: (pos.left - offPos.left) };

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
                  showTarget[0].style.left = `${parseInt(rect.left, 10)}px`;
                  showTarget[0].style.top = `${parseInt(rect.top, 10) + 1}px`;
                }
              }
            }

            e.stopImmediatePropagation();
          })
          .on('dragend.datagrid', (dragendEvent, pos) => {
            clone[0].style.left = `${parseInt(pos.left, 10)}px`;
            clone[0].style.top = `${parseInt(pos.top, 10)}px`;

            headerPos = { top: (pos.top - offPos.top), left: (pos.left - offPos.left) };

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
      .not('.is-hidden').not('[data-column-id="selectionCheckbox"]');
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
          y1: pos.top - extra,
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

    // Attach the Drag API
    this.tableBody.arrange({
      placeholder: `<tr class="datagrid-reorder-placeholder"><td colspan="${this.visibleColumns().length}"></td></tr>`,
      handle: '.datagrid-reorder-icon'
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
        // Move the elem in the data set
        const first = self.settings.dataset.splice(status.startIndex, 1)[0];
        self.settings.dataset.splice(status.endIndex, 0, first);
        // Fire an event
        self.element.trigger('rowreorder', [status]);
      });
  },

  /**
  * Return the value in a field, taking into account nested objects. Fx obj.field.id
  * @param {object} obj The object to use
  * @param {string} field The field as a string fx 'field' or 'obj.field.id'
  * @returns {any} The current value in the field.
  */
  fieldValue(obj, field) {
    if (!field || !obj) {
      return '';
    }

    if (field.indexOf('.') > -1) {
      return field.split('.').reduce((o, x) => (o ? o[x] : ''), obj);
    }

    const rawValue = obj[field];
    let value = (rawValue || rawValue === 0 || rawValue === false ? rawValue : '');

    value = $.escapeHTML(value);
    return value;
  },

  /**
  * Setup internal tree root nodes array.
  * @private
  */
  setTreeRootNodes() {
    this.settings.treeRootNodes = this.settings.treeDepth
      .filter(node => node.depth === 1);
  },

  /**
   * Setup internal tree depth array.
   * @private
   * @param {array} dataset The json array to use for calculating tree depth.
   */
  setTreeDepth(dataset) {
    const self = this;
    let idx = 0;
    const iterate = function (node, depth) {
      idx++;
      self.settings.treeDepth.push({ idx, depth, node });
      const children = node.children || [];
      for (let i = 0, len = children.length; i < len; i++) {
        iterate(children[i], depth + 1);
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

    this.originalDataset = this.settings.dataset.slice();

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

    if (groupSettings.aggregator === 'list') {
      this.settings.dataset = GroupBy.list(
        this.settings.dataset,
        groupSettings.fields,
        groupSettings.aggregatorOptions
      );
      return;
    }

    this.settings.dataset = window.GroupBy(this.settings.dataset, groupSettings.fields);
  },

  /**
  * Clear the table body and rows.
  * @private
  */
  renderRows() {
    let tableHtml = '';
    const self = this;
    const s = self.settings;
    const activePage = self.pager ? self.pager.activePage : 1;
    const body = self.table.find('tbody');

    self.bodyColGroupHtml = '<colgroup>';
    self.triggerDestroyCell(); // Trigger Destroy on previous cells

    // Prevent flashing message area on filter / reload
    if (self.emptyMessageContainer) {
      self.emptyMessageContainer.hide();
    }

    if (body.length === 0) {
      self.tableBody = $('<tbody></tbody>');
      self.table.append(self.tableBody);
    }

    self.groupArray = [];

    self.recordCount = 0;
    self.filteredCount = 0;

    // Reset recordCount for paging
    if (s.treeGrid && s.paging && !s.source && activePage > 1) {
      self.recordCount = s.treeRootNodes[(s.pagesize * activePage) - s.pagesize].idx - 1;
    }

    if (this.restoreSortOrder) {
      this.sortDataset();
    }

    for (let i = 0; i < s.dataset.length; i++) {
      // For better performance dont render out of page
      if (s.paging && !s.source) {
        if (activePage === 1 && (i - this.filteredCount) >= s.pagesize) {
          if (!s.dataset[i].isFiltered) {
            this.recordCount++;
          } else {
            this.filteredCount++;
          }
          continue; //eslint-disable-line
        }

        if (activePage > 1 && !((i - this.filteredCount) >= s.pagesize * (activePage - 1) &&
          (i - this.filteredCount) < s.pagesize * activePage)) {
          if (!s.dataset[i].isFiltered) {
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
      if ((s.treeGrid ? s.treeRootNodes[i].node : s.dataset[i]).isFiltered) {
        this.filteredCount++;
        continue; //eslint-disable-line
      }

      // Handle Grouping
      if (this.settings.groupable) {
        // First push group row
        if (!this.settings.groupable.suppressGroupRow) {
          // Show the grouping row
          tableHtml += self.rowHtml(s.dataset[i], this.recordCount, i, true);
        }

        if (this.settings.groupable.showOnlyGroupRow && s.dataset[i].values[0]) {
          const rowData = s.dataset[i].values[0];

          if (s.dataset[i].list) {
            rowData.list = s.dataset[i].list;
          }

          rowData.values = s.dataset[i].values;

          tableHtml += self.rowHtml(rowData, this.recordCount, i);
          this.recordCount++;
          self.groupArray.push({ group: i, node: 0 });
          continue;  //eslint-disable-line
        }

        // Now Push Groups
        for (let k = 0; k < s.dataset[i].values.length; k++) {
          tableHtml += self.rowHtml(s.dataset[i].values[k], this.recordCount, i);
          this.recordCount++;
          self.groupArray.push({ group: i, node: k });
        }

        // Now Push summary rowHtml
        if (this.settings.groupable.groupFooterRow) {
          tableHtml += self.rowHtml(s.dataset[i], this.recordCount, i, true, true);
        }

        continue;  //eslint-disable-line
      }

      tableHtml += self.rowHtml(s.dataset[i], s.treeGrid ? this.recordCount : i, i);

      this.recordCount++;
    }

    // Append a Summary Row
    if (this.settings.summaryRow) {
      tableHtml += self.rowHtml(self.calculateTotals(), this.recordCount, null, false, true);
    }

    if (self.bodyColGroupHtml !== '<colgroup>') {
      self.bodyColGroupHtml += '</colgroup>';

      if (self.bodyColGroup) {
        self.bodyColGroup.remove();
      }

      self.bodyColGroup = $(self.bodyColGroupHtml);
      self.tableBody.before(self.bodyColGroup);
    }

    self.tableBody.html(tableHtml);
    self.setVirtualHeight();
    self.setScrollClass();
    self.setupTooltips();
    self.afterRender();
  },

  /**
  * Fire events and do steps needed after a full render.
  * @private
  */
  afterRender() {
    const self = this;

    // Column column postRender functions
    if (this.settings.onPostRenderCell) {
      for (let i = 0; i < this.settings.columns.length; i++) {
        const col = self.settings.columns[i];

        if (col.component) {
          self.tableBody.find('tr').each(function () {
            const row = $(this);
            const rowIdx = row.attr('data-index');
            const colIdx = self.columnIdxById(col.id);
            const args = {
              row: rowIdx,
              cell: colIdx,
              value: self.settings.dataset[rowIdx],
              col,
              api: self
            };

            self.settings.onPostRenderCell(row.find('td').eq(colIdx).find('.datagrid-cell-wrapper .content')[0], args);
          });
        }
      }
    }

    // Init Inline Elements
    self.tableBody.find('select.dropdown').dropdown();

    // Commit Edits for inline editing
    self.tableBody.find('.dropdown-wrapper.is-inline').prev('select')
      .on('listclosed', function () {
        const elem = $(this);
        const newValue = elem.val();
        const row = elem.closest('tr');

        self.updateCellNode(row.attr('aria-rowindex'), elem.closest('td').index(), newValue, false, true);
      });

    self.tableBody.find('.spinbox').spinbox();

    // Set UI elements after dataload
    setTimeout(() => {
      if (!self.settings.source) {
        self.displayCounts();
      } else {
        self.checkEmptyMessage();
      }

      self.setAlternateRowShading();
      self.createDraggableRows();

      if (!self.activeCell || !self.activeCell.node) {
        self.activeCell = { node: self.cellNode(0, 0, true).attr('tabindex', '0'), isFocused: false, cell: 0, row: 0 };
      }

      if (self.activeCell.isFocused) {
        self.setActiveCell(self.activeCell.row, self.activeCell.cell);
      }

      // Update Selected Rows Across Page
      if (self.settings.paging && self.settings.source) {
        self.syncSelectedUI();
      }

      self.element.trigger('afterrender', { body: self.tableBody, header: self.headerRow, pager: self.pagerBar });
    }, 0);
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
    const scrollTop = this.contentContainer[0].scrollTop;
    const headerHeight = this.settings.rowHeight === 'normal' ? 40 : (this.settings.rowHeight === 'medium' ? 30 : 25);
    const bodyH = containerHeight - headerHeight;
    const rowH = this.settings.rowHeight === 'normal' ? 50 : (this.settings.rowHeight === 'medium' ? 40 : 30);

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

  recordCount: 0,

  rowHtml(rowData, dataRowIdx, actualIndex, isGroup, isFooter) {
    let isEven = false;
    const self = this;
    const isSummaryRow = this.settings.summaryRow && !isGroup && isFooter;
    const activePage = self.pager ? self.pager.activePage : 1;
    const pagesize = self.settings.pagesize;
    let rowHtml = '';
    let spanNext = 0;
    let d = self.settings.treeDepth ? self.settings.treeDepth[dataRowIdx] : 0;
    let depth = null;
    let d2;
    let j = 0;
    let isHidden;

    if (!rowData) {
      return '';
    }

    // Default
    d = d ? d.depth : 0;
    depth = d;

    // Setup if this row will be hidden or not
    for (let i = dataRowIdx; i >= 0 && d > 1 && !isHidden; i--) {
      d2 = self.settings.treeDepth[i];
      if (d !== d2.depth && d > d2.depth) {
        d = d2.depth;
        isHidden = !d2.node.expanded;
      }
    }

    if (this.settings.groupable) {
      const groupSettings = this.settings.groupable;
      isHidden = (groupSettings.expanded === undefined ? false : !groupSettings.expanded);

      if (groupSettings.expanded && typeof groupSettings.expanded === 'function') {
        isHidden = !groupSettings.expanded(dataRowIdx, 0, null, null, rowData, this);
      }
    }

    // Group Rows
    if (this.settings.groupable && isGroup && !isFooter) {
      rowHtml = `<tr class="datagrid-rowgroup-header ${isHidden ? '' : 'is-expanded'}" role="rowgroup"><td role="gridcell" colspan="${this.visibleColumns().length}">${
        Formatters.GroupRow(dataRowIdx, 0, null, null, rowData, this)
      }</td></tr>`;
      return rowHtml;
    }

    if (this.settings.groupable && isGroup && isFooter) {
      rowHtml = `<tr class="datagrid-row datagrid-rowgroup-footer ${isHidden ? '' : 'is-expanded'}" role="rowgroup">${
        Formatters.GroupFooterRow(dataRowIdx, 0, null, null, rowData, this)
      }</tr>`;
      return rowHtml;
    }

    const ariaRowindex = ((dataRowIdx + 1) +
      (self.settings.source ? ((activePage - 1) * self.settings.pagesize) : 0));

    isEven = (this.recordCount % 2 === 0);
    const isSelected = this.isNodeSelected(rowData);
    const isActivated = rowData._rowactivated;

    rowHtml = `<tr role="row" aria-rowindex="${ariaRowindex}"` +
              ` data-index="${actualIndex}"${
                self.settings.treeGrid && rowData.children ? ` aria-expanded="${rowData.expanded ? 'true"' : 'false"'}` : ''
              }${self.settings.treeGrid ? ` aria-level= "${depth}"` : ''
              }${isSelected ? ' aria-selected= "true"' : ''
              } class="datagrid-row${
                isHidden ? ' is-hidden' : ''
              }${isActivated ? ' is-rowactivated' : ''
              }${isSelected ? this.settings.selectable === 'mixed' ? ' is-selected hide-selected-color' : ' is-selected' : ''
              }${self.settings.alternateRowShading && !isEven ? ' alt-shading' : ''
              }${isSummaryRow ? ' datagrid-summary-row' : ''
              }${!self.settings.cellNavigation ? ' is-clickable' : ''
              }${self.settings.treeGrid ? (rowData.children ? ' datagrid-tree-parent' : (depth > 1 ? ' datagrid-tree-child' : '')) : ''
              }">`;

    for (j = 0; j < self.settings.columns.length; j++) {
      const col = self.settings.columns[j];
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

      if (col.editor) {
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

      const rowspan = this.calculateRowspan(cellValue, dataRowIdx, col);

      if (rowspan === '') {
        continue;
      }

      // Set Width of table col / col group elements
      let colWidth = '';

      if (this.recordCount === 0 || this.recordCount - ((activePage - 1) * pagesize) === 0) {
        colWidth = this.calculateColumnWidth(col, j);

        self.bodyColGroupHtml += spanNext > 0 ? '' : `<col${colWidth}${col.hidden ? ' class="is-hidden"' : ''}${col.colspan ? ` span="${col.colspan}"` : ''}></col>`;

        if (spanNext > 0) {
          spanNext--;
        }
        if (col.colspan) {
          this.hasColSpans = true;
          spanNext = col.colspan - 1;
        }
      }

      rowHtml += `<td role="gridcell" ${ariaReadonly} aria-colindex="${j + 1}" ` +
          ` aria-describedby="${self.uniqueId(`-header-${j}`)}"${
            isSelected ? ' aria-selected= "true"' : ''
          }${cssClass ? ` class="${cssClass}"` : ''
          }${col.tooltip && typeof col.tooltip === 'string' ? ` title="${col.tooltip.replace('{{value}}', cellValue)}"` : ''
          }${col.id === 'rowStatus' && rowData.rowStatus && rowData.rowStatus.tooltip ? ` title="${rowData.rowStatus.tooltip}"` : ''
          }${self.settings.columnGroups ? `headers = "${self.uniqueId(`-header-${j}`)} ${self.getColumnGroup(j)}"` : ''
          }${rowspan || ''
          }><div class="datagrid-cell-wrapper">`;

      if (col.contentVisible) {
        const canShow = col.contentVisible(dataRowIdx + 1, j, cellValue, col, rowData);
        if (!canShow) {
          formatted = '';
        }
      }

      if (self.settings.onPostRenderCell && col.component) {
        rowHtml += '<div class="content"></div>';
        formatted = '';
      }

      rowHtml += `${formatted}</div></td>`;
    }

    rowHtml += '</tr>';

    if (self.settings.rowTemplate) {
      const tmpl = self.settings.rowTemplate;
      const item = rowData;
      let renderedTmpl = '';

      if (Tmpl && item) {
        const compiledTmpl = Tmpl.compile(`{{#dataset}}${tmpl}{{/dataset}}`);
        renderedTmpl = compiledTmpl.render({ dataset: item });
      }

      rowHtml += `<tr class="datagrid-expandable-row"><td colspan="${this.visibleColumns().length}">` +
        `<div class="datagrid-row-detail"><div class="datagrid-row-detail-padding">${renderedTmpl}</div></div>` +
        '</td></tr>';
    }

    if (self.settings.expandableRow) {
      rowHtml += `<tr class="datagrid-expandable-row"><td colspan="${this.visibleColumns().length}">` +
        '<div class="datagrid-row-detail"><div class="datagrid-row-detail-padding"></div></div>' +
        '</td></tr>';
    }

    // Render Tree Children
    if (rowData.children) {
      for (let i = 0, l = rowData.children.length; i < l; i++) {
        this.recordCount++;
        rowHtml += self.rowHtml(rowData.children[i], this.recordCount, i);
      }
    }

    return rowHtml;
  },

  canvas: null,
  totalWidth: 0,

  /**
   * This Function approximates the table auto widthing
   * Except use all column values and compare the text width of the header as max
   * @param  {object} columnDef The column to check.
   * @returns {number} The text width.
   */
  calculateTextWidth(columnDef) {
    let max = 0;
    const self = this;
    let maxText = '';
    const title = columnDef.name || '';
    let chooseHeader = false;

    // Get max cell value length for this column
    for (let i = 0; i < this.settings.dataset.length; i++) {
      let val = this.fieldValue(this.settings.dataset[i], columnDef.field);
      let len = 0;
      const row = this.settings.dataset[i];

      // Get formatted value (without html) so we have accurate string that
      // will display for this cell
      val = self.formatValue(columnDef.formatter, i, null, val, columnDef, row, self);
      val = val.replace(/<\/?[^>]+(>|$)/g, '');

      len = val.toString().length;

      if (this.settings.groupable && row.values) {
        for (let k = 0; k < row.values.length; k++) {
          let groupVal = this.fieldValue(row.values[k], columnDef.field);
          groupVal = self.formatValue(columnDef.formatter, i, null, groupVal, columnDef, row, self);
          groupVal = groupVal.replace(/<\/?[^>]+(>|$)/g, '');

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

    // Use header text length as max if bigger than all data cells
    if (title.length > max) {
      max = title.length;
      maxText = title;
      chooseHeader = true;
    }

    if (maxText === '' || this.settings.dataset.length === 0) {
      maxText = columnDef.name || ' Default ';
      chooseHeader = true;
    }

    // if given, use cached canvas for better performance, else, create new canvas
    this.canvas = this.canvas || (this.canvas = document.createElement('canvas'));
    const context = this.canvas.getContext('2d');
    context.font = '14px arial';

    const metrics = context.measureText(maxText);
    const hasImages = columnDef.formatter ?
      columnDef.formatter.toString().indexOf('datagrid-alert-icon') > -1 : false;
    let padding = (chooseHeader ? 60 + (hasImages ? 36 : 0) : 40 + (hasImages ? 36 : 0));

    if (columnDef.filterType) {
      let minWidth = columnDef.filterType === 'date' ? 170 : 100;

      if (columnDef.filterType === 'checkbox') {
        minWidth = 40;
        padding = 40;
      }

      return Math.round(Math.max(metrics.width + padding, minWidth));
    }

    return Math.round(metrics.width + padding); // Add padding and borders
  },

  headerWidths: [], // Cache

  headerTableWidth() {
    const cacheWidths = this.headerWidths[this.settings.columns.length - 1];

    if (!cacheWidths) {
      return '';
    }
    this.setScrollClass();

    if (cacheWidths.widthPercent) {
      return 'style = "width: 100%"';
    } else if (!isNaN(this.totalWidth)) {
      return `style = "width: ${parseFloat(this.totalWidth)}px"`;
    }

    return '';
  },

  /**
   * Set the scroll class if the scrollbar is visible to effect the scrollheight.
   * @private
   */
  setScrollClass() {
    const height = parseInt(this.contentContainer[0].offsetHeight, 10);
    const hasScrollBar = parseInt(this.contentContainer[0].scrollHeight, 10) > height + 2;

    this.element.removeClass('has-vertical-scroll has-less-rows');

    if (hasScrollBar) {
      this.element.addClass('has-vertical-scroll');
    }

    if (!hasScrollBar && this.tableBody[0].offsetHeight < height) {
      this.element.addClass('has-less-rows');
    }
  },

  /**
   * Clear internal header cache info.
   * @private
   * @returns {void}
   */
  clearHeaderCache() {
    this.headerWidths = [];
    this.totalWidth = 0;
    this.elemWidth = 0;
    this.lastColumn = null;
  },

  /**
   * Calculate the width for a column (upfront with no rendering)
   * Simulates https://www.w3.org/TR/CSS21/tables.html#width-layout
   * @param  {[type]} col The column object to use
   * @param  {[type]} index The column index
   * @returns {void}
   */
  calculateColumnWidth(col, index) {
    let colPercWidth;
    const visibleColumns = this.visibleColumns(true);
    let lastColumn = (index === this.lastColumnIdx());

    if (!this.elemWidth) {
      this.elemWidth = this.element.outerWidth();

      if (this.elemWidth === 0) { // handle on invisible tab container
        this.elemWidth = this.element.closest('.tab-container').outerWidth();
      }
      if (!this.elemWidth || this.elemWidth === 0) { // handle on invisible modal
        this.elemWidth = this.element.closest('.modal-contents').outerWidth();
      }

      this.widthSpecified = false;
      this.widthPixel = false;
    }

    // use cache
    if (this.headerWidths[index]) {
      const cacheWidths = this.headerWidths[index];

      if (cacheWidths.width === 'default') {
        return '';
      }

      if (this.widthSpecified && !cacheWidths.width) {
        return '';
      }

      return ` style="width: ${cacheWidths.width}${cacheWidths.widthPercent ? '%' : 'px'}"`;
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

    lastColumn = index === this.lastColumnIdx() && this.totalWidth !== colWidth;

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

    if (col.id === 'expander') {
      colWidth = 55;
      col.width = colWidth;
    }

    if (col.id === 'rowStatus') {
      colWidth = 62;
      col.width = colWidth;
    }

    if (col.id === 'drilldown') {
      colWidth = 78;
      col.width = colWidth;
    }

    // cache the header widths
    this.headerWidths[index] = {
      id: col.id,
      width: (this.widthPercent ? colPercWidth : colWidth),
      widthPercent: this.widthPercent
    };
    this.totalWidth += col.hidden || lastColumn ? 0 : colWidth;

    // For the last column stretch it if it doesnt fit the area
    if (lastColumn) {
      const diff = this.elemWidth - this.totalWidth;

      if ((diff > 0) && (diff > colWidth) && !this.widthPercent && !col.width) {
        colWidth = diff - 2 - 10; // borders and last edge padding
        this.headerWidths[index] = { id: col.id, width: colWidth, widthPercent: this.widthPercent };
        this.totalWidth = this.elemWidth - 2;
      }

      if (this.widthPercent) {
        this.table.css('width', '100%');
      } else if (!isNaN(this.totalWidth)) {
        this.table.css('width', this.totalWidth);
      }
    }

    if (!this.widthPercent && colWidth === undefined) {
      return '';
    }

    return ` style="width: ${this.widthPercent ? `${colPercWidth}%` : `${colWidth}px`}"`;
  },

  widthPercent: false,
  rowSpans: [],

  /**
  * Figure out if the row spans and should skip rendiner.
  * @private
  * @param  {any} value Value to check
  * @param  {number} row Row index
  * @param  {number} col Column index
  * @returns {void}
  */
  calculateRowspan(value, row, col) {
    let cnt = 0;
    let min = null;

    if (!col.rowspan) {
      return null;
    }

    for (let i = 0; i < this.settings.dataset.length; i++) {
      if (value === this.settings.dataset[i][col.field]) {
        cnt++;
        if (min === null) {
          min = i;
        }
      }
    }

    if (row === min) {
      return ` rowspan ="${cnt}"`;
    }
    return '';
  },

  // Summary Row Totals use the aggregators
  calculateTotals() {
    this.settings.totals = Aggregators.aggregate(this.settings.dataset, this.settings.columns);
    return this.settings.totals;
  },

  // Set unit type (pixel or percent)
  setUnit(v) {
    return v + (/(px|%)/i.test(`${v}`) ? '' : 'px');
  },

  // Content tooltip for rich text editor
  setupContentTooltip(elem, width, td) {
    if (elem.text().length > 0) {
      const content = elem.clone();

      elem.tooltip({
        content,
        extraClass: 'alternate content-tooltip',
        placementOpts: {
          parent: elem,
          parentXAlignment: 'center',
          strategies: ['flip', 'nudge', 'shrink']
        }
      });

      if (width) {
        content[0].style.width = width;
      } else {
        elem.on('beforeshow.datagrid', () => {
          elem.off('beforeshow.datagrid');
          content[0].style.width = `${td[0].offsetWidth}px`;
        });
      }
    }
  },

  setupTooltips() {
    if (!this.settings.enableTooltips) {
      return;
    }

    const self = this;
    // Implement Tooltip on cells with title attribute
    this.tableBody.find('td[title]').tooltip();
    this.tableBody.find('a[title]').tooltip();

    // Implement Tooltip on cells with ellipsis
    this.table.find('td.text-ellipsis').tooltip({
      content() {
        const cell = $(this);
        const text = cell.text();
        const inner = cell.children('.datagrid-cell-wrapper');

        if (cell[0] && inner[0] && (inner[0].offsetWidth) < inner[0].scrollWidth && cell.data('tooltip')) {
          const w = inner.width();
          cell.data('tooltip').settings.maxWidth = w;
          return text;
        }

        return '';
      }
    });

    // Rich text editor content tooltip
    this.table.find('td .is-editor.content-tooltip').each(function () {
      const elem = $(this);
      const td = elem.closest('td');
      const cell = td.attr('aria-colindex') - 1;
      const col = self.columnSettings(cell);
      const width = col.editorOptions &&
        col.editorOptions.width ? self.setUnit(col.editorOptions.width) : false;

      self.setupContentTooltip(elem, width, td);
    });
  },

  /**
   * Returns all header nodes (not the groups)
   * @private
   * @returns {array} Array with all header dom nodes
   */
  headerNodes() {
    return this.headerRow.find('tr:not(.datagrid-header-groups) th');
  },

  /**
   * Refresh one row in the grid
   * @param  {number} idx The row index to update.
   * @param  {object} data The data object.
   * @returns {void}
   */
  updateRow(idx, data) {
    const rowData = (data || this.settings.dataset[idx]);

    for (let j = 0; j < this.settings.columns.length; j++) {
      const col = this.settings.columns[j];

      if (col.hidden) {
        continue;
      }

      if (col.id && ['selectionCheckbox', 'expander'].indexOf(col.id) > -1) {
        continue;
      }

      this.updateCellNode(idx, j, this.fieldValue(rowData, col.field), true);
    }
  },

  /**
   * Given a new column set update the rows and reload
   * @param  {array} columns The array with columns to use.
   * @param  {array} columnGroups The array with new columns groups to use.
   * @returns {void}
   */
  updateColumns(columns, columnGroups) {
    this.settings.columns = columns;

    if (columnGroups) {
      this.settings.columnGroups = columnGroups;
    }

    this.clearHeaderCache();
    this.renderRows();
    this.renderHeader();
    this.resetPager('updatecolumns');
    this.element.trigger('columnchange', [{ type: 'updatecolumns', columns: this.settings.columns }]);
    this.saveColumns();
    this.saveUserSettings();
  },

  /**
   * Save the columns to local storage
   * @returns {void}
   */
  saveColumns() {
    if (!this.settings.saveColumns) {
      return;
    }

    // Save to local storage
    if (this.canUseLocalStorage()) {
      localStorage[this.uniqueId('columns')] = JSON.stringify(this.settings.columns);
    }
  },

  /**
   * Omit events and save to local storage for supported settings.
   * @returns {void}
   */
  saveUserSettings() {
    // Emit Event
    this.element.trigger('settingschanged', [{
      rowHeight: this.settings.rowHeight,
      columns: this.settings.columns,
      sortOrder: this.sortColumn,
      pagesize: this.settings.pagesize,
      showPageSizeSelector: this.settings.showPageSizeSelector,
      activePage: this.pager ? this.pager.activePage : 1,
      filter: this.filterConditions()
    }]);

    // Save to Local Storage if the settings are set
    const savedSettings = this.settings.saveUserSettings;
    if ($.isEmptyObject(savedSettings) || !this.canUseLocalStorage()) {
      return;
    }

    // Save Columns
    if (savedSettings.columns) {
      localStorage[this.uniqueId('usersettings-columns')] = JSON.stringify(this.settings.columns);
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
    if (savedSettings.activePage && this.pager) {
      localStorage[this.uniqueId('usersettings-active-page')] = this.pager.activePage;
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
   * Parse a JSON array with columns and return the column object.
   * @private
   * @param  {string} columnStr The json represntation of the column object.
   * @returns {array} The array of columns.
   */
  columnsFromString(columnStr) {
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

      if (orgColumn) {
        isHidden = columns[i].hidden;

        $.extend(columns[i], orgColumn[0]);

        if (isHidden !== undefined) {
          columns[i].hidden = isHidden;
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
      this.originalColumns = this.settings.columns;
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
        this.pager.settings.pagesize = parseInt(settings.pagesize, 10);
        this.pager.setActivePage(1, true);
      }

      if (settings.showPageSizeSelector) {
        this.settings.showPageSizeSelector = settings.showPageSizeSelector;
        this.pager.showPageSizeSelector(settings.showPageSizeSelector);
      }

      if (settings.activePage) {
        this.pager.setActivePage(parseInt(settings.activePage, 10), true);
      }

      if (settings.filter) {
        this.applyFilter(settings.filter);
      }
      return;
    }

    // Restore Column Width and Order
    if (options.columns) {
      const savedColumns = localStorage[this.uniqueId('usersettings-columns')];
      if (savedColumns) {
        this.originalColumns = this.settings.columns;
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
  * Reset Columns to defaults (used on restore menu item)
  */
  resetColumns() {
    if (this.canUseLocalStorage()) {
      localStorage.removeItem(this.uniqueId('columns'));
    }

    if (this.originalColumns) {
      this.updateColumns(this.originalColumns);
      this.originalColumns = this.columnsFromString(JSON.stringify(this.settings.columns));
    }
  },

  /**
  * Hide a column.
  * @param {string} id The id of the column to hide.
  */
  hideColumn(id) {
    let idx = this.columnIdxById(id);

    if (idx === -1) {
      return;
    }

    this.settings.columns[idx].hidden = true;
    this.headerRow.find('th').eq(idx).addClass('is-hidden');
    this.tableBody.find(`td:nth-child(${idx + 1})`).addClass('is-hidden');
    this.headerColGroup.find('col').eq(idx).addClass('is-hidden');

    if (this.bodyColGroup) {
      this.bodyColGroup.find('col').eq(idx).addClass('is-hidden');
    }

    // Handle colSpans if present on the column
    if (this.hasColSpans) {
      let colSpan = this.headerRow.find('th').eq(idx).attr('colspan');

      if (colSpan && colSpan > 0) {
        colSpan -= 1;
        for (let i = 0; i < colSpan; i++) {
          idx += colSpan;
          this.tableBody.find(`td:nth-child(${idx + 1})`).addClass('is-hidden');
        }
      }
    }

    this.element.trigger('columnchange', [{ type: 'hidecolumn', index: idx, columns: this.settings.columns }]);
    this.saveColumns();
    this.saveUserSettings();
  },

  /**
  * Show a hidden column.
  * @param {string} id The id of the column to show.
  */
  showColumn(id) {
    let idx = this.columnIdxById(id);

    if (idx === -1) {
      return;
    }

    this.settings.columns[idx].hidden = false;
    this.headerRow.find('th').eq(idx).removeClass('is-hidden');
    this.tableBody.find(`td:nth-child(${idx + 1})`).removeClass('is-hidden');
    this.headerColGroup.find('col').eq(idx).removeClass('is-hidden');
    if (this.bodyColGroup) {
      this.bodyColGroup.find('col').eq(idx).removeClass('is-hidden');
    }

    // Handle colSpans if present on the column
    if (this.hasColSpans) {
      let colSpan = this.headerRow.find('th').eq(idx).attr('colspan');

      if (colSpan && colSpan > 0) {
        colSpan -= 1;
        for (let i = 0; i < colSpan; i++) {
          idx += colSpan;
          this.tableBody.find(`td:nth-child(${idx + 1})`).removeClass('is-hidden');
        }
      }
    }

    this.element.trigger('columnchange', [{ type: 'showcolumn', index: idx, columns: this.settings.columns }]);
    this.saveColumns();
    this.saveUserSettings();
  },

  /**
  * Export the grid contents to csv
  * Consider Deprecated use excel.exportToCsv
  *
  * @param {string} fileName The desired export filename in the download.
  * @param {string} customDs An optional customized version of the data to use.
  */
  exportToCsv(fileName, customDs) {
    excel.exportToCsv(fileName, customDs, this);
  },

  /**
  * Export the grid contents to xls format. This may give a warning when opening the file.
  * exportToCsv may be prefered.
  * Consider Deprecated use excel.exportToExcel
  *
  * @param {string} fileName The desired export filename in the download.
  * @param {string} worksheetName A name to give the excel worksheet tab.
  * @param {string} customDs An optional customized version of the data to use.
  */
  exportToExcel(fileName, worksheetName, customDs) {
    excel.exportToExcel(fileName, worksheetName, customDs, this);
  },

  /**
  * Open the personalization dialog.
  * @private
  */
  personalizeColumns() {
    const self = this;
    let spanNext = 0;
    let markup = `<div class="listview-search alternate-bg"><label class="audible" for="gridfilter">Search</label><input class="searchfield" placeholder="${Locale.translate('SearchColumnName')}" name="searchfield" id="gridfilter"></div>`;
    markup += '<div class="listview alternate-bg" id="search-listview"><ul>';

    for (let i = 0; i < this.settings.columns.length; i++) {
      const col = this.settings.columns[i];
      let colName = col.name;

      if (colName && spanNext <= 0) {
        colName = colName.replace('<br>', ' ').replace('<br/>', ' ').replace('<br />', ' ');
        markup += `<li><a href="#" target="_self" tabindex="-1"> <label class="inline"><input tabindex="-1" ${col.hideable === false ? 'disabled' : ''} type="checkbox" class="checkbox" ${col.hidden ? '' : ' checked'} data-column-id="${col.id || i}"><span class="label-text">${colName}</span></label></a></li>`;
      }

      if (spanNext > 0) {
        spanNext--;
      }

      if (col.colspan) {
        spanNext = col.colspan - 1;
      }
    }
    markup += '</ul></div>';

    $('body').modal({
      title: Locale.translate('PersonalizeColumns'),
      content: markup,
      cssClass: 'full-width datagrid-columns-dialog',
      buttons: [{
        text: Locale.translate('Close'),
        click(e, modal) {
          modal.close();
          $('body').off('open.datagrid');
        }
      }]
    }).on('beforeopen.datagrid', () => {
      self.isColumnsChanged = false;
    }).on('open.datagrid', (e, modal) => {
      modal.element.find('.searchfield').searchfield({ clearable: true });
      modal.element.find('.listview').listview({ searchable: true, selectOnFocus: false })
        .on('selected', (selectedEvent, args) => {
          const chk = args.elem.find('.checkbox');
          const id = chk.attr('data-column-id');
          const isChecked = chk.prop('checked');

          args.elem.removeClass('is-selected hide-selected-color');

          if (chk.is(':disabled')) {
            return;
          }
          self.isColumnsChanged = true;

          if (!isChecked) {
            self.showColumn(id);
            chk.prop('checked', true);
          } else {
            self.hideColumn(id);
            chk.prop('checked', false);
          }
        });

      modal.element.on('close.datagrid', () => {
        self.isColumnsChanged = false;
      });
    });
  },

  // Explicitly Set the Width of a column
  setColumnWidth(idOrNode, width, diff) {
    const self = this;
    const percent = parseFloat(width);
    let columnNode = idOrNode;
    const columnSettings = this.columnById(typeof idOrNode === 'string' ? idOrNode : idOrNode.attr('data-column-id'))[0];

    if (!percent) {
      return;
    }

    if (typeof idOrNode === 'string') {
      self.headerNodes().each(function () {
        const col = $(this);

        if (col.attr('data-column-id') === idOrNode) {
          columnNode = col;
        }
      });
    }

    // Handles min width on some browsers
    if ((columnSettings.minWidth && width > parseInt(columnSettings.minWidth, 10))) {
      return;
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
    if (columnSettings.colspan) {
      width /= columnSettings.colspan;
    }

    // Save the column back in settings for later
    if (columnSettings) {
      columnSettings.width = width;
    }

    const idx = columnNode.index();
    self.headerColGroup.find('col').eq(idx)[0].style.width = (`${width}px`);

    if (self.settings.dataset.length > 0) {
      self.bodyColGroup.find('col').eq(idx)[0].style.width = (`${width}px`);
    }

    if (self.tableWidth && diff) {
      self.headerTable.css('width', parseInt(self.tableWidth, 10) + diff);
      self.table.css('width', parseInt(self.tableWidth, 10) + diff);
    }

    this.element.trigger('columnchange', [{ type: 'resizecolumn', index: idx, columns: this.settings.columns }]);
    this.saveColumns();
    this.saveUserSettings();
    this.clearHeaderCache();
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

    this.headerContainer.find('table').before(this.resizeHandle);

    let columnId;
    let startingLeft;
    let columnStartWidth;
    let column;

    this.resizeHandle.drag({ axis: 'x', containment: 'parent' })
      .on('dragstart.datagrid', () => {
        if (!self.currentHeader) {
          return;
        }

        self.dragging = true;

        columnId = self.currentHeader.attr('data-column-id');
        column = self.columnById(columnId)[0]; // eslint-disable-line

        startingLeft = self.currentHeader.position().left + (self.table.scrollLeft() - 10);
        self.tableWidth = self.table[0].offsetWidth;
        columnStartWidth = self.currentHeader[0].offsetWidth;
      })
      .on('drag.datagrid', (e, ui) => {
        if (!self.currentHeader || !column) {
          return;
        }

        let width = (ui.left - startingLeft - 1);
        const minWidth = column.minWidth || 12;
        const maxWidth = column.maxWidth || 1000;

        if (width < minWidth || width > maxWidth) {
          self.resizeHandle.css('cursor', 'inherit');
          return;
        }

        width = Math.round(width);

        self.setColumnWidth(self.currentHeader, width, width - columnStartWidth);
      })
      .on('dragend.datagrid', () => {
        self.dragging = false;
      });
  },

  // Show Summary and any other count info
  displayCounts(totals) {
    const self = this;
    let count = self.tableBody.find('tr:visible').length;
    const isClientSide = self.settings.paging && !(self.settings.source);

    if (isClientSide || (!totals)) {
      this.recordCount = self.settings.dataset.length;
      count = self.settings.dataset.length;
    }

    // Update Selected
    if (self.contextualToolbar && self.contextualToolbar.length) {
      self.contextualToolbar.find('.selection-count').text(`${self.selectedRows().length} ${Locale.translate('Selected')}`);
    }

    if (totals && totals !== -1) {
      count = totals;
    }

    let countText;
    if (self.settings.showFilterTotal && self.filteredCount > 0) {
      countText = `(${Locale.formatNumber(count - self.filteredCount, { style: 'integer' })} of ${Locale.formatNumber(count, { style: 'integer' })} ${Locale.translate(count === 1 ? 'Result' : 'Results')})`;
    } else {
      countText = `(${Locale.formatNumber(count, { style: 'integer' })} ${Locale.translate(count === 1 ? 'Result' : 'Results')})`;
    }

    if (self.settings.resultsText) {
      if (typeof self.settings.resultsText === 'function') {
        if (self.grandTotal) {
          countText = self.settings.resultsText(self, self.grandTotal, count);
        } else {
          const filteredCount = (self.filteredCount === 0 ? 0 : count - self.filteredCount);
          countText = self.settings.resultsText(self, count, filteredCount);
        }
      } else {
        countText = self.settings.resultsText;
      }
    }

    if (self.toolbar) {
      self.toolbar.find('.datagrid-result-count').html(countText);
      self.toolbar.attr('aria-label', self.toolbar.find('.title').text());
      self.toolbar.find('.datagrid-row-count').text(count);
    }
    self.element.closest('.modal').find('.datagrid-result-count').html(countText);

    this.checkEmptyMessage();
  },

  /**
  * Set the content dynamically on the empty message area.
  * @param  {object} emptyMessage The update empty message config object.
  */
  setEmptyMessage(emptyMessage) {
    // Re-evaluate the text
    // TODO if (this.settings.emptyMessage.title === '[NoData]') {
    // this.settings.emptyMessage.title = (Locale ?
    // Locale.translate('NoData') : 'No Data Available');
    // }

    if (!this.emptyMessage) {
      this.emptyMessageContainer = $('<div>');
      this.contentContainer.prepend(this.emptyMessageContainer);
      this.emptyMessage = this.emptyMessageContainer.emptymessage(emptyMessage).data('emptymessage');
    } else {
      this.emptyMessage.settings = emptyMessage;
      this.emptyMessage.updated();
    }
  },

  /**
  * See if the empty message object should be shown.
  * @private
  */
  checkEmptyMessage() {
    if (this.emptyMessage && this.emptyMessageContainer) {
      if (this.filteredCount === this.recordCount || this.recordCount === 0) {
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
    const cell = $(e.target).closest('td').index();
    const row = self.dataRowIndex($(e.target).closest('tr'));
    const item = self.settings.dataset[row];

    if ($(e.target).is('a')) {
      stopPropagation = false;
    }

    if (stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }

    self.element.trigger(eventName, [{ row, cell, item, originalEvent: e }]);
    return false;
  },

  /**
   * Returns the cell dom node.
   * @param  {number} row The row index.
   * @param  {number} cell The cell index.
   * @param  {boolean} includeGroups If true groups are taken into account.
   * @returns {object} The dom node
   */
  cellNode(row, cell, includeGroups) {
    let cells = null;
    let rowNode = this.tableBody.find(`tr:not(.datagrid-expandable-row)[aria-rowindex="${row + 1}"]`);

    if (row instanceof jQuery) {
      rowNode = row;
    }

    if (includeGroups && this.settings.groupable) {
      rowNode = this.tableBody.prevAll('.datagrid-rowgroup-header').eq(row);
      if (rowNode) {
        rowNode = this.tableBody.find('.datagrid-rowgroup-header').eq(row);
      }
    }

    if (cell === -1) {
      return $();
    }

    cells = rowNode.find('td');
    return cells.eq(cell >= cells.length ? cells.length - 1 : cell);
  },

  scrollLeft: 0,
  scrollTop: 0,

  handleScroll() {
    const left = this.contentContainer[0].scrollLeft;

    if (left !== this.scrollLeft && this.headerContainer) {
      this.scrollLeft = left;
      this.headerContainer[0].scrollLeft = this.scrollLeft;
    }
  },

  handleResize() {
    const self = this;
    self.clearHeaderCache();
    self.renderRows();
    self.renderHeader();
  },

  /**
   * Attach All relevant event handlers.
   * @private
   * @returns {void}
   */
  handleEvents() {
    const self = this;
    const isMultiple = this.settings.selectable === 'multiple';
    const isMixed = this.settings.selectable === 'mixed';

    // Set Focus on rows
    if (!self.settings.cellNavigation && self.settings.rowNavigation) {
      self.table
        .on('focus.datagrid', 'tbody > tr', function () {
          $(this).addClass('is-active-row');
        })
        .on('blur.datagrid', 'tbody > tr', () => {
          $('tbody > tr', self.table).removeClass('is-active-row');
        });
    }

    // Sync Header and Body During scrolling
    self.contentContainer
      .on('scroll.table', () => {
        self.handleScroll();
      });

    if (this.settings.virtualized) {
      let oldScroll = 0;
      let oldHeight = 0;

      self.contentContainer
        .on('scroll.vtable', debounce(function () {
          const scrollTop = this.scrollTop;
          const buffer = 25;
          const hitBottom = scrollTop >
            (self.virtualRange.bottom - self.virtualRange.bodyHeight - buffer);
          const hitTop = scrollTop < (self.virtualRange.top + buffer);

          if (scrollTop !== oldScroll && (hitTop || hitBottom)) {
            oldScroll = this.scrollTop;
            self.renderRows();
          }
        }, 0));

      $('body').on('resize.vtable', function () {
        const height = this.offsetHeight;

        if (height !== oldHeight) {
          oldHeight = this.scrollTop;
          self.renderRows();
        }
      });
    }

    // Handle Resize - Re do the columns
    if (self.settings.redrawOnResize) {
      let oldWidth = $('body')[0].offsetWidth;

      $('body').on('resize.datagrid', function () {
        const width = this.offsetWidth;
        if (width !== oldWidth) {
          oldWidth = width;
          self.handleResize();
        }
      });
    }

    // Handle Sorting
    this.element
      .off('click.datagrid')
      .on('click.datagrid', 'th.is-sortable, th.btn-filter', function (e) {
        if ($(e.target).parent().is('.datagrid-filter-wrapper')) {
          return;
        }

        self.setSortColumn($(this).attr('data-column-id'));
      });

    // Prevent redirects
    this.table
      .off('mouseup.datagrid touchstart.datagrid')
      .on('mouseup.datagrid touchstart.datagrid', 'a', (e) => {
        e.preventDefault();
      });

    // Handle Row Clicking
    const tbody = this.table.find('tbody');
    tbody.off('click.datagrid').on('click.datagrid', 'td', function (e) {
      let rowNode = null;
      let dataRowIdx = null;
      const target = $(e.target);

      if (target.closest('.datagrid-row-detail').length === 1) {
        return;
      }

      self.triggerRowEvent('click', e, true);
      self.setActiveCell(target.closest('td'));

      // Dont Expand rows or make cell editable when clicking expand button
      if (target.is('.datagrid-expand-btn') || (target.is('.datagrid-cell-wrapper') && target.find('.datagrid-expand-btn').length)) {
        rowNode = $(this).closest('tr');
        dataRowIdx = self.dataRowIndex(rowNode);

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

      if (isMixed) {
        canSelect = isSelectionCheckbox;

        // Then Activate
        if (!canSelect) {
          self.toggleRowActivation(target.closest('tr'));
        }
      }

      if (canSelect && isMultiple && e.shiftKey) {
        self.selectRowsBetweenIndexes([self.lastSelectedRow, target.closest('tr').index()]);
        e.preventDefault();
      } else if (canSelect) {
        self.toggleRowSelection(target.closest('tr'));
      }

      const isEditable = self.makeCellEditable(self.activeCell.dataRow, self.activeCell.cell, e);

      // Handle Cell Click Event
      const elem = $(this).closest('td');
      const cell = elem.parent().children(':visible').index(elem);
      const col = self.columnSettings(cell, true);

      if (col.click && typeof col.click === 'function' && target.is('button, input[checkbox], a') || target.parent().is('button')) {   //eslint-disable-line
        const rowElem = $(this).closest('tr');
        const rowIdx = self.dataRowIndex(rowElem);
        const item = self.settings.treeGrid ?
          self.settings.treeDepth[rowIdx].node :
          self.settings.dataset[self.pager && self.settings.source ? rowElem.index() : rowIdx];

        if (elem.hasClass('is-focusable')) {
          if (!target.is(self.settings.buttonSelector)) {
            if (!target.parent('button').is(self.settings.buttonSelector)) {
              return;
            }
          }
        }

        if (!elem.hasClass('is-cell-readonly') && target.is('button, input[checkbox], a') || target.parent().is('button')) {  //eslint-disable-line
          col.click(e, [{ row: rowIdx, cell: self.activeCell.cell, item, originalEvent: e }]);
        }
      }

      // Handle Context Menu on Some
      if (col.menuId) {
        const btn = $(this).find('button');
        btn.popupmenu({ attachToBody: true, autoFocus: false, mouseFocus: true, menuId: col.menuId, trigger: 'immediate', offset: { y: 5 } });

        if (col.selected) {
          btn.on('selected.datagrid', col.selected);
        }
      }

      // Apply Quick Edit Mode
      if (isEditable) {
        setTimeout(() => {
          if ($('textarea, input', elem).length &&
              (!$('.dropdown,' +
              '[type=image],' +
              '[type=button],' +
              '[type=submit],' +
              '[type=reset],' +
              '[type=checkbox],' +
              '[type=radio]', elem).length)) {
            self.quickEditMode = true;
          }
        }, 0);
      }
    });

    tbody.off('dblclick.datagrid').on('dblclick.datagrid', 'tr', (e) => {
      self.triggerRowEvent('dblclick', e, true);
    });

    // Handle Context Menu Option
    tbody.off('contextmenu.datagrid').on('contextmenu.datagrid', 'tr', (e) => {
      if (!self.isSubscribedTo(e, 'contextmenu')) {
        return;
      }

      self.triggerRowEvent('contextmenu', e, (!!self.settings.menuId));
      e.preventDefault();

      if (self.settings.menuId) {
        $(e.currentTarget).popupmenu({
          menuId: self.settings.menuId,
          eventObj: e,
          beforeOpen: self.settings.menuBeforeOpen,
          attachToBody: true,
          trigger: 'immediate'
        })
          .off('selected').on('selected', (selectedEvent, args) => {
            if (self.settings.menuSelected) {
              self.settings.menuSelected(selectedEvent, args);
            }
          })
          .off('close')
          .on('close', function () {
            const elem = $(this);
            if (elem.data('popupmenu')) {
              elem.data('popupmenu').destroy();
            }
          });
      }

      return false; // eslint-disable-line
    });

    // Move the drag handle to the end or start of the column
    this.headerRow
      .off('mousemove.datagrid')
      .on('mousemove.datagrid', 'th', (e) => {
        if (self.dragging) {
          return;
        }

        self.currentHeader = $(e.target).closest('th');

        if (!self.currentHeader.hasClass('is-resizable')) {
          return;
        }

        const headerDetail = self.currentHeader.closest('.header-detail');
        const extraMargin = headerDetail.length ? parseInt(headerDetail.css('margin-left'), 10) : 0;
        const leftEdge = (parseInt(self.currentHeader.position().left, 10) - (extraMargin || 0)) +
          self.element.scrollLeft();
        const rightEdge = leftEdge + self.currentHeader.outerWidth();
        const alignToLeft = (e.pageX - leftEdge > rightEdge - e.pageX);
        let leftPos = 0;

        // TODO: Test Touch support - may need handles on each column
        leftPos = (alignToLeft ? (rightEdge - 6) : (leftEdge - 6));

        // Ignore First Column
        if (self.currentHeader.index() === 0 && !alignToLeft) {
          leftPos = '-999';
        }

        if (!alignToLeft) {
          self.currentHeader = self.currentHeader.prevAll(':visible').not('.is-hidden').first();
        }

        if (!self.currentHeader.hasClass('is-resizable')) {
          return;
        }

        self.createResizeHandle();
        self.resizeHandle[0].style.left = `${leftPos}px`;
        self.resizeHandle[0].style.cursor = '';
      }).off('contextmenu.datagrid').on('contextmenu.datagrid', 'th', (e) => {
        // Add Header Context Menu Support
        e.preventDefault();

        if (self.settings.headerMenuId) {
          $(e.currentTarget)
            .popupmenu({
              menuId: self.settings.headerMenuId,
              eventObj: e,
              attachToBody: true,
              beforeOpen: self.settings.headerMenuBeforeOpen,
              trigger: 'immediate'
            })
            .off('selected.gridpopup')
            .on('selected.gridpopup', (selectedEvent, args) => {
              self.settings.headerMenuSelected(selectedEvent, args);
            });
        }

        return false;
      });

    // Handle Clicking Header Checkbox
    this
      .headerRow
      .off('click.datagrid')
      .on('click.datagrid', 'th .datagrid-checkbox', function () {
        const checkbox = $(this);

        if (!checkbox.hasClass('is-checked')) {
          checkbox.addClass('is-checked').attr('aria-checked', 'true');

          self.selectAllRows();
        } else {
          checkbox.removeClass('is-checked').attr('aria-checked', 'true');
          self.unSelectAllRows();
        }
      });

    // Implement Editing Auto Commit Functionality
    tbody.off('focusout.datagrid').on('focusout.datagrid', 'td input, td textarea, div.dropdown', (e) => {
      // Keep icon clickable in edit mode
      const target = e.target;

      if ($(target).is('input.lookup, input.timepicker, input.datepicker, input.spinbox, input.colorpicker')) {
        // Wait for modal popup, if did not found modal popup means
        // icon was not clicked, then commit cell edit
        setTimeout(() => {
          const focusElem = $('*:focus');

          if (!$('.lookup-modal.is-visible, #timepicker-popup, #calendar-popup, #colorpicker-menu').length &&
              self.editor) {
            if (focusElem.is('.spinbox')) {
              return;
            }

            if (focusElem.is('.trigger')) {
              return;
            }

            if (!$(target).is(':visible')) {
              return;
            }

            if (focusElem && self.editor.className &&
              focusElem.closest(self.editor.className).length > 0) {
              return;
            }

            self.commitCellEdit(self.editor.input);
          }
        }, 150);

        return;
      }

      // Popups are open
      if ($('#dropdown-list, .autocomplete.popupmenu.is-open, #timepicker-popup').is(':visible')) {
        return;
      }

      if (self.editor && self.editor.input) {
        self.commitCellEdit(self.editor.input);
      }
    });
  },

  // Check if the event is subscribed to
  isSubscribedTo(e, eventName) {
    const self = this;

    for (const event in $._data(self.element[0]).events) { //eslint-disable-line
      if (event === eventName) {
        return true;
      }
    }

    return false;
  },

  // Adjust to set a changed row height
  refreshSelectedRowHeight() {
    const toolbar = this.element.parent().find('.toolbar:not(.contextual-toolbar)');
    const short = toolbar.find('[data-option="row-short"]');
    const med = toolbar.find('[data-option="row-medium"]');
    const normal = toolbar.find('[data-option="row-normal"]');

    if (this.settings.rowHeight === 'short') {
      short.parent().addClass('is-checked');
      med.parent().removeClass('is-checked');
      normal.parent().removeClass('is-checked');
    }

    if (this.settings.rowHeight === 'medium') {
      short.parent().removeClass('is-checked');
      med.parent().addClass('is-checked');
      normal.parent().removeClass('is-checked');
    }

    if (this.settings.rowHeight === 'normal') {
      short.parent().removeClass('is-checked');
      med.parent().removeClass('is-checked');
      normal.parent().addClass('is-checked');
    }

    // Set draggable targets arrow height
    $('.drag-target-arrows', this.element).css('height', `${this.getTargetHeight()}px`);
  },

  appendToolbar() {
    let toolbar = null;
    let title = '';
    let more = null;
    const self = this;

    if (!this.settings.toolbar) {
      return;
    }

    // Allow menu to be added manually
    if (this.element.parent().find('.toolbar:not(.contextual-toolbar)').length === 1) {
      toolbar = this.element.parent().find('.toolbar:not(.contextual-toolbar)');
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
          `<li class="is-selectable${this.settings.rowHeight === 'short' ? ' is-checked' : ''}"><a data-option="row-short">${Locale.translate('Short')}</a></li>` +
          `<li class="is-selectable${this.settings.rowHeight === 'medium' ? ' is-checked' : ''}"><a data-option="row-medium">${Locale.translate('Medium')}</a></li>` +
          `<li class="is-selectable${this.settings.rowHeight === 'normal' ? ' is-checked' : ''}"><a data-option="row-normal">${Locale.translate('Normal')}</a></li>`);
      }

      if (this.settings.toolbar.filterRow) {
        menu.append(`${'<li class="separator"></li>' +
          '<li class="heading">'}${Locale.translate('Filter')}</li>` +
          `<li class="${this.settings.filterable ? 'is-checked ' : ''}is-toggleable"><a data-option="show-filter-row">${Locale.translate('ShowFilterRow')}</a></li>` +
          `<li class="is-indented"><a data-option="run-filter">${Locale.translate('RunFilter')}</a></li>` +
          `<li class="is-indented"><a data-option="clear-filter">${Locale.translate('ClearFilter')}</a></li>`);
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

    toolbar.find('.btn-actions').popupmenu().on('selected', (e, args) => {
      const action = args.attr('data-option');
      if (action === 'row-short' || action === 'row-medium' || action === 'row-normal') {
        self.rowHeight(action.substr(4));
      }

      if (action === 'personalize-columns') {
        self.personalizeColumns();
      }

      if (action === 'reset-layout') {
        self.resetColumns();
      }

      if (action === 'export-to-excel') {
        // self.exportToExcel();
        self.exportToCsv();
      }

      // Filter actions
      if (action === 'show-filter-row') {
        self.toggleFilterRow();
      }
      if (action === 'run-filter') {
        self.applyFilter();
      }
      if (action === 'clear-filter') {
        self.clearFilter();
      }
    });

    if (this.settings.initializeToolbar && !toolbar.data('toolbar')) {
      const opts = $.fn.parseOptions(toolbar);

      if (this.settings.toolbar.fullWidth) {
        opts.rightAligned = true;
      }

      toolbar.toolbar(opts);
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

    this.toolbar = toolbar;
    this.element.addClass('has-toolbar');
  },

  /**
   * Get or Set the Row Height.
   * @param  {string} height The row height to use, can be 'short', 'normal' or 'medium'
   * @Returns {string} The current row height
   */
  rowHeight(height) {
    if (height) {
      this.settings.rowHeight = height;
    }

    this.element.add(this.table)
      .removeClass('short-rowheight medium-rowheight normal-rowheight')
      .addClass(`${this.settings.rowHeight}-rowheight`);

    if (this.virtualRange && this.virtualRange.rowHeight) {
      this.virtualRange.rowHeight = (height === 'normal' ? 40 : (height === 'medium' ? 30 : 25));
    }

    this.saveUserSettings();
    this.refreshSelectedRowHeight();
    return this.settings.rowHeight;
  },

  /**
  * Search a Term across all columns
  * @param  {string} term The term to search for.
  */
  keywordSearch(term) {
    this.tableBody.find('tr[role="row"]').removeClass('is-filtered').show();
    this.filterExpr = [];

    this.tableBody.find('.datagrid-expandable-row').each(function () {
      const row = $(this);
      // Collapse All rows
      row.prev().find('.datagrid-expand-btn').removeClass('is-expanded');
      row.prev().find('.plus-minus').removeClass('active');
      row.removeClass('is-expanded').css('display', '');
      row.find('.datagrid-row-detail').css('height', '');
    });

    this.tableBody.find('.search-mode').each(function () {
      const cell = $(this);
      const text = cell.text();
      cell.text(text.replace('<i>', '').replace('</i>', ''));
    });

    term = (term || '').toLowerCase();
    this.filterExpr.push({ column: 'all', operator: 'contains', value: term, keywordSearch: true });

    this.filterKeywordSearch();
    this.renderRows();
    this.resetPager('searched');
    this.setSearchActivePage();

    if (!this.settings.paging) {
      this.highlightSearchRows(term);
    }
  },

  /**
   * Set search active page
   * @private
   */
  setSearchActivePage() {
    if (this.pager && this.filterExpr && this.filterExpr.length === 1) {
      if (this.filterExpr[0].value !== '') {
        if (this.pager.searchActivePage === undefined) {
          this.pager.searchActivePage = this.pager.activePage;
        }
        this.pager.setActivePage(1, true);
      } else if (this.filterExpr[0].value === '' && this.pager.searchActivePage > -1) {
        this.pager.setActivePage(this.pager.searchActivePage, true);
        delete this.pager.searchActivePage;
      }
    } else if (this.pager && this.pager.searchActivePage > -1) {
      this.pager.setActivePage(this.pager.searchActivePage, true);
      delete this.pager.searchActivePage;
    }
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
        value = value.replace(/(<([^>]+)>)|(&lt;([^>]+)&gt;)/ig, '');

        return value.indexOf(filterExpr.value) > -1;
      };

      // Check in all visible columns
      if (filterExpr.column === 'all') {
        self.headerRow.find('th:visible').each(function () { //eslint-disable-line
          const th = $(this);
          const columnId = th.attr('data-column-id');

          isMatch = checkColumn(columnId);
          if (isMatch) {
            return false;
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
        dataset[i].node.isFiltered = isFiltered;
      }
    } else {
      dataset = self.settings.dataset;
      for (i = 0, len = dataset.length; i < len; i++) {
        isFiltered = filterExpr.value === '' ? false : !checkRow(dataset[i], i);
        dataset[i].isFiltered = isFiltered;
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
    // Move across all visible cells and rows, highlighting
    this.tableBody.find('tr').each(function () {
      let found = false;
      const row = $(this);

      row.find('td').each(function () {
        const cell = $(this);
        const cellText = cell.text().toLowerCase();

        if (cellText.indexOf(term) > -1) {
          found = true;
          cell.find('*').each(function () {
            if (this.innerHTML === this.textContent) {
              const contents = this.textContent;
              const node = $(this);
              const exp = new RegExp(`(${term})`, 'i');

              node.addClass('search-mode').html(contents.replace(exp, '<i>$1</i>'));
            }
          });
        }
      });

      // Hide non matching rows
      if (!found) {
        row.addClass('is-filtered').hide();
      } else if (found && row.is('.datagrid-expandable-row') && term !== '') {
        row.prev().show();
        row.prev().find('.datagrid-expand-btn').addClass('is-expanded');
        row.prev().find('.plus-minus').addClass('active');
        row.addClass('is-expanded').css('display', 'table-row');
        row.find('.datagrid-row-detail').css('height', 'auto');
      }
    });
  },

  selectAllRows() {
    const rows = [];
    const s = this.settings;
    const dataset = s.treeGrid ? s.treeDepth : s.dataset;

    for (let i = 0, l = dataset.length; i < l; i++) {
      if (this.filterRowRendered) {
        if (!dataset[i].isFiltered) {
          rows.push(i);
        }
      } else {
        rows.push(i);
      }
    }

    this.dontSyncUi = true;
    this.selectRows(rows, true, true);
    this.dontSyncUi = false;
    this.syncSelectedUI();
    this.element.triggerHandler('selected', [this.selectedRows(), 'selectall']);
  },

  unSelectAllRows() {
    const selectedRows = this.selectedRows();
    this.dontSyncUi = true;
    for (let i = 0, l = selectedRows.length; i < l; i++) {
      this.unselectRow(selectedRows[i].idx, true, true);
    }
    this.dontSyncUi = false;
    this.syncSelectedUI();
    this.element.triggerHandler('selected', [this.selectedRows(), 'deselectall']);
  },

  /**
  * Check if node index is exists in selected nodes
  * @private
  * @param {object} node The node to compare.
  * @returns {boolean} If its selected or not.
  */
  isNodeSelected(node) {
    // As of 4.3.3, return the rows that have _selected = true
    return node._selected === true;
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
    let checkbox = null;
    const s = this.settings;

    if (idx === undefined || idx === -1 || !s.selectable) {
      return;
    }

    rowNode = this.visualRowNode(idx);
    dataRowIndex = this.dataRowIndex(rowNode);

    if (isNaN(dataRowIndex)) {
      dataRowIndex = idx;
    }

    if (!rowNode) {
      return;
    }

    const selectedRows = this.selectedRows();
    if (s.selectable === 'single' && selectedRows.length > 0) {
      this.unselectRow(selectedRows[0].idx, true, true);
    }

    if (!rowNode.hasClass('is-selected')) {
      let rowData;
      const selectNode = function (elem, index, data) {
        // do not add if already exists in selected
        if (self.isNodeSelected(data)) {
          return;
        }
        checkbox = self.cellNode(elem, self.columnIdxById('selectionCheckbox'));
        elem.addClass(`is-selected${self.settings.selectable === 'mixed' ? ' hide-selected-color' : ''}`).attr('aria-selected', 'true')
          .find('td').attr('aria-selected', 'true');
        checkbox.find('.datagrid-cell-wrapper .datagrid-checkbox')
          .addClass('is-checked').attr('aria-checked', 'true');

        data._selected = true;
      };

      if (s.treeGrid) {
        if (rowNode.is('.datagrid-tree-parent') && s.selectable === 'multiple') {
          // Select node and node-children
          rowNode.add(rowNode.nextUntil('[aria-level="1"]')).each(function (i) {
            const elem = $(this);
            const index = elem.attr('aria-rowindex') - 1;
            const data = s.treeDepth[index].node;

            // Allow select node if selectChildren is true or only first node
            // if selectChildren is false
            if (s.selectChildren || (!s.selectChildren && i === 0)) {
              selectNode(elem, index, data);
            }
          });
        } else if (s.selectable === 'siblings') {
          this.unSelectAllRows();

          // Select node and node-siblings
          const level = rowNode.attr('aria-level');
          let nexts = rowNode.nextUntil(`[aria-level!="${level}"]`);
          let prevs = rowNode.prevUntil(`[aria-level!="${level}"]`);

          if (level === '1') {
            nexts = rowNode.parent().find('[aria-level="1"]');
            prevs = null;
          }

          rowNode.add(nexts).add(prevs).each(function (i) {
            const elem = $(this);
            const index = elem.attr('aria-rowindex') - 1;
            const data = s.treeDepth[index].node;

            // Allow select node if selectChildren is true or only first node
            // if selectChildren is false
            if (s.selectChildren || (!s.selectChildren && i === 0)) {
              selectNode(elem, index, data);
            }
          });
        } else { // Default to Single element selection
          rowData = s.treeDepth[self.pager && s.source ? rowNode.index() : dataRowIndex].node;
          selectNode(rowNode, dataRowIndex, rowData);
        }
        self.setNodeStatus(rowNode);
      } else {
        dataRowIndex = self.pager && s.source ? rowNode.index() : dataRowIndex;
        rowData = s.dataset[dataRowIndex];
        if (s.groupable) {
          const gData = self.groupArray[dataRowIndex];
          rowData = s.dataset[gData.group].values[gData.node];
        }
        selectNode(rowNode, dataRowIndex, rowData);
        self.lastSelectedRow = idx;// Rememeber index to use shift key
      }
    }

    if (!nosync) {
      self.syncSelectedUI();
    }

    if (!noTrigger) {
      this.element.triggerHandler('selected', [this.selectedRows(), 'select']);
    }
  },

  dontSyncUi: false,

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
  },

  /**
  * Set the checkbox on the header based on selections.
  * @private
  * @param  {array} rows The rows to select.
  * @returns {void}
  */
  syncHeaderCheckbox(rows) {
    const headerCheckbox = this.headerRow.find('.datagrid-checkbox');
    const rowsLength = rows.length;
    const selectedRowsLength = this.selectedRows().length;
    const status = headerCheckbox.data('selected');

    // Do not run if checkbox in same state
    if ((selectedRowsLength !== rowsLength &&
          selectedRowsLength > 0 && status === 'partial') ||
            (selectedRowsLength === rowsLength && status === 'all') ||
              (selectedRowsLength === 0 && status === 'none')) {
      return;
    }

    // Sync the header checkbox
    if (selectedRowsLength > 0) {
      headerCheckbox.data('selected', 'partial')
        .addClass('is-checked is-partial');
    }

    if (selectedRowsLength === rowsLength) {
      headerCheckbox.data('selected', 'all')
        .addClass('is-checked').removeClass('is-partial');
    }

    if (selectedRowsLength === 0) {
      headerCheckbox.data('selected', 'none')
        .removeClass('is-checked is-partial');
    }
  },

  /**
   * Set ui elements based on selected rows
   * @private
   * @returns {void}
   */
  syncSelectedUI() {
    const s = this.settings;
    const dataset = s.treeGrid ? s.treeDepth : s.dataset;
    let rows = dataset;

    if (this.filterRowRendered) {
      rows = [];
      for (let i = 0, l = dataset.length; i < l; i++) {
        if (!dataset[i].isFiltered) {
          rows.push(i);
        }
      }
    }

    this.syncHeaderCheckbox(rows);

    // Open or Close the Contextual Toolbar.
    if (this.contextualToolbar.length !== 1 || this.dontSyncUi) {
      return;
    }

    const selectedRows = this.selectedRows();

    if (selectedRows.length === 0) {
      this.contextualToolbar.animateClosed();
    }

    if (selectedRows.length > 0 && this.contextualToolbar.height() === 0) {
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

  // deactivate the currently activated row
  deactivateRow() {
    const idx = this.activatedRow()[0].row;
    if (idx >= 0) {
      this.toggleRowActivation(idx);
    }
  },

  // Gets the currently activated row
  activatedRow() {
    if (!this.tableBody) {
      return [{ row: -1, item: undefined, elem: undefined }];
    }

    const activatedRow = this.tableBody.find('tr.is-rowactivated');

    if (activatedRow.length) {
      let rowIndex = this.dataRowIndex(activatedRow);

      if (this.settings.indeterminate) {
        rowIndex = this.actualArrayIndex(activatedRow);
      }

      return [{ row: rowIndex, item: this.settings.dataset[rowIndex], elem: activatedRow }];
    }
    // Activated row may be filtered or on another page, so check all until find it
    for (let i = 0; i < this.settings.dataset.length; i++) {
      if (this.settings.dataset[i]._rowactivated) {
        return [{ row: i, item: this.settings.dataset[i], elem: undefined }];
      }
    }

    return [{ row: -1, item: undefined, elem: activatedRow }];
  },

  /**
  * Toggle the current activation state from on to off.
  * @param  {number} idx The row to toggle
  * @returns {void}
  */
  toggleRowActivation(idx) {
    let row = (typeof idx === 'number' ? this.tableBody.find(`tr[aria-rowindex="${idx + 1}"]`) : idx);
    let rowIndex = (typeof idx === 'number' ? idx : ((this.pager && this.settings.source) ? this.actualArrayIndex(row) : this.dataRowIndex(row)));
    const item = this.settings.dataset[rowIndex];
    const isActivated = item ? item._rowactivated : false;

    if (typeof idx === 'number' && this.pager && this.settings.source && this.settings.indeterminate) {
      const rowIdx = idx + ((this.pager.activePage - 1) * this.settings.pagesize);
      row = this.tableBody.find(`tr[aria-rowindex="${rowIdx + 1}"]`);
      rowIndex = idx;
    }

    if (isActivated) {
      if (!this.settings.disableRowDeactivation) {
        row.removeClass('is-rowactivated');
        delete this.settings.dataset[rowIndex]._rowactivated;
        this.element.triggerHandler('rowdeactivated', [{ row: rowIndex, item: this.settings.dataset[rowIndex] }]);
      }
    } else {
      // Deselect old row
      const oldActivated = this.tableBody.find('tr.is-rowactivated');
      if (oldActivated.length) {
        oldActivated.removeClass('is-rowactivated');

        const oldIdx = this.dataRowIndex(oldActivated);
        if (this.settings.dataset[oldIdx]) { // May have changed page
          delete this.settings.dataset[oldIdx]._rowactivated;
        }
        this.element.triggerHandler('rowdeactivated', [{ row: oldIdx, item: this.settings.dataset[oldIdx] }]);
      } else {
        // Old active row may be filtered or on another page, so check all until find it
        for (let i = 0; i < this.settings.dataset.length; i++) {
          if (this.settings.dataset[i]._rowactivated) {
            delete this.settings.dataset[i]._rowactivated;
            this.element.triggerHandler('rowdeactivated', [{ row: i, item: this.settings.dataset[i] }]);
            break;
          }
        }
      }

      // Activate new row
      row.addClass('is-rowactivated');
      if (this.settings.dataset[rowIndex]) { // May have changed page
        this.settings.dataset[rowIndex]._rowactivated = true;
        this.element.triggerHandler('rowactivated', [{ row: rowIndex, item: this.settings.dataset[rowIndex] }]);
      }
    }
  },

  /**
  * Toggle the current selection state from on to off.
  * @param  {number} idx The row to select/unselect
  * @returns {void}
  */
  toggleRowSelection(idx) {
    const row = (typeof idx === 'number' ? this.tableBody.find(`tr[aria-rowindex="${idx + 1}"]`) : idx);
    const isSingle = this.settings.selectable === 'single';
    const rowIndex = (typeof idx === 'number' ? idx :
      (this.settings.treeGrid || this.settings.groupable) ?
        this.dataRowIndex(row) : this.actualArrayIndex(row));

    if (this.settings.selectable === false) {
      return;
    }

    if (this.editor && row.hasClass('is-selected')) {
      return;
    }

    if (isSingle && row.hasClass('is-selected')) {
      this.unselectRow(rowIndex);
      this.displayCounts();
      return this.selectedRows(); // eslint-disable-line
    }

    if (row.hasClass('is-selected')) {
      this.unselectRow(rowIndex);
    } else {
      this.selectRow(rowIndex);
    }

    this.displayCounts();

    return this.selectedRows(); // eslint-disable-line
  },

  /**
  * De-select a selected row.
  * @param  {[type]} idx The row index
  * @param  {[type]} nosync Do not sync the header
  * @param  {[type]} noTrigger Do not trgger any events
  */
  unselectRow(idx, nosync, noTrigger) {
    const self = this;
    const s = self.settings;
    const rowNode = self.visualRowNode(idx);
    let checkbox = null;

    if (!rowNode || idx === undefined) {
      return;
    }

    // Unselect it
    const unselectNode = function (elem, index) {
      const removeSelected = function (node) {
        delete node._selected;
        self.selectedRowCount--;
      };
      checkbox = self.cellNode(elem, self.columnIdxById('selectionCheckbox'));
      elem.removeClass('is-selected hide-selected-color').removeAttr('aria-selected')
        .find('td').removeAttr('aria-selected');
      checkbox.find('.datagrid-cell-wrapper .datagrid-checkbox')
        .removeClass('is-checked no-animate').attr('aria-checked', 'false');

      if (s.treeGrid) {
        for (let i = 0; i < s.treeDepth.length; i++) {
          if (self.isNodeSelected(s.treeDepth[i].node)) {
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
        const selIdx = elem.length ? self.actualArrayIndex(elem) : index;
        let rowData;

        if (selIdx !== undefined && selIdx > -1) {
          rowData = self.settings.dataset[selIdx];
        }
        if (s.groupable) {
          const gData = self.groupArray[idx];
          rowData = s.dataset[gData.group].values[gData.node];
        }
        if (rowData !== undefined) {
          removeSelected(rowData);
        }
      }
    };

    if (s.treeGrid) {
      if (rowNode.is('.datagrid-tree-parent') && s.selectable === 'multiple') {
        // Select node and node-children
        rowNode.add(rowNode.nextUntil('[aria-level="1"]')).each(function (i) {
          const elem = $(this);
          const index = elem.attr('aria-rowindex') - 1;

          // Allow unselect node if selectChildren is true or only first node
          if (s.selectChildren || (!s.selectChildren && i === 0)) {
            unselectNode(elem, index);
          }
        });
      } else if (s.selectable === 'siblings') {
        rowNode.parent().find('.is-selected').each(function (i) {
          const elem = $(this);
          const index = elem.attr('aria-rowindex') - 1;

          // Allow unselect node if selectChildren is true or only first node
          if (s.selectChildren || (!s.selectChildren && i === 0)) {
            unselectNode(elem, index);
          }
        });
      } else { // Single element unselection
        unselectNode(rowNode, idx);
      }
      self.setNodeStatus(rowNode);
    } else {
      unselectNode(rowNode, idx);
    }

    if (!nosync) {
      self.syncSelectedUI();
    }

    if (!noTrigger) {
      self.element.triggerHandler('selected', [self.selectedRows(), 'deselect']);
    }
  },

  /**
   * Set the current status on the row status column
   * @param {[type]} node The node to set the status on
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
    let status = false;
    let total = 0;
    let selected = 0;
    let unselected = 0;

    node.add(node.nextUntil('[aria-level="1"]')).each(function () {
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
    const self = this;
    const s = self.settings;
    const dataset = s.treeGrid ? s.treeDepth : s.dataset;
    const selectedRows = [];
    let idx = -1;

    for (let i = 0, data; i < dataset.length; i++) {
      if (s.groupable) {
        for (let k = 0; k < dataset[i].values.length; k++) {
          idx++;
          data = dataset[i].values[k];
          if (self.isNodeSelected(data)) {
            selectedRows.push({
              idx,
              data,
              elem: self.dataRowNode(idx),
              group: dataset[i]
            });
          }
        }
      } else {
        data = s.treeGrid ? dataset[i].node : dataset[i];
        if (self.isNodeSelected(data)) {
          selectedRows.push({ idx: i, data, elem: self.visualRowNode(i) });
        }
      }
    }
    return selectedRows;
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
    const isSingle = s.selectable === 'single';
    const isMultiple = s.selectable === 'multiple' || s.selectable === 'mixed';
    const dataset = s.treeGrid ? s.treeDepth : s.dataset;
    let gIdx = idx;

    // As of 4.3.3, return the rows that have _selected = true
    let selectedRows = this.selectedRows();

    if (!row || row.length === 0) {
      return selectedRows;
    }

    if (isSingle) {
      // Unselect
      if (selectedRows.length) {
        this.unselectRow(selectedRows[0].idx, true, true);
      }

      // Select - may be passed array or int
      idx = ((Object.prototype.toString.call(row) === '[object Array]') ? row[0] : row.index());
      this.selectRow(idx, true, true);
    }

    if (isMultiple) {
      if (Object.prototype.toString.call(row) === '[object Array]') {
        for (let i = 0; i < row.length; i++) {
          if (s.groupable) {
            for (let k = 0; k < dataset[i].values.length; k++) {
              gIdx++;
              this.selectRow(gIdx, true, true);
            }
          } else {
            this.selectRow(row[i], true, true);
          }
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

    selectedRows = this.selectedRows();
    this.displayCounts();

    if (!nosync) {
      this.syncSelectedUI();
    }
    if (!selectAll) {
      this.element.triggerHandler('selected', [selectedRows, 'select']);
    }

    return selectedRows;
  },

  // Set the row status
  rowStatus(idx, status, tooltip) {
    if (!status) {
      delete this.settings.dataset[idx].rowStatus;
      this.updateRow(idx);
      return;
    }

    if (!this.settings.dataset[idx]) {
      return;
    }

    this.settings.dataset[idx].rowStatus = {};
    const rowStatus = this.settings.dataset[idx].rowStatus;

    rowStatus.icon = status;
    status = status.charAt(0).toUpperCase() + status.slice(1);
    status = status.replace('-progress', 'Progress');
    rowStatus.text = Locale.translate(status);

    tooltip = tooltip ? tooltip.charAt(0).toUpperCase() + tooltip.slice(1) : rowStatus.text;
    rowStatus.tooltip = tooltip;

    this.updateRow(idx);
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
      }
    }
    return idx;
  },

  // Current Active Cell
  activeCell: { node: null, cell: null, row: null },

  /**
  * Handle all keyboard behavior
  * @private
  * @returns {void}
  */
  handleKeys() {
    const self = this;
    const isMultiple = self.settings.selectable === 'multiple';
    const checkbox = $('th .datagrid-checkbox', self.headerRow);

    // Handle header navigation
    self.headerTable.on('keydown.datagrid', 'th', function (e) {
      const key = e.which || e.keyCode || e.charCode || 0;
      const th = $(this);
      const index = th.siblings(':visible').addBack().index(th);
      const last = self.visibleColumns().length - 1;
      let triggerEl;
      let move;

      if ($(e.target).closest('.popupmenu').length > 0) {
        return;
      }

      // Enter or Space
      if (key === 13 || key === 32) {
        triggerEl = (isMultiple && index === 0) ? $('.datagrid-checkbox', th) : th;
        triggerEl.trigger('click.datagrid').focus();

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

        // Making move
        th.removeAttr('tabindex').removeClass('is-active');
        $('th:not(.is-hidden)', this.header).eq(move).attr('tabindex', '0').addClass('is-active')
          .focus();
        e.preventDefault();
      }

      // Down arrow
      if (key === 40) {
        th.removeAttr('tabindex');
        self.activeCell.node = self.cellNode(0, self.settings.groupable ? 0 : self.activeCell.cell, true).attr('tabindex', '0').focus();
        e.preventDefault();
      }
    });

    // Handle Editing / Keyboard
    self.table.on('keydown.datagrid', 'td, input', (e) => { //eslint-disable-line
      const key = e.which || e.keyCode || e.charCode || 0;
      let handled = false;

      // F2 - toggles actionableMode "true" and "false"
      if (key === 113) {
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
    self.table.on('keydown.datagrid', 'td', function (e) {
      const key = e.which || e.keyCode || e.charCode || 0;
      let handled = false;
      const isRTL = Locale.isRTL();
      const node = self.activeCell.node;
      const rowNode = $(this).parent();
      const prevRow = rowNode.prevAll(':not(.is-hidden, .datagrid-expandable-row)').first();
      const nextRow = rowNode.nextAll(':not(.is-hidden, .datagrid-expandable-row)').first();
      let row = self.activeCell.row;
      let cell = self.activeCell.cell;
      const col = self.columnSettings(cell);
      const isGroupRow = rowNode.is('.datagrid-rowgroup-header, .datagrid-rowgroup-footer');
      const item = self.settings.dataset[self.dataRowIndex(node)];
      const visibleRows = self.tableBody.find('tr:visible');
      const getVisibleRows = function (index) {
        const visibleRow = visibleRows.filter(`[aria-rowindex="${index + 1}"]`);
        if (visibleRow.is('.datagrid-rowgroup-header')) {
          return visibleRow.index();
        }
        return self.dataRowIndex(visibleRow);
      };

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
          if ((!isRTL && (key === 37 || key === 9 && e.shiftKey)) || // eslint-disable-line
              (isRTL && (key === 39 || key === 9))) { // eslint-disable-line
            cell = getNextVisibleCell(cell, lastCell, true);
          } else {
            cell = getNextVisibleCell(cell, lastCell);
          }

          if (cell instanceof jQuery) {
            self.setActiveCell(cell);
          } else {
            self.setActiveCell(row, cell);
          }
          self.quickEditMode = false;
          handled = true;
        }
      }

      // Up arrow key
      if (key === 38 && !self.quickEditMode) {
        // Press [Control + Up] arrow to move to the first row on the first page.
        if (e.altKey || e.metaKey) {
          self.setActiveCell(getVisibleRows(0), cell);
          handled = true;
        } else { // Up arrow key to navigate by row.
          if (row === 0 && !prevRow.is('.datagrid-rowgroup-header')) {
            node.removeAttr('tabindex');
            self.headerRow.find('th').eq(cell).attr('tabindex', '0').focus();
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

      // Press Control+Spacebar to announce the current row when using a screen reader.
      if (key === 32 && e.ctrlKey && node) {
        let string = '';
        row = node.closest('tr');

        row.children().each(function () {
          const cellNode = $(this);
          // Read Header
          // string += $('#' + cell.attr('aria-describedby')).text() + ' ' + cell.text() + ' ';
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

        if ($(e.target).closest('.datagrid-row-detail').length === 1) {
          return;
        }
        e.preventDefault();

        // Toggle datagrid-expand with Space press
        const btn = $(e.target).find('.datagrid-expand-btn, .datagrid-drilldown');
        if (btn && btn.length) {
          btn.trigger('click.datagrid');
          e.preventDefault();
          return;
        }

        if (isMultiple && e.shiftKey) {
          self.selectRowsBetweenIndexes([self.lastSelectedRow, row.index()]);
        } else {
          self.toggleRowSelection(row);
        }
      }

      // For Editable mode - press Enter or Space to edit or toggle a cell,
      // or click to activate using a mouse.
      if (self.settings.editable && key === 32) {
        if (!self.editor) {
          self.makeCellEditable(row, cell, e);
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
        if ($(e.target).is('textarea') && e.shiftKey) {
          return;
        }

        if (self.editor) {
          self.quickEditMode = false;
          self.commitCellEdit(self.editor.input);
          self.setNextActiveCell(e);
        } else {
          self.makeCellEditable(row, cell, e);
          if (self.isContainTextfield(node) && self.notContainTextfield(node)) {
            self.quickEditMode = true;
          }
        }
        handled = true;
      }

      // Any printable character - well make it editable
      if ([9, 13, 32, 35, 36, 37, 38, 39, 40, 113].indexOf(key) === -1 &&
        !e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && self.settings.editable) {
        if (!self.editor) {
          self.makeCellEditable(row, cell, e);
        }
      }

      // If multiSelect is enabled, press Control+A to toggle select all rows
      if (isMultiple && !self.editor && ((e.ctrlKey || e.metaKey) && key === 65)) {
        checkbox
          .addClass('is-checked')
          .removeClass('is-partial')
          .attr('aria-checked', 'true');
        self.selectAllRows();
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
   * Does the editor have a text field?
   * @private
   * @param  {object} container The dom element
   * @returns {boolean} If it does or not.
   */
  isContainTextfield(container) {
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

  notContainTextfield(container) {
    const selector = '.dropdown, .datepicker';
    return !($(selector, container).length);
  },

  // Current Cell Editor thats in Use
  editor: null,

  isCellEditable(row, cell) {
    if (!this.settings.editable) {
      return false;
    }

    const col = this.columnSettings(cell);
    if (col.readonly) {
      return false;
    }

    // Check if cell is editable via hook function
    const cellNode = this.activeCell.node.find('.datagrid-cell-wrapper');
    const cellValue = (cellNode.text() ? cellNode.text() :
      this.fieldValue(this.settings.dataset[row], col.field));

    if (col.isEditable) {
      const canEdit = col.isEditable(row, cell, cellValue, col, this.settings.dataset[row]);

      if (!canEdit) {
        return false;
      }
    }

    if (!col.editor) {
      return false;
    }

    return true;
  },

  // Invoked in three cases: 1) a row click, 2) keyboard and enter,
  // 3) In actionable mode and tabbing
  makeCellEditable(row, cell, event) {
    if (this.activeCell.node.closest('tr').hasClass('datagrid-summary-row')) {
      return;
    }

    // Already in edit mode
    const cellNode = this.activeCell.node.find('.datagrid-cell-wrapper');
    const cellParent = cellNode.parent('td');

    if (cellParent.hasClass('is-editing') || cellParent.hasClass('is-editing-inline')) {
      return false; // eslint-disable-line
    }

    // Commit Previous Edit
    if (this.editor && this.editor.input) {
      this.commitCellEdit(this.editor.input);
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

    const idx = this.dataRowIndex(this.dataRowNode(row));
    const rowData = this.settings.treeGrid ?
      this.settings.treeDepth[idx].node :
      this.settings.dataset[idx];
    const cellWidth = cellParent.outerWidth();
    const isEditor = $('.is-editor', cellParent).length > 0;
    let cellValue = (cellNode.text() ?
      cellNode.text() : this.fieldValue(rowData, col.field));

    if (isEditor) {
      cellValue = this.fieldValue(rowData, col.field);
    }

    if (!this.isCellEditable(idx, cell)) {
      return false; // eslint-disable-line
    }

    // In Show Ediitor mode the editor is on form already
    if (!col.inlineEditor) {
      if (isEditor) {
        cellNode.css({ position: 'static', height: cellNode.outerHeight() });
      }
      // initialis Editor
      cellParent
        .addClass('is-editing')
        .css({ 'max-width': cellWidth, 'min-width': cellWidth, width: cellWidth });

      cellNode.empty();
    } else {
      cellParent.addClass('is-editing-inline');
    }

    this.editor =  new col.editor(idx, cell, cellValue, cellNode, col, event, this, rowData); // eslint-disable-line

    if (this.settings.onEditCell) {
      this.settings.onEditCell(this.editor);
    }

    if (this.editor.useValue) {
      cellValue = this.fieldValue(rowData, col.field);
    }
    this.editor.val(cellValue);
    this.editor.focus();
    this.element.triggerHandler('entereditmode', [{ row: idx, cell, item: rowData, target: cellNode, value: cellValue, column: col, editor: this.editor }]);

    return true;  //eslint-disable-line
  },

  commitCellEdit(input) {
    let newValue;
    let cellNode;
    const isEditor = input.is('.editor');
    const isUseActiveRow = !(input.is('.timepicker, .datepicker, .lookup, .spinbox .colorpicker'));

    if (!this.editor) {
      return;
    }

    // Editor.getValue
    newValue = this.editor.val();

    if (isEditor) {
      cellNode = this.editor.td;
    } else {
      cellNode = input.closest('td');
      newValue = $.escapeHTML(newValue);
    }

    // Format Cell again
    const isInline = cellNode.hasClass('is-editing-inline');
    cellNode.removeClass('is-editing is-editing-inline');

    // Editor.destroy
    this.editor.destroy();
    this.editor = null;

    let rowIndex;
    if (this.settings.source !== null && isUseActiveRow) {
      rowIndex = this.activeCell.row;
    } else {
      rowIndex = this.dataRowIndex(cellNode.parent());
    }

    const cell = cellNode.index();
    const col = this.columnSettings(cell);
    const rowData = this.settings.treeGrid ? this.settings.treeDepth[rowIndex].node :
      this.settings.dataset[rowIndex];
    const oldValue = this.fieldValue(rowData, col.field);

    // Save the Cell Edit back to the data set
    this.updateCellNode(rowIndex, cell, newValue, false, isInline);
    const value = this.fieldValue(rowData, col.field);
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

  // Validate a particular cell if it has validation on the column and its visible
  validateCell(row, cell) {
    const self = this;
    const column = this.columnSettings(cell);
    const validate = column.validate;
    let validationType;

    if (!validate) {
      return;
    }

    const rules = column.validate.split(' ');
    const validator = $.fn.validation;
    const cellValue = this.fieldValue(this.settings.dataset[row], column.field);
    const messages = [];
    let messageText = '';
    let i;

    for (i = 0; i < rules.length; i++) {
      const rule = validator.rules[rules[i]];
      const gridInfo = { row, cell, item: this.settings.dataset[row], column, grid: self };
      const ruleValid = rule.check(cellValue, $('<input>').val(cellValue), gridInfo);

      validationType = $.fn.validation.ValidationTypes[rule.type] ||
        $.fn.validation.ValidationTypes.error;
      messageText = '';

      if (messages[validationType.type]) {
        messageText = messages[validationType.type];
      }

      if (!ruleValid) {
        if (messageText) {
          messageText = ((/^\u2022/.test(messageText)) ? '' : '\u2022 ') + messageText;
          messageText += `<br/>${'\u2022 '}${rule.message}`;
        } else {
          messageText = rule.message;
        }

        messages[validationType.type] = messageText;
      }
    }

    const validationTypes = $.fn.validation.ValidationTypes;
    for (const props in validationTypes) {  // eslint-disable-line
      messageText = '';
      validationType = validationTypes[props];
      if (messages[validationType.type]) {
        messageText = messages[validationType.type];
      }
      if (messageText !== '') {
        self.showCellError(row, cell, messageText, validationType.type);
        self.element.trigger(`cell${validationType.type}`, { row, cell, message: messageText, target: this.cellNode(row, cell), value: cellValue, column });
      } else {
        self.clearCellError(row, cell, validationType.type);
      }
    }
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
    const node = this.cellNode(row, cell);

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
    const icon = $($.createIcon({ classes: [`icon-${type}`], icon: type }));

    // Add and show tooltip
    if (node.find(`.icon-${type}`).length === 0) {
      node.find('.datagrid-cell-wrapper').append(icon);
      icon.tooltip({ placement: 'bottom', isErrorColor: (type === 'error' || type === 'dirtyerror'), content: message });
      icon.data('tooltip').show();
    }
  },

  /**
   * Show all non visible cell cerrors
   * @private
   * @returns {void}
   */
  showNonVisibleCellErrors() {
    // Create empty toolbar
    if (!this.toolbar) {
      this.settings.toolbar = { title: ' ' };
      this.appendToolbar();
    }

    // process via type
    for (const props in $.fn.validation.ValidationTypes) {  // eslint-disable-line
      const validationType = $.fn.validation.ValidationTypes[props].type;
      const errors = $.grep(this.nonVisibleCellErrors, error => error.type === validationType);
      this.showNonVisibleCellErrorType(errors, validationType);
    }
  },

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
        const tooltip = icon.data('tooltip');
        if (tooltip) {
          tooltip.hide();
        }
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
      icon = $($.createIcon({ classes: [`icon-${type}`], icon: type }));
      tableerrors.append(icon);
    }

    if (this.element.hasClass('has-toolbar')) {
      // Add Error to the Toolbar
      this.toolbar.children('.title').append(tableerrors);
    }

    icon.tooltip({ placement: 'bottom', isErrorColor: (type === 'error' || type === 'dirtyerror'), content: messages });
  },

  clearCellError(row, cell, type) {
    this.clearNonVisibleCellErrors(row, cell, type);
    const node = this.cellNode(row, cell);

    if (!node.length) {
      return;
    }

    this.clearNodeErrors(node, type);
  },

  clearNonVisibleCellErrors(row, cell, type) {
    if (!this.nonVisibleCellErrors.length) {
      return;
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

  clearRowError(row) {
    const rowNode = this.dataRowNode(row);

    rowNode.removeClass('error alert');
    this.rowStatus(row, '', '');
  },

  clearAllErrors() {
    const self = this;

    this.tableBody.find('td.error').each(function () {
      const node = $(this);
      self.clearNodeErrors(node, 'error');
      self.clearNodeErrors(node, 'dirtyerror');
    });

    this.tableBody.find('td.alert').each(function () {
      const node = $(this);
      self.clearNodeErrors(node, 'alert');
    });

    this.tableBody.find('td.info').each(function () {
      const node = $(this);
      self.clearNodeErrors(node, 'info');
    });
  },

  clearNodeErrors(node, type) {
    node.removeClass(type).removeAttr(`data-${type}message`);

    const icon = node.find(`.icon-${type}`);
    const tooltip = icon.data('tooltip');

    if (tooltip) {
      tooltip.hide();
    }
    node.find(`.icon-${type}`).remove();
  },

  /**
  * Reset the status on all rows.
  * @returns {void}
  */
  resetRowStatus() {
    for (let i = 0; i < this.settings.dataset.length; i++) {
      this.rowStatus(i, '');
    }
  },

  /**
  * Get the currently dirty rows.
  * @returns {array} An array of dirty rows.
  */
  dirtyRows() {
    const rows = [];
    const data = this.settings.dataset;

    for (let i = 0; i < data.length; i++) {
      if (data[i].rowStatus && data[i].rowStatus.icon === 'dirty') {
        rows.push(data[i]);
      }
    }
    return rows;
  },

  /**
  * Show an error on a row.
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
    for (let i = 0; i < this.settings.columns.length; i++) {
      this.validateCell(row, i);
    }
  },

  /**
  * Validate all rows and cells in the entire gridif they have validation on the column
  * @param  {number} row The row index.
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
  * @param  {number} idx The column index.
  * @param  {boolean} onlyVisible If only the visible columns should be included.
  * @returns {array} The settings array
  */
  columnSettings(idx, onlyVisible) {
    let foundColumn = this.settings.columns[idx];

    if (onlyVisible) {
      foundColumn = this.visibleColumns()[idx];
    }

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
      newVal = col.serialize(value, oldVal, col, row, cell, this.settings.dataset[row]);
      return newVal;
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
  * @param {boolean} fromApiCall Us from an api call.
  * @param {boolean} isInline If the editor is an inline value.
  * @returns {void}
  */
  updateCellNode(row, cell, value, fromApiCall, isInline) {
    let coercedVal;
    const rowNode = this.visualRowNode(row);
    const cellNode = rowNode.find('td').eq(cell);
    const col = this.settings.columns[cell] || {};
    let formatted = '';
    const formatter = (col.formatter ? col.formatter : this.defaultFormatter);
    const isEditor = $('.editor', cellNode).length > 0;
    const isTreeGrid = this.settings.treeGrid;
    const rowData = isTreeGrid ?
      this.settings.treeDepth[row].node :
      this.settings.dataset[row];

    const oldVal = (col.field ? rowData[col.field] : '');

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

    // Setup/Sync tooltip
    if (cellNode.data('tooltip')) {
      cellNode.data('tooltip').destroy();
    }

    // Update the value in the dataset
    if (col.id === 'rowStatus' && rowData.rowStatus && rowData.rowStatus.tooltip) {
      cellNode.attr('title', rowData.rowStatus.tooltip);
      cellNode.tooltip({
        placement: 'right',
        isErrorColor: rowData.rowStatus.icon === 'error' || rowData.rowStatus.icon === 'dirtyerror'
      });
    }

    coercedVal = $.unescapeHTML(coercedVal);

    if (col.field && coercedVal !== oldVal) {
      if (col.field.indexOf('.') > -1) {
        const parts = col.field.split('.');
        if (parts.length === 2) {
          rowData[parts[0]][parts[1]] = coercedVal;
        }

        if (parts.length === 3) {
          rowData[parts[0]][parts[1]][parts[2]] = coercedVal;
        }
      } else {
        rowData[col.field] = coercedVal;
      }
    }

    // update cell value
    const escapedVal = $.escapeHTML(coercedVal);
    const rowIdx = (isTreeGrid ? row + 1 : row);
    const val = (isEditor ? coercedVal : escapedVal);
    formatted = this.formatValue(formatter, rowIdx, cell, val, col, rowData);

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
      this.validateCell(row, cell);
    }

    if (coercedVal !== oldVal && !fromApiCall) {
      const args = {
        row,
        cell,
        target: cellNode,
        value: coercedVal,
        oldValue: oldVal,
        column: col
      };
      args.rowData = isTreeGrid && this.settings.treeDepth[row] ?
        this.settings.treeDepth[row].node : rowData;

      this.element.trigger('cellchange', args);
      this.wasJustUpdated = true;

      if (this.settings.showDirty) {
        this.rowStatus(row, 'dirty');
      }
    }
  },

  // For the row node get the index - adjust for paging / invisible rowsCache
  visualRowIndex(row) {
    return this.tableBody.find('tr:visible').index(row);
  },

  visualRowNode(idx) {
    let rowIdx = idx;

    if (this.settings.paging && this.settings.source) {
      rowIdx += ((this.pager.activePage - 1) * this.settings.pagesize);
    }

    return this.tableBody.find(`tr[aria-rowindex="${rowIdx + 1}"]`);
  },

  dataRowNode(idx) {
    return this.tableBody.find(`tr[aria-rowindex="${idx + 1}"]`);
  },

  dataRowIndex(row) {
    return row.attr('aria-rowindex') - 1;
  },

  actualArrayIndex(rowElem) {
    return parseInt(rowElem.attr('data-index'), 10);
  },

  // Update a specific Cell
  setActiveCell(row, cell) {
    const self = this;
    const prevCell = self.activeCell;
    let rowElem = row;
    let rowNum;
    let dataRowNum;
    let isGroupRow = row instanceof jQuery && row.is('.datagrid-rowgroup-header, .datagrid-rowgroup-footer');

    if (row instanceof jQuery && row.length === 0) {
      return;
    }

    if (typeof row === 'number') {
      rowNum = row;
      rowElem = this.tableBody.find('tr:visible').eq(row);
      dataRowNum = this.dataRowIndex(rowElem);
    }

    // Support passing the td in
    if (row instanceof jQuery && row.is('td')) {
      isGroupRow = row.parent().is('.datagrid-rowgroup-header, .datagrid-rowgroup-footer');
      if (isGroupRow) {
        rowElem = row.parent();
      }
      cell = row.index();
      rowNum = this.visualRowIndex(row.parent());
      dataRowNum = this.dataRowIndex(row.parent());
      rowElem = row.parent();
    }

    if (row instanceof jQuery && row.is('tr')) {
      rowNum = this.visualRowIndex(row);
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
      $('#tooltip').hide();
    }

    // Find the cell if it exists
    self.activeCell.node = self.cellNode((isGroupRow ? rowElem : (dataRowNum > -1 ? dataRowNum : rowNum)), (cell)).attr('tabindex', '0');

    if (self.activeCell.node && prevCell.node.length === 1) {
      self.activeCell.row = rowNum;
      self.activeCell.cell = cell;
      dataRowNum = this.dataRowIndex(self.activeCell.node.parent());
    } else {
      self.activeCell = prevCell;
    }

    if (!$('input, button:not(.btn-secondary, .row-btn, .datagrid-expand-btn, .datagrid-drilldown, .btn-icon)', self.activeCell.node).length) {
      self.activeCell.node.focus();
      if (isGroupRow) {
        self.activeCell.groupNode = self.activeCell.node;
      }
    }
    if (self.activeCell.node.hasClass('is-focusable')) {
      self.activeCell.node.find('button').focus();
    }

    if (dataRowNum !== undefined) {
      self.activeCell.dataRow = dataRowNum;
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

    self.element.trigger('activecellchange', [{ node: this.activeCell.node, row: this.activeCell.row, cell: this.activeCell.cell }]);
  },

  setNextActiveCell(e) {
    const self = this;
    if (e.type === 'keydown') {
      if (this.settings.actionableMode) {
        setTimeout(() => {
          const evt = $.Event('keydown.datagrid');
          evt.keyCode = 40; // move down
          self.activeCell.node.trigger(evt);
        }, 0);
      } else {
        this.setActiveCell(this.activeCell.row, this.activeCell.cell);
      }
    }
  },

  // Add children to treegrid dataset
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

  // Set expanded property in Dataset
  setExpandedInDataset(dataRowIndex, isExpanded) {
    this.settings.treeDepth[dataRowIndex].node.expanded = isExpanded;
  },

  // expand the tree rows
  toggleChildren(e, dataRowIndex) {
    const self = this;
    let rowElement = this.visualRowNode(dataRowIndex);
    let expandButton = rowElement.find('.datagrid-expand-btn');
    const level = parseInt(rowElement.attr('aria-level'), 10);
    let children = rowElement.nextUntil(`[aria-level="${level}"]`);
    const isExpanded = expandButton.hasClass('is-expanded');
    const args = [{ grid: self, row: dataRowIndex, item: rowElement, children }];

    if (self.settings.treeDepth[dataRowIndex]) {
      args[0].rowData = self.settings.treeDepth[dataRowIndex].node;
    }

    if (!rowElement.hasClass('datagrid-tree-parent') ||
        (!$(e.target).is(expandButton) &&
          (self.settings.editable || self.settings.selectable))) {
      return;
    }

    const toggleExpanded = function () {
      rowElement = self.visualRowNode(dataRowIndex);
      expandButton = rowElement.find('.datagrid-expand-btn');
      children = rowElement.nextUntil(`[aria-level="${level}"]`);

      if (isExpanded) {
        rowElement.attr('aria-expanded', false);
        expandButton.removeClass('is-expanded')
          .find('.plus-minus').removeClass('active');
      } else {
        rowElement.attr('aria-expanded', true);
        expandButton.addClass('is-expanded')
          .find('.plus-minus').addClass('active');
      }
      self.setExpandedInDataset(dataRowIndex, !isExpanded);

      const setChildren = function (elem, lev, expanded) {
        const nodes = elem.nextUntil(`[aria-level="${level}"]`);

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

            if (nodeLevel === (lev + 1)) {
              node.removeClass('is-hidden');

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
    };

    $.when(self.element.triggerHandler(isExpanded ? 'collapserow' : 'expandrow', args)).done(() => {
      toggleExpanded();
    });
  },

  /**
   * Expand Detail Row Or Tree Row
   * @param  {number} dataRowIndex The row to toggle
   * @returns {void}
   */
  toggleRowDetail(dataRowIndex) {
    const self = this;
    const rowElement = self.visualRowNode(dataRowIndex);
    const expandRow = rowElement.next();
    const expandButton = rowElement.find('.datagrid-expand-btn');
    const detail = expandRow.find('.datagrid-row-detail');
    const item = self.settings.dataset[self.actualArrayIndex(rowElement)];

    if (rowElement.hasClass('datagrid-tree-parent')) {
      return;
    }

    if (self.settings.allowOneExpandedRow && self.settings.groupable === null) {
      // collapse any other expandable rows
      const prevExpandRow = self.tableBody.find('tr.is-expanded');
      const parentRow = prevExpandRow.prev();
      const parentRowIdx = parentRow.attr('aria-rowindex');

      if (prevExpandRow.length && expandRow.index() !== prevExpandRow.index()) {
        const prevDetail = prevExpandRow.find('.datagrid-row-detail');

        prevExpandRow.removeClass('is-expanded');
        parentRow.removeClass('is-rowactivated');
        parentRow.find('.plus-minus').removeClass('active');
        prevDetail.animateClosed().on('animateclosedcomplete', () => {
          prevExpandRow.css('display', 'none').removeClass('is-expanded');
          self.element.triggerHandler('collapserow', [{ grid: self, row: parentRowIdx, detail: prevDetail, item: self.settings.dataset[parentRowIdx] }]);
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
      expandRow.removeClass('is-expanded');
      expandButton.removeClass('is-expanded')
        .find('.plus-minus').removeClass('active');

      if (self.settings.allowOneExpandedRow) {
        rowElement.removeClass('is-rowactivated');
      }

      detail.animateClosed().on('animateclosedcomplete', () => {
      //  expandRow.css('display', 'none');
        self.element.triggerHandler('collapserow', [{ grid: self, row: dataRowIndex, detail, item }]);
      });
    } else {
      expandRow.addClass('is-expanded');
      expandButton.addClass('is-expanded')
        .find('.plus-minus').addClass('active');

      expandRow.css('display', 'table-row');

      // Optionally Contstrain the width
      expandRow.find('.constrained-width').css('max-width', this.element.outerWidth());

      if (self.settings.allowOneExpandedRow) {
        rowElement.addClass('is-rowactivated');
      }

      const eventData = [{ grid: self, row: dataRowIndex, detail, item }];

      if (self.settings.onExpandRow) {
        const response = function (markup) {
          if (markup) {
            detail.find('.datagrid-row-detail-padding').empty().append(markup);
          }
          detail.animateOpen();
        };

        self.settings.onExpandRow(eventData[0], response);
      } else {
        detail.animateOpen();
      }

      self.element.triggerHandler('expandrow', eventData);
    }
  },

  toggleGroupChildren(rowElement) {
    if (!this.settings.groupable) {
      return;
    }

    const self = this;
    const children = rowElement.nextUntil('.datagrid-rowgroup-header');
    const expandButton = rowElement.find('.datagrid-expand-btn');

    if (rowElement.hasClass('is-expanded')) {
      expandButton.removeClass('is-expanded')
        .find('.plus-minus').removeClass('active');

      children.hide();
      children.addClass('is-hidden');
      self.element.triggerHandler('collapserow', [{ grid: self, row: rowElement.index(), detail: children, item: {} }]);

      rowElement.removeClass('is-expanded');
    } else {
      expandButton.addClass('is-expanded')
        .find('.plus-minus').addClass('active');

      children.show();
      children.removeClass('is-hidden');
      self.element.triggerHandler('expandrow', [{ grid: self, row: rowElement.index(), detail: children, item: {} }]);

      rowElement.addClass('is-expanded');
    }
  },

  // Api Event to set the sort Column
  setSortColumn(id, ascending) {
    // Set Direction based on if passed in or toggling existing field
    if (ascending !== undefined) {
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
    this.sortDataset();

    const wasFocused = this.activeCell.isFocused;
    this.setTreeDepth();
    this.setRowGrouping();
    this.setTreeRootNodes();
    this.renderRows();
    // Update selected and Sync header checkbox
    this.syncSelectedUI();

    if (wasFocused && this.activeCell.node.length === 1) {
      this.setActiveCell(this.activeCell.row, this.activeCell.cell);
    }

    this.resetPager('sorted');
    this.tableBody.removeClass('is-loading');
    this.saveUserSettings();
    this.element.trigger('sorted', [this.sortColumn]);
  },

  sortDataset() {
    if (this.originalDataset) {
      this.settings.dataset = this.originalDataset;
    }
    const sort = this.sortFunction(this.sortColumn.sortId, this.sortColumn.sortAsc);

    if (!this.settings.disableClientSort) {
      this.settings.dataset.sort(sort);
    }
  },

  setSortIndicator(id, ascending) {
    if (!this.headerRow) {
      return;
    }

    // Set Visual Indicator
    this.headerRow.find('.is-sorted-asc, .is-sorted-desc').removeClass('is-sorted-asc is-sorted-desc').attr('aria-sort', 'none');
    this.headerRow.find(`[data-column-id="${id}"]`)
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
    const field = column.length === 0 ? id : column[0].field;

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

    const key = function (x) { return primer(self.fieldValue(x, field)); };

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
  * Determine equality for two deeply nested JavaScript objects.
  * @private
  * @param {object} obj1 First object to compare
  * @param {object} obj2 Second object to compare
  * @returns {boolean} If it is equal or not
  */
  isEquivalent(obj1, obj2) {
    function _equals(a, b) {
      return JSON.stringify(a) === JSON.stringify($.extend(true, {}, a, b));
    }
    return _equals(obj1, obj2) && _equals(obj2, obj1);
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
    const self = this;

    if (!this.settings.paging) {
      return;
    }

    const pagerElem = this.tableBody;
    this.element.addClass('paginated');
    pagerElem.pager({
      componentAPI: this,
      dataset: this.settings.dataset,
      hideOnOnePage: this.settings.hidePagerOnOnePage,
      source: this.settings.source,
      pagesize: this.settings.pagesize,
      indeterminate: this.settings.indeterminate,
      rowTemplate: this.settings.rowTemplate,
      pagesizes: this.settings.pagesizes,
      showPageSizeSelector: this.settings.showPageSizeSelector,
      activePage: this.restoreActivePage ? parseInt(this.savedActivePage, 10) : 1
    });

    if (this.restoreActivePage) {
      this.savedActivePage = null;
      this.restoreActivePage = false;
    }

    this.pager = pagerElem.data('pager');

    pagerElem.off('afterpaging')
      .on('afterpaging', (e, args) => {
      // Hide the entire pager bar if we're only showing one page, if applicable
        if (self.pager.hidePagerBar(args)) {
          self.element.removeClass('paginated');
        } else {
          self.element.addClass('paginated');
        }

        self.recordCount = args.total;
        self.displayCounts(args.total);

        // Handle row selection across pages
        self.syncSelectedUI();

        if (self.filterExpr && self.filterExpr[0] && self.filterExpr[0].column === 'all') {
          self.highlightSearchRows(self.filterExpr[0].value);
        }
      });
  },

  /**
  * Add the pager and paging functionality.
  * @param {string} pagingInfo The paging object with activePage ect used by pager.js
  * @param {boolean} isResponse Internal flag used to prevent callbacks from rexecuting.
  * @param {function} callback The callback function.
  */
  renderPager(pagingInfo, isResponse, callback) {
    const api = this.pager;

    if (!api) {
      return;
    }

    api.updatePagingInfo(pagingInfo);

    if (!isResponse) {
      api.renderPages(pagingInfo.type, callback);
    }

    // Update selected and Sync header checkbox
    this.syncSelectedUI();
  },

  /**
  * Reset the pager to the first page.
  * @param {string} type The action type, which gets sent to the source callback.
  */
  resetPager(type) {
    if (!this.pager) {
      return;
    }

    if (!this.pager.pagingInfo) {
      this.pager.pagingInfo = {};
    }

    this.pager.pagingInfo.type = type;
    this.pager.pagingInfo.activePage = 1;
    this.renderPager(this.pager.pagingInfo);
  },

  /**
  * Unwrap the grid back to a simple div, and destory all events and pointers.
  */
  destroy() {
    // Remove the toolbar, clean the div out and remove the pager
    this.element.off().empty().removeClass('datagrid-container');
    const toolbar = this.element.prev('.toolbar');

    this.triggerDestroyCell();

    if (this.removeToolbarOnDestroy && this.settings.toolbar &&
      this.settings.toolbar.keywordFilter) {
      const searchfield = toolbar.find('.searchfield');
      if (searchfield.data('searchfield')) {
        searchfield.data('searchfield').destroy();
      }
      if (searchfield.data('toolbarsearchfield')) {
        searchfield.data('toolbarsearchfield').destroy();
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

    // TODO Test Memory Leaks in Chrome - null out fx this.table
    $(document).off('touchstart.datagrid touchend.datagrid touchcancel.datagrid click.datagrid touchmove.datagrid');
    this.contentContainer.off().remove();
    $('body').off('resize.vtable resize.datagrid');
  }

};

export { Datagrid, COMPONENT_NAME };
