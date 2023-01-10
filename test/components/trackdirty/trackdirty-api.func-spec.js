import { Trackdirty } from '../../../src/components/trackdirty/trackdirty';
import { cleanup } from '../../helpers/func-utils';

const dirtyHTML = require('../../../app/views/components/input/example-track-dirty.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

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
    cleanup();
  });

  it('should be defined on jQuery object', () => {
    expect(dirtyObj).toBeTruthy();
  });

  it('should track dirty', () => {
    inputEl.value = 'New Value';
    $(inputEl).trigger('change');

    expect(document.querySelectorAll('.icon-dirty').length).toEqual(1);
  });

  it('should destroy track dirty', () => {
    dirtyObj.destroy();
    inputEl.value = 'New Value';
    $(inputEl).trigger('change');

    expect(document.querySelectorAll('.icon-dirty').length).toEqual(0);
  });

  it('should fire dirty event', () => {
    const callback = jest.fn();
    $(inputEl).on('dirty', callback);

    inputEl.value = 'New Value';
    $(inputEl).trigger('change');

    expect(callback).toHaveBeenCalled();
  });

  it('should fire pristine event', () => {
    const callback = jest.fn();
    $(inputEl).on('pristine', callback);

    inputEl.value = 'New Value';
    $(inputEl).trigger('change');
    inputEl.value = '';
    $(inputEl).trigger('change');

    expect(callback).toHaveBeenCalled();
  });

  it('should fire afterresetdirty event on resetdirty', () => {
    const callback = jest.fn();
    $(inputEl).on('afterresetdirty', callback);

    inputEl.value = 'New Value';
    $(inputEl).trigger('resetdirty');

    expect(callback).toHaveBeenCalled();
  });
});
