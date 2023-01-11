/**
 * @jest-environment jsdom
 */
import { ListView } from '../../../src/components/listview/listview';
import { cleanup } from '../../helpers/func-utils';

const listviewHTML = `<div class="row">
  <div class="four columns">

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Tasks</h2>
        <button class="btn-actions" type="button">
          <span class="audible">Actions</span>
          <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
            <use href="#icon-more"></use>
          </svg>
        </button>
        <ul class="popupmenu">
          <li><a href="#">Add new action item</a></li>
          <li><a href="#">Regular action</a></li>
          <li><a href="#">Individual Action</a></li>
        </ul>
      </div>

      <div class="card-content">
        <div class="listview-search">
          <label class="audible" for="gridfilter">Search</label>
          <input class="searchfield" placeholder="Search My Alerts" name="searchfield" id="gridfilter" data-options="{clearable: true}"/>
        </div>

        <div class="listview" id="search-listview" data-init="false"></div>

        {{={{{ }}}=}}
        <script id="search-tmpl" type="text/html">
            <ul>
              {{#dataset}}
                 <li>
                  <p>{{desc}}</p>
                </li>
              {{/dataset}}
            </ul>
        </script>
      </div>
    </div>

  </div>
</div>

<script id="test-script">
  $('body').on('initialized', function() {
    var listviewEl = $('#search-listview');
    listviewEl.listview({
      template: 'search-tmpl',
      source: '/api/tasks',
      searchable: true,
      listFilterSettings: {
        filterMode: 'contains',
        searchableTextCallback: function(item) {
          return item.desc;
        }
      }
    });
  });
</script>`;

const data = require('../../../app/data/inventory-tasks.json');

let listviewEl;
let listviewAPI;
let listviewSearchEl;
let listviewTemplateScript;

describe('Listview with Searchfield', () => {
  beforeEach(() => {
    listviewEl = null;
    listviewAPI = null;
    listviewSearchEl = null;

    document.body.insertAdjacentHTML('afterbegin', listviewHTML);

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
    cleanup();
  });

  it('Can filter items', () => {
    listviewSearchEl.value = 'TMZ';
    listviewAPI.filter(listviewSearchEl);
    const filteredEls = listviewEl.querySelectorAll('li:not(.hidden)');

    expect(filteredEls.length).toBe(1);

    // Test usage of `highlight.js` here
    const markEls = filteredEls[0].querySelectorAll('mark');

    expect(markEls.length).toBe(1);
    expect(markEls[0].textContent.trim()).toBe('TMZ');
  });
});
