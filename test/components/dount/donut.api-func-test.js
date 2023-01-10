/**
 * @jest-environment jsdom
 */
import { cleanup, triggerContextmenu } from '../../helpers/func-utils';
import { Pie } from '../../../src/components/pie/pie';

const donutHTML = `
<div class="row">
  <div class="two-thirds column">
      <div class="widget">
        <div class="widget-header">
          <h2 class="widget-title">Donut Chart Title</h2>
        </div>
        <div class="widget-content">
          <div id="pie-donut-example" class="chart-container">
          </div>
        </div>
      </div>
  </div>
</div>`;

let donutEl;
let donutObj;

const dataset = [{
  data: [{
    name: 'Component A',
    value: 16
  }, {
    name: 'Component B',
    value: 12
  }, {
    name: 'Component C',
    value: 14
  }],
  centerLabel: 'Donut Chart'
}];

describe('Donut Chart API', () => {
  beforeEach(() => {
    donutEl = null;
    donutObj = null;
    document.body.insertAdjacentHTML('afterbegin', donutHTML);
    donutEl = document.body.querySelector('#pie-donut-example');

    donutObj = new Pie(donutEl, { type: 'donut', dataset });
  });

  afterEach(() => {
    donutObj.destroy();
    cleanup();
  });

  it('should fire contextmenu event', () => {
    const callback = jest.fn();
    $(donutEl).on('contextmenu', callback);
    $(donutEl).on('contextmenu', (e, el, d) => {
      expect(d.data).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelector('.slice'));

    expect(callback).toHaveBeenCalled();
  });
});
