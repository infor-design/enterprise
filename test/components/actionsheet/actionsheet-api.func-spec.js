import { ActionSheet } from '../../../src/components/actionsheet/actionsheet';
import { cleanup } from '../../helpers/func-utils';

const svg = require('../../../src/components/icons/theme-new-svg.html');

const triggerHTML = `<button class="btn-secondary">
  <svg class="icon" role="presentation">
    <use href="#icon-more"></use>
  </svg>
  <span>Trigger Action Sheet</span>
</button>`;

// Basic test actions that replicate `/components/actionsheet/example-index`
const testActions = [
  { icon: 'mail', text: 'Email' },
  { icon: 'user-profile', text: 'Go to Profile' },
  { icon: 'workflow', text: 'Share' },
  { icon: 'user-status-do-not-disturb', text: 'Remove' }
];

// Automation Id Attributes
const testAttrs = [
  { name: 'id', value: 'my-actions' },
  { name: 'data-automation-id', value: 'my-actions' }
];

fdescribe('ActionSheet API', () => {
  let actionSheetTriggerEl = null;
  let actionSheetEl = null;
  let actionSheetAPI = null;

  beforeEach(() => {
    actionSheetTriggerEl = null;
    actionSheetEl = null;
    actionSheetAPI = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', triggerHTML);
    actionSheetTriggerEl = document.querySelector('.btn-secondary');
  });

  afterEach(() => {
    if (actionSheetAPI) {
      actionSheetAPI.destroy();
    }
    cleanup();
  });

  it('should exist and have actions rendered', () => {
    actionSheetAPI = new ActionSheet(actionSheetTriggerEl, { actions: testActions });
    actionSheetEl = actionSheetAPI.actionSheetElem;

    expect(actionSheetAPI).toEqual(jasmine.any(Object));

    const { actionElems } = actionSheetAPI;

    // Action Sheet markup is rendered
    expect(actionSheetEl).toBeDefined();

    // Actions are rendered properly as button elements
    expect(actionElems).toBeDefined();
    expect(actionElems.length).toBe(testActions.length);
  });

  // Tests that a callback can be attached and fired for selection
  it('can attach callbacks for select', () => {
    let wasSelected = false;
    actionSheetAPI = new ActionSheet(actionSheetTriggerEl, {
      actions: testActions,
      onSelect: () => {
        wasSelected = true;
      }
    });
    actionSheetEl = actionSheetAPI.actionSheetElem;
    const firstAction = actionSheetAPI.actionElems[0];

    // Select the first action
    actionSheetAPI.open();
    actionSheetAPI.doSelect(firstAction);

    expect(wasSelected).toBeTruthy();
  });

  // Tests that events can trigger a response to selection
  it('triggers `selected` events', (done) => {
    actionSheetAPI = new ActionSheet(actionSheetTriggerEl, { actions: testActions });
    actionSheetEl = actionSheetAPI.actionSheetElem;
    const firstAction = actionSheetAPI.actionElems[0];

    // Setup an event listener for the `selected` event
    $(actionSheetTriggerEl).on('selected', (e, a) => {
      expect(a[0].isEqualNode(firstAction)).toBeTruthy();
      done();
    });

    // Select the first action
    actionSheetAPI.open();
    actionSheetAPI.doSelect(firstAction, true);
  });

  // Tests that a callback can be attached and fired for cancelled
  it('can attach callbacks for cancel', () => {
    let wasCancelled = false;
    actionSheetAPI = new ActionSheet(actionSheetTriggerEl, {
      actions: testActions,
      onCancel: () => {
        wasCancelled = true;
      }
    });
    actionSheetEl = actionSheetAPI.actionSheetElem;
    const firstAction = actionSheetAPI.actionElems[0];

    // Select the first action
    actionSheetAPI.open();
    actionSheetAPI.doCancel(firstAction);

    expect(wasCancelled).toBeTruthy();
  });

  // Tests that events can trigger a response to cancelation
  it('can trigger `cancelled` events', (done) => {
    actionSheetAPI = new ActionSheet(actionSheetTriggerEl, { actions: testActions });
    actionSheetEl = actionSheetAPI.actionSheetElem;
    const firstAction = actionSheetAPI.actionElems[0];

    // Setup an event listener for the `selected` event
    $(actionSheetTriggerEl).on('cancelled', (e, actionSheetElem) => {
      expect(actionSheetElem).toBeDefined();
      done();
    });

    actionSheetAPI.doCancel(firstAction, true);
  });

  it('can have automation ids', () => {
    actionSheetAPI = new ActionSheet(actionSheetTriggerEl, {
      actions: testActions,
      attributes: testAttrs
    });
    actionSheetEl = actionSheetAPI.actionSheetElem;
    const firstAction = actionSheetAPI.actionElems[0];

    // Attribute values are all prefixed with `my-actions` per the settings.
    expect(actionSheetTriggerEl.id).toBe('my-actions-trigger');
    expect(actionSheetEl.id).toBe('my-actions-sheet');
    expect(firstAction.id).toBe('my-actions-action-0');

    actionSheetAPI.openPopupMenu();
    const actionSheetMenuEl = actionSheetAPI.popupmenuAPI.menu[0];
    const firstMenuItem = actionSheetMenuEl.querySelector('a');

    // The setting of popupmenu attributes is delegated to the Popupmenu component.
    // However, they are all still prefixed with `my-actions` per the Action Sheet settings.
    expect(actionSheetMenuEl.id).toBe('my-actions-menu');
    expect(firstMenuItem.id).toBe('my-actions-option-0');
  });
});
