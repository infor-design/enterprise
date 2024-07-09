/**
 * @jest-environment jsdom
 */
import { Homepage } from '../../../src/components/homepage/homepage';
import { cleanup } from '../../helpers/func-utils';

const scenarioMHTML = `<div id="maincontent" class="page-container scrollable" role="main">
  <div class="homepage" data-columns="4">
    <div class="content">

      <div class="widget">
        <div class="widget-header">
          <h2 tabindex="0" class="widget-title">Widget 1x1 (Dom Order 1) - A</h2>
        </div>
      </div>

      <div class="widget">
        <div class="widget-header">
          <h2 tabindex="0" class="widget-title">Widget 1x1 (Dom Order 2) - B</h2>
        </div>
      </div>

      <div class="widget">
        <div class="widget-header">
          <h2 tabindex="0" class="widget-title">Widget 1x1 (Dom Order 3) - C</h2>
        </div>
      </div>

      <div class="widget">
        <div class="widget-header">
          <h2 tabindex="0" class="widget-title">Widget 1x1 (Dom Order 4) - D</h2>
        </div>
      </div>

      <div class="widget triple-width">
        <div class="widget-header">
          <h2 tabindex="0" class="widget-title">Widget 3x1 (Dom Order 5) - E</h2>
        </div>
      </div>

    </div>
  </div>
</div>`;

const targetId = 'test-homepage';
let homepageEl;
let homepageAPI;
let hasEventListeners = false;

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

describe('Homepage API', () => {
  beforeEach(() => {
    document.body.classList.add('no-scroll');
  });

  afterEach(() => {
    if (hasEventListeners) {
      $(`#${targetId}`).off('resize');
      hasEventListeners = false;
    }

    if (homepageAPI instanceof Homepage) {
      homepageAPI.destroy();
      homepageAPI = null;
    }

    cleanup();
    homepageEl = null;
  });

  it.skip('can pass metadata about its state through a `resize` event', (done) => {
    homepageEl = document.createElement('div');
    homepageEl.id = targetId;
    homepageEl.classList.add('homepage');
    document.body.appendChild(homepageEl);

    const callback = jest.fn();
    $(`#${targetId}`).on('resize', callback);

    // Sets up an actual event listener to get the contents of the metadata property
    let metadata;
    hasEventListeners = true;
    $(`#${targetId}`).on('resize', (e, offsetHeight, data) => {
      metadata = data;
    });

    homepageAPI = new Homepage(homepageEl, {});

    setTimeout(() => {
      expect(callback).toHaveBeenCalled();
      expect(metadata).toBeTruthy();
      expect(metadata.cols).toBeTruthy();
      expect(metadata.containerHeight).toBeTruthy();
      expect(metadata.matrix).toBeTruthy();
      expect(metadata.rows).toBeTruthy();
      expect(metadata.blocks).toBeTruthy();
      expect(metadata.editing).toBeTruthy();
      done();
    }, 0);
  });

  it.skip('correctly accounts for an empty row in a height calculation', (done) => {
    document.body.insertAdjacentHTML('afterbegin', scenarioMHTML);
    homepageEl = document.querySelector('.homepage');
    homepageEl.id = targetId;

    let metadata;
    hasEventListeners = true;
    $(`#${targetId}`).on('resize', (e, offsetHeight, data) => {
      metadata = data;
    });

    // Forces a fixed width on the `.homepage` container
    homepageEl.style.width = '780px';

    homepageAPI = new Homepage(homepageEl, {});

    setTimeout(() => {
      expect(metadata.matrix.length).toEqual(6);
      expect(metadata.rows).toEqual(3);
      expect(metadata.containerHeight).toEqual(1190);
      done();
    }, 0);
  });

  it('can be initialized with editing enabled', (done) => {
    homepageEl = document.createElement('div');
    homepageEl.id = targetId;
    homepageEl.classList.add('homepage');
    document.body.appendChild(homepageEl);

    let metadata;
    hasEventListeners = true;
    $(`#${targetId}`).on('resize', (e, offsetHeight, data) => {
      metadata = data;
    });

    homepageAPI = new Homepage(homepageEl, { editing: true });

    setTimeout(() => {
      expect(metadata.editing).toEqual(true);
      done();
    }, 100);
  });

  it('can enable editing mode using setEdit()', (done) => {
    homepageEl = document.createElement('div');
    homepageEl.id = targetId;
    homepageEl.classList.add('homepage');
    document.body.appendChild(homepageEl);

    homepageAPI = new Homepage(homepageEl, {});

    setTimeout(() => {
      expect(homepageAPI.state.editing).toEqual(false);
      homepageAPI.setEdit(true);

      expect(homepageAPI.state.editing).toEqual(true);
      done();
    }, 100);
  });
});
