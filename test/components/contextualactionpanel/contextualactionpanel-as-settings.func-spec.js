import { cleanup } from '../../helpers/func-utils';

import { ContextualActionPanel } from '../../../src/components/contextualactionpanel/contextualactionpanel';

const svgHTML = require('../../../src/components/icons/svg.html');
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

// These settings are legacy, and should be converted by the CAP API into the new
// `modalSettings` object, which will be passed into the Modal API underneath.
const legacyCAPSettings = {
  centerTitle: true,
  id: 'contextual-action-modal-xyz',
  showCloseButton: true,
  trigger: 'immediate',
  useFlexToolbar: true,
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
};

let capAPI;

describe('Contexual Action Panel - Defined Through Settings', () => {
  beforeEach(() => {
    capAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svgHTML);
    document.body.insertAdjacentHTML('afterbegin', triggerHTML);
  });

  afterEach((done) => {
    cleanup([
      '.svg-icons',
      '#tooltip',
      '.modal',
      '.row',
      '#test-script'
    ]);

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

  it('correctly converts legacy settings to `modalSettings` where applicable', () => {
    capAPI = new ContextualActionPanel(document.body, legacyCAPSettings);
    const settings = capAPI.settings;

    // Old settings shouldn't be present
    expect(settings.buttons).not.toBeDefined('settings.buttons');
    expect(settings.centerTitle).not.toBeDefined('settings.centerTitle');
    expect(settings.id).not.toBeDefined('settings.id');
    expect(settings.showCloseButton).not.toBeDefined('settings.showCloseButton');
    expect(settings.trigger).not.toBeDefined('settings.trigger');
    expect(settings.useFlexToolbar).not.toBeDefined('settings.useFlexToolbar');

    // New settings should exist
    expect(settings.modalSettings).toBeDefined('settings.modalSettings');
    expect(settings.modalSettings.buttons).toBeDefined('settings.modalSettings.buttons');
    expect(settings.modalSettings.centerTitle).toBeDefined('settings.modalSettings.centerTitle');
    expect(settings.modalSettings.id).toBeDefined('settings.modalSettings.id');
    expect(settings.modalSettings.showCloseBtn).toBeDefined('settings.modalSettings.showCloseBtn');
    expect(settings.modalSettings.trigger).toBeDefined('settings.modalSettings.trigger');
    expect(settings.modalSettings.useFlexToolbar).toBeDefined('settings.modalSettings.useFlexToolbar');

    const modalAPI = capAPI.modalAPI;
    const modalSettings = modalAPI.settings;

    // Settings defined in `modalSettings` will also exist on the Modal API
    expect(modalSettings.buttons).toBeDefined('modalAPI.settings.buttons');
    expect(modalSettings.centerTitle).toBeDefined('modalAPI.settings.centerTitle');
    expect(modalSettings.id).toBeDefined('modalAPI.settings.id');
    expect(modalSettings.showCloseBtn).toBeDefined('modalAPI.settings.showCloseBtn');
    expect(modalSettings.trigger).toBeDefined('modalAPI.settings.trigger');
    expect(modalSettings.useFlexToolbar).toBeDefined('modalAPI.settings.useFlexToolbar');
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
