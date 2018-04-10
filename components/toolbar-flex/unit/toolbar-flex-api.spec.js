import { ToolbarFlex } from '../toolbar-flex';
import { ToolbarFlexItem } from '../toolbar-flex.item';

const toolbarFavorButtonsetHTML = require('../example-favor-buttonset.html');
const svg = require('../../icons/svg.html');

let toolbarEl;
let toolbarAPI;
let rowEl;
let svgEl;

describe('Flex Toolbar API', () => {
  beforeEach(() => {
    toolbarEl = null;
    toolbarAPI = null;
    svgEl = null;
    rowEl = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', toolbarFavorButtonsetHTML);

    rowEl = document.body.querySelector('.row');
    svgEl = document.body.querySelector('.svg-icons');
    toolbarEl = document.body.querySelector('.flex-toolbar');
    toolbarAPI = new ToolbarFlex(toolbarEl);
  });

  afterEach(() => {
    toolbarAPI.destroy();
    rowEl.parentNode.removeChild(rowEl);
    svgEl.parentNode.removeChild(svgEl);
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

    expect(focused).toEqual(jasmine.any(ToolbarFlexItem));

    const items = toolbarAPI.items;

    expect(items.indexOf(focused)).toBe(0);
  });

  it('Can detect all items present inside that should be invoked as Toolbar Flex Items', () => {
    const els = toolbarAPI.getElements();

    expect(els).toBeDefined();
    expect(els.length).toBe(6);
    expect(els[0]).toEqual(jasmine.any(HTMLElement));
  });

  it('Can get a `ToolbarFlexItem` instance from one of its internal elements', () => {
    const els = toolbarAPI.getElements();
    const item = toolbarAPI.getItemFromElement(els[0]);

    expect(item).toBeDefined();
    expect(item).toEqual(jasmine.any(ToolbarFlexItem));
    expect(item.type).toEqual('button');
    expect(item.disabled).toBeFalsy();
  });

  it('Can check for which of its items belongs in an overflow menu', () => {
    let overflow = toolbarAPI.overflowedItems;

    // Normal overflow situation should be that nothing is overflowed.
    expect(overflow).toBeDefined();
    expect(overflow.length).toBe(0);

    // Change width of the container to change the overflow scenario.
    rowEl.style.width = '700px';
    overflow = toolbarAPI.overflowedItems;

    expect(overflow.length).toBe(3);
    expect(overflow[0]).toEqual(jasmine.any(ToolbarFlexItem));
    expect(overflow[0].overflowed).toBeTruthy();
  });

  it('Can programmatically navigate toolbar items', () => {
    const items = toolbarAPI.items;
    let focusedItem = toolbarAPI.focusedItem;

    expect(focusedItem).toEqual(items[0]);

    // Navigate to the right
    toolbarAPI.navigate(2);
    focusedItem = toolbarAPI.focusedItem;

    expect(focusedItem).toEqual(items[2]);

    // Navigate to the left
    toolbarAPI.navigate(-2);
    focusedItem = toolbarAPI.focusedItem;

    expect(focusedItem).toEqual(items[0]);

    // Run with no directional change (should give the same result)
    toolbarAPI.navigate(0);
    focusedItem = toolbarAPI.focusedItem;

    expect(focusedItem).toEqual(items[0]);
  });

  /*
   * NOTE: Not sure if this ought to be a functional test... ideally the API should be
   * tested, but the menu isn't rendered until the Popupmenu opens for the first time.
   */
  xit('Links action button list items to toolbar items', (done) => {
    // Change width of the container to change the overflow scenario.
    rowEl.style.width = '500px';
    const items = toolbarAPI.items;

    // Can't check these conditions until after the popupmenu's been opened
    // and completely rendered.
    $(items[5].element).on('open.test', () => {
      // Check `items[1]` which is the menu button
      expect(items[1].overflowed).toBeTruthy();
      expect(items[1].actionButtonLink).toBeDefined();
      expect(items[1].actionButtonLink).toEqual(jasmine.any(HTMLElement));

      const menuItem = items[1].actionButtonLink;
      const originalButton = $(menuItem).data('original-button');

      expect(originalButton).toEqual(items[1].element);
      done();
    });

    // Open the action button popupmenu first
    items[5].componentAPI.open();
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
});
