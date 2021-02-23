import { triggerContextmenu } from '../../helpers/func-utils';
import { Pie } from '../../../src/components/pie/pie';

const donutHTML = require('../../../app/views/components/donut/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let donutEl;
let svgEl;
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
    svgEl = null;
    donutObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', donutHTML);
    donutEl = document.body.querySelector('#pie-donut-example');
    svgEl = document.body.querySelector('.svg-icons');

    donutObj = new Pie(donutEl, { type: 'donut', dataset });
  });

  afterEach(() => {
    donutObj.destroy();
    svgEl.parentNode.removeChild(svgEl);
    donutEl.parentNode.removeChild(donutEl);

    const rowEl = document.body.querySelector('.row');
    rowEl.parentNode.removeChild(rowEl);
  });

  it('Should fire contextmenu event', () => {
    const spyEvent = spyOnEvent(donutEl, 'contextmenu');
    const result = { name: 'Component A', value: 16 };
    $(donutEl).on('contextmenu', (e, el, d) => {
      expect(d.data).toEqual(jasmine.objectContaining(result));
    });
    triggerContextmenu(document.body.querySelector('.slice'));

    expect(spyEvent).toHaveBeenTriggered();
  });
});
