import { Datagrid } from '../../../src/components/datagrid/datagrid';
import { Formatters } from '../../../src/components/datagrid/datagrid.formatters';
import { Editors } from '../../../src/components/datagrid/datagrid.editors';
import { cleanup } from '../../helpers/func-utils';

const datagridHTML = require('../../../app/views/components/datagrid/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');
const originalData = require('../../../app/data/datagrid-sample-data');
const originalGroupingData = require('../../../app/data/accounts');

let data = [];
let groupingData = [];
require('../../../src/components/locale/cultures/en-US.js');

let datagridEl;
let datagridObj;

// Define Columns for the Grid.
const columns = [];
columns.push({ id: 'selectionCheckbox', sortable: false, resizable: false, formatter: Formatters.SelectionCheckbox, align: 'center' });
columns.push({ id: 'productId', name: 'Id', field: 'productId', reorderable: true, formatter: Formatters.Text, width: 100, filterType: 'Text' });
columns.push({
  id: 'productName', name: 'Product Name', field: 'productName', reorderable: true, formatter: Formatters.Hyperlink, width: 300, filterType: 'Text', editor: Editors.Input
});
columns.push({ id: 'activity', name: 'Activity', field: 'activity', reorderable: true, filterType: 'Text' });
columns.push({ id: 'hidden', hidden: true, name: 'Hidden', field: 'hidden', filterType: 'Text' });
columns.push({ id: 'price', align: 'right', name: 'Actual Price', field: 'price', reorderable: true, formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'currency', currencySign: '$' } });
columns.push({ id: 'percent', align: 'right', name: 'Actual %', field: 'percent', reorderable: true, formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'percent' } });
columns.push({ id: 'orderDate', name: 'Order Date', field: 'orderDate', reorderable: true, formatter: Formatters.Date, dateFormat: 'M/d/yyyy' });
columns.push({ id: 'phone', name: 'Phone', field: 'phone', reorderable: true, filterType: 'Text', formatter: Formatters.Text });
columns.push({ id: 'inStock', name: 'In Stock', field: 'inStock', reorderable: false, filterType: 'Checkbox', formatter: Formatters.Checkbox });

// Define Grouping Columns for the Grid.
const groupingColumns = [];
groupingColumns.push({ id: 'id', name: 'Customer Id', field: 'id', filterType: 'text' });
groupingColumns.push({ id: 'type', name: 'Type', field: 'type', filterType: 'text' });
groupingColumns.push({ id: 'location', name: 'Location', field: 'location', formatter: Formatters.Hyperlink, filterType: 'text' });
groupingColumns.push({ id: 'firstname', name: 'First Name', field: 'firstname', filterType: 'text' });
groupingColumns.push({ id: 'lastname', name: 'Last Name', field: 'lastname', filterType: 'text' });
groupingColumns.push({ id: 'phone', name: 'Phone', field: 'phone', filterType: 'text' });
groupingColumns.push({ id: 'purchases', name: 'Purchases', field: 'purchases', filterType: 'text' });

describe('Datagrid Filter API', () => {
  const Locale = window.Soho.Locale;

  beforeEach(() => {
    datagridEl = null;
    datagridObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', datagridHTML);
    datagridEl = document.body.querySelector('#datagrid');

    Locale.set('en-US');
    data = JSON.parse(JSON.stringify(originalData));

    datagridObj = new Datagrid(datagridEl, { dataset: data, columns, filterable: true });
  });

  afterEach(() => {
    datagridObj.destroy();
    cleanup();
  });

  it('Should be able to applyFilter with the API', () => {
    let filter = [];
    filter = [{ columnId: 'productId', operator: 'equals', value: '2642206' }];
    datagridObj.applyFilter(filter);

    expect(document.body.querySelectorAll('tbody tr').length).toEqual(1);

    // Empty
    filter = [{ columnId: 'phone', operator: 'is-empty', value: '' }];
    datagridObj.applyFilter(filter);

    expect(document.body.querySelectorAll('tbody tr').length).toEqual(4);

    // Multiple Conditions
    filter = [{ columnId: 'productName', operator: 'is-not-empty', value: '' },
      { columnId: 'phone', operator: 'equals', value: '(888) 888-8888' }];
    datagridObj.applyFilter(filter);

    expect(document.body.querySelectorAll('tbody tr').length).toEqual(3);

    // Integer Type
    filter = [{ columnId: 'price', operator: 'greater-than', value: 121 }];
    datagridObj.applyFilter(filter);

    expect(document.body.querySelectorAll('tbody tr').length).toEqual(5);

    // Date Type
    filter = [{ columnId: 'orderDate', operator: 'greater-than', value: '07/09/2014', format: 'MM/dd/yyyy' }];
    datagridObj.applyFilter(filter);

    expect(document.body.querySelectorAll('tbody tr').length).toEqual(7);

    // Checkbox Type
    filter = [{ columnId: 'inStock', operator: 'selected' }];
    datagridObj.applyFilter(filter);

    expect(document.body.querySelectorAll('tbody tr').length).toEqual(3);

    // Decimal Type
    filter = [{ columnId: 'price', operator: 'equals', value: 210.99 }];
    datagridObj.applyFilter(filter);

    expect(document.body.querySelectorAll('tbody tr').length).toEqual(4);
  });

  it('Should call filtered event on applyFilter', (done) => {
    const spyEvent = spyOnEvent($('#datagrid'), 'filtered');
    let filter = [];
    filter = [{ columnId: 'productId', operator: 'equals', value: '2642206' }];

    $(datagridEl).on('filtered', (e, args) => {
      expect(args.op).toEqual('apply');
      expect(args.conditions[0].value).toEqual('2642206');
      expect(args.conditions[0].columnId).toEqual('productId');
      expect(args.conditions[0].operator).toEqual('equals');
      done();
    });

    datagridObj.applyFilter(filter);

    expect(spyEvent).toHaveBeenTriggered();
  });

  it('Should be able to clearFilter with the API', () => {
    let filter = [];
    filter = [{ columnId: 'productId', operator: 'equals', value: '2642206' }];
    datagridObj.applyFilter(filter);

    expect(document.body.querySelectorAll('tbody tr').length).toEqual(1);

    datagridObj.clearFilter();

    expect(document.body.querySelectorAll('tbody tr').length).toEqual(7);
  });

  it('Should be able to set filter UI only', () => {
    let filter = [];
    filter = [{ columnId: 'productId', operator: 'equals', value: '2642206' }];
    datagridObj.setFilterConditions(filter);

    expect(document.body.querySelectorAll('tbody tr').length).toEqual(7);
    expect(document.body.querySelector('thead tr input').value).toEqual('2642206');
  });

  it('Should be able to get current filter', () => {
    let usedFilter = datagridObj.filterConditions();

    expect(usedFilter).toEqual([]);

    const filter = [{ columnId: 'productId', operator: 'equals', value: '2642206', filterType: 'Text' }];
    datagridObj.setFilterConditions(filter);
    usedFilter = datagridObj.filterConditions();

    expect(usedFilter).toEqual(filter);
  });

  it('Should be able to track dirty cells with filter', () => {
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, { dataset: data, columns, editable: true, showDirty: true, filterable: true }); // eslint-disable-line max-len

    let input;
    let cell1 = document.querySelector('tr:nth-child(4) td:nth-child(3)');
    let cell2 = document.querySelector('tr:nth-child(4) td:nth-child(4)');

    expect(document.body.querySelectorAll('tbody tr').length).toEqual(7);
    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(0);
    expect(cell1.classList.contains('is-dirty-cell')).toBeFalsy();

    cell1.click();
    input = cell1.querySelector('input');
    const originalVal = input.value;
    input.value = 'Cell test value';
    cell2.click();

    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(1);
    expect(cell1.classList.contains('is-dirty-cell')).toBeTruthy();

    let filter = [];
    filter = [{ columnId: 'productId', operator: 'equals', value: '2642206' }];
    datagridObj.applyFilter(filter);

    cell1 = document.querySelector('tr:nth-child(1) td:nth-child(3)');
    cell2 = document.querySelector('tr:nth-child(1) td:nth-child(4)');

    expect(document.body.querySelectorAll('tbody tr').length).toEqual(1);
    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(0);
    expect(cell1.classList.contains('is-dirty-cell')).toBeFalsy();

    datagridObj.clearFilter();
    cell1 = document.querySelector('tr:nth-child(4) td:nth-child(3)');
    cell2 = document.querySelector('tr:nth-child(4) td:nth-child(4)');

    expect(document.body.querySelectorAll('tbody tr').length).toEqual(7);
    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(1);
    expect(cell1.classList.contains('is-dirty-cell')).toBeTruthy();

    filter = [{ columnId: 'activity', operator: 'contains', value: 'Assemble Paint' }];
    datagridObj.applyFilter(filter);

    cell1 = document.querySelector('tr:nth-child(2) td:nth-child(3)');
    cell2 = document.querySelector('tr:nth-child(2) td:nth-child(4)');

    expect(document.body.querySelectorAll('tbody tr').length).toEqual(2);
    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(1);
    expect(cell1.classList.contains('is-dirty-cell')).toBeTruthy();

    cell1.click();
    input = cell1.querySelector('input');
    input.value = originalVal;
    cell2.click();

    expect(document.body.querySelectorAll('tbody tr').length).toEqual(2);
    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(0);
    expect(cell1.classList.contains('is-dirty-cell')).toBeFalsy();

    datagridObj.clearFilter();

    expect(document.body.querySelectorAll('tbody tr').length).toEqual(7);
    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(0);
    expect(cell1.classList.contains('is-dirty-cell')).toBeFalsy();
  });

  it('Should be able to filter and sort with grouping', () => {
    datagridObj.destroy();
    groupingData = JSON.parse(JSON.stringify(originalGroupingData));
    datagridObj = new Datagrid(datagridEl, {
      columns: groupingColumns,
      dataset: groupingData,
      filterable: true,
      groupable: { fields: ['type'], expanded: true, aggregator: 'sum' },
      toolbar: { title: 'Accounts', results: true, personalize: true, actions: true, rowHeight: true, keywordFilter: false }
    });

    expect(document.body.querySelectorAll('tbody tr[role="row"]').length).toEqual(18);
    expect(document.body.querySelectorAll('tbody tr[role="rowgroup"]').length).toEqual(7);

    let filter = [];
    filter = [{ columnId: 'location', operator: 'contains', value: 'USA' }];
    datagridObj.applyFilter(filter);

    expect(document.body.querySelectorAll('tbody tr[role="row"]').length).toEqual(9);
    expect(document.body.querySelectorAll('tbody tr[role="rowgroup"]').length).toEqual(5);

    datagridObj.setSortColumn('location', true);

    expect(document.body.querySelectorAll('tbody tr[role="row"]').length).toEqual(9);
    expect(document.body.querySelectorAll('tbody tr[role="rowgroup"]').length).toEqual(5);
  });

  it('Should be able get the dataset with no added fields', () => {
    let usedFilter = datagridObj.filterConditions();

    expect(usedFilter).toEqual([]);

    const filter = [{ columnId: 'productId', operator: 'equals', value: '2642206' }];
    datagridObj.setFilterConditions(filter);
    usedFilter = datagridObj.filterConditions();

    expect(datagridObj.getDataset()[0]._isFilteredOut).toEqual(undefined); //eslint-disable-line
  });
});
