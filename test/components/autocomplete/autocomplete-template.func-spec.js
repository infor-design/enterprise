import { Autocomplete } from '../../../src/components/autocomplete/autocomplete';

const svgHTML = require('../../../src/components/icons/theme-uplift-svg.html');

// For Non-standard Template
const newTemplateHTML = require('../../../app/views/components/autocomplete/example-templates.html');
const emailData = require('../../../app/data/autocomplete-users.json');

let autocompleteInputEl;
let autocompleteLabelEl;
let autocompleteAPI;
let svgEl;
let alternateTemplateEl;

describe('Autocomplete API', () => {
  beforeEach(() => {
    alternateTemplateEl = null;
    autocompleteInputEl = null;
    autocompleteAPI = null;
    svgEl = null;

    document.body.insertAdjacentHTML('afterbegin', svgHTML);
    document.body.insertAdjacentHTML('afterbegin', newTemplateHTML);

    // remove unncessary stuff
    const inlineScripts = document.body.querySelector('#test-scripts');
    inlineScripts.parentNode.removeChild(inlineScripts);

    svgEl = document.body.querySelector('.svg-icons');
    autocompleteLabelEl = document.body.querySelector('label[for="auto-template"]');
    autocompleteInputEl = document.body.querySelector('#auto-template');
    autocompleteInputEl.classList.add('no-init');
    autocompleteInputEl.removeAttribute('data-autocomplete');
    autocompleteInputEl.removeAttribute('data-tmpl');
    alternateTemplateEl = document.body.querySelector('#autocomplete-template-email');

    autocompleteAPI = new Autocomplete(autocompleteInputEl, {
      template: alternateTemplateEl,
      source: emailData
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

  it('should render a user-provided, alternate template for its results', () => {
    autocompleteAPI.openList('q', emailData);
    const autocompleteListEl = document.querySelector('#autocomplete-list');
    const resultItems = autocompleteListEl.querySelectorAll('li');

    expect(resultItems).toBeDefined();
    expect(resultItems.length).toEqual(1);
    expect(resultItems[0].querySelector('span').innerText.trim()).toEqual('Quincy Adams');

    // Look for an extra element not provided by the standard template
    expect(resultItems[0].querySelector('small')).toBeDefined();
  });
});
