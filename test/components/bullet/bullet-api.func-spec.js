import { cleanup, triggerContextmenu } from '../../helpers/func-utils';
import { Bullet } from '../../../src/components/bullet/bullet';

const areaHTML = require('../../../app/views/components/bullet/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let bulletEl;
let bulletObj;
const dataset1 = [{
  data: [{
    title: 'Revenue',
    subtitle: 'US$, in thousands',
    ranges: [150, 225, 300, 400, 600],
    measures: [220, 270],
    markers: [250],
    url: 'http://someplace.com',
    tooltip: ['<b>Poor</b> 150', '<b>Ok</b> 225', '<b>Good</b> 300', '<b>Excellent</b> 400', '<b>Revenue</b> 600']
  }],
  barColors: ['#C0EDE3', '#8ED1C6', '#69ADA3', '#448D83', '#206B62'],
  lineColors: ['#000000', '#000000', '#000000'],
  markerColors: ['#000000']
}];

const dataset2 = [{
  data: [{
    title: 'Revenue (New)',
    subtitle: 'DKK$, in thousands',
    ranges: [50, 100, 150, 200, 250],
    measures: [150, 200],
    markers: [250],
    url: 'http://someplace.com',
    tooltip: ['<b>Poor</b> 50', '<b>Ok</b> 100', '<b>Good</b> 150', '<b>Excellent</b> 200', '<b>Revenue</b> 250']
  }],
  barColors: ['#C0EDE3', '#8ED1C6', '#69ADA3', '#448D83', '#206B62'],
  lineColors: ['#000000', '#000000', '#000000'],
  markerColors: ['#000000']
}];

const dataset3 = [{
  data: [{
    title: 'Revenue (New)',
    subtitle: 'DKK$, in thousands',
    ranges: [1500000, 2250000, 3000000, 4000000, 6000000],
    measures: [2200000, 2700000],
    markers: [2500000]
  }],
  barColors: ['#C0EDE3', '#8ED1C6', '#69ADA3', '#448D83', '#206B62'],
  lineColors: ['#000000', '#000000', '#000000'],
  markerColors: ['#000000']
}];

function formatToUnits(num, digits) {
  const units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
  let decimal;
  for (let i = units.length - 1; i >= 0; i--) {
    decimal = Math.pow(1000, (i + 1));
    if (num <= -decimal || num >= decimal) {
      return +(num / decimal).toFixed(digits) + units[i];
    }
  }
  return num;
}

describe('Bullet Chart API', () => {
  beforeEach((done) => {
    bulletEl = null;
    bulletObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', areaHTML);
    bulletEl = document.body.querySelector('#bullet-example1');

    bulletObj = new Bullet(bulletEl, { dataset: dataset1, animate: false });
    setTimeout(done(), 300);
  });

  afterEach(() => {
    bulletObj.destroy();
    cleanup();
  });

  it('Should show on page', () => {
    expect(document.body.querySelectorAll('.tick').length).toEqual(7);
    expect(document.body.querySelectorAll('.tick')[0].textContent).toEqual('0');
    expect(document.body.querySelectorAll('.tick')[6].textContent).toEqual('600');
    expect(document.body.querySelector('.title').textContent).toEqual('RevenueUS$, in thousands');
  });

  it('Should be able to update', (done) => {
    bulletObj.updated({ dataset: dataset2 });

    setTimeout(() => {
      expect(document.body.querySelectorAll('.tick').length).toEqual(6);
      expect(document.body.querySelectorAll('.tick')[0].textContent).toEqual('0');
      expect(document.body.querySelectorAll('.tick')[5].textContent).toEqual('250');
      expect(document.body.querySelector('.title').textContent).toEqual('Revenue (New)DKK$, in thousands');
      done();
    }, 300);
  });

  it('Should fire contextmenu event', () => {
    const spyEvent = spyOnEvent(bulletEl, 'contextmenu');
    $(bulletEl).on('contextmenu', (e, el, d) => {
      expect(d).toEqual(600);
    });
    triggerContextmenu(document.body.querySelector('.range'));

    expect(spyEvent).toHaveBeenTriggered();
  });

  it('Should format values with d3 formatter string by Dataset', (done) => {
    const ds = JSON.parse(JSON.stringify(dataset3));
    ds[0].format = {
      ranges: '.1s',
      difference: '.1s'
    };
    bulletObj.destroy();
    bulletObj = new Bullet(bulletEl, { dataset: ds, animate: false });

    setTimeout(() => {
      expect(document.body.querySelectorAll('.tick').length).toEqual(7);
      expect(document.body.querySelectorAll('.tick')[0].textContent).toEqual('0');
      expect(document.body.querySelectorAll('.tick')[6].textContent).toEqual('6M');
      expect(document.body.querySelector('.inverse').textContent).toEqual('200k');
      done();
    }, 300);
  });

  it('Should format values with d3 formatter string by Settings', (done) => {
    const ds = JSON.parse(JSON.stringify(dataset3));
    bulletObj.destroy();
    bulletObj = new Bullet(bulletEl, {
      dataset: ds,
      animate: false,
      format: {
        ranges: '.1s',
        difference: '.1s'
      }
    });

    setTimeout(() => {
      expect(document.body.querySelectorAll('.tick').length).toEqual(7);
      expect(document.body.querySelectorAll('.tick')[0].textContent).toEqual('0');
      expect(document.body.querySelectorAll('.tick')[6].textContent).toEqual('6M');
      expect(document.body.querySelector('.inverse').textContent).toEqual('200k');
      done();
    }, 300);
  });

  it('Should format values with callback function by Dataset', (done) => {
    const ds = JSON.parse(JSON.stringify(dataset3));
    ds[0].format = {
      ranges: d => formatToUnits(d),
      difference: d => formatToUnits(d)
    };
    bulletObj.destroy();
    bulletObj = new Bullet(bulletEl, { dataset: ds, animate: false });

    setTimeout(() => {
      expect(document.body.querySelectorAll('.tick').length).toEqual(7);
      expect(document.body.querySelectorAll('.tick')[0].textContent).toEqual('0');
      expect(document.body.querySelectorAll('.tick')[6].textContent).toEqual('6M');
      expect(document.body.querySelector('.inverse').textContent).toEqual('200k');
      done();
    }, 300);
  });

  it('Should format values with callback function by Settings', (done) => {
    const ds = JSON.parse(JSON.stringify(dataset3));
    bulletObj.destroy();
    bulletObj = new Bullet(bulletEl, {
      dataset: ds,
      animate: false,
      format: {
        ranges: d => formatToUnits(d),
        difference: d => formatToUnits(d)
      }
    });

    setTimeout(() => {
      expect(document.body.querySelectorAll('.tick').length).toEqual(7);
      expect(document.body.querySelectorAll('.tick')[0].textContent).toEqual('0');
      expect(document.body.querySelectorAll('.tick')[6].textContent).toEqual('6M');
      expect(document.body.querySelector('.inverse').textContent).toEqual('200k');
      done();
    }, 300);
  });
});
