import { WeekView } from '../../../src/components/week-view/week-view';
import { Locale } from '../../../src/components/locale/locale';
import { cleanup } from '../../helpers/func-utils';
import { stringUtils } from '../../../src/utils/string';

const weekViewHTML = require('../../../app/views/components/week-view/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');
const eventTypes = require('../../../app/data/event-types');
const events = require('../../../app/data/events');

let weekViewEl;
let weekViewAPI;

describe('WeekView API', () => {
  beforeEach(() => {
    weekViewEl = null;
    weekViewAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', weekViewHTML);
    weekViewEl = document.body.querySelector('.week-view');

    Locale.addCulture('ar-SA', Soho.Locale.cultures['ar-SA'], Soho.Locale.languages['ar']); //eslint-disable-line
    Locale.addCulture('ar-EG', Soho.Locale.cultures['ar-EG'], Soho.Locale.languages['ar']); //eslint-disable-line
    Locale.addCulture('en-US', Soho.Locale.cultures['en-US'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.addCulture('ja-JP', Soho.Locale.cultures['ja-JP'], Soho.Locale.languages['ja']); //eslint-disable-line
    Locale.addCulture('sv-SE', Soho.Locale.cultures['sv-SE'], Soho.Locale.languages['sv']); //eslint-disable-line
    Locale.addCulture('en-GB', Soho.Locale.cultures['en-GB'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.addCulture('de-DE', Soho.Locale.cultures['de-DE'], Soho.Locale.languages['de']); //eslint-disable-line
    Locale.set('en-US');
    Soho.Locale.set('en-US'); //eslint-disable-line

    weekViewAPI = new WeekView(weekViewEl, {
      eventTypes,
      events: [],
      showViewChanger: false,
      startDate: new Date(2019, 11, 1),
      endDate: new Date(2019, 11, 7),
      showAllDay: true,
      startHour: 8,
      endHour: 17
    });
  });

  afterEach(() => {
    weekViewAPI.destroy();
    cleanup([
      '.full-height',
      '#test-script'
    ]);
  });

  it('Should be defined', () => {
    expect(weekViewAPI).toEqual(jasmine.any(Object));
  });

  it('Should render the weekview', () => {
    expect(weekViewAPI.currentCalendar.name).toEqual('gregorian');
    expect(weekViewAPI.locale.name).toEqual('en-US');
    expect(document.body.querySelectorAll('.week-view tr').length).toEqual(21);
    expect(document.body.querySelectorAll('.week-view th').length).toEqual(8);
  });

  it('Should render a selected day', () => {
    document.querySelector('.hyperlink.today').click();
    const testDate = new Date();
    const testString = `${testDate.getDate().toString()}${testDate.toLocaleString('default', { weekday: 'short' })}`;

    expect(document.body.querySelector('.week-view-container th .is-today').textContent).toEqual(testString);
  });

  it('Should render week start and end day', () => {
    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('December 2019');
    expect(document.body.querySelector('thead tr th:nth-child(1)').textContent.trim()).toEqual('HourAll Day');
    expect(document.body.querySelector('thead tr th:nth-child(2)').textContent.trim()).toEqual('1Sun');
    expect(document.body.querySelector('thead tr th:nth-child(8)').textContent.trim()).toEqual('7Sat');

    Locale.set('sv-SE');
    Soho.Locale.set('sv-SE'); //eslint-disable-line
    weekViewAPI.showWeek(new Date(2019, 11, 1), new Date(2019, 11, 7));

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('december 2019');
    expect(document.body.querySelector('thead tr th:nth-child(1)').textContent.trim()).toEqual('TimmeHela dagen');
    expect(document.body.querySelector('thead tr th:nth-child(2)').textContent.trim()).toEqual('1sön');
    expect(document.body.querySelector('thead tr th:nth-child(8)').textContent.trim()).toEqual('7lör');

    Locale.set('ar-SA');
    Soho.Locale.set('ar-SA'); //eslint-disable-line
    weekViewAPI.showWeek(new Date(2019, 11, 1), new Date(2019, 11, 7));

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('ربيع الآخر 1441');
    expect(document.body.querySelector('thead tr th:nth-child(1)').textContent.trim()).toEqual('ساعةطوال اليوم');
    expect(document.body.querySelector('thead tr th:nth-child(2)').textContent.trim()).toEqual('4الأحد');
    expect(document.body.querySelector('thead tr th:nth-child(8)').textContent.trim()).toEqual('10السبت');
  });

  it('Should move to next week and back', () => {
    document.body.querySelector('.btn-icon.next').click();

    expect(document.body.querySelector('thead tr th:nth-child(2)').textContent.trim()).toEqual('7Sat');
    expect(document.body.querySelector('thead tr th:nth-child(8)').textContent.trim()).toEqual('13Fri');
    document.body.querySelector('.btn-icon.prev').click();

    expect(document.body.querySelector('thead tr th:nth-child(2)').textContent.trim()).toEqual('1Sun');
    expect(document.body.querySelector('thead tr th:nth-child(8)').textContent.trim()).toEqual('7Sat');
  });

  it('Should destroy monthview', () => {
    weekViewAPI.destroy();

    expect(document.body.querySelector('.week-view-header')).toBeFalsy();
    expect(document.body.querySelector('.week-view-container')).toBeFalsy();
  });

  it('Should populate month name in different languages ', () => {
    Locale.set('en-US');
    Soho.Locale.set('en-US'); //eslint-disable-line
    weekViewAPI.showWeek(new Date(2019, 11, 1), new Date(2019, 11, 7));

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('December 2019');

    Locale.set('ja-JP');
    Soho.Locale.set('ja-JP'); //eslint-disable-line
    weekViewAPI.showWeek(new Date(2019, 11, 1), new Date(2019, 11, 7));

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('2019年 12月');

    Locale.set('ar-SA');
    Soho.Locale.set('ar-SA'); //eslint-disable-line
    weekViewAPI.showWeek(new Date(2019, 11, 1), new Date(2019, 11, 7));

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('ربيع الآخر 1441');

    Locale.set('de-DE');
    Soho.Locale.set('de-DE'); //eslint-disable-line
    weekViewAPI.showWeek(new Date(2019, 11, 1), new Date(2019, 11, 7));

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('Dezember 2019');
  });

  it('Should populate month name spanning months', () => {
    Locale.set('en-US');
    Soho.Locale.set('en-US'); //eslint-disable-line

    weekViewAPI.showWeek(new Date(2020, 0, 31), new Date(2020, 1, 6));

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('Jan - February 2020');
  });

  it('Should populate month name spanning years', () => {
    Locale.set('en-US');
    Soho.Locale.set('en-US'); //eslint-disable-line

    weekViewAPI.showWeek(new Date(2019, 11, 31), new Date(2020, 0, 6));

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('Dec 2019 - Jan 2020');
  });

  it('Should move to next month and back to today', () => {
    document.body.querySelector('.btn-icon.next').click();

    weekViewAPI.showWeek(new Date(2019, 11, 1), new Date(2019, 11, 7));

    document.body.querySelector('.hyperlink.today').click();

    const testDate = new Date();
    testDate.setHours(0, 0, 0, 0);

    expect(weekViewAPI.settings.startDate.getTime()).toEqual(testDate.getTime());
  });

  it('Should be able to render a single day', () => {
    weekViewAPI.showWeek(new Date(2019, 9, 21), new Date(2019, 9, 21));

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('October 2019');

    expect(document.body.querySelector('thead tr th:nth-child(2)').textContent.trim()).toEqual('21Mon');
    expect(document.body.querySelectorAll('thead tr th').length).toEqual(2);
  });

  it('Should be able to render two days', () => {
    weekViewAPI.showWeek(new Date(2019, 9, 21), new Date(2019, 9, 22));

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('October 2019');

    expect(document.body.querySelector('thead tr th:nth-child(2)').textContent.trim()).toEqual('21Mon');
    expect(document.body.querySelectorAll('thead tr th').length).toEqual(3);
  });

  it('Should be able to render two weeks', () => {
    weekViewAPI.showWeek(new Date(2019, 8, 16), new Date(2019, 8, 29));

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('September 2019');

    expect(document.body.querySelector('thead tr th:nth-child(2)').textContent.trim()).toEqual('16Mon');
    expect(document.body.querySelector('thead tr th:nth-child(15)').textContent.trim()).toEqual('29Sun');
    expect(document.body.querySelectorAll('thead tr th').length).toEqual(15);
  });

  it('Should render events', () => {
    weekViewAPI.destroy();
    weekViewAPI = new WeekView(weekViewEl, {
      eventTypes,
      events,
      showViewChanger: false,
      startDate: new Date(2019, 11, 1),
      endDate: new Date(2019, 11, 7),
      showAllDay: true,
      startHour: 8,
      endHour: 17
    });

    const event1 = document.body.querySelectorAll('.week-view .calendar-event')[0];
    const event2 = document.body.querySelectorAll('.week-view .calendar-event')[1];
    const event3 = document.body.querySelectorAll('.week-view .calendar-event')[2];
    const event4 = document.body.querySelectorAll('.week-view .calendar-event')[3];
    const event5 = document.body.querySelectorAll('.week-view .calendar-event')[4];

    expect(event1.getAttribute('data-key')).toEqual('20191204');
    expect(event2.getAttribute('data-key')).toEqual('20191204');
    expect(event3.getAttribute('data-key')).toEqual('20191202');
    expect(event4.getAttribute('data-key')).toEqual('20191203');
    expect(event5.getAttribute('data-key')).toEqual('20191204');

    expect(stringUtils.stripWhitespace(event1.textContent).trim()).toEqual('Mom in Town');
    expect(stringUtils.stripWhitespace(event2.textContent).trim()).toEqual('Mom in Town');
    expect(stringUtils.stripWhitespace(event3.textContent).trim()).toEqual('Chiropractor');
    expect(stringUtils.stripWhitespace(event4.textContent).trim()).toEqual('Day Off');
    expect(stringUtils.stripWhitespace(event5.textContent).trim()).toEqual('Personal');

    expect(document.body.querySelectorAll('.calendar-event').length).toEqual(5);
  });

  it('Should render first day of the week', () => {
    weekViewAPI.destroy();
    weekViewAPI = new WeekView(weekViewEl, {
      firstDayOfWeek: 1
    });

    expect(document.body.querySelector('thead tr th:nth-child(2) span:nth-child(2)').textContent.trim()).toContain('Mon');
    expect(document.body.querySelector('thead tr th:nth-child(8) span:nth-child(2)').textContent.trim()).toContain('Sun');
  });

  it('Should be able to hide show all day area', () => {
    weekViewAPI.destroy();
    weekViewAPI = new WeekView(weekViewEl, {
      showAllDay: false
    });

    expect(document.body.querySelectorAll('.week-view-all-day-wrapper').length).toEqual(0);
  });

  it('Should be able to change start and end hour', () => {
    weekViewAPI.destroy();
    weekViewAPI = new WeekView(weekViewEl, {
      startHour: 8,
      endHour: 17,
    });

    expect(document.querySelector('.week-view-table tr:nth-child(1) td:nth-child(1)').textContent).toEqual('8:00 AM');
    expect(document.querySelector('.week-view-table tr:nth-child(19) td:nth-child(1)').textContent).toEqual('5:00 PM');
  });

  it('Should be able to change hour format to de-DE', () => {
    Locale.set('de-DE');
    Soho.Locale.set('de-DE'); //eslint-disable-line
    weekViewAPI.destroy();
    weekViewAPI = new WeekView(weekViewEl, {
      startHour: 8,
      endHour: 17,
    });

    expect(document.querySelector('.week-view-table tr:nth-child(1) td:nth-child(1)').textContent).toEqual('08:00');
    expect(document.querySelector('.week-view-table tr:nth-child(19) td:nth-child(1)').textContent).toEqual('17:00');
  });

  it('Should be able to hide today', () => {
    weekViewAPI.destroy();
    weekViewAPI = new WeekView(weekViewEl, {
      showToday: false
    });

    expect(document.body.querySelectorAll('.hyperlink.today').length).toEqual(0);
  });

  it('Should be able to hide view changer', () => {
    weekViewAPI.destroy();
    weekViewAPI = new WeekView(weekViewEl, {
      showViewChanger: false
    });

    expect(document.body.querySelectorAll('#calendar-view-changer').length).toEqual(0);
  });

  it('Should be able to remove all events', () => {
    weekViewAPI.destroy();
    weekViewAPI = new WeekView(weekViewEl, {
      eventTypes,
      events,
      showViewChanger: false,
      startDate: new Date(2019, 11, 1),
      endDate: new Date(2019, 11, 7),
      showAllDay: true,
      startHour: 8,
      endHour: 17
    });

    expect(document.body.querySelectorAll('.calendar-event').length).toEqual(5);
    weekViewAPI.removeAllEvents();

    expect(document.body.querySelectorAll('.calendar-event').length).toEqual(0);
  });

  it('Should be able to addEvents', () => {
    weekViewAPI.addEvent({
      id: '1',
      subject: 'Test Event One',
      status: 'pending',
      starts: '2019-12-02T15:00:00.000',
      ends: '2019-12-02T16:00:00.000',
      type: 'dto',
      isAllDay: 'false'
    });

    expect(document.body.querySelectorAll('.calendar-event').length).toEqual(1);
  });

  it('Should be able to clear all events', () => {
    weekViewAPI.destroy();
    weekViewAPI = new WeekView(weekViewEl, {
      eventTypes,
      events,
      showViewChanger: false,
      startDate: new Date(2019, 11, 1),
      endDate: new Date(2019, 11, 7),
      showAllDay: true,
      startHour: 8,
      endHour: 17
    });

    expect(document.body.querySelectorAll('.calendar-event').length).toEqual(5);
    weekViewAPI.clearEvents();

    expect(document.body.querySelectorAll('.calendar-event').length).toEqual(0);
  });

  it('Should be able to update events', () => {
    weekViewAPI.addEvent({
      id: '1',
      subject: 'Test Event One',
      status: 'pending',
      starts: '2019-12-02T15:00:00.000',
      ends: '2019-12-02T16:00:00.000',
      type: 'dto',
      isAllDay: 'false'
    });

    expect(document.body.querySelector('.week-view .calendar-event').getAttribute('data-key')).toEqual('20191202');
    expect(stringUtils.stripWhitespace(document.body.querySelector('.week-view .calendar-event').textContent).trim()).toEqual('Test Event One');
    expect(document.body.querySelectorAll('.calendar-event').length).toEqual(1);

    weekViewAPI.updateEvent({ id: '1', subject: 'Test Event Updated' });

    expect(document.body.querySelector('.week-view .calendar-event').getAttribute('data-key')).toEqual('20191202');
    expect(stringUtils.stripWhitespace(document.body.querySelector('.week-view .calendar-event').textContent).trim()).toEqual('Test Event Updated');
    expect(document.body.querySelectorAll('.calendar-event').length).toEqual(1);
  });

  it('Should be able to delete events', () => {
    weekViewAPI.addEvent({
      id: '1',
      subject: 'Test Event One',
      status: 'pending',
      starts: '2019-12-02T15:00:00.000',
      ends: '2019-12-02T16:00:00.000',
      type: 'dto',
      isAllDay: 'false'
    });

    weekViewAPI.deleteEvent({ id: '1' });

    expect(document.body.querySelectorAll('.calendar-event').length).toEqual(0);
  });

  it('Should be able to update delete events', () => {
    weekViewAPI.addEvent({
      id: '1',
      subject: 'Test Event One',
      status: 'pending',
      starts: '2019-12-02T15:00:00.000',
      ends: '2019-12-02T16:00:00.000',
      type: 'dto',
      isAllDay: 'false'
    });

    weekViewAPI.deleteEvent({ id: '1' });

    expect(document.body.querySelectorAll('.calendar-event').length).toEqual(0);
  });

  it('Should be able to update events with updated', () => {
    weekViewAPI.updated({
      eventTypes,
      events,
      startDate: new Date(2019, 11, 1),
      endDate: new Date(2019, 11, 7),
      startHour: 8,
      endHour: 17
    });

    expect(document.body.querySelectorAll('.calendar-event').length).toEqual(5);
  });
});
