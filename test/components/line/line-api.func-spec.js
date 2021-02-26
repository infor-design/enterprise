import { triggerContextmenu, cleanup } from '../../helpers/func-utils';
import { Line } from '../../../src/components/line/line';

const lineHTML = require('../../../app/views/components/line/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let lineEl;
let lineObj;

const dataset = [{
  data: [{
    name: 'Jan',
    value: 1211,
    depth: 4
  }, {
    name: 'Feb',
    value: 1111
  }, {
    name: 'Mar',
    value: 1411
  }, {
    name: 'Apr',
    value: 1011
  }, {
    name: 'May',
    value: 1411
  }, {
    name: 'Jun',
    value: 8111
  }],
  name: 'Component A',
  legendShortName: 'Comp A',
  legendAbbrName: 'A'
}, {
  data: [{
    name: 'Jan',
    value: 2211
  }, {
    name: 'Feb',
    value: 2111
  }, {
    name: 'Mar',
    value: 2411
  }, {
    name: 'Apr',
    value: 2011
  }, {
    name: 'May',
    value: 2411
  }, {
    name: 'Jun',
    value: 2811
  }],
  name: 'Component B',
  legendShortName: 'Comp B',
  legendAbbrName: 'A'
}, {
  data: [{
    name: 'Jan',
    value: 3211
  }, {
    name: 'Feb',
    value: 3111
  }, {
    name: 'Mar',
    value: 3411
  }, {
    name: 'Apr',
    value: 3011
  }, {
    name: 'May',
    value: 3411
  }, {
    name: 'Jun',
    value: 3811
  }],
  name: 'Component C',
  legendShortName: 'Comp C',
  legendAbbrName: 'C'
}];

describe('Line Chart API', () => {
  beforeEach(() => {
    lineEl = null;
    lineObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', lineHTML);
    lineEl = document.body.querySelector('#line-example');

    lineObj = new Line(lineEl, { type: 'line', dataset });
  });

  afterEach(() => {
    lineObj.destroy();
    cleanup([
      '.svg-icons',
      '.row',
      '#line-script'
    ]);
  });

  it('Should fire contextmenu event', () => {
    const spyEvent = spyOnEvent(lineEl, 'contextmenu');
    const result = { name: 'Jan', value: 1211, depth: 4 };
    $(lineEl).on('contextmenu', (e, el, d) => {
      expect(d).toEqual(jasmine.objectContaining(result));
    });
    triggerContextmenu(document.body.querySelector('[data-group-id="0"] .dot'));

    expect(spyEvent).toHaveBeenTriggered();
  });
});
