import { Datagrid } from '../../../src/components/datagrid/datagrid';
import { Formatters } from '../../../src/components/datagrid/datagrid.formatters';
import { Editors } from '../../../src/components/datagrid/datagrid.editors';
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
columns.push({ id: 'productId', name: 'Product Id', field: 'productId', formatter: Formatters.Text, editor: Editors.Input, filterType: 'text' });
columns.push({ id: 'productName', name: 'Product Name', field: 'productName', formatter: Formatters.Hyperlink, filterType: 'Text', editor: Editors.Input }); //eslint-disable-line
columns.push({ id: 'activity', name: 'Activity', field: 'activity', readonly: true, filterType: 'Text' });
columns.push({ id: 'hidden', hidden: true, name: 'Hidden', field: 'hidden', filterType: 'Text' });
columns.push({ id: 'price', align: 'right', name: 'Actual Price', readonly: true, field: 'price', formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'currency', currencySign: '$' } });
columns.push({ id: 'portable', name: 'Portable', field: 'portable', align: 'center', formatter: Formatters.Checkbox, editor: Editors.Checkbox });
columns.push({ id: 'percent', align: 'right', name: 'Actual %', field: 'percent', reorderable: true, formatter: Formatters.Decimal, numberFormat: { minimumFractionDigits: 0, maximumFractionDigits: 0, style: 'percent' } });
columns.push({ id: 'orderDate', name: 'Order Date', field: 'orderDate', reorderable: true, formatter: Formatters.Date, dateFormat: 'M/d/yyyy' });
columns.push({ id: 'phone', name: 'Phone', field: 'phone', isEditable: () => {return true}, filterType: 'Text', formatter: Formatters.Text, validate: 'required', required: true, editor: Editors.Input }); //eslint-disable-line

describe('Datagrid Editing API', () => {
  const Locale = window.Soho.Locale;

  beforeEach(() => {
    datagridEl = null;
    datagridObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', datagridHTML);
    datagridEl = document.body.querySelector('#datagrid');

    Locale.set('en-US');
    data = JSON.parse(JSON.stringify(originalData));

    datagridObj = new Datagrid(datagridEl, {
      dataset: data,
      columns,
      showDirty: true,
      editable: true
    });
  });

  afterEach(() => {
    datagridObj.destroy();
    cleanup([
      '.svg-icons',
      '.row',
      '#datagrid-script'
    ]);
  });

  it('Should mark cells dirty with Api', () => {
    datagridObj.setDirtyIndicator(2, datagridObj.columnIdxById('phone'), true);

    expect(document.body.querySelectorAll('.is-dirty-cell').length).toEqual(1);
    datagridObj.setDirtyIndicator(2, datagridObj.columnIdxById('phone'), false);
  });

  it('Should be able to get all modified rows/cells', () => {
    // Make a 3 cells dirty
    datagridObj.addToDirtyArray(0, 5, { originalVal: false, isDirty: false });
    datagridObj.updateCellNode(0, 5, true, false);
    datagridObj.addToDirtyArray(1, 5, { originalVal: false, isDirty: false });
    datagridObj.updateCellNode(1, 5, true, false);
    datagridObj.addToDirtyArray(2, 5, { originalVal: false, isDirty: false });
    datagridObj.updateCellNode(2, 5, true, false);

    expect(document.body.querySelectorAll('.is-dirty-cell').length).toEqual(3);
    // Add an error row and an in progress row
    datagridObj.rowStatus(2, 'in-progress', 'Row Is In Progress');
    datagridObj.rowStatus(3, 'error', 'Row has an error');

    const modifiedRows = datagridObj.getModifiedRows();

    expect(modifiedRows.length).toEqual(4);
    expect(modifiedRows[0].type).toEqual('dirty');
    expect(modifiedRows[0].cells.length).toEqual(1);
    expect(modifiedRows[0].cells[0].cellData.isDirty).toEqual(true);
    expect(modifiedRows[0].cells[0].cellData.column.id).toEqual('portable');
    expect(modifiedRows[0].cells[0].cellData.originalVal).toEqual(false);
    expect(modifiedRows[0].cells[0].cellData.value).toEqual(true);
    expect(modifiedRows[0].cells[0].row).toEqual(0);
    expect(modifiedRows[0].cells[0].col).toEqual(5);

    expect(modifiedRows[1].type).toEqual('dirty');
    expect(modifiedRows[2].type).toEqual(['dirty', 'in-progress']);
    expect(modifiedRows[3].type).toEqual('error');
  });

  it('Should be able to get all modified rows only changed values', () => {
    // Make a 3 cells dirty
    datagridObj.addToDirtyArray(0, 5, { originalVal: false, isDirty: false });
    datagridObj.updateCellNode(0, 5, true, false);
    datagridObj.addToDirtyArray(1, 5, { originalVal: false, isDirty: false });
    datagridObj.updateCellNode(1, 5, true, false);
    datagridObj.addToDirtyArray(2, 5, { originalVal: false, isDirty: false });
    datagridObj.updateCellNode(2, 5, true, false);

    expect(document.body.querySelectorAll('.is-dirty-cell').length).toEqual(3);
    // Add an error row and an in progress row
    datagridObj.rowStatus(2, 'in-progress', 'Row Is In Progress');
    datagridObj.rowStatus(3, 'error', 'Row has an error');

    const modifiedRows = datagridObj.getModifiedRows(true);

    expect(modifiedRows.length).toEqual(4);
    expect(modifiedRows[0].portable).toEqual(true);
    expect(modifiedRows[1].portable).toEqual(true);
    expect(modifiedRows[2].portable).toEqual(true);
    expect(modifiedRows[2].rowStatus.icon).toEqual('in-progress');
    expect(modifiedRows[3].rowStatus.icon).toEqual('error');
  });
});
