import { Datagrid } from '../../../src/components/datagrid/datagrid';
import { Formatters } from '../../../src/components/datagrid/datagrid.formatters';

const datagridHTML = require('../../../app/views/components/datagrid/example-index.html');
const svg = require('../../../src/components/icons/svg.html');
const originalData = require('../../../app/data/datagrid-sample-data');

let data = [];
require('../../../src/components/locale/cultures/en-US.js');

let datagridEl;
let svgEl;
let datagridObj;
let defaultSettings;

// Define Columns for the Grid.
const columns = [];
columns.push({ id: 'productId', name: 'Id', field: 'productId', reorderable: true, formatter: Formatters.Text, width: 100, filterType: 'Text' });
columns.push({ id: 'productName', name: 'Product Name', field: 'productName', reorderable: true, formatter: Formatters.Hyperlink, width: 300, filterType: 'Text' });
columns.push({ id: 'activity', name: 'Activity', field: 'activity', reorderable: true, filterType: 'Text' });
columns.push({ id: 'hidden', hidden: true, name: 'Hidden', field: 'hidden', filterType: 'Text' });
columns.push({ id: 'price', align: 'right', name: 'Actual Price', field: 'price', reorderable: true, formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'currency', currencySign: '$' } });
columns.push({ id: 'percent', align: 'right', name: 'Actual %', field: 'percent', reorderable: true, formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'percent' } });
columns.push({ id: 'orderDate', name: 'Order Date', field: 'orderDate', reorderable: true, formatter: Formatters.Date, dateFormat: 'M/d/yyyy' });
columns.push({ id: 'phone', name: 'Phone', field: 'phone', reorderable: true, filterType: 'Text', formatter: Formatters.Text });

describe('Datagrid Settings', () => {
  const Locale = window.Soho.Locale;

  beforeEach(() => {
    datagridEl = null;
    svgEl = null;
    datagridObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', datagridHTML);
    datagridEl = document.body.querySelector('#datagrid');
    svgEl = document.body.querySelector('.svg-icons');

    Locale.set('en-US');
    data = JSON.parse(JSON.stringify(originalData));

    defaultSettings = {
      actionableMode: false,
      cellNavigation: true,
      rowNavigation: true,
      alternateRowShading: false,
      columns,
      dataset: data,
      columnReorder: false,
      saveColumns: false,
      saveUserSettings: {},
      focusAfterSort: false,
      editable: false,
      isList: false,
      menuId: null,
      headerMenuId: null,
      menuSelected: null,
      menuBeforeOpen: null,
      headerMenuSelected: null,
      headerMenuBeforeOpen: null,
      uniqueId: null,
      rowHeight: 'normal',
      selectable: false,
      selectChildren: true,
      allowSelectAcrossPages: null,
      groupable: null,
      spacerColumn: false,
      stretchColumn: 'last',
      twoLineHeader: false,
      clickToSelect: true,
      toolbar: false,
      initializeToolbar: true,
      paging: false,
      pagesize: 25,
      pagesizes: [10, 25, 50, 75],
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
      showDirty: false,
      showSelectAllCheckBox: true,
      allowOneExpandedRow: true,
      enableTooltips: false,
      disableRowDeactivation: false,
      sizeColumnsEqually: false,
      expandableRow: false,
      redrawOnResize: false,
      exportConvertNegative: false,
      columnGroups: null,
      treeGrid: false,
      onPostRenderCell: null,
      onDestroyCell: null,
      onEditCell: null,
      onExpandRow: null,
      emptyMessage: { title: (Locale ? Locale.translate('NoData') : 'No Data Available'), info: '', icon: 'icon-empty-no-data' },
      searchExpandableRow: true,
      allowChildExpandOnMatch: false
    };
    datagridObj = new Datagrid(datagridEl, { dataset: data, columns });
  });

  afterEach(() => {
    datagridObj.destroy();
    datagridEl.parentNode.removeChild(datagridEl);
    svgEl.parentNode.removeChild(svgEl);

    const rowEl = document.body.querySelector('.row');
    rowEl.parentNode.removeChild(rowEl);
  });

  it('Should set settings', () => {
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, { dataset: data, columns });
    datagridObj.settings.emptyMessage.title = 'No Data Available';

    expect(datagridObj.settings).toEqual(defaultSettings);
  });

  it('Should update set settings via data', () => {
    datagridObj.updated();
    datagridObj.settings.emptyMessage.title = 'No Data Available';

    expect(datagridObj.settings).toEqual(defaultSettings);
  });

  it('Should update set settings via parameter', () => {
    datagridObj.updated(defaultSettings);
    datagridObj.settings.emptyMessage.title = 'No Data Available';

    expect(datagridObj.settings).toEqual(defaultSettings);
  });
});
