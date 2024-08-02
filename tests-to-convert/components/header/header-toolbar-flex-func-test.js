/**
 * @jest-environment jsdom
 */
import { Header } from '../../../src/components/header/header';

import { cleanup } from '../../helpers/func-utils';

const headerHTML = `<header id="test-header" class="header is-personalizable">
  <div class="flex-toolbar">
    <div class="toolbar-section">
      {{> includes/header-appmenu-trigger}}
    </div>

    <div class="toolbar-section title">
      <h1 id="title-text-elem">
        <span class="page-title">Header Toolbar Gauntlet</span>
      </h1>
    </div>

    <div class="toolbar-section search">
      <div id="header-searchfield-wrapper" class="searchfield-wrapper">
        <label for="header-searchfield" class="audible">Search</label>
        <input id="header-searchfield" class="searchfield" name="header-searchfield" />
      </div>
    </div>

    <div class="toolbar-section buttonset">
      <button id="settings-button" class="btn">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-settings"></use>
        </svg>
        <span>Settings</span>
      </button>

      <button id="delete-button" class="btn">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-delete"></use>
        </svg>
        <span>Delete</span>
      </button>

      <button id="filter-button" class="btn">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-filter"></use>
        </svg>
        <span>Filter</span>
      </button>

      <button id="disabled-button" class="btn" disabled>
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-close"></use>
        </svg>
        <span>Disabled</span>
      </button>
    </div>

    <div id="more-button" class="toolbar-section more">
      <button class="btn-actions" type="button">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-more"></use>
        </svg>
        <span class="audible" data-translate="text">More</span>
      </button>
      <ul class="popupmenu">
        <li><a href="#">Item One</a></li>
        <li><a href="#">Item Two</a></li>
        <li class="submenu">
          <a href="#">Item Three</a>
          <ul class="popupmenu">
            <li><a href="#">Sub-Item One</a></li>
            <li><a href="#">Sub-Item Two</a></li>
          </ul>
        </li>
        <li><a href="#">Item Four</a></li>
      </ul>
    </div>
  </div>
</header>`;

let outerPageContainerElem;
let innerPageContainerElem;
let headerElem;
let headerAPI;

require('../../../src/components/toolbar/toolbar.jquery.js');
require('../../../src/components/toolbar-flex/toolbar-flex.jquery.js');

describe.skip('Header API (using Flex Toolbar)', () => {
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
    headerAPI?.destroy();
    cleanup();
  });

  it('should support using a Flex Toolbar', () => {
    const toolbarFlexAPI = headerAPI.toolbarAPI;

    expect(toolbarFlexAPI).toBeTruthy();
    expect(toolbarFlexAPI.sections.length).toEqual(5);
    expect(toolbarFlexAPI.focusedItem).toBeTruthy();
    expect(Array.isArray(toolbarFlexAPI.overflowedItems)).toBeTruthy();
  });
});
