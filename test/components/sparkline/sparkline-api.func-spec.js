import { cleanup, triggerContextmenu } from '../../helpers/func-utils';
import { Sparkline } from '../../../src/components/sparkline/sparkline';

const sparklineHTML = require('../../../app/views/components/sparkline/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let sparklineEl;
let sparklineObj;

const sparkData1 = [{
  data: [25, 20, 55, 28, 41, 30, 50, 27, 24, 27],
  name: 'Inventory'
}];

const sparkData2 = [{
  data: [25, 20, 55, 28, 41, 30, 50, 27, 24, 27],
  name: 'Inventory'
}, {
  data: [40, 30, 40, 16, 50, 17, 15, 39, 15, 18],
  name: 'Demand'
}];

const sparkData3 = [{
  data: [25, 20, 61, 28, 10, 30, 50, 35, 13, 27],
  name: 'Inventory'
}];

const sparkData4 = [{
  data: [25, 20, 55, 28, 41, 30, 50, 22, 16, 27],
  name: 'Inventory'
}];

describe('Sparkline Chart API', () => {
  beforeEach(() => {
    sparklineEl = null;
    sparklineObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', sparklineHTML);
    sparklineEl = document.body.querySelector('#sparkline-chart-example-1');

    sparklineObj = new Sparkline(sparklineEl, { type: 'sparkline', dataset: sparkData1 });
  });

  afterEach(() => {
    sparklineObj.destroy();
    cleanup();
  });

  it('Should fire contextmenu event with sparkline', () => {
    const callback = jest.fn();
    $(sparklineEl).on('contextmenu', callback);
    $(sparklineEl).on('contextmenu', (e, el, d) => {
      expect(d).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelectorAll('.point')[0]);

    expect(callback).toHaveBeenCalled();
  });

  it('Should fire contextmenu event with sparkline-dots-n-peak', () => {
    sparklineObj.destroy();
    sparklineObj = new Sparkline(sparklineEl, { type: 'sparkline-dots-n-peak', dataset: sparkData1 });
    const callback = jest.fn();
    $(sparklineEl).on('contextmenu', callback);
    $(sparklineEl).on('contextmenu', (e, el, d) => {
      expect(d).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelectorAll('.point')[2]);

    expect(callback).toHaveBeenCalled();
  });

  it('Should fire contextmenu event with sparkline-peak', () => {
    sparklineObj.destroy();
    sparklineObj = new Sparkline(sparklineEl, { type: 'sparkline-peak', dataset: sparkData2 });
    const callback = jest.fn();
    $(sparklineEl).on('contextmenu', callback);
    $(sparklineEl).on('contextmenu', (e, el, d) => {
      expect(d).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelectorAll('.point')[2]);

    expect(callback).toHaveBeenCalled();
  });

  it('Should fire contextmenu event with sparkline-medianrange-n-peak', () => {
    sparklineObj.destroy();
    sparklineObj = new Sparkline(sparklineEl, { type: 'sparkline-medianrange-n-peak', dataset: sparkData3 });
    const callback = jest.fn();
    $(sparklineEl).on('contextmenu', callback);
    $(sparklineEl).on('contextmenu', (e, el, d) => {
      expect(d).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelectorAll('.point')[2]);

    expect(callback).toHaveBeenCalled();
  });

  it('Should fire contextmenu event with sparkline-minmax', () => {
    sparklineObj.destroy();
    sparklineObj = new Sparkline(sparklineEl, { type: 'sparkline-minmax', dataset: sparkData4 });
    const callback = jest.fn();
    $(sparklineEl).on('contextmenu', callback);
    $(sparklineEl).on('contextmenu', (e, el, d) => {
      expect(d).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelectorAll('.point')[2]);

    expect(callback).toHaveBeenCalled();
  });
});
