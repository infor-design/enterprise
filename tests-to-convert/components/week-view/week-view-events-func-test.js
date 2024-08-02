/**
 * @jest-environment jsdom
 */
import { WeekView } from '../../../src/components/week-view/week-view';
import { Locale } from '../../../src/components/locale/locale';
import { cleanup } from '../../helpers/func-utils';

Soho.Locale = Locale;

require('../../../src/components/locale/cultures/en-US.js');
require('../../../src/components/locale/cultures/ar-EG.js');
require('../../../src/components/locale/cultures/ar-SA.js');

const weekViewHTML = `<div class="full-height full-width">
  <div class="week-view" data-init="false">
  </div>
</div>`;
const eventTypes = require('../../../app/data/event-types');

require('../../../src/components/datepicker/datepicker.jquery.js');

let weekViewEl;
let weekViewAPI;

describe('WeekView Events', () => { //eslint-disable-line
  beforeEach(() => {
    weekViewEl = null;
    weekViewAPI = null;
    document.body.insertAdjacentHTML('afterbegin', weekViewHTML);
    weekViewEl = document.body.querySelector('.week-view');

    Locale.set('en-US');
    weekViewAPI = new WeekView(weekViewEl, {
      eventTypes,
      events: [],
      showViewChanger: false,
      startDate: new Date(2019, 11, 1),
      endDate: new Date(2019, 11, 7)
    });
  });

  afterEach(() => {
    weekViewAPI?.destroy();
    cleanup();
  });

  it('triggers a `weekrendered` event when the week is changed', (done) => {
    const callback = jest.fn();
    $(weekViewEl).on('weekrendered', callback);

    weekViewAPI.showWeek(new Date(2019, 11, 1), new Date(2019, 11, 7));

    expect(callback).toHaveBeenCalled();
    done();
  });

  it('triggers a `onChangeWeek` event when the month is rendered', (done) => {
    const startDate = new Date(2019, 11, 1);
    const endDate = new Date(2019, 11, 7);

    weekViewAPI?.destroy();
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

    const callback = jest.fn();
    $(weekViewEl).on('eventclick', callback);

    weekViewEl.querySelector('a.calendar-event').click();

    expect(callback).toHaveBeenCalled();
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

    const callback = jest.fn();
    $(weekViewEl).on('eventdblclick', callback);

    $('a.calendar-event').dblclick();

    expect(callback).toHaveBeenCalled();
    done();
  });
});
