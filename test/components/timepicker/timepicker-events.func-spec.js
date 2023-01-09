import { TimePicker } from '../../../src/components/timepicker/timepicker';
import { cleanup } from '../../helpers/func-utils';

const timepickerHTML = require('../../../app/views/components/timepicker/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let timepickerEl;
let timepickerObj;

describe('TimePicker Events', () => {
  beforeEach(() => {
    timepickerEl = null;
    timepickerObj = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', timepickerHTML);
    timepickerEl = document.body.querySelector('.timepicker');
    timepickerObj = new TimePicker(timepickerEl);
  });

  afterEach(() => {
    timepickerObj.destroy();
    cleanup();
  });

  it('Should trigger "change" event', () => {
    const spyEvent = spyOnEvent('#timepicker-id-1', 'change');
    timepickerObj.openTimePopup();
    timepickerObj.setTimeOnField();
    timepickerObj.closeTimePopup();

    expect(spyEvent).toHaveBeenCalled();
  });
});
