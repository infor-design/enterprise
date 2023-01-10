import { FieldFilter } from '../../../src/components/field-filter/field-filter';
import { cleanup } from '../../helpers/func-utils';

const fieldfilterHTML = require('../../../app/views/components/field-filter/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

const fieldfilterData = [
  { value: 'equals', text: 'Equals', icon: 'filter-equals' },
  { value: 'in-range', text: 'In Range', icon: 'filter-in-range' },
  { value: 'does-not-equal', text: 'Does Not Equal', icon: 'filter-does-not-equal' },
  { value: 'before', text: 'Before', icon: 'filter-less-than' },
  { value: 'on-or-before', text: 'On Or Before', icon: 'filter-less-equals' },
  { value: 'after', text: 'After', icon: 'filter-greater-than' },
  { value: 'on-or-after', text: 'On Or After', icon: 'filter-greater-equals' },
];

let fieldfilterEl;
let fieldfilterObj;

describe('FieldFilter API', () => {
  beforeEach(() => {
    fieldfilterEl = null;
    fieldfilterObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', fieldfilterHTML);
    fieldfilterEl = document.body.querySelector('.field-filter');
    fieldfilterEl.classList.add('no-init');
    fieldfilterObj = new FieldFilter(fieldfilterEl, { dataset: fieldfilterData });
  });

  afterEach(() => {
    fieldfilterObj.destroy();
    cleanup();
  });

  it('should be defined on jQuery object', () => {
    expect(fieldfilterObj).toBeTruthy();
  });

  it('should open fieldfilter', () => {
    fieldfilterObj.ddApi.open();

    expect(fieldfilterObj.ddApi.isOpen()).toBeTruthy();
    expect(fieldfilterEl.parentNode.querySelector('.dropdown.is-open')).toBeTruthy();
  });

  it('should destroy fieldfilter', () => {
    fieldfilterObj.destroy();

    expect(fieldfilterEl.parentNode.querySelector('.dropdown')).toBeFalsy();
  });

  it('should disable fieldfilter', () => {
    fieldfilterObj.disable();

    expect(fieldfilterEl.parentNode.querySelector('.dropdown.is-disabled')).toBeTruthy();
    expect(fieldfilterObj.ddApi.isDisabled()).toBeTruthy();
  });

  it('should enable fieldfilter', () => {
    fieldfilterObj.disable();

    expect(fieldfilterEl.parentNode.querySelector('.dropdown.is-disabled')).toBeTruthy();
    expect(fieldfilterObj.ddApi.isDisabled()).toBeTruthy();
    fieldfilterObj.enable();

    expect(fieldfilterEl.parentNode.querySelector('.dropdown.is-disabled')).toBeFalsy();
    expect(fieldfilterObj.ddApi.isDisabled()).toBeFalsy();
  });

  it('should render fieldfilter readonly', () => {
    fieldfilterObj.readonly();

    expect(fieldfilterEl.parentNode.querySelector('.dropdown.is-readonly')).toBeTruthy();
    expect(fieldfilterObj.ddApi.isDisabled()).toBeFalsy();
  });

  it('should get current filter type', () => {
    expect(fieldfilterObj.getFilterType().data.value).toEqual('equals');
  });

  it('should set filter type programmatically by string value', () => {
    expect(fieldfilterObj.getFilterType().data.value).toEqual('equals');
    fieldfilterObj.setFilterType('in-range');

    expect(fieldfilterObj.getFilterType().data.value).toEqual('in-range');
  });

  it('should set filter type programmatically by index', () => {
    expect(fieldfilterObj.getFilterType().data.value).toEqual('equals');
    fieldfilterObj.setFilterType(1);

    expect(fieldfilterObj.getFilterType().data.value).toEqual('in-range');
  });
});
