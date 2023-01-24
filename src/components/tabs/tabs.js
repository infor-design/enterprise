import * as debug from '../../utils/debug';
import { utils, math } from '../../utils/utils';
import { Environment as env } from '../../utils/environment';
import { xssUtils } from '../../utils/xss';
import { DOM } from '../../utils/dom';
import { breakpoints } from '../../utils/breakpoints';
import { stringUtils } from '../../utils/string';
import { renderLoop, RenderLoopItem } from '../../utils/renderloop';
import { Locale } from '../locale/locale';

// jQuery components
import '../../utils/lifecycle/lifecycle.jquery';
import '../icons/icons.jquery';
import '../popupmenu/popupmenu.jquery';
import '../tooltip/tooltip.jquery';

// Component Name
const COMPONENT_NAME = 'tabs';

// Types of possible Tab containers
const tabContainerTypes = ['horizontal', 'vertical', 'module-tabs', 'header-tabs'];

/**
 * @class Tabs
 * @constructor
 * @param {HTMLElement|jQuery[]} element the base element for this component
 * @param {object} settings incoming settings
 *
 * @param {boolean} [settings.addTabButton=false] If set to true, creates a button at the end
 * of the tab list that can be used to add an empty tab and panel
 * @param {function} [settings.addTabButtonCallback=null] if defined as a function, will
 * be used in-place of the default Tab Adding method
 * @param {boolean} [settings.addTabButtonTooltip=false] If set to true, adds tooltip on add tab button
 * @param {boolean} [settings.appMenuTrigger=false] If set to true, will force an App Menu
 * trigger to be present on Non-Vertical Tabs implementatations.
 * @param {string} [settings.appMenuTriggerText] If defined, replaces the default "Menu" text used
 * in the app menu trigger.
 * @param {boolean} [settings.appMenuTriggerTextAudible = false] if true, causes an app menu trigger's
 * text content to be visually hidden (but still exists for accessiblity purposes)
 * @param {object} [settings.ajaxOptions] if defined, will be used by any internal
 * Tabs AJAX calls as the desired request settings.
 * @param {function} [settings.beforeActivate] If defined as a function, fires
 * this before a tab is activated to allow a possible "veto" of the tab swap (SOHO-5250).
 * @param {string|jQuery} [settings.containerElement=null] Defines a separate element
 * to be used for containing the tab panels.  Defaults to a `.tab-panel-container`
 * element that is created if it doesn't already exist.
 * @param {boolean} [settings.changeTabOnHashChange=false] If true, will change the selected
 * tab on invocation based on the URL that exists after the hash.
 * @param {function} [settings.hashChangeCallback=null] If defined as a function,
 * provides an external method for adjusting the current page hash used by these tabs.
 * @param {boolean} [settings.lazyLoad=true] if true, when using full URLs in tab HREFs,
 * or when using Ajax calls, tabs will be loaded as needed instead of the markup
 * all being established at once.
 * @param {boolean} [settings.moduleTabsTooltips=false] if true, will display a tooltip on
 * Module Tabs with cut-off text content.
 * @param {boolean} [settings.multiTabsTooltips=false] if true, will display a tooltip on
 * Multi Tabs with cut-off text content.
 * @param {string} [settings.countsPosition] If defined, it will display the position of counts.
 * @param {function} [settings.source=null] If defined, will serve as a way of pulling
 * in external content to fill tabs.
 * @param {object} [settings.sourceArguments={}] If a source method is defined, this
 * flexible object can be passed into the source method, and augmented with
 * parameters specific to the implementation.
 * @param {boolean} [settings.tabCounts=false] If true, Displays a modifiable count above each tab.
 * @param {boolean} [settings.verticalResponsive=false] If Vertical Tabs & true, will automatically
 * switch to Horizontal Tabs on smaller breakpoints.
 * @param {Array} [settings.attributes=null] If set, adds additional attributes to some tabs and elements.
 * @param {boolean} [settings.sortable=false] If true, tabs can be sortable by drag and drop.
 */
const TABS_DEFAULTS = {
  addTabButton: false,
  addTabButtonCallback: null,
  addTabButtonTooltip: false,
  appMenuTrigger: false,
  appMenuTriggerText: undefined,
  appMenuTriggerTextAudible: false,
  ajaxOptions: null,
  beforeActivate: undefined,
  containerElement: null,
  changeTabOnHashChange: false,
  hashChangeCallback: null,
  lazyLoad: true,
  moduleTabsTooltips: false,
  multiTabsTooltips: false,
  countsPosition: undefined,
  source: null,
  sourceArguments: {},
  tabCounts: false,
  verticalResponsive: false,
  attributes: null,
  sortable: false
};

function Tabs(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, TABS_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

Tabs.prototype = {

  /**
   * @private
   * @returns {this} component instance
   */
  init() {
    return this
      .setup()
      .build()
      .setupEvents();
  },

  /**
   * @private
   * @returns {this} component instance
   */
  setup() {
    // Used by the $(body).resize event to correctly identify the tabs container element
    this.tabsIndex = $('.tab-container').index(this.element);
    this.settings.multiTabsTooltips = this.element.closest('.multitabs-container').length > 0;
    return this;
  },

  /**
   * @private
   * @returns {this} component instance
   */
  build() {
    const self = this;
    let tabPanelContainer;
    let moveTabPanelContainer = false;
    const localeExemptions = ['en-US', 'de-DE', 'ja-JP', 'zh-CN', 'zh-Hans', 'zh-TW', 'zh-Hant'];

    // Check for a tab panel container immediately after the `.tab-container`
    // element (default as of IDS Enterprise 4.3.0)
    tabPanelContainer = this.element.next('.tab-panel-container');

    // Auto-detect and move existing tab-panel containers in key areas, if applicable.
    // Check inside the container first
    if (!tabPanelContainer.length) {
      tabPanelContainer = this.element.children('.tab-panel-container');

      if (!this.isVerticalTabs()) {
        moveTabPanelContainer = true;
      }
    }

    // Special case for Header Tabs, find the page container and use that as the container
    const bodyPageContainer = $('body > .page-container, .application-menu + .page-container');
    if (this.element.closest('.header').length > 0 && bodyPageContainer.length) {
      tabPanelContainer = bodyPageContainer;
    }

    // Special case for Module Tabs, where it's possible for layout reasons for there to be
    // an application menu element adjacent between the Tab list and the Tab Panel container
    if (this.element.next('.application-menu').length) {
      tabPanelContainer = this.element.next().next('.page-container');
      moveTabPanelContainer = false;
    }

    // Defining `this.settings.containerElement` ultimately overrides any internal
    // changes to the tab panel container.
    if (this.settings.containerElement && $(this.settings.containerElement).length) {
      tabPanelContainer = $(this.settings.containerElement);
      moveTabPanelContainer = false;
    }

    // If a `.tab-panel-container` still doesn't exist, create one.
    if (!tabPanelContainer || !tabPanelContainer.length) {
      tabPanelContainer = $('<div class="tab-panel-container"></div>');
      moveTabPanelContainer = true;
    }

    if (!tabPanelContainer[0].classList.contains('tab-panel-container')) {
      tabPanelContainer[0].classList.add('tab-panel-container');
    }
    if (moveTabPanelContainer) {
      tabPanelContainer.insertAfter(this.element);
    }

    this.container = tabPanelContainer;

    // Detect the existence of a "tab-list-container" element, if applicable.
    // Tab List containers are optional for all tab container types, but mandatory for
    // Composite Form tabs.
    let tablistContainer = this.element.children('.tab-list-container');
    if (!tablistContainer.length && this.isScrollableTabs()) {
      tablistContainer = $('<div class="tab-list-container" tabindex="-1"></div>').prependTo(this.element);
    }
    if (tablistContainer.length) {
      this.tablistContainer = tablistContainer;
    }

    // Add a default tabs class of "horizontal" if it doesn't already exist
    let noClass = true;
    const closestHeader = this.element.closest('.header');
    tabContainerTypes.forEach((val, i) => {
      if (this.element.hasClass(tabContainerTypes[i])) {
        noClass = false;
      }
    });
    if (noClass) {
      if (closestHeader.length) {
        self.element.addClass('header-tabs');
      } else {
        self.element.addClass('horizontal');
      }
    }

    // Build Tab Counts
    if (self.settings.tabCounts) {
      self.element.addClass('has-counts');
    }

    // Attach Tablist role and class to the tab headers container
    this.tablist = this.element.children('.tab-list');
    if (!this.tablist.length) {
      // If we have a `.tab-list-container` element, check that before creating markup
      if (this.tablistContainer) {
        this.tablist = this.tablistContainer.children('.tab-list');
      }

      // Create and append the `.tab-list` if it still doesn't exist.
      if (!this.tablist.length) {
        this.tablist = $('<ul class="tab-list"></ul>');
        if (this.tablistContainer) {
          this.tablist.appendTo(this.tablistContainer);
        } else {
          this.tablist.appendTo(this.element);
        }
      }
    }

    // Double-check that the `.tab-list-container` actually contains the `.tab-list`.
    // Move it if necessary.
    if (this.tablistContainer) {
      if (!this.tablist.parent().is(this.tablistContainer)) {
        this.tablistContainer.append(this.tablist);
      }

      this.tablistContainer.on('mousewheel.tabs', function (e) {
        if (e.deltaY) {
          this.scrollLeft += e.deltaY;
        }
      });
    }

    self.tablist
      .attr({
        class: 'tab-list',
        role: 'tablist'
      });

    // Conditionally Change layout classes if veritcal tabs is in responsive
    // mode, and breakpoints match.
    this.checkResponsive(false);

    // Handle Focus State, Animated Bar, More Button, Add Tabs Button, and
    // App Menu Button.
    this.renderHelperMarkup();

    // for each item in the tabsList...
    self.anchors = self.tablist.children('li:not(.separator)').children('a');
    self.anchors.each(function prepareAnchor() {
      const a = $(this);
      const attrPart = a[0].textContent.toLowerCase().trim().split(' ').join('-');

      a.attr({ role: 'tab', 'aria-selected': 'false', tabindex: '-1' })
        .parent().attr('role', 'tab').addClass('tab');

      let dismissibleIcon;
      if (a.parent().hasClass('dismissible') && !a.parent().children('.icon').length) {
        dismissibleIcon = $.createIconElement({ icon: 'close', classes: 'icon close' });
        dismissibleIcon.insertAfter(a);
      }

      // If attributes are defined, add them to various things
      if (self.settings.attributes) {
        utils.addAttributes(a, self, self.settings.attributes, `${attrPart}-a`);
        if (dismissibleIcon) {
          utils.addAttributes(dismissibleIcon, self, self.settings.attributes, `${attrPart}-close-btn`);
        }
      }

      // Find and configure dropdown tabs
      const dd = a.nextAll('ul').first();
      if (dd.length > 0) {
        dd.addClass('dropdown-tab');
        const li = a.parent();

        li.addClass('has-popupmenu').popupmenu({
          menu: dd,
          trigger: 'click',
          attachToBody: true,
          attributes: self.settings.attributes
        });

        a.removeAttr('role').removeAttr('aria-expanded').removeAttr('aria-selected');

        if (!a.parent().children('.icon.icon-more').length) {
          $.createIconElement({ classes: 'icon-more', icon: 'dropdown' }).insertAfter(a);
        }
      }

      if (self.settings.tabCounts && $(this).find('.count').length === 0) {
        if ((localeExemptions.includes(Locale.currentLocale.name) && self.settings.countsPosition !== 'bottom') || self.settings.countsPosition === 'top') {
          $(this).prepend('<span class="count">0 </span>');
        } else if (self.settings.countsPosition === 'bottom') {
          $(this).append('<span class="count">0 </span>');
        } else {
          $(this).append('<span class="count">0 </span>');
        }
      }

      // Make it possible for Module Tabs to display a tooltip containing their contents
      // if the contents are cut off by ellipsis.
      if (self.settings.moduleTabsTooltips || self.settings.multiTabsTooltips) {
        a.on('beforeshow.toolbar', () => a.data('cutoffTitle') === 'yes').tooltip({
          content: `${a.text().trim()}`
        });
      }
    });

    // Build/manage tab panels
    function associateAnchorWithPanel() {
      const a = $(this);
      const li = a.parent();
      const popup = li.data('popupmenu');
      let panel;

      // Associated the current one
      let href = a.attr('href');

      if (href.substr(0, 1) !== '#') {
        // is an outbound Link
        return;
      }

      if (href.substr(0, 2) === '#/') {
        // uses angular LocationStrategy
        // Just to find the panel but these are handled by angular
        href = href.replace('#/', '#');
      }

      if (href !== undefined && href !== '#') {
        href = href.replace(/\//g, '\\/');
        panel = $(href);

        if (li.is(':not(.has-popupmenu)') && !panel.length) {
          return;
        }

        if (self.settings.attributes) {
          const attrPart = a[0].textContent.toLowerCase().trim().split(' ').join('-');
          utils.addAttributes(panel, self, self.settings.attributes, `${attrPart}-panel`);
        }

        a.data('panel-link', panel);
        panel.data('tab-link', a);
        self.panels = self.panels.add(panel);
      }

      // If dropdown tab, add the contents of the dropdown
      // NOTE: popupmenu items that represent dropdown tabs shouldn't have children,
      // so they aren't accounted for here.
      if (popup) {
        popup.menu.children('li').each(function () {
          const popupLi = $(this);
          const popupA = popupLi.children('a');
          const popupHref = popupA.attr('href');
          const popupPanel = $(popupHref);

          popupA.data('panel-link', popupPanel);
          popupPanel.data('tab-link', popupA);

          self.panels = self.panels.add(popupPanel);
          self.anchors = self.anchors.add(popupA);

          if (!popupLi.hasClass('dismissible')) {
            return;
          }

          let popupIcon = popupLi.children('.icon');
          if (!popupIcon.length) {
            popupIcon = $.createIconElement({ icon: 'close', classes: 'icon close' });
          }
          popupIcon.detach().appendTo(popupA);
        }).on('click.popupmenu', '.icon', function iconClickHandler(e) {
          const popupIcon = $(this);
          const popupLi = popupIcon.closest('li');

          if (popupLi.is('.dismissible') && popupIcon.is('.icon')) {
            e.preventDefault();
            e.stopPropagation();
            self.closeDismissibleTab(popupLi.children('a').attr('href'));
          }
        });
      }
    }

    self.panels = $();
    self.anchors.each(associateAnchorWithPanel);
    self.panels
      .addClass('tab-panel')
      .attr({ role: 'tabpanel' })
      .find('h3:first').attr('tabindex', '0');

    self.panels.each(function () {
      const panel = $(this);
      if (!panel.parent().is(self.container)) {
        self.container.append(panel);
      }
    });

    const excludes = ':not(.separator):not(.is-disabled):not(.is-hidden)';
    const tabs = this.tablist.children(`li${excludes}`);
    let selected = this.tablist.children(`li.is-selected${excludes}`);
    let selectedAnchor = selected.children('a');
    let hash;
    let matchingTabs;

    // Setup a hash for nested tab controls
    self.nestedTabControls = self.panels.find('.tab-container');

    if (tabs.length) {
      // If the hashChange setting is on, change the selected tab to the one referenced by the hash
      if (this.settings.changeTabOnHashChange) {
        hash = window.location.hash;
        if (hash && hash.length) {
          matchingTabs = tabs.find(`a[href="${hash}"]`);
          if (matchingTabs.length) {
            selected = matchingTabs.first().parent();
            selectedAnchor = selected.children('a');
          }
        }
      }

      // If there is no selected tab, try to find the first available tab (if there are any present)
      if (!selected.length) {
        selected = tabs.not('.add-tab-button, .application-menu-trigger').first();
        selectedAnchor = selected.children('a');
      }

      // If there are tabs present, activate the first one
      if (selected.length) {
        this.activate(selectedAnchor.attr('href'), selectedAnchor);
      }
    }

    if (this.isModuleTabs() && this.element.children('.toolbar').length) {
      this.element.addClass('has-toolbar');
    }

    if (this.isModuleTabs() && tabs.filter('.application-menu-trigger').length > 0) {
      tabs.find('a[tabindex="0"]').attr('tabindex', '-1');
      tabs.filter('.application-menu-trigger').find('a').attr('tabindex', '0');
    }

    this.setOverflow();

    this.positionFocusState(selectedAnchor);

    // Setup Edge Fades
    if (this.tablistContainer) {
      this.tablistContainer.on('scroll.tabs', () => {
        this.renderEdgeFading();
      });
      this.renderEdgeFading();
    }

    // Create sortable tabs
    this.createSortable();

    // Setup a resize observer on both the tab panel container and the tab list container (if applicable)
    // to auto-refresh the state of the Tabs on resize.  ResizeObserver doesn't work in IE.
    if (typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => {
        $('body').triggerHandler('resize');
      });

      this.ro.observe(this.element[0]);
      if (this.containerElement) {
        this.ro.observe(this.containerElement[0]);
      }
    }

    return this;
  },

  /**
   * Create tabs to be sortable by drag and drop.
   * @private
   * @returns {void}
   */
  createSortable() {
    const self = this;
    const s = this.settings;
    if (!s.sortable) {
      return;
    }
    // Sortable with touch devices, only support to module and vertical tabs.
    if (env.features.touch && !(this.isModuleTabs() || this.isVerticalTabs())) {
      return;
    }

    const tablist = this.tablist ? this.tablist[0] : null;
    const tabContainers = $('.tab-panel-container');
    if (tablist) {
      const excludeSel = '.is-disabled, .separator, .application-menu-trigger';
      const excludeEl = [].slice.call(tablist.querySelectorAll(excludeSel));
      excludeEl.forEach(el => el.setAttribute('data-arrange-exclude', 'true'));
      tablist.setAttribute('data-options', '{"placeholderCssClass": "tab arrange-placeholder", "useItemDimensions": "true"}');

      // Set arrange
      tablist.classList.add('arrange');
      let arrangeApi = this.tablist.data('arrange');
      if (!arrangeApi) {
        arrangeApi = this.tablist.arrange().data('arrange');
      }

      const className = 'has-placeholder';
      let tabContainer = null;
      if (!this.isModuleTabs() && !this.isVerticalTabs() && !this.isHeaderTabs()) {
        this.tablist
          .on('beforearrange.tabs', function () {
            tabContainer = $(this).closest('.tab-container')[0];
          })
          .on('draggingarrange.tabs', () => {
            tabContainer?.classList.add(className);
          });
      }

      this.tablist.on('dragover.tabs', (e) => {
        e.preventDefault();
      });

      tabContainers.on('dragover.tabpanel', (e) => {
        e.preventDefault();
      });

      this.tablist.on('drag.tabs', (event) => {
        if ($('.multitabs-section.is-hidden').length) {
          const dragElement = $(event.target);
          const parentElement = dragElement.parents('.multitabs-section');

          if (!parentElement.hasClass('alternate')) {
            parentElement.find('.overlay-right').addClass('has-overlay');
          } else {
            parentElement.find('.overlay-left').addClass('has-overlay');
          }
        }
      });

      this.tablist.on('dragend.tabs', (event) => {
        const dragElement = $(event.target);
        const targetElement = $(document.elementFromPoint(event.pageX, event.pageY));
        const parentElement = dragElement.parents('.multitabs-section');

        parentElement.find('.overlay-left').removeClass('has-overlay');
        parentElement.find('.overlay-right').removeClass('has-overlay');

        let targetTabsetName = targetElement.parents('.module-tabs');
        if (dragElement.get(0) !== targetElement.get(0)) {
          if (parentElement[0] === targetElement.parents('.multitabs-section')[0]) {
            $('.multitabs-section').each((index, item) => {
              if (parentElement[0] !== item && $(item).hasClass('is-hidden')) {
                targetTabsetName = $(item).children('.module-tabs');
              }
            });
          }
        }

        const selectedTab = dragElement.attr('href').replace('#', '');
        const api = targetTabsetName.data('tabs');

        if (api === undefined) {
          return;
        }

        const tab = api.getTab(null, dragElement);

        if (self.element.parent()[0] === api.element.parent()[0]) {
          return;
        }

        const tabMarkup = tab.clone();
        const panelMarkup = self.getPanel(selectedTab).children();

        self.remove(selectedTab);
        api.add(selectedTab, {
          name: tabMarkup.children('a').text().trim(),
          content: panelMarkup,
          doActivate: true
        });

        if (self.element.children('.tab-list').children().length < 1) {
          self.element.parent().addClass('is-hidden');
        }

        if (api.element.children('.tab-list').children().length > 0) {
          api.element.parent().removeClass('is-hidden');
        }
      });

      this.tablist.on('arrangeupdate.tabs', () => {
        tabContainer?.classList.remove(className);
      });

      this.element.on('aftertabadded.tabs', () => {
        arrangeApi?.updated();
      });
    }
  },

  /**
   * Adds/removes helper buttons and accessibility-centric markup, based on Tabs' configuration
   * Designed to be run at any point in the Tabs lifecycle.
   * @private
   * @returns {this} component instance
   */
  renderHelperMarkup() {
    let auxilaryButtonLocation = this.tablistContainer || this.tablist;
    if (this.isModuleTabs()) {
      auxilaryButtonLocation = this.tablist;
    }

    this.focusState = this.element.find('.tab-focus-indicator');
    if (!this.focusState.length) {
      this.focusState = $('<div class="tab-focus-indicator" role="presentation"></div>').insertBefore(this.tablist);
    }

    // Add the markup for the "More" button if it doesn't exist.
    if (!this.moreButton) {
      this.moreButton = $();
    }

    if (!this.isVerticalTabs()) {
      if (!this.moreButton.length) {
        this.moreButton = auxilaryButtonLocation.next('.tab-more');
      }
      // If we still don't have a More Button, create one
      if (!this.moreButton.length) {
        this.moreButton = $('<div>').attr({ class: 'tab-more' });
        this.moreButton.append($('<span class="more-text">').text(Locale.translate('More')));
        this.moreButton.append($.createIconElement({ classes: 'icon-more', icon: 'dropdown' }));
      }

      // Append in the right place based on configuration
      auxilaryButtonLocation.after(this.moreButton);
    } else if (this.moreButton.length) {
      this.moreButton.off().removeData().remove();
      this.moreButton = $();
    }

    // Add extra attributes to the more button, if applicable
    if (this.moreButton?.length && this.settings.attributes) {
      utils.addAttributes(this.moreButton, this, this.settings.attributes, 'btn-more');
    }

    // Add the application menu Module Tab, if applicable
    let appMenuTrigger = this.tablist.find('.application-menu-trigger');
    if (this.settings.appMenuTrigger === true) {
      // Backwards Compatibility for the original Application Menu codepath.
      if (this.isModuleTabs()) {
        if (!appMenuTrigger.length) {
          const audibleClass = this.settings.appMenuTriggerTextAudible ? ' class="audible"' : '';
          appMenuTrigger = $(`
            <li class="tab application-menu-trigger">
              <a href="#">
                <span class="icon app-header">
                  <span class="one"></span>
                  <span class="two"></span>
                  <span class="three"></span>
                </span>
                <span${audibleClass}>${this.settings.appMenuTriggerText || Locale.translate('AppMenuTriggerText')}</span>
              </a>
            </li>
          `);
          this.tablist.prepend(appMenuTrigger);
        }
      } else if (this.isVerticalTabs() && appMenuTrigger.length) {
        appMenuTrigger.off().removeData().remove();
      }
    } else if (appMenuTrigger.length) {
      if (this.isVerticalTabs()) {
        appMenuTrigger.off().removeData().remove();
      } else {
        this.tablist.prepend(appMenuTrigger);
      }
    }

    if (appMenuTrigger.length) {
      // Add extra attributes to the App Menu Trigger button, if applicable
      if (this.settings.attributes) {
        utils.addAttributes(appMenuTrigger, this, this.settings.attributes, 'appmenu-trigger-btn');
      }

      // Add it to the App Menu's list of triggers to adjust on open/close
      $('#application-menu').data('applicationmenu')?.modifyTriggers([appMenuTrigger.children('a')], null, true);
    }

    // Add Tab Button
    if (this.settings.addTabButton) {
      if (!this.addTabButton || !this.addTabButton.length) {
        this.addTabButton = $(`
          <div class="add-tab-button" tabindex="-1" role="button">
            <span aria-hidden="true" role="presentation">+</span>
            <span class="audible">${Locale.translate('AddNewTab')}</span>
          </div>
        `);
        this.addTabButton.insertAfter(this.moreButton);
        this.element.addClass('has-add-button');
      }
    } else if (this.addTabButton && this.addTabButton.length) {
      this.addTabButton.off().removeData().remove();
      this.addTabButton = undefined;
      this.element.removeClass('has-add-button');
    }

    // Add extra attributes to the add button, if applicable
    if (this.addTabButton?.length && this.settings.attributes) {
      utils.addAttributes(this.addTabButton, this, this.settings.attributes, 'btn-add');
    }

    // Find a More Actions button, if applicable
    const moreActionsButton = this.element.find('.more-actions-button .btn-actions');
    if (moreActionsButton.length) {
      this.moreActionsBtn = moreActionsButton;
    }

    if (this.settings.addTabButtonTooltip) {
      this.addTabButton.tooltip({
        content: Locale.translate('AddNewTab')
      });
    }

    return this;
  },

  /**
   * Establishes the bound event listeners on all tabs elements
   * @private
   * @returns {this} component instance
   */
  setupEvents() {
    const self = this;

    // Clicking the 'a' triggers the click on the 'li'
    function routeAnchorClick(e) {
      const a = $(e.currentTarget);

      if (this.wasTapped === true) {
        this.wasTapped = false;
        return;
      }

      if (e.type === 'touchend') {
        this.wasTapped = true;
      }

      if (a.attr('href').substr(0, 1) !== '#') {
        // is an outbound Link
        return;
      }
      e.preventDefault();
    }

    // Some tabs have icons that can be clicked and manipulated
    function handleIconClick(e) {
      const elem = $(this);
      if (elem.is('[disabled]') || elem.parent().hasClass('is-disabled')) {
        return;
      }

      const li = $(elem).parent();

      if (li.hasClass('dismissible')) {
        e.preventDefault();
        e.stopPropagation();
        self.closeDismissibleTab(li.children('a').attr('href'));
      }
    }

    function handleTabBlur() {
      $(this).parent().removeClass('is-focused');
    }

    // Any events bound to individual tabs (li) and their anchors (a) are bound
    // to the tablist element so that tabs can be added/removed/hidden/shown without
    // needing to change event bindings.
    this.tablist
      .on('mousedown.tabs', '> li', function (e) {
        self.handleAddFocusData(e, $(this));

        if ($(e.target).hasClass('close') && $(e.target).parent().hasClass('has-popupmenu')) {
          const menu = $(this).data('popupmenu').menu;
          const hrefs = [];
          $.each(menu[0].children, (i, li) => {
            hrefs.push(li.children[0].href);
          });
          self.closeDismissibleTabs(hrefs);
        }

        // let right click pass through
        if (e.which !== 3 && !$(e.target).hasClass('close')) {
          return self.handleTabClick(e, $(this));
        }
        return false;
      })
      .on('click.tabs', 'a', routeAnchorClick)
      .on('click.tabs', '.icon', handleIconClick)
      .on('focus.tabs', 'a', function (e) {
        return self.handleTabFocus(e, $(this));
      })
      .on('blur.tabs', 'a', handleTabBlur)
      .on('keydown.tabs', 'a', e => this.handleTabKeyDown(e));

    // Setup events on Dropdown Tabs
    function dropdownTabEvents(i, tab) {
      const li = $(tab);
      const a = li.children('a');
      const menu = li.data('popupmenu').menu;

      // Alt+Del or Alt+Backspace closes a dropdown tab item
      function closeDropdownMenuItem(e) {
        if (!e.altKey || !li.is('.dismissible')) {
          return;
        }

        self.closeDismissibleTab(a.attr('href'));
      }

      menu.on('keydown.popupmenu', 'a', (e) => {
        switch (e.which) {
          case 27: // escape
            li.addClass('is-selected');
            a.focus();
            break;
          case 8: // backspace (delete on Mac)
            closeDropdownMenuItem(e);
            break;
          case 46: // The actual delete key
            closeDropdownMenuItem(e);
            break;
          default:
            break;
        }
      });

      li.on('selected.tabs', function (e, anchor) {
        const popupLi = $(this);
        const href = $(anchor).attr('href');

        if (!self.activate(href, $(anchor))) {
          return false;
        }

        self.positionFocusState(a);

        a.focus();
        self.scrollTabList(popupLi);

        popupLi.addClass('is-selected');
        return false;
      });
    }

    const ddTabs = self.tablist.find('li').filter('.has-popupmenu');
    ddTabs.each(dropdownTabEvents);

    function dismissibleTabEvents(i, tab) {
      const li = $(tab);
      const a = li.children('a');

      a.on('keydown.tabs', (e) => {
        self.handleDismissibleTabKeydown(e);
      });
    }

    const dismissible = self.tablist.find('li').filter('.dismissible');
    dismissible.each(dismissibleTabEvents);

    this.setupHelperMarkupEvents();

    this.panels.on('keydown.tabs', (e) => {
      self.handlePanelKeydown(e);
    });

    // Check whether or not all of the tabs + more button are de-focused.
    // If true, the focus-state and animated bar need to revert positions
    // back to the currently selected tab.
    this.element.on('focusout.tabs', () => {
      const noFocusedTabs = !$.contains(self.element[0], document.activeElement);
      const noPopupMenusOpen = self.tablist.children('.has-popupmenu.is-open').length === 0;

      if (noFocusedTabs && noPopupMenusOpen && !self.moreButton.is('.is-selected, .popup-is-open')) {
        self.hideFocusState();
      }
    }).on('updated.tabs', (e, settings) => {
      self.updated(settings);
    }).on('activated.tabs', (e) => {
      // Stop propagation of the activate event from going higher up into the DOM tree
      e.stopPropagation();
    }).on('add.tabs', (e, newTabId, newTabOptions, newTabIndex) => {
      self.add(newTabId, newTabOptions, newTabIndex);
    })
      .on('remove.tabs', (e, tabId) => {
        self.remove(tabId);
      });

    // Check to see if we need to add/remove the more button on resize
    $('body').on(`resize.tabs${this.tabsIndex}`, () => {
      self.handleResize();
    });
    self.handleResize(true);

    return this;
  },

  /**
   * Adds events associated with elements that are re-renderable during the Tabs lifecycle
   * @private
   */
  setupHelperMarkupEvents() {
    const self = this;

    // Setup the "more" function
    this.moreButton
      .on('click.tabs', (e) => {
        self.handleMoreButtonClick(e);
      })
      .on('keydown.tabs', (e) => {
        self.handleMoreButtonKeydown(e);
      })
      .on('focus.tabs', (e) => {
        self.handleMoreButtonFocus(e);
      })
      .on('mousedown.tabs', function (e) {
        self.handleAddFocusData(e, $(this));
      });

    if (this.settings.addTabButton) {
      this.addTabButton
        .on('click.tabs', () => {
          self.handleAddButton();
        })
        .on('keydown.tabs', (e) => {
          self.handleAddButtonKeydown(e);
        })
        .on('focus.tabs', (e) => {
          self.handleAddButtonFocus(e);
        });
    }

    if (this.moreActionsBtn?.length) {
      this.moreActionsBtn
        .on('keydown.tabs', (e) => {
          self.handleMoreActionsButtonKeydown(e);
        });
    }
  },

  /**
   * Removes events associated with elements that are re-renderable during the Tabs lifecycle
   * @private
   * @returns {this} component instance
   */
  removeHelperMarkupEvents() {
    if (this.moreButton && this.moreButton.length) {
      this.moreButton
        .off('click.tabs keydown.tabs focus.tabs mousedown.tabs');
    }

    if (this.addTabButton && this.addTabButton.length) {
      this.addTabButton
        .off('click.tabs keydown.tabs focus.tabs');
    }

    return this;
  },

  /**
   * Setup a mousedown event on tabs to determine in the focus handler whether
   * or a not a keystroked cause a change in focus, or a click.  Keystroke focus
   * changes cause different visual situations
   * @private
   * @param {$.Event} e incoming focus event
   * @param {jQuery[]} elem element
   * @returns {undefined}
   */
  handleAddFocusData(e, elem) {
    let tab = elem;
    if (tab.is('.is-disabled')) {
      e.preventDefault();
      return false;
    }

    if (!tab.is(this.moreButton)) {
      tab = tab.children('a');
    }

    this.hideFocusState();
    tab.data('focused-by-click', true);
    return true;
  },

  /**
   * Handler for Tab Click
   * @private
   * @param {jQuery.Event} e incoming click event
   * @param {jQuery[]} li list item representing the clicked tab
   * @returns {boolean|undefined} ? // TODO: why?
   */
  handleTabClick(e, li) {
    if (this.element.is('.is-disabled') || (li && (li.is('.is-disabled') || li.is('.separator')))) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }

    const appMenuResult = this.handleAppMenuTabKeydown(e);
    if (!appMenuResult) {
      return true;
    }

    let a = li.children('a');
    a.data('focused-by-click', true);

    if (this.popupmenu && this.popupmenu.element.hasClass('is-open')) {
      this.popupmenu.close();
    }

    // Don't activate a dropdown tab.  Clicking triggers the Popupmenu Control attached.
    if (li.is('.has-popupmenu')) {
      this.positionFocusState(a);
      return true;
    }

    let href = a.attr('href');

    if (li.is('.add-tab-button')) {
      a = this.handleAddButton();
      li = a.parent();
      href = a.attr('href');
      this.element.trigger('tab-added', [a]);
    }

    // close tab on middle click
    if (e.which === 2) {
      if (li.is('.dismissible') && $(e.target).is('.close')) {
        this.closeDismissibleTab(href);
      }
      e.preventDefault();
      return true;
    }

    if (!this.activate(href, a)) {
      return true;
    }
    this.changeHash(href);

    this.focusState.removeClass('is-visible');

    a.focus();

    if (this.isScrollableTabs()) {
      this.scrollTabList(li);
    }

    // Hide these states
    this.positionFocusState(a);

    if (this.settings.lazyLoad === true && this.isURL(href)) {
      return false;
    }

    return true;
  },

  /**
   * Handler for click events on the "More Tabs" popupmenu trigger
   * @private
   * @param {jQuery.event} e Event
   * @returns {boolean|undefined} ?
   */
  handleMoreButtonClick(e) {
    if (this.element.is('.is-disabled') || this.moreButton.is('.is-disabled')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    this.moreButton.data('focused-by-click', true);

    if (!(this.hasMoreButton())) {
      e.stopPropagation();
    }
    if (this.moreButton.hasClass('popup-is-open')) {
      this.popupmenu.close();
      this.moreButton.removeClass('popup-is-open');
    } else {
      this.buildPopupMenu();
    }

    this.hideFocusState();
    return true;
  },

  /**
   * @returns {boolean} true if the "More Actions" button is present
   */
  hasMoreActions() {
    const moreActionsBtn = this.element.find('.more-actions-button > .btn-actions');
    return (moreActionsBtn && moreActionsBtn.length > 0);
  },

  /**
   * Handler for keydown events on the optional "More Actions" button, if it's present.
   * @private
   * @param {jQuery.event} e Event
   * @returns {boolean|undefined} ?
   */
  handleMoreActionsButtonKeydown(e) {
    if (this.element.is('.is-disabled') || this.moreActionsBtn.is('.is-disabled')) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }

    const self = this;
    function openMenu(oldHref) {
      e.preventDefault();
      // setTimeout is used to bypass triggering of the keyboard when
      // self.buildPopupMenu() is invoked.
      setTimeout(() => {
        self.buildPopupMenu(oldHref);
        self.positionFocusState(self.moreButton, true);
      }, 0);
    }

    const hasAddButton = this.addTabButton && this.addTabButton.length;
    const allExcludes = ':not(.separator):not(.is-disabled):not(:hidden)';
    const tabs = this.tablist.children(`li${allExcludes}`);
    let targetLi;

    switch (e.which) {
      case 37: // left
      case 38: // up
        if (hasAddButton) {
          this.addTabButton.focus();
        } else {
          const last = this.findLastVisibleTab();
          if (this.hasMoreButton()) {
            openMenu(last.attr('href'));
          } else {
            targetLi = last;
          }
        }
        break;
      case 39: // right
      case 40: // down
        targetLi = tabs.first();
        break;
      default:
        break;
    }

    if (targetLi) {
      e.preventDefault();
      targetLi.children('a').focus();

      if (this.isScrollableTabs()) {
        this.scrollTabList(targetLi);
      }
    }

    return true;
  },

  /**
   * Handler for click events on the "More Tabs" popupmenu trigger
   * @private
   * @param {jQuery.event} e Event
   * @param {jQuery[]} a represents an anchor tag
   * @returns {boolean|undefined} ?
   */
  handleTabFocus(e, a) {
    if (this.element.is('.is-disabled')) {
      e.preventDefault();
      return false;
    }

    const li = a.parent();
    const dataFocusedClick = a.data('focused-by-click');
    const focusedByKeyboard = dataFocusedClick === undefined ||
      (dataFocusedClick && dataFocusedClick === false);

    $.removeData(a[0], 'focused-by-click');

    if (this.isTabOverflowed(li)) {
      this.buildPopupMenu(a.attr('href'));
      this.moreButton.addClass('is-focused');
      this.positionFocusState(this.moreButton);
    } else {
      li.addClass('is-focused');
      this.positionFocusState(a, focusedByKeyboard);
    }

    return true;
  },

  /**
   * Handler for focus events on the "More Tabs" popupmenu trigger
   * @private
   * @param {jQuery.event} e incoming focus event
   * @returns {void}
   */
  handleMoreButtonFocus(e) {
    if (this.element.is('.is-disabled')) {
      e.preventDefault();
      return;
    }

    const dataFocusedClick = this.moreButton.data('focused-by-click');
    const focusedByKeyboard = (dataFocusedClick && dataFocusedClick === false);

    $.removeData(this.moreButton[0], 'focused-by-click');

    this.focusState.removeClass('is-visible');
    this.positionFocusState(this.moreButton, focusedByKeyboard);
  },

  /**
   * Handler for keydown events on Tabs in the list
   * @private
   * @param {jQuery.event} e incoming keydown event
   * @returns {boolean|undefined} ?
   */
  handleTabKeyDown(e) {
    if (this.element.is('.is-disabled')) {
      e.preventDefault();
      return false;
    }

    if (e.shiftKey || e.ctrlKey || e.metaKey || (e.altKey && e.which !== 8)) {
      return true;
    }

    const self = this;
    const passableKeys = [8, 13, 32];

    function isPassableKey() {
      return $.inArray(e.which, passableKeys) > -1;
    }

    if ((e.which < 32 && !isPassableKey()) || e.which > 46) {
      return true;
    }

    if (isPassableKey()) {
      const appMenuResult = this.handleAppMenuTabKeydown(e);
      if (!appMenuResult) {
        return true;
      }
    }

    function openMenu(oldHref) {
      e.preventDefault();
      // setTimeout is used to bypass triggering of the keyboard when
      // self.buildPopupMenu() is invoked.
      setTimeout(() => {
        self.buildPopupMenu(oldHref);
      }, 0);
    }

    const allExcludes = ':not(.separator):not(.is-disabled):not(:hidden)';
    let currentLi = $(e.currentTarget).parent();
    let currentA = currentLi.children('a');
    let targetLi;
    const tabs = self.tablist.children(`li${allExcludes}`);
    const isRTL = Locale.isRTL();

    function previousTab() {
      let i = tabs.index(currentLi) - 1;
      while (i > -1 && !targetLi) {
        if (tabs.eq(i).is(allExcludes)) {
          return tabs.eq(i);
        }
        i -= 1;
      }

      if (self.hasMoreActions()) {
        return self.moreActionsBtn;
      }
      if (self.settings.addTabButton) {
        return self.addTabButton;
      }

      const last = self.tablist.children(`li${allExcludes}`).last();

      if (self.hasMoreButton() && self.isScrollableTabs()) {
        openMenu(last.find('a').attr('href'));
      }

      return last;
    }

    function nextTab() {
      let i = tabs.index(currentLi) + 1;
      while (i < tabs.length && !targetLi) {
        if (tabs.eq(i).is(allExcludes)) {
          return tabs.eq(i);
        }
        i++;
      }

      const first = self.tablist.children(`li${allExcludes}`).first();

      if (self.hasMoreButton() && self.isScrollableTabs()) {
        openMenu(first.find('a').attr('href'));
        return first;
      }

      if (self.settings.addTabButton) {
        return self.addTabButton;
      }
      if (self.hasMoreActions()) {
        return self.moreActionsBtn;
      }

      return first;
    }

    function checkAngularClick() {
      if (currentA.attr('ng-click') || currentA.attr('data-ng-click')) { // Needed to fire the "Click" event in Angular situations
        currentA.click();
      }
    }

    function activate() {
      if (currentLi.hasClass('has-popupmenu')) {
        currentLi.data('popupmenu').open();
        return;
      }

      let href = currentA.attr('href');

      if (currentLi.is('.add-tab-button')) {
        currentA = self.handleAddButton();
        currentLi = currentA.parent();
        href = currentA.attr('href');
        self.element.trigger('tab-added', [currentA]);
      }

      if (!self.activate(href)) {
        return;
      }

      self.changeHash(href);
      checkAngularClick();
      currentA[0].focus();
      self.hideFocusState();

      // In the event that the activated tab is a full link that should be followed,
      // the keystroke events need to manually activate the link change.  Clicks are handled
      // automatically by the browser.
      self.handleOutboundLink(href);
    }

    switch (e.which) {
      case 8:
        if (e.altKey && currentLi.is('.dismissible')) {
          e.preventDefault();
          self.closeDismissibleTab(currentA.attr('href'));
        }
        return true;
      case 13: // Enter
        activate();
        this.positionFocusState();
        return false;
      case 32: // Spacebar
        activate();
        this.positionFocusState();
        return false;
      case 38:
        targetLi = previousTab();
        e.preventDefault();
        break;
      case 37:
        targetLi = isRTL ? nextTab() : previousTab();
        e.preventDefault();
        break;
      case 40:
        targetLi = nextTab();
        e.preventDefault();
        break;
      case 39:
        targetLi = isRTL ? previousTab() : nextTab();
        e.preventDefault();
        break;
      default:
        break;
    }

    if (targetLi) {
      const isAddTabButton = targetLi.is('.add-tab-button');
      const isMoreActionsButton = targetLi.is('.btn-actions');
      const focusStateTarget = isAddTabButton || isMoreActionsButton ? targetLi : targetLi.children('a');

      // Use the matching option in the popup menu if the target is hidden by overflow.
      if (this.isTabOverflowed(targetLi)) {
        return openMenu(targetLi.children('a').attr('href'));
      }

      if (isAddTabButton) {
        self.addTabButton.focus();
      } else if (isMoreActionsButton) {
        self.moreActionsBtn.focus();
      } else {
        focusStateTarget.focus();

        if (this.isScrollableTabs()) {
          this.scrollTabList(focusStateTarget);
          self.positionFocusState(focusStateTarget, true);
        }
      }
    }

    return true;
  },

  /**
   * Handler for keydown events on Dismissible tabs
   * @private
   * @param {jQuery.event} e incoming keydown event
   * @returns {void}
   */
  handleDismissibleTabKeydown(e) {
    const key = e.which;
    let tab = $(e.target);

    if (tab.is('a')) {
      tab = tab.parent();
    }

    if (e.altKey && key === 46) { // Alt + Del
      if (tab.children('a').is('[disabled]') || tab.hasClass('is-disabled')) {
        return;
      }

      e.preventDefault();
      this.closeDismissibleTab(tab.children('a').attr('href'));
    }
  },

  /**
   * Handler for keydown events on the "App Menu" tab (trigger button for the App Menu)
   * @private
   * @param {jQuery.event} e incoming keydown event
   * @returns {boolean} ?
   */
  handleAppMenuTabKeydown(e) {
    const target = $(e.target);
    const li = target.parent();

    if (!(li.is('.application-menu-trigger') || target.is('.application-menu-trigger'))) {
      return true;
    }

    // If the tab is an application-menu trigger, open the app menu
    // Used by Module Tabs
    const menu = $('#application-menu');
    if (!menu.length) {
      return false;
    }

    e.preventDefault();

    // this.hideFocusState();

    if (menu.hasClass('is-open')) {
      menu.trigger('close-applicationmenu', [true]);
      return false;
    }

    menu.trigger('open-applicationmenu', [true, true]);
    return false;
  },

  /**
   * Handler for keydown events on the "More Tabs" popupmenu trigger
   * @private
   * @param {jQuery.event} e incoming keydown event
   * @returns {boolean|undefined} ?
   */
  handleMoreButtonKeydown(e) {
    if (this.element.is('.is-disabled')) {
      e.preventDefault();
      return false;
    }

    const self = this;
    const isRTL = Locale.isRTL();

    function openMenu() {
      e.preventDefault();
      self.buildPopupMenu(self.tablist.find('.is-selected').children('a').attr('href'));
      self.positionFocusState(self.moreButton, true);
    }

    function lastTab() {
      e.preventDefault();
      self.findLastVisibleTab();
    }

    switch (e.which) {
      case 37: // left
        if (isRTL) {
          openMenu();
          break;
        }
        lastTab();
        break;
      case 38: // up
        lastTab();
        break;
      case 13: // enter
      case 32: // spacebar
        e.preventDefault();
        break;
      case 39: // right
        if (isRTL) {
          lastTab();
          break;
        }
        openMenu();
        break;
      case 40: // down
        openMenu();
        break;
      default:
        break;
    }

    return true;
  },

  /**
   * Handler for keydown events on the "More Tabs" popupmenu trigger
   * @private
   * @param {jQuery.event} e incoming keydown event
   * @returns {void}
   */
  handlePanelKeydown(e) {
    const key = e.which;
    const panel = $(e.target);
    const a = this.anchors.filter(`#${panel.attr('id')}`);
    const tab = this.anchors.filter(`#${panel.attr('id')}`).parent();

    if (tab.is('.dismissible')) {
      // Close a Dismissible Tab
      if (e.altKey && key === 46) { // Alt + Delete
        e.preventDefault();
        return this.closeDismissibleTab(a.attr('href'));
      }
    }

    // Takes focus away from elements inside a Tab Panel and brings focus to its corresponding Tab
    if ((e.ctrlKey && key === 38) &&
      $.contains(document.activeElement, panel[0])) { // Ctrl + Up Arrow
      e.preventDefault();
      return this.activate(a.attr('href'), a);
    }

    return undefined;
  },

  /**
   * Trigger event aftertabadded
   * @private
   * @param {string} id The tab id
   * @returns {void}
   */
  triggerEventAfterTabAdded(id) {
    const a = this.anchors.filter(`[href="#${id}"]`);
    this.element.triggerHandler('aftertabadded', [a]);
  },

  /**
   * Handles the Add Tab button being clicked
   * @private
   * @returns {boolean|undefined} ?
   */
  handleAddButton() {
    const self = this;
    const cb = this.settings.addTabButtonCallback;
    if (cb && typeof cb === 'function') {
      const newTabId = cb();
      this.triggerEventAfterTabAdded('newTabId');
      return this.anchors.filter(`[href="#${newTabId}"]`);
    }

    function makeId() {
      self.idCounter = typeof self.idCounter === 'number' ? self.idCounter : -1;
      self.idCounter++;

      return `new-tab-${self.idCounter}`;
    }

    function makeName(id) {
      const nameParts = id.toString().split('-');
      nameParts.forEach((val, i) => {
        nameParts[i] = val.charAt(0).toUpperCase() + val.slice(1);
      });

      return nameParts.join(' ');
    }

    let newIndex = this.tablist.children().index(this.addTabButton);
    let newId = makeId();
    const newName = makeName(newId);
    let settings = {
      name: newName,
      content: '&nbsp;',
      isDismissible: true
    };

    if (newIndex < 0) {
      newIndex = this.tablist.find('li:not(.separator)').length;
    }

    // Allow the opportunity to pass in external settings for the new tab control
    const externalSettings = this.element.triggerHandler('before-tab-added', [newId, settings, newIndex]);
    if (!externalSettings) {
      this.add(newId, settings, newIndex);
      this.triggerEventAfterTabAdded('newId');
      return this.anchors.filter(`[href="#${newId}"]`);
    }

    if (externalSettings.newId &&
      externalSettings.newId.length &&
      typeof externalSettings.newId === 'string') {
      newId = externalSettings.newId;
    }
    if (externalSettings.settings &&
      typeof externalSettings.settings === 'object') {
      settings = externalSettings.settings;
    }
    if (!isNaN(externalSettings.newIndex)) {
      newIndex = externalSettings.newIndex;
    }

    this.add(newId, settings, newIndex);
    this.triggerEventAfterTabAdded('newId');
    return this.anchors.filter(`[href="#${newId}"]`);
  },

  /**
   * @private
   * @param {jQuery.Event} e incoming keydown event
   * @returns {undefined|boolean} ?
   */
  handleAddButtonKeydown(e) {
    if (this.element.is('.is-disabled')) {
      e.preventDefault();
      return false;
    }

    const validKeys = [13, 32, 37, 38, 39, 40];
    const key = e.which;

    if (validKeys.indexOf(key) < 0) {
      return false;
    }

    const self = this;
    const isRTL = Locale.isRTL();
    let targetLi;
    const filter = 'li:not(.separator):not(.is-disabled):not(:hidden)';

    function openMenu() {
      e.preventDefault();
      targetLi = self.tablist.find(filter).last();

      // setTimeout is used to bypass triggering of the keyboard when
      // self.buildPopupMenu() is invoked.
      setTimeout(() => {
        self.buildPopupMenu(targetLi.children('a').attr('href'));
        self.positionFocusState(self.moreButton, true);
      }, 0);
    }

    function firstTab() {
      if (self.hasMoreActions()) {
        self.moreActionsBtn.focus();
        return;
      }
      targetLi = self.tablist.find(filter).first();
    }

    switch (key) {
      case 37: // left
        if (isRTL) {
          firstTab();
          break;
        }
        openMenu();
        break;
      case 38: // up
        openMenu();
        break;
      case 13: // enter
      case 32: // spacebar
        e.preventDefault();
        return this.handleAddButton();
      case 39: // right
        if (isRTL) {
          openMenu();
          break;
        }
        firstTab();
        break;
      case 40: // down
        firstTab();
        break;
      default:
        break;
    }

    if (targetLi) {
      targetLi.children('a').focus();

      if (this.isScrollableTabs) {
        e.preventDefault();
        this.scrollTabList(targetLi);
      }
    }
    return true;
  },

  /**
   * @private
   * @returns {void}
   */
  handleAddButtonFocus() {
    const tabs = this.tablist.find('li:not(.separator)');
    tabs.add(this.moreButton).removeClass('is-focused');

    this.addTabButton.addClass('is-focused');
    this.positionFocusState(this.addTabButton, true);
  },

  /**
   * Resets the visual state of the Tab List and Tab Panel Container to match current width/height and responsive.
   * @param {boolean} ignoreResponsiveCheck if true, doesn't run `this.checkResponsive()`
   * @returns {void}
   */
  handleResize(ignoreResponsiveCheck) {
    if (!ignoreResponsiveCheck) {
      this.checkResponsive(true);
    }

    this.setOverflow();

    let selected = this.tablist.find('.is-selected');
    if (!selected.length || this.moreButton.is('.is-selected') || this.isTabOverflowed(selected)) {
      selected = this.moreButton;
    }

    const appMenuTrigger = this.element.find('.application-menu-trigger');
    if (appMenuTrigger.length > 0 && appMenuTrigger.hasClass('is-focused')) {
      selected = appMenuTrigger.find('a');
    }

    if (!selected.length) {
      this.hideFocusState();
    } else {
      this.positionFocusState(selected);
    }

    this.handleVerticalTabResize();
    this.renderVisiblePanel();
    this.renderEdgeFading();
  },

  /**
   * Checks the window size to determine if a responsive-mode switch is needed.
   * @private
   * @returns {void}
   * @param  {boolean} handleRebuild Do a rebuild after handling.
   */
  checkResponsive(handleRebuild) {
    const self = this;
    const classList = self.element[0].classList;

    function rebuild() {
      self.removeHelperMarkupEvents();
      self.renderHelperMarkup();
      self.setupHelperMarkupEvents();
    }

    function makeResponsive() {
      if (!classList.contains('is-in-responsive-mode')) {
        classList.add('is-in-responsive-mode');
        classList.add('header-tabs');
        if (!classList.contains('is-personalizable')) classList.add('alternate');
        classList.remove('vertical');
        if (handleRebuild) {
          rebuild();
        }
      }
    }

    function makeVertical() {
      if (classList.contains('is-in-responsive-mode')) {
        classList.add('vertical');
        classList.remove('is-in-responsive-mode');
        classList.remove('header-tabs');
        classList.remove('alternate');
        if (handleRebuild) {
          rebuild();
        }
      }
    }

    // Check for responsive mode for Vertical tabs
    if (this.isResponsiveVerticalTabs()) {
      if (breakpoints.isBelow('phone-to-tablet')) {
        makeResponsive();
      } else {
        makeVertical();
      }
    } else {
      makeVertical();
    }
  },

  /**
   * Causes a vertical tabs container to stretch to the height of its parent container
   * @private
   * @returns {void}
   */
  handleVerticalTabResize() {
    if (!this.isVerticalTabs()) {
      return;
    }

    // When tabs are full-size (part of a layout) CSS rules should handle this better
    // due to less strange sizing constraints.  JS resizing is necessary for nesting.
    if (!this.isNested() || this.isNestedInLayoutTabs() || this.isHidden()) {
      return;
    }

    const elemStyle = window.getComputedStyle(this.element[0]);
    const elemOuterHeight = elemStyle.getPropertyValue('height') + elemStyle.getPropertyValue('margin-top') + elemStyle.getPropertyValue('margin-bottom');

    this.tablist[0].style.height = elemOuterHeight;
  },

  /**
   * Changes the location in the browser address bar to force outbound links.
   * @param {string} href incoming href link
   * @param {boolean} useRelativePath don't prepend the full domain, port,
   * protocol, etc. to the HREF.
   * @returns {void}
   */
  handleOutboundLink(href, useRelativePath) {
    if (href.charAt(0) === '#') {
      return;
    }

    if (href.charAt(0) === '/' && (!useRelativePath || useRelativePath === false)) {
      href = window.location.origin + href;
    }

    window.location = href;
  },

  /**
   * Determines whether or not this tabset currently has a "More Tabs" spillover button.
   * @returns {boolean} whether or not the "More Tabs" button is currently displayed.
   */
  hasMoreButton() {
    return this.element[0].classList.contains('has-more-button');
  },

  /**
   * Determines whether or not this normally "vertical" tabset is in an optional "horizontal" responsive mode
   * @returns {boolean} whether or not the responsive mode is active.
   */
  isInResponsiveMode() {
    return this.element[0].classList.contains('is-in-responsive-mode');
  },

  /**
   * Determines whether or not this tabset is currently operating as Module Tabs
   * @returns {boolean} whether or not this is a Module tabset.
   */
  isModuleTabs() {
    return this.element.hasClass('module-tabs');
  },

  /**
   * Determines whether or not this tabset is currently operating as Vertical Tabs
   * @returns {boolean} whether or not this is a Vertical tabset.
   */
  isVerticalTabs() {
    return this.element.hasClass('vertical');
  },

  /**
   * Determines whether or not this tabset is Vertical Tabs with a responsive, horizontal capability
   * @returns {boolean} whether or not this is a Vertical tabset.
   */
  isResponsiveVerticalTabs() {
    return this.settings.verticalResponsive === true;
  },

  /**
   * Determines whether or not this tabset is currently operating as Header Tabs
   * @returns {boolean} whether or not this is a Header tabset.
   */
  isHeaderTabs() {
    return this.element.hasClass('header-tabs');
  },

  /**
   * Determines whether or not this tabset is showing tabs that allow for selection via horizontal scrolling.
   * @returns {boolean} whether or not horizontal scrolling is possible.
   */
  isScrollableTabs() {
    return !this.isModuleTabs() && !this.isVerticalTabs();
  },

  /**
   * Determines whether or not this tabset is currently hidden
   * @returns {boolean} whether or not this tabset is hidden.
   */
  isHidden() {
    return this.element.is(':hidden');
  },

  /**
   * Determines whether or not this tabset is nested inside a parent Tab Panel
   * @returns {boolean} whether or not this tabset is nested.
   */
  isNested() {
    return this.element.closest('.tab-panel').length;
  },

  /**
   * Determines whether or not a particular tab panel is currently the active (displayed) tab panel
   * @param {string} href representing the HTML "id" attribute of a corresponding tab panel
   * @returns {boolean} whether or not the tab panel is active.
   */
  isActive(href) {
    if (!href || !href.length || (href.length === 1 && href.indexOf('#') < 1)) {
      return false;
    }

    const panel = this.getPanel(href);
    return panel[0].classList.contains('can-show');
  },

  /**
   * Determines whether or not this tabset is nested inside a "Layout"-style of Tab container
   * @returns {boolean} whether or not this tabset is nested.
   */
  isNestedInLayoutTabs() {
    const nestedInModuleTabs = this.element.closest('.module-tabs').length;
    const nestedInHeaderTabs = this.element.closest('.header-tabs').length;
    const hasTabContainerClass = this.element.closest('.tab-panel-container').length;

    return (nestedInModuleTabs > 0 || nestedInHeaderTabs > 0 || hasTabContainerClass > 0);
  },

  /**
   * Determines if an object is an HTML List Item representing a tab
   * @param {object} obj incoming object
   * @returns {boolean} whether or not the item is a tab
   */
  isTab(obj) {
    return obj instanceof jQuery && obj.length && obj.is('li.tab');
  },

  /**
   * Determines if an object is an HTML Anchor Tag representing a tab's actionable element
   * @param {object} obj incoming object
   * @returns {boolean} whether or not the item is an anchor tag
   */
  isAnchor(obj) {
    return obj instanceof jQuery && obj.length && obj.is('a');
  },

  /**
   * Gets a reference to an Anchor tag.
   * @param {string|jQuery} href either a string that can be used as a Tab ID, or an actual jQuery wrapped Anchor Tag.
   * @returns {jQuery} the Anchor tag
   */
  getAnchor(href) {
    if (this.isAnchor(href)) {
      return href;
    }

    if (href.indexOf('#') === -1 && href.charAt(0) !== '/') {
      href = `#${href}`;
    }

    return this.anchors.filter(`[href="${href}"]`);
  },

  /**
   * Gets a reference to a Tab panel.
   * @param {string|jQuery} href either a string that can be used as a Tab ID, or an actual jQuery wrapped Anchor Tag.
   * @returns {jQuery} the Anchor tag
   */
  getPanel(href) {
    if (this.isTab(href)) {
      href = href.children('a');
    }

    if (this.isAnchor(href)) {
      href = href.attr('href');
    }

    if (!href || href === '' || href === '#') {
      return $();
    }

    // uses angular LocationStrategy
    if (href.substr(0, 2) === '#/') {
      href = href.replace('#/', '#');
    }
    return this.panels.filter(`[id="${href.replace(/#/g, '')}"]`);
  },

  getMenuItem(href) {
    if (this.isAnchor(href)) {
      href = href.attr('href');
    }

    if (href.indexOf('#') === -1) {
      href = `#${href}`;
    }
    return this.moreMenu.children().children().filter(`[data-href="${href}"]`).parent();
  },

  /**
   * Takes a tab ID and returns a jquery object containing the previous available tab
   * @param {string} tabId the tab ID
   * @returns {jQuery[]} jQuery-wrapped element reference for the tab
   */
  getPreviousTab(tabId) {
    const tab = this.getTab(null, tabId);
    const filter = 'li:not(.separator):not(:hidden):not(.is-disabled)';
    const tabs = this.tablist.find(filter);
    const idx = tabs.index(tab);
    let target = tabs.eq(idx === 0 ? 1 : idx - 1);

    while (target.length && !target.is(filter)) {
      target = tabs.eq(tabs.index(target) - 1);
    }

    // Top-level Dropdown Tabs don't have an actual panel associated with them.
    // Get a Dropdown Tab's first child as the target.
    if (target.is('.has-popupmenu')) {
      const menuAPI = target.data('popupmenu');
      if (menuAPI) {
        target = menuAPI.menu.children('li').first();
      }
    }

    return target;
  },

  /**
   * Takes a tab ID and activates an adjacent available tab
   * @param {object} e event object
   * @param {string} tabId the tab ID
   */
  activateAdjacentTab(e, tabId) {
    const tab = this.doGetTab(e, tabId);

    if (typeof e === 'string') {
      tabId = e;
    }

    if (tab.is('.is-selected')) {
      if (tab.prevAll('li.tab').not('.hidden').not('.is-disabled').length > 0) {
        this.select($(tab.prevAll('li.tab').not('.hidden').not('.is-disabled')[0]).find('a')[0].hash, true);
      } else if (tab.nextAll('li.tab').not('.hidden').length > 0) {
        this.select($(tab.nextAll('li.tab').not('.hidden').not('.is-disabled')[0]).find('a')[0].hash, true);
      }
    } else {
      this.select($(this.element.find('li.tab.is-selected')[0]).find('a')[0].hash, true);
    }
  },

  /**
   * Takes a tab ID and returns a jquery object containing the previous available tab
   * If an optional target Tab (li) is provided, use this to perform activation events
   * @param {string} tabId the tab ID
   * @param {jQuery[]} [target] a reference to the previous tab in the list (before this one)
   * @returns {jQuery[]} potentially-updated target
   */
  activatePreviousTab(tabId, target) {
    const tab = this.getTab(null, tabId);

    if (!target || !(target instanceof jQuery)) {
      target = this.getPreviousTab(tabId);
    }

    if (!target.length) {
      this.hideFocusState();
      return target;
    }

    const a = target.children('a');
    if (tab.is('.is-selected')) {
      if (!this.activate(a.attr('href'), a)) {
        return target;
      }
      a.focus();
    }
    this.positionFocusState(a);

    return target;
  },

  /**
   * Determines whether or not a string has an outbound URL, instead of a hash (#) that would match up to a Tab ID.
   * @param {string} href a string that may or may not contain a URL
   * @returns {boolean} whether or not the incoming string is a URL
   */
  isURL(href) {
    if (!href || href.indexOf('#') === 0) {
      return false;
    }

    return true;
  },

  /**
   * Causes a new tab panel to become active.  Will also trigger AJAX calls on unloaded tab panels, if necessary.
   * @param {string} href a string that either matches up to a Tab ID, or an outbound link to grab AJAX content from.
   * @param {object} anchor in addition to the ref the anchor object may be passed to avoid extra querying.
   * @returns {void}
   */
  activate(href, anchor) {
    const self = this;

    if (self.isURL(href)) {
      return this.callSource(href, anchor, true);
    }

    const a = self.getAnchor(href);
    const targetTab = a.parent();
    const targetPanel = self.getPanel(href);
    const targetPanelElem = targetPanel[0];
    const oldTab = self.anchors.parents().filter('.is-selected');
    let oldPanel;
    let selectedStateTarget;
    let activeStateTarget;

    // Avoid filter(:visible)
    for (let i = 0; i < self.panels.length; i++) {
      if (self.panels[i].classList.contains('is-visible')) {
        oldPanel = $(self.panels[i]);
      }
    }

    if (!oldPanel) {
      oldPanel = self.panels;
    }

    // NOTE: Breaking Change as of 4.3.3 - `beforeactivate` to `beforeactivated`
    // See SOHO-5994 for more details
    /**
     * Fires when an attempt at activating a tab is started
     *
     * @event beforeactivated
     * @memberof Tabs
     * @param {jQuery.Event} e event object
     * @param {jQuery} a the tab anchor attempting to activate
     */
    const isCancelled = self.element.trigger('beforeactivated', [a]);
    if (!isCancelled) {
      return false;
    }

    function completeActivate(vetoResult) {
      if (targetPanel.length < 1) {
        if (self.settings.source) {
          self.callSource(href, a);
          return true;
        }
      } else {
        oldPanel[0].classList.remove('can-show');
        oldPanel[0].classList.remove('is-visible');
        oldPanel.closeChildren();

        /**
         * Fires when a new tab has been activated
         *
         * @event activated
         * @memberof Tabs
         * @param {jQuery.Event} e event object
         * @param {jQuery} a the tab anchor attempting to activate
         */
        self.element.trigger('activated', [a]);

        targetPanelElem.classList.add('can-show');
        self.renderVisiblePanel();
        // trigger reflow as display property is none for animation
        // eslint-disable-next-line
        targetPanelElem.offsetHeight;

        // Register an `afteractivated` event trigger as a renderLoop callback
        const timer = new RenderLoopItem({
          duration: math.convertDelayToFPS(150),
          timeoutCallback() {
            /**
             * Fires when a new tab has been completely activated, and the activation process is done
             *
             * @event afteractivated
             * @memberof Tabs
             * @param {jQuery.Event} e event object
             * @param {jQuery} a the tab anchor attempting to activate
             */
            self.element.trigger('afteractivated', [a]);
          }
        });
        renderLoop.register(timer);

        // Triggers the CSS Animation
        targetPanelElem.classList.add('is-visible');
      }

      // Update the currently-selected tab
      self.updateAria(a);
      oldTab.add(self.moreButton).removeClass('is-selected');
      if (targetTab[0]) {
        if (targetTab[0].classList.contains('tab')) {
          selectedStateTarget = targetTab;
          activeStateTarget = targetTab;
        }
      }

      const ddMenu = targetTab.parents('.popupmenu');
      let ddTab;

      if (ddMenu.length) {
        ddTab = ddMenu.data('trigger');
        if (ddTab.length) {
          selectedStateTarget = ddTab;
          activeStateTarget = ddTab;
        }
      }

      if (self.isTabOverflowed(activeStateTarget)) {
        activeStateTarget = self.moreButton;
        selectedStateTarget = self.moreButton;
      }

      if (selectedStateTarget) {
        selectedStateTarget.addClass('is-selected');
      }

      // Fires a resize on any invoked child toolbars inside the tab panel.
      // Needed to fix issues with Toolbar alignment, since we can't properly detect
      // size on hidden elements.
      const childToolbars = targetPanel.find('.toolbar');
      if (childToolbars.length) {
        childToolbars.each(function () {
          const api = $(this).data('toolbar');
          if (api && typeof api.handleResize === 'function') {
            api.handleResize();
          }
        });
      }

      // Automatically refresh all icons inside Tab panels on activation.
      // See SOHO-7313
      utils.fixSVGIcons(targetPanel[0]);

      return vetoResult || false;
    }

    // Handle an optional, veto-able "beforeActivate" callback.
    if (this.settings.beforeActivate && typeof this.settings.beforeActivate === 'function') {
      return this.settings.beforeActivate(oldTab, targetTab, completeActivate);
    }

    // Otherwise, simply continue
    return completeActivate(true);
  },

  /**
   * Shows/Hides some tabsets' faded edges based on scrolling position, if applicable.
   * @private
   * @returns {undefined}
   */
  renderEdgeFading() {
    if (!this.isScrollableTabs() || !this.tablistContainer) {
      return;
    }

    const tablistContainerElem = this.tablistContainer[0];
    const scrollLeft = Math.abs(tablistContainerElem.scrollLeft);
    const scrollWidth = tablistContainerElem.scrollWidth;
    const containerWidth = parseInt(window.getComputedStyle(tablistContainerElem).getPropertyValue('width'), 10);

    this.element[0].classList[scrollLeft > 1 ? 'add' : 'remove']('scrolled-right');
    this.element[0].classList[(scrollWidth - scrollLeft - 1) <= containerWidth ? 'remove' : 'add']('scrolled-left');
  },

  /**
   * Calls an options-provided source method to fetch content that will be displayed inside a tab.
   * @param {string} href - string representing the target tab to load content under.
   * @param {object} anchor - Reference to the dom object anchor tag.
   * @param {boolean} isURL detects whether or not the URL is actually an external /
   * call, or an ID for an existing tab in the page.
   * @returns {boolean|$.Deferred} true if source call was successful, false for failure/ignore,
   * or a promise object that will fire callbacks in either "success" or "failure" scenarios.
   */
  callSource(href, anchor, isURL) {
    if ((isURL === undefined || isURL === null || isURL === false) && !this.settings.source) {
      return false;
    }
    if (this.settings.lazyLoad !== true) {
      return false;
    }

    const sourceType = typeof this.settings.source;
    const response = (htmlContent) => {
      if (htmlContent === undefined || htmlContent === null) {
        return;
      }

      htmlContent = xssUtils.sanitizeHTML(htmlContent);

      // Get a new random tab ID for this tab if one can't be derived from the URL string
      if (isURL) {
        const containerId = this.element[0].id || '';
        const id = utils.uniqueId(anchor, 'tab', containerId);

        href = `#${id}`;
        // Replace the original URL on this anchor now that we've loaded content.
        anchor[0].setAttribute('href', href);
      }

      this.createTabPanel(href, htmlContent, true);
      this.activate(href);

      this.element.triggerHandler('complete'); // For Busy Indicator
      this.element.trigger('requestend', [href, htmlContent]);
    };

    this.container.triggerHandler('start'); // For Busy Indicator
    this.container.trigger('requeststart');

    function handleStringSource(url, options) {
      const opts = $.extend({ dataType: 'html' }, options, {
        url
      });

      const request = $.ajax(opts);
      request.done(response);
      return request;
    }

    if (isURL) {
      return handleStringSource(href, this.ajaxOptions);
    }

    // return _true_ from this source function on if we're just loading straight content
    // return a promise if you'd like to setup async handling.
    if (sourceType === 'function') {
      return this.settings.source(response, href, this.settings.sourceArguments);
    }

    if (sourceType === 'string') {
      // Attempt to resolve source as a URL string.  Make an $.ajax() call with the URL
      const safeHref = href.replace(/#/g, '');
      let sourceURL = this.settings.source.toString();
      const hasHref = sourceURL.indexOf(safeHref) > -1;

      if (!hasHref) {
        let param = `tab=${safeHref}`;
        const paramIndex = sourceURL.indexOf('?');
        const hashIndex = sourceURL.indexOf('#');
        let insertIndex = sourceURL.length;

        if (paramIndex < 0) {
          param = `?${param}`;
          if (hashIndex > -1) {
            insertIndex = hashIndex + 1;
          }
        } else {
          param += '&';
          insertIndex = paramIndex + 1;
        }

        sourceURL = stringUtils.splice(sourceURL, insertIndex, 0, param);
      }

      return handleStringSource(sourceURL, this.ajaxOptions);
    }

    return false;
  },

  /**
   * @private
   */
  renderVisiblePanel() {
    // Recalculate all components inside of the visible tab to adjust
    // widths/heights/display if necessary
    this.resizeNestedTabs();
    // TJM: Prioritizing performance fix.
    // this.panels.filter(':visible').handleResize();
  },

  /**
   *
   * Update the hash in the link.
   * @private
   * @param  {HTMLElement} href The Dom Element.
   * @returns {void}
   */
  changeHash(href) {
    if (!this.settings.changeTabOnHashChange) {
      return;
    }

    if (!href) {
      href = '';
    }

    href.replace(/#/g, '');

    const cb = this.settings.hashChangeCallback;
    if (cb && typeof cb === 'function') {
      cb(href);
    } else {
      window.location.hash = href;
    }

    /**
     * @event hash-change
     * @memberof Tabs
     * @param {jQuery.Event} e the jQuery event object
     * @param {string} href the new hash fragment for the URL
     */
    this.element.triggerHandler('hash-change', [href]);
  },

  /**
   * Updates the aria-related markup on all tab elements
   * @private
   * @param {jQuery} a the 'selected' tab anchor
   */
  updateAria(a) {
    if (!a) {
      return;
    }
    // hide old tabs
    this.anchors.attr({
      'aria-selected': 'false',
      tabindex: '-1'
    });
    this.moreButton.attr({
      tabindex: '-1'
    });

    // show current tab
    if (a.length && this.element.is(':not(.is-disabled)')) {
      a.parent().removeClass('is-selected');
      if (!this.isTabOverflowed(a.parent())) {
        a.attr({
          'aria-selected': 'true',
          tabindex: '0'
        }).parent().addClass('is-selected');
      } else {
        this.moreButton.attr({
          tabindex: '0'
        });
      }
    }
  },

  /**
   * Causes `handleResize()` to be fired on any Tab components that are nested inside of this tab component's panels.
   * @returns {void}
   */
  resizeNestedTabs() {
    this.nestedTabControls.each((i, container) => {
      const c = $(container);
      const api = c.data('tabs');

      if (api && api.handleResize && typeof api.handleResize === 'function') {
        api.handleResize(true);
      }
    });
  },

  /**
   * Adds a new tab into the list and properly binds all of its events
   * @param {string} tabId a string representing the HTML `id` attribute of the new tab panel.
   * @param {object} options incoming options for the new tab.
   * @param {string} [options.name] the text title of the new tab.
   * @param {Array} [options.attributes] additional attributes needed for the new tab.
   * @param {boolean} [options.doActivate=false] if true, causes the newly-added tab to become activated and focused.
   * @param {boolean} [options.isDismissible=false] if true, causes the tab to become dismissible (closable) with an "X" button.
   * @param {boolean} [options.isDropdown=false] if true, causes the tab to become a dropdown tab.
   * @param {string} [options.content] representing HTML markup that will be added inside of the new tab panel.
   * @param {number} [atIndex] if defined, inserts the tab at a particular number index in the tab list.  Defaults to the last tab in the list.
   * @returns {this} component instance
   */
  add(tabId, options, atIndex) {
    if (!tabId) {
      return this;
    }

    if (!options) {
      options = {};
    }

    const startFromZero = this.tablist.find('li').not('.application-menu-trigger, .add-tab-button').length === 0;

    // Sanitize
    tabId = `${tabId.replace(/#/g, '')}`;
    options.name = options.name ? options.name.toString() : '&nbsp;';
    options.isDismissible = options.isDismissible ? options.isDismissible === true : false;
    options.isDropdown = options.isDropdown ? options.isDropdown === true : false;

    function getObjectFromSelector(sourceString) {
      const contentType = typeof sourceString;
      let hasId;

      switch (contentType) {
        case 'string':
          hasId = sourceString.match(/^#/g);
          // Text Content or a Selector.
          if (hasId !== null) {
            const obj = $(sourceString);
            sourceString = obj.length ? obj : sourceString;
          }
          // do nothing if it's just a string of text.
          break;
        default:
          break;
      }
      return sourceString;
    }

    if (options.content) {
      options.content = getObjectFromSelector(options.content);
    }
    if (options.dropdown) {
      options.dropdown = getObjectFromSelector(options.dropdown);
    }

    // Build
    const tabHeaderMarkup = $('<li class="tab" role="presentation"></li>');
    const anchorMarkup = $(`<a id="#${tabId}" href="#${tabId}" role="tab" aria-expanded="false" aria-selected="false" tabindex="-1">${xssUtils.escapeHTML(options.name)}</a>`);
    const tabContentMarkup = this.createTabPanel(tabId, options.content);
    let iconMarkup;

    tabHeaderMarkup.html(anchorMarkup);

    if (options.isDismissible) {
      iconMarkup = $.createIconElement({ icon: 'close', classes: 'close icon' });
      utils.addAttributes(iconMarkup, this, options.attributes, 'close-btn');
      tabHeaderMarkup.addClass('dismissible');
      tabHeaderMarkup.append(iconMarkup);
    }

    if (this.settings.tabCounts) {
      anchorMarkup.prepend('<span class="count">0 </span>');
    }

    if (options.dropdown) {
      // TODO: Need to implement the passing of Dropdown Tab menus into this method.
    }

    // Add additional attributes, if applicable.
    // NOTE: Do not add IDs this way.
    let attrs = this.settings.attributes || [];
    if (Array.isArray(options.attributes)) {
      attrs = attrs.concat(options.attributes);
    }
    if (attrs.length) {
      utils.addAttributes(anchorMarkup, this, attrs, `${tabId}-a`);
      utils.addAttributes(tabContentMarkup, this, attrs, `${tabId}-panel`);
    }

    function insertIntoTabset(self, targetIndex) {
      let method;
      const tabs = self.tablist.children('li');
      const nonSpecialTabs = tabs.not('.application-menu-trigger, .add-tab-button');
      let finalIndex = tabs.length - 1;

      if (!tabs.length) {
        tabHeaderMarkup.appendTo(self.tablist);
        tabContentMarkup.appendTo(self.container);
        return;
      }

      const addTabButton = tabs.filter('.add-tab-button');
      const appMenuTrigger = tabs.filter('.application-menu-trigger');

      // NOTE: Cannot simply do !targetIndex here because zero is a valid index
      if (targetIndex === undefined || targetIndex === null || isNaN(targetIndex)) {
        targetIndex = tabs.length;
      }

      function pastEndOfTabset(index) {
        return index > tabs.length - 1;
      }

      function atBeginningOfTabset(index) {
        return index <= 0;
      }

      if (tabs.length > nonSpecialTabs.length) {
        if (pastEndOfTabset(targetIndex) && addTabButton && addTabButton.length) {
          targetIndex -= 1;
        }

        if (atBeginningOfTabset(targetIndex) && appMenuTrigger && appMenuTrigger.length) {
          targetIndex += 1;
        }
      }

      const conditionInsertTabBefore = tabs.eq(targetIndex).length > 0;

      finalIndex = conditionInsertTabBefore ? targetIndex : finalIndex;

      method = 'insertAfter';
      if (conditionInsertTabBefore) {
        method = 'insertBefore';
      }

      tabHeaderMarkup[method](tabs.eq(finalIndex));
      tabContentMarkup.appendTo(self.container);
    }

    insertIntoTabset(this, atIndex);

    // Add each new part to their respective collections.
    this.panels = $(this.panels.add(tabContentMarkup));
    this.anchors = $(this.anchors.add(anchorMarkup));

    // Link the two items via data()
    anchorMarkup.data('panel-link', tabContentMarkup);
    tabContentMarkup.data('tab-link', anchorMarkup);
    // TODO: When Dropdown Tabs can be added/removed, add that here

    // Make it possible for Module Tabs to display a tooltip containing their contents
    // if the contents are cut off by ellipsis.
    if (this.settings.moduleTabsTooltips || this.settings.multiTabsTooltips) {
      anchorMarkup.on('beforeshow.toolbar', () => anchorMarkup.data('cutoffTitle') === 'yes').tooltip({
        content: `${anchorMarkup.text().trim()}`
      });
    }

    // Recalc tab width before detection of overflow
    if (this.isModuleTabs()) {
      this.adjustModuleTabs();
    }

    // Adjust tablist height
    this.setOverflow();

    // If started from zero, position the focus state/bar and activate the tab
    if (startFromZero) {
      this.positionFocusState(anchorMarkup);
      if (!this.activate(anchorMarkup.attr('href'))) {
        this.triggerEventAfterTabAdded(tabId);
        return this;
      }
      anchorMarkup.focus();
    }

    if (options.doActivate) {
      this.activate(anchorMarkup.attr('href'));
    }

    this.triggerEventAfterTabAdded(tabId);
    return this;
  },

  /**
   * Removes a tab from the list and cleans up properly
   * NOTE: Does not take advantage of _activatePreviousTab()_ due to specific needs
   * of selecting certain Tabs/Anchors at certain times.
   * @param {string} tabId tab ID that corresponds to a `.tab-panel` element's ID attribute
   * @param {boolean} disableBeforeClose whether or not tab closing can become veteoed
   * @returns {boolean|this} component instance
   */
  remove(tabId, disableBeforeClose) {
    const self = this;
    const targetLi = this.doGetTab(null, tabId);

    if (!targetLi || !targetLi.length) {
      return false;
    }

    const targetAnchor = targetLi.children('a');
    const targetPanel = this.getPanel(tabId);
    const hasTargetPanel = (targetPanel && targetPanel.length);
    const targetLiIndex = this.tablist.children('li').index(targetLi);
    const notATab = '.application-menu-trigger, .separator, .is-disabled';
    let prevLi = targetLi.prev();

    if (!disableBeforeClose) {
      const canClose = this.element.triggerHandler('beforeclose', [targetAnchor]);
      if (canClose === false) {
        return false;
      }
    }

    let wasSelected = false;
    if (targetLi.hasClass('is-selected')) {
      wasSelected = true;
    } else {
      prevLi = $(this.tablist.children('li').not(notATab).filter('.is-selected'));
    }

    // Remove these from the collections
    if (hasTargetPanel) {
      this.panels = $(this.panels.not(targetPanel));
    }
    this.anchors = $(this.anchors.not(targetAnchor));

    // Destroy Anchor tooltips, if applicable
    if (this.settings.moduleTabsTooltips || this.settings.multiTabsTooltips) {
      targetAnchor.off('beforeshow.toolbar').data('tooltip').destroy();
    }

    // Close Dropdown Tabs in a clean fashion
    const popupAPI = targetLi.data('popupmenu');
    if (targetLi.hasClass('has-popupmenu')) {
      if (popupAPI) {
        popupAPI.menu.children('li').each(function () {
          self.remove($(this).children('a').attr('href'));
        });
        popupAPI.destroy();
      }
    }

    // If this tab is inside of a Dropdown Tab's menu, detect if it was the last one
    // remaining, and if so, close the entire Dropdown Tab.
    // The actual check on these elements needs to be done AFTER the targetLi is removed
    // from a Dropdown Tab, to accurately check the number of list items remaining.
    // See: _isLastDropdownTabItem()_
    const parentMenu = targetLi.closest('.dropdown-tab');
    const trigger = parentMenu.data('trigger');

    // Kill associated events
    targetLi.find('.icon').off().removeData().remove();
    targetLi.off();
    targetAnchor.off();

    // Remove Markup
    targetLi.removeData().empty();
    targetLi.remove();
    if (hasTargetPanel) {
      targetPanel.removeData().empty();
      targetPanel.removeData();
      targetPanel.remove();
    }

    const menuItem = targetAnchor.data('moremenu-link');
    if (menuItem) {
      menuItem.parent().off().removeData().remove();
      targetAnchor.removeData();
    }

    function isLastDropdownTabItem(menu) {
      return menu.length && menu.children('li:not(.separator)').length === 0;
    }
    if (isLastDropdownTabItem(parentMenu)) {
      prevLi = this.getPreviousTab(trigger);

      setTimeout(() => {
        self.remove(trigger);
      }, 1);
    }

    // Close dropdown tab's menu
    if (trigger && trigger.length) {
      trigger.data('popupmenu').close();
    }

    // Recalc tab width before detection of overflow
    if (this.isModuleTabs()) {
      this.adjustModuleTabs();
    }

    // Adjust tablist height
    this.setOverflow();

    /**
     * Fires when a tab is removed from the tabset
     *
     * @event close
     * @memberof Tabs
     * @param {jQuery.Event} e event object
     * @param {jQuery} targetLi the tab list item being closed
     */
    this.element.trigger('close', [targetLi]);

    // If any tabs are left in the list, set the first available tab as the currently selected one.
    let count = targetLiIndex - 1;
    while (count > -1) {
      count = -1;
      if (prevLi.is(notATab)) {
        prevLi = this.tablist.children('li').not(notATab)[0];
        count -= 1;
      }
    }

    // If we find nothing, search for ANY available tab
    if (!prevLi || !prevLi.length) {
      prevLi = this.tablist.children('li').not(notATab).first();
    }

    // If there's really nothing, kick on out and defocus everything.
    if (!prevLi.length) {
      this.hideFocusState();

      this.element.trigger('afterclose', [targetLi]);
      return this;
    }

    const a = prevLi.children('a');
    let activateTargetA = a;

    this.positionFocusState(a);

    if (wasSelected) {
      if (prevLi.is('.has-popupmenu') && prevLi.data('popupmenu')) {
        activateTargetA = prevLi.data('popupmenu').menu.children().first().children('a');
      }
      if (!this.activate(activateTargetA.attr('href'))) {
        return this;
      }
    }

    a.focus();

    /**
     * Fires after a tab is completely removed from the tabset, and the close process has completed.
     *
     * @event afterclose
     * @memberof Tabs
     * @param {jQuery.Event} e event object
     * @param {jQuery} targetLi the tab list item being closed
     */
    this.element.trigger('afterclose', [targetLi]);

    return this;
  },

  /**
   * Adds a new tab into the list and properly binds all of its events
   * @param {string} tabId a string representing the HTML `id` attribute of the new tab panel.
   * @param {string} [content] representing HTML markup that will be added inside of the new tab panel.
   * @param {boolean} [doInsert=false] if true, actually appends the new content to the tab panel.
   * @returns {this} component instance
   */
  createTabPanel(tabId, content, doInsert) {
    tabId = tabId.replace(/#/g, '');

    // If a jQuery-wrapped element is provided, actually append the element.
    // If content is text/string, simply inline it.
    const markup = $(`<div id="${xssUtils.stripTags(tabId)}" class="tab-panel" role="tabpanel"></div>`);
    if (content instanceof $) {
      content = content[0].outerHTML;
    }
    DOM.html(markup[0], content || '', '*');

    if (doInsert === true) {
      this.container.append(markup);
    }

    this.panels = $(this.panels.add(markup));

    return markup;
  },

  /**
   * @param {jQuery} tab the tab to be checked for popupmenu items.
   * @returns {jQuery[]} a list of avaiable popupmenu items
   */
  checkPopupMenuItems(tab) {
    function getRemainingMenuItems(popupAPI) {
      if (!popupAPI || !popupAPI.menu) {
        return $();
      }
      const menu = popupAPI.menu;
      const items = menu.children('li');

      if (!items.length) {
        popupAPI.destroy();
        return $();
      }
      return items;
    }

    if (tab.is('.has-popupmenu')) {
      return getRemainingMenuItems(tab.data('popupmenu'));
    }

    const ddTab = tab.closest('.dropdown-tab');
    if (!ddTab.length) {
      return $();
    }
    return getRemainingMenuItems(ddTab.data('popupmenu'));
  },

  // @private
  getTab(e, tabId) {
    const self = this;
    const tab = $();

    function getTabFromEvent(ev) {
      const t = $(ev.currentTarget);
      if (t.is('.tab')) {
        return t;
      }
      if (t.closest('.tab').length) {
        return t.closest('.tab').first();
      }
      return null;
    }

    function getTabFromId(id) {
      if (!id || id === '' || id === '#') {
        return null;
      }

      if (id.indexOf('#') === -1) {
        id = `#${id}`;
      }

      const anchor = self.anchors.filter(`[href="${id}"]`);
      if (!anchor.length) {
        return null;
      }

      return anchor.parent();
    }

    // TabId can also be a jQuery object containing a tab.
    if (tabId instanceof $ && tabId.length > 0) {
      if (tabId.is('a')) {
        return tabId.parent();
      }
      return tabId;
    }

    if (e) {
      return getTabFromEvent(e);
    }
    if (tabId) {
      return getTabFromId(tabId);
    }

    return tab;
  },

  // @private
  doGetTab(e, tabId) {
    if (!e && !tabId) { return $(); }
    if (e && !(e instanceof $.Event) && typeof e !== 'string') {
      return $();
    }

    if (e) {
      if (typeof e !== 'string') { // jQuery Event
        return this.getTab(e);
      }
      return this.getTab(null, e); // String containing a selector
    }

    // Straight to the TabID
    return this.getTab(null, tabId);
  },

  /**
   * Hides a tab
   * @param {jQuery.Event} e the jQuery Event
   * @param {string} tabId a string representing the HTML `id` attribute of the new tab panel.
   * @returns {this} component instance
   */
  hide(e, tabId) {
    const tab = this.doGetTab(e, tabId);

    this.activateAdjacentTab(e, tabId);

    tab.addClass('hidden');

    const a = $(this.element.find('li.tab.is-selected')[0]).find('a');
    if (a[0]) {
      this.select(a[0].hash);
    }

    this.positionFocusState();
    return this;
  },

  /**
   * Shows a tab
   * @param {jQuery.Event} e the jQuery Event
   * @param {string} tabId a string representing the HTML `id` attribute of the new tab panel.
   * @returns {this} component instance
   */
  show(e, tabId) {
    const tab = this.doGetTab(e, tabId);

    tab.removeClass('hidden');
    const a = $(this.element.find('li.tab.is-selected')[0]).find('a');
    if (a[0]) {
      this.select(a[0].hash);
    }

    this.positionFocusState();
    return this;
  },

  /**
   * Disables an individual tab
   * @param {jQuery.Event} e the jQuery Event
   * @param {string} tabId a string representing the HTML `id` attribute of the new tab panel.
   * @returns {this} component instance
   */
  disableTab(e, tabId) {
    const tab = this.doGetTab(e, tabId);

    this.activateAdjacentTab(e, tabId);

    tab.addClass('is-disabled');
    this.positionFocusState();
    return this;
  },

  /**
   * Enables an individual tab
   * @param {jQuery.Event} e the jQuery Event
   * @param {string} tabId a string representing the HTML `id` attribute of the new tab panel.
   * @returns {this} component instance
   */
  enableTab(e, tabId) {
    const tab = this.doGetTab(e, tabId);

    tab.removeClass('is-disabled');
    this.positionFocusState();
    return this;
  },

  /**
   * Renames a tab and resets the focusable bar/animation.
   * @param {jQuery.Event} e the jQuery Event
   * @param {string} tabId a string representing the HTML `id` attribute of the tab panel.
   * @param {string} name the new tab name
   * @returns {void}
   */
  rename(e, tabId, name) {
    // Backwards compatibility with 4.2.0
    if (e && typeof e === 'string') {
      name = tabId;
      tabId = e;
    }

    if (!name) {
      return;
    }
    name = name.toString();

    const tab = this.doGetTab(e, tabId);
    const hasCounts = this.settings.tabCounts;
    const hasTooltip = this.settings.moduleTabsTooltips || this.settings.multiTabsTooltips;
    const hasDismissible = tab.hasClass('dismissible');
    const anchor = tab.children('a');
    let count;

    if (hasCounts) {
      count = anchor.find('.count').clone();
    }

    anchor.text(name);

    // Rename the tab inside a currently-open "More Tabs" popupmenu, if applicable
    if (this.popupmenu) {
      const moreAnchorSelector = tabId.charAt(0) !== '#' ? `#${tabId}` : tabId;
      const moreAnchor = this.popupmenu.menu.find(`a[href="${moreAnchorSelector}"]`);
      moreAnchor.text(name);

      if (hasDismissible) {
        moreAnchor.append($.createIconElement({ icon: 'close', classes: 'icon close' }));
      }
    }

    if (hasCounts) {
      anchor.prepend(count);
    }

    if (hasTooltip) {
      anchor.data('tooltip').setContent(name.trim());
    }

    const doesTabExist = this.tablist.children('li').length < 2 ? tab : undefined;

    this.positionFocusState(doesTabExist);
  },

  /**
   * For tabs with counts, updates the count and resets the focusable bar/animation
   * @param {jQuery.Event} e the jQuery Event
   * @param {string} tabId a string representing the HTML `id` attribute of the new tab panel.
   * @param {number|string} count the new tab count
   * @returns {void}
   */
  updateCount(e, tabId, count) {
    // Backwards compatibility with 4.2.0
    if (e && typeof e === 'string') {
      count = tabId;
      tabId = e;
    }

    if (!this.settings.tabCounts || !count) {
      return;
    }

    const tab = this.doGetTab(e, tabId);

    tab.children('a').find('.count').text(`${count.toString()} `);

    const doesTabExist = this.tablist.children('li').length < 2 ? tab : undefined;

    this.positionFocusState(doesTabExist);
  },

  /**
   * returns the currently active tab
   * @returns {jQuery} the currently active tab anchor
   */
  getActiveTab() {
    const visible = this.panels.filter(':visible');
    return this.anchors.filter(`[href="#${visible.first().attr('id')}"]`);
  },

  /**
   * returns all visible tabs
   * @returns {jQuery[]} all visible tabs
   */
  getVisibleTabs() {
    const self = this;
    let tabHash = $();

    this.tablist.find('li:not(.separator):not(.hidden):not(.is-disabled):not(.application-menu-trigger)')
      .each(function tabOverflowIterator() {
        const tab = $(this);

        if (!self.isTabOverflowed(tab)) {
          tabHash = tabHash.add(tab);
        }
      });

    return tabHash;
  },

  /**
   * returns a list of all tabs that are currently in the "More..." overflow menu.
   * @returns {jQuery[]} all overflowed tabs
   */
  getOverflowTabs() {
    const self = this;
    let tabHash = $();

    this.tablist.find('li:not(.separator):not(.hidden):not(.is-disabled):not(.application-menu-trigger)')
      .each(function tabOverflowIterator() {
        const tab = $(this);

        if (self.isTabOverflowed(tab)) {
          tabHash = tabHash.add(tab);
        }
      });

    return tabHash;
  },

  /**
   * @private
   * @returns {void}
   */
  setOverflow() {
    const self = this;
    const elem = this.element[0];
    const tablist = this.tablist[0];
    const HAS_MORE = 'has-more-button';
    const hasMoreIndex = this.hasMoreButton();
    const isScrollableTabs = this.isScrollableTabs();

    function checkModuleTabs() {
      if (self.isModuleTabs()) {
        self.adjustModuleTabs();
      }
    }

    // Recalc tab width before detection of overflow
    checkModuleTabs();

    let tablistStyle;
    let tablistHeight;
    let tablistContainerScrollWidth;
    let tablistContainerWidth;
    let overflowCondition;

    if (isScrollableTabs) {
      tablistContainerScrollWidth = this.tablistContainer[0].scrollWidth;
      tablistContainerWidth = this.tablistContainer[0].offsetWidth;
      overflowCondition = tablistContainerScrollWidth > tablistContainerWidth;
    } else {
      tablistStyle = window.getComputedStyle(tablist, null);
      tablistHeight = parseInt(tablistStyle.getPropertyValue('height'), 10) + 1; // +1 to fix an IE bug
      overflowCondition = tablist.scrollHeight > tablistHeight; // Normal tabs check the height
    }

    // Add "has-more-button" class if we need it, remove it if we don't
    // Always display the more button on Scrollable Tabs
    if (overflowCondition) {
      if (!hasMoreIndex) {
        elem.classList.add(HAS_MORE);
        checkModuleTabs();
      }
    } else if (hasMoreIndex) {
      elem.classList.remove(HAS_MORE);
      checkModuleTabs();
    }

    this.adjustSpilloverNumber();
  },

  /**
   * @private
   * @returns {void}
   */
  adjustModuleTabs() {
    const self = this;
    let sizeableTabs = this.tablist.find('li:not(.separator):not(.application-menu-trigger):not(:hidden)');
    const appTrigger = this.tablist.find('.application-menu-trigger');
    const hasAppTrigger = appTrigger.length > 0;
    const tabContainerW = this.tablist.outerWidth();
    const defaultTabSize = 120;
    let visibleTabSize = 120;
    const appTriggerSize = (hasAppTrigger ? appTrigger.outerWidth() : 0);

    // Remove overflowed tabs
    sizeableTabs.children('a').removeAttr('style');
    sizeableTabs.removeAttr('style').each(function () {
      const t = $(this);
      if (self.isTabOverflowed(t)) {
        sizeableTabs = sizeableTabs.not(t);
      }
    });

    // Resize the more button to fit the entire space if no tabs can show
    // Math: +101 is the padding of the <ul class="tab-list"> element
    if (!sizeableTabs.length) {
      visibleTabSize = (tabContainerW - appTriggerSize + 101);
      this.moreButton[0].style.width = `${visibleTabSize}px`;
      return;
    }
    const anchorStyle = window.getComputedStyle(sizeableTabs.eq(0).children()[0]);
    const anchorPadding = parseInt(anchorStyle.paddingLeft, 10) +
      parseInt(anchorStyle.paddingRight, 10);

    if (this.moreButton[0].hasAttribute('style')) {
      this.moreButton[0].removeAttribute('style');
    }

    // Math explanation:
    // Width of tab container - possible applcation menu trigger
    // Divided by number of visible tabs
    // (doesn't include app menu trigger which shouldn't change size).
    // Minus one (for the left-side border of each tab)
    visibleTabSize = ((tabContainerW - appTriggerSize) / sizeableTabs.length - 1);

    if (visibleTabSize < defaultTabSize) {
      visibleTabSize = defaultTabSize;
    }

    let a;
    let prevWidth;
    let cutoff = 'no';
    const isSideBySide = this.element.closest('.side-by-side').length === 1;

    for (let i = 0; i < sizeableTabs.length; i++) {
      a = sizeableTabs.eq(i).children('a');
      a[0].style.width = '';
      if (this.settings.moduleTabsTooltips === true || this.settings.multiTabsTooltips) {
        cutoff = 'no';

        prevWidth = parseInt(window.getComputedStyle(sizeableTabs[i]).width, 10);

        if (prevWidth > (visibleTabSize - anchorPadding)) {
          cutoff = 'yes';
        }
        a.data('cutoffTitle', cutoff);
      }

      let diff = 0;
      if (env.os.name === 'ios' && env.devicespecs.isMobile && isSideBySide) {
        diff = 25;
      }
      sizeableTabs[i].style.width = `${visibleTabSize - diff}px`;
      a[0].style.width = `${visibleTabSize - diff}px`;
    }

    this.adjustSpilloverNumber();
  },

  /**
   * @private
   * @returns {void}
   */
  adjustSpilloverNumber() {
    const moreDiv = this.moreButton.find('.more-text');
    const tabs = this.tablist.find('li:not(.separator):not(.hidden):not(.is-disabled):not(.application-menu-trigger)');
    const overflowedTabs = this.getOverflowTabs();

    if (tabs.length <= overflowedTabs.length) {
      moreDiv.text(`${Locale.translate('Tabs')}`);
    } else {
      moreDiv.text(`${Locale.translate('More')}`);
    }

    let countDiv = this.moreButton.find('.count');
    if (!countDiv.length) {
      countDiv = $('<span class="count"></span>');
      this.moreButton.children('span').first().prepend(countDiv);
    }

    countDiv.text(`${overflowedTabs.length} `);
  },

  /**
   * Selects a Tab
   * @param {string} href a string representing the HTML `id` attribute of the new tab panel.
   * @param {boolean} noFocus true to prevent focus.
   * @returns {void}
   */
  select(href, noFocus) {
    const modHref = href.replace(/#/g, '');
    const anchor = this.getAnchor(modHref);

    this.positionFocusState(undefined, false);

    if (!this.activate(anchor.attr('href'))) {
      return;
    }
    this.changeHash(modHref);

    if (!noFocus) {
      anchor.focus();
    }
  },

  /**
   * Builds tab popupmenu
   * @param {string} startingHref a string representing the HTML `href` attribute of the popupmenu item to be selected.
   * @returns {void}
   */
  buildPopupMenu(startingHref) {
    const self = this;
    if (self.popupmenu) {
      self.popupmenu.destroy();
      $('#tab-container-popupmenu').off('focus.popupmenu').removeData().remove();
      $(document).off('keydown.popupmenu');
    }

    // Build the new markup for the popupmenu if it doesn't exist.
    // Reset it if it does exist.
    let menuHtml = $('#tab-container-popupmenu');
    let shouldBeSelectable = '';
    if (this.isScrollableTabs()) {
      shouldBeSelectable = ' is-selectable';
    }

    if (menuHtml.length === 0) {
      menuHtml = $(`<ul id="tab-container-popupmenu" class="tab-list-spillover${shouldBeSelectable}">`).appendTo('body');
    } else {
      menuHtml.html('');
    }

    // Build menu options from overflowed tabs
    const tabs = self.tablist.children('li');
    const isRTL = Locale.isRTL();

    function buildMenuItem(item) {
      const $item = $(item);
      const $itemA = $item.children('a');

      if ($item.is(':hidden')) {
        return;
      }

      if (!self.isScrollableTabs() && !self.isTabOverflowed($item)) {
        return;
      }

      if ($item.is('.separator')) {
        $item.clone().appendTo(menuHtml);
        return;
      }

      const popupLi = $item.clone();
      const popupA = popupLi.children('a');

      popupLi[0].classList.remove('tab');
      if (popupLi[0].classList.contains('is-selected')) {
        popupLi[0].classList.remove('is-selected');
        if (self.isScrollableTabs()) {
          popupLi[0].classList.add('is-checked');
        }
      }

      popupLi[0].removeAttribute('style');

      popupLi.children('.icon').off().appendTo(popupA);
      popupLi.appendTo(menuHtml);

      // Link tab to its corresponding "More Tabs" menu option
      $item.data('moremenu-link', popupA);
      popupA.find('.icon-more').removeData().remove();

      // Link "More Tabs" menu option to its corresponding Tab.
      // Remove onclick methods from the popup <li> because they are called
      // on the "select" event in context of the original button
      popupA.data('original-tab', $itemA);
      popupA.onclick = undefined;

      if (!$item.is('.has-popupmenu')) {
        return;
      }

      // If this is a Dropdown Tab, clone its menu and add it to the "More Tabs" menu
      // As a submenu of the "popupLi".
      const submenu = $(`#${item.getAttribute('aria-controls')}`);
      const clone = submenu.clone();
      const cloneLis = clone.children('li');

      clone[0].classList.remove('has-popupmenu');

      cloneLis.each(function (i) {
        const li = $(this);
        const a = li.children('a');
        const originalLi = submenu.children('li').eq(i);
        const originalA = originalLi.children('a');

        a.data('original-tab', originalA);
        originalA.data('moremenu-link', a);
      });

      clone.insertAfter(popupA);
    }

    // Build spillover menu options
    for (let i = 0; i < tabs.length; i++) {
      buildMenuItem(tabs[i]);
    }

    self.tablist.children('li:not(.separator)').removeClass('is-focused');
    let xOffset = 1;
    if (!this.isScrollableTabs()) {
      xOffset = 3;
    }

    const attributes = self.settings.attributes;

    // Invoke the popup menu on the button.
    self.moreButton.popupmenu({
      autoFocus: false,
      attachToBody: true,
      menu: 'tab-container-popupmenu',
      trigger: 'immediate',
      offset: { x: xOffset },
      attributes
    });
    self.moreButton.addClass('popup-is-open');
    self.popupmenu = self.moreButton.data('popupmenu');

    self.positionFocusState(self.moreButton);

    function closeMenu() {
      $(this).off('close.tabs selected.tabs');
      self.moreButton.removeClass('popup-is-open');
      self.positionFocusState(undefined);
    }

    function selectMenuOption(e, anchor) {
      let href = anchor.attr('href');
      const id = href.substr(1, href.length);
      const tab = self.doGetTab(id) || $();
      let a = tab ? tab.children('a') : $();
      let originalTab = anchor.data('original-tab').parent();

      if (originalTab.is('.add-tab-button')) {
        a = self.handleAddButton();
        originalTab = a.parent();
        href = a.attr('href');
        self.element.trigger('tab-added', [a]);
      }

      self.activate(href);

      // Fire an onclick event associated with the original tab from the spillover menu
      if (tab.length && a.length && typeof a[0].onclick === 'function') {
        a[0].onclick.apply(a[0]);
      }

      // Focus the More Button
      // NOTE: If we switch the focusing-operations back to how they used to be
      // (blue bar moving around with the focus state)
      // remove the line below.
      self.moreButton.focus();

      self.scrollTabList(tab);
    }

    self.moreButton
      .on('close.tabs', closeMenu)
      .on('selected.tabs', selectMenuOption);

    const menu = self.popupmenu.menu;

    function handleDestroy() {
      menu.off();
      self.hideFocusState();
      $('#tab-container-popupmenu').removeData().remove();
    }

    function handleDismissibleIconClick(e) {
      const icon = $(this);
      const li = icon.closest('li');

      if (!li.is('.dismissible') || !icon.is('.close')) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (li.is('.dismissible') && li.is('.has-popupmenu') && li.is('.submenu')) {
        const listMenu = li.find('.wrapper').children().children();
        const hrefs = [];
        $.each(listMenu, (i, item) => {
          hrefs.push(item.children[0].href);
        });
        self.closeDismissibleTabs(hrefs);
      } else {
        self.closeDismissibleTab(li.children('a').attr('href'));
      }
      self.popupmenu.close();
    }

    menu
      .on('destroy.popupmenu', handleDestroy)
      .on('touchend.popupmenu touchcancel.popupmenu', '.icon', handleDismissibleIconClick)
      .on('click.popupmenu', '.icon', handleDismissibleIconClick);

    // If the optional startingIndex is provided, focus the popupmenu on the matching item.
    // Otherwise, focus the first item in the list.
    if (startingHref) {
      self.popupmenu.highlight(menu.find(`a[href="${startingHref}"]`));
    } else if (self.tablist.children('.is-selected').length > 0) {
      self.popupmenu.highlight(menu.find(`a[href="${self.tablist.children('.is-selected').children('a').attr('href')}"]`));
    } else {
      self.popupmenu.highlight(menu.find('li:first-child > a'));
    }

    // Overrides a similar method in the popupmenu code that controls escaping of
    // this menu when pressing certain keys.  We override this here so that the
    // controls act in a manner as if all tabs are still visible (for accessiblity
    // reasons), meaning you can use left and right to navigate the popup menu options
    // as if they were tabs.
    $(document).bindFirst('keydown.popupmenu', (e) => {
      const key = e.which;
      const currentMenuItem = $(e.target);

      function isFocusedElement() {
        return this === document.activeElement;
      }

      function prevMenuItem() {
        // If the first item in the popup menu is already focused, close the menu and focus
        // on the last visible item in the tabs list.
        const first = menu.find('li:first-child > a');
        if (first.filter(isFocusedElement).length > 0) {
          e.preventDefault();
          $(document).off(e);
          self.popupmenu.close();
          self.findLastVisibleTab();
        }
      }

      function nextMenuItem() {
        // If the last item in the popup menu is already focused, close the menu and focus
        // on the first visible item in the tabs list.
        const last = menu.find('li:last-child > a');
        if (last.filter(isFocusedElement).length > 0 && last.parent().is(':not(.submenu)')) {
          e.preventDefault();
          $(document).off(e);
          self.popupmenu.close();

          if (self.settings.addTabButton) {
            self.addTabButton.focus();
            return;
          }
          if (self.hasMoreActions()) {
            self.moreActionsBtn.focus();
            return;
          }
          self.focusFirstVisibleTab();
        }
      }

      // Alt+Del or Alt+Backspace closes a dropdown tab item
      function closeDropdownMenuItem() {
        if (!e.altKey || !currentMenuItem.parent().is('.dismissible')) {
          return;
        }
        // self.popupmenu.close();
        self.closeDismissibleTab(currentMenuItem.attr('href'));
      }

      let pseudoKeycode;

      switch (key) {
        case 8:
        case 46:
          closeDropdownMenuItem(e);
          break;
        case 37: // left
          pseudoKeycode = isRTL ? 40 : 38;
          if (currentMenuItem.is('a')) {
            if (currentMenuItem.parent().is(':not(:first-child)')) {
              e.preventDefault(); // Prevent popupmenu from closing on left key
            }
            $(document).trigger({ type: 'keydown.popupmenu', which: pseudoKeycode });
          }
          break;
        case 38: // up
          prevMenuItem();
          break;
        case 39: // right
          pseudoKeycode = isRTL ? 38 : 40;
          if (currentMenuItem.is('a') && !currentMenuItem.parent('.submenu').length) {
            $(document).trigger({ type: 'keydown.popupmenu', which: pseudoKeycode });
          }
          break;
        case 40: // down
          nextMenuItem();
          break;
        default:
          break;
      }
    });
  },

  /**
   * Used for checking if a particular tab (in the form of a jquery-wrapped list item)
   * is spilled into the overflow area of the tablist container <UL>.
   * @param {jQuery} li tab list item
   * @returns {boolean} whether or not the tab is overflowed.
   */
  isTabOverflowed(li) {
    if (this.isVerticalTabs() || this.isScrollableTabs() || this.tablist.find('.arrange-dragging').length) {
      return false;
    }

    if (this.tablist.scrollTop() > 0) {
      this.tablist.scrollTop(0);
    }

    const liTop = Math.round(li[0].getBoundingClientRect().top);
    let tablistTop = Math.round(this.tablist[0].getBoundingClientRect().top + 1);

    // +1 to compensate for top border on Module Tabs
    if (this.isModuleTabs()) {
      tablistTop += 1;
    }

    return liTop > tablistTop;
  },

  /**
   * @returns {jQuery} representing the last visible tab.
   */
  findLastVisibleTab() {
    const tabs = this.tablist.children('li:not(.separator):not(.hidden):not(.is-disabled)');
    let targetFocus = tabs.first();

    // if Scrollable Tabs, simply get the last tab and focus.
    if (this.isScrollableTabs()) {
      return tabs.last().find('a').focus();
    }

    while (!(this.isTabOverflowed(targetFocus))) {
      targetFocus = tabs.eq(tabs.index(targetFocus) + 1);
    }

    return tabs.eq(tabs.index(targetFocus) - 1).find('a').focus();
  },

  /**
   * @returns {void}
   */
  focusFirstVisibleTab() {
    const tabs = this.tablist.children('li:not(.separator):not(.hidden):not(.is-disabled)');
    tabs.eq(0).find('a').focus();
  },

  /**
   * Wrapper for the Soho behavior _smoothScrollTo()_ that will determine scroll distance.
   * @param {jQuery[]} target - the target <li> or <a> tag
   * @param {number} duration - the time it will take to scroll
   * @returns {undefined}
   */
  scrollTabList(target) {
    if (!this.tablistContainer || !target || !(target instanceof $) || !target.length) {
      return;
    }

    const tabCoords = DOM.getDimensions(target[0]);
    const tabContainerDims = DOM.getDimensions(this.tablistContainer[0]);
    let d;

    const FADED_AREA = 40; // the faded edges on the sides of the tabset
    const adjustedLeft = tabCoords.left;
    const adjustedRight = tabCoords.right;

    if (adjustedLeft < tabContainerDims.left + FADED_AREA) {
      d = (Math.round(Math.abs(tabContainerDims.left - adjustedLeft)) * -1) - FADED_AREA;
    }
    if (adjustedRight > tabContainerDims.right - FADED_AREA) {
      d = Math.round(Math.abs(adjustedRight - tabContainerDims.right)) + FADED_AREA;
    }

    if (d === 0) {
      d = undefined;
    }

    // Scroll the tablist container
    this.tablistContainer.smoothScroll(d, 250);
  },

  /**
   * Hides the focus state, if it's visible.
   * @returns {void}
   */
  hideFocusState() {
    this.focusState.removeClass('is-visible');
  },

  /**
   * Updates the position of the focus state, to the tab/button that currently has focus.
   * @param {jQuery[]|HTMLElement} target the element that will receive the focus state
   * @param {boolean} [unhide] if true, unhides the focus state if it's previously been hidden.
   * @returns {void}
   */
  positionFocusState(target, unhide) {
    const self = this;

    // Recheck this and improve
    if (target !== undefined) {
      target = $(target);
    } else if (self.moreButton.hasClass('is-selected')) {
      target = self.moreButton;
    } else if (self.tablist.children('.is-selected').length > 0) {
      target = self.tablist.children('.is-selected').children('a');
    }

    if (!target || target === undefined || !target.length ||
      (target.is(this.moreButton) && this.isScrollableTabs())) {
      this.focusState.removeClass('is-visible');
      return;
    }

    // Use the parent <li> for anchors to get their dimensions.
    if (target.is('a')) {
      target = target.parent();
    }

    // Move the focus state from inside the tab list container, if applicable.
    // Put it back into the tab list container, if not.
    if (target.is('.add-tab-button, .tab-more')) {
      if (!this.focusState.parent().is(this.element)) {
        this.focusState.prependTo(this.element);
      }
    } else if (!this.focusState.parent().is(this.tablistContainer)) {
      this.focusState.prependTo(this.tablistContainer);
    }

    const focusStateElem = this.focusState[0];
    let targetPos = DOM.getDimensions(target[0]);
    const targetClassList = target[0].classList;
    const isNotHeaderTabs = (!this.isHeaderTabs() || this.isHeaderTabs() && this.element[0].classList.contains('alternate'));
    const isVerticalTabs = this.isVerticalTabs();
    const isRTL = Locale.isRTL();
    const tabMoreWidth = !isVerticalTabs ? this.moreButton.outerWidth(true) - 8 : 0;
    const parentContainer = this.element;
    const scrollingTablist = this.tablistContainer;
    const hasCompositeForm = parentContainer.parents('.composite-form').length;
    const hasHeader = parentContainer.parents('.header.has-tabs').length;
    const accountForPadding = scrollingTablist && this.focusState.parent().is(scrollingTablist);
    const widthPercentage = target[0].getBoundingClientRect().width / target[0].offsetWidth * 100;
    const isClassic = $('html[class*="classic-"]').length > 0;

    function adjustForParentContainer(targetRectObj, parentElement, tablistContainer, transformPercentage) {
      const parentRect = parentElement[0].getBoundingClientRect();
      let parentPadding;
      let tablistScrollLeft;

      // Adjust from the top
      targetRectObj.top -= parentRect.top - 2;
      if (isVerticalTabs) {
        targetRectObj.top += parentElement[0].scrollTop;
      }

      if (isRTL) {
        targetRectObj.right = parentRect.right - targetRectObj.right;
      } else {
        targetRectObj.left -= parentRect.left;
      }

      // If inside a scrollable tablist, account for the scroll position
      if (tablistContainer) {
        tablistScrollLeft = tablistContainer ? Math.abs(tablistContainer[0].scrollLeft) : 0;

        // Account for the container's scrolling
        targetRectObj.left += tablistScrollLeft;
        targetRectObj.right += tablistScrollLeft;

        // On RTL, remove the width of the controls on the left-most side of the tab container
        if (isRTL && !isNotHeaderTabs) {
          targetRectObj.left -= tabMoreWidth;
          targetRectObj.right -= tabMoreWidth;
        }

        // Composite Form has additional padding on the right
        if (isRTL && hasCompositeForm && !hasHeader) {
          targetRectObj.right -= 42;

          if (isRTL) {
            targetRectObj.width += 1;
          }
        }

        // Scaling
        if (transformPercentage < 99) {
          targetRectObj.width = (targetRectObj.width * 100) / transformPercentage;
          targetRectObj.left = (targetRectObj.left * 100) / transformPercentage;
          targetRectObj.right = (targetRectObj.right * 100) / transformPercentage;
        }

        if (accountForPadding) {
          parentPadding = parseInt(window.getComputedStyle(parentElement[0])[`padding${isRTL ? 'Right' : 'Left'}`], 10);
          targetRectObj.left += (isRTL ? parentPadding : (parentPadding * -1));
          targetRectObj.right += (isRTL ? parentPadding : (parentPadding * -1));
        }

        if (targetRectObj.right < 0) {
          targetRectObj.right = 0;
        }
      }

      if (isNotHeaderTabs && !isVerticalTabs && !self.isModuleTabs()) {
        targetRectObj.height; // eslint-disable-line
        targetRectObj.top += 2;
      }

      targetRectObj.height -= 4;
      if (!isClassic) {
        targetRectObj.top -= 10;
      }

      if (!self.element.hasClass('header-tabs')) {
        targetRectObj.top += 9;
        targetRectObj.height += 4;
      }

      return targetRectObj;
    }

    // Adjust the values one more time if we have tabs contained inside of a
    // page-container, or some other scrollable container.
    targetPos = adjustForParentContainer(targetPos, parentContainer, scrollingTablist, widthPercentage);

    let targetPosString = '';
    Object.keys(targetPos).forEach((key) => {
      if (targetPosString.length) {
        targetPosString += ' ';
      }
      targetPosString += `${key}: ${targetPos[key]}px;`;
    });
    focusStateElem.style.cssText = targetPosString;

    // build CSS string containing each prop and set it:

    const selected = targetClassList.contains('is-selected') ? 'add' : 'remove';
    focusStateElem.classList[selected]('is-selected');

    const doHide = unhide === true ? 'add' : 'remove';
    focusStateElem.classList[doHide]('is-visible');

    const focusedTab = this.element.find('.application-menu-trigger, .tab');
    if (focusedTab.length > 0 && focusedTab.hasClass('is-focused')) {
      focusStateElem.classList.add('is-visible');
    }
  },

  /**
   * Causes the entire tabset to reset with new settings.
   * @param {object} [settings] incoming settings
   * @returns {this} component instance
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }

    return this
      .teardown()
      .init();
  },

  /**
   * Disables all non-active tabs in the list
   * @returns {void}
   */
  disableOtherTabs() {
    return this.disable(true);
  },

  /**
   * Disables the entire Tab Component
   * @param {boolean} isPartial whether or not this disable call is a partial
   *  disabling of the tabset
   * @returns {void}
   */
  disable(isPartial) {
    if (!isPartial) {
      this.element.prop('disabled', true).addClass('is-disabled');
    }

    if (!this.disabledElems) {
      this.disabledElems = [];
    }

    const self = this;
    let tabs = this.tablist.children('li:not(.separator)');
    if (isPartial) {
      tabs = tabs.filter(':not(.application-menu-trigger)');
    }

    tabs.each(function () {
      const li = $(this);
      const a = li.children('a');

      if (isPartial && self.isActive(a.attr('href'))) {
        return;
      }

      if (li.is('.is-disabled') || a.prop('disabled') === true) {
        self.disabledElems.push({
          elem: li,
          originalTabindex: li.attr('tabindex'),
          originalDisabled: a.prop('disabled')
        });
      }

      li.addClass('is-disabled');
      a.prop('disabled', true);

      if (li.is('.application-menu-trigger') || li.is('.add-tab-button')) {
        return;
      }

      const panel = $(a.attr('href'));
      panel.addClass('is-disabled');
      panel.find('*').each(function () {
        const t = $(this);

        // These are shadow inputs.  They are already handled by virtue of running
        // .disable() on the original select tag.
        if (t.is('input.dropdown, input.multiselect')) {
          return;
        }

        if (t.attr('tabindex') === '-1' || t.attr('disabled')) {
          self.disabledElems.push({
            elem: t,
            originalTabindex: t.attr('tabindex'),
            originalDisabled: t.prop('disabled')
          });
        }

        t?.disable();
      });
    });

    this.moreButton.addClass('is-disabled');

    if (this.isModuleTabs() && !isPartial) {
      this.element.children('.toolbar').disable();
    }

    this.updateAria($());
  },

  /**
   * Enables the entire Tabs component
   * @returns {void}
   */
  enable() {
    this.element.prop('disabled', false).removeClass('is-disabled');

    const self = this;
    const tabs = this.tablist.children('li:not(.separator)');

    tabs.each(function () {
      const li = $(this);
      const a = li.children('a');

      li.removeClass('is-disabled');
      a.prop('disabled', false);

      if (li.is('.application-menu-trigger') || li.is('.add-tab-button')) {
        return;
      }

      const panel = $(a.attr('href'));
      panel.removeClass('is-disabled');
      panel.find('*').each(function () {
        const t = $(this);
        if (t.enable && typeof t.enable === 'function') {
          t.enable();
        }
      });

      $.each(self.disabledElems, (i, obj) => {
        const attrTarget = obj.elem.is('.tab') ? obj.elem.children('a') : obj.elem;
        if (obj.elem.disable && typeof obj.elem.disable === 'function') {
          obj.elem.disable();
        }

        if (obj.elem.is('li')) {
          obj.elem.addClass('is-disabled');
          return;
        }

        // These are shadow inputs.  They are already handled by virtue of
        // running .disable() on the original select tag.
        if (obj.elem.is('input.dropdown, input.multiselect')) {
          return;
        }

        obj.elem.attr('tabindex', obj.originalTabindex);
        attrTarget.prop('disabled', obj.originalDisabled);
      });
    });

    this.moreButton.removeClass('is-disabled');

    if (this.isModuleTabs()) {
      this.element.children('.toolbar').enable();
    }

    this.disabledElems = [];

    this.updateAria(this.tablist.find('.is-selected > a'));
  },

  /**
   * Pass-through for the `remove()` method, which gets used for removing a dismissible tab.
   * @param {string} tabId the ID of the target tab panel
   * @returns {this} component instance
   */
  closeDismissibleTab(tabId) {
    return this.remove(tabId);
  },

  /**
   * Remove top level dismissible tab with dropdown
   * @param {array} tabUrlArray the Array of urls from the target popupmenu
   */
  closeDismissibleTabs(tabUrlArray) {
    tabUrlArray.forEach((tabUrl) => {
      const tabId = tabUrl.match(/#.*/);
      return this.remove(tabId[0]);
    });
  },

  /**
   * Tears down this instance of the tabs component by removing events,
   * other components, and extraneous markup.
   * @returns {this} component instance
   */
  teardown() {
    this.panels.removeAttr('style');

    this.tablist
      .off()
      .removeAttr('role')
      .removeAttr('aria-multiselectable');

    const tabs = this.tablist.children('li');
    tabs
      .off()
      .removeAttr('role')
      .removeClass('is-selected');

    const dds = tabs.filter('.has-popupmenu');
    dds.each(function () {
      const popup = $(this).data('popupmenu');
      if (popup) {
        popup.menu.children('li:not(.separator)').each(function () {
          const li = $(this);
          const a = li.children('a');
          const panel = a.data('panel-link');

          $.removeData(a[0], 'panel-link');
          if (panel && panel.length) {
            $.removeData(panel[0], 'tab-link');
          }
        });
        popup.destroy();
      }
    });

    this.panels
      .off();

    this.anchors
      .off()
      .removeAttr('role')
      .removeAttr('aria-expanded')
      .removeAttr('aria-selected')
      .removeAttr('tabindex');

    if (this.ro) {
      this.ro.disconnect();
      delete this.ro;
    }

    if (this.settings.moduleTabsTooltips || this.settings.multiTabsTooltips) {
      this.anchors.each(function () {
        const api = $(this).data('tooltip');
        if (api && typeof api.destroy === 'function') {
          api.destroy();
        }
      });
    }

    this.element.off('focusout.tabs updated.tabs activated.tabs aftertabadded.tabs');
    $('body').off(`resize.tabs${this.tabsIndex}`);
    this.tabsIndex = undefined;

    if (this.moreButton.data('popupmenu')) {
      const popup = this.moreButton.data('popupmenu');
      popup.menu.find('li:not(.separator)').each(function () {
        const li = $(this);
        const a = li.children('a');

        if (a.data('original-tab')) {
          $.removeData(a[0], 'original-tab');
        }
      });
      popup.destroy();
    }

    this.removeHelperMarkupEvents();

    if (this.tablistContainer) {
      this.tablistContainer.off('mousewheel.tabs');
    }

    this.focusState.removeData().remove();
    this.focusState = undefined;

    $('.tab-panel input').off('error.tabs valid.tabs');

    if (this.addTabButton) {
      if (this.settings.addTabButtonTooltip) {
        this.addTabButton.data('tooltip').destroy();
      }
      this.addTabButton.remove();
      this.addTabButton = undefined;
    }
    this.element.find('.close.icon').remove();

    return this;
  },

  /**
   * Destroys this component instance, removing its attachment from its parent element.
   * @returns {void}
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Tabs, COMPONENT_NAME };
