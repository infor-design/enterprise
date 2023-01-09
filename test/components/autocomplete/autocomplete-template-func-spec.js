/**
 * @jest-environment jsdom
 */
import { Autocomplete } from '../../../src/components/autocomplete/autocomplete';
import { cleanup } from '../../helpers/func-utils';

// For Non-standard Template
const newTemplateHTML = `<div class="row">
  <div class="twelve columns">
    <h2 class="fieldset-title">Autocomplete Example: Alternate Templates</h2>
  </div>
</div>

<div class="row">
  <div class="twelve columns">
    <div class="field">
      <label for="auto-template">Users</label>
      <input class="autocomplete" data-autocomplete="source" data-init="false" data-tmpl="#autocomplete-template-email" id="auto-template" placeholder="Type to Search" type="text">
    </div>
  </div>
</div>

<!-- Switch Delimiter to prevent server side processing -->
{{=<% %>=}}
<script id="autocomplete-template-email" type="text/html">
  <li id="{{listItemId}}" {{#hasValue}} data-value="{{value}}" {{/hasValue}} role="listitem">
    <a href="#" tabindex="-1">
       <span>{{{label}}}</span>
       <small>{{{email}}}</small>

       <span style="display: none;" class="display-value">{{{label}}} - {{{email}}}</span>
    </a>
  </li>
</script>
<%={{ }}=%>

<script id="test-scripts">
  $('body').on('initialized', function() {

  // Setup an alternate source for the templated Autocomplete.
    $('#auto-template').autocomplete({
      source: function (req, resp) {
        var data = [];
        data.push({ label: 'John Smith', email: 'John.Smith@example.com', value: '0' });
        data.push({ label: 'Alex Mills', email: 'Alex.Mills@example.com', value: '1' });
        data.push({ label: 'Steve Mills', email: 'Steve.Mills@example.com', value: '2' });
        data.push({ label: 'Quincy Adams', email: 'Quincy.Adams@example.com', value: '3' });
        data.push({ label: 'Paul Thompson', email: 'Paul.Thompson@example.com', value: '4' });
        resp(req, data);
      }
    }).on('selected', function (e, anchor) {
      console.log('Changed to: ' + $(anchor).parent().attr('data-value'));
    });

    $('#auto-default, #auto-template').on('selected.test', function(e, anchor, item) {
      var anchorText = $(anchor).text().trim(),
        displayValue = $(anchor).find('.display-value'),
        indicatorText;

      if (displayValue && displayValue.length) {
        anchorText = displayValue.text().trim();
        indicatorText = '(was a display value)';
      }

      $('body').toast({
        title: 'Selected',
        message: 'Selected the <b>"' + anchorText + '"</b> item with value <b>' + item.value + '</b>!' + (indicatorText ? '<br/><em>' + indicatorText + '</em>' : '')
      });
    });

  });
</script>`;
const emailData = require('../../../app/data/autocomplete-users.json');

let autocompleteInputEl;
let autocompleteLabelEl;
let autocompleteAPI;
let alternateTemplateEl;

describe('Autocomplete API', () => {
  beforeEach(() => {
    alternateTemplateEl = null;
    autocompleteInputEl = null;
    autocompleteAPI = null;

    document.body.insertAdjacentHTML('afterbegin', newTemplateHTML);

    // remove unncessary stuff
    const inlineScripts = document.body.querySelector('#test-scripts');
    inlineScripts?.parentNode?.removeChild(inlineScripts);

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
    autocompleteAPI?.destroy();

    const autocompleteListEl = document.querySelector('#autocomplete-list');
    if (autocompleteListEl) {
      autocompleteListEl.parentNode.removeChild(autocompleteListEl);
    }
    autocompleteLabelEl.parentNode.removeChild(autocompleteLabelEl);
    autocompleteInputEl.parentNode.removeChild(autocompleteInputEl);
    cleanup();
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
