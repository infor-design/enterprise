import { ListBuilder } from '../../../src/components/listbuilder/listbuilder';
import { cleanup } from '../../helpers/func-utils';

const listbuilderHTML = require('../../../app/views/components/listbuilder/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

require('../../../src/components/locale/cultures/en-US.js');

let listbuilderEl;
let listbuilderObj;

// Define dataset
const ds = [];
ds.push({ id: 1, value: 'opt-1', text: 'Argentina' });
ds.push({ id: 2, value: 'opt-2', text: 'Belize' });
ds.push({ id: 3, value: 'opt-3', text: 'Colombia' });
ds.push({ id: 4, value: 'opt-4', text: 'Dominican Republic' });
ds.push({ id: 5, value: 'opt-5', text: 'Ecuador', disabled: true });
ds.push({ id: 6, value: 'opt-6', text: 'France' });
ds.push({ id: 7, value: 'opt-7', text: 'Germany' });
ds.push({ id: 8, value: 'opt-8', text: 'Hong Kong' });
ds.push({ id: 9, value: 'opt-9', text: 'India' });
ds.push({ id: 10, value: 'opt-10', text: 'Japan' });
ds.push({ id: 11, value: 'opt-11', text: 'Kuwait' });
ds.push({ id: 12, value: 'opt-12', text: 'Libya' });

describe('ListBuilder API', () => {
  beforeEach(() => {
    listbuilderEl = null;
    listbuilderObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', listbuilderHTML);
    listbuilderEl = document.body.querySelector('#example-listbuilder');
    listbuilderObj = new ListBuilder(listbuilderEl, { dataset: [...ds] });
  });

  afterEach(() => {
    listbuilderObj.destroy();
    cleanup(['#example-listbuilder-container', '.row', '.svg-icons', '#listbuilder-script', '#listbuilder-tmpl']);
  });

  it('Should be defined as an object', () => {
    expect(listbuilderObj).toEqual(jasmine.any(Object));
  });

  it('Should destroy listbuilder', () => {
    listbuilderObj.destroy();

    expect(document.body.querySelector('.listbuilder .listview ul')).toBeFalsy();
  });

  it('Should be enabled/disabled', () => {
    listbuilderObj.disable();

    expect(document.body.querySelector('#example-listbuilder.is-disabled')).toBeTruthy();
    listbuilderObj.enable();

    expect(document.body.querySelector('#example-listbuilder.is-disabled')).toBeFalsy();
  });

  it('Should be updated with new settings', () => {
    const btnAdd = document.body.querySelector('button[data-action="add"]');
    const btnEdit = document.body.querySelector('button[data-action="edit"]');
    btnAdd.setAttribute('data-action', 'test-add');
    btnEdit.setAttribute('data-action', 'test-edit');
    const newBtnAdd = document.body.querySelector('button[data-action="test-add"]');
    const newBtnEdit = document.body.querySelector('button[data-action="test-edit"]');
    const newSettings = {
      btnAdd: 'test-add',
      btnEdit: 'test-edit'
    };
    listbuilderObj.updated(newSettings);

    expect(listbuilderObj.settings.btnAdd).toEqual(newBtnAdd);
    expect(listbuilderObj.settings.btnEdit).toEqual(newBtnEdit);
  });

  it('Should extract node data', () => {
    const node = $(document.body.querySelector('.listbuilder li[role="option"]:nth-child(2)'));
    const data = { node, text: 'Belize', value: 'opt-2' };

    expect(listbuilderObj.extractNodeData(node)).toEqual(data);
  });

  it('Should get data from dataset by node', () => {
    const node = $(document.body.querySelector('.listbuilder li[role="option"]:nth-child(2)'));
    const data = { index: 1, data: { node, id: 2, value: 'opt-2', text: 'Belize' } };

    expect(listbuilderObj.getDataByNode(node)).toEqual(data);
  });

  it('Should move an array element position', () => {
    const arr = ['one', 'two', 'three', 'four', 'five'];
    listbuilderObj.arrayIndexMove(arr, 1, 2);

    expect(arr).toEqual(['one', 'three', 'two', 'four', 'five']);
  });

  it('Should update attributes', () => {
    const item = document.body.querySelector('.listbuilder li[role="option"]:nth-child(2)');

    expect(item.getAttribute('aria-posinset')).toEqual('2');
    expect(item.getAttribute('aria-setsize')).toEqual('12');
    item.setAttribute('aria-posinset', 'test');
    item.setAttribute('aria-setsize', 'test');

    expect(item.getAttribute('aria-posinset')).toEqual('test');
    expect(item.getAttribute('aria-setsize')).toEqual('test');
    listbuilderObj.updateAttributes();

    expect(item.getAttribute('aria-posinset')).toEqual('2');
    expect(item.getAttribute('aria-setsize')).toEqual('12');
  });

  it('Should update dataset', () => {
    expect(listbuilderObj.settings.dataset).toEqual(ds);
    expect(listbuilderObj.settings.dataset.length).toEqual(12);
    expect(document.body.querySelectorAll('.listbuilder li[role="option"]').length).toEqual(12);
    const newDs = [
      { value: 'opt-updated-1', text: 'Updated item 1' },
      { value: 'opt-updated-2', text: 'Updated item 2' },
      { value: 'opt-updated-3', text: 'Updated item 3' }
    ];
    listbuilderObj.updateDataset(newDs);

    expect(listbuilderObj.settings.dataset).toEqual(newDs);
    expect(listbuilderObj.settings.dataset.length).toEqual(3);
    expect(document.body.querySelectorAll('.listbuilder li[role="option"]').length).toEqual(3);
  });

  it('Should get an item from list', () => {
    let item = $(document.body.querySelector('.listbuilder li[role="option"]:nth-child(3)'));

    expect(listbuilderObj.getListItem(2)).toEqual(item);
    item = $(document.body.querySelector('.listbuilder li[role="option"]:nth-child(1)'));

    expect(listbuilderObj.getListItem('first')).toEqual(item);
    item = $(document.body.querySelector('.listbuilder li[role="option"]:nth-child(12)'));

    expect(listbuilderObj.getListItem('last')).toEqual(item);
  });

  it('Should add item', () => {
    expect(document.body.querySelectorAll('.listbuilder li[role="option"]').length).toEqual(12);
    const spyEvent = spyOnEvent(listbuilderObj.element, 'afteradd');
    listbuilderObj.addItem();

    expect(spyEvent).toHaveBeenTriggered();
    expect(document.body.querySelectorAll('.listbuilder li[role="option"]').length).toEqual(13);
  });

  it('Should move up item', () => {
    const spyEvent = spyOnEvent(listbuilderObj.element, 'aftergoup');

    expect(document.body.querySelector('.listbuilder li[role="option"]:nth-child(2) .item-content').innerText.trim()).toEqual('Belize');
    document.body.querySelector('.listbuilder li[role="option"]:nth-child(2)').click();
    listbuilderObj.moveItemUp();

    expect(spyEvent).toHaveBeenTriggered();
    expect(document.body.querySelector('.listbuilder li[role="option"]:nth-child(2) .item-content').innerText.trim()).toEqual('Argentina');
  });

  it('Should move down item', () => {
    const spyEvent = spyOnEvent(listbuilderObj.element, 'aftergodown');

    expect(document.body.querySelector('.listbuilder li[role="option"]:nth-child(2) .item-content').innerText.trim()).toEqual('Belize');
    document.body.querySelector('.listbuilder li[role="option"]:nth-child(2)').click();
    listbuilderObj.moveItemDown();

    expect(spyEvent).toHaveBeenTriggered();
    expect(document.body.querySelector('.listbuilder li[role="option"]:nth-child(2) .item-content').innerText.trim()).toEqual('Colombia');
  });

  it('Should delete item', () => {
    const spyEvent = spyOnEvent(listbuilderObj.element, 'afterdelete');

    expect(document.body.querySelectorAll('.listbuilder li[role="option"]').length).toEqual(12);
    document.body.querySelector('.listbuilder li[role="option"]:nth-child(2)').click();
    listbuilderObj.deleteItem();

    expect(spyEvent).toHaveBeenTriggered();
    expect(document.body.querySelectorAll('.listbuilder li[role="option"]').length).toEqual(11);
  });
});
