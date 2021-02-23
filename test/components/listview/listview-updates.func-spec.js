import { ListView, LISTVIEW_DEFAULTS } from '../../../src/components/listview/listview';

const listviewHTML = require('../../../app/views/components/listview/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let listviewEl;
let listviewAPI;
let listviewItemEls;
let listviewTemplateScript;
let svgEl;

const newSettings = {
  dataset: [
    { task: 'New Task #1', date: '03/27/2018', desc: 'This is a test task' },
    { task: 'New Task #2', date: '03/27/2018', desc: 'This is another test task' },
  ],
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
    listviewEl.removeAttribute('data-options');
    listviewEl.classList.add('no-init');

    listviewTemplateScript = document.getElementById('task-tmpl').innerHTML;
    newSettings.template = listviewTemplateScript;

    listviewAPI = new ListView(listviewEl);
    listviewItemEls = listviewEl.querySelectorAll('li');
  });

  afterEach(() => {
    listviewAPI.destroy();
    listviewEl.parentNode.removeChild(listviewEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Properly sets default settings', () => {
    expect(listviewAPI.settings).toEqual(LISTVIEW_DEFAULTS);
  });

  it('Can be updated with new settings via javascript', () => {
    listviewAPI.updated(newSettings);
    listviewItemEls = listviewEl.querySelectorAll('li');
    const secondItemDesc = listviewItemEls.item(1).querySelector('.listview-subheading');

    expect(secondItemDesc.innerHTML.trim()).toBe('This is another test task');
  });
});
