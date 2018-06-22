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

describe('Datagrid Columns API', () => {
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

    datagridObj = new Datagrid(datagridEl, { dataset: data, columns });
  });

  afterEach(() => {
    datagridObj.destroy();
    datagridEl.parentNode.removeChild(datagridEl);
    svgEl.parentNode.removeChild(svgEl);

    const rowEl = document.body.querySelector('.row');
    rowEl.parentNode.removeChild(rowEl);
  });

  it('Should be able to call visibleColumns', () => {
    expect(datagridObj.visibleColumns().length).toEqual(8);
    expect(datagridObj.visibleColumns(true).length).toEqual(7);
  });

  it('Should be able to call lastIndex', () => {
    expect(datagridObj.lastColumnIdx()).toEqual(8);
  });

  it('Should be able to call updateColumns', () => {
    const newColumns = [];
    newColumns.push({ id: 'productId', name: 'Id', field: 'productId', reorderable: true, formatter: Formatters.Text, width: 100, filterType: 'Text' });
    newColumns.push({ id: 'productName', name: 'Product Name', field: 'productName', reorderable: true, formatter: Formatters.Hyperlink, width: 300, filterType: 'Text' });
    newColumns.push({ id: 'activity', name: 'Activity', field: 'activity', reorderable: true, filterType: 'Text' });

    expect(datagridObj.visibleColumns().length).toEqual(8);

    datagridObj.updateColumns(newColumns);

    expect(datagridObj.visibleColumns().length).toEqual(3);

    datagridObj.updateColumns(columns);

    expect(datagridObj.visibleColumns().length).toEqual(8);
  });
});
