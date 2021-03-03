import { Header } from '../../../src/components/header/header';

import { cleanup } from '../../helpers/func-utils';

const headerHTML = require('../../../app/views/components/header/example-flex-toolbar.html');

let outerPageContainerElem;
let innerPageContainerElem;
let headerElem;
let headerAPI;

describe('Header API (using Flex Toolbar)', () => {
  beforeEach(() => {
    outerPageContainerElem = document.createElement('div');
    outerPageContainerElem.classList.add('page-container', 'no-scroll');
    document.body.appendChild(outerPageContainerElem);

    outerPageContainerElem.insertAdjacentHTML('afterbegin', headerHTML);
    headerElem = outerPageContainerElem.querySelector('header');

    innerPageContainerElem = document.createElement('div');
    innerPageContainerElem.classList.add('page-container', 'scrollable');
    outerPageContainerElem.appendChild(innerPageContainerElem);

    headerAPI = new Header(headerElem, {
      useFlexToolbar: true
    });
  });

  afterEach(() => {
    headerAPI.destroy();
    cleanup();
  });

  it('Should support using a Flex Toolbar', () => {
    const toolbarFlexAPI = headerAPI.toolbarAPI;

    expect(toolbarFlexAPI).toBeDefined();
    expect(toolbarFlexAPI.sections.length).toEqual(5);
    expect(toolbarFlexAPI.focusedItem).toBeDefined();
    expect(Array.isArray(toolbarFlexAPI.overflowedItems)).toBeTruthy();
  });
});
