/**
 * @jest-environment jsdom
 */
import { Tabs } from '../../../src/components/tabs/tabs';
import { cleanup } from '../../helpers/func-utils';

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
</div>`;

let tabsEl;
let tabsObj;

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

describe('Tabs Settings', () => {
  beforeEach(() => {
    tabsEl = null;
    tabsObj = null;
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
