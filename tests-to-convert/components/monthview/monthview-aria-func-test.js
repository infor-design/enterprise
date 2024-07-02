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

const monthviewHTML = `<div class="row">
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

describe('MonthView Aria', () => {
  beforeEach(() => {
    monthviewEl = null;
    monthviewAPI = null;
    document.body.insertAdjacentHTML('afterbegin', monthviewHTML);
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

  it('should update ARIA labels with calendar open', () => {
    expect(document.querySelector('.monthview-table').getAttribute('aria-label')).toEqual('Calendar');
    expect(document.querySelector('tbody td.is-selected').getAttribute('aria-label')).toEqual('Monday, September 10, 2018');
    expect(document.querySelector('tbody td span:not(.alternate) .day-text').getAttribute('aria-hidden')).toEqual('true');
  });
});
