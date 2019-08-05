import { Homepage } from '../../../src/components/homepage/homepage';

import { cleanup } from '../../helpers/func-utils';

let homepageEl;
let homepageAPI;
let hasEventListeners = false;

fdescribe('Homepage API', () => {
  beforeEach(() => {
    document.body.classList.add('no-scroll');

    homepageEl = document.createElement('div');
    homepageEl.id = 'test-homepage';
    homepageEl.classList.add('homepage');
    document.body.appendChild(homepageEl);
  });

  afterEach(() => {
    if (hasEventListeners) {
      $('#test-homepage').off('resize');
      hasEventListeners = false;
    }

    if (homepageAPI instanceof Homepage) {
      homepageAPI.destroy();
      homepageAPI = null;
    }

    cleanup(['.homepage']);
  });

  it('can pass metadata about its state through a `resize` event', (done) => {
    const spyEvent = spyOnEvent('#test-homepage', 'resize');

    // Sets up an actual event listener to get the contents of the metadata property
    let metadata;
    hasEventListeners = true;
    $('#test-homepage').on('resize', (e, offsetHeight, data) => {
      metadata = data;
    });

    // Forces a fixed width on the `.homepage` container
    homepageEl.style.width = '1280px';

    homepageAPI = new Homepage(homepageEl, {});

    setTimeout(() => {
      expect(spyEvent).toHaveBeenTriggered();
      expect(metadata).toBeDefined();
      expect(metadata.cols).toEqual(3);
      expect(metadata.rows).toEqual(1);
      expect(metadata.containerHeight).toEqual(410);
      done();
    }, 0);
  });
});
