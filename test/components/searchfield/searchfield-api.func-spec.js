import { SearchField } from '../../../src/components/searchfield/searchfield';

const exampleHTML = require('../../../app/views/components/searchfield/example-index.html');
const svgHTML = require('../../../src/components/icons/svg.html');
const data = require('../../../app/data/states-all.json');

let searchfieldInputEl;
let searchfieldAPI;
let svgEl;
let rowEl;

fdescribe('Searchfield API', () => {
  beforeEach(() => {
    searchfieldInputEl = null;
    searchfieldAPI = null;
    svgEl = null;
    rowEl = null;

    document.body.insertAdjacentHTML('afterbegin', svgHTML);
    document.body.insertAdjacentHTML('afterbegin', exampleHTML);

    svgEl = document.body.querySelector('.svg-icons');
    rowEl = document.body.querySelector('.row');
    searchfieldInputEl = document.body.querySelector('.searchfield');
    searchfieldInputEl.removeAttribute('data-options');
    searchfieldInputEl.classList.add('no-init');

    searchfieldAPI = new SearchField(searchfieldInputEl, {
      source: data
    });
  });

  afterEach(() => {
    searchfieldAPI.destroy();
    svgEl.parentNode.removeChild(svgEl);
    searchfieldInputEl.parentNode.removeChild(searchfieldInputEl);
    rowEl.parentNode.removeChild(rowEl);
  });

  it('can be invoked', () => {
    expect(searchfieldAPI).toEqual(jasmine.any(Object));
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
});
