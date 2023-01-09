import { Tabs } from '../../../src/components/tabs/tabs';
import { cleanup } from '../../helpers/func-utils';

const tabsHTML = require('../../../app/views/components/tabs/example-index.html');
const svg = require('../../../src/components/icons/theme-new-svg.html');

let tabsEl;
let tabsObj;

describe('Tabs API', () => {
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

  it('Should trigger "beforeactivated" event', () => {
    const spyEvent = spyOnEvent('#tabs-normal', 'beforeactivated');
    tabsObj.settings.beforeActivate = true;
    tabsObj.activate('#tabs-normal-opportunities');
    tabsObj.activate('#tabs-normal-attachments');

    expect(spyEvent).toHaveBeenCalled();
  });

  it('Should trigger "activated" event', () => {
    const spyEvent = spyOnEvent('#tabs-normal', 'activated');
    tabsObj.activate('#tabs-normal-opportunities');

    expect(spyEvent).toHaveBeenCalled();
  });

  it('Should trigger "hash-change" event', () => {
    tabsObj.settings.changeTabOnHashChange = true;
    const spyEvent = spyOnEvent('#tabs-normal', 'hash-change');
    tabsObj.select('#tabs-normal-opportunities');

    expect(spyEvent).toHaveBeenCalled();
  });

  it('Should trigger "close" event', () => {
    const spyEvent = spyOnEvent('#tabs-normal', 'close');
    tabsObj.remove('#tabs-normal-opportunities');

    expect(spyEvent).toHaveBeenCalled();
  });

  it('Should trigger "afterclose" event', () => {
    const spyEvent = spyOnEvent('#tabs-normal', 'afterclose');
    tabsObj.remove('#tabs-normal-opportunities');

    expect(spyEvent).toHaveBeenCalled();
  });
});
