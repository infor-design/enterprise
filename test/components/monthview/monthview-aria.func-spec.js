import { MonthView } from '../../../src/components/monthview/monthview';
import { Locale } from '../../../src/components/locale/locale';
import { cleanup } from '../../helpers/func-utils';

require('../../../src/components/locale/cultures/ar-SA.js');
require('../../../src/components/locale/cultures/ar-EG.js');

const monthviewHTML = require('../../../app/views/components/monthview/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let monthviewEl;
let monthviewAPI;

describe('MonthView Aria', () => {
  beforeEach(() => {
    monthviewEl = null;
    monthviewAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', monthviewHTML);
    monthviewEl = document.body.querySelector('.monthview');

    Locale.addCulture('ar-SA', Soho.Locale.cultures['ar-SA'], Soho.Locale.languages['ar']); //eslint-disable-line
    Locale.addCulture('en-US', Soho.Locale.cultures['en-US'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.set('en-US');

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

  it('should update ARIA labels with calendar open', () => {
    expect(document.querySelector('.monthview-table').getAttribute('aria-label')).toEqual('Calendar');
    expect(document.querySelector('tbody td.is-selected').getAttribute('aria-label')).toEqual('Monday, September 10, 2018');
    expect(document.querySelector('tbody td span:not(.alternate) .day-text').getAttribute('aria-hidden')).toEqual('true');
  });
});
