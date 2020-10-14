import { TimePicker } from '../../../src/components/timepicker/timepicker';
import { cleanup } from '../../helpers/func-utils';

const timepickerHTML = require('../../../app/views/components/timepicker/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

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
    expect(document.querySelector('.timepicker[role="textbox"]')).toBeTruthy();
    expect(document.querySelector('.icon[aria-hidden="true"]')).toBeTruthy();
    expect(document.querySelector('.icon[role="presentation"]')).toBeTruthy();
  });
});
