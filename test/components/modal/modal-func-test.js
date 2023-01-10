/**
 * @jest-environment jsdom
 */
import { Modal } from '../../../src/components/modal/modal';
import { modalManager } from '../../../src/components/modal/modal.manager';
import { cleanup } from '../../helpers/func-utils';

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

const triggerHTML = `<button class="btn-secondary" id="modal-trigger">
  <span>Activate Modal</span>
</button>`;
const modalPanelHTML = `<div id="modal-panel" class="hidden">
  <div class="field">
    <label for="subject">Problem</label>
    <input type="text" id="subject" name="subject" />
  </div>

  <div class="field">
    <label for="location" class="label">Location</label>
    <select id="location" name="location" class="dropdown">
      <option value="N">North</option>
      <option value="S">South</option>
      <option value="E">East</option>
      <option value="W">West</option>
    </select>
  </div>

  <div class="field">
    <label for="notes-max">Notes (maxlength)</label>
    <textarea id="notes-max" class="textarea" maxlength="90" name="notes-max">Line One</textarea>
  </div>
</div>`;
const smallerModalPanelHTML = `<div id="modal-panel-2" class="hidden">
  <div class="field">
    <button id="test-second-button" class="btn-secondary">
      <span>Open Second Modal</span>
    </button>
  </div>
</div>`;

const standardButtonsDef = [
  {
    id: 'btn-0',
    text: 'Button 0'
  },
  {
    id: 'btn-1',
    style: 'btn-primary',
    text: 'Button 1'
  },
  {
    id: 'btn-2',
    style: 'btn-secondary',
    text: 'Button 2',
    icon: 'icon-settings'
  },
  {
    id: 'btn-3',
    style: 'btn-tertiary',
    text: 'Button 3',
    icon: 'icon-settings'
  },
  {
    id: 'btn-4',
    style: 'btn-destructive',
    text: 'Button 4'
  }
];

let modalPanelEl;
let modalAPI;

describe('Modal API', () => {
  beforeEach(() => {
    modalPanelEl = null;
    modalAPI = null;
    document.body.insertAdjacentHTML('afterbegin', triggerHTML);
    document.body.insertAdjacentHTML('afterbegin', modalPanelHTML);
    modalPanelEl = document.querySelector('#modal-panel');
  });

  afterEach(() => {
    if (modalAPI) {
      modalAPI.destroy();
    }
    cleanup();
  });

  it('should exist', () => {
    modalAPI = new Modal($('body'), {
      content: $(modalPanelEl)
    });

    expect(modalAPI).toBeTruthy();
  });

  it('can have a buttonset attached', () => {
    modalAPI = new Modal($('body'), {
      content: $(modalPanelEl),
      buttons: standardButtonsDef
    });

    expect(modalAPI.buttonsetAPI).toBeTruthy();
    expect(Array.isArray(modalAPI.buttonsetAPI.buttons)).toBeTruthy();
    expect(modalAPI.buttonsetAPI.buttons.length).toEqual(5);
  });

  it('can disable/enable the modal buttonset', () => {
    modalAPI = new Modal($('body'), {
      content: $(modalPanelEl),
      buttons: standardButtonsDef
    });

    const buttonsetEl = modalAPI.buttonsetAPI.element;
    const buttons = modalAPI.buttonsetAPI.buttons;

    // Disable
    modalAPI.buttonsetAPI.disabled = true;
    let enabledButtons = buttons.filter(buttonAPI => buttonAPI.disabled === false);

    expect(buttonsetEl.classList.contains('is-disabled')).toBeTruthy();
    expect(enabledButtons.length).toEqual(0);

    // Enable
    modalAPI.buttonsetAPI.disabled = false;
    enabledButtons = buttons.filter(buttonAPI => buttonAPI.disabled === false);

    expect(buttonsetEl.classList.contains('is-disabled')).toBeFalsy();
    expect(enabledButtons.length).toEqual(5);
  });

  it('can have a close button', () => {
    modalAPI = new Modal($('body'), {
      content: $(modalPanelEl),
      buttons: standardButtonsDef,
      showCloseBtn: true
    });
    const closeBtn = modalAPI.closeBtn;

    expect(closeBtn).toBeTruthy();
    expect(closeBtn instanceof HTMLElement).toBeTruthy();
    expect(closeBtn.classList.contains('btn-close')).toBeTruthy();
  });
});

let modalPanelEl2;
let modalAPI2;

describe('Modal Manager API', () => {
  beforeAll((done) => {
    // No idea why this is necessary
    const modalManagerLeftovers = modalManager.modals;
    if (modalManagerLeftovers.length) {
      modalManagerLeftovers.forEach((api) => {
        api.destroy();
        modalManager.unregister(api);
      });
    }
    setTimeout(() => {
      done();
    }, 500);
  });

  beforeEach(() => {
    modalPanelEl = null;
    modalAPI = null;
    modalPanelEl2 = null;
    modalAPI2 = null;
    document.body.insertAdjacentHTML('afterbegin', triggerHTML);
    document.body.insertAdjacentHTML('afterbegin', modalPanelHTML);
    modalPanelEl = document.querySelector('#modal-panel');
    document.body.insertAdjacentHTML('afterbegin', smallerModalPanelHTML);
    modalPanelEl2 = document.querySelector('#modal-panel-2');
  });

  afterEach((done) => {
    if (modalAPI) {
      modalAPI.destroy();
    }
    if (modalAPI2) {
      modalAPI2.destroy();
    }
    cleanup();
    setTimeout(() => {
      done();
    }, 500);
  });

  it('should exist as part of the global Soho object', () => {
    expect(Soho.modalManager).toBeTruthy();
  });

  it('holds references to all Modals defined in the page', (done) => {
    modalAPI = new Modal($('body'), {
      content: $(modalPanelEl)
    });

    // Modals should be registered upon creation, even if they aren't shown yet.
    expect(modalManager.modals.length).toEqual(1);

    modalAPI.open();
    setTimeout(() => {
      expect(modalManager.currentlyActive).toBeTruthy();
      expect(modalManager.currentlyOpen.length).toEqual(1);

      modalAPI.close();
      setTimeout(() => {
        expect(modalManager.currentlyActive).not.toBeTruthy();
        expect(modalManager.currentlyOpen.length).toEqual(0);

        // Modals should still be registered even if they are closed and hidden
        expect(modalManager.modals.length).toEqual(1);
        done();
      }, 300);
    }, 300);
  });

  // made `xit` til we figure out how to get timeouts working.
  // may need to replace setTimeout with renderLoop or direct `requestAnimationFrame` access.
  it('correctly organizes a modal stack based on which modal was last opened', (done) => {
    modalAPI = new Modal($('body'), {
      content: $(modalPanelEl)
    });

    expect(modalManager.modals.length).toEqual(1);

    modalAPI2 = new Modal($('body'), {
      content: $(modalPanelEl2)
    });

    expect(modalManager.modals.length).toEqual(2);

    modalAPI.open();

    setTimeout(() => {
      modalAPI2.open();

      setTimeout(() => {
        expect(modalManager.currentlyOpen.length).toEqual(2);
        expect(modalManager.currentlyActive).toEqual(modalAPI2);
        expect(modalManager.last).toEqual(modalAPI2);
        done();
      }, 500);
    }, 200);
  });

  it('can close the last modal open on a stack', (done) => {
    modalAPI = new Modal($('body'), {
      content: $(modalPanelEl)
    });
    modalAPI2 = new Modal($('body'), {
      content: $(modalPanelEl2)
    });

    modalAPI.open();

    setTimeout(() => {
      modalAPI2.open();

      setTimeout(() => {
        expect(modalManager.last).toEqual(modalAPI2);

        modalManager.closeLast();

        setTimeout(() => {
          expect(modalManager.currentlyOpen.length).toEqual(1);
          expect(modalManager.currentlyActive).toEqual(modalAPI);
          expect(modalManager.last).toEqual(modalAPI);
          done();
        }, 500);
      }, 500);
    }, 200);
  });

  it('can close all open modals on a stack', (done) => {
    modalAPI = new Modal($('body'), {
      content: $(modalPanelEl)
    });
    modalAPI2 = new Modal($('body'), {
      content: $(modalPanelEl2)
    });

    modalAPI.open();

    setTimeout(() => {
      modalAPI2.open();

      setTimeout(() => {
        expect(modalManager.last).toEqual(modalAPI2);

        modalManager.closeAll();

        setTimeout(() => {
          expect(modalManager.currentlyOpen.length).toEqual(0);
          expect(modalManager.currentlyActive).not.toBeTruthy();
          expect(modalManager.last).not.toBeTruthy();
          done();
        }, 500);
      }, 500);
    }, 200);
  });
});
