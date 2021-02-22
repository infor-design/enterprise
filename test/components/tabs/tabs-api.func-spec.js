import { Tabs } from '../../../src/components/tabs/tabs';

const tabsHTML = require('../../../app/views/components/tabs/example-index.html');
const svg = require('../../../src/components/icons/theme-uplift-svg.html');

let tabsEl;
let tabsPanelEl;
let svgEl;
let rowEl;
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
    rowEl = document.body.querySelector('.row');
    tabsPanelEl = document.body.querySelector('.tab-panel-container');
    svgEl = document.body.querySelector('.svg-icons');
    tabsEl.classList.add('no-init');

    tabsObj = new Tabs(tabsEl, {
      attributes: [
        { name: 'data-automation-id', value: 'tabs-test' }
      ]
    });
  });

  afterEach(() => {
    tabsObj.destroy();
    tabsPanelEl.parentNode.removeChild(tabsPanelEl);
    tabsEl.parentNode.removeChild(tabsEl);
    svgEl.parentNode.removeChild(svgEl);
    rowEl.parentNode.removeChild(rowEl);
  });

  it('Should be defined on jQuery object', () => {
    expect(tabsObj).toEqual(jasmine.any(Object));
  });

  it('Should not update href to #test-anchor', () => {
    tabsObj.handleOutboundLink('#test-anchor');

    expect(window.location).toEqual(window.location);
  });

  it('Should not have animated bar', () => {
    expect(tabsObj.hasAnimatedBar()).toBeTruthy();
  });

  it('Should not have more button', () => {
    expect(tabsObj.hasMoreButton()).toBeFalsy();
  });

  it('Should have more button at 400px', (done) => {
    tabsEl.style.width = '400px';
    $('body').triggerHandler('resize');

    setTimeout(() => {
      expect(tabsObj.hasMoreButton()).toBeTruthy();
      done();
    }, 300);
  });

  it('Should not be in responsive mode', () => {
    expect(tabsObj.isInResponsiveMode()).toBeFalsy();
  });

  it('Should not have module tabs', () => {
    expect(tabsObj.isModuleTabs()).toBeFalsy();
  });

  it('Should not have vertical tabs', () => {
    expect(tabsObj.isVerticalTabs()).toBeFalsy();
  });

  it('Should not have header tabs', () => {
    expect(tabsObj.isHeaderTabs()).toBeFalsy();
  });

  it('Should have scrollable tab panels', () => {
    expect(tabsObj.isScrollableTabs()).toBeTruthy();
  });

  it('Should not have hidden tabs', () => {
    expect(tabsObj.isHidden()).toBeFalsy();
  });

  it('Should not have nested tabs', () => {
    expect(tabsObj.isNested()).toBeFalsy();
  });

  it('Should have #tabs-normal-attachments as active tab', () => {
    expect(tabsObj.isActive('#tabs-normal-attachments')).toBeTruthy();
  });

  it('Should not have #tabs-normal-contacts as active tab', () => {
    expect(tabsObj.isActive('#tabs-normal-contacts')).toBeFalsy();
  });

  it('Should not be nested in layout tabs', () => {
    expect(tabsObj.isNestedInLayoutTabs()).toBeFalsy();
  });

  it('Should determine if obj is a tab', () => {
    const tabItem = jQuery('.tab.is-selected');
    const tabFirstItem = jQuery('.tab:first');

    expect(tabsObj.isTab(tabItem)).toBeTruthy();
    expect(tabsObj.isTab(tabFirstItem)).toBeTruthy();
  });

  it('Should determine if obj is a not a tab', () => {
    const tabItem = jQuery('body');

    expect(tabsObj.isTab(tabItem)).toBeFalsy();
  });

  it('Should determine if obj is a or anchor', () => {
    const tabItem = jQuery('.tab.is-selected');
    const tabItemAnchor = jQuery('.tab.is-selected a');
    const tabFirstItem = jQuery('.tab:first');

    expect(tabsObj.isAnchor(tabItem)).toBeFalsy();
    expect(tabsObj.isAnchor(tabFirstItem)).toBeFalsy();
    expect(tabsObj.isAnchor(tabItemAnchor)).toBeTruthy();
  });

  it('Should return jQuery anchor of respective tab', () => {
    const tabItemAnchor = jQuery('.tab.is-selected a');

    expect(tabsObj.getAnchor('tabs-normal-attachments')).toEqual(tabItemAnchor);
    expect(tabsObj.getAnchor('#tabs-normal-attachments')).toEqual(tabItemAnchor);
    expect(tabsObj.getAnchor('body').length).toBeFalsy();
  });

  it('Should return jQuery panel of respective tab', () => {
    const tabItemPanel = jQuery('#tabs-normal-attachments');

    expect(tabsObj.getPanel('tabs-normal-attachments')).toEqual(tabItemPanel);
    expect(tabsObj.getPanel('body').length).toBeFalsy();
  });

  it('Should return jQuery previous available tab', () => {
    const tabSecondItem = jQuery('.tab:nth-of-type(2)');
    tabsObj.activate('#tabs-normal-opportunities');

    expect(tabsObj.getPreviousTab('tabs-normal-attachments')).toEqual(tabSecondItem);
  });

  it('Should return jQuery previous tab, and activate it', () => {
    const activatedTabEl = tabsObj.activatePreviousTab('tabs-normal-attachments');

    expect(activatedTabEl).toEqual(jQuery('.tab.is-selected'));
  });

  it('Should activate tab', () => {
    tabsObj.activate('#tabs-normal-contracts');

    expect(document.querySelector('.tab.is-selected').innerText).toEqual('Contracts');
  });

  it('Should activate tab, and return jQuery previous available tab', () => {
    const tabAttachments = jQuery('.tab:nth-of-type(3)');
    tabsObj.activate('#tabs-normal-opportunities');
    tabsObj.activate('#tabs-normal-contacts');

    expect(tabsObj.getPreviousTab('#tabs-normal-contacts')[0]).toEqual(tabAttachments[0]);
  });

  it('Should fetch content that will display inside a tab, return a promise', () => {
    const href = 'http://localhost:9876';
    const tabone = jQuery('.tab:nth-of-type(1)');
    const externalRes = tabsObj.callSource(href, tabone, true);

    expect(externalRes).toEqual(jasmine.any(Object));
  });

  it('Should not fetch content, and should return false', () => {
    const localRes = tabsObj.callSource();

    expect(localRes).toBeFalsy();
  });

  it('Should add new tab', () => {
    const tab = tabsObj.add();

    expect(tab).toEqual(jasmine.any(Object));
  });

  it('Should add new tab and strip markup', () => {
    const settingsObj = {
      name: '<img src="404" onerror="(function() { alert()})()" />',
      content: 'Stuff',
      isDismissible: true
    };

    const tab = tabsObj.add('tabs-normal-tags', settingsObj, 1);

    expect(tab.anchors.length).toEqual(6);
    expect(tab.element[0].querySelectorAll('.tab')[1].innerText).toEqual('<img src="404" onerror="(function() { alert()})()" />');
    expect(tab.container[0].querySelector('#tabs-normal-tags').innerText).toEqual('Stuff');
  });

  it('Should add new tab and strip markup leaving the text', () => {
    const settingsObj = {
      name: '<b>Name</b>',
      content: 'Stuff',
      isDismissible: true
    };

    const tab = tabsObj.add('tabs-normal-tags', settingsObj, 1);

    expect(tab.anchors.length).toEqual(6);
    expect(tab.element[0].querySelectorAll('.tab')[1].innerText).toEqual('<b>Name</b>');
    expect(tab.container[0].querySelector('#tabs-normal-tags').innerText).toEqual('Stuff');
  });

  it('Should allow text in brackets', () => {
    const settingsObj = {
      name: '<Online>',
      content: 'Stuff',
      isDismissible: true
    };

    const tab = tabsObj.add('tabs-normal-tags', settingsObj, 1);

    expect(tab.anchors.length).toEqual(6);
    expect(tab.element[0].querySelectorAll('.tab')[1].innerText).toEqual('<Online>');
    expect(tab.container[0].querySelector('#tabs-normal-tags').innerText).toEqual('Stuff');
  });

  it('Should add new tab, and set tab name', () => {
    const tab = tabsObj.add('tabs-normal-weird', { name: 'weird', content: 'Weirdness' }, 1);

    expect(tab.anchors.length).toEqual(6);
    expect(tab.element[0].querySelectorAll('.tab')[1].innerText).toEqual('weird');
    expect(tab.container[0].querySelector('#tabs-normal-weird').innerText).toEqual('Weirdness');
  });

  it('Should add new tab, and remove tab', () => {
    tabsObj.add('tabs-normal-weird', { name: 'weird', content: 'Weirdness' }, 1);
    const removeTabInstance = tabsObj.remove('tabs-normal-weird', { name: 'weird', content: 'Weirdness' }, 1);

    expect(removeTabInstance.anchors.length).toEqual(5);
    expect(removeTabInstance.element[0].querySelectorAll('.tab')[1].innerText).toEqual('Opportunities');
  });

  it('Should add new tab panel', () => {
    const tab = tabsObj.add('tabs-normal-weird', { name: 'weird', content: 'Weirdness' }, 1);

    expect(tab).toEqual(jasmine.any(Object));
    expect(tab.anchors.length).toEqual(6);
    expect(tab.element[0].querySelectorAll('.tab')[1].innerText).toEqual('weird');
    expect(tab.container[0].querySelector('#tabs-normal-weird').innerText).toEqual('Weirdness');
    const createTab = tabsObj.createTabPanel('new-tabs-normal-weird', 'New Weirdness', true);

    expect(createTab[0].innerText).toEqual('New Weirdness');
  });

  it('Can add automation ids to Tabs', () => {
    const settingsObj = {
      name: 'My New Tab',
      content: '<p>New Tab Content</p>'
    };

    tabsObj.add('my-new-tab', settingsObj);
    const newTab = tabsObj.anchors[5];
    const newPanel = tabsObj.panels[5];

    expect(newTab.getAttribute('data-automation-id')).toEqual('tabs-test-my-new-tab-a');
    expect(newPanel.getAttribute('data-automation-id')).toEqual('tabs-test-my-new-tab-panel');
  });

  it('Should hide tab', () => {
    const tab = tabsObj.hide(null, 'tabs-normal-contracts');
    const hiddenTab = document.querySelectorAll('.tab')[0];

    expect(tab).toEqual(jasmine.any(Object));
    expect(hiddenTab.innerText.trim()).toEqual('Contracts');
    expect(hiddenTab.classList).toContain('hidden');
  });

  it('Should show tab', () => {
    const hideTab = tabsObj.hide(null, 'tabs-normal-contracts');
    const hiddenTab = document.querySelectorAll('.tab')[0];

    expect(hideTab).toEqual(jasmine.any(Object));
    expect(hiddenTab.innerText.trim()).toEqual('Contracts');
    expect(hiddenTab.classList).toContain('hidden');

    const showTab = tabsObj.show(null, 'tabs-normal-contracts');

    expect(showTab).toEqual(jasmine.any(Object));
    expect(hiddenTab.classList).not.toContain('hidden');
  });

  it('Should disable tab', () => {
    const tab = tabsObj.disableTab(null, 'tabs-normal-contracts');

    expect(tab).toEqual(jasmine.any(Object));
    expect(document.querySelectorAll('.tab')[0].innerText).toEqual('Contracts');
    expect(document.querySelectorAll('.tab')[0].classList).toContain('is-disabled');
  });

  it('Should enable tab', () => {
    const disableTab = tabsObj.disableTab(null, 'tabs-normal-contracts');

    expect(disableTab).toEqual(jasmine.any(Object));
    expect(document.querySelectorAll('.tab')[0].classList).toContain('is-disabled');
    const enableTab = tabsObj.enableTab(null, 'tabs-normal-contracts');

    expect(enableTab).toEqual(jasmine.any(Object));
    expect(document.querySelectorAll('.tab')[0].classList).not.toContain('is-disabled');
  });

  it('Should rename tab', () => {
    tabsObj.rename(null, 'tabs-normal-contracts', 'Renamed');

    expect(document.querySelectorAll('.tab')[0].innerText).toEqual('Renamed');
  });

  it('Should return active tab', () => {
    const firstTab = tabsObj.getActiveTab();

    expect(document.querySelectorAll('.tab')[2].classList).toContain('is-selected');
    expect(document.querySelectorAll('[aria-selected="true"]')).toEqual(firstTab[0]);
    tabsObj.activate('#tabs-normal-opportunities');
    const secondTab = tabsObj.getActiveTab();

    expect(document.querySelectorAll('[aria-selected="true"]')).toEqual(secondTab[0]);
    expect(document.querySelectorAll('.tab')[1].classList).toContain('is-selected');
  });

  it('Should return all visible tabs', () => {
    tabsObj.disableTab(null, 'tabs-normal-contracts');
    const allVisibleTabs = tabsObj.getVisibleTabs();

    expect(allVisibleTabs).toEqual(jasmine.any(Object));
    expect(allVisibleTabs.length).toEqual(4);
  });

  it('Should not return overflowed tabs at 300px', (done) => {
    tabsEl.style.width = '300px';
    $('body').triggerHandler('resize');
    const tab = tabsObj.getOverflowTabs();

    setTimeout(() => {
      expect(tab.length).toBeFalsy();
      done();
    }, 300);
  });

  it('Should select tab, and focus', () => {
    tabsObj.select('#tabs-normal-contracts');

    expect(document.querySelector('.tab.is-selected').innerText).toEqual('Contracts');
  });

  it('Should return false whether tabs are overflowed at 300px', (done) => {
    tabsEl.style.width = '300px';
    $('body').triggerHandler('resize');
    const tabItem = document.querySelectorAll('[aria-selected="true"]');

    setTimeout(() => {
      expect(tabsObj.isTabOverflowed($(tabItem))).toBeFalsy();
      done();
    }, 300);
  });

  it('Should return last visible tabs', () => {
    const tab = tabsObj.findLastVisibleTab();

    expect(tab).toEqual(jasmine.any(Object));
    expect(tab[0].innerText).toEqual('Notes');
  });

  it('Should set focus on first visible tabs', () => {
    tabsObj.focusFirstVisibleTab();

    expect(document.querySelector('.tab a')).toEqual(document.activeElement);
  });

  it('Should set focus the bar on tab', () => {
    tabsObj.focusBar($(document.querySelector('.tab a')));

    expect(parseInt(document.querySelector('.animated-bar').style.left, 10)).toBeCloseTo(0, 1);
  });

  it('Should defocus the bar on tab', () => {
    tabsObj.focusBar($(document.querySelector('.tab a')));
    tabsObj.defocusBar();

    expect(parseInt(document.querySelector('.animated-bar').style.width, 10)).toBeCloseTo(0, 1);
  });

  it('Should disable all tabs except selected tab', () => {
    tabsObj.disableOtherTabs();

    expect(document.querySelectorAll('.tab')[0].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[1].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[2].classList).toContain('is-selected');
    expect(document.querySelectorAll('.tab')[3].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[4].classList).toContain('is-disabled');
  });

  it('Should disable all tabs except selected tab using "disable" method', () => {
    tabsObj.disable();

    expect(document.querySelectorAll('.tab')[0].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[1].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[2].classList).toContain('is-selected');
    expect(document.querySelectorAll('.tab')[3].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[4].classList).toContain('is-disabled');
  });

  it('Should disable all tabs', () => {
    tabsObj.disable(false);

    expect(document.querySelectorAll('.tab')[0].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[1].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[2].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[3].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[4].classList).toContain('is-disabled');
  });

  it('Should enable all tabs', (done) => {
    tabsObj.disable(false);

    expect(document.querySelectorAll('.tab')[0].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[1].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[2].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[3].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[4].classList).toContain('is-disabled');
    tabsObj.enable();

    setTimeout(() => {
      expect(document.querySelectorAll('.tab')[0].classList).not.toContain('is-disabled');
      expect(document.querySelectorAll('.tab')[1].classList).not.toContain('is-disabled');
      expect(document.querySelectorAll('.tab')[2].classList).not.toContain('is-disabled');
      expect(document.querySelectorAll('.tab')[3].classList).not.toContain('is-disabled');
      expect(document.querySelectorAll('.tab')[4].classList).not.toContain('is-disabled');
      done();
    }, 300);
  });

  it('Should remove tab dismissible tab from tab list', () => {
    const tabs = tabsObj.closeDismissibleTab('tabs-normal-attachments');

    expect(tabs).toEqual(jasmine.any(Object));
    expect(tabs.anchors.length).toEqual(4);
    expect(document.querySelectorAll('.tab')[2].innerText).toEqual('Contacts');
  });

  it('Should remove tab with dropdown of dismissible tabs', () => {
    const testHrefs = ['#tabs-normal-attachments', '#tabs-normal-contacts', '#tabs-normal-notes'];
    tabsObj.closeDismissibleTabs(testHrefs);

    expect(document.querySelectorAll('.tab')[1].innerText).toEqual('Opportunities');
  });

  it('Should teardown tabs', (done) => {
    const tabs = tabsObj.teardown();
    setTimeout(() => {
      expect(tabs).toEqual(jasmine.any(Object));
      expect(document.querySelectorAll('.tab')[2].classList).not.toContain('is-selected');
      expect(document.querySelectorAll('.tab a[aria-expanded="true"]').length).toEqual(0);
      expect(document.querySelectorAll('.tab a[aria-selected="true"]').length).toEqual(0);
      // Teardown interferes with afterEach script, so we restore Tabs instance
      tabsObj = new Tabs(tabsEl);
      done();
    }, 100);
  });

  it('Should destroy tabs', (done) => {
    tabsObj.destroy();
    const empty = {};
    setTimeout(() => {
      expect(document.querySelectorAll('.tab')[2].classList).not.toContain('is-selected');
      expect(document.querySelectorAll('.tab a[aria-expanded="true"]').length).toEqual(0);
      expect(document.querySelectorAll('.tab a[aria-selected="true"]').length).toEqual(0);
      expect(tabsObj.element.data()).toEqual(empty);
      // Teardown interferes with afterEach script, so we restore Tabs instance
      tabsObj = new Tabs(tabsEl);
      done();
    }, 100);
  });
});
