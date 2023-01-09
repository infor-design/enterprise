/**
 * @jest-environment jsdom
 */
import { Autocomplete } from '../../../src/components/autocomplete/autocomplete';
import { cleanup } from '../../helpers/func-utils';

const exampleHTML = `<div class="row">
  <div class="twelve columns">
    <div class="field">
      <label for="autocomplete-default">States</label>
      <input type="text" autocomplete="off" class="autocomplete" data-init="false" placeholder="Type to Search" id="autocomplete-default"/>
    </div>
  </div>
</div>`;
const data = require('../../../app/data/states-all.json');

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
      source: data
    });
  });

  afterEach(() => {
    autocompleteAPI?.destroy();

    const autocompleteListEl = document.querySelector('#autocomplete-list');
    if (autocompleteListEl) {
      autocompleteListEl.parentNode.removeChild(autocompleteListEl);
    }
    autocompleteLabelEl.parentNode.removeChild(autocompleteLabelEl);
    autocompleteInputEl.parentNode.removeChild(autocompleteInputEl);
    cleanup();
  });

  it('triggers a `listopen` event when the results list is opened', () => {
    const callback = jest.fn();
    $(autocompleteInputEl).on('listopen', callback);
    autocompleteAPI.openList('new', data);

    expect(callback).toHaveBeenCalled();
  });

  it('triggers a `listclose` event when the results list is closed', (done) => {
    const callback = jest.fn();
    $(autocompleteInputEl).on('listclose', callback);
    autocompleteAPI.openList('new', data);
    autocompleteAPI.closeList();

    expect(callback).toHaveBeenCalled();
    done();
  });

  it('triggers a `selected` event when a list item is clicked', (done) => {
    const callback = jest.fn();
    $(autocompleteInputEl).on('selected', callback);
    autocompleteAPI.openList('new', data);
    const autocompleteListEl = document.querySelector('#autocomplete-list');
    const resultItems = autocompleteListEl.querySelectorAll('li');

    autocompleteAPI.select($(resultItems[0].querySelector('a')), data);

    expect(callback).toHaveBeenCalledTimes(1);
    done();
  });

  it.skip('triggers a `beforeopen` event before the list is opened', (done) => {
    const callback = jest.fn();
    $(autocompleteInputEl).on('beforeopen', callback);
    autocompleteAPI.openList('new', data);

    expect(callback).toHaveBeenCalled();
    done();
  });
});
