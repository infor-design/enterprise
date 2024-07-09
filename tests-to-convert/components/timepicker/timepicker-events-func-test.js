/**
 * @jest-environment jsdom
 */
import { TimePicker } from '../../../src/components/timepicker/timepicker';
import { cleanup } from '../../helpers/func-utils';

require('../../../src/components/validation/validation.jquery');

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

describe('TimePicker Events', () => {
  beforeEach(() => {
    timepickerEl = null;
    timepickerObj = null;

    document.body.insertAdjacentHTML('afterbegin', timepickerHTML);
    timepickerEl = document.body.querySelector('.timepicker');
    timepickerObj = new TimePicker(timepickerEl);
  });

  afterEach(() => {
    timepickerObj?.destroy();
    cleanup();
  });

  it('should trigger "change" event', () => {
    const callback = jest.fn();
    $('#timepicker-id-1').on('change', callback);

    timepickerObj.openTimePopup();
    timepickerObj.setTimeOnField();
    timepickerObj.closeTimePopup();

    expect(callback).toHaveBeenCalled();
  });
});
