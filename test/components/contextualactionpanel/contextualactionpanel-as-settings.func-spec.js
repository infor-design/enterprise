import { cleanup } from '../../helpers/func-utils';

import { ContextualActionPanel } from '../../../src/components/contextualactionpanel/contextualactionpanel';

const svgHTML = require('../../../src/components/icons/svg.html');
const triggerHTML = require('../../../app/views/components/contextualactionpanel/example-trigger.html');

const capSettings = {
  id: 'contextual-action-modal-xyz',
  title: 'Expenses: $50,000.00',
  content: '<div class="row"> <div class="six columns"> <div class="field"> <label for="expense-type">Expense Type</label> <select id="expense-type" class="dropdown"> <option selected>Meal</option> <option>Flight</option> </select> </div> <div class="field"> <label for="purchase-form">Purchase Form</label> <select id="purchase-form" name="purchase-form" class="dropdown"> <option value=""></option> <option value="3567" selected>3567</option> <option value="3568">3568</option> <option value="3569">3569</option> </select> </div> <div class="field"> <label for="template">Template</label> <select id="template" name="template" class="dropdown"> <option value="" selected>None</option> <option value="1">Template #1</option> <option value="2">Template #2</option> </select> </div> </div> <div class="six columns"><div class="field"> <label for="notes">Notes</label> <textarea id="notes" name="notes"></textarea> </div> </div> </div> </div>',
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
};

let capAPI;

describe('Contexual Action Panel - Defined Through Settings', () => {
  beforeEach(() => {
    capAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svgHTML);
    document.body.insertAdjacentHTML('afterbegin', triggerHTML);
  });

  afterEach(() => {
    cleanup([
      '.svg-icons',
      '#tooltip',
      '.contextual-action-panel.modal',
      '.row',
      '#test-script'
    ]);

    if (capAPI) {
      capAPI.destroy();
    }
    document.body.removeAttribute('data-modal');
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
      }, 400);
    }, 400);
  });
});
