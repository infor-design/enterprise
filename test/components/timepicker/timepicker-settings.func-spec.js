import { TimePicker } from '../../../src/components/timepicker/timepicker';

const timepickerHTML = require('../../../app/views/components/timepicker/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

const TIMEPICKER_MODES = ['standard', 'range'];

let timepickerEl;
let svgEl;
let timepickerObj;

describe('TimePicker settings', () => {
  beforeEach(() => {
    timepickerEl = null;
    svgEl = null;
    timepickerObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', timepickerHTML);
    timepickerEl = document.body.querySelector('.timepicker');
    svgEl = document.body.querySelector('.svg-icons');
    timepickerEl.classList.add('no-init');
    timepickerObj = new TimePicker(timepickerEl);
  });

  afterEach(() => {
    timepickerObj.destroy();
    timepickerEl.parentNode.removeChild(timepickerEl);
    svgEl.parentNode.removeChild(svgEl);
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
      attributes: null
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
      attributes: null
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
      attributes: null
    };
    timepickerObj.updated(settings);

    expect(timepickerObj.settings).toEqual(settings);
  });

  it('should display the trigger icon', (done) => {
    expect(timepickerEl.nextElementSibling.classList.contains('icon')).toBeTruthy();
    done();
  });
});
