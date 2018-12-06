import { Datagrid } from '../../../src/components/datagrid/datagrid';
import { Formatters } from '../../../src/components/datagrid/datagrid.formatters';
import { Editors } from '../../../src/components/datagrid/datagrid.editors';

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
columns.push({ id: 'productId', name: 'Product Id', field: 'productId', formatter: Formatters.Expander, filterType: 'text' });
columns.push({ id: 'productName', name: 'Product Name', field: 'productName', formatter: Formatters.Hyperlink, filterType: 'Text', editor: Editors.Input }); //eslint-disable-line
columns.push({ id: 'activity', name: 'Activity', field: 'activity', readonly: true, filterType: 'Text' });
columns.push({ id: 'hidden', hidden: true, name: 'Hidden', field: 'hidden', filterType: 'Text' });
columns.push({ id: 'price', align: 'right', name: 'Actual Price', readonly: true, field: 'price', formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'currency', currencySign: '$' } });
columns.push({ id: 'percent', align: 'right', name: 'Actual %', field: 'percent', reorderable: true, formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'percent' } });
columns.push({ id: 'orderDate', name: 'Order Date', field: 'orderDate', reorderable: true, formatter: Formatters.Date, dateFormat: 'M/d/yyyy' });
columns.push({ id: 'phone', name: 'Phone', field: 'phone', isEditable: () => {return true}, filterType: 'Text', formatter: Formatters.Text, validate: 'required', required: true, editor: Editors.Input }); //eslint-disable-line

const rowTemplate = `<div class="datagrid-cell-layout"><div class="img-placeholder"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-camera"></use></svg></div></div>
  <div class="datagrid-cell-layout"><p class="datagrid-row-heading">Expandable Content Area</p>
  <p class="datagrid-row-micro-text">{{{sku}}}</p>
  <span class="datagrid-wrapped-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only...</span>
  <a class="hyperlink" href="https://design.infor.com/" target="_blank" >Read more</a>`;

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
    const spyEventAfter = spyOnEvent($(datagridEl), 'afterrender');
    datagridObj = new Datagrid(datagridEl, { dataset: data, columns });

    expect(spyEvent).toHaveBeenTriggered();
    expect(spyEventAfter).toHaveBeenTriggered();
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
    datagridObj.addRow({ productId: 'New', productName: 'New' });

    expect(document.body.querySelector('tr td use').getAttribute('xlink:href')).toEqual('#icon-exclamation');
    expect(document.body.querySelectorAll('tr').length).toEqual(9);

    datagridObj.addRow({ productId: 'New 2', productName: 'New 2' }, 'bottom');

    const nodes = document.body.querySelectorAll('tr');
    const lastRow = nodes[nodes.length - 1];

    expect(lastRow.querySelector('td use').getAttribute('xlink:href')).toEqual('#icon-exclamation');
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

  it('Should be able to call updateDataset with null toolbar', () => {
    const newData = [];
    newData.push({ id: 1, productId: 2142201, sku: 'SKU #9000001-237', productName: 'Compressor' });
    newData.push({ id: 2, productId: 2241202, sku: 'SKU #9000001-236', productName: 'Different Compressor' });
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, { dataset: data, columns, toolbar: null });

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
    text = document.body.querySelectorAll('tbody tr')[1].querySelector('td').innerText.trim();

    expect(text).toEqual('200');

    datagridObj.updateRow(1, { productId: 'test', productName: 'test' });
    text = document.body.querySelectorAll('tbody tr')[1].querySelector('td').innerText.trim();

    expect(text).toEqual('test');
  });

  it('Should be able to show tooltip on either text cut off or not', (done) => {
    datagridObj.destroy();
    columns[1].width = 500;
    columns[1].tooltip = 'Some tooltip data';
    datagridObj = new Datagrid(datagridEl, {
      dataset: data,
      columns,
      enableTooltips: true
    });
    const td = document.body.querySelector('tbody tr[aria-rowindex="2"] td[aria-colindex="2"]');
    $(td).trigger('mouseover');

    setTimeout(() => {
      expect(document.body.querySelector('.grid-tooltip')).toBeTruthy();
      done();
    }, 500);
  });

  it('Should be able to show tooltip rowStatus', (done) => {
    datagridObj.rowStatus(0, 'info', 'Info');
    const rowstatusIcon = document.body.querySelector('tbody tr[aria-rowindex="1"] td[aria-colindex="1"] .icon-rowstatus');
    $(rowstatusIcon).trigger('mouseover');

    setTimeout(() => {
      expect(document.body.querySelector('.grid-tooltip')).toBeTruthy();
      expect(document.body.querySelector('.grid-tooltip.is-error')).toBeFalsy();
      done();
    }, 500);
  });

  it('Should be able to show tooltip rowStatus error', (done) => {
    datagridObj.rowStatus(0, 'error', 'Error');
    const rowstatusIcon = document.body.querySelector('tbody tr[aria-rowindex="1"] td[aria-colindex="1"] .icon-rowstatus');
    $(rowstatusIcon).trigger('mouseover');

    setTimeout(() => {
      expect(document.body.querySelector('.grid-tooltip')).toBeTruthy();
      expect(document.body.querySelector('.grid-tooltip.is-error')).toBeTruthy();
      done();
    }, 500);
  });

  it('Should be able to get the column info by id', () => {
    let columnInfo = datagridObj.columnById('orderDate')[0];

    expect(columnInfo.name).toEqual('Order Date');
    expect(columnInfo.dateFormat).toEqual('M/d/yyyy');

    columnInfo = datagridObj.columnById('activity')[0];

    expect(columnInfo.name).toEqual('Activity');
    expect(columnInfo.readonly).toEqual(true);
  });

  it('Should be able to get the column index by id', () => {
    let idx = datagridObj.columnIdxById('orderDate');

    expect(idx).toEqual(6);

    idx = datagridObj.columnIdxById('activity');

    expect(idx).toEqual(2);
  });

  it('Should be able to check if a cell is editable', () => {
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, {
      dataset: data,
      columns,
      editable: true
    });

    // Test Column readonly property
    let isEditable = datagridObj.isCellEditable(0, 2);

    expect(isEditable).toEqual(false);

    // Test column with editor
    isEditable = datagridObj.isCellEditable(0, 1);

    expect(isEditable).toEqual(true);

    // Test column with nothing specified
    isEditable = datagridObj.isCellEditable(0, 0);

    expect(isEditable).toEqual(false);

    // Test column with isEditable function specified
    isEditable = datagridObj.isCellEditable(0, datagridObj.columnIdxById('phone'));

    expect(isEditable).toEqual(true);
  });

  it('Should be able to validate required on a cell', (done) => {
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, {
      dataset: data,
      columns,
      editable: true
    });

    const spyEvent = spyOnEvent($('#datagrid'), 'cellerror');
    datagridObj.validateCell(0, 7);
    datagridObj.validateCell(1, 7);

    setTimeout(() => {
      expect(spyEvent).toHaveBeenTriggered();
      expect(document.querySelectorAll('td.error').length).toEqual(2);

      datagridObj.clearCellError(0, 7, 'error');

      expect(document.querySelectorAll('td.error').length).toEqual(1);

      datagridObj.clearAllCellError(1, 7);

      expect(document.querySelectorAll('td.error').length).toEqual(0);
      done();
    }, 100);
  });

  it('Should be able to show and then clear a row error', () => {
    datagridObj.showRowError(1, 'Test Error', 'error');
    datagridObj.showRowError(2, 'Test Error', 'alert');

    expect(document.querySelectorAll('tr.alert').length).toEqual(1);
    expect(document.querySelectorAll('tr.error').length).toEqual(1);
    expect(document.querySelectorAll('.icon-rowstatus').length).toEqual(2);

    datagridObj.clearAllErrors();

    expect(document.querySelectorAll('tr.alert').length).toEqual(0);
    expect(document.querySelectorAll('tr.error').length).toEqual(0);
    expect(document.querySelectorAll('.icon-rowstatus').length).toEqual(0);

    datagridObj.showRowError(1, 'Test Error', 'error');
    datagridObj.showRowError(2, 'Test Error', 'alert');
    datagridObj.clearRowError(1);

    expect(document.querySelectorAll('tr.alert').length).toEqual(1);
    expect(document.querySelectorAll('tr.error').length).toEqual(0);
    expect(document.querySelectorAll('.icon-rowstatus').length).toEqual(1);

    datagridObj.clearAllErrors();
  });

  it('Should be able to reset row status', () => {
    datagridObj.showRowError(1, 'Test Error', 'error');
    datagridObj.showRowError(2, 'Test Error', 'alert');

    expect(document.querySelectorAll('tr.alert').length).toEqual(1);
    expect(document.querySelectorAll('tr.error').length).toEqual(1);
    expect(document.querySelectorAll('.icon-rowstatus').length).toEqual(2);

    datagridObj.resetRowStatus();

    expect(document.querySelectorAll('tr.alert').length).toEqual(0);
    expect(document.querySelectorAll('tr.error').length).toEqual(0);
    expect(document.querySelectorAll('.icon-rowstatus').length).toEqual(0);
  });

  it('Should be able to track dirty cells', () => {
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, { dataset: data, columns, editable: true, showDirty: true }); // eslint-disable-line max-len

    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(0);

    const cell1 = document.querySelector('tr:nth-child(1) td:nth-child(2)');
    const cell2 = document.querySelector('tr:nth-child(1) td:nth-child(3)');

    cell1.click();
    let input = cell1.querySelector('input');
    const originalVal = input.value;
    input.value = 'Cell test value';
    cell2.click();

    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(1);
    expect(cell1.classList.contains('is-dirty-cell')).toBeTruthy();

    cell1.click();
    input = cell1.querySelector('input');
    input.value = originalVal;
    cell2.click();

    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(0);
  });

  it('Should be able to validate rows', (done) => {
    datagridObj.validateRow();

    expect(document.querySelectorAll('td.error').length).toEqual(0);

    datagridObj.validateRow(1);

    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, {
      dataset: data,
      columns,
      editable: true
    });

    datagridObj.validateRow();

    expect(document.querySelectorAll('td.error').length).toEqual(0);

    datagridObj.validateRow(1);
    setTimeout(() => {
      expect(document.querySelectorAll('td.error').length).toEqual(1);
      expect(document.querySelector('td.error').getAttribute('data-errormessage').indexOf('Required')).not.toBeLessThan('0');
      datagridObj.clearAllErrors();
      done();
    });
  });

  it('Should be able to validate all rows', (done) => {
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, {
      dataset: data,
      columns,
      editable: true
    });

    datagridObj.validateAll();

    setTimeout(() => {
      expect(document.querySelectorAll('td.error').length).toEqual(4);
      datagridObj.clearAllErrors();
      done();
    });
  });

  it('Should be able to get column settings', () => {
    const settings = datagridObj.columnSettings(6);

    expect(settings.id).toEqual('orderDate');
    expect(settings.dateFormat).toEqual('M/d/yyyy');
    expect(settings.field).toEqual('orderDate');
  });

  it('Should be able to update a cell with the api', () => {
    datagridObj.updateCell(1, 1, 'Test');

    document.querySelector('tr:nth-child(1) td:nth-child(2)').click();

    expect(document.querySelector('tr:nth-child(2) td:nth-child(2)').innerText.substr(0, 4)).toEqual('Test');
  });

  it('Should be able to set an active cell', () => {
    datagridObj.setActiveCell(1, 0);

    expect(document.activeElement.innerText.trim()).toEqual('200');
  });

  it('Should be able to toggle an expandable row', (done) => {
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, {
      dataset: data,
      columns,
      rowTemplate
    });

    const spyEvent = spyOnEvent($(datagridEl), 'expandrow');
    const spyEventCollapse = spyOnEvent($(datagridEl), 'collapserow');

    expect(document.querySelectorAll('.datagrid-expand-btn').length).toEqual(7);
    document.querySelector('.datagrid-expand-btn:nth-child(1)').click();

    setTimeout(() => {
      expect(document.querySelector('.datagrid-expandable-row').classList.contains('is-expanded')).toBeTruthy();
      expect(spyEvent).toHaveBeenTriggered();

      setTimeout(() => {
        document.querySelector('.datagrid-expand-btn:nth-child(1)').click();

        expect(spyEventCollapse).toHaveBeenTriggered();
        done();
      }, 300);
    }, 300);
  });

  it('Should be able to toggle an expandable row with the api', (done) => {
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, {
      dataset: data,
      columns,
      rowTemplate
    });

    const spyEvent = spyOnEvent($(datagridEl), 'expandrow');
    const spyEventCollapse = spyOnEvent($(datagridEl), 'collapserow');

    expect(document.querySelectorAll('.datagrid-expand-btn').length).toEqual(7);
    datagridObj.toggleRowDetail(0);

    setTimeout(() => {
      expect(document.querySelector('.datagrid-expandable-row').classList.contains('is-expanded')).toBeTruthy();
      expect(spyEvent).toHaveBeenTriggered();

      setTimeout(() => {
        datagridObj.toggleRowDetail(0);

        expect(spyEventCollapse).toHaveBeenTriggered();
        done();
      }, 300);
    }, 300);
  });

  it('Should be able to set the sort column', () => {
    expect(document.querySelector('tr:nth-child(1) td:nth-child(2)').innerText.substr(0, 10)).toEqual('Compressor');

    datagridObj.setSortColumn('productName', false);

    expect(document.querySelector('tr:nth-child(1) td:nth-child(2)').innerText.substr(0, 15)).toEqual('Some Compressor');

    datagridObj.setSortColumn('productName', true);

    expect(document.querySelector('tr:nth-child(1) td:nth-child(2)').innerText.substr(0, 15)).toEqual('Air Compressors');
  });

  it('Should be able to track dirty cells with sort column', () => {
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, { dataset: data, columns, editable: true, showDirty: true }); // eslint-disable-line max-len

    let input;
    let cell1 = document.querySelector('tr:nth-child(1) td:nth-child(2)');
    let cell2 = document.querySelector('tr:nth-child(1) td:nth-child(3)');

    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(0);
    expect(cell1.classList.contains('is-dirty-cell')).toBeFalsy();
    expect(document.querySelector('tr:nth-child(1) td:nth-child(2)').innerText.substr(0, 10)).toEqual('Compressor');

    cell1.click();
    input = cell1.querySelector('input');
    const originalVal = input.value;
    input.value = 'Cell test value';
    cell2.click();

    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(1);
    expect(cell1.classList.contains('is-dirty-cell')).toBeTruthy();

    datagridObj.setSortColumn('productName', false);

    expect(document.querySelector('tr:nth-child(1) td:nth-child(2)').innerText.substr(0, 15)).toEqual('Some Compressor');

    cell1 = document.querySelector('tr:nth-child(5) td:nth-child(2)');
    cell2 = document.querySelector('tr:nth-child(5) td:nth-child(3)');

    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(1);
    expect(cell1.classList.contains('is-dirty-cell')).toBeTruthy();

    datagridObj.setSortColumn('productName', true);

    expect(document.querySelector('tr:nth-child(1) td:nth-child(2)').innerText.substr(0, 15)).toEqual('Air Compressors');

    cell1 = document.querySelector('tr:nth-child(3) td:nth-child(2)');
    cell2 = document.querySelector('tr:nth-child(3) td:nth-child(3)');

    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(1);
    expect(cell1.classList.contains('is-dirty-cell')).toBeTruthy();

    cell1.click();
    input = cell1.querySelector('input');
    input.value = originalVal;
    cell2.click();

    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(0);
    expect(cell1.classList.contains('is-dirty-cell')).toBeFalsy();
  });

  it('Should be able to accept nested datarow objects', () => {
    const newColumns = [];
    newColumns.push({ id: 'productId', name: 'Product Id', field: 'productId', formatter: Formatters.Readonly });
    newColumns.push({ id: 'productName', name: 'Product Name', sortable: false, field: 'productInfo.productName.value', formatter: Formatters.Text, editor: Editors.Input });
    newColumns.push({ id: 'productType', name: 'Product Type', sortable: false, field: 'productInfo.productProperties.productType.value', formatter: Formatters.Text, editor: Editors.Input });
    newColumns.push({ id: 'productUnit', name: 'Product Unit', sortable: false, field: 'productInfo.productProperties.productMeasure.productUnit.value', formatter: Formatters.Text, editor: Editors.Input });

    datagridObj.updateColumns(newColumns);

    const newData = [];
    newData.push({
      id: 1,
      productId: 2142201,
      productInfo: {
        productName: {
          value: 'Compressor'
        },
        productProperties: {
          productType: {
            value: 'Metal'
          },
          productMeasure: {
            productUnit: {
              value: 'Newton'
            }
          }
        }
      }
    });

    newData.push({
      id: 2,
      productId: 2142202,
      productInfo: {
        productName: {
          value: 'Compressor'
        },
        productProperties: {
          productType: {
            value: 'Aluminum'
          },
          productMeasure: {
            productUnit: {
              value: 'Newton'
            }
          }
        }
      }
    });

    datagridObj.updateDataset(newData);

    // Check if rows are properly rendered
    expect(document.body.querySelectorAll('.datagrid-row').length).toEqual(2);

    // Check if dataset is properly rendered
    expect(document.body.querySelectorAll('td').length).toEqual(8);

    // Check if value in dataset is properly rendered
    expect(document.body.querySelectorAll('.datagrid-cell-wrapper')[3].innerHTML).toEqual('Newton');
  });
});
