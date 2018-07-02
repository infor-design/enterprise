import { SearchField } from '../../../src/components/searchfield/searchfield';

const exampleHTML = require('../../../app/views/components/searchfield/test-selected-event.html');
const svgHTML = require('../../../src/components/icons/svg.html');

let searchfieldInputEl;
let searchfieldAPI;
let svgEl;
let rowEl;

describe('Searchfield Events', () => {
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
    searchfieldAPI.destroy();
    svgEl.parentNode.removeChild(svgEl);
    searchfieldInputEl.parentNode.removeChild(searchfieldInputEl);
    rowEl.parentNode.removeChild(rowEl);
  });

  it('triggers a `selected` event on the searchfield element when a category is selected', () => {
    const spyEvent = spyOnEvent($(searchfieldInputEl), 'selected');
    const popupmenuAPI = searchfieldAPI.categoryButton.data('popupmenu');

    popupmenuAPI.open();
    const selectItem = document.body.querySelectorAll('.popupmenu a');
    $(selectItem[2]).trigger('click');

    expect(spyEvent).toHaveBeenTriggered();
  });
});
