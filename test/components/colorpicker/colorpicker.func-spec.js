import { ColorPicker } from '../../../src/components/colorpicker/colorpicker';

const colorpickerHTML = require('../../../app/views/components/colorpicker/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let colorpickerEl;
let svgEl;
let colorpickerObj;

describe('ColorPicker Methods', () => {
  beforeEach(() => {
    colorpickerEl = null;
    svgEl = null;
    colorpickerObj = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', colorpickerHTML);
    colorpickerEl = document.getElementById('background-color');
    svgEl = document.body.querySelector('.svg-icons');
    colorpickerEl.classList.add('no-init');
    colorpickerObj = new ColorPicker(colorpickerEl);
  });

  afterEach(() => {
    colorpickerObj.destroy();
    colorpickerEl.parentNode.removeChild(colorpickerEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should get the hex value based on a label', () => {
    expect(colorpickerObj.getHexFromLabel('Turquoise10')).toEqual('#0E5B52');
  });

  it('Should get the label value based on a hex', () => {
    expect(colorpickerObj.getLabelFromHex('#0E5B52')).toEqual('Turquoise10');
  });

  it('Should set custom width', () => {
    colorpickerEl.style.width = '400px';
    colorpickerObj.setCustomWidth();

    expect(colorpickerEl.style.width).toEqual('368px');
    expect(colorpickerEl.parentNode.style.width).toEqual('400px');
  });

  it('Should get the current hex value', () => {
    colorpickerObj.setColor('#1a1a1a');

    expect(colorpickerObj.getHexValue()).toEqual('#1A1A1A');
  });

  it('Should get the current label value', () => {
    colorpickerObj.settings.showLabel = true;
    colorpickerObj.setColor('#1a1a1a');

    expect(colorpickerObj.getLabelValue()).toEqual('Slate10');
  });

  it('Should set the color/label on the field', () => {
    colorpickerObj.setColor('#0E5B52');

    expect(colorpickerEl.value).toEqual('#0E5B52');

    colorpickerObj.settings.showLabel = true;
    colorpickerObj.setColor('#0E5B52', 'Turquoise10');

    expect(colorpickerEl.value).toEqual('Turquoise10');
  });

  it('Should set the value on the field', () => {
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

  it('Should translate color label', () => {
    expect(colorpickerObj.translateColorLabel()).toEqual('');
    expect(colorpickerObj.translateColorLabel('Invalid label')).toEqual('Invalid label');
    expect(colorpickerObj.translateColorLabel('Turquoise10')).toEqual('Turquoise10');
  });

  it('Should gets the decimal as a rgb value', () => {
    expect(colorpickerObj.decimal2rgb(5397262)).toEqual('rgb(14, 91, 82)');
  });

  it('Should gets the rgb to hex value', () => {
    expect(colorpickerObj.rgb2hex('rgb(14, 91, 82)').toUpperCase()).toEqual('#0E5B52');
  });
});
