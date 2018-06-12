import { Autocomplete } from '../../../src/components/autocomplete/autocomplete';

const svgHTML = require('../../../src/components/icons/svg.html');

// For basic API
const exampleHTML = require('../../../app/views/components/autocomplete/example-index.html');
const statesData = require('../../../app/data/states-all.json');

// Modified states data (for augmented results test)
const statesExtraData = (function (data) {
  const modified = [].concat(data);
  modified.forEach((item) => {
    item.addedValue = 'sandwich';
  });
  return modified;
}(statesData));

let autocompleteInputEl;
let autocompleteLabelEl;
let autocompleteAPI;
let svgEl;

describe('Autocomplete API (select)', () => {
  beforeEach(() => {
    autocompleteInputEl = null;
    autocompleteAPI = null;
    svgEl = null;

    document.body.insertAdjacentHTML('afterbegin', svgHTML);
    document.body.insertAdjacentHTML('afterbegin', exampleHTML);

    svgEl = document.body.querySelector('.svg-icons');
    autocompleteLabelEl = document.body.querySelector('label[for="autocomplete-default"]');
    autocompleteInputEl = document.body.querySelector('.autocomplete');
    autocompleteInputEl.removeAttribute('data-options');
    autocompleteInputEl.classList.add('no-init');

    autocompleteAPI = new Autocomplete(autocompleteInputEl, {
      source: statesData
    });
  });

  afterEach(() => {
    autocompleteAPI.destroy();
    svgEl.parentNode.removeChild(svgEl);

    const autocompleteListEl = document.querySelector('#autocomplete-list');
    if (autocompleteListEl) {
      autocompleteListEl.parentNode.removeChild(autocompleteListEl);
    }
    autocompleteLabelEl.parentNode.removeChild(autocompleteLabelEl);
    autocompleteInputEl.parentNode.removeChild(autocompleteInputEl);
  });

  it('returns an object with metadata about an item that was programmatically selected', () => {
    autocompleteAPI.openList('new', statesData);
    const autocompleteListEl = document.querySelector('#autocomplete-list');
    const resultItems = autocompleteListEl.querySelectorAll('li');
    const selectedItem = autocompleteAPI.select($(resultItems[1]));

    expect(selectedItem).toBeDefined();
    expect(selectedItem.index).toEqual(1);
    expect(selectedItem.label).toEqual('New Jersey');
    expect(selectedItem.value).toEqual('NJ'); // Should be retrieved from `data-value`
  });

  it('returns an object with metadata about an item that was programmatically selected', () => {
    autocompleteAPI.openList('new', statesExtraData);
    const autocompleteListEl = document.querySelector('#autocomplete-list');
    const resultItems = autocompleteListEl.querySelectorAll('li');
    const selectedItem = autocompleteAPI.select($(resultItems[1]));

    expect(selectedItem).toBeDefined();
    expect(selectedItem.index).toEqual(1);
    expect(selectedItem.value).toEqual('NJ');
    expect(selectedItem.addedValue).toEqual('sandwich');
  });
});
