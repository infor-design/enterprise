/**
 * @jest-environment jsdom
 */
import { SearchField } from '../../../src/components/searchfield/searchfield';
import { cleanup } from '../../helpers/func-utils';

const exampleHTML = `<div class="row">
  <div class="six columns">
    <div class="field">
      <label for="category-searchfield">Category-Driven Single-Selectable Searchfield</label>
      <input data-init="false" id="category-searchfield" class="searchfield" />
    </div>
  </div>
  <div class="six columns">
    <div class="field">
      <label for="multi-category-searchfield">Category-Driven Multi-Selectable Searchfield</label>
      <input data-init="false" id="multi-category-searchfield" class="searchfield" />
    </div>
  </div>
</div>`;

const categoryData = require('../../../app/data/searchfield-shopping-categories.json');

let searchfieldSingleInputEl;
let searchfieldSingleAPI;
let searchfieldMultiInputEl;
let searchfieldMultiAPI;

describe('Searchfield API (full categories)', () => {
  beforeEach(() => {
    searchfieldSingleInputEl = null;
    searchfieldSingleAPI = null;
    searchfieldMultiInputEl = null;
    searchfieldMultiAPI = null;

    document.body.insertAdjacentHTML('afterbegin', exampleHTML);

    searchfieldSingleInputEl = document.body.querySelector('#category-searchfield');
    searchfieldMultiInputEl = document.body.querySelector('#multi-category-searchfield');

    searchfieldSingleAPI = new SearchField(searchfieldSingleInputEl, {
      categories: categoryData,
      showCategoryText: true
    });

    searchfieldMultiAPI = new SearchField(searchfieldMultiInputEl, {
      categories: categoryData,
      categoryMultiselect: true,
      showCategoryText: true
    });
  });

  afterEach(() => {
    if (searchfieldSingleAPI) {
      searchfieldSingleAPI.destroy();
    }
    if (searchfieldMultiAPI) {
      searchfieldMultiAPI.destroy();
    }
    cleanup();
  });

  it('can be invoked', () => {
    expect(searchfieldSingleAPI).toBeTruthy();
    expect(searchfieldMultiAPI).toBeTruthy();
  });

  it('properly announces that it has categories', () => {
    expect(searchfieldSingleAPI.hasCategories()).toBeTruthy();
  });

  it('renders a categories button', () => {
    const button = searchfieldSingleAPI.categoryButton;

    expect(button).toBeTruthy();
  });

  it('can retrieve categories as data', () => {
    const categories = searchfieldSingleAPI.getCategoryData();

    expect(categories).toBeTruthy();
    expect(categories.length).toBe(6);
  });

  it('can retrieve only selected categories as data', () => {
    const categories = searchfieldMultiAPI.getCategoryData(true);

    expect(categories).toBeTruthy();
    expect(categories.length).toBe(3);
  });

  it('will only retrieve one selected category in a single-select categories data store', () => {
    // NOTE: original imported data has three selected items.  The component should
    // properly figure out that only one is selected.
    const categories = searchfieldSingleAPI.getCategoryData(true);

    expect(categories).toBeTruthy();
    expect(categories.length).toBe(1);
  });

  it('can retrieve a jQuery-wrapped list of menu item element references for each category', () => {
    const elems = searchfieldSingleAPI.getCategories();

    expect(elems).toBeTruthy();
    expect(elems.length).toBe(6);
    expect(elems.eq(2).text().trim()).toBe('Clothing');
  });

  it('can retrieve a jQuery-wrapped list of menu item element references for each selected category', () => {
    const elems = searchfieldMultiAPI.getSelectedCategories();

    expect(elems).toBeTruthy();
    expect(elems.length).toBe(3);
    expect(elems.eq(2).text().trim()).toBe('Images');
  });

  it('will only return one selected category in a single-select categories list', () => {
    const elems = searchfieldSingleAPI.getSelectedCategories();

    expect(elems).toBeTruthy();
    expect(elems.length).toBe(1);
    expect(elems.eq(0).text().trim()).toBe('Animals');
  });
});
