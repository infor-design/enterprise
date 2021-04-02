import { TimePicker } from '../../../src/components/timepicker/timepicker';
import { cleanup } from '../../helpers/func-utils';

const timepickerHTML = require('../../../app/views/components/timepicker/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

const TIMEPICKER_MODES = ['standard', 'range'];

let timepickerEl;
let timepickerObj;

describe('TimePicker settings', () => {
  beforeEach(() => {
    timepickerEl = null;
    timepickerObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', timepickerHTML);
    timepickerEl = document.body.querySelector('.timepicker');
    timepickerEl.classList.add('no-init');
    timepickerObj = new TimePicker(timepickerEl);
  });

  afterEach(() => {
    timepickerObj.destroy();
    cleanup();
  });

  it('Should set settings', () => {
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
      tabbable: true
    };

    expect(timepickerObj.settings).toEqual(settings);
  });

  it('Should update set settings via data', () => {
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
      tabbable: true
    };

    timepickerObj.updated();
    timepickerObj.settings.minuteInterval = 10;
    timepickerObj.settings.secondInterval = 10;

    expect(timepickerObj.settings).toEqual(settings);
  });

  it('Should update set settings via parameter', () => {
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
      tabbable: true
    };
    timepickerObj.updated(settings);

    expect(timepickerObj.settings).toEqual(settings);
  });

  it('should display the trigger icon', (done) => {
    const buttonEl = timepickerEl.nextElementSibling;
    const iconEl = buttonEl.querySelector('.icon');

    expect(buttonEl.classList.contains('trigger')).toBeTruthy();
    expect(iconEl).toBeDefined();
    done();
  });
});
