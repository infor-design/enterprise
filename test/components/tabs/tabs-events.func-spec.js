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

  it('should trigger "beforeactivated" event', () => {
    const callback = jest.fn();
    $('#tabs-normal').on('beforeactivated', callback);

    tabsObj.settings.beforeActivate = true;
    tabsObj.activate('#tabs-normal-opportunities');
    tabsObj.activate('#tabs-normal-attachments');

    expect(callback).toHaveBeenCalled();
  });

  it('should trigger "activated" event', () => {
    const callback = jest.fn();
    $('#tabs-normal').on('activated', callback);

    tabsObj.activate('#tabs-normal-opportunities');

    expect(callback).toHaveBeenCalled();
  });

  it('should trigger "hash-change" event', () => {
    tabsObj.settings.changeTabOnHashChange = true;
    const callback = jest.fn();
    $('#tabs-normal').on('hash-change', callback);

    tabsObj.select('#tabs-normal-opportunities');

    expect(callback).toHaveBeenCalled();
  });

  it('should trigger "close" event', () => {
    const callback = jest.fn();
    $('#tabs-normal').on('close', callback);

    tabsObj.remove('#tabs-normal-opportunities');

    expect(callback).toHaveBeenCalled();
  });

  it('should trigger "afterclose" event', () => {
    const callback = jest.fn();
    $('#tabs-normal').on('afterclose', callback);

    tabsObj.remove('#tabs-normal-opportunities');

    expect(callback).toHaveBeenCalled();
  });
});
