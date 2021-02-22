import { ColorPicker } from '../../../src/components/colorpicker/colorpicker';

const colorpickerHTML = require('../../../app/views/components/colorpicker/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let colorpickerEl;
let svgEl;
let colorpickerObj;

describe('ColorPicker API', () => {
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

    const rowEl = document.body.querySelector('.row');
    rowEl.parentNode.removeChild(rowEl);
  });

  it('Should be defined on jQuery object', () => {
    expect(colorpickerObj).toEqual(jasmine.any(Object));
  });

  it('Should open colorpicker', (done) => {
    colorpickerObj.toggleList();

    setTimeout(() => {
      expect(colorpickerObj.isPickerOpen).toBeTruthy();
      expect(document.body.querySelector('.colorpicker.is-open')).toBeTruthy();
      done();
    }, 300);
  });

  it('Should destroy colorpicker', () => {
    colorpickerObj.destroy();

    expect(colorpickerEl.parentNode.classList.contains('colorpicker-container')).toBeFalsy();
  });

  it('Should disable colorpicker', () => {
    colorpickerObj.disable();

    expect(colorpickerEl.parentNode.classList.contains('is-disabled')).toBeTruthy();
    expect(colorpickerObj.isDisabled()).toBeTruthy();
  });

  it('Should enable colorpicker', () => {
    colorpickerObj.disable();

    expect(colorpickerEl.parentNode.classList.contains('is-disabled')).toBeTruthy();
    expect(colorpickerObj.isDisabled()).toBeTruthy();

    colorpickerObj.enable();

    expect(colorpickerEl.parentNode.classList.contains('is-disabled')).toBeFalsy();
    expect(colorpickerObj.isDisabled()).toBeFalsy();
  });

  it('Should render colorpicker readonly', () => {
    colorpickerObj.readonly();

    expect(document.body.querySelector('.colorpicker[readonly]')).toBeTruthy();
    expect(colorpickerEl.parentNode.classList.contains('is-readonly')).toBeTruthy();
    expect(colorpickerObj.isDisabled()).toBeFalsy();
  });
});
