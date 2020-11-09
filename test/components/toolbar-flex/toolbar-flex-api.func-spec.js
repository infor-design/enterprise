import { ToolbarFlex } from '../../../src/components/toolbar-flex/toolbar-flex';
import { cleanup } from '../../helpers/func-utils';

const toolbarFavorButtonsetHTML = require('../../../app/views/components/toolbar-flex/example-favor-buttonset.html');
const svg = require('../../../src/components/icons/svg.html');

let toolbarEl;
let toolbarAPI;
let rowEl;

describe('Flex Toolbar', () => { //eslint-disable-line
  beforeEach(() => {
    toolbarEl = null;
    toolbarAPI = null;
    rowEl = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', toolbarFavorButtonsetHTML);

    rowEl = document.body.querySelector('.row');
    toolbarEl = document.body.querySelector('.flex-toolbar');
    toolbarAPI = new ToolbarFlex(toolbarEl);
  });

  afterEach(() => {
    toolbarAPI.destroy();
    cleanup([
      '.svg-icons',
      '.row',
      '.popupmenu-wrapper'
    ]);
  });

  it('Should be invoked', () => {
    expect(toolbarAPI).toEqual(jasmine.any(ToolbarFlex));
  });

  it('Can be disabled and re-enabled', () => {
    toolbarAPI.disabled = true;

    expect(toolbarEl.className.indexOf('is-disabled')).toBeGreaterThan(-1);

    toolbarAPI.disabled = false;

    expect(toolbarEl.className.indexOf('is-disabled')).toEqual(-1);
  });

  it('Should have 6 items', () => {
    expect(toolbarAPI.items).toBeDefined();
    expect(toolbarAPI.items.length).toBe(6);
  });

  it('Should have 4 sections', () => {
    expect(toolbarAPI.sections).toBeDefined();
    expect(toolbarAPI.sections.length).toBe(4);
  });

  it('Should be completely rendered after the page is loaded', () => {
    expect(toolbarEl.getAttribute('role')).toBe('toolbar');
  });

  it('Should automatically set its focused item to the first toolbar item', () => {
    const focused = toolbarAPI.focusedItem;
    const items = toolbarAPI.items;

    expect(items.indexOf(focused)).toBe(0);
  });

  it('Can detect all items present inside that should be invoked as Toolbar Flex Items', () => {
    const els = toolbarAPI.getElements();

    expect(els).toBeDefined();
    expect(els.length).toBe(6);
  });

  it('Can get a `ToolbarFlexItem` instance from one of its internal elements', () => {
    const els = toolbarAPI.getElements();
    const item = toolbarAPI.getItemFromElement(els[0]);

    expect(item).toBeDefined();
    expect(item.type).toEqual('button');
    expect(item.disabled).toBeFalsy();
  });

  it('Can check for which of its items belongs in an overflow menu', (done) => {
    // Test doesn't pass unless we have an actual width on the toolbar
    rowEl.style.width = '20000px';
    let overflow = toolbarAPI.overflowedItems;

    // Normal overflow situation should be that nothing is overflowed.
    expect(overflow).toBeDefined();
    expect(overflow.length).toBe(0);

    // Change width of the container to change the overflow scenario.
    rowEl.style.width = '690px';
    overflow = toolbarAPI.overflowedItems;
    setTimeout(() => {
      expect(overflow.length).toBe(3);
      expect(overflow[0].overflowed).toBeTruthy();
      done();
    }, 500);
  });

  it('Can programmatically navigate toolbar items', () => {
    // Test doesn't pass unless we have an actual width on the toolbar
    rowEl.style.width = '20000px';

    const items = toolbarAPI.items;
    let focusedItem = toolbarAPI.focusedItem;

    expect(focusedItem).toEqual(items[0]);

    // Navigate to the right
    toolbarAPI.navigate(2);
    focusedItem = toolbarAPI.focusedItem;

    // Item isn't "2" here because the item at index 2 is disabled, so it skips to "3"
    expect(focusedItem).toEqual(items[3]);

    // Navigate to the left
    toolbarAPI.navigate(-2);
    focusedItem = toolbarAPI.focusedItem;

    expect(focusedItem).toEqual(items[1]);

    // Run with no directional change (should give the same result)
    toolbarAPI.navigate(0);
    focusedItem = toolbarAPI.focusedItem;

    expect(focusedItem).toEqual(items[1]);
  });

  it('Selects a toolbar item by element reference', () => {
    const items = toolbarAPI.items;

    toolbarAPI.select(items[3].element);

    expect(items[0].selected).toBeFalsy();
    expect(items[3].selected).toBeTruthy();
    expect(items[3].element.className.indexOf('is-selected')).toBeGreaterThan(-1);
  });

  it('Selects a toolbar item by using its ToolbarFlexItem instance', () => {
    const items = toolbarAPI.items;

    toolbarAPI.select(items[3]);

    expect(items[0].selected).toBeFalsy();
    expect(items[3].selected).toBeTruthy();
    expect(items[3].element.className.indexOf('is-selected')).toBeGreaterThan(-1);
  });

  it('Can build an object representation of the current set of toolbar elements', () => {
    const data = toolbarAPI.toData();

    // Basic checks
    expect(data).toBeDefined();
    expect(data.items).toBeDefined();
    expect(data.items.length).toBe(6);

    // Item placement checks
    expect(data.items[0].type).toEqual('button');
    expect(data.items[0].text).toEqual('Text Button');
    expect(data.items[0].visible).toBeTruthy();
    expect(data.items[0].focused).toBeTruthy();
    expect(data.items[0].disabled).toBeFalsy();

    expect(data.items[4].type).toEqual('searchfield');
    expect(data.items[4].focused).toBeFalsy();
    expect(data.items[4].disabled).toBeFalsy();
    expect(data.items[4].readOnly).toBeDefined();
    expect(data.items[4].readOnly).toBeFalsy();
    expect(data.items[4].componentAPI).toEqual(jasmine.any(Object)); // Soho Searchfield component

    expect(data.items[1].type).toEqual('menubutton');
    expect(data.items[1].submenu).toBeDefined();
    expect(data.items[1].submenu.length).toBe(3);
    expect(data.items[1].submenu[0].text).toEqual('Item One');
  });

  it('Can build an object representation of the current set of toolbar elements, that can be consumed by a popupmenu', () => {
    const data = toolbarAPI.toPopupmenuData();

    // Basic checks
    expect(data).toBeDefined();
    expect(data.menu).toBeDefined();
    expect(data.menu.length).toBe(4);

    // Item placement checks
    expect(data.menu[2].text).toEqual('Settings');
    expect(data.menu[2].icon).toEqual('settings');

    expect(data.menu[1].submenu).toBeDefined();
    expect(data.menu[1].submenu.length).toBe(3);
  });

  describe('Item', () => {
    it('Can be invoked by its parent Toolbar', () => {
      const item = toolbarAPI.items[0];
      const elementAPI = $(item.element).data('toolbarflexitem');

      expect(elementAPI).toBeDefined();
      expect(item.section).toBeDefined();
      expect(item.toolbar).toEqual(toolbarEl);
    });

    it('Can be individually disabled and re-enabled', () => {
      const item = toolbarAPI.items[2];

      expect(item.element.disabled).toBeTruthy();
      expect(item.element.getAttribute('aria-disabled')).toBeTruthy();

      item.disabled = false;

      expect(item.element.disabled).toBeFalsy();
      expect(item.element.getAttribute('aria-disabled')).toBeFalsy();
    });

    it('Can individually become hidden and re-displayed', () => {
      const item = toolbarAPI.items[3];

      expect(item.visible).toBeTruthy();

      item.hide();

      expect(item.visible).toBeFalsy();

      item.show();

      expect(item.visible).toBeTruthy();
    });

    it('Can announce whether or not it can become the focused item', () => {
      // Test doesn't pass unless we have an actual width on the toolbar
      rowEl.style.width = '20000px';
      const menuButton = toolbarAPI.items[1];

      expect(menuButton.focusable).toBeTruthy();

      // The icon button is disabled by default
      const iconButton = toolbarAPI.items[2];

      expect(iconButton.focusable).toBeFalsy();

      const secondIconButton = toolbarAPI.items[3];
      secondIconButton.hide();

      expect(secondIconButton.focusable).toBeFalsy();
    });

    it('Can individually be set as the focused toolbar item', () => {
      const item = toolbarAPI.items[1];
      item.focused = true;

      expect(item.element.tabIndex).toEqual(0);
      expect(item.focused).toBeTruthy();
    });

    it('Can be set to readonly, if allowed by the field type', () => {
      const searchfieldItem = toolbarAPI.items[4];
      searchfieldItem.readOnly = true;

      expect(searchfieldItem.readOnly).toBeTruthy();
      expect(searchfieldItem.element.readOnly).toBeTruthy();
    });

    it('Can not be readonly and disabled at the same time, if allowed by the field type', () => {
      const searchfieldItem = toolbarAPI.items[4];
      searchfieldItem.readOnly = true;
      searchfieldItem.disabled = true;

      expect(searchfieldItem.readOnly).toBeFalsy();
      expect(searchfieldItem.element.readOnly).toBeFalsy();
      expect(searchfieldItem.disabled).toBeTruthy();
      expect(searchfieldItem.element.disabled).toBeTruthy();

      searchfieldItem.readOnly = true;

      expect(searchfieldItem.readOnly).toBeTruthy();
      expect(searchfieldItem.element.readOnly).toBeTruthy();
      expect(searchfieldItem.disabled).toBeFalsy();
      expect(searchfieldItem.element.disabled).toBeFalsy();
    });

    it('Can individually be selected', () => {
      const item = toolbarAPI.items[1];
      item.selected = true;

      expect(item.selected).toBe(true);
      expect(item.element.className.indexOf('is-selected')).toBeGreaterThan(-1);
    });

    it('Can individually determine that it should be placed into overflow', (done) => {
      rowEl.style.width = '690px';
      setTimeout(() => {
        const textButton = toolbarAPI.items[0];

        expect(textButton.overflowed).toBeFalsy();
      }, 500);

      setTimeout(() => {
        const secondIconButton = toolbarAPI.items[2];

        expect(secondIconButton.overflowed).toBeTruthy();
        done();
      }, 500);
    });
  });

  describe('Item selected events', () => {
    it('Should trigger "selected" event for a normal button', (done) => {
      const button = toolbarAPI.items[0].element;
      const buttonSpyEvent = spyOnEvent('div.buttonset button:first-child', 'selected');

      button.click();
      setTimeout(() => {
        expect(buttonSpyEvent).toHaveBeenTriggered();
        done();
      }, 400);
    });

    it('Should trigger "selected" event for a menu button', (done) => {
      const menuButton = toolbarAPI.items[1];
      const menuButtonSpyEvent = spyOnEvent('button#menu-button', 'selected');

      menuButton.componentAPI.open();
      setTimeout(() => {
        document.body.querySelector('ul#popupmenu-1 li a').click();

        setTimeout(() => {
          expect(menuButtonSpyEvent).toHaveBeenTriggered();
          done();
        }, 400);
      }, 400);
    });
  });
});

describe('Flex Toolbar (with extra attributes)', () => {
  beforeEach(() => {
    toolbarEl = null;
    toolbarAPI = null;
    rowEl = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', toolbarFavorButtonsetHTML);

    rowEl = document.body.querySelector('.row');
    toolbarEl = document.body.querySelector('.flex-toolbar');
    toolbarAPI = new ToolbarFlex(toolbarEl, {
      attributes: [
        {
          name: 'data-automation-id',
          value: 'my-toolbar'
        }
      ]
    });
  });

  afterEach(() => {
    toolbarAPI.destroy();
    cleanup([
      '.svg-icons',
      '.row',
      '.popupmenu-wrapper'
    ]);
  });

  it('can have automation ids', () => {
    const firstItem = toolbarAPI.items[0];

    // Toolbar elements get the attribute
    expect(toolbarEl.getAttribute('data-automation-id')).toEqual('my-toolbar');
    expect(firstItem.element.getAttribute('data-automation-id')).toEqual('my-toolbar-button-0');

    // MenuButton and its controlled elements get the attribute
    const menuButtonItem = toolbarAPI.items[1];
    const menuEl = menuButtonItem.componentAPI.menu[0];
    const menuFirstItemEl = menuEl.querySelector('li:first-child a');

    expect(menuButtonItem.element.getAttribute('data-automation-id')).toEqual('my-toolbar-menubutton-1-trigger');
    expect(menuEl.getAttribute('data-automation-id')).toEqual('my-toolbar-menubutton-1-menu');
    expect(menuFirstItemEl.getAttribute('data-automation-id')).toEqual('my-toolbar-menubutton-1-option-0');

    // "More Actions" button should render with a copy of the MenuButton's items,
    // but they will have unique `data-automation-id` attributes specific for the overflowed MenuButton items
    const actionButtonItem = toolbarAPI.items[5];
    const actionMenuEl = actionButtonItem.componentAPI.menu[0];
    const actionMenuFirstItemEl = actionMenuEl.querySelector('li:first-child a');
    const actionMenuButtonFirstItemEl = actionMenuEl.querySelector('li.submenu li:first-child a');

    expect(actionButtonItem.element.getAttribute('data-automation-id')).toEqual('my-toolbar-actionbutton-5-trigger');
    expect(actionMenuEl.getAttribute('data-automation-id')).toEqual('my-toolbar-actionbutton-5-menu');
    expect(actionMenuFirstItemEl.getAttribute('data-automation-id')).toEqual('my-toolbar-actionbutton-5-option-0');
    expect(actionMenuButtonFirstItemEl.getAttribute('data-automation-id')).toEqual('my-toolbar-actionbutton-5-option-1-0');
  });
});
