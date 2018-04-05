import { MultiSelect } from '../multiselect';

const multiSelectHTML = require('../example-index.html');
const svg = require('../../icons/svg.html');

let multiSelectEl;
let svgEl;
let multiSelectObj;

describe('MultiSelect API', () => {
  beforeEach(() => {
    multiSelectEl = null;
    svgEl = null;
    multiSelectObj = null;
    document.body.insertAdjacentHTML('afterbegin', multiSelectHTML);
    document.body.insertAdjacentHTML('afterbegin', svg);
    multiSelectEl = document.body.querySelector('.multiselect');
    svgEl = document.body.querySelector('.svg-icons');
    multiSelectEl.classList.add('no-init');
    multiSelectObj = new MultiSelect(multiSelectEl);
  });

  afterEach(() => {
    multiSelectObj.destroy();
    multiSelectEl.parentNode.removeChild(multiSelectEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should be defined on jQuery object', () => {
    expect(multiSelectObj).toEqual(jasmine.any(Object));
  });

  it('Should be build multiSelect correctly', () => {
    expect(multiSelectObj.element[0].multiple).toBeTruthy();
  });

  it('Should disable multiselect', () => {
    multiSelectObj.disable();
  });

  it('Should enable multiselect', () => {
    multiSelectObj.enable();
  });
});
