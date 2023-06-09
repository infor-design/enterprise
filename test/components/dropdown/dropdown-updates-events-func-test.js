/**
 * @jest-environment jsdom
 */

import { cleanup } from '../../helpers/func-utils';
import { Dropdown } from '../../../src/components/dropdown/dropdown';
import { DOM } from '../../../src/utils/dom';

const dropdownHTML = `<div class="row">
  <div class="twelve columns">
    <div class="field">
      <label for="custom-dropdown-id-1" class="label">State</label>
      <select id="custom-dropdown-id-1" name="custom-dropdown-id-1" class="dropdown" data-automation-id="custom-automation-dropdown-id" >
        <option value="AL">Alabama</option>
        <option value="AK">Alaska</option>
        <option value="AZ">Arizona</option>
        <option value="AR">Arkansas</option>
        <option value="CA">California</option>
        <option value="CO">Colorado</option>
        <option value="CT">Connecticut</option>
        <option value="DE">Delaware</option>
        <option value="DC">District Of Columbia</option>
        <option value="FL">Florida</option>
        <option value="GA">Georgia</option>
        <option value="HI">Hawaii</option>
        <option value="ID">Idaho</option>
        <option value="IL">Illinois</option>
        <option value="IN">Indiana</option>
        <option value="IA">Iowa</option>
        <option value="KS">Kansas</option>
        <option value="KY">Kentucky</option>
        <option value="LA">Louisiana</option>
        <option value="ME">Maine</option>
        <option value="MD">Maryland</option>
        <option value="MA">Massachusetts</option>
        <option value="MI">Michigan</option>
        <option value="MN">Minnesota</option>
        <option value="MS">Mississippi</option>
        <option value="MO">Missouri</option>
        <option value="MT">Montana</option>
        <option value="NE">Nebraska</option>
        <option value="NV">Nevada</option>
        <option value="NH">New Hampshire</option>
        <option value="NJ" selected>New Jersey</option>
        <option value="NM">New Mexico</option>
        <option value="NY">New York</option>
        <option value="NC">North Carolina</option>
        <option value="ND">North Dakota</option>
        <option value="OH">Ohio</option>
        <option value="OK">Oklahoma</option>
        <option value="OR">Oregon</option>
        <option value="PA">Pennsylvania</option>
        <option value="RI">Rhode Island</option>
        <option value="SC">South Carolina</option>
        <option value="SD">South Dakota</option>
        <option value="TN">Tennessee</option>
        <option value="TX">Texas</option>
        <option value="UT">Utah</option>
        <option value="VT">Vermont</option>
        <option value="VA">Virginia</option>
        <option value="WA">Washington</option>
        <option value="WV">West Virginia</option>
        <option value="WI">Wisconsin</option>
        <option value="WY">Wyoming</option>
      </select>
    </div>
  </div>
</div>
`;

let dropdownEl;
let dropdownObj;

describe('Dropdown updates, events', () => {
  beforeEach(() => {
    cleanup(['.dropdown', '.field', '.dropdown-wrapper', '.twelve', '.svg-icons', '.dropdown-list', '.row', 'select', '.dropdown-list']);
    dropdownEl = null;
    dropdownObj = null;
    document.body.insertAdjacentHTML('afterbegin', dropdownHTML);
    dropdownEl = document.body.querySelector('.dropdown');
    dropdownEl.classList.add('no-init');
    dropdownObj = new Dropdown(dropdownEl);
  });

  afterEach(() => {
    dropdownObj.destroy();
    cleanup();
  });

  it('should set settings', () => {
    const settings = {
      closeOnSelect: true,
      cssClass: null,
      delay: 300,
      dropdownIcon: 'dropdown',
      empty: false,
      extraListWrapper: false,
      filterMode: 'contains',
      maxWidth: null,
      moveSelected: 'none',
      multiple: false,
      noSearch: false,
      placementOpts: null,
      reload: 'none',
      showEmptyGroupHeaders: false,
      showSelectAll: false,
      showSearchUnderSelected: false,
      sourceArguments: {},
      onKeyDown: null,
      showTags: false,
      tagSettings: {},
      allTextString: null,
      selectedTextString: null,
      tagListMaxHeight: 120,
      selectAllFilterOnly: true,
      attributes: null,
      appendTo: '[role="main"]',
      virtualScroll: false,
    };

    expect(dropdownObj.settings).toEqual(settings);
  });

  it('should update set settings via data', () => {
    const settings = {
      closeOnSelect: true,
      cssClass: null,
      delay: 2000,
      dropdownIcon: 'dropdown',
      empty: false,
      extraListWrapper: false,
      filterMode: 'contains',
      maxWidth: 1000,
      moveSelected: 'none',
      multiple: false,
      noSearch: false,
      placementOpts: null,
      reload: 'none',
      showEmptyGroupHeaders: false,
      showSelectAll: false,
      showSearchUnderSelected: false,
      sourceArguments: {},
      onKeyDown: null,
      showTags: false,
      tagSettings: {},
      allTextString: null,
      selectedTextString: null,
      tagListMaxHeight: 120,
      selectAllFilterOnly: true,
      attributes: null,
      appendTo: '[role="main"]',
      virtualScroll: false,
    };

    dropdownObj.updated();
    dropdownObj.settings.maxWidth = 1000;
    dropdownObj.settings.delay = 2000;

    expect(dropdownObj.settings).toEqual(settings);
  });

  it('should update set settings via parameter', () => {
    const settings = {
      closeOnSelect: true,
      cssClass: null,
      delay: 2000,
      dropdownIcon: 'dropdown',
      empty: false,
      extraListWrapper: false,
      filterMode: 'contains',
      maxWidth: 1000,
      moveSelected: 'none',
      multiple: false,
      noSearch: false,
      placementOpts: null,
      reload: 'none',
      showEmptyGroupHeaders: false,
      showSelectAll: false,
      showSearchUnderSelected: false,
      sourceArguments: {},
      onKeyDown: null,
      showTags: false,
      tagSettings: {},
      allTextString: null,
      selectedTextString: null,
      tagListMaxHeight: 120,
      selectAllFilterOnly: true,
      attributes: null,
      appendTo: '[role="main"]',
      virtualScroll: false,
      width: null,
      widthTarget: null
    };
    dropdownObj.updated(settings);

    expect(dropdownObj.settings).toEqual(settings);
  });

  it('should convert legacy settings', () => {
    const settings = {
      reloadSourceOnOpen: false // removed in v4.9.0 in favor of `reload`
    };
    dropdownObj.updated(settings);

    expect(dropdownObj.settings.reload).toEqual('none');
  });

  it('should trigger "has-updated" event', () => {
    const settings = {
      closeOnSelect: true,
      cssClass: null,
      delay: 2000,
      dropdownIcon: 'dropdown',
      empty: false,
      extraListWrapper: false,
      filterMode: 'contains',
      maxWidth: 1000,
      moveSelected: 'none',
      multiple: false,
      noSearch: false,
      placementOpts: null,
      reloadSourceOnOpen: false,
      showEmptyGroupHeaders: false,
      showSelectAll: false,
      showSearchUnderSelected: false,
      sourceArguments: {},
      onKeyDown: null,
      showTags: false,
      tagSettings: {},
      allTextString: null,
      selectedTextString: null,
      tagListMaxHeight: 120,
      selectAllFilterOnly: true,
      attributes: null,
      appendTo: '[role="main"]',
      virtualScroll: false,
      width: null,
      widthTarget: null
    };

    const callback = jest.fn();
    $('.dropdown').on('has-updated', callback);
    dropdownObj.updated(settings);

    expect(callback).toHaveBeenCalled();
  });

  it('should display the text of the first selected option when the list opens', (done) => {
    dropdownObj.open();
    const searchInput = dropdownObj.searchInput;

    expect(searchInput[0].value).toBe('New Jersey');
    done();
  });

  it('should trigger change event on click', (done) => {
    DOM.remove(document.querySelector('.dropdown-list'));
    const callback = jest.fn();
    $('.dropdown').on('change', callback);
    dropdownObj.open();
    document.body.querySelectorAll('.dropdown-option')[1].click();

    expect(callback).toHaveBeenCalled();
    done();
  });

  it('does not trigger change events when the same item is selected', (done) => {
    // Open the dropdown and click the second option once to pre-select it
    dropdownObj.open();
    document.body.querySelectorAll('.dropdown-option')[1].click();

    // Begin listening for change events
    const callback = jest.fn();
    $('.dropdown').on('change', callback);
    // Open the dropdown and click the second option another time.  It should not be re-selected.
    dropdownObj.open();
    document.body.querySelectorAll('.dropdown-option')[1].click();

    expect(callback).not.toHaveBeenCalled();
    done();
  });

  it('should trigger change event on duplicate label', () => {
    // Make some dup labels
    const options = document.body.querySelectorAll('option');
    options[0].innerText = 'Dup';
    options[1].innerText = 'Dup';

    // Try to select them and make sure you always get an event
    const callback = jest.fn();
    $('.dropdown').on('change', callback);
    dropdownObj.updated();
    dropdownObj.open();
    document.body.querySelectorAll('.dropdown-option')[0].click();

    expect(callback).toHaveBeenCalledTimes(1);

    document.body.querySelectorAll('.dropdown-option')[1].click();

    expect(callback).toHaveBeenCalledTimes(2);

    // Set back the output
    options[0].innerText = 'Alabama';
    options[1].innerText = 'Alaska';
    dropdownObj.updated();
    dropdownObj.open();
    document.body.querySelectorAll('.dropdown-option')[0].click();
  });
});
