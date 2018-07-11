import { DatePicker } from '../../../src/components/datepicker/datepicker';
import { Locale } from '../../../src/components/locale/locale';

const datepickerHTML = require('../../../app/views/components/datepicker/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let datepickerEl;
let svgEl;
let datepickerAPI;

fdescribe('DatePicker Aria', () => { //eslint-disable-line
  beforeEach(() => {
    datepickerEl = null;
    svgEl = null;
    datepickerAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', datepickerHTML);
    datepickerEl = document.body.querySelector('.datepicker');
    svgEl = document.body.querySelector('.svg-icons');

    Locale.addCulture('ar-SA', Soho.Locale.cultures['ar-SA']); //eslint-disable-line
    Locale.addCulture('en-US', Soho.Locale.cultures['en-US']); //eslint-disable-line
    Locale.set('en-US');

    datepickerAPI = new DatePicker(datepickerEl);
  });

  afterEach(() => {
    datepickerAPI.destroy();
    datepickerEl.parentNode.removeChild(datepickerEl);
    svgEl.parentNode.removeChild(svgEl);

    const rowEl = document.body.querySelector('.row');
    rowEl.parentNode.removeChild(rowEl);
  });

  it('Should trigger "change" event', (done) => {
    const field = document.querySelector('#date-field-normal');
    field.value = '11/06/2018';

    const spyEvent = spyOnEvent('#date-field-normal', 'change');
    datepickerAPI.openCalendar();
    setTimeout(() => {
      const firstDay = document.querySelector('#calendar-popup tbody td:not(.alternate)');
      firstDay.click();

      expect(spyEvent).toHaveBeenTriggered();
      done();
    }, 100);
  });
});
