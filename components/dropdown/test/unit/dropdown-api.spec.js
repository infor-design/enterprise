import { Dropdown } from '../../dropdown.js';

const dropdownHTML = require('../../example-index.html');
const svg = require('../../../icons/svg.html');
let dropdownEl;
let svgEl;
let rowEl;
let dropdownData;

describe('Dropdown', () => {
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

  it('Should be defined on jQuery object', () => {
    expect($(document.body).dropdown).toBeDefined();
  });

  it('Should open dropdown', () => {
    dropdownData.open();
    expect(dropdownData.isOpen()).toBeTruthy();
    expect(document.body.querySelector('.dropdown.is-open')).toBeTruthy();
  });

  it('Should destroy dropdown', () => {
    $('.dropdown').destroy();
    expect(dropdownData.isOpen()).toBeFalsy();
    expect(document.body.querySelector('.dropdown.is-open')).toBeFalsy();
  });

  it('Should enable dropdown', () => {
    dropdownData.enable();
    expect(document.body.querySelector('.dropdown.is-disabled')).toBeFalsy();
    expect(dropdownData.isDisabled()).toBeFalsy();
  });

  it('Should render dropdown readonly', () => {
    dropdownData.readonly();
    expect(document.body.querySelector('.dropdown.is-readonly')).toBeTruthy();
    expect(document.querySelector('[aria-label="readonly"]')).toBeTruthy;
    expect(dropdownData.isDisabled()).toBeFalsy();
  });
});
