import { ListView } from '../../../src/components/listview/listview';

const listviewHTML = require('../../../app/views/components/listview/example-search.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');
const data = require('../../../app/data/inventory-tasks.json');

let listviewEl;
let listviewAPI;
let listviewSearchEl;
let listviewTemplateScript;
let svgEl;

describe('Listview with Searchfield', () => {
  beforeEach(() => {
    listviewEl = null;
    listviewAPI = null;
    listviewSearchEl = null;
    svgEl = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', listviewHTML);

    svgEl = document.body.querySelector('.svg-icons');
    listviewEl = document.body.querySelector('.listview');
    listviewTemplateScript = document.getElementById('search-tmpl').innerHTML;
    listviewEl.removeAttribute('data-options');
    listviewEl.classList.add('no-init');

    listviewAPI = new ListView(listviewEl, {
      dataset: data,
      searchable: true,
      template: listviewTemplateScript,
    });

    listviewSearchEl = document.querySelector('#gridfilter');
  });

  afterEach(() => {
    listviewAPI.destroy();
    svgEl.parentNode.removeChild(svgEl);
    listviewEl.parentNode.removeChild(listviewEl);
  });

  it('Can filter items', () => {
    listviewSearchEl.value = 'TMZ';
    listviewAPI.filter(listviewSearchEl);
    const filteredEls = listviewEl.querySelectorAll('li:not(.hidden)');

    expect(filteredEls.length).toBe(1);

    // Test usage of `highlight.js` here
    const markEls = filteredEls[0].querySelectorAll('mark');

    expect(markEls.length).toBe(1);
    expect(markEls[0].innerText).toBe('TMZ');
  });
});
