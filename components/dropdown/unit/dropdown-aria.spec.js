import axe from 'axe-core';
import { Dropdown } from '../dropdown';

const axeOptions = {
  rules: [
    {
      id: 'aria-allowed-attr',
      enabled: false
    },
    {
      id: 'aria-required-children',
      enabled: false
    },
    {
      id: 'aria-valid-attr-value',
      enabled: false
    }
  ]
};

const dropdownHTML = require('../example-index.html');
const svg = require('../../icons/svg.html');

let dropdownEl;
let svgEl;
let rowEl;
let dropdownObj;

describe('Dropdown ARIA', () => {
  beforeEach((done) => {
    dropdownEl = null;
    svgEl = null;
    rowEl = null;
    dropdownObj = null;
    document.body.insertAdjacentHTML('afterbegin', dropdownHTML);
    document.body.insertAdjacentHTML('afterbegin', svg);
    dropdownEl = document.body.querySelector('.dropdown');
    rowEl = document.body.querySelector('.row');
    svgEl = document.body.querySelector('.svg-icons');
    dropdownEl.classList.add('no-init');
    dropdownObj = new Dropdown(dropdownEl);
    axe.configure(axeOptions);
    done();
  });

  afterEach(() => {
    dropdownObj.destroy();
    dropdownEl.remove();
    rowEl.remove();
    svgEl.remove();
    if (document.querySelector('.dropdown-list')) {
      document.querySelector('.dropdown-list').remove();
    }
  });

  it('Should set ARIA labels', (done) => {
    expect(document.querySelector('[aria-expanded="false"]')).toBeTruthy();
    expect(document.querySelector('[aria-autocomplete="list"]')).toBeTruthy();
    expect(document.querySelector('[aria-controls="dropdown-list"]')).toBeTruthy();
    done();
  });

  it('Should be accessible on init with no WCAG 2AA violations', (done) => {
    axe.run(document.body, (err, { violations }) => {
      expect(err).toBeFalsy();
      expect(violations.length).toEqual(0);
      done();
    });
  });

  it('Should be accessible on open with no WCAG 2AA violations', (done) => {
    axe.run(document.body, (err, { violations }) => {
      dropdownObj.open();
      expect(err).toBeFalsy();
      expect(violations.length).toEqual(0);
      done();
    });
  });
});
