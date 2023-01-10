import { cleanup, triggerContextmenu } from '../../helpers/func-utils';
import { Pie } from '../../../src/components/pie/pie';

const donutHTML = require('../../../app/views/components/donut/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

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
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', donutHTML);
    donutEl = document.body.querySelector('#pie-donut-example');

    donutObj = new Pie(donutEl, { type: 'donut', dataset });
  });

  afterEach(() => {
    donutObj.destroy();
    cleanup();
  });

  it('Should fire contextmenu event', () => {
    const callback = jest.fn();
    $(donutEl).on('contextmenu', callback);
    $(donutEl).on('contextmenu', (e, el, d) => {
      expect(d.data).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelector('.slice'));

    expect(callback).toHaveBeenCalled();
  });
});
