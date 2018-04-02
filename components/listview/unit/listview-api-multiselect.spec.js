import { ListView } from '../listview';

const listviewHTML = require('../example-index.html');
const svg = require('../../icons/svg.html');
const data = require('../../../demoapp/data/inventory-tasks.json');

let listviewEl;
let listviewAPI;
let listviewItemEls; //eslint-disable-line
let listviewTemplateScript;
let svgEl;

const settings = {
  dataset: data,
  selectable: 'multiple',
  template: listviewTemplateScript
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

    listviewItemEls = listviewEl.querySelectorAll('li');
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

  xit('Can retrieve references to more than one selected item', () => {

  });
});
