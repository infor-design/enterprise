/**
 * @jest-environment jsdom
 */
import { cleanup } from '../../helpers/func-utils';

import { ContextualActionPanel } from '../../../src/components/contextualactionpanel/contextualactionpanel';

require('../../../src/components/modal/modal.jquery.js');
require('../../../src/components/searchfield/searchfield.jquery.js');
require('../../../src/components/toolbar-flex/toolbar-flex.jquery.js');
require('../../../src/components/toolbar/toolbar.jquery.js');
require('../../../src/behaviors/initialize/initialize.jquery.js');

const triggerHTML = `<div class="row">
  <div class="six columns">
    <button type="button" id="manual-contextual-panel" class="btn-secondary">
      Contextual Action Panel - Manual Trigger
    </button>
  </div>
</div>`;

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

let capAPI;

describe('Contextual Action Panel - Defined Through Settings', () => {
  beforeEach(() => {
    capAPI = null;
    document.body.insertAdjacentHTML('afterbegin', triggerHTML);
  });

  afterEach((done) => {
    cleanup();

    if (capAPI) {
      capAPI.destroy();
    }
    document.body.removeAttribute('data-modal');
    setTimeout(() => {
      done();
    }, 500);
  });

  it('can pass a `fullsize` setting to the underlying Modal component', () => {
    capAPI = new ContextualActionPanel(document.body, {
      modalSettings: {
        fullsize: 'always',
        breakpoint: 'phone'
      }
    });
    const modalSettings = capAPI.modalAPI.settings;

    expect(modalSettings.fullsize).toEqual('always');
    expect(modalSettings.breakpoint).toEqual('phone');
  });

  it('can pass a `title` setting to the underlying Modal component', () => {
    capAPI = new ContextualActionPanel(document.body, {
      modalSettings: {
        title: 'Expenses: $50,000.00'
      }
    });
    const modalSettings = capAPI.modalAPI.settings;

    expect(modalSettings.title).toEqual('Expenses: $50,000.00');
  });
});
