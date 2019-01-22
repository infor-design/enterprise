import { ColorPicker } from '../../../src/components/colorpicker/colorpicker';

const colorpickerHTML = require('../../../app/views/components/colorpicker/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let colorpickerEl;
let svgEl;
let colorpickerObj;

describe('ColorPicker Events', () => {
  beforeEach(() => {
    colorpickerEl = null;
    svgEl = null;
    colorpickerObj = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', colorpickerHTML);
    colorpickerEl = document.body.querySelector('.colorpicker');
    svgEl = document.body.querySelector('.svg-icons');
    colorpickerEl.classList.add('no-init');
    colorpickerObj = new ColorPicker(colorpickerEl);
  });

  afterEach(() => {
    colorpickerObj.destroy();
    colorpickerEl.parentNode.removeChild(colorpickerEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should trigger "change" event', (done) => {
    const spyEvent = spyOnEvent('#background-color', 'change');
    colorpickerObj.toggleList();

    setTimeout(() => {
      expect(colorpickerObj.isPickerOpen).toBeTruthy();
      expect(document.body.querySelector('.colorpicker.is-open')).toBeTruthy();
      const anchor = document.body.querySelector('#colorpicker-menu li a');
      anchor.click();

      expect(spyEvent).toHaveBeenTriggered();
      done();
    }, 300);
  });
});
