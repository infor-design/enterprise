import { DatePicker } from '../../../src/components/datepicker/datepicker';
import { Locale } from '../../../src/components/locale/locale';

const datepickerHTML = require('../../../app/views/components/datepicker/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let datepickerEl;
let svgEl;
let datepickerAPI;

describe('DatePicker API', () => {
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

  it('Should be defined on jQuery object', () => {
    expect(datepickerAPI).toEqual(jasmine.any(Object));
  });

  it('Should open datepicker', (done) => {
    datepickerAPI.openCalendar();

    setTimeout(() => {
      expect(datepickerAPI.isOpen()).toBeTruthy();
      expect(document.body.querySelector('#calendar-popup')).toBeVisible();
      done();
    }, 100);
  });

  it('Should destroy datepicker', () => {
    datepickerAPI.destroy();

    expect(datepickerAPI.isOpen()).toBeFalsy();
    expect(document.body.querySelector('#calendar-popup')).toBeFalsy();
  });

  it('Should disable datepicker', () => {
    datepickerAPI.disable();

    expect(document.body.querySelector('.field.is-disabled .datepicker')).toBeTruthy();
    expect(datepickerAPI.isDisabled()).toBeTruthy();
  });

  it('Should enable datepicker', () => {
    datepickerAPI.enable();

    expect(document.body.querySelector('.field.is-disabled .datepicker')).toBeFalsy();
    expect(datepickerAPI.isDisabled()).toBeFalsy();
  });

  it('Should render datepicker readonly', () => {
    datepickerAPI.readonly();

    expect(document.body.querySelector('.datepicker[readonly]')).toBeTruthy();
    expect(datepickerAPI.isDisabled()).toBeFalsy();
  });

  it('Should be able to call setToday and getCurrentDate', () => {
    datepickerAPI.setToday();
    const todayDate = datepickerAPI.getCurrentDate();
    const testDate = new Date();
    testDate.setHours(0, 0, 0, 0);

    expect(todayDate.toString()).toEqual(testDate.toString());
  });

  it('Should be able to call setToday and getCurrentDate in Umalqura', () => {
    datepickerAPI.destroy();
    Locale.set('ar-SA');
    datepickerAPI = new DatePicker(datepickerEl);
    datepickerAPI.setToday();

    const todayDate = datepickerAPI.getCurrentDate();
    const testDate = new Date();
    testDate.setHours(0, 0, 0, 0);

    expect(todayDate.toString()).toEqual(testDate.toString());
    expect(datepickerEl.value).toEqual('27/10/1439');
  });
});
