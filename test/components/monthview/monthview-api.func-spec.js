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

    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2018, 10, 10));

    Locale.addCulture('ar-SA', Soho.Locale.cultures['ar-SA'], Soho.Locale.languages['ar']); //eslint-disable-line
    Locale.addCulture('ar-EG', Soho.Locale.cultures['ar-EG'], Soho.Locale.languages['ar']); //eslint-disable-line
    Locale.addCulture('en-US', Soho.Locale.cultures['en-US'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.addCulture('ja-JP', Soho.Locale.cultures['ja-JP'], Soho.Locale.languages['ja']); //eslint-disable-line
    Locale.addCulture('sv-SE', Soho.Locale.cultures['sv-SE'], Soho.Locale.languages['sv']); //eslint-disable-line
    Locale.addCulture('en-GB', Soho.Locale.cultures['en-GB'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.addCulture('de-DE', Soho.Locale.cultures['de-DE'], Soho.Locale.languages['de']); //eslint-disable-line
    Locale.addCulture('da-DK', Soho.Locale.cultures['da-DK'], Soho.Locale.languages['da']); //eslint-disable-line
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
    jasmine.clock().uninstall();
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

  it('Should render month text and start day', () => {
    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('September 2018');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('Sun');

    Locale.set('sv-SE');
    Soho.Locale.set('sv-SE'); //eslint-disable-line
    monthviewAPI.showMonth(7, 2018);

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('augusti 2018');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('mån');

    Locale.set('ar-SA');
    Soho.Locale.set('ar-SA'); //eslint-disable-line
    monthviewAPI.showMonth(7, 2018);

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('ذو القعدة 1439');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('الأحد');
    expect(document.body.querySelector('tbody tr:first-child td:first-child').textContent.trim()).toEqual('25');
    expect(document.body.querySelector('tbody tr:first-child td:last-child').textContent.trim()).toEqual('1');
  });

  it('Should render based on locale setting', () => {
    monthviewAPI.destroy();
    monthviewAPI = new MonthView(monthviewEl, {
      month: 4,
      year: 2019,
      locale: 'da-DK'
    });

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('maj 2019');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('man');
    expect(document.body.querySelector('thead tr th:last-child').textContent.trim()).toEqual('søn');
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
    $('button.next').click();

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('October 2018');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('Sun');
    $('button.prev').click();

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('September 2018');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('Sun');
  });

  it('Should destroy monthview', () => {
    monthviewAPI.destroy();

    expect(document.body.querySelector('.monthview-table')).toBeFalsy();
  });

  it('Should populate header ', () => {
    Locale.set('en-US');
    Soho.Locale.set('en-US'); //eslint-disable-line
    monthviewAPI.showMonth(7, 2018);

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('August 2018');

    Locale.set('ja-JP');
    Soho.Locale.set('ja-JP'); //eslint-disable-line
    monthviewAPI.showMonth(7, 2018);

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('2018年 8月');

    Locale.set('ar-SA');
    Soho.Locale.set('ar-SA'); //eslint-disable-line
    monthviewAPI.showMonth(7, 2018);

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('ذو القعدة 1439');

    Locale.set('de-DE');
    Soho.Locale.set('de-DE'); //eslint-disable-line
    monthviewAPI.showMonth(7, 2018);

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('August 2018');
  });

  it('Should move to next month and back to today', () => {
    document.body.querySelector('button.next').click();

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('October 2018');
    document.body.querySelector('.hyperlink.today').click();

    const testDate = new Date();
    const stringDate = testDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual(stringDate);
  });

  it('Should be able to select a day by date', () => {
    monthviewAPI.selectDay(new Date(2018, 7, 15));

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('August 2018');
    expect(document.body.querySelector('.monthview .is-selected .day-text').innerText).toEqual('15');

    monthviewAPI.selectDay(new Date(2018, 8, 22));

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('September 2018');
    expect(document.body.querySelector('.monthview .is-selected .day-text').innerText).toEqual('22');
  });

  it('Should be able to select a day by key', () => {
    monthviewAPI.selectDay('20180820');

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('August 2018');
    expect(document.body.querySelector('.monthview .is-selected .day-text').innerText).toEqual('20');

    monthviewAPI.selectDay('20180922');

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('September 2018');
    expect(document.body.querySelector('.monthview .is-selected .day-text').innerText).toEqual('22');
  });
});
