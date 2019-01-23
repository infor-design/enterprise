import { Bullet } from '../../../src/components/bullet/bullet';

const areaHTML = require('../../../app/views/components/bullet/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let bulletEl;
let svgEl;
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

describe('Bullet Chart API', () => {
  beforeEach((done) => {
    bulletEl = null;
    svgEl = null;
    bulletObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', areaHTML);
    bulletEl = document.body.querySelector('#bullet-example1');
    svgEl = document.body.querySelector('.svg-icons');

    bulletObj = new Bullet(bulletEl, { dataset: dataset1, animate: false });
    setTimeout(done(), 300);
  });

  afterEach(() => {
    bulletObj.destroy();
    svgEl.parentNode.removeChild(svgEl);
    bulletEl.parentNode.removeChild(bulletEl);

    const rowEl = document.body.querySelector('.row');
    rowEl.parentNode.removeChild(rowEl);
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
});
