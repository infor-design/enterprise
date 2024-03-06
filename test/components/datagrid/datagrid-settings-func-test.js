/**
 * @jest-environment jsdom
 */
/* eslint-disable object-curly-newline */
import { Datagrid } from '../../../src/components/datagrid/datagrid';
import { Formatters } from '../../../src/components/datagrid/datagrid.formatters';
import { cleanup } from '../../helpers/func-utils';
import { Locale } from '../../../src/components/locale/locale';

Soho.Locale = Locale;

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

const datagridHTML = `<div class="row">
  <div class="twelve columns">
    <div id="datagrid" class="datagrid">
    </div>
  </div>
</div>`;
const originalData = require('../../../app/data/datagrid-sample-data');

let data = [];
require('../../../src/components/locale/cultures/en-US.js');

let datagridEl;
let datagridObj;
let defaultSettings;

// Define Columns for the Grid.
const columns = [];
columns.push({ id: 'productId', name: 'Id', field: 'productId', hideable: true, reorderable: true, formatter: Formatters.Text, width: 100, filterType: 'Text' });
columns.push({ id: 'productName', name: 'Product Name', field: 'productName', hideable: true, reorderable: true, formatter: Formatters.Hyperlink, width: 300, filterType: 'Text' });
columns.push({ id: 'activity', name: 'Activity', field: 'activity', hideable: true, reorderable: true, filterType: 'Text' });
columns.push({ id: 'hidden', hidden: true, name: 'Hidden', hideable: true, field: 'hidden', filterType: 'Text' });
columns.push({ id: 'price', align: 'right', name: 'Actual Price', hideable: true, field: 'price', reorderable: true, formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'currency', currencySign: '$' } });
columns.push({ id: 'percent', align: 'right', name: 'Actual %', hideable: true, field: 'percent', reorderable: true, formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'percent' } });
columns.push({ id: 'orderDate', name: 'Order Date', field: 'orderDate', hideable: true, reorderable: true, formatter: Formatters.Date, dateFormat: 'M/d/yyyy' });
columns.push({ id: 'phone', name: 'Phone', field: 'phone', hideable: false, reorderable: true, filterType: 'Text', formatter: Formatters.Text });

describe('Datagrid Settings', () => {
  beforeEach(() => {
    datagridEl = null;
    datagridObj = null;
    document.body.insertAdjacentHTML('afterbegin', datagridHTML);
    datagridEl = document.body.querySelector('#datagrid');

    Locale.set('en-US');
    data = JSON.parse(JSON.stringify(originalData));

    defaultSettings = {
      actionableMode: false,
      cellNavigation: true,
      rowNavigation: true,
      showHoverState: true,
      alternateRowShading: false,
      columns,
      frozenColumns: {
        left: [],
        right: [],
        expandRowAcrossAllCells: true
      },
      dataset: data,
      dblClickApply: false,
      columnReorder: false,
      saveColumns: false,
      saveUserSettings: {},
      focusAfterSort: false,
      editable: false,
      selectOnEdit: true,
      isRowDisabled: null,
      isList: false,
      menuId: null,
      headerMenuId: null,
      menuSelected: null,
      menuBeforeOpen: null,
      headerMenuSelected: null,
      headerMenuBeforeOpen: null,
      uniqueId: null,
      rowHeight: 'large',
      fixedRowHeight: null,
      selectable: false,
      stickyHeader: false,
      onBeforeSelect: null,
      selectChildren: true,
      allowSelectAcrossPages: null,
      selectAllCurrentPage: false,
      groupable: null,
      showNewRowIndicator: true,
      stretchColumn: null,
      stretchColumnOnChange: false,
      spacerColumn: false,
      columnSizing: 'all',
      twoLineHeader: false,
      clickToSelect: true,
      keyRowSelect: false,
      toolbar: false,
      initializeToolbar: true,
      columnIds: [],
      paging: false,
      pagesize: 25,
      pagesizes: [],
      showPageSizeSelector: true,
      indeterminate: false,
      source: null,
      hidePagerOnOnePage: false,
      filterable: false,
      filterWhenTyping: true,
      disableClientFilter: false,
      disableClientSort: false,
      resultsText: null,
      showFilterTotal: true,
      virtualized: false,
      virtualRowBuffer: 10,
      rowReorder: false,
      resizeMode: 'flex',
      showDirty: false,
      showSelectAllCheckBox: true,
      allowOneExpandedRow: true,
      enableTooltips: false,
      disableRowDeactivation: false,
      disableRowDeselection: false,
      sizeColumnsEqually: false,
      expandableRow: false,
      exportConvertNegative: false,
      columnGroups: null,
      treeGrid: false,
      attributes: null,
      onPostRenderCell: null,
      onDestroyCell: null,
      onEditCell: null,
      onExpandRow: null,
      showIcons: false,
      onExpandChildren: null,
      onCollapseChildren: null,
      onKeyDown: null,
      emptyMessage: { title: (Locale ? Locale.translate('NoData') : 'No data available'), info: '', icon: 'icon-empty-no-data-new', height: null },
      searchExpandableRow: true,
      allowChildExpandOnMatchOnly: false,
      allowChildExpandOnMatch: false,
      activeCheckboxSelection: false,
      allowPasteFromExcel: false,
      fallbackImage: 'insert-image',
      fallbackSize: { height: 40, width: 40 },
      fallbackTooltip: {
        content: 'Image could not load',
        delay: 200
      }
    };
    datagridObj = new Datagrid(datagridEl, { dataset: data, columns });
  });

  afterEach(() => {
    datagridObj?.destroy();
    cleanup();
  });

  it('should set settings', () => {
    datagridObj?.destroy();
    datagridObj = new Datagrid(datagridEl, { dataset: data, columns });
    datagridObj.settings.emptyMessage.title = 'No data available';

    expect(datagridObj.settings).toEqual(defaultSettings);
  });

  it('should update set settings via data', () => {
    datagridObj.updated();
    datagridObj.settings.emptyMessage.title = 'No data available';

    expect(datagridObj.settings).toEqual(defaultSettings);
  });

  it('should update set settings via parameter', () => {
    datagridObj.updated(defaultSettings);
    datagridObj.settings.emptyMessage.title = 'No data available';

    expect(datagridObj.settings).toEqual(defaultSettings);
  });
});
