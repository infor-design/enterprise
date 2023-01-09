/**
 * @jest-environment jsdom
 */
import { Autocomplete } from '../../../src/components/autocomplete/autocomplete';
import { cleanup } from '../../helpers/func-utils';

// For FilterMode "contains" tests
const newTemplateHTML = `<div class="twelve columns">
    <div class="field">
      <label for="autocomplete-default">States</label>
      <input type="text" autocomplete="off" class="autocomplete" data-options="{source: '{{basepath}}api/states?term=', filterMode: 'contains'}" placeholder="Type to Search" id="autocomplete-default"/>
    </div>
  </div>
</div>`;
const statesData = require('../../../app/data/states-all.json');

const caseSensitiveData = [
  'CALIFORNIA',
  'california',
  'CaLiFoRnIa'
];

const specialCharacterData = [
  'Item ( ) [ ? + *',
  'Item Two',
  'Item $ & * ? #',
  'Item @ ^ &',
  'Item Five',
  'Item ] [ | ~'
];

let autocompleteInputEl;
let autocompleteAPI;

describe('Autocomplete API', () => {
  beforeEach(() => {
    document.body.insertAdjacentHTML('afterbegin', newTemplateHTML);

    // remove unncessary stuff
    const inlineScripts = document.body.querySelector('#test-scripts');
    inlineScripts?.parentNode?.removeChild(inlineScripts);

    autocompleteInputEl = document.body.querySelector('#autocomplete-default');
    autocompleteInputEl.classList.add('no-init');
    autocompleteInputEl.removeAttribute('data-options');
  });

  afterEach(() => {
    autocompleteAPI?.destroy();
    autocompleteInputEl?.parentNode?.remove(autocompleteInputEl);

    autocompleteInputEl = null;
    autocompleteAPI = null;
    cleanup();
  });

  it('can provide search results with a "contains" filter', () => {
    autocompleteAPI = new Autocomplete(autocompleteInputEl, {
      source: statesData
    });

    // Try opening the list with text content that will not match a "startsWith" filter
    autocompleteAPI.openList('ia', statesData);
    let autocompleteListEl = document.querySelector('#autocomplete-list');
    let resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems).toBeDefined();
    expect(resultItems.length).toEqual(0);

    // Update the component with a "contains" filterMode
    autocompleteAPI.updated({
      filterMode: 'contains'
    });
    autocompleteAPI.openList('ia', statesData);
    autocompleteListEl = document.querySelector('#autocomplete-list');
    resultItems = autocompleteListEl.querySelectorAll('li');

    // Results should be present
    expect(resultItems).toBeDefined();
    expect(resultItems.length).toEqual(10);
  });

  it('can run case-sensitive searches', () => {
    autocompleteAPI = new Autocomplete(autocompleteInputEl, {
      source: caseSensitiveData,
      caseSensitive: true
    });
    autocompleteAPI.openList('calif', caseSensitiveData);
    const autocompleteListEl = document.querySelector('#autocomplete-list');
    const resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems).toBeDefined();
    expect(resultItems.length).toEqual(1);
  });

  it('properly escapes and allows special characters within a search term', () => {
    autocompleteAPI = new Autocomplete(autocompleteInputEl, {
      source: specialCharacterData
    });

    // Search for "Item" (all data should show)
    autocompleteAPI.openList('Item', specialCharacterData);
    let autocompleteListEl = document.querySelector('#autocomplete-list');
    let resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems).toBeDefined();
    expect(resultItems.length).toEqual(6);

    // Search for "?" (two results)
    autocompleteAPI.openList('?', specialCharacterData);
    autocompleteListEl = document.querySelector('#autocomplete-list');
    resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems.length).toEqual(2);

    // Search for "&" (two results)
    autocompleteAPI.openList('&', specialCharacterData);
    autocompleteListEl = document.querySelector('#autocomplete-list');
    resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems.length).toEqual(2);

    // Search for opening square bracket "[" (2 results)
    autocompleteAPI.openList('[', specialCharacterData);
    autocompleteListEl = document.querySelector('#autocomplete-list');
    resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems.length).toEqual(2);
  });
});
