/**
 * @jest-environment jsdom
 */
import { ColorPicker } from '../../../src/components/colorpicker/colorpicker';
import { cleanup } from '../../helpers/func-utils';

require('../../../src/components/colorpicker/colorpicker.jquery.js');
require('../../../src/components/mask/mask-input.jquery.js');
require('../../../src/components/icons/icons.jquery.js');
require('../../../src/components/popupmenu/popupmenu.jquery.js');

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

const colorpickerHTML = `<div class="row">
  <div class="twelve columns">
    <div class="field">
      <label for="background-color">Color Picker</label>
      <input class="colorpicker" id="background-color" type="text" data-init="false"/>
    </div>

    <div class="field">
      <label for="disabled-color-picker">Disabled Color Picker</label>
      <input class="colorpicker" value="#941E1E" disabled="true" id="disabled-color-picker" type="text" />
    </div>
  </div>
</div>`;

let colorpickerEl;
let colorpickerObj;

describe('ColorPicker API', () => {
  beforeEach(() => {
    colorpickerEl = null;
    colorpickerObj = null;
    document.body.insertAdjacentHTML('afterbegin', colorpickerHTML);
    colorpickerEl = document.getElementById('background-color');
    colorpickerEl.classList.add('no-init');
    colorpickerObj = new ColorPicker(colorpickerEl);
  });

  afterEach(() => {
    colorpickerObj?.destroy();
    cleanup();
  });

  it('should be defined on jQuery object', () => {
    expect(colorpickerObj).toBeTruthy();
  });

  it('should open colorpicker', (done) => {
    colorpickerObj.toggleList();

    setTimeout(() => {
      expect(colorpickerObj.isPickerOpen).toBeTruthy();
      expect(document.body.querySelector('.colorpicker.is-open')).toBeTruthy();
      done();
    }, 300);
  });

  it('should destroy colorpicker', () => {
    colorpickerObj?.destroy();

    expect(colorpickerEl.parentNode.classList.contains('colorpicker-container')).toBeFalsy();
  });

  it('should disable colorpicker', () => {
    colorpickerObj.disable();

    expect(colorpickerEl.parentNode.classList.contains('is-disabled')).toBeTruthy();
    expect(colorpickerObj.isDisabled()).toBeTruthy();
  });

  it('should enable colorpicker', () => {
    colorpickerObj.disable();

    expect(colorpickerEl.parentNode.classList.contains('is-disabled')).toBeTruthy();
    expect(colorpickerObj.isDisabled()).toBeTruthy();

    colorpickerObj.enable();

    expect(colorpickerEl.parentNode.classList.contains('is-disabled')).toBeFalsy();
    expect(colorpickerObj.isDisabled()).toBeFalsy();
  });

  it('should render colorpicker readonly', () => {
    colorpickerObj.readonly();

    expect(document.body.querySelector('.colorpicker[readonly]')).toBeTruthy();
    expect(colorpickerEl.parentNode.classList.contains('is-readonly')).toBeTruthy();
    expect(colorpickerObj.isDisabled()).toBeFalsy();
  });
});
