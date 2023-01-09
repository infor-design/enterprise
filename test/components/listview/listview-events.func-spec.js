import { ListView } from '../../../src/components/listview/listview';
import { cleanup } from '../../helpers/func-utils';

const listviewHTML = require('../../../app/views/components/listview/example-singleselect.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');
const data = require('../../../app/data/periods');

let listviewEl;
let listviewAPI;

describe('Listview Events', () => {
  beforeEach(() => {
    listviewEl = null;
    listviewAPI = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
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

  it('Should be able to single select', (done) => {
    listviewAPI.destroy();
    listviewAPI = new ListView(listviewEl, { dataset: data, template: 'period-end-tmpl', selectable: 'single' });

    const spyEvent = spyOnEvent($(listviewEl), 'selected');
    $(listviewEl).on('selected', (e, args) => {
      expect(args.selectedData[0].id).toEqual(3);
      expect(args.selectedData[0].city).toEqual('Vancouver');
      done();
    });

    const liEl = listviewEl.querySelectorAll('li')[2];
    liEl.click();

    expect(spyEvent).toHaveBeenCalled();
    $(listviewEl).off('selected');
    listviewAPI.deselect($(liEl));
  });

  it('Should be able to multi select', (done) => {
    listviewAPI.destroy();
    listviewAPI = new ListView(listviewEl, { dataset: data, template: 'period-end-tmpl', selectable: 'multiple' });

    const spyEvent = spyOnEvent($(listviewEl), 'selected');
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

    expect(spyEvent).toHaveBeenCalled();
    $(listviewEl).off('selected');

    listviewAPI.deselect($(liEl));
    listviewAPI.deselect($(liEl2));
  });

  it('Should be fire rendered on updated with no params', () => {
    listviewAPI = new ListView(listviewEl, { dataset: data, template: 'period-end-tmpl', selectable: 'multiple' });

    const spyEvent = spyOnEvent($(listviewEl), 'rendered');
    listviewAPI.updated();

    expect(spyEvent).toHaveBeenCalled();
  });

  it('Should be fire rendered on updated with new settings', () => {
    listviewAPI = new ListView(listviewEl, { dataset: data, template: 'period-end-tmpl', selectable: 'multiple' });

    const spyEvent = spyOnEvent($(listviewEl), 'rendered');
    listviewAPI.updated({ dataset: data });

    expect(spyEvent).toHaveBeenCalled();
  });
});
