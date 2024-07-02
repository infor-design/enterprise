/**
 * @jest-environment jsdom
 */
import { cleanup, triggerContextmenu } from '../../helpers/func-utils';
import { Column } from '../../../src/components/column/column';

const pnHTML = `<div class="row">
  <div class="two-thirds column">
      <div class="widget">
        <div class="widget-header">
          <h2 class="widget-title">Positive Negative Column Chart</h2>
        </div>
        <div class="widget-content">
          <div id="positive-negative-example" class="chart-container">
          </div>
        </div>
      </div>
  </div>
</div>

{{={{{ }}}=}}

<script>
$('body').on('initialized', function () {

/*
** Type: 'column-positive-negative'
** Required: Value & Target
** Optional: Legends & Colors
**/
var dataset = [{
    data: [{
        name: 'Jan',
        value: 4000,
        target: 13000,
        attributes: [
         { name: 'id', value: 'positive-negative-jan' },
         { name: 'data-automation-id', value: 'automation-id-positive-negative-jan' }
       ]
    }, {
        name: 'Feb',
        value: 9000,
        target: 11000,
        attributes: [
         { name: 'id', value: 'positive-negative-feb' },
         { name: 'data-automation-id', value: 'automation-id-positive-negative-feb' }
       ]
    }, {
        name: 'Mar',
        value: 2000,
        target: 7000,
        attributes: [
         { name: 'id', value: 'positive-negative-mar' },
         { name: 'data-automation-id', value: 'automation-id-positive-negative-mar' }
       ]
    }, {
        name: 'Apr',
        value: 4000,
        target: 8000,
        attributes: [
         { name: 'id', value: 'positive-negative-apr' },
         { name: 'data-automation-id', value: 'automation-id-positive-negative-apr' }
       ]
    }, {
        name: 'May',
        value: 2000,
        target: 14000,
        attributes: [
         { name: 'id', value: 'positive-negative-may' },
         { name: 'data-automation-id', value: 'automation-id-positive-negative-may' }
       ]
    }, {
        name: 'Jun',
        value: 4000,
        target: 9000,
        attributes: [
         { name: 'id', value: 'positive-negative-jun' },
         { name: 'data-automation-id', value: 'automation-id-positive-negative-jun' }
       ]
    }, {
        name: 'Jul',
        value: -8000,
        target: 12000,
        attributes: [
         { name: 'id', value: 'positive-negative-jul' },
         { name: 'data-automation-id', value: 'automation-id-positive-negative-jul' }
       ]
    }, {
        name: 'Aug',
        value: -6000,
        target: 5000,
        attributes: [
         { name: 'id', value: 'positive-negative-aug' },
         { name: 'data-automation-id', value: 'automation-id-positive-negative-aug' }
       ]
    }, {
        name: 'Sep',
        value: -1000,
        target: 7000,
        attributes: [
         { name: 'id', value: 'positive-negative-sep' },
         { name: 'data-automation-id', value: 'automation-id-positive-negative-sep' }
       ]
    }, {
        name: 'Oct',
        value: -12000,
        target: 13000,
        attributes: [
         { name: 'id', value: 'positive-negative-oct' },
         { name: 'data-automation-id', value: 'automation-id-positive-negative-oct' }
       ]
    }, {
        name: 'Nov',
        value: -7000,
        target: 6000,
        attributes: [
         { name: 'id', value: 'positive-negative-nov' },
         { name: 'data-automation-id', value: 'automation-id-positive-negative-nov' }
       ]
    }, {
        name: 'Dec',
        value: -3000,
        target: 7000,
        attributes: [
         { name: 'id', value: 'positive-negative-dec' },
         { name: 'data-automation-id', value: 'automation-id-positive-negative-dec' }
       ]
    }],
    legends: {
      target: 'Revenue',
      positive: 'Profit',
      negative: 'Loss'
    },
    colors: {
      target: 'neutral',
      positive: 'good',
      negative: 'error'
    },
    attributes: {
      target: [
       { name: 'id', value: 'positive-negative-revenue' },
       { name: 'data-automation-id', value: 'automation-id-positive-negative-revenue' }
     ],
      positive: [
       { name: 'id', value: 'positive-negative-profit' },
       { name: 'data-automation-id', value: 'automation-id-positive-negative-profit' }
     ],
      negative: [
       { name: 'id', value: 'positive-negative-loss' },
       { name: 'data-automation-id', value: 'automation-id-positive-negative-loss' }
     ]
    }
  }];

    $('#positive-negative-example').chart({
      type: 'positive-negative',
      dataset: dataset,
      formatterString: '.2s'
    })
    .on('selected', function (e, args) {
      console.log(args);
    });

});
</script>`;

let pnEl;
let pnObj;

const dataset = [{
  data: [{
    name: 'Jan',
    value: 4000,
    target: 13000
  }, {
    name: 'Feb',
    value: 9000,
    target: 11000
  }, {
    name: 'Mar',
    value: 2000,
    target: 7000
  }, {
    name: 'Apr',
    value: 4000,
    target: 8000
  }, {
    name: 'May',
    value: 2000,
    target: 14000
  }, {
    name: 'Jun',
    value: 4000,
    target: 9000
  }, {
    name: 'Jul',
    value: -8000,
    target: 12000
  }, {
    name: 'Aug',
    value: -6000,
    target: 5000
  }, {
    name: 'Sep',
    value: -1000,
    target: 7000
  }, {
    name: 'Oct',
    value: -12000,
    target: 13000
  }, {
    name: 'Nov',
    value: -7000,
    target: 6000
  }, {
    name: 'Dec',
    value: -3000,
    target: 7000
  }],
  legends: {
    target: 'Revenue',
    positive: 'Profit',
    negative: 'Loss'
  },
  colors: {
    target: 'neutral',
    positive: 'good',
    negative: 'error'
  }
}];

describe('Positive Negative Chart API', () => {
  beforeEach(() => {
    pnEl = null;
    pnObj = null;
    document.body.insertAdjacentHTML('afterbegin', pnHTML);
    pnEl = document.body.querySelector('#positive-negative-example');

    pnObj = new Column(pnEl, { type: 'positive-negative', dataset, formatterString: '.2s' });
  });

  afterEach(() => {
    pnObj.destroy();
    cleanup();
  });

  it('should fire contextmenu event', () => {
    const callback = jest.fn();
    $(pnEl).on('contextmenu', callback);
    $(pnEl).on('contextmenu', (e, el, d) => {
      expect(d).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelector('.target-bar'));

    expect(callback).toHaveBeenCalled();
  });
});
