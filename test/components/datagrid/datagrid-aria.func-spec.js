import { Datagrid } from '../../../src/components/datagrid/datagrid';
import { Formatters } from '../../../src/components/datagrid/datagrid.formatters';
import { cleanup } from '../../helpers/func-utils';

const datagridHTML = require('../../../app/views/components/datagrid/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');
const originalData = require('../../../app/data/datagrid-sample-data');

let data = [];
require('../../../src/components/locale/cultures/en-US.js');

let datagridEl;
let datagridObj;

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

describe('Datagrid ARIA', () => { //eslint-disable-line
  const Locale = window.Soho.Locale;

  beforeEach(() => {
    datagridEl = null;
    datagridObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', datagridHTML);
    datagridEl = document.body.querySelector('#datagrid');

    Locale.set('en-US');
    data = JSON.parse(JSON.stringify(originalData));

    datagridObj = new Datagrid(datagridEl, { dataset: data, columns, selectable: 'single' });
  });

  afterEach(() => {
    datagridObj.destroy();
    cleanup([
      '#datagrid-script',
      '.svg-icons',
      '.row',
      '#tooltip',
      '.grid-tooltip'
    ]);
  });

  it('Should set ARIA attributes', () => {
    expect(document.querySelector('.sort-asc svg[aria-hidden="true"]')).toBeTruthy();
    expect(document.querySelector('.sort-desc svg[aria-hidden="true"]')).toBeTruthy();
    expect(document.querySelector('.icon-empty-state[aria-hidden="true"]')).toBeTruthy();

    expect(document.querySelectorAll('.datagrid-wrapper tbody tr')[0].getAttribute('aria-rowindex')).toEqual('1');
    expect(document.querySelectorAll('.datagrid-wrapper tbody tr')[3].getAttribute('aria-rowindex')).toEqual('4');
    expect(document.querySelectorAll('.datagrid-wrapper tbody tr')[6].getAttribute('aria-rowindex')).toEqual('7');

    expect(document.querySelectorAll('.datagrid-wrapper tbody tr')[0].querySelector('td').getAttribute('aria-readonly')).toEqual('true');
    expect(document.querySelectorAll('.datagrid-wrapper tbody tr')[0].querySelector('td').getAttribute('aria-colindex')).toEqual('1');
    expect(document.querySelectorAll('.datagrid-wrapper tbody tr')[0].querySelectorAll('td')[1].getAttribute('aria-colindex')).toEqual('2');
    expect(document.querySelectorAll('.datagrid-wrapper tbody tr')[0].querySelector('td').getAttribute('aria-describedby')).toBeTruthy();
  });

  it('Should set ARIA attributes for selection', () => {
    datagridObj.selectRow(1);

    expect(document.querySelectorAll('.datagrid-wrapper tbody tr')[1].getAttribute('aria-selected')).toBe('true');

    datagridObj.unSelectAllRows(1);

    expect(document.querySelectorAll('.datagrid-wrapper tbody tr')[1].getAttribute('aria-selected')).toBeFalsy();
  });
});
