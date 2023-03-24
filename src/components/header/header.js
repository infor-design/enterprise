import * as debug from '../../utils/debug';
import { warnAboutDeprecation } from '../../utils/deprecated';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';
import { personalization } from '../personalize/personalize.bootstrap';
import { theme } from '../theme/theme';

// jQuery Components
import '../breadcrumb/breadcrumb.jquery';
import '../button/button.jquery';
import '../popupmenu/popupmenu.jquery';
import '../tabs/tabs.jquery';
import '../toolbar/toolbar.jquery';
import '../wizard/wizard.jquery';

// The Component Name
const COMPONENT_NAME = 'header';

/**
 * Special Header with Toolbar at the top of the page used to faciliate IDS Enterprise Nav Patterns
 * @class Header
 * @param {HTMLElement|jQuery[]} element the base element
 * @param {object} [settings] incoming settings
 * @param {boolean} [settings.addScrollClass = false] If true a class will be added as the page scrolls up and down
 * to the header for manipulation. Eg: Docs Page.
 * @param {boolean} [settings.demoOptions = true] Used to enable/disable default IDS Enterprise options for demo purposes
 * @param {array} [settings.tabs = null] If defined as an array of Tab objects, displays a series of tabs that represent application sections
 * @param {object} [settings.toolbarSettings = undefined] If defined, will be passed into the toolbar/toobarFlex component instance as settings
 * @param {boolean} [settings.useAlternate = null] If true, use alternate background/text color for sub-navigation areas
 * @param {boolean} [settings.useBackButton = true] If true, displays a back button next to the title in the header toolbar
 * @param {boolean} [settings.useBreadcrumb = false] If true, displays a breadcrumb on drilldown
 * @param {boolean} [settings.useFlexToolbar = false] If true, uses a Flex Toolbar component instead of a standard Toolbar component.
 * @param {boolean} [settings.usePopupmenu = false] If true, changes the Header Title into a popupmenu that can change the current page
 * @param {array} [settings.wizardTicks = null] If defined as an array of Wizard Ticks, displays a Wizard Control that represents steps in a process
 */
const HEADER_DEFAULTS = {
  addScrollClass: false,
  demoOptions: true,
  tabs: null,
  toolbarSettings: undefined,
  useAlternate: false,
  useBackButton: true,
  useBreadcrumb: false,
  useFlexToolbar: false,
  usePopupmenu: false,
  wizardTicks: null
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
   * @returns {Toolbar|ToolbarFlex|undefined} component instance, if applicable
   */
  get toolbarAPI() {
    if (!this.toolbarElem) {
      return undefined;
    }
    return this.toolbarElem.data('toolbar-flex') || this.toolbarElem.data('toolbar');
  },

  /**
   * @deprecated as of v4.18.0. Please use the `toolbarAPI` property instead.
   * @returns {Toolbar|ToolbarFlex|undefined} component instance, if applicable.
   */
  get toolbar() {
    warnAboutDeprecation('toolbarAPI', 'toolbar');
    return this.toolbarAPI;
  },

  /**
   * @returns {jQuery[]} reference to the Header's button for controlling drilling/navigation
   */
  get titleButton() {
    let query = '.title > button';
    if (this.toolbarElem && this.toolbarElem.is('.flex-toolbar')) {
      query = '.toolbar-section:first-child > button';
    }
    return this.element.find(query);
  },

  /**
   * @returns {boolean} true if this Header component contains a button that precedes the title
   */
  get hasTitleButton() {
    const btn = this.titleButton;
    return btn.length > 0;
  },

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
    let isFlex = false;
    const elem = this.element.find('.toolbar, .flex-toolbar');
    if (!elem.length) {
      return this;
    }
    if (elem.is('.flex-toolbar')) {
      isFlex = true;
    }
    this.toolbarElem = elem;

    // Build/update the toolbar instance
    const toolbarSettings = this.settings.toolbarSettings;
    this.toolbarElem[isFlex ? 'toolbarflex' : 'toolbar'](toolbarSettings);

    // Build the title button if one is not present, and we are drilled in at least one level deep.
    if (!this.hasTitleButton && this.levelsDeep.length > 1) {
      this.buildTitleButton();
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
   * @param {Object} colorsObj - list of personalization colors
   * @returns {Object} list of personalization color names including default
   */
  personalizationColors(colorsObj) {
    const colorNamesAndIds = Object.values(colorsObj)
      .reduce((acc, { id }) => {
        acc[id] = id;
        return acc;
      }, {});

    return colorNamesAndIds;
  },

  /**
   * Removes one or more classes from an element's classlist.
   * @private
   * @param {HTMLElement} elem - The DOM element whose classList we want to modify.
   * @param {(string|string[])} classes - The class or classes to remove from the element's classList.
   * Can be a string representing a single class name, or an array of strings representing multiple classes to remove.
   * @returns {boolean} Returns `false` if `elem` or `classes` are falsy, otherwise returns `true`.
   */
  removeClasses(elem, classes) {
    if (!elem || !classes) return false;

    const classList = elem.classList;
    if (classList) {
      if (typeof classes === 'string') {
        classList.remove(classes);
      } else if (Array.isArray(classes)) {
        classes.forEach(className => classList.remove(className));
      } else {
        throw new TypeError('Classes parameter must be a string or an array of strings.');
      }
    }

    return true;
  },

  /**
   * @private
   * @returns {void}
   */
  buildTitleButton() {
    if (this.levelsDeep.length > 1 && !this.hasTitleButton && !this.titleButton.length) {
      // Deconstruct Toolbar
      this.toolbarAPI.teardown();

      // Build Title Button
      const titleButton = $(`<button class="btn-icon back-button" type="button">
        <span class="audible">${Locale.translate('Drillup')}</span>
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-arrow-left"></use>
        </svg>
      </button>`);

      const titleElem = this.toolbarElem.find('.title');
      if (this.settings.useFlexToolbar) {
        let preTitleSection = titleElem.prev('.toolbar-section');
        if (!preTitleSection.length) {
          preTitleSection = $('<div class="toolbar-section"></div>').insertBefore(titleElem);
        }
        titleButton.prependTo(preTitleSection);
      } else {
        titleButton.prependTo(titleElem);
      }

      // Rebuild Toolbar
      this.toolbarAPI.init();
    }

    // Add CSS
    this.toolbarElem.addClass('has-title-button');
    this.titleButton.find('.icon.app-header').addClass('go-back');

    // Link to the App Menu as a trigger
    const appMenu = $('#application-menu').data('applicationmenu');
    if (appMenu) {
      appMenu.modifyTriggers([this.titleButton], null, true);
    } else {
      $('#application-menu').applicationmenu({
        triggers: [this.titleButton]
      });
    }

    this.handleTitleButtonEvents();
  },

  /**
   * @private
   * @returns {array} containing breadcrumb-friendly representation of the `levelsDeep` array
   */
  getCurrentBreadcrumbData() {
    const self = this;

    // Runs in the context of the BreadcrumbItem API
    function callback() {
      const i = this.index;
      const breadcrumbList = self.breadcrumbAPI.list;

      // Clicking on the current Breadcrumb Item does nothing
      if (this.current) {
        return;
      }

      // Clicking on the top-level breadcrumb resets the Header display
      if (i === 0) {
        self.reset();
        return;
      }

      let delta;
      let children = breadcrumbList.childNodes.length - 1;
      if (i < children) {
        delta = children - i;
        while (delta > 0) {
          self.drillup();
          self.breadcrumbAPI.remove(children, false, true);
          delta -= 1;
          children -= 1;
        }
      }

      self.breadcrumbAPI.render();
    }

    return this.levelsDeep.map((title, i) => {
      const id = `header-breadcrumb-${title.replace(' ', '-').toLowerCase()}`;
      const current = (i + 1) === self.levelsDeep.length;
      return {
        callback,
        content: title,
        current,
        id
      };
    });
  },

  /**
   * Used for adding a Breadcrumb Element to the Header
   * @private
   * @returns {void}
   */
  buildBreadcrumb() {
    let breadcrumbClass = 'has-breadcrumb';
    let style = 'default';

    if (this.settings.useAlternate) {
      breadcrumbClass = 'has-alternate-breadcrumb';
      style = 'alternate';
    }
    this.element.addClass(breadcrumbClass);

    this.breadcrumb = this.element.find('.breadcrumb');
    if (!this.breadcrumb.length) {
      this.breadcrumb = $('<nav class="breadcrumb hidden" role="navigation"></nav>').appendTo(this.element);
      this.breadcrumb.breadcrumb({
        breadcrumbs: this.getCurrentBreadcrumbData(),
        style
      });
      this.breadcrumbAPI = this.breadcrumb.data('breadcrumb');
    }

    this.adjustBreadcrumb();
  },

  /**
   * Builds Breadcrumb markup that reflects the current state of the application
   * @private
   * @returns {void}
   */
  adjustBreadcrumb() {
    if (!this.breadcrumbAPI) {
      return;
    }
    this.breadcrumbAPI.updated({
      breadcrumbs: this.getCurrentBreadcrumbData()
    });
  },

  /**
   * Builds Header Tabs
   * @private
   * @returns {void}
   */
  buildTabs() {
    this.tabsContainer = this.element.find('.tab-container');
    if (!this.tabsContainer.length) {
      this.tabsContainer = $('<div class="tab-container"></div>').appendTo(this.element);

      // TODO: Flesh this out so that the header control can build tabs based on options
      const tablist = $('<ul class="tab-list" role="tablist"></ul>').appendTo(this.tabsContainer);
      $('<li class="tab"><a href="#header-tabs-home" role="tab">IDS Enterprise Controls | Patterns</a></li>').appendTo(tablist);
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
   * @private
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
   * @private
   * @returns {void}
   */
  buildPopupmenu() {
    this.toolbarAPI.teardown();

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
    let selectedText = this.titlePopupMenu.children('.is-checked').first().text();
    if (!selectedText) {
      selectedText = this.titlePopupMenu.children().first().text();
    }
    this.titlePopup.children('h1').text(selectedText);

    // Invoke the Popupmenu on the Title
    this.titlePopup.button().popupmenu();

    // Update the Header toolbar to account for the new button
    this.element.addClass('has-popupmenu-title');
    this.toolbarAPI.init();
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
      .on(`updated.${COMPONENT_NAME}`, (e, settings) => {
        self.updated(settings);
      })
      .on(`reset.${COMPONENT_NAME}`, () => {
        self.reset();
      })
      .on(`drilldown.${COMPONENT_NAME}`, (e, viewTitle) => {
        self.drilldown(viewTitle);
      })
      .on(`drillup.${COMPONENT_NAME}`, (e, viewTitle) => {
        self.drillup(viewTitle);
      });

    $('html').on(`themechanged.${COMPONENT_NAME}`, () => {
      this.updatePageChanger();
    });

    // Events for the title button.  e.preventDefault(); stops Application Menu
    // functionality while drilled
    this.handleTitleButtonEvents();

    // Popupmenu Events
    if (this.titlePopup && this.titlePopup.length) {
      this.titlePopup.on(`selected.${COMPONENT_NAME}`, function (e, anchor) {
        let text;
        if (!(anchor instanceof $)) {
          // Toolbar Flex Item
          text = $(anchor.element).text();
        } else {
          // standard Toolbar
          text = anchor.text();
        }
        $(this).children('h1').text(text);
      });
    }

    return this;
  },

  /**
   * @private
   * @returns {void}
   */
  handleTitleButtonEvents() {
    if (!this.titleButton || !this.titleButton.length) {
      return;
    }

    this.titleButton.bindFirst(`click.${COMPONENT_NAME}`, (e) => {
      if (this.levelsDeep.length > 1) {
        e.stopImmediatePropagation();
        this.drillup();
        e.returnValue = false;
      }
    });
  },

  /**
   * Sets up the `selected` events on the More Actions area of the header, which can include
   * Menu Options for changing the current theme, persoanlization colors, and language locale.
   * @private
   * @param {jQuery.Event} e `click` event
   * @returns {void}
   */
  initPageChanger() {
    this.changer = this.element.find('.page-changer');
    if (!this.changer.length) {
      return;
    }

    const api = this.changer.data('popupmenu');
    const menu = api.menu;
    const colorArea = menu.find('li.personalization-colors');

    if (colorArea.length > 0) {
      const colors = theme.personalizationColors();
      let colorsHtml = colorArea.parent().hasClass('popupmenu') ? '' :
        '<li class="heading" role="presentation">Personalization</li>';

      Object.keys(colors).forEach((color) => {
        colorsHtml += `<li class="is-selectable${colors[color].name === 'Default' ? ' is-checked is-default' : ''}"><a href="#" data-rgbcolor="${colors[color].value}">${colors[color].name}</a></li>`;
        return color;
      });
      colorArea.replaceWith(colorsHtml);
    }

    this.changer.on('selected.header', (e, link) => {
      e.preventDefault();

      // handle `ToolbarFlexItem` types
      if (link !== undefined && !(link instanceof $) && link.element instanceof HTMLElement) {
        link = $(link.element);
      }

      // Change Theme with Mode
      const themeNameAttr = link.attr('data-theme-name');
      const themeModeAttr = link.attr('data-theme-mode');
      if (themeNameAttr || themeModeAttr) {
        const name = menu.find('.is-checked a[data-theme-name]').attr('data-theme-name');
        const mode = menu.find('.is-checked a[data-theme-mode]').attr('data-theme-mode');
        if (name && mode) {
          personalization.setTheme(`${name}-${mode}`);
        }
        return;
      }

      // Change Theme
      const themeAttr = link.attr('data-theme');
      if (themeAttr) {
        personalization.setTheme(themeAttr);
        return;
      }

      // Change Color
      const isDefault = link.parent().hasClass('is-default');
      if (isDefault) {
        personalization.setColorsToDefault();
        return;
      }
      const color = link.attr('data-rgbcolor');
      personalization.setColors(color);
    });

    // Mark theme as checked
    const currentTheme = theme.currentTheme;
    if (currentTheme.id !== 'theme-new-light' || currentTheme.id !== 'theme-uplift-light') {
      const themeParts = currentTheme.id.split('-');
      $('body').find('.popupmenu [data-theme-name]').parent().removeClass('is-checked');
      $('body').find(`.popupmenu [data-theme-name="${themeParts[0]}-${themeParts[1]}"]`).parent().addClass('is-checked');
      $('body').find('.popupmenu [data-theme-mode]').parent().removeClass('is-checked');
      $('body').find(`.popupmenu [data-theme-mode="${themeParts[2]}"]`).parent().addClass('is-checked');
    }

    if (personalization.settings.colors) {
      let colors = typeof personalization.settings.colors === 'object' ?
        personalization.settings.colors.header :
        personalization.settings.colors;
      colors = colors.replace('#', '');

      $('body').find('.popupmenu [data-rgbcolor]').parent().removeClass('is-checked');
      $('body').find(`.popupmenu [data-rgbcolor="#${colors}"]`).parent().addClass('is-checked');
    }
  },

  /**
   * Sets up the page changer after changing theme.
   * @private
   * @returns {void}
   */
  updatePageChanger() {
    if (!this.change || this.changer.length === 0) {
      return;
    }
    const api = this.changer.data('popupmenu');
    const menu = api.menu;
    const tags = menu.find('[data-rgbcolor]');
    const colors = theme.personalizationColors();
    const keys = Object.keys(colors);

    for (let i = 0; i < tags.length; i++) {
      tags[i].setAttribute('data-rgbcolor', colors[keys[i]].value);
    }
  },

  /**
   * Drills deeper into a breadcrumb structure while updating the Header title to reflect state.
   * @private
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
        this.breadcrumb.css({ display: 'block', height: 'auto' }).removeClass('hidden');
      } else {
        this.adjustBreadcrumb();
      }
    }
  },

  /**
   * Moves up into a breadcrumb structure while updating the Header title to reflect state.
   * @private
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
   * @private
   * @returns {void}
   */
  removeButton() {
    if (this.hasTitleButton) {
      this.titleButton.find('.icon.app-header').removeClass('go-back');
      return;
    }

    if (this.titleButton && this.titleButton.length) {
      this.toolbarAPI.teardown();

      // Check for an active App Menu, and remove from the internal triggers, if applicable.
      const appMenu = $('#application-menu').data('applicationmenu');
      if (appMenu) {
        appMenu.modifyTriggers([this.titleButton], true, true);
      }

      this.titleButton.off(`click.${COMPONENT_NAME}`).remove();
      this.titleButton = $();

      // Need to trigger an update on the toolbar control to make sure
      // tabindexes and events are all firing on the button
      this.toolbarAPI.init();
    }
  },

  /**
   * @public
   * Manually remove go-back class from button
   */
  removeBackButton() {
    if (!this.titleButton.length) {
      return;
    }
    this.element.find('.go-back').removeClass('go-back');
  },

  /**
   * Removes a previously-built Breadcrumb structure from the Header.
   * @private
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
      self.breadcrumbAPI.destroy();
      self.breadcrumb.remove();
      delete self.breadcrumbAPI;
      delete self.breadcrumb;
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
   * @private
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
   * @private
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
   * @private
   * @returns {void}
   */
  removePopupmenu() {
    const self = this;

    if (!this.titlePopup || !this.titlePopup.length) {
      return;
    }

    this.toolbarAPI.teardown();

    if (this.titlePopup.data('popupmenu')) {
      this.titlePopup.data('popupmenu').destroy();
    }
    if (this.titlePopup.data('popupmenu')) {
      this.titlePopup.data('button').destroy();
    }
    this.titlePopupMenu.remove();
    this.titlePopup.children('h1').detach().insertBefore(self.titlePopup);
    this.titlePopup.remove();

    this.titlePopup = undefined;
    this.titlePopupMenu = undefined;

    this.element.removeClass('has-popupmenu-title');

    this.toolbarAPI.init();
  },

  /**
   * Removes bound events from the Header
   * @private
   * @returns {this} component instance
   */
  unbind() {
    if (this.titleButton && this.titleButton.length) {
      this.titleButton.off(`click.${COMPONENT_NAME}`);
    }

    if (this.titlePopup && this.titlePopup.length) {
      this.titlePopup.off(`updated.${COMPONENT_NAME}`);
    }

    this.element.off([
      `updated.${COMPONENT_NAME}`,
      `reset.${COMPONENT_NAME}`,
      `drilldown.${COMPONENT_NAME}`,
      `drillup.${COMPONENT_NAME}`,
    ].join(' '));

    $('html').off(`themechanged.${COMPONENT_NAME}`);

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

    if (this.changer) {
      const api = this.changer.data('popupmenu');
      if (api && typeof api.destroy === 'function') {
        api.destroy();
      }
      this.changer.remove();
      delete this.changer;
    }

    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Header, COMPONENT_NAME };
