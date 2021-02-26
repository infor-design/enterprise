import { Dropdown } from '../../../src/components/dropdown/dropdown';
import { cleanup } from '../../helpers/func-utils';

const dropdownHTML = require('../../../app/views/components/dropdown/example-no-search-lsf.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let dropdownEl;
let dropdownObj;

describe('Dropdown API (No Search Mode)', () => {
  beforeEach(() => {
    dropdownEl = null;
    dropdownObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', dropdownHTML);
    dropdownEl = document.body.querySelector('.dropdown');
    dropdownEl.classList.add('no-init');
    dropdownObj = new Dropdown(dropdownEl);
  });

  afterEach(() => {
    dropdownObj.destroy();
    cleanup(['.dropdown', '.svg-icons', '.dropdown-list', '.row', 'select', '#dropdown-setup-script']);
  });

  it('can programmatically select an item that starts with a specified character', () => {
    dropdownObj.selectStartsWith('t');

    expect(dropdownObj.element.val()).toBe('T');

    dropdownObj.selectStartsWith('t');

    expect(dropdownObj.element.val()).toBe('T2');

    dropdownObj.selectStartsWith('t');

    expect(dropdownObj.element.val()).toBe('T3');

    dropdownObj.selectStartsWith('t');

    expect(dropdownObj.element.val()).toBe('T');
  });
});
