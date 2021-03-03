import { SearchField } from '../../../src/components/searchfield/searchfield';
import { cleanup } from '../../helpers/func-utils';

const exampleHTML = require('../../../app/views/components/searchfield/test-selected-event.html');
const svgHTML = require('../../../src/components/icons/theme-new-svg.html');

let searchfieldInputEl;
let searchfieldAPI;
describe('Searchfield Events', () => {
  beforeEach(() => {
    searchfieldInputEl = null;
    searchfieldAPI = null;

    document.body.insertAdjacentHTML('afterbegin', svgHTML);
    document.body.insertAdjacentHTML('afterbegin', exampleHTML);

    searchfieldInputEl = document.body.querySelector('#short-category-searchfield');
    searchfieldInputEl.removeAttribute('data-options');
    searchfieldInputEl.classList.add('no-init');

    searchfieldAPI = new SearchField(searchfieldInputEl, {
      categories: [
        { name: 'Animals', id: 'animals', value: 'an', checked: true },
        { name: 'Baby', id: 'baby', value: 'ba', checked: false },
        { name: 'Clothing', id: 'clothing', value: 'cl', checked: false },
        { name: 'Images', id: 'images', value: 'im', checked: false },
        { name: 'People', id: 'people', value: 'pe', checked: false },
        { name: 'Places', id: 'places', value: 'pl', checked: false }
      ]
    });
  });

  afterEach(() => {
    if (searchfieldAPI) {
      searchfieldAPI.destroy();
    }
    cleanup();
  });
});
