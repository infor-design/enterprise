import { MonthView } from '../../../src/components/monthview/monthview';
import { Locale } from '../../../src/components/locale/locale';
import { cleanup } from '../../helpers/func-utils';

require('../../../src/components/locale/cultures/ar-EG.js');
require('../../../src/components/locale/cultures/ar-SA.js');
require('../../../src/components/locale/cultures/da-DK.js');

const datepickerHTML = require('../../../app/views/components/monthview/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let monthviewEl;
let monthviewAPI;

describe('Monthview API', () => {
  beforeEach(() => {
    monthviewEl = null;
    monthviewAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', datepickerHTML);
    monthviewEl = document.body.querySelector('.monthview');

    Locale.addCulture('ar-SA', Soho.Locale.cultures['ar-SA'], Soho.Locale.languages['ar']); //eslint-disable-line
    Locale.addCulture('ar-EG', Soho.Locale.cultures['ar-EG'], Soho.Locale.languages['ar']); //eslint-disable-line
    Locale.addCulture('en-US', Soho.Locale.cultures['en-US'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.addCulture('ja-JP', Soho.Locale.cultures['ja-JP'], Soho.Locale.languages['ja']); //eslint-disable-line
    Locale.addCulture('sv-SE', Soho.Locale.cultures['sv-SE'], Soho.Locale.languages['sv']); //eslint-disable-line
    Locale.addCulture('en-GB', Soho.Locale.cultures['en-GB'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.addCulture('de-DE', Soho.Locale.cultures['de-DE'], Soho.Locale.languages['de']); //eslint-disable-line
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
    cleanup();
  });

  it('triggers a `monthrendered` event when the month is rendered', (done) => {
    const spyEvent = spyOnEvent($(monthviewEl), 'monthrendered');
    monthviewAPI.showMonth(7, 2018);

    expect(spyEvent).toHaveBeenTriggered();
    done();
  });

  it('triggers a `selected` event when the day is selected', (done) => {
    monthviewAPI.destroy();
    monthviewAPI = new MonthView(monthviewEl, {
      month: 8,
      year: 2018,
      activeDate: new Date(2018, 8, 10),
      selctable: true
    });

    const spyEvent = spyOnEvent($(monthviewEl), 'selected');
    monthviewEl.querySelector('tr:nth-child(2) td:nth-child(1)').click();

    expect(spyEvent).toHaveBeenTriggered();
    done();
  });
});
