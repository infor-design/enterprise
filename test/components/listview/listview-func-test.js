/**
 * @jest-environment jsdom
 */
import { ListView } from '../../../src/components/listview/listview';
import { cleanup } from '../../helpers/func-utils';

const listviewHTML = `<div class="row">
  <div class="one-third column">
    <div class="card" >
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
        <div class="listview" id="task-listview" data-options="{'source': '{{basepath}}api/inventory-tasks', 'template': 'task-tmpl', 'selectable': 'false', 'attributes': [ { 'name': 'data-automation-id', 'value': 'test' } ] }"></div>
      </div>
    </div>

  </div>
</div>

{{={{{ }}}=}}
<script id="task-tmpl" type="text/html">
  <ul>
    {{#dataset}}
      {{#disabled}}
        <li class="is-disabled">
      {{/disabled}}
      {{^disabled}}
        <li>
      {{/disabled}}
        <p class="listview-heading">Task #{{task}}</p>
        <p class="listview-subheading">{{desc}} </p>
        <p class="listview-micro">Due: {{date}}</p>
      </li>
    {{/dataset}}
  </ul>
</script>`;
const data = require('../../../app/data/inventory-tasks.json');

let listviewEl;
let listviewAPI;
let listviewItemEls;
let listviewTemplateScript;

describe('Listview API', () => {
  beforeEach(() => {
    listviewEl = null;
    listviewAPI = null;

    document.body.insertAdjacentHTML('afterbegin', listviewHTML);

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
    cleanup();
  });

  it('Can be invoked', () => {
    expect(listviewAPI).toBeTruthy();
  });

  it('Can be disabled and re-enabled', () => {
    listviewAPI.disable();

    expect(listviewEl.classList.contains('is-disabled')).toBeTruthy();

    listviewAPI.enable();

    expect(listviewEl.className.indexOf('is-disabled')).toEqual(-1);
  });

  it('Properly detects the total number of listview items', () => {
    const ds = listviewAPI.settings.dataset;
    const totals = listviewAPI.getTotals(ds);

    expect(totals).toBeTruthy();
    expect(totals.count).toBeTruthy();
    expect(totals.count).toEqual(12);
  });

  it('Can select a list item with a numeric index', () => {
    const index = 0;
    listviewAPI.select(index);
    const selectedEl = listviewAPI.getSelected();

    expect(listviewItemEls.item(index)).toEqual(selectedEl[0]);
  });

  it('Can select a list item with an element reference', () => {
    const index = 2;
    const thirdEl = listviewEl.querySelectorAll('li').item(index);
    listviewAPI.select($(thirdEl));
    const selectedEl = listviewAPI.getSelected();

    expect(listviewItemEls.item(index)).toEqual(selectedEl[0]);
  });

  // Note: currently checks $.data()
  it('Can be destroyed', () => {
    listviewAPI.destroy();

    expect($(listviewEl).data('listview')).toBeFalsy();
  });
});
