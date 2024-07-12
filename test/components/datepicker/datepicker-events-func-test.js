/**
 * @jest-environment jsdom
 */
import { DatePicker } from '../../../src/components/datepicker/datepicker';
import { Locale } from '../../../src/components/locale/locale';
import { cleanup } from '../../helpers/func-utils';

Soho.Locale = Locale;

require('../../../src/components/locale/cultures/ar-SA.js');
require('../../../src/components/locale/cultures/ar-EG.js');
require('../../../src/components/datepicker/datepicker.jquery.js');
require('../../../src/components/locale/cultures/en-US.js');

const datepickerHTML = `<div class="field">
  <label for="date-field-normal" class="label">Date Field</label>
  <input id="date-field-normal" data-automation-id="custom-automation-id" class="datepicker" name="date-field" type="text" data-init="false"/>
</div>`;

let datepickerEl;
let datepickerAPI;

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

describe('DatePicker Aria', () => {
  beforeEach(() => {
    datepickerEl = null;
    datepickerAPI = null;
    document.body.insertAdjacentHTML('afterbegin', datepickerHTML);
    datepickerEl = document.body.querySelector('.datepicker');

    Locale.addCulture('ar-SA', Soho.Locale.cultures['ar-SA'], Soho.Locale.languages['ar']); //eslint-disable-line
    Locale.addCulture('en-US', Soho.Locale.cultures['en-US'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.set('en-US');

    datepickerAPI = new DatePicker(datepickerEl);
  });

  afterEach(() => {
    datepickerAPI?.destroy();
    cleanup();
  });

  it('should trigger "change" and "input" event', (done) => {
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

  it.skip('should trigger "listopen" and "listclosed" event', (done) => {
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
