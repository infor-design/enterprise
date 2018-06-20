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

describe('Datagrid Selection API', () => {
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

  it('Should be able to single select', (done) => {
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, { dataset: data, columns, selectable: 'single' });

    const spyEvent = spyOnEvent($(datagridEl), 'selected');
    $(datagridEl).on('selected', (e, args) => {
      expect(args[0].idx).toEqual(1);
      expect(args[0].data.id).toEqual('2');
      done();
    });

    document.body.querySelectorAll('tr')[2].querySelector('td').click();

    expect(spyEvent).toHaveBeenTriggered();
    $(datagridEl).off('selected');
    datagridObj.unSelectAllRows();
  });

  it('Should be able to single select with api', (done) => {
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, { dataset: data, columns, selectable: 'single' });

    const spyEvent = spyOnEvent($(datagridEl), 'selected');
    $(datagridEl).on('selected', (e, args) => {
      expect(args[0].idx).toEqual(1);
      expect(args[0].data.id).toEqual('2');
      done();
    });

    datagridObj.selectRow(1);

    expect(spyEvent).toHaveBeenTriggered();

    spyEvent.reset();
    datagridObj.selectRow(1, true, true);

    expect(spyEvent.calls.count()).toEqual(0);
    $(datagridEl).off('selected');
    datagridObj.unSelectAllRows();
  });

  it('Should be able to multi select', (done) => {
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, { dataset: data, columns, selectable: 'multi' });

    const spyEvent = spyOnEvent($(datagridEl), 'selected');
    let cnt = 0;
    $(datagridEl).on('selected', (e, args) => {
      cnt++;
      if (cnt === 2) {
        expect(args[0].idx).toEqual(1);
        expect(args[0].data.id).toEqual('2');
        expect(args[1].idx).toEqual(2);
        expect(args[1].data.id).toEqual('3');
      }
      done();
    });

    document.body.querySelectorAll('tr')[2].querySelector('td').click();
    document.body.querySelectorAll('tr')[3].querySelector('td').click();

    expect(spyEvent).toHaveBeenTriggered();
    $(datagridEl).off('selected');
    datagridObj.unSelectAllRows();
  });

  it('Should be able to unselect', () => {
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, { dataset: data, columns, selectable: 'multi' });

    document.body.querySelectorAll('tr')[2].querySelector('td').click();
    document.body.querySelectorAll('tr')[3].querySelector('td').click();

    expect(datagridObj.selectedRows().length).toEqual(2);
    expect(datagridObj.selectedRows()[0].idx).toEqual(1);
    expect(datagridObj.selectedRows()[1].idx).toEqual(2);
    datagridObj.unselectRow(1);
    datagridObj.unselectRow(2);

    expect(datagridObj.selectedRows().length).toEqual(0);
  });

  it('Should be able to removeSelected', () => {
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, { dataset: data, columns, selectable: 'multi' });

    document.body.querySelectorAll('tr')[2].querySelector('td').click();
    document.body.querySelectorAll('tr')[3].querySelector('td').click();

    datagridObj.removeSelected();

    expect(document.body.querySelectorAll('tr').length).toEqual(6);
    expect(datagridObj.selectedRows().length).toEqual(0);

    datagridObj.updateDataset(originalData);
  });
});
