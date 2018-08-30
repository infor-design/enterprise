import { ColorPicker } from '../../../src/components/colorpicker/colorpicker';

const colorpickerHTML = require('../../../app/views/components/colorpicker/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let colorpickerEl;
let svgEl;
let colorpickerObj;

describe('ColorPicker ARIA', () => {
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

  it('Should set ARIA labels', () => {
    const parent = colorpickerEl.parentNode;

    expect(parent.querySelector('.colorpicker[aria-autocomplete="list"]')).toBeTruthy();
    expect(parent.querySelector('.colorpicker[role="combobox"]')).toBeTruthy();
    expect(parent.querySelector('.icon[aria-hidden="true"]')).toBeTruthy();
    expect(parent.querySelector('.icon[role="presentation"]')).toBeTruthy();
  });

  it('Should update ARIA labels with popup open', (done) => {
    colorpickerObj.toggleList();

    setTimeout(() => {
      const parent = colorpickerEl.parentNode;

      expect(parent.querySelector('.colorpicker[aria-haspopup="true"]')).toBeTruthy();
      expect(parent.querySelector('.colorpicker[aria-controls="colorpicker-menu"]')).toBeTruthy();
      done();
    }, 300);
  });
});
