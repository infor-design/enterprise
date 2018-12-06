import { TimePicker } from '../../../src/components/timepicker/timepicker';

const timepickerHTML = require('../../../app/views/components/timepicker/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let timepickerEl;
let svgEl;
let timepickerObj;

describe('TimePicker Events', () => {
  beforeEach(() => {
    timepickerEl = null;
    svgEl = null;
    timepickerObj = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', timepickerHTML);
    timepickerEl = document.body.querySelector('.timepicker');
    svgEl = document.body.querySelector('.svg-icons');
    timepickerObj = new TimePicker(timepickerEl);
  });

  afterEach(() => {
    timepickerObj.destroy();
    timepickerEl.parentNode.removeChild(timepickerEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should trigger "change" event', () => {
    const spyEvent = spyOnEvent('#timepicker-main', 'change');
    timepickerObj.openTimePopup();
    timepickerObj.setTimeOnField();
    timepickerObj.closeTimePopup();

    expect(spyEvent).toHaveBeenTriggered();
  });
});
