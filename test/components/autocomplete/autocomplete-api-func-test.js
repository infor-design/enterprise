/**
 * @jest-environment jsdom
 */
import { Autocomplete } from '../../../src/components/autocomplete/autocomplete';
import { cleanup } from '../../helpers/func-utils';

// For basic API
const exampleHTML = `<div class="row">
  <div class="twelve columns">
    <div class="field">
      <label for="autocomplete-default">States</label>
      <input type="text" autocomplete="off" class="autocomplete" data-init="false" placeholder="Type to Search" id="autocomplete-default"/>
    </div>
  </div>
</div>`;
const statesData = require('../../../app/data/states-all.json');

let autocompleteInputEl;
let autocompleteLabelEl;
let autocompleteAPI;

describe('Autocomplete API', () => {
  beforeEach(() => {
    autocompleteInputEl = null;
    autocompleteAPI = null;

    document.body.insertAdjacentHTML('afterbegin', exampleHTML);

    autocompleteLabelEl = document.body.querySelector('label[for="autocomplete-default"]');
    autocompleteInputEl = document.body.querySelector('.autocomplete');
    autocompleteInputEl.removeAttribute('data-options');
    autocompleteInputEl.classList.add('no-init');

    autocompleteAPI = new Autocomplete(autocompleteInputEl, {
      source: statesData
    });
  });

  afterEach(() => {
    autocompleteAPI?.destroy();

    const autocompleteListEl = document.querySelector('#autocomplete-list');
    if (autocompleteListEl) {
      autocompleteListEl.parentNode?.removeChild(autocompleteListEl);
    }
    autocompleteLabelEl.parentNode?.removeChild(autocompleteLabelEl);
    autocompleteInputEl.parentNode?.removeChild(autocompleteInputEl);
    cleanup();
  });

  it('can be invoked', () => {
    expect(autocompleteAPI).toBeTruthy();
  });

  it('can be enabled/disabled', () => {
    autocompleteAPI.disable();

    expect(autocompleteInputEl.disabled).toBeTruthy();

    autocompleteAPI.enable();

    expect(autocompleteInputEl.disabled).toBeFalsy();
  });

  it('renders with proper ARIA attributes', () => {
    expect(autocompleteInputEl.getAttribute('autocomplete')).toBe('off');
    expect(autocompleteInputEl.getAttribute('role')).toBe('combobox');
  });

  it('can be updated with new settings', () => {
    const newSettings = {
      filterMode: 'contains',
      delay: 500
    };
    autocompleteAPI.updated(newSettings);

    expect(autocompleteAPI.settings.filterMode).toEqual(newSettings.filterMode);
  });

  it('can render a search result list', () => {
    autocompleteAPI.openList('new', statesData);
    const autocompleteListEl = document.querySelector('#autocomplete-list');

    expect(autocompleteListEl).toBeTruthy();

    const resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems).toBeTruthy();
    expect(resultItems.length).toEqual(4);
  });

  it.skip('can change the search terms and re-render its list with new results', () => {
    autocompleteAPI.openList('new', statesData);
    const autocompleteListEl = document.querySelector('#autocomplete-list');

    expect(autocompleteListEl).toBeTruthy();

    let resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems).toBeTruthy();
    expect(resultItems.length).toEqual(4);
    expect(resultItems[1].innerText.trim()).toEqual('New Jersey');

    autocompleteAPI.openList('co', statesData);
    resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems.length).toEqual(3);
    expect(resultItems[2].innerText.trim()).toEqual('District Of Columbia');
  });

  it('can programmatically highlight an available search result item', () => {
    autocompleteAPI.openList('new', statesData);
    const autocompleteListEl = document.querySelector('#autocomplete-list');
    const resultItems = autocompleteListEl.querySelectorAll('li');
    autocompleteAPI.highlight($(resultItems[2].querySelector('a')));

    expect(resultItems[2].classList.contains('is-selected')).toBeTruthy();
  });

  it.skip('can explain whether or not its list is open', () => {
    autocompleteAPI.openList('new', statesData);

    expect(autocompleteAPI.listIsOpen()).toBeTruthy();

    autocompleteAPI.closeList();

    expect(autocompleteAPI.listIsOpen()).toBeFalsy();
  });

  it.skip('can fire a callback when the autocomplete list closes', () => {
    let wasCalled = false;
    function clearResultsCallback() {
      wasCalled = true;
    }

    autocompleteAPI.updated({
      showAllResults: true,
      clearResultsCallback
    });

    autocompleteAPI.openList('new', statesData);

    expect(autocompleteAPI.listIsOpen()).toBeTruthy();

    autocompleteAPI.closeList();

    // The `clearResultsCallback` should have been triggered through the autocomplete `closeList()` method.
    expect(wasCalled).toBeTruthy();
  });

  it.skip('Can handle slashes in the source as a label', () => {
    autocompleteAPI?.destroy();
    const newData = [
      { label: 'Application Function Server' },
      { label: 'application server' },
      { label: "Server Error '/' Application" },
      { label: "Server Error '/ReportManager' Application" },
      { label: 'server error application' }
    ];

    autocompleteAPI.updated({
      source: newData,
      filterMode: 'wordStartsWith'
    });

    autocompleteAPI.openList('S', newData);
    const autocompleteListEl = document.querySelector('#autocomplete-list');

    expect(autocompleteListEl).toBeTruthy();

    const resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems[0].innerText.trim()).toEqual('Application Function Server');
    expect(resultItems[1].innerText.trim()).toEqual('application server');
    expect(resultItems[2].innerText.trim()).toEqual("Server Error '/' Application");
    expect(resultItems[3].innerText.trim()).toEqual("Server Error '/ReportManager' Application");
    expect(resultItems[4].innerText.trim()).toEqual('server error application');
    expect(resultItems).toBeTruthy();
    expect(resultItems.length).toEqual(5);
  });

  it.skip('Can handle slashes in the source as a string', () => {
    autocompleteAPI?.destroy();
    const newData = [
      'Application Function Server',
      'application server',
      "Server Error '/' Application",
      "Server Error '/ReportManager' Application",
      'server error application'
    ];

    autocompleteAPI.updated({
      source: newData,
      filterMode: 'wordStartsWith'
    });

    autocompleteAPI.openList('S', newData);
    const autocompleteListEl = document.querySelector('#autocomplete-list');

    expect(autocompleteListEl).toBeTruthy();

    const resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems[0].innerText.trim()).toEqual('Application Function Server');
    expect(resultItems[1].innerText.trim()).toEqual('application server');
    expect(resultItems[2].innerText.trim()).toEqual("Server Error '/' Application");
    expect(resultItems[3].innerText.trim()).toEqual("Server Error '/ReportManager' Application");
    expect(resultItems[4].innerText.trim()).toEqual('server error application');
    expect(resultItems).toBeTruthy();
    expect(resultItems.length).toEqual(5);
  });
});
