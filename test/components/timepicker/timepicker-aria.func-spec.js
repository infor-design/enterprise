import { TimePicker } from '../../../src/components/timepicker/timepicker';
import { cleanup } from '../../helpers/func-utils';

const timepickerHTML = require('../../../app/views/components/timepicker/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let timepickerEl;
let timepickerObj;
let timepickerWrapperEl;

describe('TimePicker ARIA', () => {
  beforeEach(() => {
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
    expect(document.querySelector('#timepicker-wrapper-timepicker-1-id[aria-expanded="false"]')).toBeTruthy();
    expect(document.querySelector('#timepicker-wrapper-timepicker-1-id[role="combobox"]')).toBeTruthy();
    expect(document.querySelector('.icon[aria-hidden="true"]')).toBeTruthy();
    expect(document.querySelector('.icon[role="presentation"]')).toBeTruthy();
  });

  it('Should update ARIA labels with popup open', () => {
    timepickerObj.openTimePopup();
    timepickerWrapperEl = document.querySelector('.timepicker').parentElement.ariaExpanded;
    expect(document.body.querySelector(`[aria-expanded="${timepickerWrapperEl}"]`)).toBeTruthy();
  });
});
