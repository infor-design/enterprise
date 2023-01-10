import { SearchField } from '../../../src/components/searchfield/searchfield';
import { cleanup } from '../../helpers/func-utils';

const exampleHTML = require('../../../app/views/components/searchfield/example-index.html');
const svgHTML = require('../../../src/components/icons/theme-new-svg.html');
const data = require('../../../app/data/states-all.json');

let searchfieldInputEl;
let searchfieldAPI;

describe('Searchfield API', () => {
  beforeEach(() => {
    searchfieldInputEl = null;
    searchfieldAPI = null;

    document.body.insertAdjacentHTML('afterbegin', svgHTML);
    document.body.insertAdjacentHTML('afterbegin', exampleHTML);

    searchfieldInputEl = document.body.querySelector('.searchfield');
    searchfieldInputEl.removeAttribute('data-options');
    searchfieldInputEl.classList.add('no-init');

    searchfieldAPI = new SearchField(searchfieldInputEl, {
      source: data
    });
  });

  afterEach(() => {
    if (searchfieldAPI) {
      searchfieldAPI.destroy();
    }
    cleanup();
  });

  it('can be invoked', () => {
    expect(searchfieldAPI).toBeTruthy();
  });

  it('renders attributes', () => {
    expect(searchfieldInputEl.getAttribute('autocomplete')).toBe('off');
  });

  it('can use a placeholder attribute as an `aria-label` attribute if one is defined', () => {
    expect(searchfieldInputEl.getAttribute('aria-label')).toBe('Type a search term');
  });

  it('can be disabled/enabled', () => {
    const wrapper = searchfieldAPI.wrapper[0];
    searchfieldAPI.disable();

    expect(wrapper.classList.contains('is-disabled')).toBeTruthy();

    searchfieldAPI.enable();

    expect(wrapper.classList.contains('is-disabled')).toBeFalsy();
  });

  it('can clear the searchfield via clear API', () => {
    searchfieldInputEl.value = 'Alaska';
    const callback = jest.fn();
    $(searchfieldInputEl).on('cleared', callback);
    searchfieldAPI.makeClearable();
    searchfieldAPI.clear();

    expect(callback).toHaveBeenCalled();
    expect(searchfieldInputEl.getAttribute('value')).toEqual(null);
  });

  it('can clear the searchfield via click', () => {
    searchfieldInputEl.value = 'Alaska';
    searchfieldAPI.makeClearable();

    const closeButtonEl = document.body.querySelector('.searchfield-wrapper svg.close');
    const callback = jest.fn();
    $(closeButtonEl).on('click', callback);
    const callback2 = jest.fn();
    $(searchfieldInputEl).on('cleared', callback2);
    $(closeButtonEl).click();

    expect(callback).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
    expect(searchfieldInputEl.getAttribute('value')).toEqual(null);
  });

  it('can add an extra "More Results" link to the results list', () => {
    let wasCalled = false;
    function allResultsCallback() {
      wasCalled = true;
    }

    searchfieldAPI.updated({
      showAllResults: true,
      allResultsCallback
    });

    const autocompleteAPI = searchfieldAPI.autocomplete;
    autocompleteAPI.openList('new', data);
    const autocompleteListEl = document.querySelector('#autocomplete-list');
    const resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems.length).toBe(6);
    expect(resultItems[4].classList.contains('separator')).toBeTruthy();

    $(resultItems[5]).find('a').click();

    // The `allResultsCallback` should have been triggered by the click
    expect(wasCalled).toBeTruthy();
  });

  it('adds a "No Results" link to an empty results list', () => {
    const autocompleteAPI = searchfieldAPI.autocomplete;
    autocompleteAPI.openList('yodel', data); // should yield no true results
    const autocompleteListEl = document.querySelector('#autocomplete-list');
    const resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems.length).toBe(1);
  });

  it('can modify the `autocomplete` attribute', () => {
    searchfieldAPI.updated({ autocompleteAttribute: 'my-search' });

    expect(searchfieldAPI.settings.autocompleteAttribute).toEqual('my-search');
    expect(searchfieldAPI.element.attr('autocomplete')).toEqual('my-search');
  });
});
