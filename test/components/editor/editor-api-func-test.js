/**
 * @jest-environment jsdom
 */
import { Editor } from '../../../src/components/editor/editor';
import { cleanup } from '../../helpers/func-utils';

const editorHTML = `
<div class="row">
  <div class="twelve columns">
    <div class="field">
      <label class="label" for="title">Title</label>
      <input type="text" id="title" value="The Page Title"/>
    </div>

    <div class="field">
      <span id="comments-label" class="label">Comments</span>
      <div class="editor" id="editor1" aria-label="Comments" data-options="{attributes: [{name: 'id', value: 'example1'}, {name: 'data-automation-id', value: 'automation-id-example1'}]}">
        <p>Embrace <a href="http://en.wikipedia.org/wiki/e-commerce" class="hyperlink">e-commerce action-items</a>, reintermediate, ecologies paradigms wireless share life-hacks create innovative harness. Evolve solutions rich-clientAPIs synergies harness relationships virtual vertical facilitate end-to-end, wireless, evolve synergistic synergies.</p>
        <p>Cross-platform, evolve, ROI scale cultivate eyeballs addelivery, e-services content cross-platform leverage extensible viral incentivize integrateAJAX-enabled sticky evolve magnetic cultivate leverage; cutting-edge. Innovate, end-to-end podcasting, whiteboard streamline e-business social; compelling, "cross-media exploit infomediaries innovative integrate integrateAJAX-enabled." Killer interactive reinvent, cultivate widgets leverage morph.</p>
      </div>
    </div>

  </div>
</div>
`;

let editorEl;
let editorObj;

require('../../../src/components/editor/editor.jquery.js');
require('../../../src/components/popupmenu/popupmenu.jquery.js');
require('../../../src/components/toolbar-flex/toolbar-flex.jquery.js');
require('../../../src/components/dropdown/dropdown.jquery.js');

describe('Editor API', () => {
  beforeEach(() => {
    editorEl = null;
    editorObj = null;
    document.body.insertAdjacentHTML('afterbegin', editorHTML);
    editorEl = document.body.querySelector('.editor');
    $(editorEl).editor();
  });

  afterEach(() => {
    if (editorObj) {
      editorObj.destroy();
    }

    cleanup();
  });

  it.skip('should be defined on jQuery object', () => {
    editorObj = new Editor(editorEl);

    expect(editorObj).toBeTruthy();
  });

  it.skip('should support pasting plain text', () => {
    editorObj = new Editor(editorEl);

    const startHtml = '<meta charset="utf-8"><span> cutting-edge</span>';
    const endHtml = '<meta charset="utf-8"><span> cutting-edge</span>';

    expect(editorObj.getCleanedHtml(startHtml)).toEqual(endHtml);
  });

  it.skip('should strip ng attributes on paste', () => {
    editorObj = new Editor(editorEl);

    let startHtml = '<meta charset="utf-8" ng-test><span> cutting-edge</span>';
    let endHtml = '<meta charset="utf-8"><span> cutting-edge</span>';

    expect(editorObj.getCleanedHtml(startHtml)).toEqual(endHtml);

    startHtml = '<meta charset="utf-8" ng-app><span> cutting-edge</span>';
    endHtml = '<meta charset="utf-8"><span> cutting-edge</span>';

    expect(editorObj.getCleanedHtml(startHtml)).toEqual(endHtml);
  });

  it.skip('should render preview mode', () => {
    editorObj = new Editor(editorEl, { preview: true });

    expect(editorEl.parentNode.classList.contains('is-preview')).toBeTruthy();
    expect(editorEl.parentNode.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.parentNode.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.classList.contains('is-preview')).toBeFalsy();
    expect(editorEl.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.getAttribute('contenteditable')).toBe('false');
    expect(editorEl.parentNode.querySelector('.editor-toolbar')).toBeFalsy();
  });

  it.skip('should switch to preview mode', () => {
    editorObj = new Editor(editorEl);
    editorObj.preview();

    expect(editorEl.parentNode.classList.contains('is-preview')).toBeTruthy();
    expect(editorEl.parentNode.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.parentNode.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.classList.contains('is-preview')).toBeFalsy();
    expect(editorEl.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.getAttribute('contenteditable')).toBe('false');
    expect(editorEl.parentNode.querySelector('.editor-toolbar')).toBeFalsy();
  });

  it.skip('should switch to preview and editable modes', () => {
    editorObj = new Editor(editorEl);
    editorObj.preview();

    expect(editorEl.parentNode.classList.contains('is-preview')).toBeTruthy();
    expect(editorEl.parentNode.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.parentNode.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.classList.contains('is-preview')).toBeFalsy();
    expect(editorEl.classList.contains('is-disabled')).toBeFalsy();
    expect(editorEl.classList.contains('is-readonly')).toBeFalsy();
    expect(editorEl.getAttribute('contenteditable')).toBe('false');
    expect(editorEl.parentNode.querySelector('.editor-toolbar')).toBeFalsy();
    editorObj.enable();

    expect(editorEl.parentNode.classList.contains('is-preview')).toBeFalsy();
    expect(editorEl.getAttribute('contenteditable')).toBe('true');
    expect(editorEl.parentNode.querySelector('.editor-toolbar')).toBeTruthy();
  });
});
