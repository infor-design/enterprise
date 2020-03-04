import { Modal, MODAL_DEFAULTS } from '../../../src/components/modal/modal';
import { cleanup } from '../../helpers/func-utils';

const svg = require('../../../src/components/icons/svg.html');

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
let modalTriggerEl;
let modalAPI;

describe('Modal API', () => {
  beforeEach(() => {
    modalPanelEl = null;
    modalAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', triggerHTML);
    document.body.insertAdjacentHTML('afterbegin', modalPanelHTML);
    modalTriggerEl = document.querySelector('#modal-trigger');
    modalPanelEl = document.querySelector('#modal-panel');
  });

  afterEach(() => {
    if (modalAPI) {
      modalAPI.destroy();
    }
    cleanup([
      '.svg-icons',
      '.row',
      '#modal-trigger',
      '#modal-panel',
      '.modal'
    ]);
  });

  it('should exist', () => {
    modalAPI = new Modal($('body'), {
      content: $(modalPanelEl)
    });

    expect(modalAPI).toEqual(jasmine.any(Object));
  });

  it('can be opened', (done) => {
    modalAPI = new Modal($('body'), {
      content: $(modalPanelEl)
    });
    modalAPI.open();

    setTimeout(() => {
      debugger;
      expect(document.body.classList.contains('modal-engaged')).toBeTruthy();
      expect(modalAPI.element[0].getAttribute('aria-modal')).toBeTruthy();
      done();
    }, 100);
  });

  it('can have a buttonset attached', () => {
    modalAPI = new Modal($('body'), {
      content: $(modalPanelEl),
      buttons: standardButtonsDef
    });

    expect(modalAPI.buttonsetAPI).toBeDefined();
    expect(Array.isArray(modalAPI.buttonsetAPI.buttons)).toBeTruthy();
    expect(modalAPI.buttonsetAPI.buttons.length).toEqual(5);
  });

  it('can disable/enable the modal buttonset', () => {
    modalAPI = new Modal($('body'), {
      content: $(modalPanelEl),
      buttons: standardButtonsDef
    });

    // Disable
    const buttonsetEl = modalAPI.buttonsetAPI.element;
    modalAPI.buttonsetAPI.disabled = true;
    let enabledButtons = modalAPI.buttonsetAPI.buttons.filter(buttonAPI => buttonAPI.disabled === false);

    expect(buttonsetEl.classList.contains('is-disabled')).toBeTruthy();
    expect(enabledButtons.length).toEqual(0);

    // Enable
    modalAPI.buttonsetAPI.disabled = false;
    enabledButtons = modalAPI.buttonsetAPI.buttons.filter(buttonAPI => buttonAPI.disabled === false);

    expect(buttonsetEl.classList.contains('is-disabled')).toBeFalsy();
    expect(enabledButtons.length).toEqual(5);
  });
});
