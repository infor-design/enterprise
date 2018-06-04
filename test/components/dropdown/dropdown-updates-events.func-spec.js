import { Dropdown } from '../../../src/components/dropdown/dropdown';

const dropdownHTML = require('../../../app/views/components/dropdown/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let dropdownEl;
let svgEl;
let dropdownObj;

describe('Dropdown updates, events', () => {
  beforeEach(() => {
    dropdownEl = null;
    svgEl = null;
    dropdownObj = null;
    document.body.insertAdjacentHTML('afterbegin', dropdownHTML);
    document.body.insertAdjacentHTML('afterbegin', svg);
    dropdownEl = document.body.querySelector('.dropdown');
    svgEl = document.body.querySelector('.svg-icons');
    dropdownEl.classList.add('no-init');
    dropdownObj = new Dropdown(dropdownEl);
  });

  afterEach(() => {
    dropdownObj.destroy();
    $('.dropdown').destroy();
    dropdownEl.parentNode.removeChild(dropdownEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should set settings', () => {
    const settings = {
      closeOnSelect: true,
      cssClass: null,
      delay: 300,
      empty: false,
      filterMode: 'contains',
      maxWidth: null,
      moveSelected: 'none',
      multiple: false,
      noSearch: false,
      placementOpts: null,
      reloadSourceOnOpen: false,
      showEmptyGroupHeaders: false,
      showSelectAll: false,
      sourceArguments: {},
      onKeyDown: null
    };

    expect(dropdownObj.settings).toEqual(settings);
  });

  it('Should update set settings via data', () => {
    const settings = {
      closeOnSelect: true,
      cssClass: null,
      delay: 2000,
      empty: false,
      filterMode: 'contains',
      maxWidth: 1000,
      moveSelected: 'none',
      multiple: false,
      noSearch: false,
      placementOpts: null,
      reloadSourceOnOpen: false,
      showEmptyGroupHeaders: false,
      showSelectAll: false,
      sourceArguments: {},
      onKeyDown: null
    };

    dropdownObj.updated();
    dropdownObj.settings.maxWidth = 1000;
    dropdownObj.settings.delay = 2000;

    expect(dropdownObj.settings).toEqual(settings);
  });

  it('Should update set settings via parameter', () => {
    const settings = {
      closeOnSelect: true,
      cssClass: null,
      delay: 2000,
      empty: false,
      filterMode: 'contains',
      maxWidth: 1000,
      moveSelected: 'none',
      multiple: false,
      noSearch: false,
      placementOpts: null,
      reloadSourceOnOpen: false,
      showEmptyGroupHeaders: false,
      showSelectAll: false,
      sourceArguments: {},
      onKeyDown: null
    };
    dropdownObj.updated(settings);

    expect(dropdownObj.settings).toEqual(settings);
  });

  it('Should trigger "has-updated" event', () => {
    const settings = {
      closeOnSelect: true,
      cssClass: null,
      delay: 2000,
      empty: false,
      filterMode: 'contains',
      maxWidth: 1000,
      moveSelected: 'none',
      multiple: false,
      noSearch: false,
      placementOpts: null,
      reloadSourceOnOpen: false,
      showEmptyGroupHeaders: false,
      showSelectAll: false,
      sourceArguments: {},
      onKeyDown: null
    };

    const spyEvent = spyOnEvent('.dropdown', 'has-updated');
    dropdownObj.updated(settings);

    expect(spyEvent).toHaveBeenTriggered();
  });

  it('should display the text of the first selected option when the list opens', (done) => {
    dropdownObj.open();
    const searchInput = dropdownObj.searchInput;

    expect(searchInput[0].value).toBe('New Jersey');
    done();
  });

  it('should trigger change event on click', () => {
    const spyEvent = spyOnEvent('select.dropdown', 'change');
    dropdownObj.open();
    document.body.querySelectorAll('.dropdown-option')[1].click();

    expect(spyEvent).toHaveBeenTriggered();
  });

  it('should trigger change event on duplicate label', () => {
    // Make some dup labels
    const options = document.body.querySelectorAll('option');
    options[0].innerText = 'Dup';
    options[1].innerText = 'Dup';
    options[2].innerText = 'Dup';

    // Try to select them and make sure you always get an event
    const spyEvent = spyOnEvent('select.dropdown', 'change');
    dropdownObj.updated();
    dropdownObj.open();
    document.body.querySelectorAll('.dropdown-option')[1].click();

    expect(spyEvent).toHaveBeenTriggered();

    document.body.querySelectorAll('.dropdown-option')[2].click();

    expect(spyEvent).toHaveBeenTriggered();
  });
});
