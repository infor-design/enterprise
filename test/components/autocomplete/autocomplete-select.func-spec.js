import { Autocomplete } from '../../../src/components/autocomplete/autocomplete';

const svgHTML = require('../../../src/components/icons/theme-uplift-svg.html');

// For basic API
const exampleHTML = require('../../../app/views/components/autocomplete/example-index.html');
const statesData = require('../../../app/data/states-all.json');

// Modified states data (for augmented results test)
const statesExtraData = (function (data) {
  const modified = [].concat(data);
  modified.forEach((item) => {
    // eslint-disable-next-line
    item.addedValue = 'sandwich';
  });
  return modified;
}(statesData));

// Modified template that doesn't contain a `data-index`
const modifiedTemplateHTML = `<script id="autocomplete-template-modified" type="text/html">
<li id="{{listItemId}}" {{#hasValue}}data-value="{{value}}"{{/hasValue}} role="listitem">
 <a href="#" tabindex="-1">
   <span>{{{label}}}</span>
 </a>
</li>
</script>`;

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

  it('retains extra information from the original data source inside its return object', () => {
    autocompleteAPI.openList('new', statesExtraData);
    const autocompleteListEl = document.querySelector('#autocomplete-list');
    const resultItems = autocompleteListEl.querySelectorAll('li');
    const selectedItem = autocompleteAPI.select($(resultItems[1]));

    expect(selectedItem).toBeDefined();
    expect(selectedItem.index).toEqual(1);
    expect(selectedItem.value).toEqual('NJ');
    expect(selectedItem.addedValue).toEqual('sandwich');
  });

  it('returns the correct item when selecting with a `data-value`', () => {
    document.body.insertAdjacentHTML('afterbegin', modifiedTemplateHTML);

    autocompleteAPI.updated({
      template: '#autocomplete-template-modified'
    });

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
