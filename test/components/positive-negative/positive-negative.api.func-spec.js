import { cleanup, triggerContextmenu } from '../../helpers/func-utils';
import { Column } from '../../../src/components/column/column';

const pnHTML = require('../../../app/views/components/positive-negative/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

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
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', pnHTML);
    pnEl = document.body.querySelector('#positive-negative-example');

    pnObj = new Column(pnEl, { type: 'positive-negative', dataset, formatterString: '.2s' });
  });

  afterEach(() => {
    pnObj.destroy();
    cleanup();
  });

  it('Should fire contextmenu event', () => {
    const spyEvent = spyOnEvent(pnEl, 'contextmenu');
    const result = { name: 'Jan', value: 4000, target: 13000 };
    $(pnEl).on('contextmenu', (e, el, d) => {
      expect(d).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelector('.target-bar'));

    expect(spyEvent).toHaveBeenCalled();
  });
});
