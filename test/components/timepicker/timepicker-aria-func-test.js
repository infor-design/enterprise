/**
 * @jest-environment jsdom
 */
import { TimePicker } from '../../../src/components/timepicker/timepicker';
import { cleanup } from '../../helpers/func-utils';

const timepickerHTML = `<div class="row">
  <div class="twelve columns">
    <div class="field">
      <label for="timepicker-id-1" class="label">Timepicker</label>
      <input id="timepicker-id-1" class="timepicker" type="text" data-init="false"/>
    </div>
  </div>
</div>`;

let timepickerEl;
let timepickerObj;

require('../../../src/components/validation/validation.jquery');

describe('TimePicker ARIA', () => {
  beforeEach(() => {
    timepickerEl = null;
    timepickerObj = null;
    document.body.insertAdjacentHTML('afterbegin', timepickerHTML);
    timepickerEl = document.body.querySelector('.timepicker');
    timepickerEl.classList.add('no-init');
    timepickerObj = new TimePicker(timepickerEl);
  });

  afterEach(() => {
    timepickerObj?.destroy();
    cleanup();
  });

  it('should set ARIA labels', () => {
    expect(document.querySelector('.timepicker[aria-expanded="false"]')).toBeTruthy();

    expect(document.querySelector('.timepicker[role="combobox"]')).toBeTruthy();

    expect(document.querySelector('.icon[aria-hidden="true"]')).toBeTruthy();
  });

  it('should update ARIA labels with popup open', () => {
    timepickerObj.openTimePopup();

    expect(document.querySelector('.timepicker[aria-expanded="true"]')).toBeTruthy();
  });
});
