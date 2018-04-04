import { PopupMenu } from '../popupmenu';

const popupmenuHTML = require('../example-index.html');
const popupmenuSelectableHTML = require('../example-selectable.html');
const svg = require('../../icons/svg.html');

const ePage = {
  pageX: 136,
  pageY: 182
};

const eClient = {
  clientX: 222,
  clientY: 333
};

let popupmenuButtonEl;
let svgEl;
let popupmenuObj;

describe('Popupmenu Menu Button API', () => {
  beforeEach(() => {
    popupmenuButtonEl = null;
    svgEl = null;
    popupmenuObj = null;

    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', popupmenuHTML);
    popupmenuButtonEl = document.body.querySelector('#popupmenu-trigger');
    svgEl = document.body.querySelector('.svg-icons');
    popupmenuObj = new PopupMenu(popupmenuButtonEl);
  });

  afterEach(() => {
    popupmenuObj.destroy();
    popupmenuButtonEl.parentNode.removeChild(popupmenuButtonEl);
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
    popupmenuObj = null;
    document.body.insertAdjacentHTML('afterbegin', popupmenuSelectableHTML);
    document.body.insertAdjacentHTML('afterbegin', svg);
    popupmenuButtonEl = document.body.querySelector('#single-select-popupmenu-trigger');
    svgEl = document.body.querySelector('.svg-icons');
    popupmenuObj = new PopupMenu(popupmenuButtonEl);
  });

  afterEach(() => {
    popupmenuObj.destroy();
    popupmenuButtonEl.parentNode.removeChild(popupmenuButtonEl);
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
