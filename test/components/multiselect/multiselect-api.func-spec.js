import { MultiSelect } from '../../../src/components/multiselect/multiselect';
import { cleanup } from '../../helpers/func-utils';

const multiSelectHTML = require('../../../app/views/components/multiselect/_samples-standard.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');
const statesMultiselectData = require('../../../app/data/states-multiselect.json');

let multiSelectEl;
let multiSelectObj;

describe('MultiSelect API', () => {
  beforeEach(() => {
    multiSelectEl = null;
    multiSelectObj = null;
    document.body.insertAdjacentHTML('afterbegin', multiSelectHTML);
    document.body.insertAdjacentHTML('afterbegin', svg);
    multiSelectEl = document.body.querySelector('.multiselect');
    multiSelectEl.classList.add('no-init');
    multiSelectObj = new MultiSelect(multiSelectEl);
  });

  afterEach(() => {
    multiSelectObj.destroy();
    cleanup();
  });

  it('Should be defined on jQuery object', () => {
    expect(multiSelectObj).toEqual(jasmine.any(Object));
  });

  it('Should be build multiSelect correctly', () => {
    expect(multiSelectObj.element[0].multiple).toBeTruthy();
  });

  it('Should disable multiselect', () => {
    multiSelectObj.disable();
  });

  it('Should enable multiselect', () => {
    multiSelectObj.enable();
  });
});

describe('Multiselect API (ajax)', () => {
  const multiSelectSingleItemHTML = `
    <div class="field">
      <label for="multi-standard" class="label">Multiselect</label>
      <select multiple id="multi-standard" name="multi-standard" data-maxselected="10" class="multiselect">
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
    document.body.insertAdjacentHTML('afterbegin', svg);
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
    expect(predefinedOpt).toBeDefined();
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
});
