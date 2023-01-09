import { ColorPicker } from '../../../src/components/colorpicker/colorpicker';
import { cleanup } from '../../helpers/func-utils';

const colorpickerHTML = require('../../../app/views/components/colorpicker/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let colorpickerEl;
let colorpickerObj;

describe('ColorPicker API', () => {
  beforeEach(() => {
    colorpickerEl = null;
    colorpickerObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', colorpickerHTML);
    colorpickerEl = document.getElementById('background-color');
    colorpickerEl.classList.add('no-init');
    colorpickerObj = new ColorPicker(colorpickerEl);
  });

  afterEach(() => {
    colorpickerObj.destroy();
    cleanup();
  });

  it('Should be defined on jQuery object', () => {
    expect(colorpickerObj).toBeTruthy();
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
