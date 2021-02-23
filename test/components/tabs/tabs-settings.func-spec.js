import { Tabs } from '../../../src/components/tabs/tabs';

const tabsHTML = require('../../../app/views/components/tabs/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let tabsEl;
let tabsPanelEl;
let svgEl;
let tabsObj;

describe('Tabs Settings', () => {
  beforeEach(() => {
    tabsEl = null;
    tabsPanelEl = null;
    svgEl = null;
    tabsObj = null;
    document.body.insertAdjacentHTML('afterbegin', svg);
    document.body.insertAdjacentHTML('afterbegin', tabsHTML);
    tabsEl = document.body.querySelector('.tab-container');
    tabsPanelEl = document.body.querySelector('.tab-panel-container');
    svgEl = document.body.querySelector('.svg-icons');
    tabsEl.classList.add('no-init');
    tabsObj = new Tabs(tabsEl);
  });

  afterEach(() => {
    tabsObj.destroy();
    tabsEl.parentNode.removeChild(tabsEl);
    tabsPanelEl.parentNode.removeChild(tabsPanelEl);
    svgEl.parentNode.removeChild(svgEl);
  });

  it('Should set settings', () => {
    const settings = {
      addTabButton: false,
      addTabButtonCallback: null,
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
      attributes: null
    };
    tabsObj.updated();

    expect(tabsObj.settings).toEqual(settings);
  });

  it('Should update set settings via parameter', () => {
    const settings = {
      addTabButton: true,
      addTabButtonCallback: null,
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
      attributes: null
    };
    tabsObj.updated(settings);

    expect(tabsObj.settings).toEqual(settings);
  });
});
