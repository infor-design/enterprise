import { Calendar } from '../../../src/components/calendar/calendar';
import { Locale } from '../../../src/components/locale/locale';
import { cleanup } from '../../helpers/func-utils';

const calendarHTML = require('../../../app/views/components/calendar/example-index.html');
const svg = require('../../../src/components/icons/svg.html');
const events = require('../../../app/data/events');
const eventTypes = require('../../../app/data/event-types');

let calendarEl;
let calendarObj;
let baseTime;

const settings = {
  eventTypes,
  events,
  month: 10,
  year: 2018,
};

describe('Calendar API', () => {
  beforeEach(() => {
    calendarEl = null;
    calendarObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', calendarHTML);
    calendarEl = document.body.querySelector('.calendar');

    Locale.addCulture('ar-SA', Soho.Locale.cultures['ar-SA'], Soho.Locale.languages['ar']); //eslint-disable-line
    Locale.addCulture('en-US', Soho.Locale.cultures['en-US'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.addCulture('ja-JP', Soho.Locale.cultures['ja-JP'], Soho.Locale.languages['ja']); //eslint-disable-line
    Locale.addCulture('sv-SE', Soho.Locale.cultures['sv-SE'], Soho.Locale.languages['sv']); //eslint-disable-line
    Locale.addCulture('en-GB', Soho.Locale.cultures['en-GB'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.addCulture('de-DE', Soho.Locale.cultures['de-DE'], Soho.Locale.languages['de']); //eslint-disable-line
    Locale.addCulture('da-DK', Soho.Locale.cultures['da-DK'], Soho.Locale.languages['da']); //eslint-disable-line
    Locale.set('en-US');
    Soho.Locale.set('en-US'); //eslint-disable-line

    jasmine.clock().install();
    baseTime = new Date(2018, 10, 10);
    jasmine.clock().mockDate(baseTime);
    calendarObj = new Calendar(calendarEl, settings);
  });

  afterEach(() => {
    calendarObj.destroy();
    cleanup([
      '.svg-icons',
      '#tooltip',
      '.calendar',
      '.row',
      '#tmpl-readonly',
      '#test-script',
      '#tmpl-modal'
    ]);

    jasmine.clock().uninstall();
  });

  it('Should render calendar', () => {
    expect(calendarObj).toEqual(jasmine.any(Object));
    expect(document.body.querySelector('.monthview-table')).toBeTruthy();
    expect(document.body.querySelectorAll('.monthview-table td').length).toEqual(42);
  });

  it('Should render header', () => {
    expect(calendarObj).toEqual(jasmine.any(Object));
    expect(document.body.querySelector('.monthview-header .next')).toBeTruthy();
    expect(document.body.querySelector('.monthview-header .prev')).toBeTruthy();
  });

  it('Should optionaly not render view changer', () => {
    calendarObj.destroy();
    settings.showViewChanger = false;
    calendarObj = new Calendar(calendarEl, settings);

    expect(document.body.querySelector('#calendar-view-changer')).toBeFalsy();
  });

  it('Should be able to destroy', () => {
    calendarObj.destroy();

    expect($(calendarEl).data('calendar')).toBeFalsy();
  });

  it('Should render based on locale setting', () => {
    calendarObj.destroy();
    const start = new Date();
    start.setDate(start.getDate() + 1);

    const end = new Date();
    end.setDate(end.getDate() + 2);

    const newSettings = {
      locale: 'da-DK',
      month: 2,
      year: 2019,
      eventTypes,
      events: [{
        id: '15',
        subject: 'Days Off',
        starts: start.toISOString(),
        ends: end.toISOString(),
        type: 'dto',
        isAllDay: true
      }]
    };

    calendarObj = new Calendar(calendarEl, newSettings);

    expect(document.getElementById('monthview-datepicker-field').value).toEqual('marts 2019');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('søn');
    expect(document.body.querySelector('thead tr th:last-child').textContent.trim()).toEqual('lør');
  });

  it('Should render upcoming dates', () => {
    calendarObj.destroy();
    const start = new Date();
    start.setDate(start.getDate() + 1);

    const end = new Date();
    end.setDate(end.getDate() + 2);

    const newSettings = {
      eventTypes,
      events: [{
        id: '15',
        subject: 'Days Off',
        starts: start.toISOString(),
        ends: end.toISOString(),
        type: 'dto',
        isAllDay: true
      }]
    };

    calendarObj = new Calendar(calendarEl, newSettings);
    const compareDate = `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()}-${end.getDate()}, ${start.toLocaleDateString('en-US', { year: 'numeric' })}`;

    expect(document.querySelector('.calendar-upcoming-date').innerText).toEqual(compareDate);
  });

  it('Should handle adding events', () => {
    const startsDate = new Date(baseTime);
    startsDate.setHours(0, 0, 0, 0);
    const endsDate = new Date(baseTime);
    endsDate.setHours(23, 59, 59, 999);

    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(18);
    const newEvent = {
      id: (settings.events.length + 1).toString(),
      subject: 'New Random Event',
      comments: 'New Random Event Details',
      starts: Locale.formatDate(startsDate, { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS' }),
      ends: Locale.formatDate(endsDate, { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS' }),
      type: 'team',
      isAllDay: true
    };
    calendarObj.addEvent(newEvent);

    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(19);
  });

  it('Should handle clearing events', () => {
    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(18);

    calendarObj.clearEvents();

    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(0);
  });

  it('Should handle deleting events', () => {
    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(18);

    calendarObj.deleteEvent({ id: '13' });

    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(17);

    calendarObj.deleteEvent({ id: '11' });

    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(3);
  });

  it('Should handle updating events', () => {
    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(18);

    calendarObj.updateEvent({ id: '13', subject: 'Updated Subject' });

    expect(document.querySelectorAll('.calendar-event-title').length).toEqual(18);
    expect(calendarObj.settings.events[12].subject).toEqual('Updated Subject');
    expect(calendarObj.settings.events[12].id).toEqual('13');
  });
});
