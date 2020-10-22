import { ListView } from '../../../src/components/listview/listview';

const listviewHTML = require('../../../app/views/components/listview/example-index.html');
const svg = require('../../../src/components/icons/svg.html');
const data = require('../../../app/data/inventory-tasks.json');

let listviewEl;
let listviewAPI;
let listviewTemplateScript;
let svgEl;

const settings = {
  dataset: data,
  selectable: 'multiple',
  template: listviewTemplateScript,
  attributes: [
    { name: 'data-automation-id', value: 'test' }
  ]
};

describe('Listview API', () => {
  beforeEach(() => {
    listviewEl = null;
    listviewAPI = null;
    svgEl = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', listviewHTML);

    svgEl = document.body.querySelector('.svg-icons');
    listviewEl = document.body.querySelector('.listview');
    listviewTemplateScript = document.getElementById('task-tmpl').innerHTML;
    listviewEl.removeAttribute('data-options');
    listviewEl.classList.add('no-init');

    settings.template = listviewTemplateScript;
    listviewAPI = new ListView(listviewEl, settings);
  });

  afterEach(() => {
    listviewAPI.destroy();
    svgEl.parentNode.removeChild(svgEl);
    listviewEl.parentNode.removeChild(listviewEl);
  });

  it('Can select more than one item', () => {
    listviewAPI.select(2);
    listviewAPI.select(3);
    const selectedEls = listviewAPI.getSelected();

    expect(selectedEls.length).toBe(2);
  });

  it('Can get selected nodes from getSelected', () => {
    listviewAPI.select(3);
    listviewAPI.select(4);

    const selectedEls = listviewAPI.getSelected();

    expect(selectedEls[0]).toBeTruthy();
    expect(selectedEls[1]).toBeTruthy();
  });

  fit('can set attributes and automation ids', () => {
    const firstItem = listviewEl.querySelectorAll('li')[0];

    expect(firstItem.getAttribute('data-automation-id')).toEqual('test-listview-item-0');
  });
});
