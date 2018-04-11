import { Dropdown } from '../dropdown';

const dropdownHTML = require('../example-index.html');
const svg = require('../../icons/svg.html');

let dropdownEl;
let svgEl;
let dropdownObj;

describe('Dropdown ARIA', () => {
  beforeEach((done) => {
    dropdownEl = null;
    svgEl = null;
    dropdownObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', dropdownHTML);
    dropdownEl = document.body.querySelector('.dropdown');
    svgEl = document.body.querySelector('.svg-icons');
    dropdownEl.classList.add('no-init');
    dropdownObj = new Dropdown(dropdownEl);
    done();
  });

  afterEach(() => {
    dropdownObj.destroy();
    dropdownEl.parentNode.removeChild(dropdownEl);
    svgEl.parentNode.removeChild(svgEl);
    if (document.querySelector('.dropdown-list')) {
      const dropdownElList = document.querySelector('.dropdown-list');
      dropdownElList.parentNode.removeChild(dropdownElList);
    }
  });

  it('Should set ARIA labels', (done) => {
    expect(document.querySelector('[aria-expanded="false"]')).toBeTruthy();
    expect(document.querySelector('[aria-autocomplete="list"]')).toBeTruthy();
    expect(document.querySelector('[aria-controls="dropdown-list"]')).toBeTruthy();
    done();
  });
});
