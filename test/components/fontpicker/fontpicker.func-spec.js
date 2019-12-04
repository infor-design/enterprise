import FontPickerStyle from '../../../src/components/fontpicker/fontpicker.style';
import { FontPicker } from '../../../src/components/fontpicker/fontpicker';
import { cleanup } from '../../helpers/func-utils';

const editorHTML = require('../../../app/views/components/fontpicker/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let fontpickerEl;
let fontpickerAPI;

describe('Fontpicker API', () => {
  beforeEach(() => {
    fontpickerEl = null;
    fontpickerAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', editorHTML);
    fontpickerEl = document.body.querySelector('.fontpicker');
  });

  afterEach(() => {
    cleanup(['.editor', '.svg-icons', '.modal', '.row', '.modal-page-container']);
  });

  it('can be invoked', () => {
    fontpickerAPI = new FontPicker(fontpickerEl);

    expect(fontpickerAPI).toEqual(jasmine.any(Object));
  });

  it('can be disabled and re-enabled', () => {
    fontpickerAPI = new FontPicker(fontpickerEl);
    fontpickerAPI.disabled = true;

    expect(fontpickerEl.disabled).toBeTruthy();

    fontpickerAPI.disabled = false;

    expect(fontpickerEl.disabled).toBeFalsy();
  });

  it('should be completely rendered after the page is loaded', () => {
    fontpickerAPI = new FontPicker(fontpickerEl);

    expect(fontpickerEl.querySelector('span').innerText).toBe('Default');
  });

  it('should trigger a "font-selected" event when a font style is picked', () => {
    fontpickerAPI = new FontPicker(fontpickerEl);
    const fontpickerSpyEvent = spyOnEvent('button.fontpicker', 'font-selected');
    fontpickerAPI.menuAPI.open();

    const firstEntry = document.body.querySelector('button.fontpicker + div ul li:nth-child(1) a');
    firstEntry.click();

    expect(fontpickerSpyEvent).toHaveBeenTriggered();
  });

  xit('should not trigger a "font-selected" event when the `select()` method is called with a `true` second argument', () => {

  });

  it('has three default font block styles', () => {
    fontpickerAPI = new FontPicker(fontpickerEl);
    const styles = fontpickerAPI.settings.styles;

    expect(styles).toBeDefined();
    expect(Array.isArray(styles)).toBeTruthy();
    expect(styles.length).toEqual(3);

    expect(styles[0] instanceof FontPickerStyle).toBeTruthy();
    expect(styles[0].displayName).toEqual('Default');
    expect(styles[0].tagName).toEqual('p');
  });

  it('can use a custom list of available font styles', () => {
    const settings = {
      styles: [
        new FontPickerStyle('codeblock', 'Code Block', 'code'),
        new FontPickerStyle('quoteblock', 'Quote Block', 'blockquote')
      ]
    };

    fontpickerAPI = new FontPicker(fontpickerEl, settings);
    const styles = fontpickerAPI.settings.styles;

    expect(styles).toBeDefined();
    expect(Array.isArray(styles)).toBeTruthy();
    expect(styles.length).toEqual(2);
  });

  xit('should reset available font styles to the default list if an empty list is provided', () => {

  });

  xit('should describe whether or not a font style is available by its ID', () => {

  });

  xit('should describe whether or not a font style is available by its tagName', () => {

  });
});
