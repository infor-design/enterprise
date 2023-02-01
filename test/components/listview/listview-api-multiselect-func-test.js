/**
 * @jest-environment jsdom
 */
import { ListView } from '../../../src/components/listview/listview';
import { cleanup } from '../../helpers/func-utils';

const listviewHTML = `
<div class="row">
  <div class="twelve columns">
      <h2 class="fieldset-title">ListView  - Readonly / No Select</h2>
  </div>
</div>

<div class="row">
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
let listviewTemplateScript;

const settings = {
  dataset: data,
  selectable: 'multiple',
  template: listviewTemplateScript,
  attributes: [
    { name: 'data-automation-id', value: 'test' }
  ]
};

describe('Listview API', () => {
  beforeEach(() => {
    listviewEl = null;
    listviewAPI = null;

    document.body.insertAdjacentHTML('afterbegin', listviewHTML);

    listviewEl = document.body.querySelector('.listview');
    listviewTemplateScript = document.getElementById('task-tmpl').innerHTML;
    listviewEl.removeAttribute('data-options');
    listviewEl.classList.add('no-init');

    settings.template = listviewTemplateScript;
    listviewAPI = new ListView(listviewEl, settings);
  });

  afterEach(() => {
    listviewAPI.destroy();
    cleanup();
  });

  it('Can select more than one item', () => {
    listviewAPI.select(2);
    listviewAPI.select(3);
    const selectedEls = listviewAPI.getSelected();

    expect(selectedEls.length).toBe(2);
  });

  it('Can get selected nodes from getSelected', () => {
    listviewAPI.select(3);
    listviewAPI.select(4);

    const selectedEls = listviewAPI.getSelected();

    expect(selectedEls[0]).toBeTruthy();
    expect(selectedEls[1]).toBeTruthy();
  });

  it('can set attributes and automation ids', () => {
    const firstItem = listviewEl.querySelectorAll('li')[0];

    expect(firstItem.getAttribute('data-automation-id')).toEqual('test-listview-item-0');
  });
});
