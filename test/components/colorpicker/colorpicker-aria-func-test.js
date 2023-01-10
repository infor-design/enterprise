/**
 * @jest-environment jsdom
 */
import { ColorPicker } from '../../../src/components/colorpicker/colorpicker';
import { cleanup } from '../../helpers/func-utils';

require('../../../src/components/colorpicker/colorpicker.jquery.js');
require('../../../src/components/mask/mask-input.jquery.js');
require('../../../src/components/icons/icons.jquery.js');

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

describe('ColorPicker ARIA', () => {
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

  it('should set ARIA labels', () => {
    const parent = colorpickerEl.parentNode;

    expect(parent.querySelector('.colorpicker[aria-autocomplete="list"]')).toBeTruthy();
    expect(parent.querySelector('.colorpicker[role="combobox"]')).toBeTruthy();
    expect(parent.querySelector('.icon[aria-hidden="true"]')).toBeTruthy();
    expect(parent.querySelector('.icon[role="presentation"]')).toBeTruthy();
  });
});
