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

fdescribe('ColorPicker Methods', () => {
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

  it('should get the hex value based on a label', () => {
    expect(colorpickerObj.getHexFromLabel('Turquoise10')).toEqual('#1F5E5E');
  });

  it('should get the label value based on a hex', () => {
    expect(colorpickerObj.getLabelFromHex('#1F5E5E')).toEqual('Turquoise10');
  });

  it('should set custom width', () => {
    colorpickerEl.style.width = '400px';
    colorpickerObj.setCustomWidth();

    expect(colorpickerEl.style.width).toEqual('396px');
    expect(colorpickerEl.parentNode.style.width).toEqual('400px');
  });

  it('should get the current hex value', () => {
    colorpickerObj.setColor('#1a1a1a');

    expect(colorpickerObj.getHexValue()).toEqual('#1A1A1A');
  });

  it('should get the current label value', () => {
    colorpickerObj.settings.showLabel = true;
    colorpickerObj.setColor('#161618');

    expect(colorpickerObj.getLabelValue()).toEqual('Slate10');
  });

  it('should set the color/label on the field', () => {
    colorpickerObj.setColor('#0E5B52');

    expect(colorpickerEl.value).toEqual('#0E5B52');

    colorpickerObj.settings.showLabel = true;
    colorpickerObj.setColor('#0E5B52', 'Turquoise10');

    expect(colorpickerEl.value).toEqual('Turquoise10');
  });

  it('should set the value on the field', () => {
    const parent = colorpickerEl.parentNode;
    colorpickerObj.setValueOnField({ isEmpty: true });

    expect(parent.querySelector('.swatch.is-empty')).toBeTruthy();

    colorpickerObj.setValueOnField({ hex: '#88550', invalid: true });

    expect(parent.querySelector('.swatch.is-invalid')).toBeTruthy();

    colorpickerObj.setValueOnField({ hex: '#0E5B52', label: 'Turquoise10' });

    expect(parent.querySelector('.swatch.is-empty')).toBeFalsy();
    expect(parent.querySelector('.swatch.is-invalid')).toBeFalsy();
    expect(colorpickerEl.value).toEqual('#0E5B52');

    colorpickerObj.settings.showLabel = true;
    colorpickerObj.setValueOnField({ hex: '#0E5B52', label: 'Turquoise10' });

    expect(parent.querySelector('.swatch.is-empty')).toBeFalsy();
    expect(parent.querySelector('.swatch.is-invalid')).toBeFalsy();
    expect(colorpickerEl.value).toEqual('Turquoise10');
  });

  it('should translate color label', () => {
    expect(colorpickerObj.translateColorLabel()).toEqual('');
    expect(colorpickerObj.translateColorLabel('Invalid label')).toEqual('Invalid label');
    expect(colorpickerObj.translateColorLabel('Turquoise10')).toEqual('Turquoise10');
  });

  it('should gets the decimal as a rgb value', () => {
    expect(colorpickerObj.decimal2rgb(5397262)).toEqual('rgb(14, 91, 82)');
  });

  it('should gets the rgb to hex value', () => {
    expect(colorpickerObj.rgb2hex('rgb(14, 91, 82)').toUpperCase()).toEqual('#0E5B52');
  });
});
