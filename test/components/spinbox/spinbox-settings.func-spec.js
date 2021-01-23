import { Spinbox } from '../../../src/components/spinbox/spinbox';

const spinboxHTML = require('../../../app/views/components/spinbox/example-index.html');
const steppedIntervalSpinboxHTML = require('../../../app/views/components/spinbox/example-stepped-intervals.html');
const svg = require('../../../src/components/icons/svg.html');

let spinboxEl;
let svgEl;
let spinboxApi;
const spinboxId = '#regular-spinbox';
const steppedIntervalSpinboxId = '#stepped-spinbox';

describe('Spinbox settings', () => {
  beforeEach(() => {
    spinboxEl = null;
    svgEl = null;
    spinboxApi = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', spinboxHTML);

    spinboxEl = document.body.querySelector(spinboxId);
    svgEl = document.body.querySelector('.svg-icons');
    spinboxApi = new Spinbox(spinboxEl);
  });

  afterEach(() => {
    spinboxApi.destroy();
    spinboxEl.parentNode.removeChild(spinboxEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should set settings', () => {
    spinboxEl.removeAttribute('data-options');
    spinboxApi.destroy();
    const settings = {
      autocorrectOnBlur: true,
      min: 0,
      max: 10,
      step: null,
      maskOptions: null,
      attributes: null
    };

    settings.min = 0; // example initializes with data-options
    settings.max = 10;

    expect(spinboxApi.settings).toEqual(settings);
  });

  it('Should update set settings via data', () => {
    const settings = {
      autocorrectOnBlur: true,
      min: 10,
      max: 20,
      step: null,
      maskOptions: null,
      attributes: null
    };

    spinboxApi.updated();
    spinboxApi.settings.min = 10;
    spinboxApi.settings.max = 20;

    expect(spinboxApi.settings).toEqual(settings);
  });

  it('Should update set settings via parameter', () => {
    const settings = {
      autocorrectOnBlur: true,
      min: 10,
      max: 20,
      step: null,
      maskOptions: null,
      attributes: null
    };
    spinboxApi.updated(settings);
    spinboxApi.settings.min = 10;
    spinboxApi.settings.max = 20;

    expect(spinboxApi.settings).toEqual(settings);
  });

  it('Should update settings via data-options', () => {
    const settings = {
      autocorrectOnBlur: true,
      min: 0,
      max: 10,
      step: null,
      maskOptions: null,
      attributes: null
    };

    expect(spinboxApi.settings).toEqual(settings);
  });
});

describe('Spinbox Stepped Intervals', () => {
  beforeEach(() => {
    spinboxEl = null;
    svgEl = null;
    spinboxApi = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', steppedIntervalSpinboxHTML);

    spinboxEl = document.body.querySelector(steppedIntervalSpinboxId);
    svgEl = document.body.querySelector('.svg-icons');
    spinboxApi = new Spinbox(spinboxEl);
  });

  afterEach(() => {
    spinboxApi.destroy();
    spinboxEl.parentNode.removeChild(spinboxEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('should parse attributes and set the settings on init', () => {
    const settings = {
      autocorrectOnBlur: true,
      min: '-99',
      max: '99',
      step: '3',
      maskOptions: null,
      attributes: null
    };

    expect(spinboxApi.settings).toEqual(settings);
  });
});
