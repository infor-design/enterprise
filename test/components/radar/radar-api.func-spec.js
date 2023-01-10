import { cleanup, triggerContextmenu } from '../../helpers/func-utils';
import { Radar } from '../../../src/components/radar/radar';

const radarHTML = require('../../../app/views/components/radar/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let radarEl;
let radarObj;
const dataset = [{
  data: [
    { name: 'Battery Life', value: 0.22 },
    { name: 'Brand', value: 0.28 },
    { name: 'Cost', value: 0.29 },
    { name: 'Design', value: 0.17 },
    { name: 'Connectivity', value: 0.22 },
    { name: 'Screen', value: 0.02 },
    { name: 'Price', value: 0.21 }
  ],
  name: 'iPhone X',
  id: '1'
}, {
  data: [
    { name: 'Battery Life', value: 0.27 },
    { name: 'Brand', value: 0.16 },
    { name: 'Cost', value: 0.35 },
    { name: 'Design', value: 0.13 },
    { name: 'Connectivity', value: 0.20 },
    { name: 'Screen', value: 0.13 },
    { name: 'Price', value: 0.35 }
  ],
  name: 'Samsung',
  id: '2',
  selected: true
}, {
  data: [
    { name: 'BatteryLife ', value: 0.26 },
    { name: 'Brand', value: 0.10 },
    { name: 'Contract', value: 0.30 },
    { name: 'Design', value: 0.14 },
    { name: 'Connectivity', value: 0.22 },
    { name: 'Screen', value: 0.04 },
    { name: 'Price', value: 0.41 }
  ],
  name: 'Nokia Smartphone',
  id: '3'
}];

describe('Radar API', () => {
  beforeEach((done) => {
    radarEl = null;
    radarObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', radarHTML);
    radarEl = document.body.querySelector('#radar-chart-example');
    radarObj = new Radar(radarEl, { type: 'radar', dataset, animate: false });
    setTimeout(() => {
      done();
    });
  });

  afterEach(() => {
    radarObj.destroy();
    cleanup();
  });

  it('should show on page', () => {
    expect(document.body.querySelectorAll('.chart-radar-circle').length).toEqual(21);
    expect(document.body.querySelectorAll('.chart-radar-area').length).toEqual(3);
    expect(document.body.querySelectorAll('.chart-legend-item-text')[0].innerText).toEqual('iPhone X');
  });

  it('should support updating', () => {
    const dataset2 = [{
      data: [
        { name: 'Battery Life', value: 0.22 },
        { name: 'Brand', value: 0.28 },
        { name: 'Cost', value: 0.29 },
        { name: 'Design', value: 0.17 }
      ],
      name: 'Thing X',
      id: '1'
    }, {
      data: [
        { name: 'Battery Life', value: 0.27 },
        { name: 'Brand', value: 0.16 },
        { name: 'Cost', value: 0.35 },
        { name: 'Design', value: 0.13 }
      ],
      name: 'Thing Y',
      id: '2'
    }];

    radarObj.updated({ dataset: dataset2 });

    expect(document.body.querySelectorAll('.chart-radar-circle').length).toEqual(8);
    expect(document.body.querySelectorAll('.chart-radar-area').length).toEqual(2);
    expect(document.body.querySelectorAll('.chart-legend-item-text')[0].innerText).toEqual('Thing X');
  });

  it('should be able to get the get and set the selected line', (done) => {
    // Use group "name" to select
    let options = {
      fieldName: 'id',
      fieldValue: '1'
    };
    radarObj.setSelected(options);

    setTimeout(() => {
      expect(document.querySelectorAll('.chart-radar-area.is-selected').length).toEqual(1);
      expect(radarObj.getSelected().index).toEqual(0);
      radarObj.toggleSelected(options);

      setTimeout(() => {
        options = { index: 2 };
        radarObj.setSelected(options);

        setTimeout(() => {
          expect(document.querySelectorAll('.chart-radar-area.is-selected').length).toEqual(1);
          expect(radarObj.getSelected().index).toEqual(2);
          radarObj.toggleSelected(options);

          setTimeout(() => {
            expect(document.querySelectorAll('.chart-radar-area.is-selected').length).toEqual(0);
            done();
          }, 201);
        }, 201);
      }, 201);
    }, 201);
  });

  it('should fire contextmenu event', () => {
    const callback = jest.fn();
    $(radarEl).on('contextmenu', callback);
    $(radarEl).on('contextmenu', (e, el, d) => {
      expect(d).toBeTruthy();
    });
    triggerContextmenu(document.body.querySelector('.radar-invisible-circle'));

    expect(callback).toHaveBeenCalled();
  });
});
