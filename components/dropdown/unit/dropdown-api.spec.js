import { Dropdown } from '../dropdown';

const dropdownHTML = require('../example-index.html');
const svg = require('../../icons/svg.html');

let dropdownEl;
let svgEl;
let rowEl;
let dropdownObj;

describe('Dropdown API', () => {
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
  });

  afterEach(() => {
    dropdownObj.destroy();
    dropdownEl.remove();
    rowEl.remove();
    svgEl.remove();
  });

  it('Should be defined on jQuery object', () => {
    expect(dropdownObj).toEqual(jasmine.any(Object));
  });

  it('Should open dropdown', () => {
    dropdownObj.open();
    expect(dropdownObj.isOpen()).toBeTruthy();
    expect(document.body.querySelector('.dropdown.is-open')).toBeTruthy();
  });

  it('Should activate dropdown', () => {
    dropdownObj.activate();
    expect(dropdownObj.isOpen()).toBeFalsy();
    expect(document.body.querySelector('.dropdown.is-open')).toBeFalsy();
  });

  it('Should destroy dropdown', () => {
    dropdownObj.destroy();
    expect(dropdownObj.isOpen()).toBeFalsy();
    expect(document.body.querySelector('.dropdown.is-open')).toBeFalsy();
  });

  it('Should disable dropdown', () => {
    dropdownObj.disable();
    expect(document.body.querySelector('.dropdown.is-disabled')).toBeTruthy();
    expect(dropdownObj.isDisabled()).toBeTruthy();
  });

  it('Should enable dropdown', () => {
    dropdownObj.enable();
    expect(document.body.querySelector('.dropdown.is-disabled')).toBeFalsy();
    expect(dropdownObj.isDisabled()).toBeFalsy();
  });

  it('Should render dropdown readonly', () => {
    dropdownObj.readonly();
    expect(document.body.querySelector('.dropdown.is-readonly')).toBeTruthy();
    expect(dropdownObj.isDisabled()).toBeFalsy();
  });
});
