import { ListView } from '../../../src/components/listview/listview';
import { cleanup } from '../../helpers/func-utils';

const listviewHTML = require('../../../app/views/components/listview/test-legacy-dom-list.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let listviewEl;
let listviewAPI;

describe('Listview API (Legacy DOM List)', () => {
  beforeEach(() => {
    listviewEl = null;
    listviewAPI = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', listviewHTML);

    listviewEl = document.body.querySelector('.listview');
    listviewEl.classList.add('no-init');

    listviewAPI = new ListView(listviewEl);
  });

  afterEach(() => {
    listviewAPI.destroy();
    cleanup([
      '.svg-icons',
      '.listview',
      '.row'
    ]);
  });

  it('Can be invoked', () => {
    expect(listviewAPI).toEqual(jasmine.any(Object));
  });

  it('Properly converts a DOM-based list to an Array', () => {
    const listviewItemEls = listviewEl.querySelectorAll('li');

    expect(listviewAPI.settings.dataset.length).toEqual(23);
    expect(listviewAPI.settings.pagesize).toEqual(8);
    expect(listviewItemEls.length).toEqual(8);
  });
});
