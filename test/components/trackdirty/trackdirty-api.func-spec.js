import { Trackdirty } from '../../../src/components/trackdirty/trackdirty';
import { cleanup } from '../../helpers/func-utils';

const dirtyHTML = require('../../../app/views/components/trackdirty/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let inputEl;
let dirtyObj;

describe('Trackdirty API', () => {
  beforeEach(() => {
    inputEl = document.querySelector('#department-code-trackdirty');
    dirtyObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', dirtyHTML);
    inputEl = document.querySelector('#department-code-trackdirty');
    dirtyObj = new Trackdirty(inputEl);
  });

  afterEach(() => {
    dirtyObj.destroy();

    cleanup([
      '.svg-icons',
      '.row'
    ]);
  });

  it('Should be defined on jQuery object', () => {
    expect(dirtyObj).toEqual(jasmine.any(Object));
  });

  it('Should track dirty', () => {
    inputEl.value = 'New Value';
    $(inputEl).trigger('change');

    expect(document.querySelectorAll('.icon-dirty').length).toEqual(1);
  });

  it('Should destroy track dirty', () => {
    dirtyObj.destroy();
    inputEl.value = 'New Value';
    $(inputEl).trigger('change');

    expect(document.querySelectorAll('.icon-dirty').length).toEqual(0);
  });

  it('Should fire dirty event', () => {
    const spyEvent = spyOnEvent(inputEl, 'dirty');

    inputEl.value = 'New Value';
    $(inputEl).trigger('change');

    expect(spyEvent).toHaveBeenTriggered();
  });

  it('Should fire pristine event', () => {
    const spyEvent = spyOnEvent(inputEl, 'pristine');

    inputEl.value = 'New Value';
    $(inputEl).trigger('change');
    inputEl.value = '';
    $(inputEl).trigger('change');

    expect(spyEvent).toHaveBeenTriggered();
  });

  it('Should fire afterresetdirty event on resetdirty', () => {
    const spyEvent = spyOnEvent(inputEl, 'afterresetdirty');

    inputEl.value = 'New Value';
    $(inputEl).trigger('resetdirty');

    expect(spyEvent).toHaveBeenTriggered();
  });
});
