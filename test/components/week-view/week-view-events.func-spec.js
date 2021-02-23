import { WeekView } from '../../../src/components/week-view/week-view';
import { Locale } from '../../../src/components/locale/locale';
import { cleanup } from '../../helpers/func-utils';

const weekViewHTML = require('../../../app/views/components/week-view/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');
const eventTypes = require('../../../app/data/event-types');

let weekViewEl;
let weekViewAPI;

describe('WeekView Events', () => { //eslint-disable-line
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
      endDate: new Date(2019, 11, 7)
    });
  });

  afterEach(() => {
    weekViewAPI.destroy();
    cleanup([
      '.full-height',
      '#test-script'
    ]);
  });

  it('triggers a `weekrendered` event when the week is changed', (done) => {
    const spyEvent = spyOnEvent($(weekViewEl), 'weekrendered');
    weekViewAPI.showWeek(new Date(2019, 11, 1), new Date(2019, 11, 7));

    expect(spyEvent).toHaveBeenTriggered();
    done();
  });

  it('triggers a `onChangeWeek` event when the month is rendered', (done) => {
    const startDate = new Date(2019, 11, 1);
    const endDate = new Date(2019, 11, 7);

    weekViewAPI.destroy();
    weekViewAPI = new WeekView(weekViewEl, {
      eventTypes,
      events: [],
      showViewChanger: false,
      startDate,
      endDate,
      onChangeWeek: (args) => {
        expect(args).toBeTruthy();
        expect(args.api).toBeTruthy();
        expect(args.elem).toBeTruthy();
        expect(args.startDate.getTime()).toEqual(startDate.getTime());
        expect(args.endDate.getTime()).toEqual(endDate.getTime());
        expect(args.isDayView).toEqual(false);
        done();
      }
    });
  });

  it('triggers a `eventclick` when events are clicked', (done) => {
    weekViewAPI.addEvent({
      id: '1',
      subject: 'Test Event One',
      status: 'pending',
      starts: '2019-12-02T15:00:00.000',
      ends: '2019-12-02T16:00:00.000',
      type: 'dto',
      isAllDay: 'false'
    });

    const spyEvent = spyOnEvent($(weekViewEl), 'eventclick');
    weekViewEl.querySelector('a.calendar-event').click();

    expect(spyEvent).toHaveBeenTriggered();
    done();
  });

  it('triggers a `eventdblclick` when events are dblclicked', (done) => {
    weekViewAPI.addEvent({
      id: '1',
      subject: 'Test Event One',
      status: 'pending',
      starts: '2019-12-02T15:00:00.000',
      ends: '2019-12-02T16:00:00.000',
      type: 'dto',
      isAllDay: 'false'
    });

    const spyEvent = spyOnEvent($(weekViewEl), 'eventdblclick');
    $('a.calendar-event').dblclick();

    expect(spyEvent).toHaveBeenTriggered();
    done();
  });
});
