import { Bar } from '../../../src/components/bar/bar';

const barHTML = require('../../../app/views/components/bar/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let barEl;
let svgEl;
let barObj;

describe('Bar API', () => {
  beforeEach(() => {
    barEl = null;
    svgEl = null;
    barObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', barHTML);
    barEl = document.body.querySelector('.chart-container');
    svgEl = document.body.querySelector('.svg-icons');
    barObj = new Bar(barEl);
  });

  afterEach(() => {
    barObj.destroy();
    barEl.parentNode.removeChild(barEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should be defined on jQuery object', () => {
    expect(barObj).toEqual(jasmine.any(Object));
  });
});
