import { Accordion } from '../../../src/components/accordion/accordion';
import { cleanup } from '../../helpers/func-utils';

const accordionHTML = require('../../../app/views/components/accordion/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

let accordionEl;
let accordionObj;

describe('Accordion API', () => {
  beforeEach(() => {
    accordionEl = null;
    accordionObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', accordionHTML);
    accordionEl = document.body.querySelector('.accordion');
    accordionObj = new Accordion(accordionEl);
  });

  afterEach(() => {
    accordionObj.destroy();
    cleanup([
      '.accordion',
      '.svg-icons',
      '.row',
    ]);
  });

  it('should be defined', () => {
    expect(accordionObj).toEqual(jasmine.any(Object));
  });

  it('should be visible', () => {
    expect(document.body.querySelector('.accordion')).toBeTruthy();
  });

  it('can be destroyed', () => {
    accordionObj.destroy();

    expect(document.body.querySelector('.btn.hide-focus')).toBeFalsy();
  });

  it('can collapse all its headers', () => {
    accordionObj.collapseAll();

    expect(document.body.querySelector('.accordion.is-expanded')).toBeFalsy();
  });

  it('can be disabled and enabled', () => {
    accordionObj.disable();

    expect(document.body.querySelector('.accordion.is-disabled')).toBeTruthy();

    accordionEl = document.body.querySelector('.accordion.is-disabled');
    accordionObj = new Accordion(accordionEl);

    accordionObj.enable();

    expect(document.body.querySelector('.accordion.is-disabled')).toBeFalsy();
  });

  it('should contain a reference to all its headers', () => {
    expect(accordionObj.headers).toBeTruthy();
  });

  it('can describe whether or not a header is currently expanded', () => {
    const isExpanded = accordionObj.isExpanded(accordionObj.headers[0]);

    expect(isExpanded).toBeFalsy();
  });

  it('fires a `selected` event on click', () => {
    const linkSelector = '.accordion a';
    const spyEvent = spyOnEvent($(linkSelector), 'click');
    document.body.querySelector(linkSelector).click();

    expect(spyEvent).toHaveBeenTriggered();
  });

  it('can expand and collapse all of its headers at once', (done) => {
    expect(accordionObj.isExpanded(accordionObj.headers[0])).toBeFalsy();
    expect(accordionObj.isExpanded(accordionObj.headers[1])).toBeFalsy();
    expect(accordionObj.isExpanded(accordionObj.headers[2])).toBeFalsy();
    expect(accordionObj.isExpanded(accordionObj.headers[3])).toBeFalsy();

    accordionObj.expandAll();

    setTimeout(() => {
      expect(accordionObj.isExpanded(accordionObj.headers[0])).toBeTruthy();
      expect(accordionObj.isExpanded(accordionObj.headers[1])).toBeTruthy();
      expect(accordionObj.isExpanded(accordionObj.headers[2])).toBeTruthy();
      expect(accordionObj.isExpanded(accordionObj.headers[3])).toBeTruthy();

      accordionObj.collapseAll();

      setTimeout(() => {
        expect(accordionObj.isExpanded(accordionObj.headers[0])).toBeFalsy();
        expect(accordionObj.isExpanded(accordionObj.headers[1])).toBeFalsy();
        expect(accordionObj.isExpanded(accordionObj.headers[2])).toBeFalsy();
        expect(accordionObj.isExpanded(accordionObj.headers[3])).toBeFalsy();
        done();
      }, 300);
    }, 300);
  });
});

describe('Accordion API (settings)', () => {
  beforeEach(() => {
    accordionEl = null;
    accordionObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', accordionHTML);
    accordionEl = document.body.querySelector('.accordion');
  });

  afterEach(() => {
    accordionObj.destroy();
    cleanup([
      '.accordion',
      '.svg-icons',
      '.row',
    ]);
  });

  // `displayChevron` deprecated as of v4.23.x
  it('Converts the legacy setting `displayChevron: false` to `expanderDisplay: \'plus-minus\'`', () => {
    accordionObj = new Accordion(accordionEl, {
      displayChevron: false
    });

    expect(accordionObj.settings.displayChevron).not.toBeDefined();
    expect(accordionObj.settings.expanderDisplay).toEqual('plus-minus');
  });

  // `displayChevron` deprecated as of v4.23.x
  it('Converts the legacy setting `displayChevron: true` to `expanderDisplay: \'classic\'`', () => {
    accordionObj = new Accordion(accordionEl, {
      displayChevron: true
    });

    expect(accordionObj.settings.displayChevron).not.toBeDefined();
    expect(accordionObj.settings.expanderDisplay).toEqual('classic');
  });
});

describe('Accordion API (data)', () => {
  beforeEach(() => {
    accordionEl = null;
    accordionObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
  });

  afterEach(() => {
    accordionObj.destroy();
    cleanup([
      '.accordion',
      '.svg-icons',
      '.row',
    ]);
  });

  it('can create a data representation of itself', () => {
    document.body.insertAdjacentHTML('afterbegin', accordionHTML);
    accordionEl = document.body.querySelector('.accordion');
    accordionObj = new Accordion(accordionEl);
    const data = accordionObj.toData();

    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBe(4);
    expect(data[0].text).toBe('Warehouse Location');
    expect(data[0].type).toBe('header');
    expect(Array.isArray(data[0].children)).toBeTruthy();
  });
});
