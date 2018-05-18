import { SearchField } from '../../../src/components/searchfield/searchfield';

const exampleHTML = require('../../../app/views/components/searchfield/example-index.html');
const svgHTML = require('../../../src/components/icons/svg.html');
const data = require('../../../app/data/states-all.json');

let searchfieldInputEl;
let searchfieldAPI;
let svgEl;

describe('Searchfield API', () => {
  beforeEach(() => {
    searchfieldInputEl = null;
    searchfieldAPI = null;
    svgEl = null;

    document.body.insertAdjacentHTML('afterbegin', svgHTML);
    document.body.insertAdjacentHTML('afterbegin', exampleHTML);

    svgEl = document.body.querySelector('.svg-icons');
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
  });

  it('can be invoked', () => {
    expect(searchfieldAPI).toEqual(jasmine.any(Object));
  });

  it('renders attributes', () => {
    expect(searchfieldInputEl.getAttribute('autocomplete')).toBe('off');
  });
});
