import { Tabs } from '../../../src/components/tabs/tabs';
import { cleanup } from '../../helpers/func-utils';

const tabsHTML = require('../../../app/views/components/tabs/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let tabsEl;
let tabsObj;

describe('Tabs Settings', () => {
  beforeEach(() => {
    tabsEl = null;
    tabsObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', tabsHTML);
    tabsEl = document.body.querySelector('.tab-container');
    tabsEl.classList.add('no-init');
    tabsObj = new Tabs(tabsEl);
  });

  afterEach(() => {
    tabsObj.destroy();
    cleanup();
  });

  it('should set settings', () => {
    const settings = {
      addTabButton: false,
      addTabButtonCallback: null,
      addTabButtonTooltip: false,
      appMenuTrigger: false,
      appMenuTriggerTextAudible: false,
      ajaxOptions: null,
      containerElement: null,
      changeTabOnHashChange: false,
      hashChangeCallback: null,
      lazyLoad: true,
      moduleTabsTooltips: false,
      multiTabsTooltips: false,
      source: null,
      sourceArguments: {},
      tabCounts: false,
      verticalResponsive: false,
      attributes: null,
      sortable: false
    };
    tabsObj.updated();

    expect(tabsObj.settings).toEqual(settings);
  });

  it('should update set settings via parameter', () => {
    const settings = {
      addTabButton: true,
      addTabButtonCallback: null,
      addTabButtonTooltip: false,
      appMenuTrigger: false,
      appMenuTriggerTextAudible: false,
      ajaxOptions: null,
      containerElement: null,
      changeTabOnHashChange: true,
      hashChangeCallback: null,
      lazyLoad: true,
      moduleTabsTooltips: false,
      multiTabsTooltips: false,
      source: null,
      sourceArguments: {},
      tabCounts: false,
      verticalResponsive: false,
      attributes: null,
      sortable: false
    };
    tabsObj.updated(settings);

    expect(tabsObj.settings).toEqual(settings);
  });
});
