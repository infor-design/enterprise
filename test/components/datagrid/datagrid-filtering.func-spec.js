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

// Define Columns for the Grid.
const columns = [];
columns.push({ id: 'selectionCheckbox', sortable: false, resizable: false, formatter: Formatters.SelectionCheckbox, align: 'center' });
columns.push({ id: 'productId', name: 'Id', field: 'productId', reorderable: true, formatter: Formatters.Text, width: 100, filterType: 'Text' });
columns.push({ id: 'productName', name: 'Product Name', field: 'productName', reorderable: true, formatter: Formatters.Hyperlink, width: 300, filterType: 'Text' });
columns.push({ id: 'activity', name: 'Activity', field: 'activity', reorderable: true, filterType: 'Text' });
columns.push({ id: 'hidden', hidden: true, name: 'Hidden', field: 'hidden', filterType: 'Text' });
columns.push({ id: 'price', align: 'right', name: 'Actual Price', field: 'price', reorderable: true, formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'currency', currencySign: '$' } });
columns.push({ id: 'percent', align: 'right', name: 'Actual %', field: 'percent', reorderable: true, formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'percent' } });
columns.push({ id: 'orderDate', name: 'Order Date', field: 'orderDate', reorderable: true, formatter: Formatters.Date, dateFormat: 'M/d/yyyy' });
columns.push({ id: 'phone', name: 'Phone', field: 'phone', reorderable: true, filterType: 'Text', formatter: Formatters.Text });
columns.push({ id: 'inStock', name: 'In Stock', field: 'inStock', reorderable: false, filterType: 'Checkbox', formatter: Formatters.Checkbox });

describe('Datagrid Filter API', () => {
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

    datagridObj = new Datagrid(datagridEl, { dataset: data, columns, filterable: true });
  });

  afterEach(() => {
    datagridObj.destroy();
    datagridEl.parentNode.removeChild(datagridEl);
    svgEl.parentNode.removeChild(svgEl);

    const rowEl = document.body.querySelector('.row');
    rowEl.parentNode.removeChild(rowEl);
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

    const filter = [{ columnId: 'productId', operator: 'equals', value: '2642206' }];
    datagridObj.setFilterConditions(filter);
    usedFilter = datagridObj.filterConditions();

    expect(usedFilter).toEqual(filter);
  });
});
