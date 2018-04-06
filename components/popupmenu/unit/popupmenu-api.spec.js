import { PopupMenu } from '../popupmenu';

const popupmenuHTML = require('../example-index.html');
const popupmenuSelectableHTML = require('../example-selectable.html');
const popupmenuContextMenuHTML = require('../../contextmenu/example-index.html');
const svg = require('../../icons/svg.html');

let popupmenuButtonEl;
let svgEl;
let rowEl;
let popupmenuObj;

const ePage = {
  pageX: 136,
  pageY: 182
};

const eClient = {
  clientX: 222,
  clientY: 333
};

describe('Popupmenu Menu Button API', () => {
  beforeEach(() => {
    popupmenuButtonEl = null;
    svgEl = null;
    rowEl = null;
    popupmenuObj = null;
    document.body.insertAdjacentHTML('afterbegin', popupmenuHTML);
    document.body.insertAdjacentHTML('afterbegin', svg);
    popupmenuButtonEl = document.body.querySelector('#popupmenu-trigger');
    rowEl = document.body.querySelector('.row');
    svgEl = document.body.querySelector('.svg-icons');
    popupmenuObj = new PopupMenu(popupmenuButtonEl);
  });

  afterEach(() => {
    popupmenuObj.destroy();
    popupmenuButtonEl.parentNode.removeChild(popupmenuButtonEl);
    rowEl.parentNode.removeChild(rowEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should be defined on jQuery object', () => {
    expect(popupmenuObj).toEqual(jasmine.any(Object));
  });

  it('Should call markupItems, and markup list items', () => {
    expect(popupmenuObj.markupItems(popupmenuButtonEl)).toBeUndefined();
    expect(document.querySelector('li[role="presentation"]')).toBeTruthy();
  });

  it('Should return X, and Y from mouse event', () => {
    expect(popupmenuObj.getPositionFromEvent(ePage)).toEqual({ x: 136, y: 182 });
    expect(popupmenuObj.getPositionFromEvent(eClient)).toEqual({ x: 222, y: 333 });
  });

  it('Should open', () => {
    popupmenuObj.open();

    expect(popupmenuButtonEl.classList[1]).toContain('is-open');
  });

  it('Should close', () => {
    popupmenuObj.open();
    popupmenuObj.close();

    expect(popupmenuButtonEl.classList[1]).not.toContain('is-open');
  });

  it('Should have RTL set correctly', () => {
    expect(popupmenuObj.isRTL()).toBe(false);
  });
});

describe('Popupmenu Single Select API', () => {
  beforeEach(() => {
    popupmenuButtonEl = null;
    svgEl = null;
    rowEl = null;
    popupmenuObj = null;
    document.body.insertAdjacentHTML('afterbegin', popupmenuSelectableHTML);
    document.body.insertAdjacentHTML('afterbegin', svg);
    popupmenuButtonEl = document.body.querySelector('#single-select-popupmenu-trigger');
    rowEl = document.body.querySelector('.row');
    svgEl = document.body.querySelector('.svg-icons');
    popupmenuObj = new PopupMenu(popupmenuButtonEl);
  });

  afterEach(() => {
    popupmenuObj.destroy();
    popupmenuButtonEl.parentNode.removeChild(popupmenuButtonEl);
    rowEl.parentNode.removeChild(rowEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should select', () => {
    // Expects jQuery element
    const select = popupmenuObj.select($('.popupmenu li').first());

    expect(select[0]).toEqual(jasmine.any(Object));
    expect(select[1]).toEqual('selected');
  });

  it('Should get selected', () => {
    // Expects jQuery element
    const selected = popupmenuObj.getSelected();

    expect(selected[0].innerText).toEqual('Sub Option #4');
  });

  it('Should destroy itself', () => {
    popupmenuObj.open();
    popupmenuObj.destroy();

    expect(popupmenuButtonEl.classList[1]).not.toContain('is-open');
  });

  it('Should update settings', () => {
    const settings = { autoFocus: true };
    popupmenuObj.updated(settings);

    expect(popupmenuObj.settings.autoFocus).toBeTruthy();
  });

  it('Should teardown', () => {
    const toreDownObj = popupmenuObj.teardown();

    expect(toreDownObj).toEqual(jasmine.any(Object));
  });
});

describe('Popupmenu renderItem() API', () => {
  beforeEach(() => {
    popupmenuButtonEl = null;
    svgEl = null;
    rowEl = null;
    popupmenuObj = null;
    document.body.insertAdjacentHTML('afterbegin', popupmenuSelectableHTML);
    document.body.insertAdjacentHTML('afterbegin', svg);
    popupmenuButtonEl = document.body.querySelector('#single-select-popupmenu-trigger');
    rowEl = document.body.querySelector('.row');
    svgEl = document.body.querySelector('.svg-icons');
    popupmenuObj = new PopupMenu(popupmenuButtonEl);
  });

  afterEach(() => {
    popupmenuObj.destroy();
    popupmenuButtonEl.parentNode.removeChild(popupmenuButtonEl);
    rowEl.parentNode.removeChild(rowEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should build HTML for a single Popupmenu item from a settings object', () => {
    // Single Menu Option
    const data = {
      text: 'Pre-defined Menu Item #1'
    };
    const markup = popupmenuObj.renderItem(data);

    expect(markup).toBe('<li class="popupmenu-item"><a href="#"><span>Pre-defined Menu Item #1</span></a></li>');
  });

  it('Should build HTML for two Popupmenu items from a settings array', () => {
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

  it('Should build HTML for two Popupmenu items from a settings array, without a wrapping `<ul>` tag', () => {
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

  it('Should build HTML for two Popupmenu items with a customized wrapping `<ul>` tag', () => {
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

  it('Should build HTML for a single Popupmenu Item with an icon', () => {
    const data = {
      text: 'trash',
      icon: 'delete'
    };
    const markup = popupmenuObj.renderItem(data);

    expect(markup).toBe('<li class="popupmenu-item"><a href="#"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-delete"></use></svg><span>trash</span></a></li>');
  });

  it('Should build HTML for a single Popupmenu Item with an ID', () => {
    const data = {
      text: 'New Popup Item',
      id: 'my-new-popup-item'
    };
    const markup = popupmenuObj.renderItem(data);

    expect(markup).toBe('<li class="popupmenu-item"><a id="my-new-popup-item" href="#"><span>New Popup Item</span></a></li>');
  });

  it('Should build HTML for a single Popupmenu Item that\'s disabled', () => {
    const data = {
      text: 'This is disabled',
      disabled: true
    };
    const markup = popupmenuObj.renderItem(data);

    expect(markup).toBe('<li class="popupmenu-item is-disabled"><a href="#"><span>This is disabled</span></a></li>');
  });

  it('Should build HTML for a single Popupmenu item with a submenu from a settings object', () => {
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

    expect(markup).toBe('<li class="popupmenu-item submenu"><a href="#"><span>Parent Menu Item</span><svg class="arrow icon-dropdown icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-dropdown"></use></svg></a><ul class="popupmenu"><li class="popupmenu-item is-selectable"><a href="#"><span>Child Menu Item #1</span></a></li><li class="popupmenu-item is-selectable"><a href="#"><span>Child Menu Item #2</span></a></li><li class="popupmenu-item is-selectable"><a href="#"><span>Child Menu Item #3</span></a></li></ul></li>');
  });

  it('Should build HTML for a single Popupmenu item with a multi-selectable submenu from a settings object', () => {
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

    expect(markup).toBe('<li class="popupmenu-item submenu"><a href="#"><span>Parent Menu Item</span><svg class="arrow icon-dropdown icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-dropdown"></use></svg></a><ul class="popupmenu"><li class="popupmenu-item is-multiselectable"><a href="#"><span>Child Menu Item #1</span></a></li><li class="popupmenu-item is-multiselectable"><a href="#"><span>Child Menu Item #2</span></a></li><li class="popupmenu-item is-multiselectable"><a href="#"><span>Child Menu Item #3</span></a></li></ul></li>');
  });
});

it('Should build HTML for a single Popupmenu item with a submenu that contains both selection types independently', () => {
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

  expect(markup).toBe('<li class="popupmenu-item submenu"><a href="#"><svg class="icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-settings"></use></svg><span>Settings</span><svg class="arrow icon-dropdown icon" focusable="false" aria-hidden="true" role="presentation"><use xlink:href="#icon-dropdown"></use></svg></a><ul class="popupmenu"><li class="popupmenu-item is-multiselectable"><a href="#"><span>Submenu Item #1</span></a></li><li class="popupmenu-item is-multiselectable"><a href="#"><span>Submenu Item #2</span></a></li><li class="popupmenu-item is-multiselectable"><a href="#"><span>Submenu Item #3</span></a></li><li class="separator single"></li><li class="heading">Additional Settings</li><li class="popupmenu-item"><a href="#"><span>Other Setting #1</span></a></li><li class="popupmenu-item"><a href="#"><span>Other Setting #2</span></a></li><li class="popupmenu-item"><a href="#"><span>Other Setting #3</span></a></li></ul></li>');
});

describe('Popupmenu toData() API', () => {
  describe('Main Examples', () => {
    beforeEach(() => {
      popupmenuButtonEl = null;
      svgEl = null;
      rowEl = null;
      popupmenuObj = null;
      document.body.insertAdjacentHTML('afterbegin', popupmenuHTML);
      document.body.insertAdjacentHTML('afterbegin', svg);
      popupmenuButtonEl = document.body.querySelector('#popupmenu-trigger');
      rowEl = document.body.querySelector('.row');
      svgEl = document.body.querySelector('.svg-icons');
      popupmenuObj = new PopupMenu(popupmenuButtonEl);
    });

    afterEach(() => {
      popupmenuObj.destroy();
      popupmenuButtonEl.parentNode.removeChild(popupmenuButtonEl);
      rowEl.parentNode.removeChild(rowEl);
      svgEl.parentNode.removeChild(svgEl);
    });

    it('Should convert the main Popupmenu example into an object representation', () => {
      const data = popupmenuObj.toData();

      expect(data).toBeDefined();
      expect(data.menuId).toBeDefined(); // auto-generated
      expect(data.menu).toBeDefined();
      expect(data.menu.length).toBe(3);
      expect(data.menu[0].text).toBe('Menu Option #1');
      expect(data.menu[0].disabled).toBeFalsy();
      expect(data.menu[0].visible).toBeTruthy();
    });
  });

  describe('Context Menu examples', () => {
    beforeEach(() => {
      popupmenuButtonEl = null;
      svgEl = null;
      rowEl = null;
      popupmenuObj = null;
      document.body.insertAdjacentHTML('afterbegin', popupmenuContextMenuHTML);
      document.body.insertAdjacentHTML('afterbegin', svg);
      popupmenuButtonEl = document.body.querySelector('#input-menu');
      rowEl = document.body.querySelector('.row');
      svgEl = document.body.querySelector('.svg-icons');
      popupmenuObj = new PopupMenu(popupmenuButtonEl);
    });

    afterEach(() => {
      popupmenuObj.destroy();
      popupmenuButtonEl.parentNode.removeChild(popupmenuButtonEl);
      rowEl.parentNode.removeChild(rowEl);
      svgEl.parentNode.removeChild(svgEl);
    });

    it('Should convert a more complicated Popupmenu example into an object representation', () => {
      const data = popupmenuObj.toData();

      expect(data).toBeDefined();
      expect(data.menuId).toBe('action-popupmenu');
      expect(data.menu).toBeDefined();
      expect(data.menu.length).toBe(14);

      // Check existence of separator
      expect(data.menu[4].separator).toBeDefined();
      expect(data.menu[4].text).toBeUndefined();

      // Check existence of separator with heading/selection area
      expect(data.menu[9].separator).toBeDefined();
      expect(data.menu[9].heading).toBe('Additional Options');
      expect(data.menu[9].nextSectionSelect).toBe('single');

      // Check existence of submenu
      expect(data.menu[3].submenu).toBeDefined();
      expect(data.menu[3].submenu.length).toBe(4);
      expect(data.menu[3].submenu[0].text).toBe('Sub Menu 1');
      expect(data.menu[3].submenu[0].disabled).toBeFalsy();
      expect(data.menu[3].submenu[0].visible).toBeTruthy();

      // Check existence of icon
      expect(data.menu[13]).toBeDefined();
      expect(data.menu[13].icon).toBe('settings');
    });
  });
});
