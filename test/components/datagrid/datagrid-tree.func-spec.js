import { Datagrid } from '../../../src/components/datagrid/datagrid';
import { Formatters } from '../../../src/components/datagrid/datagrid.formatters';
import { Editors } from '../../../src/components/datagrid/datagrid.editors';
import { cleanup } from '../../helpers/func-utils';

const datagridHTML = require('../../../app/views/components/datagrid/example-tree.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');
const originalData = require('../../../app/data/datagrid-sample-data-tree');

let data = [];
require('../../../src/components/locale/cultures/en-US.js');

let datagridEl;
let datagridObj;

// Define Columns for the Grid.
const columns = [];
columns.push({ id: 'taskName', name: 'Task', field: 'taskName', expanded: 'expanded', formatter: Formatters.Tree, filterType: 'text' });
columns.push({ id: 'id', name: 'Id', field: 'id' });
columns.push({ id: 'desc', name: 'Description', field: 'desc', editor: Editors.Input });
columns.push({ id: 'comments', name: 'Comments', field: 'comments', formatter: Formatters.Hyperlink });
columns.push({ id: 'time', name: 'Time', field: 'time' });

describe('Datagrid Tree', () => { //eslint-disable-line
  const Locale = window.Soho.Locale;

  beforeEach(() => {
    datagridEl = null;
    datagridObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', datagridHTML);
    datagridEl = document.body.querySelector('#datagrid');

    Locale.set('en-US');
    data = JSON.parse(JSON.stringify(originalData));

    datagridObj = new Datagrid(datagridEl, { dataset: data, columns });
  });

  afterEach(() => {
    datagridObj.destroy();
    cleanup();
  });

  it('Should be defined as an object', () => {
    expect(datagridObj).toBeTruthy();
  });

  it('Should show Row Activated', (done) => {
    datagridObj.destroy();
    const callback = jest.fn();
    $(datagridEl).on('rendered', callback);

    const duplicateColumns = [...columns];
    duplicateColumns.unshift({ id: 'selectionCheckbox', sortable: false, resizable: false, width: 50, formatter: Formatters.SelectionCheckbox, align: 'center' });
    datagridObj = new Datagrid(datagridEl, {
      columns: duplicateColumns,
      dataset: data,
      selectable: 'mixed',
      treeGrid: true,
      toolbar: { title: 'Tasks (Hierarchical)', results: true, personalize: true }
    });

    expect(callback).toHaveBeenCalled();
    expect(document.body.querySelectorAll('tbody tr.datagrid-tree-parent').length).toEqual(7);
    expect(document.body.querySelectorAll('tbody tr.datagrid-tree-child').length).toEqual(13);
    const callback2 = jest.fn();
    $(datagridEl).on('rowactivated', callback2);

    $(datagridEl).on('rowactivated', (e, args) => {
      expect(args.row).toEqual(5);
      expect(args.item.idx).toEqual(6);
      expect(args.item.node.id).toEqual(6);
      expect(args.item.node.taskName).toEqual('Follow up action with HMM Global');
      done();
    });

    document.body.querySelector('tbody tr[aria-rowindex="6"] td[aria-colindex="2"]').click();

    expect(callback2).toHaveBeenCalled();
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
    filter[0].value = 'more';
    datagridObj.applyFilter(filter);

    expect(document.body.querySelectorAll('tbody tr:not(.is-hidden)').length).toEqual(16);
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
    filter[0].value = 'more';
    datagridObj.applyFilter(filter);

    expect(document.body.querySelectorAll('tbody tr:not(.is-hidden)').length).toEqual(10);
    datagridObj.clearFilter();

    expect(document.body.querySelectorAll('tbody tr:not(.is-hidden)').length).toEqual(19);
  });

  it('Should be able to add child row by api onExpandChildren', (done) => {
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, {
      columns,
      dataset: data,
      treeGrid: true,
      toolbar: { title: 'Tasks (Hierarchical)', results: true, personalize: true },
      onExpandChildren: (args) => {
        const someData = [{
          id: 215,
          escalated: 0,
          taskName: 'Follow up action with Residental Housing',
          desc: 'Contact sales representative with the updated purchase order.',
          comments: 2,
          time: '22:10 PM'
        }];
        const deferred = $.Deferred();
        setTimeout(() => {
          args.grid.addChildren(args.row, someData);
          deferred.resolve();
        }, 10);
        return deferred.promise();
      }
    });

    expect(document.body.querySelectorAll('tbody tr:not(.is-hidden)').length).toEqual(19);
    document.querySelector('tr:nth-child(1) .datagrid-expand-btn').click();

    expect(document.body.querySelectorAll('tbody tr:not(.is-hidden)').length).toEqual(19);
    setTimeout(() => {
      expect(document.body.querySelectorAll('tbody tr:not(.is-hidden)').length).toEqual(23);
      expect(document.querySelector('tr:nth-child(5) td:nth-child(2)').innerText.substr(0, 10).trim()).toEqual('215');
      done();
    }, 300);
  });

  it('Should be able to modify cell by api onCollapseChildren', (done) => {
    const spanSelector = 'td:nth-child(1) .datagrid-cell-wrapper > span';
    const rowSpanSelector = `tr:nth-child(1) ${spanSelector}`;
    const originalText = 'Follow up action with HMM Global';
    const modifyText = 'Some text string';
    datagridObj.destroy();
    datagridObj = new Datagrid(datagridEl, {
      columns,
      dataset: data,
      treeGrid: true,
      toolbar: { title: 'Tasks (Hierarchical)', results: true, personalize: true },
      onCollapseChildren: (args) => {
        const deferred = $.Deferred();
        setTimeout(() => {
          if (args && args.item && args.item[0]) {
            const span = args.item[0].querySelector(spanSelector);
            if (span) {
              span.innerText = modifyText;
            }
          }
          deferred.resolve();
        }, 10);
        return deferred.promise();
      }
    });

    expect(document.body.querySelectorAll('tbody tr:not(.is-hidden)').length).toEqual(19);
    expect(document.querySelector(rowSpanSelector).innerText.trim()).toEqual(originalText);
    document.querySelector('tr:nth-child(1) .datagrid-expand-btn').click();

    expect(document.body.querySelectorAll('tbody tr:not(.is-hidden)').length).toEqual(22);
    setTimeout(() => {
      expect(document.body.querySelectorAll('tbody tr:not(.is-hidden)').length).toEqual(22);
      expect(document.querySelector(rowSpanSelector).innerText.trim()).toEqual(originalText);
      document.querySelector('tr:nth-child(1) .datagrid-expand-btn').click();

      expect(document.body.querySelectorAll('tbody tr:not(.is-hidden)').length).toEqual(22);
      setTimeout(() => {
        expect(document.body.querySelectorAll('tbody tr:not(.is-hidden)').length).toEqual(19);
        expect(document.querySelector(rowSpanSelector).innerText.trim()).toEqual(modifyText);
        done();
      }, 100);
    }, 1);
  });
});
