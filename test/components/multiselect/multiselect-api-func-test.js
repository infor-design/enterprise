/**
 * @jest-environment jsdom
 */
import { MultiSelect } from '../../../src/components/multiselect/multiselect';
import { cleanup } from '../../helpers/func-utils';

const multiSelectHTML = `<div class="field">
  <label for="multi-standard" class="label">States (Max 10)</label>
  <select multiple id="multi-standard" name="multi-standard" data-maxselected="10" class="multiselect">
    <option value="AL">Alabama</option>
    <option value="AK" selected>Alaska</option>
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
    <option value="NJ">New Jersey</option>
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
</div>`;

const statesMultiselectData = require('../../../app/data/states-multiselect.json');

let multiSelectEl;
let multiSelectObj;

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

describe('MultiSelect API', () => {
  beforeEach(() => {
    multiSelectEl = null;
    multiSelectObj = null;
    document.body.insertAdjacentHTML('afterbegin', multiSelectHTML);
    multiSelectEl = document.body.querySelector('.multiselect');
    multiSelectEl.classList.add('no-init');
    multiSelectObj = new MultiSelect(multiSelectEl);
  });

  afterEach(() => {
    multiSelectObj.destroy();
    cleanup();
  });

  it('should be defined on jQuery object', () => {
    expect(multiSelectObj).toBeTruthy();
  });

  it('should be build multiSelect correctly', () => {
    expect(multiSelectObj.element[0].multiple).toBeTruthy();
  });

  it('should disable multiselect', () => {
    multiSelectObj.disable();
  });

  it('should enable multiselect', () => {
    multiSelectObj.enable();
  });
});

describe('Multiselect API (ajax)', () => {
  const multiSelectSingleItemHTML = `
    <div class="field">
      <label for="multi-standard-ajax" class="label">Multiselect</label>
      <select multiple id="multi-standard-ajax" name="multi-standard" data-maxselected="10" class="multiselect">
        <option selected value="FL">Florida</option>
      </div>
    </div>
  `;

  // Pulls this in directly from the demoapp's datasource.
  // "NJ", "NY", and "PA" are all selected.
  const source = function (response) {
    response(statesMultiselectData);
  };

  beforeEach(() => {
    multiSelectEl = null;
    multiSelectObj = null;
    document.body.insertAdjacentHTML('afterbegin', multiSelectSingleItemHTML);
    multiSelectEl = document.body.querySelector('.multiselect');
  });

  afterEach(() => {
    multiSelectObj.destroy();
    cleanup();
  });

  it('can set selected items from a datasource', (done) => {
    multiSelectObj = new MultiSelect(multiSelectEl, {
      source
    });
    const predefinedOpt = multiSelectEl.querySelector('option');

    // Detect the pre-defined selected option
    expect(predefinedOpt).toBeTruthy();
    expect(predefinedOpt.value).toEqual('FL');
    expect(multiSelectObj.dropdown.selectedValues.includes(predefinedOpt.value)).toBeTruthy();

    multiSelectObj.dropdown.open();

    setTimeout(() => {
      // Should include the predefined selected value AND the selected values from the backend
      expect(multiSelectObj.dropdown.selectedValues.length).toEqual(4);
      expect(multiSelectObj.dropdown.selectedValues.includes(predefinedOpt.value)).toBeTruthy();
      done();
    }, 650);
  });

  it('should disable options', () => {
    const statesToDisable = ['AK', 'AR', 'WY'];
    const statesDisabledData = statesMultiselectData.map((item) => {
      if (statesToDisable.includes(item.value)) {
        return {
          ...item,
          disabled: true
        };
      }

      return item;
    });
    multiSelectObj = new MultiSelect(multiSelectEl, {
      source: (response) => {
        response(statesDisabledData);
      }
    });

    multiSelectObj.dropdown.open();

    const listDisabled = document.querySelectorAll('.dropdown-list[data-element-id="multi-standard-ajax"] .is-disabled');

    expect([...listDisabled].map(item => item.dataset.val)).toEqual(statesToDisable);
  });
});
