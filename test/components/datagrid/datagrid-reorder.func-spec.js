import { Datagrid } from '../../../src/components/datagrid/datagrid';
import { Formatters } from '../../../src/components/datagrid/datagrid.formatters';

const datagridHTML = require('../../../app/views/components/datagrid/test-reorder-multiselect.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

require('../../../src/components/locale/cultures/en-US.js');

let datagridEl;
let svgEl;
let datagridObj;

let data = [];
const originalData = [
  { code: 'cs_CZ', position: 1 },
  { code: 'es_MX', position: 2 },
  { code: 'ko_KR', position: 3 },
  { code: 'fr_CA', position: 4 },
  { code: 'en_GB', position: 5 },
  { code: 'bo-CN', position: 6 },
  { code: 'cu-RU', position: 7 },
  { code: 'da-DK', position: 8 },
  { code: 'de-AT', position: 9 },
  { code: 'dz-BT', position: 10 }
];

const columns = [];
columns.push({ id: 'rowReorder', sortable: false, resizable: false, formatter: Formatters.RowReorder, align: 'center' });
columns.push({ id: 'selectionCheckbox', sortable: false, resizable: false, formatter: Formatters.SelectionCheckbox, align: 'center' });
columns.push({ id: 'position', name: 'Position', field: 'position', sortable: false, formatter: Formatters.Readonly });
columns.push({ id: 'code', name: 'Locale Code', field: 'code', sortable: false });

describe('Datagrid Row Reorder API', () => {
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
    data = originalData.slice();

    datagridObj = new Datagrid(datagridEl, {
      columns,
      dataset: data,
      editable: true,
      rowReorder: true,
      selectable: 'multiple',
      clickToSelect: false
    });
  });

  afterEach(() => {
    datagridObj.destroy();
    datagridEl.parentNode.removeChild(datagridEl);
    svgEl.parentNode.removeChild(svgEl);

    const rowEl = document.body.querySelector('.row');
    rowEl.parentNode.removeChild(rowEl);
  });

  it('Should be able to reorder a row', (done) => {
    const spyEvent = spyOnEvent($(datagridEl), 'rowreorder');
    $(datagridEl).on('rowreorder', (e, args) => {
      expect(args.startIndex).toEqual(0);
      expect(args.endIndex).toEqual(1);
      done();
    });

    datagridObj.reorderRow(0, 1);

    expect(document.querySelector('tr:nth-child(1) td:nth-child(3)').innerText.trim()).toEqual('2');
    expect(document.querySelector('tr:nth-child(2) td:nth-child(3)').innerText.trim()).toEqual('1');

    expect(spyEvent).toHaveBeenTriggered();
    $(datagridEl).off('rowreorder');

    datagridObj.reorderRow(1, 0);

    expect(document.querySelector('tr:nth-child(1) td:nth-child(3)').innerText.trim()).toEqual('1');
    expect(document.querySelector('tr:nth-child(2) td:nth-child(3)').innerText.trim()).toEqual('2');
  });

  it('Should be able to select all and remove all', (done) => {
    datagridObj.selectAllRows();
    datagridObj.removeSelected();

    setTimeout(() => {
      expect(document.querySelectorAll('tbody tr').length).toEqual(0);
      datagridObj.updateDataset(data);
      done();
    });
  });

  it('Should be able to select drag and remove', () => {
    datagridObj.selectRow(1);
    datagridObj.reorderRow(1, 0);
    datagridObj.removeSelected();

    expect(document.querySelectorAll('tbody tr').length).toEqual(9);

    datagridObj.selectRow(1);
    datagridObj.reorderRow(0, 1);
    datagridObj.removeSelected();

    expect(document.querySelectorAll('tbody tr').length).toEqual(8);
  });
});
