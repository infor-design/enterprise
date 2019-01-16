import { Datagrid } from '../../../src/components/datagrid/datagrid';
import { Formatters } from '../../../src/components/datagrid/datagrid.formatters';
import { Editors } from '../../../src/components/datagrid/datagrid.editors';

const datagridHTML = require('../../../app/views/components/datagrid/example-tree.html');
const svg = require('../../../src/components/icons/svg.html');
const originalData = require('../../../app/data/datagrid-sample-data-tree');

let data = [];
require('../../../src/components/locale/cultures/en-US.js');

let datagridEl;
let svgEl;
let datagridObj;

// Define Columns for the Grid.
const columns = [];
columns.push({ id: 'taskName', name: 'Task', field: 'taskName', expanded: 'expanded', formatter: Formatters.Tree, filterType: 'text' });
columns.push({ id: 'id', name: 'Id', field: 'id' });
columns.push({ id: 'desc', name: 'Description', field: 'desc', editor: Editors.Input });
columns.push({ id: 'comments', name: 'Comments', field: 'comments', formatter: Formatters.Hyperlink });
columns.push({ id: 'time', name: 'Time', field: 'time' });

describe('Datagrid Tree', () => {
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
  });

  it('Should be defined as an object', () => {
    expect(datagridObj).toEqual(jasmine.any(Object));
  });

  it('Should show Row Activated', (done) => {
    datagridObj.destroy();
    const spyEvent = spyOnEvent($(datagridEl), 'rendered');
    const duplicateColumns = [...columns];
    duplicateColumns.unshift({ id: 'selectionCheckbox', sortable: false, resizable: false, width: 50, formatter: Formatters.SelectionCheckbox, align: 'center' });
    datagridObj = new Datagrid(datagridEl, {
      columns: duplicateColumns,
      dataset: data,
      selectable: 'mixed',
      treeGrid: true,
      toolbar: { title: 'Tasks (Hierarchical)', results: true, personalize: true }
    });

    expect(spyEvent).toHaveBeenTriggered();
    expect(document.body.querySelectorAll('tbody tr.datagrid-tree-parent').length).toEqual(7);
    expect(document.body.querySelectorAll('tbody tr.datagrid-tree-child').length).toEqual(13);

    const spyEventRowActivated = spyOnEvent($(datagridEl), 'rowactivated');
    $(datagridEl).on('rowactivated', (e, args) => {
      expect(args.row).toEqual(5);
      expect(args.item.idx).toEqual(6);
      expect(args.item.node.id).toEqual(6);
      expect(args.item.node.taskName).toEqual('Follow up action with HMM Global');
      done();
    });

    document.body.querySelector('tbody tr[aria-rowindex="6"] td[aria-colindex="2"]').click();

    expect(spyEventRowActivated).toHaveBeenTriggered();
    $(datagridEl).off('rowactivated');
  });

  it('Should be able to track dirty cells with treeGrid', () => {
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, { dataset: data, columns, treeGrid: true, editable: true, showDirty: true }); // eslint-disable-line max-len

    expect(document.body.querySelectorAll('tbody tr.datagrid-tree-parent').length).toEqual(7);
    expect(document.body.querySelectorAll('tbody tr.datagrid-tree-child').length).toEqual(13);
    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(0);

    const cell1 = document.querySelector('tr:nth-child(5) td:nth-child(3)');
    const cell2 = document.querySelector('tr:nth-child(5) td:nth-child(2)');

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

  it('Should be able to track dirty cells with sort column and treeGrid', () => {
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, { dataset: data, columns, treeGrid: true, editable: true, showDirty: true }); // eslint-disable-line max-len

    expect(document.body.querySelectorAll('tbody tr.datagrid-tree-parent').length).toEqual(7);
    expect(document.body.querySelectorAll('tbody tr.datagrid-tree-child').length).toEqual(13);

    let cell1 = document.querySelector('tr:nth-child(5) td:nth-child(3)');
    let cell2 = document.querySelector('tr:nth-child(5) td:nth-child(2)');
    let input;

    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(0);
    expect(cell1.classList.contains('is-dirty-cell')).toBeFalsy();
    expect(document.querySelector('tr:nth-child(5) td:nth-child(2)').innerText.substr(0, 10).trim()).toEqual('5');

    cell1.click();
    input = cell1.querySelector('input');
    const originalVal = input.value;
    input.value = 'Cell test value';
    cell2.click();

    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(1);
    expect(cell1.classList.contains('is-dirty-cell')).toBeTruthy();

    datagridObj.setSortColumn('id', false);

    expect(document.querySelector('tr:nth-child(5) td:nth-child(2)').innerText.substr(0, 10).trim()).toEqual('19');

    cell1 = document.querySelector('tr:nth-child(18) td:nth-child(3)');
    cell2 = document.querySelector('tr:nth-child(18) td:nth-child(2)');

    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(1);
    expect(cell1.classList.contains('is-dirty-cell')).toBeTruthy();

    datagridObj.setSortColumn('taskName', true);

    expect(document.querySelector('tr:nth-child(5) td:nth-child(2)').innerText.substr(0, 10).trim()).toEqual('4');

    cell1 = document.querySelector('tr:nth-child(22) td:nth-child(3)');
    cell2 = document.querySelector('tr:nth-child(22) td:nth-child(2)');

    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(1);
    expect(cell1.classList.contains('is-dirty-cell')).toBeTruthy();

    cell1.click();
    input = cell1.querySelector('input');
    input.value = originalVal;
    cell2.click();

    expect(document.querySelectorAll('.is-dirty-cell').length).toEqual(0);
    expect(cell1.classList.contains('is-dirty-cell')).toBeFalsy();
  });

  it('Should be able to set children by allowChildExpandOnMatch:true', () => {
    const filter = [{ columnId: 'taskName', operator: 'contains', value: 'hmm' }];
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, {
      columns,
      dataset: data,
      treeGrid: true,
      filterable: true,
      allowChildExpandOnMatch: true
    });

    expect(document.body.querySelectorAll('tbody tr:not(.is-hidden)').length).toEqual(19);
    datagridObj.applyFilter(filter);

    expect(document.body.querySelectorAll('tbody tr:not(.is-hidden)').length).toEqual(18);
    datagridObj.clearFilter();

    expect(document.body.querySelectorAll('tbody tr:not(.is-hidden)').length).toEqual(19);
  });

  it('Should be able to set children by allowChildExpandOnMatch:false', () => {
    const filter = [{ columnId: 'taskName', operator: 'contains', value: 'hmm' }];
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, {
      columns,
      dataset: data,
      treeGrid: true,
      filterable: true,
      allowChildExpandOnMatch: false
    });
    let expandBtn = document.querySelector('tr:nth-child(1) .datagrid-expand-btn');

    expect(expandBtn.disabled).toBeFalsy();
    expect(document.body.querySelectorAll('tbody tr:not(.is-hidden)').length).toEqual(19);
    datagridObj.applyFilter(filter);
    expandBtn = document.querySelector('tr:nth-child(1) .datagrid-expand-btn');

    expect(expandBtn.disabled).toBeTruthy();
    expect(document.body.querySelectorAll('tbody tr:not(.is-hidden)').length).toEqual(6);
    expect(expandBtn.querySelector('.plus-minus').classList.contains('active')).toBeFalsy();
    datagridObj.clearFilter();
    expandBtn = document.querySelector('tr:nth-child(1) .datagrid-expand-btn');

    expect(expandBtn.disabled).toBeFalsy();
    expect(document.body.querySelectorAll('tbody tr:not(.is-hidden)').length).toEqual(19);
  });
});
