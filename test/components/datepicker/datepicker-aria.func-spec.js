import { DatePicker } from '../../../src/components/datepicker/datepicker';
import { Locale } from '../../../src/components/locale/locale';
import { cleanup } from '../../helpers/func-utils';

require('../../../src/components/locale/cultures/ar-SA.js');
require('../../../src/components/locale/cultures/ar-EG.js');

const datepickerHTML = require('../../../app/views/components/datepicker/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let datepickerEl;
let datepickerAPI;

describe('DatePicker Aria', () => {
  beforeEach(() => {
    datepickerEl = null;
    datepickerAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', datepickerHTML);
    datepickerEl = document.body.querySelector('.datepicker');

    Locale.addCulture('ar-SA', Soho.Locale.cultures['ar-SA'], Soho.Locale.languages['ar']); //eslint-disable-line
    Locale.addCulture('en-US', Soho.Locale.cultures['en-US'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.set('en-US');

    datepickerAPI = new DatePicker(datepickerEl);
  });

  afterEach(() => {
    datepickerAPI.destroy();
    cleanup();
  });

  it('Should set ARIA labels', () => {
    expect(document.querySelector('label[for="date-field-normal"] span').innerHTML).toEqual('. Press Down arrow to select');
  });

  it('Should update ARIA labels with calendar open', (done) => {
    datepickerAPI.setValue('11/06/2018');
    datepickerAPI.openCalendar();

    setTimeout(() => {
      expect(document.querySelector('#monthview-popup .monthview-table').getAttribute('aria-label')).toEqual('Calendar');
      expect(document.querySelector('#monthview-popup tbody td.is-selected').getAttribute('aria-label')).toEqual('Tuesday, November 6, 2018');
      expect(document.querySelector('#monthview-popup tbody td span:not(.alternate) .day-text').getAttribute('aria-hidden')).toEqual('true');
      done();
    }, 100);
  });
});
