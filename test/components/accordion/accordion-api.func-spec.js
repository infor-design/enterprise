import { Accordion } from '../../../src/components/accordion/accordion';
import { cleanup } from '../../helpers/func-utils';

const accordionHTML = require('../../../app/views/components/accordion/example-index.html');
const svg = require('../../../src/components/icons/svg.html');

const emptyAccordionHTML = `<div id="test-accordion" class="accordion">
  <div id="top-header" class="accordion-header">Top Header</div>
  <div id="top-pane" class="accordion-pane"></div>
</div>`;
const standardHeaderHTMLResponse = `
  <div class="accordion-header"><a href="#"><span>Dynamically-Added Header (0)</span></a></div>
  <div class="accordion-header"><a href="#"><span>Dynamically-Added Header (1)</span></a></div>
  <div class="accordion-header"><a href="#"><span>Dynamically-Added Header (2)</span></a></div>
  <div class="accordion-header"><a href="#"><span>Dynamically-Added Header (3)</span></a></div>
`;

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

    expect($(accordionEl).data('accordion')).toBeFalsy();
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

  it('can expand by ID', (done) => {
    expect(accordionObj.isExpanded(accordionObj.headers[0])).toBeFalsy();
    expect(accordionObj.isExpanded(accordionObj.headers[1])).toBeFalsy();
    expect(accordionObj.isExpanded(accordionObj.headers[2])).toBeFalsy();
    expect(accordionObj.isExpanded(accordionObj.headers[3])).toBeFalsy();

    accordionObj.expand('header-two');

    setTimeout(() => {
      expect(accordionObj.isExpanded(accordionObj.headers[0])).toBeFalsy();
      expect(accordionObj.isExpanded(accordionObj.headers[1])).toBeTruthy();
      expect(accordionObj.isExpanded(accordionObj.headers[2])).toBeFalsy();
      expect(accordionObj.isExpanded(accordionObj.headers[3])).toBeFalsy();

      accordionObj.collapse('header-two');

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

describe('Accordion API (source/ajax)', () => {
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

  it('can populate itself via AJAX call', (done) => {
    document.body.insertAdjacentHTML('afterbegin', emptyAccordionHTML);
    accordionEl = document.body.querySelector('.accordion');
    const topHeader = accordionEl.querySelector('#top-header');
    const topPane = accordionEl.querySelector('#top-pane');

    const sourceContainer = {
      source: (ui, response) => {
        setTimeout(() => {
          topPane.insertAdjacentHTML('afterbegin', standardHeaderHTMLResponse);
          response();
        }, 300);
      }
    };

    const sourceSpy = spyOn(sourceContainer, 'source').and.callThrough();
    accordionObj = new Accordion(accordionEl, {
      source: sourceContainer.source
    });
    accordionObj.expand($(topHeader));

    setTimeout(() => {
      expect(sourceSpy).toHaveBeenCalled();
      expect(topPane.children.length).toEqual(4);
      expect(topPane.children[3].innerText.trim()).toEqual('Dynamically-Added Header (3)');
      done();
    }, 310);
  });

  // See `infor-design/enterprise#3826` for explanation
  it('can skip the `updated()` method if the response is configured to do so', (done) => {
    document.body.insertAdjacentHTML('afterbegin', emptyAccordionHTML);
    accordionEl = document.body.querySelector('.accordion');
    const topHeader = accordionEl.querySelector('#top-header');
    const topPane = accordionEl.querySelector('#top-pane');

    const sourceContainer = {
      source: (ui, response) => {
        setTimeout(() => {
          topPane.insertAdjacentHTML('afterbegin', standardHeaderHTMLResponse);
          response(true);
        }, 300);
      }
    };

    accordionObj = new Accordion(accordionEl, {
      source: sourceContainer.source
    });
    const updatedSpy = spyOn(accordionObj, 'updated').and.callThrough();
    accordionObj.expand($(topHeader));

    setTimeout(() => {
      expect(updatedSpy).not.toHaveBeenCalled();
      done();
    }, 310);
  });
});
