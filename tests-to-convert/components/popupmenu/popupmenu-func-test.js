/**
 * @jest-environment jsdom
 */
import { PopupMenu } from '../../../src/components/popupmenu/popupmenu';
import { cleanup } from '../../helpers/func-utils';

const popupmenuHTML = `<div class="row">
  <div class="twelve columns">

    <div class="field">
      <button id="popupmenu-trigger" class="btn-menu" data-init="false">
        <span>Normal Menu</span>
        <svg role="presentation" aria-hidden="true" focusable="false" class="icon icon-dropdown">
          <use href="#icon-dropdown"></use>
        </svg>
      </button>
      <ul class="popupmenu" data-init="false">
        <li><a href="#" id="test1">Menu Option #1</a></li>
        <li><a href="#" id="test2">Menu Option #2</a></li>
        <li><a href="#" id="test3">Menu Option #3</a></li>
      </ul>
    </div>

  </div>
</div>

<script id="test-script">
  $('#popupmenu-trigger').popupmenu({
    attributes: [
      {
        name: 'id',
        value: 'popupmenu-id'
      },
      {
        name: 'data-automation-id',
        value: 'popupmenu-automation-id'
      }
    ]
  });
</script>
`;
const popupmenuSelectableHTML = `<div class="row"">
  <div class="twelve columns">
    <div class="field">
      <button id="single-select-popupmenu-trigger" class="btn-menu hide-focus">
        <span>Selectable Menu</span>
        <svg role="presentation" aria-hidden="true" focusable="false" class="icon icon-dropdown">
          <use href="#icon-dropdown"></use>
        </svg>
      </button>
      <ul class="popupmenu is-selectable">
        <li><a href="#">Menu Option #1</a></li>
        <li><a href="#">Menu Option #2</a></li>
        <li><a href="#">Menu Option #3</a></li>
        <li class="is-checked"><a href="#">Sub Option #4</a></li>
        <li><a href="#">Menu Option #5</a></li>
        <li><a href="#">Menu Option #6</a></li>
      </ul>
    </div>
  </div>
</div>`;
const popupmenuContextMenuHTML = `<div class="row">
  <div class="twelve columns">

    <div class="field">
      <label for="input-menu">Label</label>
      <input type="text" data-options="{ trigger:'rightClick', 'attributes': [ { 'name': 'data-automation-id', 'value': 'action-popupmenu' } ] }" data-popupmenu="action-popupmenu" value="Right Click Me" id="input-menu"/>
    </div>

    <div class="field">
      <label for="input-menu2">Label2</label>
      <input type="text"  data-options="{ trigger:'rightClick' }" data-popupmenu="action-popupmenu" value="Right Click Me" id="input-menu2"/>
    </div>

    <ul id="action-popupmenu" class="popupmenu">
      <li><a href="#" id="cut" data-automation-id="cut-automation-id">Cut</a></li>
      <li><a href="#" id="copy" data-automation-id="copy-automation-id">Copy</a></li>
      <li><a href="#" id="paste" data-automation-id="paste-automation-id">Paste</a></li>
      <li>
        <a id="paste-special" href="#">Paste Special</a>
        <ul class="popupmenu">
          <li><a id="sub-menu-1" data-automation-id="sub-menu-1-automation-id" href="#">Sub Menu 1</a></li>
          <li><a id="sub-menu-2" data-automation-id="sub-menu-2-automation-id" href="#">Sub Menu 2</a></li>
          <li class="separator"></li>
          <li>
            <a id="settings" data-automation-id="settings-automation-id" href="#">
              <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
                <use href="#icon-settings"></use>
              </svg>
              Settings
            </a>
          </li>
        </ul>
      </li>
      <li class="separator"></li>
      <li><a href="#" id="name-project">Name and project range</a></li>
      <li class="is-disabled"><a href="#" id="insert-comment" data-automation-id="insert-comment-automation-id" disabled="true">Insert comment</a></li>
      <li class="is-disabled"><a href="#" id="insert-note" data-automation-id="insert-note-automation-id" disabled="true">Insert note</a></li>
      <li><a href="#" id="clear-notes" data-automation-id="clear-notes-automation-id">Clear notes</a></li>

      <li class="separator single-selectable-section"></li>
      <li class="heading">Additional Options</li>
      <li class="is-selectable is-checked"><a href="#" id="conditional-format" data-automation-id="conditional-format-automation-id">Conditional formatting</a></li>
      <li class="is-selectable"><a href="#" id="data-validation" data-automation-id="data-validation-automation-id">Data validation</a></li>
      <li class="separator"></li>
      <li>
        <a href="#" id="settings" data-automation-id="settings-2-automation-id">
          <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
            <use href="#icon-settings"></use>
          </svg>
          Settings
        </a>
      </li>
    </ul>

  </div>

</div>`;

const ePage = {
  pageX: 136,
  pageY: 182
};

const eClient = {
  clientX: 222,
  clientY: 333
};

let popupmenuButtonEl;
let popupmenuObj;

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

require('../../../src/components/icons/icons.jquery');

describe('Popupmenu Menu Button API', () => {
  beforeEach(() => {
    popupmenuButtonEl = null;
    popupmenuObj = null;

    document.body.insertAdjacentHTML('afterbegin', popupmenuHTML);
    popupmenuButtonEl = document.body.querySelector('#popupmenu-trigger');
    popupmenuObj = new PopupMenu(popupmenuButtonEl);
  });

  afterEach(() => {
    if (popupmenuObj) {
      popupmenuObj?.destroy();
    }
    cleanup();
  });

  it('should be defined on jQuery object', () => {
    expect(popupmenuObj).toBeTruthy();
  });

  it('should call markupItems, and markup list items', () => {
    expect(popupmenuObj.markupItems(popupmenuButtonEl)).toBeUndefined();
    expect(document.querySelector('li')).toBeTruthy();
  });

  it('should return X, and Y from mouse event', () => {
    expect(popupmenuObj.getPositionFromEvent(ePage)).toEqual({ x: 136, y: 182 });
    expect(popupmenuObj.getPositionFromEvent(eClient)).toEqual({ x: 222, y: 333 });
  });

  it('should position correctly', () => {
    // Indirectly tests Place component
    popupmenuObj.position(ePage);

    const ulElem = popupmenuObj.menu[0];
    const parentElem = ulElem.parentNode;

    expect(parentElem.className).toContain('placeable bottom');
  });

  it('should open', () => {
    popupmenuObj.open();

    expect(popupmenuButtonEl.classList[1]).toContain('is-open');
  });

  it.skip('should close', () => {
    popupmenuObj.open();
    popupmenuObj.close();

    expect(popupmenuButtonEl.classList[1].contains('is-open')).toBeFalsy();
  });

  it('should have RTL set correctly', () => {
    expect(popupmenuObj.isRTL()).toBeFalsy();
  });

  it('should set padding correctly', () => {
    expect(document.body.querySelector('.popupmenu a').style.paddingLeft).toEqual('');
  });
});

describe('Popupmenu Single Select API', () => {
  beforeEach(() => {
    popupmenuButtonEl = null;
    popupmenuObj = null;
    document.body.insertAdjacentHTML('afterbegin', popupmenuSelectableHTML);
    popupmenuButtonEl = document.body.querySelector('#single-select-popupmenu-trigger');
    popupmenuObj = new PopupMenu(popupmenuButtonEl);
  });

  afterEach(() => {
    popupmenuObj?.destroy();
    cleanup();
  });

  it('should select', () => {
    // Expects jQuery element
    const selectItem = document.querySelector('.popupmenu li');
    const select = popupmenuObj.select($(selectItem));

    expect(select[0]).toBeTruthy();
    expect(select[1]).toEqual('selected');
  });

  it('should highlight', () => {
    // Expects jQuery anchor
    const anchorItem = document.querySelector('.popupmenu li a');
    popupmenuObj.highlight($(anchorItem));

    expect(anchorItem.parentNode.classList.toString()).toContain('is-focused');
  });

  it('should return if item is in single selectable section', () => {
    // Expects jQuery anchor
    const anchorItem = document.querySelector('.popupmenu li a');
    const isSingleSelectable = popupmenuObj.isInSingleSelectSection($(anchorItem));

    expect(isSingleSelectable).toBeFalsy();
  });

  it('should return if item is in multi selectable section', () => {
    // Expects jQuery anchor
    const anchorItem = document.querySelector('.popupmenu li a');
    const isMultiSelectable = popupmenuObj.isInMultiselectSection($(anchorItem));

    expect(isMultiSelectable).toBeFalsy();
  });

  it('should get selected', () => {
    // Expects jQuery element
    const selected = popupmenuObj.getSelected();

    expect(selected[0].textContent.trim()).toEqual('Sub Option #4');
  });

  it('should detach itself', () => {
    popupmenuObj.detach();
  });

  it('should destroy itself', () => {
    popupmenuObj.open();
    popupmenuObj?.destroy();

    expect(popupmenuButtonEl.classList[1]).not.toContain('is-focused');
  });

  it('should update settings', () => {
    const settings = { autoFocus: true };
    popupmenuObj.updated(settings);

    expect(popupmenuObj.settings.autoFocus).toBeTruthy();
  });

  it('should teardown', () => {
    const toreDownObj = popupmenuObj.teardown();

    expect(toreDownObj).toBeTruthy();
  });
});

describe('Popupmenu renderItem() API', () => {
  beforeEach(() => {
    popupmenuButtonEl = null;
    popupmenuObj = null;
    document.body.insertAdjacentHTML('afterbegin', popupmenuSelectableHTML);
    popupmenuButtonEl = document.body.querySelector('#single-select-popupmenu-trigger');
    popupmenuObj = new PopupMenu(popupmenuButtonEl);
  });

  afterEach(() => {
    popupmenuObj?.destroy();
    cleanup();
  });

  it('should build HTML for a single Popupmenu item from a settings object', () => {
    // Single Menu Option
    const data = {
      text: 'Pre-defined Menu Item #1'
    };
    const markup = popupmenuObj.renderItem(data);

    expect(markup).toBe('<li class="popupmenu-item"><a href="#"><span>Pre-defined Menu Item #1</span></a></li>');
  });

  it('should build HTML for two Popupmenu items from a settings array', () => {
    // Two menu options (should be wrapped in a `<ul class="popupmenu"></ul>`)
    const data = [{
      text: 'Pre-defined Menu Item #1',
      selectable: 'single'
    }, {
      text: 'Pre-defined Menu Item #2',
      selectable: 'single'
    }];
    const markup = popupmenuObj.renderItem(data);

    expect(markup).toBe('<ul class="popupmenu"><li class="popupmenu-item is-selectable"><a href="#"><span>Pre-defined Menu Item #1</span></a></li><li class="popupmenu-item is-selectable"><a href="#"><span>Pre-defined Menu Item #2</span></a></li></ul>');
  });

  it('should build HTML for two Popupmenu items from a settings array, without a wrapping `<ul>` tag', () => {
    // Two menu options (should NOT be wrapped in a `<ul class="popupmenu"></ul>`)
    const data = {
      noMenuWrap: true,
      menu: [{
        text: 'Pre-defined Menu Item #1',
        selectable: 'single',
      }, {
        text: 'Pre-defined Menu Item #2',
        selectable: 'single'
      }]
    };
    const markup = popupmenuObj.renderItem(data);

    expect(markup).toBe('<li class="popupmenu-item is-selectable"><a href="#"><span>Pre-defined Menu Item #1</span></a></li><li class="popupmenu-item is-selectable"><a href="#"><span>Pre-defined Menu Item #2</span></a></li>');
  });

  it('should build HTML for two Popupmenu items with a customized wrapping `<ul>` tag', () => {
    // Two menu options (should NOT be wrapped in a `<ul class="popupmenu"></ul>`)
    const data = {
      menuId: 'my-popupmenu',
      menu: [{
        text: 'Pre-defined Menu Item #1',
        selectable: 'single',
      }, {
        text: 'Pre-defined Menu Item #2',
        selectable: 'single'
      }]
    };
    const markup = popupmenuObj.renderItem(data);

    expect(markup).toBe('<ul id="my-popupmenu" class="popupmenu"><li class="popupmenu-item is-selectable"><a href="#"><span>Pre-defined Menu Item #1</span></a></li><li class="popupmenu-item is-selectable"><a href="#"><span>Pre-defined Menu Item #2</span></a></li></ul>');
  });

  it('should build HTML for a single Popupmenu Item with an icon', () => {
    const data = {
      text: 'trash',
      icon: 'delete'
    };
    const markup = popupmenuObj.renderItem(data);

    expect(markup).toBe('<li class="popupmenu-item"><a href="#"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-delete"></use></svg><span>trash</span></a></li>');
  });

  it('should build HTML for a single Popupmenu Item with an ID', () => {
    const data = {
      text: 'New Popup Item',
      id: 'my-new-popup-item'
    };
    const markup = popupmenuObj.renderItem(data);

    expect(markup).toBe('<li class="popupmenu-item"><a id="my-new-popup-item" href="#"><span>New Popup Item</span></a></li>');
  });

  it('should build HTML for a single Popupmenu Item that\'s disabled', () => {
    const data = {
      text: 'This is disabled',
      disabled: true
    };
    const markup = popupmenuObj.renderItem(data);

    expect(markup).toBe('<li class="popupmenu-item is-disabled"><a href="#"><span>This is disabled</span></a></li>');
  });

  it('should build HTML for a single Popupmenu item with a submenu from a settings object', () => {
    // Single Menu Option
    const data = {
      text: 'Parent Menu Item',
      submenu: [
        {
          text: 'Child Menu Item #1',
          selectable: 'single'
        },
        {
          text: 'Child Menu Item #2',
          selectable: 'single'
        },
        {
          text: 'Child Menu Item #3',
          selectable: 'single'
        }
      ]
    };
    const markup = popupmenuObj.renderItem(data);

    expect(markup).toBe('<li class="popupmenu-item submenu"><a href="#"><span>Parent Menu Item</span><svg class="arrow icon-dropdown icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-dropdown"></use></svg></a><ul class="popupmenu"><li class="popupmenu-item is-selectable"><a href="#"><span>Child Menu Item #1</span></a></li><li class="popupmenu-item is-selectable"><a href="#"><span>Child Menu Item #2</span></a></li><li class="popupmenu-item is-selectable"><a href="#"><span>Child Menu Item #3</span></a></li></ul></li>');
  });

  it('should build HTML for a single Popupmenu item with a multi-selectable submenu from a settings object', () => {
    // Single Menu Option
    const data = {
      text: 'Parent Menu Item',
      submenu: [
        {
          text: 'Child Menu Item #1',
          selectable: 'multiple'
        },
        {
          text: 'Child Menu Item #2',
          selectable: 'multiple'
        },
        {
          text: 'Child Menu Item #3',
          selectable: 'multiple'
        }
      ]
    };
    const markup = popupmenuObj.renderItem(data);

    expect(markup).toBe('<li class="popupmenu-item submenu"><a href="#"><span>Parent Menu Item</span><svg class="arrow icon-dropdown icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-dropdown"></use></svg></a><ul class="popupmenu"><li class="popupmenu-item is-multiselectable"><a href="#"><span>Child Menu Item #1</span></a></li><li class="popupmenu-item is-multiselectable"><a href="#"><span>Child Menu Item #2</span></a></li><li class="popupmenu-item is-multiselectable"><a href="#"><span>Child Menu Item #3</span></a></li></ul></li>');
  });

  it('should build HTML for a single Popupmenu item with a submenu that contains both selection types independently', () => {
    const data = {
      text: 'Settings',
      icon: 'settings',
      disabled: false,
      submenu: [
        {
          text: 'Submenu Item #1',
          selectable: 'multiple'
        },
        {
          text: 'Submenu Item #2',
          selectable: 'multiple'
        },
        {
          text: 'Submenu Item #3',
          selectable: 'multiple'
        },
        {
          separator: true,
          heading: 'Additional Settings',
          nextSectionSelect: 'single'
        },
        {
          text: 'Other Setting #1',
        },
        {
          text: 'Other Setting #2',
        },
        {
          text: 'Other Setting #3',
        }
      ]
    };
    const markup = popupmenuObj.renderItem(data);

    expect(markup).toBe('<li class="popupmenu-item submenu"><a href="#"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-settings"></use></svg><span>Settings</span><svg class="arrow icon-dropdown icon" focusable="false" aria-hidden="true" role="presentation"><use href="#icon-dropdown"></use></svg></a><ul class="popupmenu"><li class="popupmenu-item is-multiselectable"><a href="#"><span>Submenu Item #1</span></a></li><li class="popupmenu-item is-multiselectable"><a href="#"><span>Submenu Item #2</span></a></li><li class="popupmenu-item is-multiselectable"><a href="#"><span>Submenu Item #3</span></a></li><li class="separator single-selectable-section"></li><li class="heading">Additional Settings</li><li class="popupmenu-item"><a href="#"><span>Other Setting #1</span></a></li><li class="popupmenu-item"><a href="#"><span>Other Setting #2</span></a></li><li class="popupmenu-item"><a href="#"><span>Other Setting #3</span></a></li></ul></li>');
  });
});

describe('Popupmenu (settings)', () => {
  beforeEach(() => {
    popupmenuButtonEl = null;
    popupmenuObj = null;
    document.body.insertAdjacentHTML('afterbegin', popupmenuContextMenuHTML);
  });

  afterEach(() => {
    if (popupmenuObj) {
      popupmenuObj?.destroy();
    }
    cleanup();
  });

  it.skip('should place the menu underneath the `body` element with `attachToBody` set', () => {
    popupmenuButtonEl = document.body.querySelector('#input-menu');
    popupmenuObj = new PopupMenu(popupmenuButtonEl, {
      attachToBody: true
    });
    const popupmenuWrapperEl = document.body.querySelector('body > .popupmenu-wrapper');

    expect(popupmenuWrapperEl).toBeTruthy();

    // Menu markup should move back to immediately after the button when destroyed.
    popupmenuObj?.destroy();
    const popupmenuEl = document.body.querySelector('#input-menu + .popupmenu');

    expect(popupmenuEl).toBeTruthy();
  });

  it.skip('should remove the menu `<ul>` from the DOM when destroyed with `removeOnDestroy` set', () => {
    popupmenuButtonEl = document.body.querySelector('#input-menu');
    popupmenuObj = new PopupMenu(popupmenuButtonEl, {
      removeOnDestroy: true
    });
    let popupmenuEl = document.body.querySelector('#input-menu + .popupmenu-wrapper > .popupmenu');

    // When invoked, references should exist
    expect(popupmenuEl).toBeTruthy();
    expect(popupmenuObj.menu).toBeTruthy();

    popupmenuObj?.destroy();
    popupmenuEl = document.body.querySelector('#input-menu + .popupmenu');

    // When destroyed with the setting, references should be gone
    expect(popupmenuEl).toBe(null);
    expect(popupmenuObj.menu).not.toBeTruthy();
  });
});

describe('Popupmenu toData() API', () => {
  describe('Main Examples', () => {
    beforeEach(() => {
      popupmenuButtonEl = null;
      popupmenuObj = null;
      document.body.insertAdjacentHTML('afterbegin', popupmenuHTML);
      popupmenuButtonEl = document.body.querySelector('#popupmenu-trigger');
      popupmenuObj = new PopupMenu(popupmenuButtonEl);
    });

    afterEach(() => {
      if (popupmenuObj) {
        popupmenuObj?.destroy();
      }
      cleanup();
    });

    it('should convert the main Popupmenu example into an object representation', () => {
      const data = popupmenuObj.toData();

      expect(data).toBeTruthy();
      expect(data.menuId).toBeTruthy(); // auto-generated
      expect(data.menu).toBeTruthy();
      expect(data.menu.length).toBe(3);
      expect(data.menu[0].text).toBe('Menu Option #1');
      expect(data.menu[0].disabled).toBeFalsy();
      expect(data.menu[0].visible).toBeTruthy();
    });
  });

  describe('Empty examples', () => {
    const emptyMenuHTML = `
      <button id="popupmenu-trigger" class="btn-menu">
        <span>Normal Menu</span>
        <svg role="presentation" aria-hidden="true" focusable="false" class="icon icon-dropdown">
          <use href="#icon-dropdown"></use>
        </svg>
      </button>
      <ul class="popupmenu"></ul>`;

    beforeEach(() => {
      popupmenuButtonEl = null;
      popupmenuObj = null;
      document.body.insertAdjacentHTML('afterbegin', emptyMenuHTML);
      popupmenuButtonEl = document.body.querySelector('#popupmenu-trigger');
      popupmenuObj = new PopupMenu(popupmenuButtonEl);
    });

    afterEach(() => {
      popupmenuObj?.destroy();
      cleanup();
    });

    it('should gracefully handle empty menus', () => {
      const data = popupmenuObj.toData();

      expect(data).toBeTruthy();
      expect(data.menuId).toBeTruthy(); // auto-generated
      expect(data.menu.length).toBe(0);
    });
  });

  describe('Context Menu examples', () => {
    beforeEach(() => {
      popupmenuButtonEl = null;
      popupmenuObj = null;
      document.body.insertAdjacentHTML('afterbegin', popupmenuContextMenuHTML);
      popupmenuButtonEl = document.body.querySelector('#input-menu');
      popupmenuObj = new PopupMenu(popupmenuButtonEl);
    });

    afterEach(() => {
      popupmenuObj?.destroy();
      cleanup();
    });

    it('should convert a more complicated Popupmenu example into an object representation', () => {
      const data = popupmenuObj.toData();

      expect(data).toBeTruthy();
      expect(data.menuId).toBe('action-popupmenu');
      expect(data.menu).toBeTruthy();
      expect(data.menu.length).toBe(14);

      // Check existence of separator
      expect(data.menu[4].separator).toBeTruthy();
      expect(data.menu[4].text).toBeUndefined();

      // Check existence of separator with heading/selection area
      expect(data.menu[9].separator).toBeTruthy();
      expect(data.menu[9].heading).toBe('Additional Options');
      expect(data.menu[9].nextSectionSelect).toBe('single');

      // Check existence of submenu
      expect(data.menu[3].submenu).toBeTruthy();
      expect(data.menu[3].submenu.length).toBe(4);
      expect(data.menu[3].submenu[0].text).toBe('Sub Menu 1');
      expect(data.menu[3].submenu[0].disabled).toBeFalsy();
      expect(data.menu[3].submenu[0].visible).toBeTruthy();

      // Check existence of icon
      expect(data.menu[13]).toBeTruthy();
      expect(data.menu[13].icon).toBe('settings');
    });
  });
});
