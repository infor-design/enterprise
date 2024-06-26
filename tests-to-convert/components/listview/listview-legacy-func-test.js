/**
 * @jest-environment jsdom
 */
import { ListView } from '../../../src/components/listview/listview';
import { cleanup } from '../../helpers/func-utils';

const listviewHTML = `
<div class="row">
  <div class="six columns">

    <ul class="paginated listview" data-pagesize="8">
      <li>Item One</li>
      <li>Item Two</li>
      <li>Item Three</li>
      <li>Item Four</li>
      <li>Item Five</li>
      <li>Item Six</li>
      <li>Item Seven</li>
      <li>Item Eight</li>
      <li>Item Nine</li>
      <li>Item Ten</li>
      <li>Item Eleven</li>
      <li>Item Twelve</li>
      <li>Item Thirteen</li>
      <li>Item Fourteen</li>
      <li>Item Fifteen</li>
      <li>Item Sixteen</li>
      <li>Item Seventeen</li>
      <li>Item Eighteen</li>
      <li>Item Nineteen</li>
      <li>Item Twenty</li>
      <li>Item Twenty One</li>
      <li>Item Twenty Two</li>
      <li>Item Twenty Three</li>
    </ul>

  </div>

</div>`;

let listviewEl;
let listviewAPI;

describe('Listview API (Legacy DOM List)', () => {
  beforeEach(() => {
    listviewEl = null;
    listviewAPI = null;

    document.body.insertAdjacentHTML('afterbegin', listviewHTML);

    listviewEl = document.body.querySelector('.listview');
    listviewEl.classList.add('no-init');

    listviewAPI = new ListView(listviewEl);
  });

  afterEach(() => {
    listviewAPI.destroy();
    cleanup();
  });

  it('Can be invoked', () => {
    expect(listviewAPI).toBeTruthy();
  });

  it('Properly converts a DOM-based list to an Array', () => {
    const listviewItemEls = listviewEl.querySelectorAll('li');

    expect(listviewAPI.settings.dataset.length).toEqual(23);
    expect(listviewAPI.settings.pagesize).toEqual(8);
    expect(listviewItemEls.length).toEqual(8);
  });
});
