/**
 * @jest-environment jsdom
 */
import { cleanup, triggerContextmenu } from '../../helpers/func-utils';
import { Pie } from '../../../src/components/pie/pie';

const pieHTML = `
<div class="row">
  <div class="two-thirds column">
      <div class="widget">
        <div class="widget-header">
          <h2 class="widget-title">Pie Chart Title</h2>
        </div>
        <div class="widget-content">
          <div id="pie-chart-example" class="chart-container">
          </div>
        </div>
      </div>
  </div>
</div>

{{={{{ }}}=}}

<script>
$('body').on('initialized', function () {

  var pieData = [{
      data: [{
          name: 'Item A',
          value: 10.1,
          id: 'item-a',
          attributes: [
            { name: 'id', value: 'item-a' },
            { name: 'data-automation-id', value: 'item-a-automation-id' }
          ],
          tooltip: 'Item A <b>{{percent}}</b>'
      }, {
          name: 'Item B',
          value: 12.2,
          id: 'item-b',
          attributes: [
            { name: 'id', value: 'item-b' },
            { name: 'data-automation-id', value: 'item-b-automation-id' }
          ],
          tooltip: 'Item B <b>{{percent}}</b>'
      }, {
          name: 'Item C',
          value: 14.35,
          id: 'item-c',
          attributes: [
            { name: 'id', value: 'item-c' },
            { name: 'data-automation-id', value: 'item-c-automation-id' }
          ],
          tooltip: 'Item C <b>{{percent}}</b>'
      }, {
          name: 'Item D',
          value: 15.6,
          id: 'item-d',
          attributes: [
            { name: 'id', value: 'item-d' },
            { name: 'data-automation-id', value: 'item-d-automation-id' }
          ],
          tooltip: 'Item D <b>{{percent}}</b>'
      }, {
          name: 'Item E',
          value: 21.6,
          id: 'item-e',
          attributes: [
            { name: 'id', value: 'item-e' },
            { name: 'data-automation-id', value: 'item-e-automation-id' }
          ],
          tooltip: 'Item E <b>{{percent}}</b>'
      }, {
          name: 'Item F',
          value: 41.6,
          id: 'item-f',
          id: 'item-f',
          attributes: [
            { name: 'id', value: 'item-f' },
            { name: 'data-automation-id', value: 'item-f-automation-id' }
          ],
          tooltip: 'Item F <b>{{percent}}</b>'
      }]
    }];

  $('#pie-chart-example').chart({type: 'pie', dataset: pieData})
  .on('selected', function(e, args) {
    if (args[0] && args[0].data) {
      console.log(args[0].data, args[0].data.url);
    }
  });

});
</script>
`;

let pieEl;
let pieObj;

const dataset = [{
  data: [{
    name: 'Item A',
    value: 10.1,
    id: 'ca',
    tooltip: 'Item A <b>{{percent}}</b>'
  }, {
    name: 'Item B',
    value: 12.2,
    id: 'cb',
    tooltip: 'Item B <b>{{percent}}</b>'
  }, {
    name: 'Item C',
    value: 14.35,
    tooltip: 'Item C <b>{{percent}}</b>'
  }, {
    name: 'Item D',
    value: 15.6,
    tooltip: 'Item D <b>{{percent}}</b>'
  }, {
    name: 'Item E',
    value: 21.6,
    tooltip: 'Item E <b>{{percent}}</b>'
  }, {
    name: 'Item F',
    value: 41.6,
    tooltip: 'Item F <b>{{percent}}</b>'
  }]
}];

describe('Pie Chart API', () => {
  beforeEach(() => {
    pieEl = null;
    pieObj = null;
    document.body.insertAdjacentHTML('afterbegin', pieHTML);
    pieEl = document.body.querySelector('#pie-chart-example');

    pieObj = new Pie(pieEl, { type: 'pie', dataset });
  });

  afterEach(() => {
    pieObj.destroy();
    cleanup();
  });

  it('should fire contextmenu event', () => {
    const callback = jest.fn();
    $(pieEl).on('contextmenu', callback);
    $(pieEl).on('contextmenu', (e, el, d) => {
      expect(d.data).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelector('.slice'));

    expect(callback).toHaveBeenCalled();
  });
});
