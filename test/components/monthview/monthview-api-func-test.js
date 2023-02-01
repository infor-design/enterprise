/**
 * @jest-environment jsdom
 */
import { MonthView } from '../../../src/components/monthview/monthview';
import { Locale } from '../../../src/components/locale/locale';
import { cleanup } from '../../helpers/func-utils';

Soho.Locale = Locale;

require('../../../src/components/locale/cultures/ar-EG.js');
require('../../../src/components/locale/cultures/ar-SA.js');
require('../../../src/components/locale/cultures/da-DK.js');
require('../../../src/components/locale/cultures/en-US.js');
require('../../../src/components/datepicker/datepicker.jquery.js');

const datepickerHTML = `<div class="row">
  <div class="twelve columns">
    <div class="monthview" data-init="false">
    </div>
  </div>
</div>


<script>
  $('body').on('initialized', function() {
    $('.monthview').monthview({
      attributes: [
        { name: 'id', value: 'monthview-id' },
        { name: 'data-automation-id', value: 'monthview-automation-id' }
      ]
    });
  });
</script>
`;

let monthviewEl;
let monthviewAPI;

describe('Monthview API', () => {
  beforeEach(() => {
    monthviewEl = null;
    monthviewAPI = null;

    document.body.insertAdjacentHTML('afterbegin', datepickerHTML);
    monthviewEl = document.body.querySelector('.monthview');

    jest
      .useFakeTimers()
      .setSystemTime(new Date('2018-10-10'));

    Locale.set('en-US');

    monthviewAPI = new MonthView(monthviewEl, {
      month: 8,
      year: 2018,
      activeDate: new Date(2018, 8, 10),
    });
  });

  afterEach(() => {
    monthviewAPI?.destroy();
    cleanup();
  });

  it('should be defined', () => {
    expect(monthviewAPI).toBeTruthy();
  });

  it('should render a monthview', () => {
    expect(monthviewAPI.currentCalendar.name).toEqual('gregorian');
    expect(document.body.querySelectorAll('.monthview-table tr').length).toEqual(7);
    expect(document.body.querySelectorAll('.monthview-table td').length).toEqual(42);
  });

  it('should render a selected day', () => {
    expect(monthviewAPI.currentCalendar.name).toEqual('gregorian');
    expect(document.body.querySelector('.monthview-table td.is-selected').textContent).toEqual('10');
    expect(document.body.querySelector('.monthview-table td.is-selected').getAttribute('aria-label')).toEqual('Monday, September 10, 2018');
  });

  it.skip('should render month text and start day', () => {
    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('Sep 2018');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('Sun');

    Locale.set('sv-SE');
    Soho.Locale.set('sv-SE'); //eslint-disable-line
    monthviewAPI.showMonth(7, 2018);

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('augusti 2018');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('mån');

    Locale.set('ar-SA');
    Soho.Locale.set('ar-SA'); //eslint-disable-line
    monthviewAPI.showMonth(7, 2018);

    expect(document.getElementById('monthview-datepicker-field').textContent).toContain('1439');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('الأحد');
  });

  it.skip('should render based on locale setting', () => {
    monthviewAPI?.destroy();
    monthviewAPI = new MonthView(monthviewEl, {
      month: 4,
      year: 2019,
      locale: 'da-DK'
    });

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('maj 2019');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('man');
    expect(document.body.querySelector('thead tr th:last-child').textContent.trim()).toEqual('søn');
  });

  it('should render disabled days', () => {
    monthviewAPI?.destroy();
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

  it('should move to next month and back', () => {
    $('button.next').click();

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('Oct 2018');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('Sun');
    $('button.prev').click();

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('Sep 2018');
    expect(document.body.querySelector('thead tr th:first-child').textContent.trim()).toEqual('Sun');
  });

  it('should destroy monthview', () => {
    monthviewAPI?.destroy();

    expect(document.body.querySelector('.monthview-table')).toBeFalsy();
  });

  it.skip('should populate header ', () => {
    Locale.set('en-US');
    Soho.Locale.set('en-US'); //eslint-disable-line
    monthviewAPI.showMonth(7, 2018);

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('Aug 2018');

    Locale.set('ja-JP');
    Soho.Locale.set('ja-JP'); //eslint-disable-line
    monthviewAPI.showMonth(7, 2018);

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('2018年 8月');

    Locale.set('ar-SA');
    Soho.Locale.set('ar-SA'); //eslint-disable-line
    monthviewAPI.showMonth(7, 2018);

    expect(document.getElementById('monthview-datepicker-field').textContent).toContain('1439');

    Locale.set('de-DE');
    Soho.Locale.set('de-DE'); //eslint-disable-line
    monthviewAPI.showMonth(7, 2018);

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('Aug 2018');
  });

  it.skip('should move to next month and back to today', () => {
    document.body.querySelector('button.next').click();

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('Oct 2018');
    document.body.querySelector('.hyperlink.today').click();

    const testDate = new Date();
    const stringDate = testDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual(stringDate);
  });

  it('should be able to select a day by date', () => {
    monthviewAPI.selectDay(new Date(2018, 7, 15));

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('Aug 2018');

    monthviewAPI.selectDay(new Date(2018, 8, 22));

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('Sep 2018');
  });

  it('should be able to select a day by key', () => {
    monthviewAPI.selectDay('20180820');

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('Aug 2018');

    monthviewAPI.selectDay('20180922');

    expect(document.getElementById('monthview-datepicker-field').textContent).toEqual('Sep 2018');
  });

  it.skip('should populate header starting from given day of the week', () => {
    monthviewAPI?.destroy();
    monthviewAPI = new MonthView(monthviewEl, {
      month: 8,
      year: 2018,
      activeDate: new Date(2018, 8, 10),
      firstDayOfWeek: 1
    });
    expect(document.getElementsByClassName('monthview-table')[0].children[0].children[0].children[0].innerHTML).toEqual('Mon');
  });

  describe('loadLegend', () => {
    it('should do nothing if legendList is empty.', () => {
      monthviewAPI.loadLegend();
      monthviewAPI.loadLegend([]);
    });

    it.skip('should be to able populate alternate days.', () => {
      jest.spyOn(monthviewAPI, 'setLegendColor');
      monthviewAPI?.destroy();
      monthviewAPI = new MonthView(monthviewEl, {
        month: 6,
        year: 2022,
        activeDate: new Date(2022, 6, 10),
        firstDayOfWeek: 1,
      });

      const legendList = [
        {
          name: 'Schedule',
          color: 'azure04',
          dates: ['2022-06-30T00:00', '2022-07-15T00:00', '2022-08-01T00:00'],
        },
      ];
      monthviewAPI.loadLegend(legendList);

      expect(monthviewAPI.setLegendColor).toHaveBeenCalledTimes(3);
    });
  });
});
