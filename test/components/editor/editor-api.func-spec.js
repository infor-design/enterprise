import { Editor } from '../../../src/components/editor/editor';
import { cleanup } from '../../helpers/func-utils';

const editorHTML = require('../../../app/views/components/editor/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let editorEl;
let editorObj;

describe('Editor API', () => {
  beforeEach(() => {
    editorEl = null;
    editorObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', editorHTML);
    editorEl = document.body.querySelector('.editor');
  });

  afterEach(() => {
    if (editorObj) {
      editorObj.destroy();
    }

    cleanup(['.editor', '.svg-icons', '.modal', '.row']);
  });

  it('Should be defined on jQuery object', () => {
    editorObj = new Editor(editorEl);

    expect(editorObj).toEqual(jasmine.any(Object));
  });

  it('Should support pasting plain text', () => {
    editorObj = new Editor(editorEl);

    const startHtml = '<meta charset="utf-8"><span> cutting-edge</span>';
    const endHtml = '<meta charset="utf-8"><span> cutting-edge</span>';

    expect(editorObj.getCleanedHtml(startHtml)).toEqual(endHtml);
  });

  it('Should strip ng attributes on paste', () => {
    editorObj = new Editor(editorEl);

    let startHtml = '<meta charset="utf-8" ng-test><span> cutting-edge</span>';
    let endHtml = '<meta charset="utf-8"><span> cutting-edge</span>';

    expect(editorObj.getCleanedHtml(startHtml)).toEqual(endHtml);

    startHtml = '<meta charset="utf-8" ng-app><span> cutting-edge</span>';
    endHtml = '<meta charset="utf-8"><span> cutting-edge</span>';

    expect(editorObj.getCleanedHtml(startHtml)).toEqual(endHtml);
  });

  it('Should render preview mode', () => {
    editorObj = new Editor(editorEl, { preview: true });

    expect(editorEl.parentNode.classList.contains('is-preview')).toBeTruthy();
    expect(editorEl.parentNode.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.parentNode.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.classList.contains('is-preview')).toBeFalsy();
    expect(editorEl.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.getAttribute('contenteditable')).toBe('false');
    expect(editorEl.parentNode.querySelector('.editor-toolbar')).not.toBeVisible();
  });

  it('Should switch to preview mode', () => {
    editorObj = new Editor(editorEl);
    editorObj.preview();

    expect(editorEl.parentNode.classList.contains('is-preview')).toBeTruthy();
    expect(editorEl.parentNode.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.parentNode.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.classList.contains('is-preview')).toBeFalsy();
    expect(editorEl.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.getAttribute('contenteditable')).toBe('false');
    expect(editorEl.parentNode.querySelector('.editor-toolbar')).not.toBeVisible();
  });

  it('Should switch to preview and editable modes', () => {
    editorObj = new Editor(editorEl);
    editorObj.preview();

    expect(editorEl.parentNode.classList.contains('is-preview')).toBeTruthy();
    expect(editorEl.parentNode.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.parentNode.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.classList.contains('is-preview')).toBeFalsy();
    expect(editorEl.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.getAttribute('contenteditable')).toBe('false');
    expect(editorEl.parentNode.querySelector('.editor-toolbar')).not.toBeVisible();
    editorObj.enable();

    expect(editorEl.parentNode.classList.contains('is-preview')).toBeFalsy();
    expect(editorEl.getAttribute('contenteditable')).toBe('true');
    expect(editorEl.parentNode.querySelector('.editor-toolbar')).toBeVisible();
  });

  it('should convert legacy `firstHeader` and `secondHeader` settings to FontPicker style options', () => {
    editorObj = new Editor(editorEl, {
      firstHeader: 'h3',
      secondHeader: 'h4'
    });

    expect(editorObj.settings.firstHeader).not.toBeDefined();
    expect(editorObj.settings.secondHeader).not.toBeDefined();
    expect(editorObj.settings.fontpickerSettings.styles).toBeDefined();
    expect(Array.isArray(editorObj.settings.fontpickerSettings.styles)).toBeTruthy();
    expect(editorObj.settings.fontpickerSettings.styles.length).toEqual(3);
  });
});
