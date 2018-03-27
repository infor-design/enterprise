import { ListView } from '../listview';

const listviewHTML = require('../example-index.html');
const svg = require('../../icons/svg.html');
const data = require('../../../demoapp/data/inventory-tasks.json');

let listviewEl;
let listviewAPI;
let listviewItemEls;
let listviewTemplateScript;
let svgEl;

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

    listviewAPI = new ListView(listviewEl, {
      dataset: data,
      template: listviewTemplateScript
    });

    listviewItemEls = listviewEl.querySelectorAll('li');
  });

  afterEach(() => {
    listviewAPI.destroy();
    listviewEl.remove();
    svgEl.remove();
  });

  it('Can be invoked', () => {
    expect(listviewAPI).toEqual(jasmine.any(Object));
  });

  it('Can select a list item with a numeric index', () => {
    const index = 0;
    listviewAPI.select(index);

    const selectedEl = listviewAPI.getSelected();

    expect(listviewItemEls.item(index)).toEqual(selectedEl[0]);
  });

  xit('Can select a list item with an element reference', () => {

  });

  xit('Can select multiple list items', () => {

  });
});
