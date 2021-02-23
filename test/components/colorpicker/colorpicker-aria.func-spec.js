import { ColorPicker } from '../../../src/components/colorpicker/colorpicker';
import { cleanup } from '../../helpers/func-utils';

const colorpickerHTML = require('../../../app/views/components/colorpicker/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let colorpickerEl;
let colorpickerObj;

describe('ColorPicker ARIA', () => {
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
    cleanup([
      '.svg-icons',
      '.row',
    ]);
  });

  it('Should set ARIA labels', () => {
    const parent = colorpickerEl.parentNode;

    expect(parent.querySelector('.colorpicker[aria-autocomplete="list"]')).toBeTruthy();
    expect(parent.querySelector('.colorpicker[role="combobox"]')).toBeTruthy();
    expect(parent.querySelector('.icon[aria-hidden="true"]')).toBeTruthy();
    expect(parent.querySelector('.icon[role="presentation"]')).toBeTruthy();
  });
});
