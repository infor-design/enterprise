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
columns.push({ id: 'productId', name: 'Id', field: 'productId', reorderable: true, formatter: Formatters.Text, width: 100, filterType: 'Text' });
columns.push({ id: 'productName', name: 'Product Name', field: 'productName', reorderable: true, formatter: Formatters.Hyperlink, width: 300, filterType: 'Text' });
columns.push({ id: 'activity', name: 'Activity', field: 'activity', reorderable: true, filterType: 'Text' });
columns.push({ id: 'hidden', hidden: true, name: 'Hidden', field: 'hidden', filterType: 'Text' });
columns.push({ id: 'price', align: 'right', name: 'Actual Price', field: 'price', reorderable: true, formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'currency', currencySign: '$' } });
columns.push({ id: 'percent', align: 'right', name: 'Actual %', field: 'percent', reorderable: true, formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'percent' } });
columns.push({ id: 'orderDate', name: 'Order Date', field: 'orderDate', reorderable: true, formatter: Formatters.Date, dateFormat: 'M/d/yyyy' });
columns.push({ id: 'phone', name: 'Phone', field: 'phone', reorderable: true, filterType: 'Text', formatter: Formatters.Text });

describe('Datagrid API', () => {
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

  it('Should be defined as an object', () => {
    expect(datagridObj).toEqual(jasmine.any(Object));
  });

  it('Should render datagrid', () => {
    datagridObj.destroy();
    const spyEvent = spyOnEvent($(datagridEl), 'rendered');
    datagridObj = new Datagrid(datagridEl, { dataset: data, columns });

    expect(spyEvent).toHaveBeenTriggered();
    expect(document.body.querySelectorAll('tr').length).toEqual(8);
  });

  it('Should destroy datagrid', () => {
    datagridObj.destroy();

    expect(document.body.querySelector('.datagrid')).toBeFalsy();
  });

  it('Should be able to call render', (done) => {
    let didCall = false;

    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, {
      filterable: true,
      dataset: data,
      columns,
      paging: true,
      pagesize: 10,
      source(e) {
        if (e.type === 'filterrow') {
          didCall = true;

          expect(didCall).toBeTruthy();
          done();
        }
      }
    });

    expect(document.body.querySelectorAll('tr').length).toEqual(8);

    datagridObj.render();

    expect(document.body.querySelectorAll('tr').length).toEqual(8);

    datagridObj.render(true);

    expect(document.body.querySelectorAll('tr').length).toEqual(8);
  });

  it('Should be able to call addRow and removeRow', () => {
    const iconExclamation = '<svg class="icon icon-rowstatus" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-exclamation"></use></svg>';
    datagridObj.addRow({ productId: 'New', productName: 'New' });

    expect(document.body.querySelector('tr td').innerHTML).toEqual(`${iconExclamation}<div class="datagrid-cell-wrapper">New</div>`);
    expect(document.body.querySelectorAll('tr').length).toEqual(9);

    datagridObj.addRow({ productId: 'New 2', productName: 'New 2' }, 'bottom');

    const nodes = document.body.querySelectorAll('tr');
    const lastRow = nodes[nodes.length - 1];

    expect(lastRow.querySelector('td').innerHTML).toEqual(`${iconExclamation}<div class="datagrid-cell-wrapper">New 2</div>`);
    expect(document.body.querySelectorAll('tr').length).toEqual(10);

    // Cleanup
    datagridObj.removeRow(0);
    datagridObj.removeRow(7);

    expect(document.body.querySelectorAll('tr').length).toEqual(8);
  });

  it('Should be able to call updateDataset', () => {
    const newData = [];
    newData.push({ id: 1, productId: 2142201, sku: 'SKU #9000001-237', productName: 'Compressor' });
    newData.push({ id: 2, productId: 2241202, sku: 'SKU #9000001-236', productName: 'Different Compressor' });

    datagridObj.updateDataset(newData);

    expect(document.body.querySelectorAll('tbody tr').length).toEqual(2);
  });

  it('Should be able to call triggerSource', (done) => {
    let didCallSource = false;

    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, {
      filterable: true,
      dataset: data,
      columns,
      paging: true,
      pagesize: 10,
      source(e) {
        if (e.type === 'refresh') {
          didCallSource = true;

          expect(didCallSource).toBeTruthy();
          done();
        }
      }
    });

    datagridObj.triggerSource('refresh');
  });

  it('Should be able to call updateRow', () => {
    let text = '';
    text = document.body.querySelectorAll('tbody tr')[1].querySelector('td').innerText.replace(/(\r\n\t|\n|\r\t)/gm, '');

    expect(text).toEqual('200');

    datagridObj.updateRow(1, { productId: 'test', productName: 'test' });
    text = document.body.querySelectorAll('tbody tr')[1].querySelector('td').innerText.replace(/(\r\n\t|\n|\r\t)/gm, '');

    expect(text).toEqual('test');
  });
});
