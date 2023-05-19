/**
 * @jest-environment jsdom
 */
import { Accordion } from '../../../src/components/accordion/accordion';
import { cleanup } from '../../helpers/func-utils';

const accordionHTML = `<div class="row">
  <div class="six columns">

    <div class="accordion" data-demo-set-links="true" data-options='{ "allowOnePane": false }'>
      <div id="header-one" class="accordion-header">
        <a href="#" id="warehouse-location" data-automation-id="accordion-a-header-one"><span>Warehouse Location</span></a>
        <button id="personal-expander" data-automation-id="accordion-btn-warehouse-location" class="btn">
          <svg class="chevron icon">
            <use href="#icon-caret-down"></use>
          </svg>
          <span class="audible">Expand</span>
        </button>
      </div>
      <div class="accordion-pane">
        <div class="accordion-content">
          <p>
          Remix, optimize, "B2B, iterate?" Best-of-breed efficient beta-test; social cutting-edge: rich magnetic tagclouds front-end infomediaries viral authentic incentivize sexy extensible functionalities incentivize. Generate killer authentic grow vertical blogospheres, functionalities ecologies harness, "tag solutions synergies exploit data-driven B2C open-source e-markets optimize create, enhance convergence create." Out-of-the-box strategize best-of-breed back-end, deploy design markets metrics. Content web services enhance leading-edge Cluetrain, deliverables dot-com scalable. User-centric morph, back-end, synthesize mesh, frictionless, exploit next-generation tag portals, e-commerce channels; integrate; recontextualize distributed revolutionize innovative eyeballs.
          </p>
        </div>
      </div>

      <div id="header-two" class="accordion-header">
        <a href="#" id="sort-by" data-automation-id="accordion-a-sort-by"><span>Sort By</span></a>
        <button id="sort-by-expander" data-automation-id="accordion-btn-sort-by" class="btn">
          <svg class="chevron icon">
            <use href="#icon-caret-down"></use>
          </svg>
          <span class="audible">Expand</span>
        </button>
      </div>
      <div class="accordion-pane">
        <div class="accordion-content">
          <div class="radio-group">
            <input type="radio" class="radio" name="sort" id="sort-recent" value="recent" />
            <label for="sort-recent" class="radio-label">Recently Added</label>
            <br/>
            <input type="radio" class="radio" name="sort" id="sort-price-low-high" value="price-low-high" checked="true" />
            <label for="sort-price-low-high" class="radio-label">Price: Low &ndash; High</label>
            <br/>
            <input type="radio" class="radio" name="sort" id="sort-price-high-low" value="price-high-low"/>
            <label for="sort-price-high-low" class="radio-label">Price: High &ndash; Low</label>
            <br/>
            <input type="radio" class="radio" name="sort" id="sort-alphabetical" value="alphabetical" />
            <label for="sort-alphabetical" class="radio-label">Alphabetical</label>
            <br/>
            <input type="radio" class="radio" name="sort" id="sort-stock" value="stock" />
            <label for="sort-stock" class="radio-label">In Stock</label>
            <br/>
          </div>
        </div>
      </div>

      <div id="header-three" class="accordion-header">
        <a id="brand-name" data-automation-id="accordion-a-brand-name" href="#"><span>Brand Name</span></a>
        <button id="brand-name-expander" data-automation-id="accordion-btn-brand-name" class="btn">
          <svg class="chevron icon">
            <use href="#icon-caret-down"></use>
          </svg>
          <span class="audible">Expand</span>
        </button>
      </div>
      <div class="accordion-pane">
        <div class="accordion-content">
            <p>
            Revolutionize implement infrastructures social front-end, world-class bricks-and-clicks extensible recontextualize? User-contributed e-business relationships widgets bleeding-edge transform, "viral world-class, unleash sexy embrace cross-media best-of-breed wireless, functionalities." Markets, "transition architectures, redefine infomediaries world-class back-end harness, mindshare blogospheres; schemas disintermediate rich," benchmark integrated markets blogging synergies dynamic social back-end convergence. Reinvent A-list A-list B2C rss-capable, mesh bandwidth mission-critical disintermediate strategize networks distributed integrated bleeding-edge rss-capable partnerships incubate, web-enabled e-markets. A-list channels enhance citizen-media, value solutions beta-test platforms enable interfaces, transition interfaces one-to-one expedite scalable.
            </p>
        </div>
      </div>

      <div id="header-four" class="accordion-header">
        <a id="material" data-automation-id="accordion-a-material" href="#"><span>Material</span></a>
        <button id="material-expander" data-automation-id="accordion-btn-material" class="btn">
          <svg class="chevron icon">
            <use href="#icon-caret-down"></use>
          </svg>
          <span class="audible">Expand</span>
        </button>
      </div>
      <div class="accordion-pane">
        <div class="accordion-content">
          <p>
          Revolutionize implement infrastructures social front-end, world-class bricks-and-clicks extensible recontextualize? User-contributed e-business relationships widgets bleeding-edge transform, "viral world-class, unleash sexy embrace cross-media best-of-breed wireless, functionalities." Markets, "transition architectures, redefine infomediaries world-class back-end harness, mindshare blogospheres; schemas disintermediate rich," benchmark integrated markets blogging synergies dynamic social back-end convergence. Reinvent A-list A-list B2C rss-capable, mesh bandwidth mission-critical disintermediate strategize networks distributed integrated bleeding-edge rss-capable partnerships incubate, web-enabled e-markets. A-list channels enhance citizen-media, value solutions beta-test platforms enable interfaces, transition interfaces one-to-one expedite scalable.
          </p>
        </div>
      </div>
    </div>

  </div>
</div>`;

let accordionEl;
let accordionObj;

// eslint-disable-next-line arrow-body-style
window.getComputedStyle = () => {
  return { height: '20px' };
};

describe('Accordion API', () => {
  beforeEach(() => {
    accordionEl = null;
    accordionObj = null;
    document.body.insertAdjacentHTML('afterbegin', accordionHTML);
    accordionEl = document.body.querySelector('.accordion');
    accordionObj = new Accordion(accordionEl);
  });

  afterEach(() => {
    accordionObj?.destroy();
    cleanup();
  });

  it('should be defined', () => {
    expect(accordionObj).toBeTruthy();
  });

  it('should be visible', () => {
    expect(document.body.querySelector('.accordion')).toBeTruthy();
  });

  it('can be destroyed', () => {
    accordionObj?.destroy();

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

describe('Accordion API (data)', () => {
  beforeEach(() => {
    accordionEl = null;
    accordionObj = null;
  });

  afterEach(() => {
    accordionObj?.destroy();
    cleanup();
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
