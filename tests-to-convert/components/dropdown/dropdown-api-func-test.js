/**
 * @jest-environment jsdom
 */
import { Dropdown } from '../../../src/components/dropdown/dropdown';
import { cleanup } from '../../helpers/func-utils';

const statesDropdownData = require('../../../app/data/states-all.json');

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

describe('Dropdown API', () => {
  beforeEach(() => {
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

  it('should be defined on jQuery object', () => {
    expect(dropdownObj).toBeTruthy();
  });

  it('should open dropdown', () => {
    dropdownObj.open();

    expect(dropdownObj.isOpen()).toBeTruthy();
    expect(document.body.querySelector('.dropdown.is-open')).toBeTruthy();
  });

  it('should activate dropdown', () => {
    dropdownObj.activate();

    expect(dropdownObj.isOpen()).toBeFalsy();
    expect(document.body.querySelector('.dropdown.is-open')).toBeFalsy();
  });

  it('should destroy dropdown', () => {
    dropdownObj.destroy();

    expect(dropdownObj.isOpen()).toBeFalsy();
    expect(document.body.querySelector('.dropdown.is-open')).toBeFalsy();
  });

  it('should disable dropdown', () => {
    dropdownObj.disable();

    expect(document.body.querySelector('.dropdown.is-disabled')).toBeTruthy();
    expect(dropdownObj.isDisabled()).toBeTruthy();
  });

  it('should enable dropdown', () => {
    dropdownObj.enable();

    expect(document.body.querySelector('.dropdown.is-disabled')).toBeFalsy();
    expect(dropdownObj.isDisabled()).toBeFalsy();
  });

  it('should render dropdown readonly', () => {
    dropdownObj.readonly();

    expect(document.body.querySelector('.dropdown.is-readonly')).toBeTruthy();
    expect(document.body.querySelector('.dropdown.is-readonly').getAttribute('aria-readonly')).toEqual('true');
    expect(dropdownObj.isDisabled()).toBeFalsy();
  });

  it('can have its value programmatically changed with a string value', () => {
    // Default value is "NJ".
    // Using the text value when there's a `data-value` shouldn't change the value.
    dropdownObj.selectValue('New York');

    expect(dropdownObj.element.val()).toBe('NJ');

    // Use the `data-value`
    dropdownObj.selectValue('NY');

    expect(dropdownObj.element.val()).toBe('NY');
  });

  it('can have its value programmatically changed with a reference to one of its option elements', () => {
    const targetOpt = dropdownEl.querySelector('option[value="NY"]');
    dropdownObj.select(targetOpt);

    expect(dropdownObj.element.val()).toBe('NY');
  });

  it('can have its value programmatically changed with a reference to one of its rendered list items', () => {
    dropdownObj.open();

    // `targetEl` will be the list item for New Hampshire
    const targetEl = document.querySelector('#dropdown-list > ul > li.dropdown-option:nth-child(0n+30');
    dropdownObj.selectOption($(targetEl));

    expect(dropdownObj.element.val()).toBe('NH');
  });
});

describe('Dropdown API (ajax)', () => {
  const dropdownAjaxHtml = `
    <div class="field">
      <label for="custom-dropdown-ajax" class="label">State</label>
      <select id="custom-dropdown-ajax" class="dropdown"></select>
    </div>
  `;

  beforeEach(() => {
    dropdownEl = null;
    dropdownObj = null;
    document.body.insertAdjacentHTML('afterbegin', dropdownAjaxHtml);
    dropdownEl = document.body.querySelector('.dropdown');
  });

  afterEach(() => {
    dropdownObj.destroy();
    cleanup();
  });

  it('should disable options', () => {
    const statesToDisable = ['AK', 'AR', 'WY'];
    const statesDisabledData = statesDropdownData.map((item) => {
      if (statesToDisable.includes(item.value)) {
        return {
          ...item,
          disabled: true
        };
      }

      return item;
    });
    dropdownObj = new Dropdown(dropdownEl, {
      source: (response) => {
        response(statesDisabledData);
      }
    });

    dropdownObj.open();

    const listDisabled = document.querySelectorAll('.dropdown-list[data-element-id="custom-dropdown-ajax"] .is-disabled');

    expect([...listDisabled].map(item => item.dataset.val)).toEqual(statesToDisable);
  });
});

