import { Dropdown } from '../../dropdown';

const dropdownHTML = require('../../example-index.html');
const svg = require('../../../icons/svg.html');

let dropdownEl;
let svgEl;
let rowEl;
let dropdownObj;

describe('Dropdown ARIA', () => {
  beforeEach(() => {
    dropdownEl = null;
    svgEl = null;
    rowEl = null;
    dropdownObj = null;
    document.body.insertAdjacentHTML('afterbegin', dropdownHTML);
    document.body.insertAdjacentHTML('afterbegin', svg);
    dropdownEl = document.body.querySelector('.dropdown');
    rowEl = document.body.querySelector('.row');
    svgEl = document.body.querySelector('.svg-icons');
    dropdownEl.classList.add('no-init');
    dropdownObj = new Dropdown(dropdownEl);
    dropdownObj.init();
  });

  afterEach(() => {
    dropdownObj.destroy();
    dropdownEl.remove();
    rowEl.remove();
    svgEl.remove();
  });

  it('Should set ARIA labels', () => {
    expect(document.querySelector('[aria-expanded="false"]')).toBeTruthy();
    expect(document.querySelector('[aria-autocomplete="list"]')).toBeTruthy();
    expect(document.querySelector('[aria-controls="dropdown-list"]')).toBeTruthy();
  });
});
