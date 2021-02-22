import { DatePicker } from '../../../src/components/datepicker/datepicker';
import { Locale } from '../../../src/components/locale/locale';

const datepickerHTML = require('../../../app/views/components/datepicker/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let datepickerEl;
let svgEl;
let datepickerAPI;

describe('DatePicker Aria', () => {
  beforeEach(() => {
    datepickerEl = null;
    svgEl = null;
    datepickerAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', datepickerHTML);
    datepickerEl = document.body.querySelector('.datepicker');
    svgEl = document.body.querySelector('.svg-icons');

    Locale.addCulture('ar-SA', Soho.Locale.cultures['ar-SA'], Soho.Locale.languages['ar']); //eslint-disable-line
    Locale.addCulture('en-US', Soho.Locale.cultures['en-US'], Soho.Locale.languages['en']); //eslint-disable-line
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

  it('Should trigger "change" and "input" event', (done) => {
    const field = document.querySelector('#date-field-normal');
    field.value = '11/06/2018';

    const spyEvent = spyOnEvent('#date-field-normal', 'change');
    const spyEventInput = spyOnEvent('#date-field-normal', 'input');
    datepickerAPI.openCalendar();
    setTimeout(() => {
      const firstDay = document.querySelector('#monthview-popup tbody td:not(.alternate)');
      firstDay.click();

      expect(spyEvent).toHaveBeenTriggered();
      expect(spyEventInput).toHaveBeenTriggered();
      done();
    }, 100);
  });

  it('Should trigger "listopen" and "listclosed" event', (done) => {
    const field = document.querySelector('#date-field-normal');
    field.value = '11/06/2018';

    const spyEvent = spyOnEvent('#date-field-normal', 'listopened');
    const spyEventClosed = spyOnEvent('#date-field-normal', 'listclosed');
    datepickerAPI.openCalendar();
    setTimeout(() => {
      expect(spyEvent).toHaveBeenTriggered();

      const firstDay = document.querySelector('#monthview-popup tbody td:not(.alternate)');
      firstDay.click();

      expect(spyEventClosed).toHaveBeenTriggered();
      done();
    }, 100);
  });
});
