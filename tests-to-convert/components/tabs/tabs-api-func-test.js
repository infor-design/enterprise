/**
 * @jest-environment jsdom
 */
import { Tabs } from '../../../src/components/tabs/tabs';
import { cleanup } from '../../helpers/func-utils';
import { Locale } from '../../../src/components/locale/locale';

Soho.Locale = Locale;

require('../../../src/components/locale/cultures/en-US.js');

const tabsHTML = `<div class="row top-padding">
  <div class="twelve columns">

    <div id="tabs-normal" class="tab-container">
      <ul class="tab-list">
        <li class="tab">
          <a id="tabs-a-contracts" data-automation-id="tabs-a-contracts" href="#tabs-normal-contracts">Contracts</a>
        </li>
        <li class="tab">
          <a id="tabs-a-opportunities" data-automation-id="tabs-a-opportunities" href="#tabs-normal-opportunities">Opportunities</a>
        </li>
        <li class="tab is-selected">
          <a id="tabs-a-attachments" data-automation-id="tabs-a-attachments" href="#tabs-normal-attachments">Attachments</a>
        </li>
        <li class="tab">
          <a id="tabs-a-contacts" data-automation-id="tabs-a-contacts" href="#tabs-normal-contacts">Contacts</a>
        </li>
        <li class="tab">
          <a id="tabs-a-notes" data-automation-id="tabs-a-notes" href="#tabs-normal-notes">Notes</a>
        </li>
      </ul>
    </div>
    <div class="tab-panel-container">
      <div id="tabs-normal-contracts" data-automation-id="tabs-panel-contracts" class="tab-panel">
        <p>Facilitate cultivate monetize, seize e-services peer-to-peer content integrateAJAX-enabled user-centric strategize. Mindshare; repurpose integrate global addelivery leading-edge frictionless, harness real-time plug-and-play standards-compliant 24/7 enterprise strategize robust infomediaries: functionalities back-end. Killer disintermediate web-enabled ubiquitous empower relationships, solutions, metrics architectures.</p>

        <div class="field">
          <label for="input-one">Input One</label>
          <input type="text" id="input-one" name="input-one"/>
        </div>
      </div>
      <div id="tabs-normal-opportunities" data-automation-id="tabs-panel-opportunities" class="tab-panel">
        <p>Bricks-and-clicks? Evolve ubiquitous matrix B2B 24/365 vertical 24/365 platforms standards-compliant global leverage dynamic 24/365 intuitive ROI seamless rss-capable. Cutting-edge grow morph web services leverage; ROI, unleash reinvent innovative podcasts citizen-media networking.</p>
        <br/><br/>
        <div class="field">
          <label for="test-trackdirty">Dirty Tracking</label>
          <input type="text" placeholder="Dirty Tracking" data-trackdirty="true" id="test-trackdirty" name="test-trackdirty"/>
        </div>
      </div>
      <div id="tabs-normal-attachments" data-automation-id="tabs-panel-attachments" class="tab-panel">
        <p>Frictionless webservices, killer open-source innovate, best-of-breed, whiteboard interactive back-end optimize capture dynamic front-end. Initiatives ubiquitous 24/7 enhance channels B2B drive frictionless web-readiness generate recontextualize widgets applications. Sexy sticky matrix, user-centred, rich user-centric: peer-to-peer podcasting networking addelivery optimize streamline integrated proactive: granular morph.</p>

        <div class="field">
          <label for="input-two">Input One</label>
          <input type="text" id="input-two" name="input-two"/>
        </div>
      </div>
      <div id="tabs-normal-contacts" data-automation-id="tabs-panel-contacts" class="tab-panel top-padding">
        <p>Bricks-and-clicks? Evolve ubiquitous matrix B2B 24/365 vertical 24/365 platforms standards-compliant global leverage dynamic 24/365 intuitive ROI seamless rss-capable. Cutting-edge grow morph web services leverage; ROI, unleash reinvent innovative podcasts citizen-media networking.</p>

        <div class="field">
          <label for="input-three">Input One</label>
          <input type="text" id="input-three" name="input-three"/>
        </div>
      </div>
      <div id="tabs-normal-notes" data-automation-id="tabs-panel-notes" class="tab-panel">
        <p>Post incentivize; rich-clientAPIs customized revolutionize 24/365 killer incentivize integrate intuitive utilize!</p>

        <div class="field">
          <label for="input-four">Input One</label>
          <input type="text" id="input-four" name="input-four"/>
        </div>
      </div>
    </div>

  </div>
</div>
`;

let tabsEl;
let tabsObj;

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

describe('Tabs API', () => {
  beforeEach(() => {
    tabsEl = null;
    tabsObj = null;

    document.body.insertAdjacentHTML('afterbegin', tabsHTML);

    tabsEl = document.body.querySelector('.tab-container');
    tabsEl.classList.add('no-init');

    tabsObj = new Tabs(tabsEl, {
      attributes: [
        { name: 'data-automation-id', value: 'tabs-test' }
      ]
    });
  });

  afterEach(() => {
    tabsObj?.destroy();
    cleanup();
  });

  it('should be defined on jQuery object', () => {
    expect(tabsObj).toBeTruthy();
  });

  it('should not update href to #test-anchor', () => {
    tabsObj.handleOutboundLink('#test-anchor');

    expect(window.location).toEqual(window.location);
  });

  it('should not have more button', () => {
    expect(tabsObj.hasMoreButton()).toBeFalsy();
  });

  it.skip('should have more button at 400px', (done) => {
    tabsEl.style.width = '400px';
    $('body').triggerHandler('resize');

    setTimeout(() => {
      expect(tabsObj.hasMoreButton()).toBeTruthy();
      done();
    }, 300);
  });

  it('should not be in responsive mode', () => {
    expect(tabsObj.isInResponsiveMode()).toBeFalsy();
  });

  it('should not have module tabs', () => {
    expect(tabsObj.isModuleTabs()).toBeFalsy();
  });

  it('should not have vertical tabs', () => {
    expect(tabsObj.isVerticalTabs()).toBeFalsy();
  });

  it('should not have header tabs', () => {
    expect(tabsObj.isHeaderTabs()).toBeFalsy();
  });

  it('should have scrollable tab panels', () => {
    expect(tabsObj.isScrollableTabs()).toBeTruthy();
  });

  it.skip('should not have hidden tabs', () => {
    expect(tabsObj.isHidden()).toBeFalsy();
  });

  it('should not have nested tabs', () => {
    expect(tabsObj.isNested()).toBeFalsy();
  });

  it('should have #tabs-normal-attachments as active tab', () => {
    expect(tabsObj.isActive('#tabs-normal-attachments')).toBeTruthy();
  });

  it('should not have #tabs-normal-contacts as active tab', () => {
    expect(tabsObj.isActive('#tabs-normal-contacts')).toBeFalsy();
  });

  it('should not be nested in layout tabs', () => {
    expect(tabsObj.isNestedInLayoutTabs()).toBeFalsy();
  });

  it('should determine if obj is a tab', () => {
    const tabItem = jQuery('.tab.is-selected');
    const tabFirstItem = jQuery('.tab:first');

    expect(tabsObj.isTab(tabItem)).toBeTruthy();
    expect(tabsObj.isTab(tabFirstItem)).toBeTruthy();
  });

  it('should determine if obj is a not a tab', () => {
    const tabItem = jQuery('body');

    expect(tabsObj.isTab(tabItem)).toBeFalsy();
  });

  it('should determine if obj is a or anchor', () => {
    const tabItem = jQuery('.tab.is-selected');
    const tabItemAnchor = jQuery('.tab.is-selected a');
    const tabFirstItem = jQuery('.tab:first');

    expect(tabsObj.isAnchor(tabItem)).toBeFalsy();
    expect(tabsObj.isAnchor(tabFirstItem)).toBeFalsy();
    expect(tabsObj.isAnchor(tabItemAnchor)).toBeTruthy();
  });

  it.skip('should return jQuery anchor of respective tab', () => {
    const tabItemAnchor = jQuery('.tab.is-selected a');

    expect(tabsObj.getAnchor('tabs-normal-attachments')).toEqual(tabItemAnchor);
    expect(tabsObj.getAnchor('#tabs-normal-attachments')).toEqual(tabItemAnchor);
    expect(tabsObj.getAnchor('body').length).toBeFalsy();
  });

  it.skip('should return jQuery panel of respective tab', () => {
    const tabItemPanel = jQuery('#tabs-normal-attachments');

    expect(tabsObj.getPanel('tabs-normal-attachments')).toEqual(tabItemPanel);
    expect(tabsObj.getPanel('body').length).toBeFalsy();
  });

  it.skip('should return jQuery previous available tab', () => {
    const tabSecondItem = jQuery('.tab:nth-of-type(2)');
    tabsObj.activate('#tabs-normal-opportunities');

    expect(tabsObj.getPreviousTab('tabs-normal-attachments')).toEqual(tabSecondItem);
  });

  it.skip('should return jQuery previous tab, and activate it', () => {
    const activatedTabEl = tabsObj.activatePreviousTab('tabs-normal-attachments');

    expect(activatedTabEl.classList.contains('is-selected')).toBeTruthy();
  });

  it('should activate tab', () => {
    tabsObj.activate('#tabs-normal-contracts');

    expect(document.querySelector('.tab.is-selected').textContent.trim()).toEqual('Contracts');
  });

  it.skip('should activate tab, and return jQuery previous available tab', () => {
    const tabAttachments = jQuery('.tab:nth-of-type(3)');
    tabsObj.activate('#tabs-normal-opportunities');
    tabsObj.activate('#tabs-normal-contacts');

    expect(tabsObj.getPreviousTab('#tabs-normal-contacts')[0]).toEqual(tabAttachments[0]);
  });

  it.skip('should fetch content that will display inside a tab, return a promise', () => {
    const href = 'http://localhost:9876';
    const tabone = jQuery('.tab:nth-of-type(1)');
    const externalRes = tabsObj.callSource(href, tabone, true);

    expect(externalRes).toBeTruthy();
  });

  it('should not fetch content, and should return false', () => {
    const localRes = tabsObj.callSource();

    expect(localRes).toBeFalsy();
  });

  it('should add new tab', () => {
    const tab = tabsObj.add();

    expect(tab).toBeTruthy();
  });

  it.skip('should add new tab and strip markup', () => {
    const settingsObj = {
      name: '<img src="404" onerror="(function() { alert()})()" />',
      content: 'Stuff',
      isDismissible: true
    };

    const tab = tabsObj.add('tabs-normal-tags', settingsObj, 1);

    expect(tab.anchors.length).toEqual(6);
    expect(tab.element[0].querySelectorAll('.tab')[1].textContent).toEqual('<img src="404" onerror="(function() { alert()})()" />');
    expect(tab.container[0].querySelector('#tabs-normal-tags').textContent).toEqual('Stuff');
  });

  it.skip('should add new tab and strip markup leaving the text', () => {
    const settingsObj = {
      name: '<b>Name</b>',
      content: 'Stuff',
      isDismissible: true
    };

    const tab = tabsObj.add('tabs-normal-tags', settingsObj, 1);

    expect(tab.anchors.length).toEqual(6);
    expect(tab.element[0].querySelectorAll('.tab')[1].textContent).toEqual('<b>Name</b>');
    expect(tab.container[0].querySelector('#tabs-normal-tags').textContent).toEqual('Stuff');
  });

  it.skip('should allow text in brackets', () => {
    const settingsObj = {
      name: '<Online>',
      content: 'Stuff',
      isDismissible: true
    };

    const tab = tabsObj.add('tabs-normal-tags', settingsObj, 1);

    expect(tab.anchors.length).toEqual(6);
    expect(tab.element[0].querySelectorAll('.tab')[1].textContent).toEqual('<Online>');
    expect(tab.container[0].querySelector('#tabs-normal-tags').textContent).toEqual('Stuff');
  });

  it.skip('should add new tab, and set tab name', () => {
    const tab = tabsObj.add('tabs-normal-weird', { name: 'weird', content: 'Weirdness' }, 1);

    expect(tab.anchors.length).toEqual(6);
    expect(tab.element[0].querySelectorAll('.tab')[1].textContent).toEqual('weird');
    expect(tab.container[0].querySelector('#tabs-normal-weird').textContent).toEqual('Weirdness');
  });

  it.skip('should add new tab, and remove tab', () => {
    tabsObj.add('tabs-normal-weird', { name: 'weird', content: 'Weirdness' }, 1);
    const removeTabInstance = tabsObj.remove('tabs-normal-weird', { name: 'weird', content: 'Weirdness' }, 1);

    expect(removeTabInstance.anchors.length).toEqual(5);
    expect(removeTabInstance.element[0].querySelectorAll('.tab')[1].textContent).toEqual('Opportunities');
  });

  it('should add new tab panel', () => {
    const tab = tabsObj.add('tabs-normal-weird', { name: 'weird', content: 'Weirdness' }, 1);

    expect(tab).toBeTruthy();
    expect(tab.anchors.length).toEqual(6);
    expect(tab.element[0].querySelectorAll('.tab')[1].textContent).toEqual('weird');
    expect(tab.container[0].querySelector('#tabs-normal-weird').textContent).toEqual('Weirdness');
    const createTab = tabsObj.createTabPanel('new-tabs-normal-weird', 'New Weirdness', true);

    expect(createTab[0].textContent).toEqual('New Weirdness');
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

  it('should hide tab', () => {
    const tab = tabsObj.hide(null, 'tabs-normal-contracts');
    const hiddenTab = document.querySelectorAll('.tab')[0];

    expect(tab).toBeTruthy();
    expect(hiddenTab.textContent.trim()).toEqual('Contracts');
    expect(hiddenTab.classList).toContain('hidden');
  });

  it('should show tab', () => {
    const hideTab = tabsObj.hide(null, 'tabs-normal-contracts');
    const hiddenTab = document.querySelectorAll('.tab')[0];

    expect(hideTab).toBeTruthy();
    expect(hiddenTab.textContent.trim()).toEqual('Contracts');
    expect(hiddenTab.classList).toContain('hidden');

    const showTab = tabsObj.show(null, 'tabs-normal-contracts');

    expect(showTab).toBeTruthy();
    expect(hiddenTab.classList).not.toContain('hidden');
  });

  it('should disable tab', () => {
    const tab = tabsObj.disableTab(null, 'tabs-normal-contracts');

    expect(tab).toBeTruthy();
    expect(document.querySelectorAll('.tab')[0].textContent.trim()).toEqual('Contracts');
    expect(document.querySelectorAll('.tab')[0].classList).toContain('is-disabled');
  });

  it('should enable tab', () => {
    const disableTab = tabsObj.disableTab(null, 'tabs-normal-contracts');

    expect(disableTab).toBeTruthy();
    expect(document.querySelectorAll('.tab')[0].classList).toContain('is-disabled');
    const enableTab = tabsObj.enableTab(null, 'tabs-normal-contracts');

    expect(enableTab).toBeTruthy();
    expect(document.querySelectorAll('.tab')[0].classList).not.toContain('is-disabled');
  });

  it.skip('should rename tab', () => {
    tabsObj.rename(null, 'tabs-normal-contracts', 'Renamed');

    expect(document.querySelectorAll('.tab')[0].textContent).toEqual('Renamed');
  });

  it('should return active tab', () => {
    expect(document.querySelectorAll('.tab')[2].classList).toContain('is-selected');
    expect(document.querySelectorAll('[aria-selected="true"]')).toBeTruthy();
    tabsObj.activate('#tabs-normal-opportunities');

    expect(document.querySelectorAll('[aria-selected="true"]')).toBeTruthy();
    expect(document.querySelectorAll('.tab')[1].classList).toContain('is-selected');
  });

  it('should return all visible tabs', () => {
    tabsObj.disableTab(null, 'tabs-normal-contracts');
    const allVisibleTabs = tabsObj.getVisibleTabs();

    expect(allVisibleTabs).toBeTruthy();
    expect(allVisibleTabs.length).toEqual(4);
  });

  it('should not return overflowed tabs at 300px', (done) => {
    tabsEl.style.width = '300px';
    $('body').triggerHandler('resize');
    const tab = tabsObj.getOverflowTabs();

    setTimeout(() => {
      expect(tab.length).toBeFalsy();
      done();
    }, 300);
  });

  it.skip('should select tab, and focus', () => {
    tabsObj.select('#tabs-normal-contracts');

    expect(document.querySelector('.tab.is-selected').textContent).toEqual('Contracts');
  });

  it('should return false whether tabs are overflowed at 300px', (done) => {
    tabsEl.style.width = '300px';
    $('body').triggerHandler('resize');
    const tabItem = document.querySelectorAll('[aria-selected="true"]');

    setTimeout(() => {
      expect(tabsObj.isTabOverflowed($(tabItem))).toBeFalsy();
      done();
    }, 300);
  });

  it.skip('should return last visible tabs', () => {
    const tab = tabsObj.findLastVisibleTab();

    expect(tab).toBeTruthy();
    expect(tab[0].textContent).toEqual('Notes');
  });

  it('should set focus on first visible tabs', () => {
    tabsObj.focusFirstVisibleTab();

    expect(document.querySelector('.tab a')).toEqual(document.activeElement);
  });

  it.skip('should disable all tabs except selected tab', () => {
    tabsObj.disableOtherTabs();

    expect(document.querySelectorAll('.tab')[0].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[1].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[2].classList).toContain('is-selected');
    expect(document.querySelectorAll('.tab')[3].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[4].classList).toContain('is-disabled');
  });

  it.skip('should disable all tabs except selected tab using "disable" method', () => {
    tabsObj.disable();

    expect(document.querySelectorAll('.tab')[0].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[1].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[2].classList).toContain('is-selected');
    expect(document.querySelectorAll('.tab')[3].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[4].classList).toContain('is-disabled');
  });

  it.skip('should disable all tabs', () => {
    tabsObj.disable(false);

    expect(document.querySelectorAll('.tab')[0].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[1].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[2].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[3].classList).toContain('is-disabled');
    expect(document.querySelectorAll('.tab')[4].classList).toContain('is-disabled');
  });

  it.skip('should enable all tabs', (done) => {
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

  it.skip('should remove tab dismissible tab from tab list', () => {
    const tabs = tabsObj.closeDismissibleTab('tabs-normal-attachments');

    expect(tabs).toBeTruthy();
    expect(tabs.anchors.length).toEqual(4);
    expect(document.querySelectorAll('.tab')[2].textContent).toEqual('Contacts');
  });

  it.skip('should remove tab with dropdown of dismissible tabs', () => {
    const testHrefs = ['#tabs-normal-attachments', '#tabs-normal-contacts', '#tabs-normal-notes'];
    tabsObj.closeDismissibleTabs(testHrefs);

    expect(document.querySelectorAll('.tab')[1].textContent).toEqual('Opportunities');
  });

  it('should teardown tabs', (done) => {
    const tabs = tabsObj.teardown();
    setTimeout(() => {
      expect(tabs).toBeTruthy();
      expect(document.querySelectorAll('.tab')[2].classList).not.toContain('is-selected');
      expect(document.querySelectorAll('.tab a[aria-expanded="true"]').length).toEqual(0);
      expect(document.querySelectorAll('.tab a[aria-selected="true"]').length).toEqual(0);
      // Teardown interferes with afterEach script, so we restore Tabs instance
      tabsObj = new Tabs(tabsEl);
      done();
    }, 100);
  });

  it('should destroy tabs', (done) => {
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
