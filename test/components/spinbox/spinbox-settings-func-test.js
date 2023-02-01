/**
 * @jest-environment jsdom
 */
import { Spinbox } from '../../../src/components/spinbox/spinbox';
import { cleanup } from '../../helpers/func-utils';

const spinboxHTML = `<div class="row">
  <div class="one-half column">
    <div class="field">
      <label for="regular-spinbox">Select a number from 1 to 10</label>
      <input id="regular-spinbox" name="regular-spinbox" type="text" class="spinbox" data-options="{min: 0, max: 10}"/>
    </div>
  </div>
</div>`;
const steppedIntervalSpinboxHTML = `    <div class="field">
      <label for="stepped-spinbox">Spinbox (init 0, min -99, max 99, step 3)</label>
      <input id="stepped-spinbox" name="stepped-spinbox" type="text" class="spinbox" min="-99" max="99" value="0" step="3"/>
    </div>`;

let spinboxEl;
let spinboxApi;
const spinboxId = '#regular-spinbox';
const steppedIntervalSpinboxId = '#stepped-spinbox';

describe('Spinbox settings', () => {
  beforeEach(() => {
    spinboxEl = null;
    spinboxApi = null;

    document.body.insertAdjacentHTML('afterbegin', spinboxHTML);

    spinboxEl = document.body.querySelector(spinboxId);
    spinboxApi = new Spinbox(spinboxEl);
  });

  afterEach(() => {
    spinboxApi.destroy();
    cleanup();
  });

  it('should set settings', () => {
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

  it('should update set settings via data', () => {
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

  it('should update set settings via parameter', () => {
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

  it('should update settings via data-options', () => {
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
    spinboxApi = null;

    document.body.insertAdjacentHTML('afterbegin', steppedIntervalSpinboxHTML);

    spinboxEl = document.body.querySelector(steppedIntervalSpinboxId);
    spinboxApi = new Spinbox(spinboxEl);
  });

  afterEach(() => {
    spinboxApi.destroy();
    cleanup();
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
