import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

// jQuery Components
import '../button/button.jquery';
import '../popupmenu/popupmenu.jquery';
import '../tabs/tabs.jquery';
import '../toolbar/toolbar.jquery';
import '../wizard/wizard.jquery';

/**
 * Special Header with Toolbar at the top of the page used to faciliate SoHo Xi Nav Patterns
 * @class @Header
 * @constructor
 * @param {HTMLElement|jQuery[]} element the base element
 * @param {object} [settings] incoming settings
 * @param {boolean} [settings.demoOptions = true] Used to enable/disable default SoHo Xi options for demo purposes
 * @param {boolean} [settings.useBackButton = true] If true, displays a back button next to the title in the header toolbar
 * @param {boolean} [settings.useBreadcrumb = false] If true, displays a breadcrumb on drilldown
 * @param {boolean} [settings.usePopupmenu = false] If true, changes the Header Title into a popupmenu that can change the current page
 * @param {array} [settings.tabs = null] If defined as an array of Tab objects, displays a series of tabs that represent application sections
 * @param {array} [settings.wizardTicks = null] If defined as an array of Wizard Ticks, displays a Wizard Control that represents steps in a process
 * @param {boolean} [settings.useAlternate = null] If true, use alternate background/text color for sub-navigation areas
 * @param {boolean} [settings.addScrollClass = false] If true a class will be added as the page scrolls up and down
 * to the header for manipulation. Eg: Docs Page.
 */
const COMPONENT_NAME = 'header';

const HEADER_DEFAULTS = {
  demoOptions: true,
  useBackButton: true,
  useBreadcrumb: false,
  usePopupmenu: false,
  tabs: null,
  wizardTicks: null,
  useAlternate: false,
  addScrollClass: false
};

function Header(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, HEADER_DEFAULTS);

  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

Header.prototype = {

  /**
   * @private
   * @returns {void}
   */
  init() {
    this
      .setup()
      .build()
      .handleEvents();

    // Theme, Personalization, Language Changer, Scrolling
    if (this.settings.demoOptions) {
      this.initPageChanger();
    }
  },

  /**
   * @private
   * @returns {this} component instance
   */
  setup() {
    // TODO: Settings all work independently, but give better descriptions
    this.settings.demoOptions = this.element.attr('data-demo-options') ? this.element.attr('data-demo-options') === 'true' : this.settings.demoOptions;
    this.settings.useBackButton = this.element.attr('data-use-backbutton') ? this.element.attr('data-use-backbutton') === 'true' : this.settings.useBackButton;
    this.settings.useBreadcrumb = this.element.attr('data-use-breadcrumb') ? this.element.attr('data-use-breadcrumb') === 'true' : this.settings.useBreadcrumb;
    this.settings.useAlternate = this.element.attr('data-use-alternate') ? this.element.attr('data-use-alternate') === 'true' : this.settings.useAlternate;

    this.settings.tabs = !$.isArray(this.settings.tabs) ? null : this.settings.tabs;
    this.settings.wizardTicks = !$.isArray(this.settings.wizardTicks) ? null :
      this.settings.wizardTicks;

    this.titleText = this.element.find('.title > h1');

    // Used to track levels deep
    this.levelsDeep = [];
    this.levelsDeep.push(`${this.titleText.text()}`);

    return this;
  },

  /**
   * @private
   * @returns {this} component instance
   */
  build() {
    this.toolbarElem = this.element.find('.toolbar');

    // Build toolbar if it doesn't exist
    if (!this.toolbarElem.data('toolbar')) {
      this.toolbarElem.toolbar();
    }
    this.toolbar = this.toolbarElem.data('toolbar');

    // Hamburger Icon is optional, but tracking it is necessary.
    this.titleButton = this.element.find('.title > .application-menu-trigger');
    this.hasTitleButton = this.titleButton.length > 0;

    if (this.hasTitleButton) {
      this.toolbarElem.addClass('has-title-button');
      const appMenu = $('#application-menu').data('applicationmenu');
      if (appMenu) {
        appMenu.modifyTriggers([this.titleButton], null, true);
      } else {
        $('#application-menu').applicationmenu({
          triggers: [this.titleButton]
        });
      }
    }

    // Application Tabs would be available from the Application Start, so activate
    // them during build if they exist
    if (this.settings.tabs && this.settings.tabs.length) {
      this.buildTabs();
    }

    if (this.settings.wizardTicks && this.settings.wizardTicks.length) {
      this.buildWizard();
    }

    if (this.settings.usePopupmenu) {
      this.buildPopupmenu();
    }

    // Add a Scrolling Class to manipulate the header
    if (this.settings.addScrollClass) {
      const self = $(this.element);
      const scrollDiv = $(this.element).next('.scrollable');
      const container = (scrollDiv.length === 1 ? scrollDiv : $(window));
      const scrollThreshold = this.settings.scrollThreshold ? this.settings.scrollThreshold : 15;

      container.on('scroll.header', function () {
        if (this.scrollTop > scrollThreshold) {
          self.addClass('is-scrolled-down');
        } else {
          self.removeClass('is-scrolled-down');
        }
      });

      if (container.scrollTop() > scrollThreshold) {
        self.addClass('is-scrolled-down');
      }
    }

    return this;
  },

  /**
   * @private
   * @returns {void}
   */
  buildTitleButton() {
    if (this.levelsDeep.length > 1 && !this.hasTitleButton && !this.titleButton.length) {
      this.titleButton = $('<button class="btn-icon back-button" type="button"></button>');
      this.titleButton.html(`<span class="audible">${Locale.translate('Drillup')}</span>` +
        '<span class="icon app-header go-back">' +
          '<span class="one"></span>' +
          '<span class="two"></span>' +
          '<span class="three"></span>' +
        '</span>');
      this.titleButton.prependTo(this.element.find('.title'));

      // Need to trigger an update on the toolbar control to make sure tabindexes
      // and events are all firing on the button
      this.toolbar.element.triggerHandler('updated');
    }

    this.titleButton.find('.icon.app-header').addClass('go-back');
  },

  /**
   * Used for adding a Breadcrumb Element to the Header
   * @returns {void}
   */
  buildBreadcrumb() {
    const self = this;
    let breadcrumbClass = 'has-breadcrumb';

    if (this.settings.useAlternate) {
      breadcrumbClass = 'has-alternate-breadcrumb';
    }
    this.element.addClass(breadcrumbClass);

    this.breadcrumb = this.element.find('.breadcrumb');
    if (!this.breadcrumb.length) {
      this.breadcrumb = $('<nav class="breadcrumb" role="navigation" style="display: none;"></nav>').appendTo(this.element);
      this.breadcrumb.on('click', 'a', (e) => {
        self.handleBreadcrumbClick(e);
      });
    }

    this.breadcrumb[this.settings.useAlternate ? 'addClass' : 'removeClass']('alternate');
    this.adjustBreadcrumb();
  },

  /**
   * Builds Breadcrumb markup that reflects the current state of the application
   * @returns {void}
   */
  adjustBreadcrumb() {
    const last = this.levelsDeep[this.levelsDeep.length - 1];
    this.breadcrumb.empty();

    const bcMarkup = $('<ol aria-label="breadcrumb"></ol>').appendTo(this.breadcrumb);
    $.each(this.levelsDeep, (i, txt) => {
      let current = '';
      if (last === txt) {
        current = ' current';
      }

      bcMarkup.append($(`<li><a href="#" class="hyperlink${current}">${txt}</a></li>`));
    });
  },

  /**
   * Builds Header Tabs
   * @returns {void}
   */
  buildTabs() {
    this.tabsContainer = this.element.find('.tab-container');
    if (!this.tabsContainer.length) {
      this.tabsContainer = $('<div class="tab-container"></div>').appendTo(this.element);

      // TODO: Flesh this out so that the header control can build tabs based on options
      const tablist = $('<ul class="tab-list" role="tablist"></ul>').appendTo(this.tabsContainer);
      $('<li class="tab"><a href="#header-tabs-home" role="tab">SoHo Xi Controls | Patterns</a></li>').appendTo(tablist);
      $('<li class="tab"><a href="#header-tabs-level-1" role="tab">Level 1 Detail</a></li>').appendTo(tablist);
      $('<li class="tab"><a href="#header-tabs-level-2" role="tab">Level 2 Detail</a></li>').appendTo(tablist);
    }

    this.element.addClass(this.settings.useAlternate ? 'has-alternate-tabs' : 'has-tabs');
    this.tabsContainer[this.settings.useAlternate ? 'addClass' : 'removeClass']('alternate');

    // NOTE: For demo purposes the markup for tab panels is already inside the
    // Nav Patterns Test page.
    $('#header-tabs-level-1').removeAttr('style');
    $('#header-tabs-level-2').removeAttr('style');

    // Invoke Tabs Control
    this.tabsContainer.tabs({
      containerElement: '#maincontent'
    });
  },

  /**
   * Builds a Header Wizard
   * @returns {void}
   */
  buildWizard() {
    this.element.addClass('has-wizard');

    this.wizard = this.element.find('.wizard');
    if (!this.wizard.length) {
      this.wizard = $('<div class="wizard"></div>').appendTo(this.element);
      const header = $('<div class="wizard-header"></div>').appendTo(this.wizard);
      const bar = $('<div class="bar"></div>').appendTo(header);
      $('<div class="completed-range"></div>').appendTo(bar);

      // TODO: Flesh this out so the header control can build the Wizard Ticks based on options
      $('<a href="#" class="tick current"><span class="label">Context Apps</span></a>').appendTo(bar);
      $('<a href="#" class="tick"><span class="label">Utility Apps</span></a>').appendTo(bar);
      $('<a href="#" class="tick"><span class="label">Inbound Configuration</span></a>').appendTo(bar);
      $('<a href="#" class="tick"><span class="label">OID Mapping</span></a>').appendTo(bar);
    }

    this.wizard[this.settings.useAlternate ? 'addClass' : 'removeClass']('alternate');

    // NOTE: For Demo Purposes, the shifting forms associated with the Wizard are coded
    // inside the Nav Patterns Test page.
    // TODO: Build shifting forms

    // Invoke the Wizard Control
    this.wizard.wizard();
  },

  /**
   * Builds a Popupmenu in place of the usual Title text, to allow for context swapping.
   * @returns {void}
   */
  buildPopupmenu() {
    const title = this.toolbarElem.children('.title');
    this.titlePopup = title.find('.btn-menu');
    if (!this.titlePopup.length) {
      const heading = title.find('h1'); // If H1 doesn't exist here, you're doing it wrong.
      heading.wrap('<button id="header-menu" type="button" class="btn-menu"></button>');
      this.titlePopup = heading.parent('.btn-menu');
    }
    this.titlePopupMenu = this.titlePopup.next('.popupmenu');
    if (!this.titlePopupMenu.length) {
      this.titlePopupMenu = $('<ul class="popupmenu is-selectable"></ul>').insertAfter(this.titlePopup);
      $('<li class="is-checked"><a href="#">Page One Title</a></li>' +
        '<li><a href="#">Page Two Title</a></li>' +
        '<li><a href="#">Page Three Title</a></li>' +
        '<li class="is-disabled"><a href="#">Page Four Title</a></li>' +
        '<li><a href="#">Page Five Title</a></li>').appendTo(this.titlePopupMenu);
    }
    this.titlePopupMenu.addClass('is-selectable');

    // Set the text on the Title
    this.titlePopup.children('h1').text(this.titlePopupMenu.children().first().text());

    // Invoke the Popupmenu on the Title
    this.titlePopup.button().popupmenu();

    // Update the Header toolbar to account for the new button
    this.toolbarElem.triggerHandler('updated');
  },

  /**
   * Sets up header-level events
   * @fires Header#events
   * @listens updated
   * @listens reset
   * @listens drilldown
   * @listens drillup
   * @listens click
   * @listens selected
   * @returns {this} component instance
   */
  handleEvents() {
    const self = this;

    this.element
      .on('updated.header', (e, settings) => {
        self.updated(settings);
      })
      .on('reset.header', () => {
        self.reset();
      })
      .on('drilldown.header', (e, viewTitle) => {
        self.drilldown(viewTitle);
      })
      .on('drillup.header', (e, viewTitle) => {
        self.drillup(viewTitle);
      });

    // Events for the title button.  e.preventDefault(); stops Application Menu
    // functionality while drilled
    this.titleButton.bindFirst('click.header', (e) => {
      if (self.levelsDeep.length > 1) {
        e.stopImmediatePropagation();
        self.drillup();
        e.returnValue = false;
      }
    });

    // Popupmenu Events
    if (this.settings.usePopupmenu) {
      this.titlePopup.on('selected.header', function (e, anchor) {
        $(this).children('h1').text(anchor.text());
      });
    }

    return this;
  },

  /**
   * Handles click events on Breadcrumb elements
   * @param {jQuery.Event} e `click` event
   * @returns {void}
   */
  handleBreadcrumbClick(e) {
    const selected = $(e.target).parent();
    const breadcrumbs = this.breadcrumb.find('li');
    const selectedIndex = breadcrumbs.index(selected);
    let delta;

    if (selected.hasClass('current')) {
      return;
    }

    if (selectedIndex === 0) {
      this.reset();
      return;
    }

    if (selectedIndex < breadcrumbs.length - 1) {
      delta = (breadcrumbs.length - 1) - selectedIndex;
      while (delta > 0) {
        this.drillup();
        delta -= 1;
      }
    }
  },

  /**
   * Sets up the `selected` events on the More Actions area of the header, which can include
   * Menu Options for changing the current theme, persoanlization colors, and language locale.
   * @param {jQuery.Event} e `click` event
   * @returns {void}
   */
  initPageChanger() {
    this.element.find('.page-changer').on('selected.header', (e, link) => {
      // Change Theme
      if (link.attr('data-theme')) {
        const theme = link.attr('data-theme');
        $('body').trigger('changetheme', theme.replace('-theme', ''));
        return;
      }

      // TODO: Change Lang
      if (link.attr('data-lang')) {
        Locale.set(link.attr('data-lang'));
        return;
      }

      // Change Color
      const color = link.attr('data-rgbcolor');
      $('body').trigger('changecolors', [color]);
    });
  },

  /**
   * Drills deeper into a breadcrumb structure while updating the Header title to reflect state.
   * @param {string} viewTitle text contents to put in place of the title area.
   * @returns {void}
   */
  drilldown(viewTitle) {
    this.element.addClass('is-drilldown');
    this.levelsDeep.push(viewTitle.toString());
    this.titleText.text(this.levelsDeep[this.levelsDeep.length - 1]);

    if (this.settings.useBackButton) {
      this.buildTitleButton();
    }

    if (this.settings.useBreadcrumb) {
      if (!this.breadcrumb || !this.breadcrumb.length) {
        this.buildBreadcrumb();
        this.breadcrumb.css({ display: 'block', height: 'auto' });
      } else {
        this.adjustBreadcrumb();
      }
    }
  },

  /**
   * Moves up into a breadcrumb structure while updating the Header title to reflect state.
   * @param {string} viewTitle text contents to put in place of the title area.
   * @returns {void}
   */
  drillup(viewTitle) {
    let title;
    this.element.removeClass('is-drilldown');

    if (this.levelsDeep.length > 1) {
      this.levelsDeep.pop();
      title = this.levelsDeep[this.levelsDeep.length - 1];
    }

    if (viewTitle !== undefined) {
      title = viewTitle;
    }

    if (this.levelsDeep.length > 1) {
      if (this.settings.useBreadcrumb) {
        this.adjustBreadcrumb();
      }
      this.titleText.text(title);
      return;
    }

    // Completely reset all the way back to normal
    title = this.levelsDeep[0];

    if (this.settings.useBackButton) {
      this.removeButton();
    }
    if (this.settings.useBreadcrumb) {
      this.removeBreadcrumb();
    }
    if (this.settings.usePopupmenu) {
      this.removePopupmenu();
    }

    this.titleText.text(title);
    this.element.trigger('drillTop');
  },

  /**
   * Reset the toolbar to its default removing the drilled in patterns.
   * @returns {this} component instance
   */
  reset() {
    while (this.levelsDeep.length > 1) {
      this.levelsDeep.pop();
    }
    this.titleText.text(this.levelsDeep[0]);

    this.removeBreadcrumb();
    this.removeTabs();
    this.removeWizard();
    this.removePopupmenu();
    this.removeButton();

    this.element.trigger('afterreset');
    return this;
  },

  /**
   * Removes a previously-built Button pattern from the Header.
   * @returns {void}
   */
  removeButton() {
    if (this.hasTitleButton) {
      this.titleButton.find('.icon.app-header').removeClass('go-back');
      return;
    }

    if (this.titleButton && this.titleButton.length) {
      this.titleButton.remove();
      this.titleButton = $();

      // Need to trigger an update on the toolbar control to make sure
      // tabindexes and events are all firing on the button
      this.toolbar.element.triggerHandler('updated');
    }
  },

  /**
   * Removes a previously-built Breadcrumb structure from the Header.
   * @returns {void}
   */
  removeBreadcrumb() {
    if (!this.breadcrumb || !this.breadcrumb.length) {
      return;
    }

    const self = this;
    const transitionEnd = $.fn.transitionEndName();
    let timeout;

    function destroyBreadcrumb() {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      self.element.off(`${transitionEnd}.breadcrumb-header`);
      self.breadcrumb.off().remove();
      self.breadcrumb = $();
    }

    self.element.removeClass('has-breadcrumb').removeClass('has-alternate-breadcrumb');
    if (this.breadcrumb.is(':not(:hidden)')) {
      this.element.one(`${transitionEnd}.breadcrumb-header`, destroyBreadcrumb);
      timeout = setTimeout(destroyBreadcrumb, 300);
    } else {
      destroyBreadcrumb();
    }
  },

  /**
   * Removes a previously-built Header Tabs pattern from the Header.
   * @returns {void}
   */
  removeTabs() {
    if (!this.tabsContainer || !this.tabsContainer.length) {
      return;
    }

    const self = this;
    const transitionEnd = $.fn.transitionEndName();
    let timeout;

    function destroyTabs() {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      self.element.off(`${transitionEnd}.tabs-header`);
      self.tabsContainer.data('tabs').destroy();
      self.tabsContainer.remove();
      self.tabsContainer = null;

      // NOTE: For demo purposes the markup for tab panels is already
      // inside the Nav Patterns Test page.
      $('#header-tabs-level-1').css('display', 'none');
      $('#header-tabs-level-2').css('display', 'none');
    }

    this.element.removeClass('has-tabs').removeClass('has-alternate-tabs');
    if (this.tabsContainer.is(':not(:hidden)')) {
      this.element.one(`${transitionEnd}.tabs-header`, destroyTabs);
      timeout = setTimeout(destroyTabs, 300);
    } else {
      destroyTabs();
    }
  },

  /**
   * Removes a previously-built Header Wizard pattern from the Header.
   * @returns {void}
   */
  removeWizard() {
    if (!this.wizard || !this.wizard.length) {
      return;
    }

    const self = this;
    const transitionEnd = $.fn.transitionEndName();
    let timeout;

    function destroyWizard() {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      self.element.off(`${transitionEnd}.wizard-header`);
      self.wizard.data('wizard').destroy();
      self.wizard.remove();
      self.wizard = null;
    }

    this.element.removeClass('has-wizard');
    if (this.wizard.is(':not(:hidden)')) {
      this.element.one(`${transitionEnd}.wizard-header`, destroyWizard);
      timeout = setTimeout(destroyWizard, 300);
    } else {
      destroyWizard();
    }
  },

  /**
   * Removes a previously-built Popupmenu pattern from the Header's title.
   * @returns {void}
   */
  removePopupmenu() {
    const self = this;

    if (!this.titlePopup || !this.titlePopup.length) {
      return;
    }

    this.titlePopup.data('popupmenu').destroy();
    this.titlePopup.data('button').destroy();
    this.titlePopupMenu.remove();
    this.titlePopup.children('h1').detach().insertBefore(self.titlePopup);
    this.titlePopup.remove();

    this.titlePopup = undefined;
    this.titlePopupMenu = undefined;

    this.toolbarElem.triggerHandler('updated');
  },

  /**
   * Removes bound events from the Header
   * @returns {this} component instance
   */
  unbind() {
    this.titleButton.off('click.header');
    this.element.off('drilldown.header drillup.header');
    return this;
  },

  /**
   * Sync up the ui with settings.
   * @param {object} [settings] incoming settings.
   * @returns {void}
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }

    this
      .reset()
      .unbind()
      .init();
  },

  /**
   * Teardown and destroy the menu and events.
   * @returns {void}
   */
  destroy() {
    this.unbind();
    if (this.hasTitleButton) {
      this.toolbarElem.removeClass('has-title-button');
    }

    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Header, COMPONENT_NAME };
