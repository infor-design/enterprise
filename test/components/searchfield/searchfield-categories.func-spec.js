import { SearchField } from '../../../src/components/searchfield/searchfield';

const exampleHTML = require('../../../app/views/components/searchfield/example-categories-full.html');
const svgHTML = require('../../../src/components/icons/svg.html');
const categoryData = require('../../../app/data/searchfield-shopping-categories.json');

let searchfieldSingleInputEl;
let searchfieldSingleAPI;
let searchfieldMultiInputEl;
let searchfieldMultiAPI;
let svgEl;
let rowEls;
let testScriptEl;

describe('Searchfield API (full categories)', () => {
  beforeEach(() => {
    searchfieldSingleInputEl = null;
    searchfieldSingleAPI = null;
    searchfieldMultiInputEl = null;
    searchfieldMultiAPI = null;
    svgEl = null;
    rowEls = null;

    document.body.insertAdjacentHTML('afterbegin', svgHTML);
    document.body.insertAdjacentHTML('afterbegin', exampleHTML);

    svgEl = document.body.querySelector('.svg-icons');
    rowEls = document.body.querySelectorAll('.row');
    searchfieldSingleInputEl = document.body.querySelector('#category-searchfield');
    searchfieldMultiInputEl = document.body.querySelector('#multi-category-searchfield');
    testScriptEl = document.body.querySelector('#test-script');
    testScriptEl.parentNode.removeChild(testScriptEl);

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
    searchfieldSingleAPI.destroy();
    searchfieldMultiAPI.destroy();

    svgEl.parentNode.removeChild(svgEl);
    Array.from(rowEls).forEach((row) => { // eslint-disable-line compat/compat
      row.parentNode.removeChild(row);
    });
  });

  it('can be invoked', () => {
    expect(searchfieldSingleAPI).toEqual(jasmine.any(Object));
    expect(searchfieldMultiAPI).toEqual(jasmine.any(Object));
  });

  it('properly announces that it has categories', () => {
    expect(searchfieldSingleAPI.hasCategories()).toBeTruthy();
  });

  it('renders a categories button', () => {
    const button = searchfieldSingleAPI.categoryButton;

    expect(button).toBeDefined();
  });

  it('can retrieve categories as data', () => {
    const categories = searchfieldSingleAPI.getCategoryData();

    expect(categories).toBeDefined();
    expect(categories.length).toBe(6);
    expect(categories[2].name).toBe('Clothing');
  });

  it('can retrieve only selected categories as data', () => {
    const categories = searchfieldMultiAPI.getCategoryData(true);

    expect(categories).toBeDefined();
    expect(categories.length).toBe(3);
    expect(categories[2].name).toBe('Images');
  });

  it('will only retrieve one selected category in a single-select categories data store', () => {
    // NOTE: original imported data has three selected items.  The component should
    // properly figure out that only one is selected.
    const categories = searchfieldSingleAPI.getCategoryData(true);

    expect(categories).toBeDefined();
    expect(categories.length).toBe(1);
    expect(categories[0].name).toBe('Animals');
  });

  it('can retrieve a jQuery-wrapped list of menu item element references for each category', () => {
    const elems = searchfieldSingleAPI.getCategories();

    expect(elems).toBeDefined();
    expect(elems.length).toBe(6);
    expect(elems.eq(2).text().trim()).toBe('Clothing');
  });

  it('can retrieve a jQuery-wrapped list of menu item element references for each selected category', () => {
    const elems = searchfieldMultiAPI.getSelectedCategories();

    expect(elems).toBeDefined();
    expect(elems.length).toBe(3);
    expect(elems.eq(2).text().trim()).toBe('Images');
  });

  it('will only return one selected category in a single-select categories list', () => {
    const elems = searchfieldSingleAPI.getSelectedCategories();

    expect(elems).toBeDefined();
    expect(elems.length).toBe(1);
    expect(elems.eq(0).text().trim()).toBe('Animals');
  });
});
