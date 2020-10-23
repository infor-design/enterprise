import { DatePicker } from '../../../src/components/datepicker/datepicker';
import { TimePicker } from '../../../src/components/timepicker/timepicker'; //eslint-disable-line
import { Locale } from '../../../src/components/locale/locale';

const datepickerHTML = require('../../../app/views/components/datepicker/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let datepickerEl;
let datepickerTimeEl;
let svgEl;
let datepickerAPI;
let datepickerTimeAPI;

describe('DatePicker API', () => {
  beforeEach(() => {
    datepickerEl = null;
    svgEl = null;
    datepickerAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', datepickerHTML);
    datepickerEl = document.getElementById('date-field-normal');
    datepickerTimeEl = document.getElementById('start-time');
    svgEl = document.body.querySelector('.svg-icons');

    Locale.addCulture('ar-EG', Soho.Locale.cultures['ar-EG'], Soho.Locale.languages['ar']); //eslint-disable-line
    Locale.addCulture('ar-SA', Soho.Locale.cultures['ar-SA'], Soho.Locale.languages['ar']); //eslint-disable-line
    Locale.addCulture('en-US', Soho.Locale.cultures['en-US'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.addCulture('ja-JP', Soho.Locale.cultures['ja-JP'], Soho.Locale.languages['ja']); //eslint-disable-line
    Locale.addCulture('sv-SE', Soho.Locale.cultures['sv-SE'], Soho.Locale.languages['sv']); //eslint-disable-line
    Locale.addCulture('en-GB', Soho.Locale.cultures['en-GB'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.addCulture('da-DK', Soho.Locale.cultures['da-DK'], Soho.Locale.languages['da']); //eslint-disable-line
    Locale.set('en-US');

    datepickerAPI = new DatePicker(datepickerEl);
    datepickerTimeAPI = new DatePicker(datepickerTimeEl);
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
      expect(document.body.querySelector('#monthview-popup')).toBeVisible();
      done();
    }, 100);
  });

  it('Should destroy datepicker', () => {
    datepickerAPI.destroy();

    expect(datepickerAPI.isOpen()).toBeFalsy();
    expect(document.body.querySelector('#monthview-popup')).toBeFalsy();
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
    datepickerAPI.destroy();
    datepickerAPI = new DatePicker(datepickerEl);
    datepickerAPI.setToday();
    const todayDate = datepickerAPI.getCurrentDate();
    const testDate = new Date();
    testDate.setHours(0, 0, 0, 0);

    expect(todayDate.toString()).toEqual(testDate.toString());
  });

  it('Should be able to call setToday when there is a value', () => {
    datepickerEl.value = '8/1/2018';
    datepickerAPI.setToday();
    const todayDate = datepickerAPI.getCurrentDate();
    const testDate = new Date();
    testDate.setHours(0, 0, 0, 0);

    expect(todayDate.toString()).toEqual(testDate.toString());
  });

  it('Should be able to call setToday with time set to noon', () => {
    datepickerTimeAPI.destroy();
    datepickerTimeAPI = new DatePicker(datepickerEl, { useCurrentTime: false });
    datepickerTimeAPI.setToday();
    const todayDate = datepickerTimeAPI.getCurrentDate();
    const testDate = new Date();
    testDate.setHours(0, 0, 0, 0);

    expect(todayDate.toString()).toEqual(testDate.toString());
  });

  // Will fix on a future PR
  it('Should be able to call setToday and getCurrentDate in Umalqura with time set to noon', () => {
    datepickerAPI.destroy();
    Locale.set('ar-SA');
    datepickerAPI = new DatePicker(datepickerEl, { useCurrentTime: false, showTime: true });
    datepickerAPI.setToday();

    const todayDate = datepickerAPI.getCurrentDate();
    const testDate = new Date();
    testDate.setHours(0, 0, 0, 0);

    expect(todayDate.toString()).toEqual(testDate.toString());

    const converted = Locale.gregorianToUmalqura(testDate);

    expect(datepickerEl.value).toEqual(`${converted[0]}/${(`${converted[1] + 1}`).padStart(2, '0')}/${(`${converted[2]}`).padStart(2, '0')} 12:00 ص`);
  });

  it('Should be able to set time using current time', () => {
    datepickerTimeAPI.destroy();
    datepickerTimeAPI = new DatePicker(datepickerEl, { useCurrentTime: true, showTime: true });
    datepickerTimeAPI.setToday();
    const todayDate = datepickerTimeAPI.getCurrentDate();
    const testDate = new Date();

    expect(todayDate.toString()).toEqual(testDate.toString());
  });

  // Will fix on a future PR
  it('Should be able to set time using current time in Umalqura', () => {
    datepickerAPI.destroy();
    Locale.set('ar-SA');
    datepickerAPI = new DatePicker(datepickerEl, { useCurrentTime: true, showTime: true });
    datepickerAPI.setToday();

    const todayDate = datepickerAPI.getCurrentDate();
    const testDate = new Date();

    expect(todayDate.toString()).toEqual(testDate.toString());

    const converted = Locale.gregorianToUmalqura(testDate);

    let hours = testDate.getHours();
    let minutes = testDate.getMinutes();
    let amPm = 'ص';
    if (hours > 12) {
      hours -= hours > 12 ? 12 : 0;
      amPm = 'م';
    }
    if (hours === 12) {
      amPm = 'ص';
    }
    if (minutes.toString().length === 1) {
      minutes = `0${minutes}`;
    }

    expect(datepickerEl.value).toEqual(`${converted[0]}/${(`${converted[1] + 1}`).padStart(2, '0')}/${(`${converted[2]}`).padStart(2, '0')} ${hours}:${minutes} ${amPm}`);
  });

  it('Should set internal format', () => {
    datepickerAPI.setFormat();

    expect(datepickerAPI.pattern).toEqual('M/d/yyyy');
    expect(datepickerAPI.show24Hours).toEqual(false);
    expect(datepickerAPI.isSeconds).toEqual(false);

    datepickerAPI.destroy();
    datepickerAPI = new DatePicker(datepickerEl, { dateFormat: 'yyyy-MM-DD' });
    datepickerAPI.setFormat();

    expect(datepickerAPI.pattern).toEqual('yyyy-MM-DD');
    expect(datepickerAPI.show24Hours).toEqual(false);
    expect(datepickerAPI.isSeconds).toEqual(false);

    datepickerAPI.destroy();
    datepickerAPI = new DatePicker(datepickerEl, { dateFormat: 'yyyy-MM-DD hh:mm:ss' });
    datepickerAPI.setFormat();

    expect(datepickerAPI.pattern).toEqual('yyyy-MM-DD hh:mm:ss');
    expect(datepickerAPI.show24Hours).toEqual(false);
    expect(datepickerAPI.isSeconds).toEqual(true);

    datepickerAPI.destroy();
    datepickerAPI = new DatePicker(datepickerEl, { dateFormat: 'yyyy-MM-DD HH:mm' });
    datepickerAPI.setFormat();

    expect(datepickerAPI.pattern).toEqual('yyyy-MM-DD HH:mm');
    expect(datepickerAPI.show24Hours).toEqual(true);
    expect(datepickerAPI.isSeconds).toEqual(false);
  });

  it('Should be able to set placeholder', () => {
    expect(datepickerEl.getAttribute('placeholder')).toBeFalsy();
    datepickerAPI.destroy();
    datepickerAPI = new DatePicker(datepickerEl, { dateFormat: 'yyyy-MM-DD', placeholder: true });

    expect(datepickerEl.getAttribute('placeholder')).toEqual('yyyy-MM-DD');
    datepickerAPI.destroy();
    datepickerAPI = new DatePicker(datepickerEl, { placeholder: true, range: { useRange: true, start: '2/5/2018', end: '2/28/2018' } });

    expect(datepickerEl.getAttribute('placeholder')).toEqual('M/d/yyyy - M/d/yyyy');
  });

  it('Should be able to restrict months', (done) => {
    datepickerAPI.destroy();
    datepickerAPI = new DatePicker(datepickerEl, {
      dateFormat: 'MM/dd/yyyy',
      disable: {
        restrictMonths: true,
        minDate: '04/01/2018',
        maxDate: '06/30/2018'
      }
    });

    datepickerAPI.setValue('04/15/2018');
    datepickerAPI.openCalendar();

    setTimeout(() => {
      const prevButton = document.body.querySelector('.btn-icon.prev');
      const nextButton = document.body.querySelector('.btn-icon.next');

      const monthSpan = document.body.querySelector('span.month');

      expect(monthSpan.innerHTML).toEqual('April');
      expect(prevButton.disabled).toEqual(true);
      expect(nextButton.disabled).toEqual(false);
      nextButton.click();

      expect(monthSpan.innerHTML.trim()).toEqual('May');
      nextButton.click();

      expect(monthSpan.innerHTML.trim()).toEqual('June');
      expect(prevButton.disabled).toEqual(false);
      expect(nextButton.disabled).toEqual(true);
      done();
    }, 100);
  });

  it('Should be able to disable days and weeks', (done) => {
    datepickerAPI.destroy();
    datepickerAPI = new DatePicker(datepickerEl, {
      dateFormat: 'MM/dd/yyyy',
      disable: {
        dayOfWeek: [0, 6],
        dates: ['04/30/2018', '04/01/2018']
      }
    });

    datepickerAPI.setValue('04/15/2018');
    datepickerAPI.openCalendar();

    setTimeout(() => {
      const tds = document.body.querySelectorAll('.monthview-table td');

      expect(tds[0].classList.contains('is-disabled')).toEqual(true);
      expect(tds[6].classList.contains('is-disabled')).toEqual(true);
      expect(tds[7].classList.contains('is-disabled')).toEqual(true);
      expect(tds[13].classList.contains('is-disabled')).toEqual(true);
      expect(tds[14].classList.contains('is-disabled')).toEqual(true);
      expect(tds[20].classList.contains('is-disabled')).toEqual(true);
      expect(tds[21].classList.contains('is-disabled')).toEqual(true);
      expect(tds[27].classList.contains('is-disabled')).toEqual(true);
      expect(tds[28].classList.contains('is-disabled')).toEqual(true);
      expect(tds[29].classList.contains('is-disabled')).toEqual(true);
      expect(tds[34].classList.contains('is-disabled')).toEqual(true);
      done();
    }, 100);
  });

  it('Should be able to render a legend', (done) => {
    datepickerAPI.destroy();
    datepickerAPI = new DatePicker(datepickerEl, {
      showLegend: true,
      dateFormat: 'yyyy-MM-dd',
      legend: [
        { name: 'Public Holiday', color: '#76B051', dates: ['1/1/2017', '1/12/2017'] },
        { name: 'Weekends', color: '#EFA836', dayOfWeek: [0, 6] },
        { name: 'Other', color: '#B94E4E', dates: ['1/18/2017', '1/19/2017'] },
        { name: 'Half Days', color: '#9279A6', dates: ['1/21/2017', '1/22/2017'] },
        { name: 'Full Days', color: '#2578A9', dates: ['1/24/2017', '1/25/2017'] }
      ]
    });

    datepickerAPI.setValue('2017-01-03');
    datepickerAPI.openCalendar();

    setTimeout(() => {
      const legendItems = document.body.querySelectorAll('.monthview-legend-item');

      expect(legendItems[0].textContent.trim()).toEqual('Public Holiday');
      expect(legendItems[1].textContent.trim()).toEqual('Weekends');
      expect(legendItems[2].textContent.trim()).toEqual('Other');
      expect(legendItems[3].textContent.trim()).toEqual('Half Days');
      expect(legendItems[4].textContent.trim()).toEqual('Full Days');

      const tds = document.body.querySelectorAll('.monthview-table td');

      expect(tds[0].style.backgroundColor).toEqual('rgba(118, 176, 81, 0.3)');
      expect(tds[6].style.backgroundColor).toEqual('rgba(239, 168, 54, 0.3)');
      done();
    }, 100);
  });

  it('Should be able to change months', (done) => {
    datepickerAPI.setValue(new Date(2018, 4, 15));
    datepickerAPI.openCalendar();

    setTimeout(() => {
      datepickerAPI.calendarAPI.showMonth('6', '2018');

      expect(document.body.querySelectorAll('.monthview-header span')[0].textContent).toEqual('July ');
      expect(document.body.querySelectorAll('.monthview-header span')[1].textContent).toEqual(' 2018');
      expect(document.body.querySelectorAll('td:not(.alternate)').length).toEqual(31);
      done();
    }, 100);
  });

  it('Should render year first in ja-JP ', (done) => {
    datepickerAPI.destroy();
    Locale.set('ja-JP');

    datepickerAPI = new DatePicker(datepickerEl);

    datepickerAPI.setValue(new Date(2018, 5, 15));
    datepickerAPI.openCalendar();

    setTimeout(() => {
      expect(document.body.querySelectorAll('.monthview-header span')[0].textContent).toEqual('2018年 ');
      expect(document.body.querySelectorAll('.monthview-header span')[1].textContent).toEqual('6月');
      done();
    }, 100);
  });

  it('Should render first day of week as Monday in sv-SE', (done) => {
    datepickerAPI.destroy();
    Locale.set('sv-SE');

    datepickerAPI = new DatePicker(datepickerEl);

    datepickerAPI.setValue(new Date(2018, 5, 15));
    datepickerAPI.openCalendar();

    setTimeout(() => {
      expect(document.body.querySelectorAll('.monthview-table thead th')[0].textContent).toEqual('M');
      expect(document.body.querySelectorAll('.monthview-table thead th')[1].textContent).toEqual('T');
      done();
    }, 100);
  });

  it('Should render first day of week as Monday in en-GB', (done) => {
    datepickerAPI.destroy();
    Locale.set('en-GB');

    datepickerAPI = new DatePicker(datepickerEl);

    datepickerAPI.setValue(new Date(2018, 5, 15));
    datepickerAPI.openCalendar();

    setTimeout(() => {
      expect(document.body.querySelectorAll('.monthview-table thead th')[0].textContent).toEqual('M');
      expect(document.body.querySelectorAll('.monthview-table thead th')[1].textContent).toEqual('Τ');
      done();
    }, 100);
  });

  it('Should render Month Year Picker', (done) => {
    datepickerAPI.destroy();

    datepickerAPI = new DatePicker(datepickerEl, { showMonthYearPicker: true });

    datepickerAPI.setValue(new Date(2018, 5, 15));
    datepickerAPI.openCalendar();

    setTimeout(() => {
      expect(document.querySelector('button.btn-monthyear-pane').innerText).toEqual('June2018');
      expect(document.querySelectorAll('.monthview-monthyear-pane').length).toEqual(1);
      done();
    }, 100);
  });

  it('Should be able to disable Month Year Picker', (done) => {
    datepickerAPI.destroy();

    datepickerAPI = new DatePicker(datepickerEl, { showMonthYearPicker: false });

    datepickerAPI.setValue(new Date(2018, 5, 15));
    datepickerAPI.openCalendar();

    setTimeout(() => {
      expect(document.querySelectorAll('button.btn-monthyear-pane').length).toEqual(0);
      expect(document.querySelectorAll('.monthview-monthyear-pane').length).toEqual(0);
      done();
    }, 100);
  });

  it('Should render range', (done) => {
    datepickerAPI.destroy();

    datepickerEl.value = '2/7/2018 - 2/22/2018';
    datepickerAPI = new DatePicker(datepickerEl, { range: { useRange: true } });

    datepickerAPI.openCalendar();
    setTimeout(() => {
      expect(document.body.querySelectorAll('.range-selection').length).toEqual(16);
      datepickerEl.value = '';
      done();
    }, 100);
  });

  it('Should render time', (done) => {
    datepickerAPI.destroy();

    datepickerEl.value = '2018-10-12 12:25:10 AM';
    datepickerAPI = new DatePicker(datepickerEl, { showTime: true, dateFormat: 'yyyy-MM-dd', timeFormat: 'h:mm:ss a' });

    datepickerAPI.openCalendar();

    setTimeout(() => {
      expect(document.body.querySelectorAll('.monthview select')[0].value).toEqual('12');
      expect(document.body.querySelectorAll('.monthview select')[1].value).toEqual('25');
      expect(document.body.querySelectorAll('.monthview select')[2].value).toEqual('10');
      expect(document.body.querySelectorAll('.monthview select')[3].value).toEqual('AM');
      datepickerEl.value = '';
      done();
    }, 100);
  });

  it('Should hide icon if input is hidden', () => {
    datepickerAPI.destroy();

    datepickerEl.classList.add('hidden');
    datepickerAPI = new DatePicker(datepickerEl);

    expect($(datepickerEl).siblings('svg.icon').css('visibility')).toEqual('hidden');
  });

  it('Should be able to render a different locale', (done) => {
    datepickerAPI.destroy();
    datepickerAPI = new DatePicker(datepickerEl, { locale: 'da-DK' });
    datepickerAPI.setValue(new Date(2019, 2, 15));
    datepickerAPI.openCalendar();

    setTimeout(() => {
      datepickerAPI.calendarAPI.showMonth('2', '2019');

      expect(document.body.querySelectorAll('.monthview-header span')[0].textContent).toEqual('marts ');
      expect(document.body.querySelectorAll('.monthview-header span')[1].textContent).toEqual(' 2019');
      expect(document.body.querySelectorAll('td:not(.alternate)').length).toEqual(30);
      done();
    }, 100);
  });
});
