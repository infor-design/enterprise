import { cleanup } from '../../helpers/func-utils';

import { ContextualActionPanel } from '../../../src/components/contextualactionpanel/contextualactionpanel';

const svgHTML = require('../../../src/components/icons/theme-new-svg.html');
const triggerHTML = require('../../../app/views/components/contextualactionpanel/example-trigger.html');

// Standard Contextual Action Panel settings
const capSettings = {
  title: 'Expenses: $50,000.00',
  content: '<div class="row"> <div class="six columns"> <div class="field"> <label for="expense-type">Expense Type</label> <select id="expense-type" class="dropdown"> <option selected>Meal</option> <option>Flight</option> </select> </div> <div class="field"> <label for="purchase-form">Purchase Form</label> <select id="purchase-form" name="purchase-form" class="dropdown"> <option value=""></option> <option value="3567" selected>3567</option> <option value="3568">3568</option> <option value="3569">3569</option> </select> </div> <div class="field"> <label for="template">Template</label> <select id="template" name="template" class="dropdown"> <option value="" selected>None</option> <option value="1">Template #1</option> <option value="2">Template #2</option> </select> </div> </div> <div class="six columns"><div class="field"> <label for="notes">Notes</label> <textarea id="notes" name="notes"></textarea> </div> </div> </div> </div>',
  modalSettings: {
    id: 'contextual-action-modal-xyz',
    trigger: 'immediate',
    buttons: [
      {
        type: 'input',
        text: 'Keyword',
        id: 'filter',
        name: 'filter',
        cssClass: 'searchfield',
        searchfieldSettings: {
          clearable: false,
          collapsible: true
        }
      }, {
        text: 'Close',
        cssClass: 'btn',
        icon: '#icon-close'
      }
    ]
  }
};

// This settings object simplifies the content area and only defines the buttons
const simpleCAPSettings = {
  title: 'Simple CAP',
  content: '<div class="row"><div class="six columns"><p>Simple CAP Content Area</p></div></div>',
  modalSettings: {
    id: 'simple-cap',
    trigger: 'immediate',
    buttons: [
      {
        text: 'Settings',
        cssClass: 'btn',
        id: 'settings',
        icon: '#icon-settings'
      },
      {
        type: 'input',
        text: 'Keyword',
        id: 'filter',
        name: 'filter',
        cssClass: 'searchfield',
        searchfieldSettings: {
          clearable: false,
          collapsible: true
        }
      }, {
        text: 'Close',
        cssClass: 'btn',
        icon: '#icon-close'
      }
    ],
    useFlexToolbar: true
  }
};

let capAPI;

describe('Contextual Action Panel - Defined Through Settings', () => {
  beforeEach(() => {
    capAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svgHTML);
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

  it('can be invoked', () => {
    capAPI = new ContextualActionPanel(document.body, capSettings);

    expect(capAPI).toEqual(jasmine.any(Object));
  });

  it('can provide a reference to its corresponding modal API', () => {
    capAPI = new ContextualActionPanel(document.body, capSettings);
    const modalAPI = capAPI.modalAPI;

    expect(modalAPI).toBeDefined();
    expect(modalAPI.open).toBeDefined();
  });

  it('completely destroys itself on close', (done) => {
    spyOn($, 'removeData').and.callThrough();
    capAPI = new ContextualActionPanel(document.body, capSettings);

    // Wait for the panel to open
    setTimeout(() => {
      // Close will auto-destroy when defined as `trigger: immediate`;
      capAPI.close();

      // Wait for the panel to close
      setTimeout(() => {
        expect($.removeData).toHaveBeenCalled();
        done();
      }, 600);
    }, 600);
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
});

describe('Contextual Action Panel - Button API Access', () => {
  beforeEach(() => {
    capAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svgHTML);
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

  it('can provide access to its Toolbar API', () => {
    capAPI = new ContextualActionPanel(document.body, simpleCAPSettings);

    expect(capAPI.toolbarAPI).toBeDefined();
    expect(capAPI.toolbarAPI.items).toBeDefined();
    expect(capAPI.toolbarAPI.items.length).toEqual(3);
  });

  it('can disable/enable single buttons on the inner Toolbar', () => {
    capAPI = new ContextualActionPanel(document.body, simpleCAPSettings);
    const toolbarAPI = capAPI.toolbarAPI;

    // Access and disable the first button via its API.
    const b1 = toolbarAPI.items[0];
    b1.disabled = true;

    expect(b1.element.disabled).toBeTruthy();

    b1.disabled = false;

    expect(b1.element.disabled).toBeFalsy();
  });

  it('can disable/enable the entire Toolbar', () => {
    capAPI = new ContextualActionPanel(document.body, simpleCAPSettings);
    const toolbarAPI = capAPI.toolbarAPI;
    const toolbarEl = toolbarAPI.element;

    toolbarAPI.disabled = true;

    expect(toolbarEl.className.indexOf('is-disabled')).toBeGreaterThan(-1);

    toolbarAPI.disabled = false;

    expect(toolbarEl.className.indexOf('is-disabled')).toEqual(-1);
  });
});
