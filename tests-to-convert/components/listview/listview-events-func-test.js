/**
 * @jest-environment jsdom
 */
import { ListView } from '../../../src/components/listview/listview';
import { cleanup } from '../../helpers/func-utils';

const listviewHTML = `<div class="row">
  <div class="twelve columns">
      <h2 class="fieldset-title">ListView  - Single Row Select &amp; Contextual Toolbar</h2>
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
        <div class="contextual-toolbar toolbar is-hidden">
          <div class="buttonset">
            <button class="btn-tertiary" disabled title="Assign Selected Items" type="button">Assign</button>
            <button class="btn-tertiary" disabled title="Remove Selected Items" type="button">Remove</button>
          </div>
        </div>
        <div class="listview" id="period-end" data-options="{template: 'period-end-tmpl', selectable: 'single', source: '{{basepath}}api/periods' }"></div>
      </div>
    </div>

    {{={{{ }}}=}}

    <script id="period-end-tmpl" type="text/html">
      <ul>
        {{#dataset}}
          {{#alert}}
            <li class="{{alertClass}}">
              <p class="listview-heading">{{city}}</p>
              <p class="listview-subheading">{{location}}</p>
              <div class="l-pull-right error">
                  <svg class="icon icon-{{alertClass}}" focusable="false" aria-hidden="true" role="presentation">
                    <use href="#icon-{{alertClass}}"/>
                  </svg>
                  <span class="days">{{daysLeft}}</span><span class="day-sign">d</span>
                  <span class="hours">{{hoursLeft}}</span><span class="hour-sign">h</span>
              </div>
            </li>
          {{/alert}}
          {{^alert}}
            <li>
              <p class="listview-heading">{{city}}</p>
              <p class="listview-subheading">{{location}}</p>

              <div class="l-pull-right">
                <span class="days">{{daysLeft}}</span><span class="day-sign">d</span>
                <span class="hours">{{hoursLeft}}</span><span class="hour-sign">h</span>
              </div>
            </li>
          {{/alert}}
        {{/dataset}}
      </ul>
    </script>

  </div>
</div>

<script>
  $('#period-end').on('selected', function (e, args) {
    console.log(args.selectedData);
  });
</script>`;

const data = require('../../../app/data/periods');

let listviewEl;
let listviewAPI;

describe('Listview Events', () => {
  beforeEach(() => {
    listviewEl = null;
    listviewAPI = null;

    document.body.insertAdjacentHTML('afterbegin', listviewHTML);

    listviewEl = document.body.querySelector('.listview');
    listviewEl.removeAttribute('data-options');
    listviewEl.classList.add('no-init');

    listviewAPI = new ListView(listviewEl);
  });

  afterEach(() => {
    listviewAPI.destroy();
    cleanup();
  });

  it('should be able to single select', (done) => {
    listviewAPI.destroy();
    listviewAPI = new ListView(listviewEl, { dataset: data, template: 'period-end-tmpl', selectable: 'single' });

    const callback = jest.fn();
    $(listviewEl).on('selected', callback);

    $(listviewEl).on('selected', (e, args) => {
      expect(args.selectedData[0].id).toEqual(3);
      expect(args.selectedData[0].city).toEqual('Vancouver');
      done();
    });

    const liEl = listviewEl.querySelectorAll('li')[2];
    liEl.click();

    expect(callback).toHaveBeenCalled();
    $(listviewEl).off('selected');
    listviewAPI.deselect($(liEl));
  });

  it('should be able to multi select', (done) => {
    listviewAPI.destroy();
    listviewAPI = new ListView(listviewEl, { dataset: data, template: 'period-end-tmpl', selectable: 'multiple' });
    const callback = jest.fn();
    $(listviewEl).on('selected', callback);

    const liEl = listviewEl.querySelectorAll('li')[2];
    liEl.click();

    $(listviewEl).on('selected', (e, args) => {
      expect(args.selectedData[0].id).toEqual(3);
      expect(args.selectedData[0].city).toEqual('Vancouver');
      expect(args.selectedData[1].id).toEqual(4);
      expect(args.selectedData[1].city).toEqual('Tokyo');
      done();
    });
    const liEl2 = listviewEl.querySelectorAll('li')[3];
    liEl2.click();

    expect(callback).toHaveBeenCalled();
    $(listviewEl).off('selected');

    listviewAPI.deselect($(liEl));
    listviewAPI.deselect($(liEl2));
  });

  it('should be fire rendered on updated with no params', () => {
    listviewAPI = new ListView(listviewEl, { dataset: data, template: 'period-end-tmpl', selectable: 'multiple' });
    const callback = jest.fn();
    $(listviewEl).on('rendered', callback);

    listviewAPI.updated();

    expect(callback).toHaveBeenCalled();
  });

  it('should be fire rendered on updated with new settings', () => {
    listviewAPI = new ListView(listviewEl, { dataset: data, template: 'period-end-tmpl', selectable: 'multiple' });
    const callback = jest.fn();
    $(listviewEl).on('rendered', callback);

    listviewAPI.updated({ dataset: data });

    expect(callback).toHaveBeenCalled();
  });
});
