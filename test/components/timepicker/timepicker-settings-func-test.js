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

require('../../../src/components/validation/validation.jquery');

const TIMEPICKER_MODES = ['standard', 'range'];

let timepickerEl;
let timepickerObj;

describe('TimePicker settings', () => {
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

  it('should set settings', () => {
    const settings = {
      locale: null,
      language: null,
      timeFormat: 'HH:mm:ss',
      minuteInterval: 5,
      secondInterval: 5,
      mode: TIMEPICKER_MODES[0],
      roundToInterval: true,
      parentElement: null,
      returnFocus: true,
      attributes: null,
      tabbable: true,
      hourRange: [0, 24]
    };

    expect(timepickerObj.settings).toEqual(settings);
  });

  it('should update set settings via data', () => {
    const settings = {
      locale: null,
      language: null,
      timeFormat: 'HH:mm:ss',
      minuteInterval: 10,
      secondInterval: 10,
      mode: TIMEPICKER_MODES[0],
      roundToInterval: true,
      parentElement: null,
      returnFocus: true,
      attributes: null,
      tabbable: true,
      hourRange: [0, 24]
    };

    timepickerObj.updated();
    timepickerObj.settings.minuteInterval = 10;
    timepickerObj.settings.secondInterval = 10;

    expect(timepickerObj.settings).toEqual(settings);
  });

  it('should update set settings via parameter', () => {
    const settings = {
      locale: null,
      language: null,
      timeFormat: 'HH:mm:ss',
      minuteInterval: 10,
      secondInterval: 10,
      mode: TIMEPICKER_MODES[0],
      roundToInterval: true,
      parentElement: null,
      returnFocus: true,
      attributes: null,
      tabbable: true,
      hourRange: [0, 24]
    };
    timepickerObj.updated(settings);

    expect(timepickerObj.settings).toEqual(settings);
  });

  it('should display the trigger icon', (done) => {
    const buttonEl = timepickerEl.nextElementSibling;
    const iconEl = buttonEl.querySelector('.icon');

    expect(buttonEl.classList.contains('trigger')).toBeTruthy();
    expect(iconEl).toBeTruthy();
    done();
  });
});
