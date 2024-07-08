/**
 * @jest-environment jsdom
 */
import { SwapList } from '../../../src/components/swaplist/swaplist';
import { cleanup } from '../../helpers/func-utils';

const swaplistHTML = `
<div class="page-container top-padding scrollable" role="main">

<!--This is only needed because it renders first on the server on the first one-->
{{={{{ }}}=}}

  <script id="swaplist-tmpl" type="text/html">
      <ul data-swap-handle=".handle">
        {{#dataset}}
        {{#text}}
          <li
          {{#value}}
            data-value="{{value}}"
          {{/value}}
          {{#selected}}
            selected="selected"
          {{/selected}}
          {{#disabled}}
            class="is-disabled"
          {{/disabled}}
          >
            <span class="handle" focusable="false" aria-hidden="true" role="presentation">&#8286;</span>
            <div class="swaplist-item-content">
              <p>{{text}}</p>
            </div>
          </li>
        {{/text}}
        {{/dataset}}
      </ul>
  </script>

  <div class="row">
    <div class="columns six">

      <div class="swaplist" data-init="false" id="example-swaplist-1">
        <div class="card available">
          <div class="card-header">
            <h2 class="card-title">Available</h2>
            <div class="buttons">
              <button class="btn btn-moveto-selected" type="button">
                <span class="audible">Select</span>
                <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
                  <use href="#icon-right-arrow"></use>
                </svg>
              </button>
            </div>
          </div>
          <div class="card-content">

            <div class="listview-search">
              <label class="audible" for="search-available">Search Available</label>
              <input class="searchfield" placeholder="Search Available" name="searchfield" id="search-available" data-options="{clearable: true}">
            </div>

            <div class="listview"></div>
          </div>
        </div>
        <div class="card selected">
          <div class="card-header">
            <h2 class="card-title">Selected</h2>
            <div class="buttons">
              <button class="btn btn-moveto-left" type="button">
                <span class="audible">Move to left</span>
                <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
                  <use href="#icon-left-arrow"></use>
                </svg>
              </button>
            </div>
          </div>
          <div class="card-content">

            <div class="listview-search">
              <label class="audible" for="search-selected">Search Selected</label>
              <input class="searchfield" placeholder="Search Selected" name="searchfield" id="search-selected" data-options="{clearable: true}">
            </div>

            <div class="listview"></div>
          </div>
        </div>
      </div>

    </div>
  </div>

</div>`;

const dataset = [];
dataset.push({ id: 1, value: 'opt-1', text: 'Option AA' });
dataset.push({ id: '', value: 'opt-2', text: 'Option BB' });
dataset.push({ id: 3, value: 'opt-3', text: 'Option CC' });
dataset.push({ id: 4, value: 'opt-4', text: 'Option DD' });
dataset.push({ id: 5, value: 'opt-5', text: 'Option EE', disabled: true });
dataset.push({ id: 6, value: 'opt-6', text: 'Option FF' });
dataset.push({ value: 'opt-7', text: 'Option GG' });
dataset.push({ id: 8, value: 'opt-8', text: 'Option HH' });
dataset.push({ id: 9, value: 'opt-9', text: 'Option II' });
dataset.push({ id: 10, value: 'opt-10', text: 'Option JJ' });
dataset.push({ id: 11, value: 'opt-11', text: 'Option KK' });
dataset.push({ id: 12, value: 'opt-12', text: 'Option LL' });
dataset.push({ id: 13, value: 'opt-13', text: 'Option MM' });
dataset.push({ id: 14, value: 'opt-14', text: 'Option NN' });

let swaplistEl;
let swaplistObj;

describe('SwapList API', () => {
  beforeEach(() => {
    swaplistEl = null;
    swaplistObj = null;

    document.body.insertAdjacentHTML('afterbegin', swaplistHTML);
    swaplistEl = document.body.querySelector('#example-swaplist-1');
    swaplistObj = new SwapList(swaplistEl, { available: dataset, searchable: true });
  });

  afterEach(() => {
    swaplistObj.destroy();
    cleanup();
  });

  it('should be defined as an object', () => {
    expect(swaplistObj).toBeTruthy();
  });
});
