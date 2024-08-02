/**
 * @jest-environment jsdom
 */
import { FontPicker, FontPickerStyle } from '../../../src/components/fontpicker/fontpicker';
import { Locale } from '../../../src/components/locale/locale';
import { cleanup } from '../../helpers/func-utils';

Soho.Locale = Locale;

const editorHTML = `<button id="fontpicker" class="btn-tertiary fontpicker">
      <span>Fontpicker</span>
    </button>`;

let fontpickerEl;
let fontpickerAPI;

require('../../../src/components/fontpicker/fontpicker.jquery');
require('../../../src/components/locale/cultures/en-US.js');

describe('Fontpicker API', () => {
  beforeEach(() => {
    Locale.set('en-US');

    fontpickerEl = null;
    fontpickerAPI = null;
    document.body.insertAdjacentHTML('afterbegin', editorHTML);
    fontpickerEl = document.body.querySelector('.fontpicker');

    Locale.addCulture('en-US', Soho.Locale.cultures['en-US'], Soho.Locale.languages['en']); //eslint-disable-line
    Locale.set('en-US');
    $(fontpickerEl).fontpicker();
  });

  afterEach(() => {
    if (fontpickerAPI) {
      fontpickerAPI.destroy();
    }
    cleanup();
  });

  it('can be invoked', () => {
    fontpickerAPI = new FontPicker(fontpickerEl);

    expect(fontpickerAPI).toBeTruthy();
  });

  it('can be disabled and re-enabled', () => {
    fontpickerAPI = new FontPicker(fontpickerEl);
    fontpickerAPI.disabled = true;

    expect(fontpickerEl.disabled).toBeTruthy();

    fontpickerAPI.disabled = false;

    expect(fontpickerEl.disabled).toBeFalsy();
  });

  it.skip('can update its settings via `updated() method`', () => {
    fontpickerAPI = new FontPicker(fontpickerEl);
    fontpickerAPI.updated({
      styles: [
        new FontPickerStyle('quoteblock', 'Quote Block', 'blockquote')
      ]
    });
    const updatedStyles = fontpickerAPI.settings.styles;

    expect(updatedStyles).toBeTruthy();
    expect(Array.isArray(updatedStyles)).toBeTruthy();
    expect(updatedStyles.length).toEqual(1);
    expect(fontpickerEl.querySelector('span:not(.audible)').textContent.trim()).toBe('Quote Block');
  });

  it('can update its settings by triggering an `updated()` event on its base element', () => {
    fontpickerAPI = new FontPicker(fontpickerEl);
    $(fontpickerEl).trigger('updated', [{
      styles: [
        new FontPickerStyle('quoteblock', 'Quote Block', 'blockquote')
      ]
    }]);

    const updatedStyles = fontpickerAPI.settings.styles;

    expect(updatedStyles).toBeTruthy();
    expect(Array.isArray(updatedStyles)).toBeTruthy();
    expect(updatedStyles.length).toEqual(1);
    expect(fontpickerEl.querySelector('span:not(.audible)').textContent.trim()).toBe('Quote Block');
  });

  it('can select a font style programmatically with an ID', () => {
    fontpickerAPI = new FontPicker(fontpickerEl);
    const callback = jest.fn();
    $('button.fontpicker').on('font-selected', callback);
    // Select via API
    fontpickerAPI.select('header1');

    expect(callback).toHaveBeenCalled();
    expect(fontpickerAPI.selected.tagName).toEqual('h3');
  });

  it('can select a font style programmatically with a reference to a valid FontPickerStyle object', () => {
    fontpickerAPI = new FontPicker(fontpickerEl);
    const callback = jest.fn();
    $('button.fontpicker').on('font-selected', callback);

    // Get the target `header1` object
    const targetStyle = fontpickerAPI.settings.styles[1];

    // Select via API
    fontpickerAPI.select(targetStyle);

    expect(callback).toHaveBeenCalled();
    expect(fontpickerAPI.selected.tagName).toEqual('h3');
  });

  it('should trigger a "font-selected" event when a font style is picked', () => {
    fontpickerAPI = new FontPicker(fontpickerEl);
    const callback = jest.fn();
    $('button.fontpicker').on('font-selected', callback);

    // Select via menu with a couple of clicks
    fontpickerAPI.menuAPI.open();
    const firstEntry = document.body.querySelector('ul.popupmenu.fontpicker-menu li:nth-child(2) a');
    firstEntry.click();

    expect(callback).toHaveBeenCalled();
    expect(fontpickerAPI.selected.tagName).toEqual('h3');
  });

  it('should not trigger a "font-selected" event when the `select()` method is called with a `true` second argument', () => {
    fontpickerAPI = new FontPicker(fontpickerEl);
    const callback = jest.fn();
    $('button.fontpicker').on('font-selected', callback);

    // Select via API
    fontpickerAPI.select('header1', true);

    expect(callback).not.toHaveBeenCalled();
    expect(fontpickerAPI.selected.tagName).toEqual('h3');
  });

  it('has three default font block styles', () => {
    fontpickerAPI = new FontPicker(fontpickerEl);
    const styles = fontpickerAPI.settings.styles;

    expect(styles).toBeTruthy();
    expect(Array.isArray(styles)).toBeTruthy();
    expect(styles.length).toEqual(3);

    expect(styles[0] instanceof FontPickerStyle).toBeTruthy();
    expect(styles[0].displayName).toEqual('Normal text');
    expect(styles[0].tagName).toEqual('p');
  });

  it('can use a custom list of available font styles', () => {
    const settings = {
      styles: [
        new FontPickerStyle('quoteblock', 'Quote Block', 'blockquote')
      ]
    };

    fontpickerAPI = new FontPicker(fontpickerEl, settings);
    const styles = fontpickerAPI.settings.styles;

    expect(styles).toBeTruthy();
    expect(Array.isArray(styles)).toBeTruthy();
    expect(styles.length).toEqual(1);
  });

  it('should reset available font styles to the default list if an empty list is provided', () => {
    const settings = {
      styles: []
    };

    fontpickerAPI = new FontPicker(fontpickerEl, settings);
    const styles = fontpickerAPI.settings.styles;

    expect(styles).toBeTruthy();
    expect(Array.isArray(styles)).toBeTruthy();
    expect(styles.length).toEqual(3);

    expect(styles[0] instanceof FontPickerStyle).toBeTruthy();
    expect(styles[0].displayName).toEqual('Normal text');
    expect(styles[0].tagName).toEqual('p');
  });

  it('can get a list of available tagNames', () => {
    fontpickerAPI = new FontPicker(fontpickerEl);
    const tagNames = fontpickerAPI.supportedTagNames;

    expect(tagNames).toBeTruthy();
    expect(Array.isArray(tagNames)).toBeTruthy();
    expect(tagNames.length).toEqual(3);
    expect(tagNames[1]).toBe('h3');
  });

  it('should describe whether or not a font style is available by its ID', () => {
    fontpickerAPI = new FontPicker(fontpickerEl);

    // NOTE: need to wrap function that throws error in order to catch the error contents inside the test.
    function doGetStyleIncorrectly() {
      fontpickerAPI.getStyleById('notAStyle');
    }

    expect(fontpickerAPI.getStyleById('header1')).toBeTruthy();
    expect(doGetStyleIncorrectly).toThrow(new Error('No FontPickerStyle available with id "notAStyle"'));
  });

  it('should describe whether or not a font style is available by its tagName', () => {
    fontpickerAPI = new FontPicker(fontpickerEl);

    // NOTE: need to wrap function that throws error in order to catch the error contents inside the test.
    function doGetStyleIncorrectly() {
      fontpickerAPI.getStyleByTagName('span');
    }

    expect(fontpickerAPI.getStyleByTagName('h3')).toBeTruthy();
    expect(doGetStyleIncorrectly).toThrow(new Error('No FontPickerStyle available with tagName "span"'));
  });
});
