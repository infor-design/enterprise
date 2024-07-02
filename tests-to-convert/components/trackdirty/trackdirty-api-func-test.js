/**
 * @jest-environment jsdom
 */
import { Trackdirty } from '../../../src/components/trackdirty/trackdirty';
import { cleanup } from '../../helpers/func-utils';

const dirtyHTML = `
<div class="row">
  <div class="twelve columns">
    <div class="field">
      <label for="department-code-trackdirty">Text box</label>
      <input type="text" placeholder="Dirty Tracking" data-trackdirty="true" id="department-code-trackdirty" name="department-code-trackdirty"/>
    </div>
  </div>
</div>`;

let inputEl;
let dirtyObj;

describe('Trackdirty API', () => {
  beforeEach(() => {
    inputEl = document.querySelector('#department-code-trackdirty');
    dirtyObj = null;
    document.body.insertAdjacentHTML('afterbegin', dirtyHTML);
    inputEl = document.querySelector('#department-code-trackdirty');
    dirtyObj = new Trackdirty(inputEl);
  });

  afterEach(() => {
    dirtyObj?.destroy();
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
