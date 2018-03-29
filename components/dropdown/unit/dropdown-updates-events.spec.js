import { Dropdown } from '../dropdown';

const dropdownHTML = require('../example-index.html');
const svg = require('../../icons/svg.html');

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
    dropdownObj = new Dropdown(dropdownEl);
  });

  afterEach(() => {
    dropdownObj.destroy();
    $('.dropdown').destroy();
    dropdownEl.parentNode.removeChild(dropdownEl);
    rowEl.parentNode.removeChild(rowEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should set settings', () => {
    const settings = {
      closeOnSelect: true,
      cssClass: null,
      delay: 300,
      empty: false,
      filterMode: 'contains',
      maxWidth: null,
      moveSelected: 'none',
      multiple: false,
      noSearch: false,
      placementOpts: null,
      reloadSourceOnOpen: false,
      showEmptyGroupHeaders: false,
      showSelectAll: false,
      sourceArguments: {}
    };

    expect(dropdownObj.settings).toEqual(settings);
  });

  it('Should update set settings via data', () => {
    const settings = {
      closeOnSelect: true,
      cssClass: null,
      delay: 2000,
      empty: false,
      filterMode: 'contains',
      maxWidth: 1000,
      moveSelected: 'none',
      multiple: false,
      noSearch: false,
      placementOpts: null,
      reloadSourceOnOpen: false,
      showEmptyGroupHeaders: false,
      showSelectAll: false,
      sourceArguments: {}
    };

    dropdownObj.updated();
    dropdownObj.settings.maxWidth = 1000;
    dropdownObj.settings.delay = 2000;

    expect(dropdownObj.settings).toEqual(settings);
  });

  it('Should update set settings via parameter', () => {
    const settings = {
      closeOnSelect: true,
      cssClass: null,
      delay: 2000,
      empty: false,
      filterMode: 'contains',
      maxWidth: 1000,
      moveSelected: 'none',
      multiple: false,
      noSearch: false,
      placementOpts: null,
      reloadSourceOnOpen: false,
      showEmptyGroupHeaders: false,
      showSelectAll: false,
      sourceArguments: {}
    };
    dropdownObj.updated(settings);

    expect(dropdownObj.settings).toEqual(settings);
  });

  it('Should trigger "has-updated" event', () => {
    // TODO from Ed C: Why does this pass?  The event's name is `has-updated`, not `has-update`
    $('.dropdown').on('has-update', () => {
      expect(true).toBe(true);
    });
    dropdownObj.updated();
  });
});
