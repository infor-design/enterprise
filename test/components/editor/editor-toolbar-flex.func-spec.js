import { Editor } from '../../../src/components/editor/editor';

import { cleanup } from '../../helpers/func-utils';

const editorHTML = require('../../../app/views/components/editor/example-flex-toolbar.html');
const svg = require('../../../src/components/icons/svg.html');

let editorElem;
let editorAPI;

describe('Editor API (using Flex Toolbar)', () => {
  beforeEach(() => {
    document.body.insertAdjacentHTML('afterbegin', svg);
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
    editorAPI.destroy();
    cleanup(['.editor', '.svg-icons', '.modal', '.row']);
  });

  it('Should support using a Flex Toolbar', () => {
    const toolbarFlexAPI = editorAPI.toolbarAPI;

    expect(toolbarFlexAPI).toBeDefined();
    expect(toolbarFlexAPI.sections.length).toEqual(2);
    expect(toolbarFlexAPI.focusedItem).toBeDefined();
    expect(Array.isArray(toolbarFlexAPI.overflowedItems)).toBeTruthy();
  });
});
