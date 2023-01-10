import { DatePicker } from '../../../src/components/datepicker/datepicker';
import { Locale } from '../../../src/components/locale/locale';
import { cleanup } from '../../helpers/func-utils';

require('../../../src/components/locale/cultures/ar-SA.js');
require('../../../src/components/locale/cultures/ar-EG.js');

const datepickerHTML = require('../../../app/views/components/datepicker/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let datepickerEl;
let datepickerAPI;

describe('DatePicker Aria', () => {
  beforeEach(() => {
    datepickerEl = null;
    datepickerAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', datepickerHTML);
    datepickerEl = document.body.querySelector('.datepicker');

    Locale.addCulture('ar-SA', Soho.Locale.cultures['ar-SA'], Soho.Locale.languages['ar']); //eslint-disable-line
    Locale.addCulture('en-US', Soho.Locale.cultures['en-US'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.set('en-US');

    datepickerAPI = new DatePicker(datepickerEl);
  });

  afterEach(() => {
    datepickerAPI.destroy();
    cleanup();
  });

  it('Should trigger "change" and "input" event', (done) => {
    const field = document.querySelector('#date-field-normal');
    field.value = '11/06/2018';
    const callback = jest.fn();
    $('#date-field-normal').on('change', callback);
    const callback2 = jest.fn();
    $('#date-field-normal').on('input', callback2);

    datepickerAPI.openCalendar();
    setTimeout(() => {
      const firstDay = document.querySelector('#monthview-popup tbody td:not(.alternate)');
      firstDay.click();

      expect(callback).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('Should trigger "listopen" and "listclosed" event', (done) => {
    const field = document.querySelector('#date-field-normal');
    field.value = '11/06/2018';

    const callback = jest.fn();
    $('#date-field-normal').on('listopened', callback);
    const callback2 = jest.fn();
    $('#date-field-normal').on('listclosed', callback);

    datepickerAPI.openCalendar();
    setTimeout(() => {
      expect(callback).toHaveBeenCalled();

      const firstDay = document.querySelector('#monthview-popup tbody td:not(.alternate)');
      firstDay.click();

      expect(callback2).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should trigger monthrendered event on open.', (done) => {
    const field = document.querySelector('#date-field-normal');
    field.value = '11/06/2018';

    const callback = jest.fn();
    $('#date-field-normal').on('monthrendered', callback);

    datepickerAPI.openCalendar();
    setTimeout(() => {
      expect(callback).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should trigger monthrendered event on month change.', (done) => {
    const field = document.querySelector('#date-field-normal');
    field.value = '11/06/2018';
    const callback = jest.fn();
    $('#date-field-normal').on('monthrendered', callback);

    datepickerAPI.openCalendar();
    setTimeout(() => {
      const nextMonth = document.querySelector('#monthview-popup .calendar-toolbar button.next');
      nextMonth.click();

      expect(callback).toHaveBeenCalled();
      done();
    }, 100);
  });
});
