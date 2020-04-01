import { SwapList } from '../../../src/components/swaplist/swaplist';
import { cleanup } from '../../helpers/func-utils';

const swaplistHTML = require('../../../app/views/components/swaplist/test-beforeswap-with-search.html');
const svg = require('../../../src/components/icons/svg.html');

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

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', swaplistHTML);
    swaplistEl = document.body.querySelector('#example-swaplist-1');
    swaplistObj = new SwapList(swaplistEl, { available: dataset, searchable: true });
  });

  afterEach(() => {
    swaplistObj.destroy();
    cleanup([
      '#swaplist-tmpl',
      '#swaplist-code',
      '.svg-icons',
      '.row',
      '.page-container'
    ]);
  });

  it('Should be defined as an object', () => {
    expect(swaplistObj).toEqual(jasmine.any(Object));
  });

  it('Should be able to trigger beforeswap for searched items', (done) => {
    const spyEvent = spyOnEvent(swaplistEl, 'beforeswap');
    const contaner = swaplistEl.querySelector('.available');
    const searchEl = contaner.querySelector('#search-available');
    const btnMove = contaner.querySelector('.btn-moveto-selected');
    const listviewAPI = $(contaner).find('.listview').data('listview');

    $(swaplistEl).on('beforeswap', (e, args) => {
      expect(args.items[0].text).toEqual('Option DD');
    });

    expect(searchEl).toBeTruthy();
    expect(listviewAPI).toBeTruthy();
    expect(contaner.querySelectorAll('.listview li:not(.hidden)').length).toEqual(14);
    searchEl.value = 'DD';
    listviewAPI.filter(searchEl);

    expect(contaner.querySelectorAll('.listview li:not(.hidden)').length).toEqual(1);
    contaner.querySelector('.listview li:not(.hidden)').click();
    btnMove.click();

    setTimeout(() => {
      expect(spyEvent).toHaveBeenTriggered();
      done();
    }, 1);
  });
});
