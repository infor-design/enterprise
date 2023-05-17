/**
 * @jest-environment jsdom
 */
import { ListView, LISTVIEW_DEFAULTS } from '../../../src/components/listview/listview';
import { cleanup } from '../../helpers/func-utils';

const listviewHTML = `<div class="row">
  <div class="one-third column">
    <div class="card" >
      <div class="card-header">
        <h2 class="card-title">Tasks</h2>
        <button class="btn-actions" type="button">
          <span class="audible">Actions</span>
          <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
            <use href="#icon-vertical-ellipsis"></use>
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

let listviewEl;
let listviewAPI;
let listviewItemEls;
let listviewTemplateScript;

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

    document.body.insertAdjacentHTML('afterbegin', listviewHTML);

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
    cleanup();
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
