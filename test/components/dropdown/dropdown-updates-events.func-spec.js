import { cleanup } from '../../helpers/func-utils';
import { Dropdown } from '../../../src/components/dropdown/dropdown';
import { DOM } from '../../../src/utils/dom';

const dropdownHTML = require('../../../app/views/components/dropdown/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let dropdownEl;
let dropdownObj;

describe('Dropdown updates, events', () => {
  beforeEach(() => {
    dropdownEl = null;
    dropdownObj = null;
    document.body.insertAdjacentHTML('afterbegin', dropdownHTML);
    document.body.insertAdjacentHTML('afterbegin', svg);
    dropdownEl = document.body.querySelector('.dropdown');
    dropdownEl.classList.add('no-init');
    dropdownObj = new Dropdown(dropdownEl);
  });

  afterEach(() => {
    dropdownObj.destroy();
    cleanup(['.dropdown', '.svg-icons', '#dropdown-list', '.row', 'select']);
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
      reload: 'none',
      showEmptyGroupHeaders: false,
      showSelectAll: false,
      showSearchUnderSelected: false,
      sourceArguments: {},
      onKeyDown: null,
      showTags: false,
      tagSettings: {}
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
      reload: 'none',
      showEmptyGroupHeaders: false,
      showSelectAll: false,
      showSearchUnderSelected: false,
      sourceArguments: {},
      onKeyDown: null,
      showTags: false,
      tagSettings: {}
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
      reload: 'none',
      showEmptyGroupHeaders: false,
      showSelectAll: false,
      showSearchUnderSelected: false,
      sourceArguments: {},
      onKeyDown: null,
      showTags: false,
      tagSettings: {}
    };
    dropdownObj.updated(settings);

    expect(dropdownObj.settings).toEqual(settings);
  });

  it('Should convert legacy settings', () => {
    const settings = {
      reloadSourceOnOpen: false // removed in v4.9.0 in favor of `reload`
    };
    dropdownObj.updated(settings);

    expect(dropdownObj.settings.reload).toEqual('none');
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
      showSearchUnderSelected: false,
      sourceArguments: {},
      onKeyDown: null,
      showTags: false,
      tagSettings: {}
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

  it('should trigger change event on click', (done) => {
    DOM.remove(document.querySelector('#dropdown-list'));
    const spyEvent = spyOnEvent('#states', 'change');
    dropdownObj.open();
    document.body.querySelectorAll('.dropdown-option')[1].click();

    expect(spyEvent).toHaveBeenTriggered();
    done();
  });

  it('should trigger change event on duplicate label', () => {
    // Make some dup labels
    const options = document.body.querySelectorAll('option');
    options[0].innerText = 'Dup';
    options[1].innerText = 'Dup';

    // Try to select them and make sure you always get an event
    const spyEvent = spyOnEvent('select.dropdown', 'change');
    dropdownObj.updated();
    dropdownObj.open();
    document.body.querySelectorAll('.dropdown-option')[0].click();

    expect(spyEvent).toHaveBeenTriggered();

    document.body.querySelectorAll('.dropdown-option')[1].click();

    expect(spyEvent).toHaveBeenTriggered();

    // Set back the output
    options[0].innerText = 'Alabama';
    options[1].innerText = 'Alaska';
    dropdownObj.updated();
    dropdownObj.open();
    document.body.querySelectorAll('.dropdown-option')[0].click();
  });
});
