import { Dropdown } from '../../dropdown.js';

const dropdownHTML = require('../../example-index.html');
const svg = require('../../../icons/svg.html');
let dropdownEl;
let svgEl;
let rowEl;
let dropdownData;

describe('Dropdown ARIA', () => {
  beforeEach(() => {
    dropdownEl = svgEl = rowEl = dropdownData = null;
    document.body.insertAdjacentHTML('afterbegin', dropdownHTML);
    document.body.insertAdjacentHTML('afterbegin', svg);
    dropdownEl = document.body.querySelector('.dropdown');
    rowEl = document.body.querySelector('.row');
    svgEl = document.body.querySelector('.svg-icons');
    dropdownEl.classList.add('no-init');
    $('.dropdown').dropdown();
    dropdownData = $('.dropdown').data('dropdown');
  });

  afterEach(() => {
    dropdownData.destroy();
    $('.dropdown').destroy();
    dropdownEl.remove();
    rowEl.remove();
    svgEl.remove();
  });

  it('Should set ARIA labels', () => {
    expect(document.querySelector('[aria-label="expanded"]')).toBeTruthy;
    expect(document.querySelector('[aria-label="autocomplete"]')).toBeTruthy;
    expect(document.querySelector('[aria-label="controls"]')).toBeTruthy;
  });
});
