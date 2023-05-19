/**
 * @jest-environment jsdom
 */
import { Editor } from '../../../src/components/editor/editor';

import { cleanup } from '../../helpers/func-utils';

const editorHTML = `<div class="row">
  <div class="twelve columns">
    <div class="field">
      <label class="label" for="title">Title</label>
      <input type="text" id="title" value="The Page Title"/>
    </div>

    <div class="field">
      <span class="label">Comments</span>
      <div class="editor" id="editor1" role="textbox" data-init="false" aria-multiline="true" aria-label="Comments">
        <p>Embrace <a href="http://en.wikipedia.org/wiki/e-commerce" class="hyperlink">e-commerce action-items</a>, reintermediate, ecologies paradigms wireless share life-hacks create innovative harness. Evolve solutions rich-clientAPIs synergies harness relationships virtual vertical facilitate end-to-end, wireless, evolve synergistic synergies.</p>
        <p>Cross-platform, evolve, ROI scale cultivate eyeballs addelivery, e-services content cross-platform leverage extensible viral incentivize integrateAJAX-enabled sticky evolve magnetic cultivate leverage; cutting-edge. Innovate, end-to-end podcasting, whiteboard streamline e-business social; compelling, "cross-media exploit infomediaries innovative integrate integrateAJAX-enabled." Killer interactive reinvent, cultivate widgets leverage morph.</p>
      </div>
    </div>
  </div>
</div>`;

let editorElem;
let editorAPI;

require('../../../src/components/editor/editor.jquery.js');
require('../../../src/components/popupmenu/popupmenu.jquery.js');
require('../../../src/components/toolbar-flex/toolbar-flex.jquery.js');
require('../../../src/components/dropdown/dropdown.jquery.js');

describe('Editor API (using Flex Toolbar)', () => {
  beforeEach(() => {
    document.body.insertAdjacentHTML('afterbegin', editorHTML);
    editorElem = document.querySelector('.editor');

    // Remove inline script from test page
    const inlineScript = document.querySelector('#test-script');
    inlineScript.parentNode.removeChild(inlineScript);

    editorAPI = new Editor(editorElem, {
      useFlexToolbar: true
    });
  });

  afterEach(() => {
    editorAPI?.destroy();
    cleanup();
  });

  it.skip('should support using a Flex Toolbar', () => {
    const toolbarFlexAPI = editorAPI.toolbarAPI;

    expect(toolbarFlexAPI).toBeTruthy();
    expect(toolbarFlexAPI.sections.length).toEqual(2);
    expect(toolbarFlexAPI.focusedItem).toBeTruthy();
    expect(Array.isArray(toolbarFlexAPI.overflowedItems)).toBeTruthy();
  });
});
