import { Dropdown } from '../../../src/components/dropdown/dropdown';
import { cleanup } from '../../helpers/func-utils';

const dropdownHTML = require('../../../app/views/components/dropdown/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let dropdownEl;
let dropdownObj;

describe('Dropdown API', () => {
  beforeEach(() => {
    dropdownEl = null;
    dropdownObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', dropdownHTML);
    dropdownEl = document.body.querySelector('.dropdown');
    dropdownEl.classList.add('no-init');
    dropdownObj = new Dropdown(dropdownEl);
  });

  afterEach(() => {
    dropdownObj.destroy();
    cleanup(['.dropdown', '.svg-icons', '.dropdown-list', '.row', 'select']);
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

  it('can have its value programmatically changed with a string value', () => {
    // Default value is "NJ".
    // Using the text value when there's a `data-value` shouldn't change the value.
    dropdownObj.selectValue('New York');

    expect(dropdownObj.element.val()).toBe('NJ');

    // Use the `data-value`
    dropdownObj.selectValue('NY');

    expect(dropdownObj.element.val()).toBe('NY');
  });

  it('can have its value programmatically changed with a reference to one of its option elements', () => {
    const targetOpt = dropdownEl.querySelector('option[value="NY"]');
    dropdownObj.select(targetOpt);

    expect(dropdownObj.element.val()).toBe('NY');
  });

  it('can have its value programmatically changed with a reference to one of its rendered list items', () => {
    dropdownObj.open();

    // `targetEl` will be the list item for New Hampshire
    const targetEl = document.querySelector('#dropdown-list > ul > li.dropdown-option:nth-child(0n+30');
    dropdownObj.selectOption($(targetEl));

    expect(dropdownObj.element.val()).toBe('NH');
  });
});
