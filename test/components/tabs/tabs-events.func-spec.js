import { Tabs } from '../../../src/components/tabs/tabs';

const tabsHTML = require('../../../app/views/components/tabs/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let tabsEl;
let tabsPanelEl;
let svgEl;
let tabsObj;

describe('Tabs API', () => {
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

  it('Should trigger "beforeactivated" event', () => {
    const spyEvent = spyOnEvent('#tabs-normal', 'beforeactivated');
    tabsObj.settings.beforeActivate = true;
    tabsObj.activate('#tabs-normal-opportunities');
    tabsObj.activate('#tabs-normal-attachments');

    expect(spyEvent).toHaveBeenTriggered();
  });

  it('Should trigger "activated" event', () => {
    const spyEvent = spyOnEvent('#tabs-normal', 'activated');
    tabsObj.activate('#tabs-normal-opportunities');

    expect(spyEvent).toHaveBeenTriggered();
  });

  it('Should trigger "hash-change" event', () => {
    tabsObj.settings.changeTabOnHashChange = true;
    const spyEvent = spyOnEvent('#tabs-normal', 'hash-change');
    tabsObj.select('#tabs-normal-opportunities');

    expect(spyEvent).toHaveBeenTriggered();
  });

  it('Should trigger "close" event', () => {
    const spyEvent = spyOnEvent('#tabs-normal', 'close');
    tabsObj.remove('#tabs-normal-opportunities');

    expect(spyEvent).toHaveBeenTriggered();
  });

  it('Should trigger "afterclose" event', () => {
    const spyEvent = spyOnEvent('#tabs-normal', 'afterclose');
    tabsObj.remove('#tabs-normal-opportunities');

    expect(spyEvent).toHaveBeenTriggered();
  });
});
