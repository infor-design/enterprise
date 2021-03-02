import { Autocomplete } from '../../../src/components/autocomplete/autocomplete';
import { cleanup } from '../../helpers/func-utils';

const exampleHTML = require('../../../app/views/components/autocomplete/example-index.html');
const svgHTML = require('../../../src/components/icons/theme-new-svg.html');
const data = require('../../../app/data/states-all.json');

let autocompleteInputEl;
let autocompleteLabelEl;
let autocompleteAPI;
let svgEl;

describe('Autocomplete API', () => {
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
      source: data
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
    cleanup();
  });

  it('triggers a `listopen` event when the results list is opened', (done) => {
    const spyListopenEvent = spyOnEvent($(autocompleteInputEl), 'listopen');
    autocompleteAPI.openList('new', data);

    expect(spyListopenEvent).toHaveBeenTriggered();
    done();
  });

  it('triggers a `listclose` event when the results list is closed', (done) => {
    const spyListcloseEvent = spyOnEvent($(autocompleteInputEl), 'listclose');
    autocompleteAPI.openList('new', data);
    autocompleteAPI.closeList();

    expect(spyListcloseEvent).toHaveBeenTriggered();
    done();
  });

  it('triggers a `selected` event when a list item is clicked', (done) => {
    const spySelectedEvent = spyOnEvent($(autocompleteInputEl), 'selected');
    autocompleteAPI.openList('new', data);
    const autocompleteListEl = document.querySelector('#autocomplete-list');
    const resultItems = autocompleteListEl.querySelectorAll('li');

    autocompleteAPI.select($(resultItems[0].querySelector('a')), data);

    expect(spySelectedEvent).toHaveBeenTriggered();
    expect(spySelectedEvent.calls.count()).toEqual(1);
    done();
  });

  it('triggers a `beforeopen` event before the list is opened', (done) => {
    const spyBeforeOpenEvent = spyOnEvent($(autocompleteInputEl), 'beforeopen.autocomplete');
    autocompleteAPI.openList('new', data);

    expect(spyBeforeOpenEvent).toHaveBeenTriggered();
    done();
  });
});
