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

    Locale.set('en-US');

    monthviewAPI = new MonthView(monthviewEl, {
      month: 8,
      year: 2018,
      activeDate: new Date(2018, 8, 10)
    });
  });

  afterEach(() => {
    monthviewAPI?.destroy();
    cleanup();
  });

  it('triggers a `monthrendered` event when the month is rendered', (done) => {
    const callback = jest.fn();
    $(monthviewEl).on('monthrendered', callback);
    monthviewAPI.showMonth(7, 2018);

    expect(callback).toHaveBeenCalled();
    done();
  });

  it('triggers a `selected` event when the day is selected', (done) => {
    monthviewAPI?.destroy();
    monthviewAPI = new MonthView(monthviewEl, {
      month: 8,
      year: 2018,
      activeDate: new Date(2018, 8, 10),
      selctable: true
    });
    const callback = jest.fn();
    $(monthviewEl).on('selected', callback);
    monthviewEl.querySelector('tr:nth-child(2) td:nth-child(1)').click();

    expect(callback).toHaveBeenCalled();
    done();
  });
});
