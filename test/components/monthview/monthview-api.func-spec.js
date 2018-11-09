import { MonthView } from '../../../src/components/monthview/monthview';
import { Locale } from '../../../src/components/locale/locale';

const datepickerHTML = require('../../../app/views/components/monthview/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let monthviewEl;
let svgEl;
let monthviewAPI;

describe('Monthview API', () => {
  beforeEach(() => {
    monthviewEl = null;
    svgEl = null;
    monthviewAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', datepickerHTML);
    monthviewEl = document.body.querySelector('.monthview');
    svgEl = document.body.querySelector('.svg-icons');

    Locale.addCulture('ar-SA', Soho.Locale.cultures['ar-SA']); //eslint-disable-line
    Locale.addCulture('en-US', Soho.Locale.cultures['en-US']); //eslint-disable-line
    Locale.addCulture('ja-JP', Soho.Locale.cultures['ja-JP']); //eslint-disable-line
    Locale.addCulture('sv-SE', Soho.Locale.cultures['sv-SE']); //eslint-disable-line
    Locale.addCulture('en-GB', Soho.Locale.cultures['en-GB']); //eslint-disable-line
    Locale.addCulture('de-DE', Soho.Locale.cultures['de-DE']); //eslint-disable-line
    Locale.set('en-US');
    Soho.Locale.set('en-US'); //eslint-disable-line

    monthviewAPI = new MonthView(monthviewEl, {
      month: 8,
      year: 2018,
      activeDate: new Date(2018, 8, 10)
    });
  });

  afterEach(() => {
    monthviewAPI.destroy();
    monthviewEl.parentNode.removeChild(monthviewEl);
    svgEl.parentNode.removeChild(svgEl);

    const rowEl = document.body.querySelector('.row');
    rowEl.parentNode.removeChild(rowEl);
  });

  it('Should be defined', () => {
    expect(monthviewAPI).toEqual(jasmine.any(Object));
  });

  it('Should render a monthview', () => {
    expect(monthviewAPI.currentCalendar.name).toEqual('gregorian');
    expect(document.body.querySelectorAll('.monthview-table tr').length).toEqual(7);
    expect(document.body.querySelectorAll('.monthview-table td').length).toEqual(42);
  });

  it('Should render a selected day', () => {
    expect(monthviewAPI.currentCalendar.name).toEqual('gregorian');
    expect(document.body.querySelector('.monthview-table td.is-selected').textContent).toEqual('10');
    expect(document.body.querySelector('.monthview-table td.is-selected').getAttribute('aria-label')).toEqual('Monday, September 10, 2018');
  });

  // Will fix on future PR
  xit('Should render month text and start day', () => {
    expect(document.getElementById('monthview-datepicker-field').value).toEqual('September 2018');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('Sun');

    Locale.set('sv-SE');
    Soho.Locale.set('sv-SE'); //eslint-disable-line
    monthviewAPI.showMonth(7, 2018);

    expect(document.getElementById('monthview-datepicker-field').value).toEqual('augusti 2018');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('mån');

    Locale.set('ar-SA');
    Soho.Locale.set('ar-SA'); //eslint-disable-line
    monthviewAPI.showMonth(7, 1440);

    expect(document.getElementById('monthview-datepicker-field').value).toEqual('صفر 1440');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('السبت');
    expect(document.body.querySelector('tbody tr:first-child td:first-child').textContent.trim()).toEqual('26');
    expect(document.body.querySelector('tbody tr:first-child td:last-child').textContent.trim()).toEqual('3');
  });

  it('Should render disabled days', () => {
    monthviewAPI.destroy();
    monthviewAPI = new MonthView(monthviewEl, {
      month: 8,
      year: 2018,
      disable: {
        dayOfWeek: [0, 6]
      }
    });

    expect(document.body.querySelector('tbody tr:first-child td:first-child').classList).toContain('is-disabled');
    expect(document.body.querySelector('tbody tr:first-child td:last-child').classList).toContain('is-disabled');
  });

  it('Should move to next month and back', () => {
    document.body.querySelector('button.next').click();

    expect(document.getElementById('monthview-datepicker-field').value).toEqual('October 2018');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('Sun');
    document.body.querySelector('button.prev').click();

    expect(document.getElementById('monthview-datepicker-field').value).toEqual('September 2018');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('Sun');
  });

  it('Should destroy monthview', () => {
    monthviewAPI.destroy();

    expect(document.body.querySelector('.monthview-table')).toBeFalsy();
  });

  // Will fix on future PR
  xit('Should populate header ', () => {
    Locale.set('en-US');
    Soho.Locale.set('en-US'); //eslint-disable-line
    monthviewAPI.showMonth(7, 2018);

    expect(document.getElementById('monthview-datepicker-field').value).toEqual('August 2018');

    Locale.set('ja-JP');
    Soho.Locale.set('ja-JP'); //eslint-disable-line
    monthviewAPI.showMonth(7, 2018);

    expect(document.getElementById('monthview-datepicker-field').value).toEqual('2018年 8月');

    Locale.set('ar-SA');
    Soho.Locale.set('ar-SA'); //eslint-disable-line
    monthviewAPI.showMonth(7, 2018);

    expect(document.getElementById('monthview-datepicker-field').value).toEqual('صفر 1440');

    Locale.set('de-DE');
    Soho.Locale.set('de-DE'); //eslint-disable-line
    monthviewAPI.showMonth(7, 2018);

    expect(document.getElementById('monthview-datepicker-field').value).toEqual('August 2018');
  });

  it('Should move to next month and back to today', () => {
    document.body.querySelector('button.next').click();

    expect(document.getElementById('monthview-datepicker-field').value).toEqual('October 2018');
    document.body.querySelector('.hyperlink.today').click();

    const testDate = new Date();
    const stringDate = testDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    expect(document.getElementById('monthview-datepicker-field').value).toEqual(stringDate);
  });
});
