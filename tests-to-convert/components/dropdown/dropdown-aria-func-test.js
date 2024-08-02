/**
 * @jest-environment jsdom
 */
import { Dropdown } from '../../../src/components/dropdown/dropdown';
import { cleanup } from '../../helpers/func-utils';

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

describe('Dropdown ARIA', () => {
  beforeEach((done) => {
    dropdownEl = null;
    dropdownObj = null;
    document.body.insertAdjacentHTML('afterbegin', dropdownHTML);
    dropdownEl = document.body.querySelector('.dropdown');
    dropdownEl.classList.add('no-init');
    dropdownObj = new Dropdown(dropdownEl);
    done();
  });

  afterEach(() => {
    dropdownObj.destroy();
    cleanup();
  });

  it('should set ARIA labels', (done) => {
    dropdownObj.open();

    expect(document.querySelector('div.dropdown[aria-haspopup="listbox"]')).toBeTruthy();
    expect(document.querySelector('div.dropdown .audible').textContent).toEqual('State ');
    expect(document.querySelector('#dropdown-list ul[role="listbox"]')).toBeTruthy();
    expect(document.querySelectorAll('#dropdown-list [role="option"]').length).toBeTruthy();
    done();
  });
});
