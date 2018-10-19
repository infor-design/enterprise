import { Datagrid } from '../../../src/components/datagrid/datagrid';
import { Formatters } from '../../../src/components/datagrid/datagrid.formatters';
// import { Editors } from '../../../src/components/datagrid/datagrid.editors';

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
columns.push({ id: 'taskName', name: 'Task', field: 'taskName', expanded: 'expanded', formatter: Formatters.Tree });
columns.push({ id: 'id', name: 'Id', field: 'id' });
columns.push({ id: 'desc', name: 'Description', field: 'desc' });
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
});
