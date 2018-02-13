import { Dropdown } from '../../dropdown';

const dropdownHTML = require('../../example-index.html');
const svg = require('../../../icons/svg.html');

let dropdownEl;
let svgEl;
let rowEl;
let dropdownObj;

describe('Dropdown updates, events', () => {
  beforeEach(() => {
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
    $('.dropdown').dropdown();
    dropdownObj = new Dropdown(dropdownEl);
  });

  afterEach(() => {
    dropdownObj.destroy();
    $('.dropdown').destroy();
    dropdownEl.remove();
    rowEl.remove();
    svgEl.remove();
  });

  it('Should set settings', () => {
    const settings = {
      closeOnSelect: true,
      cssClass: null,
      filterMode: 'contains',
      moveSelected: 'none',
      multiple: false,
      noSearch: false,
      showEmptyGroupHeaders: false,
      showSelectAll: false,
      sourceArguments: {},
      reloadSourceOnOpen: false,
      empty: false,
      delay: 300,
      maxWidth: null
    };
    expect(dropdownObj.settings).toEqual(settings);
  });

  it('Should update set settings via data', () => {
    const settings = {
      closeOnSelect: true,
      cssClass: null,
      filterMode: 'contains',
      moveSelected: 'none',
      multiple: false,
      noSearch: false,
      showEmptyGroupHeaders: false,
      showSelectAll: false,
      sourceArguments: {},
      reloadSourceOnOpen: false,
      empty: false,
      delay: 2000,
      maxWidth: 1000
    };

    dropdownObj.updated();
    dropdownObj.settings.maxWidth = 1000;
    dropdownObj.settings.delay = 2000;
    expect(dropdownObj.settings).toEqual(settings);
  });

  it('Should update set settings via parameters', () => {
    const settings = {
      closeOnSelect: true,
      cssClass: null,
      filterMode: 'contains',
      moveSelected: 'none',
      multiple: false,
      noSearch: false,
      showEmptyGroupHeaders: false,
      showSelectAll: false,
      sourceArguments: {},
      reloadSourceOnOpen: false,
      empty: false,
      delay: 2000,
      maxWidth: 1000
    };

    dropdownObj.updated(settings);
    expect(dropdownObj.settings).toEqual(settings);
  });

  it('Should trigger "has-updated" event', () => {
    $('.dropdown').on('has-update', () => {
      expect(true).toBe(true);
    });
    dropdownObj.updated();
  });
});
