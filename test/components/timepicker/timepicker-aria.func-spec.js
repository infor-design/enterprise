import { TimePicker } from '../../../src/components/timepicker/timepicker';
import { cleanup } from '../../helpers/func-utils';

const timepickerHTML = require('../../../app/views/components/timepicker/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let timepickerEl;
let timepickerObj;

describe('TimePicker ARIA', () => {
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
    cleanup([
      '.svg-icons',
      '#timepicker-popup',
      '.popover',
      '.row'
    ]);
  });

  it('Should set ARIA labels', () => {
    expect(document.querySelector('.timepicker[aria-expanded="false"]'))
      .withContext('Timepicker Input `aria-expanded="false"`').toBeTruthy();
    expect(document.querySelector('.timepicker[role="combobox"]'))
      .withContext('Timepicker Input `combobox` role').toBeTruthy();
    expect(document.querySelector('.icon[aria-hidden="true"]'))
      .withContext('Timepicker trigger icon `aria-hidden`').toBeTruthy();
    expect(document.querySelector('.icon[role="button"]'))
      .withContext('Timepicker trigger icon `button` role').toBeTruthy();
  });

  it('Should update ARIA labels with popup open', () => {
    timepickerObj.openTimePopup();

    expect(document.querySelector('.timepicker[aria-expanded="true"]'))
      .withContext('Timepicker `aria-expanded="true"`').toBeTruthy();
  });
});
