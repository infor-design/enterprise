import { Dropdown } from '../../../src/components/dropdown/dropdown';

const dropdownHTML = require('../../../app/views/components/dropdown/example-no-search-lsf.html');
const svg = require('../../../src/components/icons/svg.html');

let dropdownEl;
let svgEl;
let dropdownObj;

describe('Dropdown API (No Search Mode)', () => {
  beforeEach(() => {
    dropdownEl = null;
    svgEl = null;
    dropdownObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', dropdownHTML);
    dropdownEl = document.body.querySelector('.dropdown');
    svgEl = document.body.querySelector('.svg-icons');
    dropdownEl.classList.add('no-init');
    dropdownObj = new Dropdown(dropdownEl);
  });

  afterEach(() => {
    dropdownObj.destroy();
    dropdownEl.parentNode.removeChild(dropdownEl);
    svgEl.parentNode.removeChild(svgEl);
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
