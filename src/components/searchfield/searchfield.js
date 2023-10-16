import { Environment as env } from '../../utils/environment';
import * as debug from '../../utils/debug';
import { warnAboutDeprecation } from '../../utils/deprecated';
import { breakpoints } from '../../utils/breakpoints';
import { utils } from '../../utils/utils';
import { xssUtils } from '../../utils/xss';

import { renderLoop, RenderLoopItem } from '../../utils/renderloop';
import { Locale } from '../locale/locale';

// jQuery Components
import '../autocomplete/autocomplete.jquery';
import '../button/button.jquery';
import '../popupmenu/popupmenu.jquery';

// Name of this component
const COMPONENT_NAME = 'searchfield';

// Types of collapse modes
const SEARCHFIELD_COLLAPSE_MODES = [false, 'mobile', true];

// Search Field Defaults
const SEARCHFIELD_DEFAULTS = {
  resultsCallback: undefined,
  allResultsCallback: undefined,
  showAllResults: true,
  showGoButton: false,
  goButtonCopy: undefined,
  goButtonAction: undefined,
  categories: undefined,
  categoryMultiselect: false,
  showCategoryText: false,
  source: undefined,
  template: undefined,
  clearable: false,
  collapsible: SEARCHFIELD_COLLAPSE_MODES[0],
  collapseSize: undefined,
  tabbable: true,
  autocompleteAttribute: 'off'
};

// Used throughout:
const TOOLBARSEARCHFIELD_EXPAND_SIZE = 280;
const MAX_TOOLBARSEARCHFIELD_EXPAND_SIZE = 450;

/**
 * The search field component.
 * @class SearchField
 * @param {jQuery[]|HTMLElement} element the base searchfield element
 * @param {object} [settings] incoming settings
 * @param {object} [settings.button]  A button to add besides the default buttons.
 * @param {function} [settings.resultsCallback] Callback function for getting typahead results on search.
 * @param {function} [settings.allResultsCallback] Callback function for getting "all results".
 * @param {boolean} [settings.showAllResults = true] If true the show all results link is showin in the list.
 * @param {boolean} [settings.showGoButton = false] If true a go button is associated.
 * @param {string} [settings.goButtonCopy] The text to use on the go button.
 * @param {function} [settings.goButtonAction] If defined as a function, will fire this callback on the Go Button "click"
 * @param {array} [settings.categories] If defined as an array, displays a dropdown containing categories that can be used to filter results.
 * @param {boolean} [settings.categoryMultiselect = false]  If true, creates a multiselectable categories list.
 * @param {boolean} [settings.showCategoryText = false]  If true, will show any available categories that are selected
 * to the left of the Dropdown field.
 * @param {function} [settings.source] Callback function for getting type ahead results.
 * @param {string} [settings.template] The html template to use for the search list
 * @param {boolean} [settings.clearable = true] If "true", provides an "x" button on the right edge that clears the field
 * @param {boolean} [settings.collapsible = true] If "true", allows the field to expand/collapse on larger breakpoints when
 * focused/blurred respectively
 * @param {boolean} [settings.collapsibleOnMobile = true] If true, overrides `collapsible` only on mobile settings.
 * @param {number|function} [settings.collapseSize=undefined] If true, configures the size of a toolbar searchfield when it's in it's "button", unfocused mode.  If defined as a function, gets a reference to this API as its primary argument, and returns a number.
 * @param {boolean} [settings.tabbable=true] If true, the x button will get a tab stop. For accessibility its reccomended to keep this on.
 * @param {string} [settings.autocompleteAttribute="off"] Allows prevention of built-in browser typeahead by changing/removing an `autocomplete` attribute to the field.
 */
function SearchField(element, settings) {
  this.element = $(element);

  // Backwards compatibility for old toolbars that had `collapsible` and `clearable` as the defaults
  if (this.toolbarParent && !this.isContainedByFlexToolbar && settings !== undefined) {
    if (settings.clearable === undefined) {
      settings.clearable = true;
    }
    if (settings.collapsible === undefined) {
      settings.collapsible = true;
      settings.tabbable = false;
    }
  }

  this.settings = utils.mergeSettings(element, settings, SEARCHFIELD_DEFAULTS);

  if (this.settings.collapsible) {
    this.settings.tabbable = false;
  }
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

SearchField.prototype = {

  /**
   * @returns {HTMLElement} a toolbar parent element, or `undefined`
   */
  get toolbarParent() {
    const toolbarParents = this.element.parents('.toolbar');
    const toolbarFlexParents = this.element.parents('.flex-toolbar');

    if (toolbarParents.add(toolbarFlexParents).length < 1) {
      return undefined;
    }

    if (toolbarFlexParents.length > 0) {
      return toolbarFlexParents.first()[0];
    }

    return toolbarParents.first()[0];
  },

  /**
   * @returns {HTMLElement} a buttonset element, or `undefined`
   */
  get buttonsetElem() {
    if (!this.toolbarParent) {
      return undefined;
    }
    return this.toolbarParent.querySelector('.buttonset');
  },

  /**
   * @returns {HTMLElement} a toolbar `.title` area, if one is present.
   */
  get titleElem() {
    if (!this.toolbarParent) {
      return undefined;
    }
    return this.toolbarParent.querySelector('.title');
  },

  /**
   * @returns {HTMLElement} a toolbar parent element, or `undefined`
   */
  get containmentParent() {
    const moduleTabs = this.element.closest('.module-tabs');
    if (moduleTabs.length) {
      return moduleTabs.first()[0];
    }
    return this.toolbarParent;
  },

  /**
   * @returns {HTMLElement} a reference to the input field
   */
  get input() {
    return this.element[0];
  },

  /**
    @returns {HTMLElement} a reference to an optional button with an attached Category selection menu
   */
  get categoryButton() {
    return this.wrapper.find('.searchfield-category-button');
  },

  /**
   * @returns {boolean} whether or not the searchfield can ever be collapsible.
   */
  get isCollapsible() {
    return this.settings.collapsible !== false;
  },

  /**
   * @returns {boolean} whether or not the searchfield is currently able to be collapsed.
   */
  get isCurrentlyCollapsible() {
    return this.settings.collapsible === true || this.settings.collapsible === 'mobile' || this.shouldBeFullWidth();
  },

  /**
   * @private
   * @returns {boolean} whether or not the parent toolbar is a Flex Toolbar
   */
  get isContainedByFlexToolbar() {
    if (!this.containmentParent) {
      return false;
    }

    return this.containmentParent.className.indexOf('flex-toolbar') > -1;
  },

  /**
   * @private
   * @returns {ToolbarFlexItem|undefined} if inside a Flex Toolbar, returns a reference to the corresponding Toolbar Flex Item API
   */
  get toolbarFlexItem() {
    let item;
    if (this.isContainedByFlexToolbar) {
      item = $(this.element).data('toolbarflexitem');
    }

    return item;
  },

  /**
   * @private
   * @returns {Autocomplete|undefined} a reference to the Searchfield's optional Autocomplete API
   */
  get autocompleteAPI() {
    return $(this.element).data('autocomplete');
  },

  /**
   * @returns {boolean} whether or not this is a context searchfield.
   */
  get isContextSearch() {
    return this.wrapper[0].className.indexOf('context') > -1;
  },

  /**
   * Initialization Kickoff
   * @private
   * @returns {void}
   */
  init() {
    this.coerceBooleanSettings();
    this.build();
    this.setupEvents();
  },

  /**
   * Builds the markup for this component.
   * @private
   * @returns {this} component instance
   */
  build() {
    // Used for managing events that are bound to $(document)
    if (!this.id) {
      this.id = utils.uniqueId(this.element, COMPONENT_NAME);
    }

    this.label = this.element.prev('label, .label');
    this.inlineLabel = this.element.closest('label');
    this.isInlineLabel = this.element.parent().is('.inline');

    // Invoke Autocomplete and store references to that and the popupmenu created by autocomplete.
    // Autocomplete settings are fed the same settings as Searchfield
    // NOTE: The `source` setting can be modified due to a conflict between a legacy Soho attribute,
    // `data-autocomplete`, having the same value as jQuery's `$.data('autocomplete')`.
    const autocompleteDataAttr = this.element.attr('data-autocomplete');
    if (autocompleteDataAttr && autocompleteDataAttr !== 'source') {
      this.settings.source = autocompleteDataAttr;
      this.element.removeAttr('data-autocomplete');
      $.removeData(this.element, 'autocomplete');
    }

    if (this.settings.source) {
      this.autocomplete = this.element.data('autocomplete');
      if (!this.autocomplete) {
        this.element.autocomplete(this.settings);
        this.autocomplete = this.element.data('autocomplete');
      } else {
        this.autocomplete.updated(this.settings);
      }
    }

    // Prevent browser typahead
    const autocompleteSetting = this.settings.autocompleteAttribute;
    if (typeof autocompleteSetting === 'string' && autocompleteSetting.length) {
      this.element.attr('autocomplete', `${xssUtils.ensureAlphaNumeric(autocompleteSetting)}`);
    } else if (this.element.hasAttr('autocomplete')) {
      this.element.removeAttr('autocomplete');
    }

    // Setup ARIA
    let label = this.element.attr('placeholder') || this.element.prev('label, .label').text().trim();
    if (!label || label === '') {
      label = Locale.translate('Keyword');
    }
    this.element.attr({
      'aria-label': label,
    });

    // Build the wrapper
    this.wrapper = this.element.parent('.searchfield-wrapper');
    if (!this.wrapper || !this.wrapper.length) {
      if (this.isInlineLabel) {
        this.wrapper = this.inlineLabel.addClass('searchfield-wrapper');
      } else {
        this.wrapper = this.element.wrap('<span class="searchfield-wrapper"></span>').parent();
      }
    }

    this.checkContents();

    // Add/remove custom collapse CSS identifier
    let collapseSizeMethod = 'remove';
    if (this.settings.collapsible && this.settings.collapseSize) {
      collapseSizeMethod = 'add';
    }
    this.wrapper[0].classList[collapseSizeMethod]('has-custom-collapse-size');

    // Label for toolbar-inlined searchfields needs to be inside the
    // wrapper to help with positioning.
    if (this.toolbarParent) {
      this.label.prependTo(this.wrapper);
      this.setInitalWidth();
    }

    const customClasses = ['context', 'alternate'];
    let c;

    for (let i = 0; i < customClasses.length; i++) {
      if (this.element.hasClass(customClasses[i])) {
        c = customClasses[i];
        this.wrapper.addClass(c);
        this.element.removeClass(c);
      }
    }

    // Backwards compatibility with collapsibleOnMobile
    // TODO: Remove in v4.9.0
    if (this.settings.collapsibleOnMobile === true) {
      this.settings.collapsible = SEARCHFIELD_COLLAPSE_MODES[1];
    }

    // Add/remove the collapsible functionality
    this.wrapper[0].classList[!this.settings.collapsible === true ? 'add' : 'remove']('non-collapsible');

    // Add/remove `toolbar-searchfield-wrapper` class based on existence of Toolbar Parent
    this.wrapper[0].classList[this.toolbarParent ? 'add' : 'remove']('toolbar-searchfield-wrapper');

    // Add test automation ids
    utils.addAttributes(this.element, this, this.settings.attributes, '', true);
    utils.addAttributes(this.wrapper, this, this.settings.attributes, 'wrapper', true);

    // Initially disable animations on toolbar searchfields
    // An event listener on Toolbar's `rendered` event removes these at the correct time
    if (this.toolbarParent && !this.isContainedByFlexToolbar) {
      this.element.add(this.wrapper).addClass('no-transition no-animation');
    }

    // Add Icon
    let icon = this.wrapper.find('.icon:not(.icon-dropdown)');
    if (!icon || !icon.length) {
      icon = $.createIconElement('search');
    }

    // Swap icon position to in-front if we have "context/has-categories" CSS class.
    const insertIconInFront = this.wrapper.hasClass('context') || this.wrapper.hasClass('has-categories');
    icon[insertIconInFront ? 'insertBefore' : 'insertAfter'](this.element).icon();

    // Change icon to a trigger button if we're dealing with categories
    if (this.hasCategories()) {
      this.wrapper.addClass('has-categories');

      if (!this.categoryButton.length) {
        $('<button type="button" class="btn searchfield-category-button"></button>').insertBefore(this.element);
      }
      icon.appendTo(this.categoryButton);
      icon = this.categoryButton;

      if (this.settings.showCategoryText) {
        this.wrapper.addClass('show-category');
      }

      let ddIcon = icon.find('.icon-dropdown');
      if (!ddIcon.length) {
        ddIcon = $.createIconElement({ classes: 'icon-dropdown', icon: 'dropdown' }).icon();
      }
      ddIcon.appendTo(icon);

      const popupAPI = this.categoryButton.data('popupmenu');
      if (!popupAPI) {
        this.list = this.wrapper.find('ul.popupmenu');
        if (!this.list || !this.list.length) {
          this.list = $('<ul class="popupmenu"></ul>');
        }

        // Handle Single vs Multi-Selectable Lists
        const categoryListType = this.settings.categoryMultiselect ? 'is-multiselectable' : 'is-selectable';
        this.list.addClass(categoryListType);
        let removeListType = 'is-selectable';
        if (!this.settings.categoryMultiselect) {
          removeListType = 'is-multiselectable';
        }
        this.list.removeClass(removeListType);

        this.setCategories(this.settings.categories);

        this.list.insertAfter(this.element);

        const self = this;
        this.categoryButton.popupmenu({
          menu: this.list,
          offset: {
            y: 10
          },
          returnFocus() {
            if (self.isFocused) {
              self.element.focus();
            }
          }
        });
      } else {
        this.setCategories(this.settings.categories);
      }

      this.setCategoryButtonText();
    }

    // Flex Toolbar Searchfields contain an extra button for use as a closing trigger
    if (this.isContainedByFlexToolbar) {
      if (!this.collapseButton || !this.collapseButton.length) {
        this.collapseButton = $(`
          <button class="btn-secondary collapse-button" type="button">
            <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
              <use href="#icon-exit-fullview"></use>
            </svg>
            <span class="audible">${Locale.translate('Collapse')}</span>
          </button>
        `);
      }
      this.wrapper[0].classList.add('has-collapse-button');
      this.element.after(this.collapseButton);
    } else {
      this.wrapper[0].classList.remove('has-collapse-button');
    }

    // Pull a Go Button from markup, if applicable.
    let goButton = this.wrapper.next('.go-button');
    if (!goButton.length) {
      goButton = this.wrapper.find('.go-button');
    }

    if (goButton.length) {
      this.settings.showGoButton = true;
      this.goButton = goButton;
      this.element.after(this.goButton);
    }

    // Add a "Go" Button from scratch if we enable the setting
    if (this.settings.showGoButton) {
      if (!this.goButton || !this.goButton.length) {
        this.goButton = $(`
          <button class="btn-secondary go-button">
            <span>${this.settings.goButtonCopy || Locale.translate('Go', { showBrackets: false })}</span>
          </button>
        `);
      }
      this.goButton[0].setAttribute('id', utils.uniqueId(this.goButton, 'searchfield-go-button-'));
      this.wrapper.addClass('has-go-button');
      this.element.after(this.goButton);
      this.goButton.button();
    } else {
      this.wrapper.removeClass('has-go-button');
    }

    if (this.settings.clearable) {
      this.makeClearable();
    }

    if (this.settings.button) {
      this.wrapper.addClass('has-custom-button');
      this.customButton = $('<button class="btn-icon custom-button"></button>');
      this.customButton.append($.createIconElement(this.settings.button.icon));
      this.element.after(this.customButton);
    }

    // Stagger a calculation for setting the size of the Searchfield element, if applicable
    const self = this;
    const resizeTimer = new RenderLoopItem({
      duration: 1,
      updateCallback() {}, // TODO: make this work without an empty function
      timeoutCallback() {
        self.calculateSearchfieldWidth();
      }
    });
    renderLoop.register(resizeTimer);

    let wrapperWidth = 0;

    // when the window size changes, searchfield
    // should calculate its width so that the input
    // does not overflow the buttons/icons contained
    // in it
    $('body').on(`resize.${this.id}`, () => {
      // searchfield wrapper only changes width if it's in a splitter container
      if (self.wrapper.parents('.splitter-container').length > 0) {
        if (self.wrapper.width() >= self.wrapper.parent().width() || wrapperWidth >= self.wrapper.parent().width()) {
          self.wrapper.width(`${self.wrapper.parent().width() - (self.wrapper.parent().width() * 0.1)}px`);
        } else {
          self.wrapper.css('width', '');
        }
      }
      self.calculateSearchfieldWidth();
    });

    if (this.settings.collapsible === false) {
      this.expand(true);
    }

    wrapperWidth = self.wrapper.width();

    return this;
  },

  /**
   * Simpler version of `adjustOnBreakpoint` for non-collapsible Toolbar Flex searchfields
   */
  simpleAdjustOnBreakpoint() {
    if (this.shouldBeFullWidth()) {
      if (!this.isFocused && (this.settings.collapsible || this.isContainedByFlexToolbar)) {
        this.wrapper[0].classList.remove('is-open');
      }
      return;
    }

    this.wrapper[0].classList.add('is-open');
  },

  /**
   * Makes necessary adjustments to the DOM surrounding the Searchfield element to accommodate
   * breakpoint changes.
   * @private
   * @returns {void}
   */
  adjustOnBreakpoint() {
    // On smaller form-factor (tablet/phone)
    if (this.shouldBeFullWidth()) {
      this.wrapper.removeAttr('style');
      this.input.removeAttribute('style');

      if (this.isFocused) {
        this.appendToParent();

        this.calculateOpenWidth();
        this.setOpenWidth();

        if (this.isExpanded) {
          return;
        }

        this.expand(true);
        return;
      }

      if (this.isCurrentlyCollapsible && this.isExpanded) {
        this.collapse();
      }

      if (this.isContainedByFlexToolbar) {
        this.wrapper[0].classList.remove('is-open');
      }

      this.setInitalWidth();

      return;
    }

    // On larger form-factor (desktop)
    this.appendToButtonset();

    if (this.isFocused || this.settings.collapsible === 'mobile') {
      if (!this.isExpanded) {
        this.expand(true);
      }
      return;
    }

    if (this.isExpanded) {
      this.collapse();
    }

    this.setInitalWidth();
  },

  /**
   * If focused, we need to store a reference to the element with focus
   * (for example: searchfield, internal buttons, etc) because once the element
   * becomes removed from the DOM, focus is lost.
   * @private
   * @returns {void}
   */
  saveFocus() {
    if (!this.isFocused) {
      return;
    }
    this.focusElem = document.activeElement;
  },

  /**
   * Restores focus to an element reference that was previously focused.
   * @private
   * @returns {void}
   */
  restoreFocus() {
    if (!this.focusElem) {
      return;
    }

    const self = this;

    const focusTimer = new RenderLoopItem({
      duration: 1,
      updateCallback() {}, // TODO: make this work without an empty function
      timeoutCallback() {
        if (!self.focusElem) {
          return;
        }
        self.focusElem.focus();
        delete self.focusElem;
      }
    });
    renderLoop.register(focusTimer);
  },

  /**
   * Appends this searchfield to the `containmentParent` element
   * Used when the small-form-factor searchfield needs to be established.
   * @private
   * @returns {void}
   */
  appendToParent() {
    if (!this.containmentParent || this.wrapper.parent().is($(this.containmentParent))) {
      return;
    }

    if (this.isContainedByFlexToolbar) {
      return;
    }

    this.saveFocus();

    this.elemBeforeWrapper = this.wrapper.prev();
    $(this.containmentParent).find('.buttonset').prepend(this.wrapper);

    utils.fixSVGIcons(this.wrapper);

    this.restoreFocus();
  },

  /**
   * Removes this searchfield from the `containmentParent` element,
   * and places it back into the buttonset. Used when the small-form-factor
   * searchfield needs to be established.
   * @private
   * @returns {void}
   */
  appendToButtonset() {
    if (!this.containmentParent || !this.wrapper.parent().is($(this.containmentParent))) {
      return;
    }

    if (this.isContainedByFlexToolbar) {
      return;
    }

    this.saveFocus();

    if (!(this.elemBeforeWrapper instanceof $) || !this.elemBeforeWrapper.length) {
      this.wrapper.prependTo($(this.buttonsetElem));
    } else {
      this.wrapper.insertAfter(this.elemBeforeWrapper);
      this.elemBeforeWrapper = null;
    }

    $(this.toolbarParent).triggerHandler('scrollup');
    utils.fixSVGIcons(this.wrapper);

    this.restoreFocus();
  },

  /**
   * Determines whether or not, when the Searchfield is expanded, the Searchfield should be placed
   *  over top of its sibling Toolbar elements, and take up 100% of its container's space.
   * @private
   * @returns {boolean} whether or not the Toolbar should be full width.
   */
  shouldBeFullWidth() {
    const header = this.wrapper.closest('.header');
    let headerCondition = false;

    if (header.length) {
      headerCondition = header.width() < breakpoints.phone;
    }

    return headerCondition || breakpoints.isBelow('phone-to-tablet');
  },

  /**
   * Determines whether or not the Searchfields should expand on the Mobile breakpoint.
   * @private
   * @returns {boolean} whether or not the searchfield should expand on mobile.
   */
  shouldExpandOnMobile() {
    if (this.settings.collapsible === true) {
      return false;
    }
    if (this.settings.collapsible === 'mobile') {
      return true;
    }
    return this.shouldBeFullWidth();
  },

  /**
   * Set boolean value if strings
   * @private
   * @returns {void}
   */
  coerceBooleanSettings() {
    const arr = [
      'showAllResults',
      'categoryMultiselect',
      'showCategoryText',
      'clearable'
    ];
    this.settings = utils.coerceSettingsToBoolean(this.settings, arr);
  },

  /**
   * Reveals whether or not categories are active on this searchfield.
   * @returns {boolean} whether or not categories are active on this searchfield.
   */
  hasCategories() {
    return this.settings.categories && $.isArray(this.settings.categories) &&
      this.settings.categories.length > 0;
  },

  /**
   * Detects the existence of a "Go" button added to the main searchfield API
   * @returns {boolean} whether or not a "Go" button is present
   */
  hasGoButton() {
    return this.settings.showGoButton && this.goButton && this.goButton.length;
  },

  /**
   * Detects the existence of a custom button added to the main searchfield API
   * @returns {boolean} whether or not a "Go" button is present
   */
  hasCustomButton() {
    return this.settings.button && this.customButton && this.customButton.length;
  },

  /**
   * Sets up the event-listening structure for this component instance.
   * @private
   * @returns {this} component instance
   */
  setupEvents() {
    const self = this;

    self.element
      .on(`updated.${this.id}`, (e, settings) => {
        self.updated(settings);
      })
      .on(`focus.${this.id}`, (e) => {
        self.handleFocus(e);
      })
      .on(`blur.${this.id}`, (e) => {
        if (self.isContainedByFlexToolbar) {
          self.handleSafeBlur(e);
        }
      })
      .on(`click.${this.id}`, (e) => {
        self.handleClick(e);
      })
      .on(`keydown.${this.id}`, (e) => {
        self.handleKeydown(e);
      })
      .on(`beforeopen.${this.id}`, (e, menu) => { // propagates from Autocomplete's Popupmenu
        self.handlePopupBeforeOpen(e, menu);
      })
      .on(`safe-blur.${this.id}`, () => { // Triggered by Autocomplete
        self.handleSafeBlur();
      })
      .on(`listclose.${this.id}`, () => { // Triggered by Autocomplete
        self.handleSafeBlur();
      })
      .on(`input.${this.id}`, () => {
        self.checkContents();
      });

    self.wrapper.on(`mouseenter.${this.id}`, function () {
      $(this).addClass('is-hovered');
    }).on(`mouseleave.${this.id}`, function () {
      $(this).removeClass('is-hovered');
    });

    if (this.hasCategories()) {
      this.categoryButton
        .on(`selected.${this.id}`, (e, anchor) => {
          self.handleCategorySelected(e, anchor);
        })
        .on(`focus.${this.id}`, (e) => {
          self.handleCategoryFocus(e);
        })
        .on(`blur.${this.id}`, () => {
          self.handleSafeBlur();
        })
        .on(`close.${this.id}`, () => { // Popupmenu Close
          self.handleSafeBlur();
        })
        .on(`beforeopen.${this.id}`, (e, menu) => { // Popupmenu beforeOpen
          self.handlePopupBeforeOpen(e, menu);
        });
    }

    if (self.hasGoButton()) {
      self.goButton
        .on(`click.${this.id}`, e => self.handleGoButtonClick(e))
        .on(`click.${this.id}`, e => self.handleGoButtonFocus(e))
        .on(`blur.${this.id}`, () => self.handleSafeBlur());
    }

    if (self.hasCustomButton()) {
      this.customButton
        .on(`click.${this.id}`, e => self.settings.button.click(e, self.element.val()))
        .on(`blur.${this.id}`, () => self.handleSafeBlur());
    }

    if (this.isCollapsible) {
      this.wrapper.on(`focusin.${this.id}`, (e) => {
        self.handleFocus(e);
      }).on(`focusout.${this.id}`, (e) => {
        self.handleBlur(e);
      }).on(`keydown.${this.id}`, (e) => {
        self.handleKeydown(e);
      }).on(`collapse.${this.id}`, () => {
        self.collapse();
      });

      $('body').on(`breakpoint-change.${this.id}`, () => {
        self.adjustOnBreakpoint();
      });
      self.adjustOnBreakpoint();
    } else {
      $('body').on(`breakpoint-change.${this.id}`, () => {
        self.simpleAdjustOnBreakpoint();
      });
      self.simpleAdjustOnBreakpoint();
    }

    if (this.collapseButton && this.collapseButton.length) {
      this.collapseButton
        .on(`keydown.${this.id}`, (e) => {
          self.collapseResponsive(e);
        })
        .on(`click.${this.id}`, (e) => {
          self.collapseResponsive(e);
        })
        .on(`blur.${this.id}`, () => self.handleSafeBlur());
    }

    if (this.toolbarParent) {
      $(this.toolbarParent).on(`navigate.${this.id}`, () => {
        if (self.isFocused || !self.isCurrentlyCollapsible) {
          return;
        }
        self.collapse();
      }).on(`rendered.${this.id}`, () => {
        self.element.removeClass('no-transition no-animation');
        self.wrapper.removeClass('no-transition no-animation');
      });
    }

    // Insert the "view more results" link on the Autocomplete control's "populated" event
    self.element.on(`beforepopulated.${this.id}`, (e, items) => {
      if (items.length > 0) {
        if (self.settings.showAllResults) {
          self.addMoreLink();
        }
      } else {
        self.addNoneLink();
      }
    });

    // Setup a listener for the Clearable behavior, if applicable
    if (self.settings.clearable) {
      self.element.on(`cleared.${this.id}`, () => {
        if (self.autocomplete) {
          self.autocomplete.closeList();
        }

        delete self.settings.value;
      });

      self.xButton.on(`blur.${this.id}`, (e) => {
        if (!self.xButton.hasClass('collapsed')) {
          self.handleSafeBlur(e);
        }
      });
    }

    // Override the 'click' listener created by Autocomplete (which overrides the
    // default Popupmenu method) to act differntly when the More Results link is activated.
    self.element.on(`listopen.${this.id}`, () => {
      const list = $('#autocomplete-list');

      // Visual indicator class
      self.wrapper.addClass('popup-is-open');

      // Trigger the `allResultsCallback` if one is defined
      self.element.on(`selected.${this.id}`, (thisE, a, ret) => {
        const isMoreLink = a.hasClass('more-results');
        if (!isMoreLink) {
          return;
        }

        const callback = self.settings.allResultsCallback;
        if (callback && typeof callback === 'function') {
          callback(ret);
        }
      });

      // Override the focus event created by the Autocomplete control to make the more link
      // and no-results link blank out the text inside the input.
      list.find('.more-results, .no-results').on(`focus.${this.id}`, function () {
        const anchor = $(this);
        list.find('li').removeClass('is-selected');

        if (!anchor.hasClass('no-results')) {
          anchor.parent('li').addClass('is-selected');
          self.element.val('');
        }
      });
    }).on(`listclose.${this.id}`, () => {
      const list = $('#autocomplete-list');

      self.element.off(`selected.${this.id}`);
      list.off(`focus.${this.id}`);
    });

    // Safari Mac document.activeElement cannot be used on buttons because it is not focusable on the Mac OS Safari.
    if (env.browser.isSafari() && this.xButton) {
      this.xButton.on('mouseover.clearable', () => {
        this.closeButtonHover = true;
      });

      this.xButton.on('mouseleave.clearable', () => {
        this.closeButtonHover = false;
      });
    }

    return this;
  },

  /**
   * Activates a toolbar-based searchfield and keeps it "open".  Instead of closing
   * it on blur, sets up an explicit, out-of-bounds click/tap that will serve to close
   * it when the user acts.
   * @private
   * @param {boolean} force ignore any attempt to return out first
   * @param {boolean} doFocus focus the searchfield element.
   * @returns {void}
   */
  setAsActive(force, doFocus) {
    if (!force && this.wrapper.hasClass('active')) {
      return;
    }

    this.addDocumentDeactivationEvents();

    const wrapperClasses = ['has-focus', 'active'];

    if (this.isCurrentlyCollapsible || this.isContainedByFlexToolbar) {
      this.expand(true);

      if (this.isContainedByFlexToolbar) {
        wrapperClasses.push('is-open');
      }
    }

    // Activate
    wrapperClasses.forEach((cssClass) => {
      // IE11 compatibility doesn't allow for multiple arguments for `classList.add()`
      this.wrapper[0].classList.add(cssClass);
    });

    if (this.toolbarParent) {
      this.toolbarParent.classList.add('searchfield-active');
    }

    if (this.isExpanded) {
      return;
    }

    if (doFocus === true) {
      this.element.focus();
    }
  },

  /**
   * @returns {boolean} whether or not one of elements inside the Searchfield wrapper has focus.
   */
  get isFocused() {
    const active = document.activeElement;
    const wrapperElem = this.wrapper[0];

    if (this.settings.tabbable && wrapperElem.contains(active) && $(active).is('button.close')) {
      return true;
    }

    // Safari Mac document.activeElement cannot be used on buttons because it is not focusable on the Mac OS Safari.
    if (env.browser.isSafari() && this.closeButtonHover && !$(active).is('button.close')) {
      return true;
    }

    // If another element inside the Searchfield Wrapper is focused, the entire component
    // is considered "focused".
    if (wrapperElem.contains(active)) {
      return true;
    }

    // Retain focus if the autocomplete menu is focused
    if (this.autocomplete) {
      const autocompleteListElem = this.autocomplete.list;
      if (autocompleteListElem && autocompleteListElem[0].contains(active)) {
        return true;
      }
    }

    // Retain focus if a category is being selected from a category menu
    if (this.categoryButton && this.categoryButton.length) {
      const menu = this.categoryButton.data('popupmenu').menu;
      if (menu.has(active).length) {
        return true;
      }
    }

    // Clearable button
    if (this.xButton && this.xButton.length) {
      if (this.xButton.has(active).length) {
        return true;
      }
    }

    if (this.customButton && this.customButton.length) {
      if (this.customButton.has(active).length) {
        return true;
      }
    }

    return false;
  },

  /**
   * Detects whether or not the Searchfield has focus.
   * @deprecated in v4.8.0.  Please use the `isFocused` property instead.
   * @returns {boolean} whether or not the Searchfield has focus.
   */
  hasFocus() {
    warnAboutDeprecation('isFocused', 'hasFocus');
    return this.isFocused;
  },

  /**
   * Focus event handler
   * @private
   * @returns {void}
   */
  handleFocus() {
    this.setAsActive(true);
  },

  /**
   * Blur event handler
   * @private
   * @returns {void}
   */
  handleBlur() {
    const self = this;
    self.handleSafeBlur();
  },

  /**
   * Custom event handler for Autocomplete's `safe-blur` and `listclose` events.
   * Fired on the base element when any Autocomplete-related focusable element loses focus to
   * something outside the Autocomplete's wrapper
   * @private
   * @returns {void}
   */
  handleSafeBlur() {
    const self = this;
    function safeBlurHandler() {
      // Do a check for searchfield-specific elements
      if (self.isFocused) {
        delete self.settings.value;
        return;
      }

      // Retain input value if searchfield is not focused
      self.settings.value = $(self.element).val();

      self.removeDocumentDeactivationEvents();
      self.clearResponsiveState();

      if (self.isCurrentlyCollapsible) {
        self.collapse();
      } else if (self.isContainedByFlexToolbar && (self.settings.collapsible || breakpoints.isBelow('phone-to-tablet'))) {
        self.wrapper[0].classList.remove('is-open');
      } else {
        const wrapperElem = self.wrapper[0];
        wrapperElem.classList.remove('has-focus', 'active');
      }
    }

    // Stagger the check for the activeElement on a timeout in order to accurately detect focus.
    if (this.blurTimer) {
      this.blurTimer.destroy(true);
    }
    this.blurTimer = new RenderLoopItem({
      duration: 1,
      updateCallback() {}, // TODO: make this work without an empty function
      timeoutCallback: safeBlurHandler
    });
    renderLoop.register(this.blurTimer);
  },

  /**
   * @private
   * @returns {void}
   */
  clearResponsiveState() {
    if (!this.toolbarParent) {
      return;
    }
    this.toolbarParent.classList.remove('searchfield-active');
  },

  /**
   * Click event handler
   * @private
   * @returns {void}
   */
  handleClick() {
    this.setAsActive();
  },

  /**
   * Sets up event listeners that need to be handled at the global (document) level, since they deal
   * with general keystrokes.
   * @private
   * @returns {void}
   */
  addDocumentDeactivationEvents() {
    if (this.hasDeactivationEvents === true) {
      return;
    }

    const self = this;
    $(document)
      .on(`click.${this.id}`, (e) => {
        self.handleOutsideClick(e);
      })
      .on(`keydown.${this.id}`, (e) => {
        self.handleOutsideKeydown(e);
      });

    this.hasDeactivationEvents = true;
  },

  /**
   * Removes global (document) level event handlers.
   * @private
   * @returns {void}
   */
  removeDocumentDeactivationEvents() {
    $(document).off(`click.${this.id} keydown.${this.id}`);
    this.hasDeactivationEvents = false;
  },

  /**
   * Event Handler for dealing with global (document) level clicks.
   * @private
   * @param {jQuery.Event} e `click` event
   * @returns {void}
   */
  handleOutsideClick(e) {
    const target = e.target;
    if (this.isSearchfieldElement(target)) {
      return;
    }
    this.handleSafeBlur();
  },

  /**
   * Keydown event handler
   * @private
   * @param {jQuery.Event} e jQuery `keydown`
   * @returns {void}
   */
  handleKeydown(e) {
    const key = e.which;
    const keyName = e.key;

    if (key === 27 && env.browser.isIE11()) {
      e.preventDefault();
    }

    if (e.ctrlKey && key === 8) {
      this.element.val('');
    }

    if (key === 9) { // Tab
      this.handleSafeBlur();
    }

    if (this.isContainedByFlexToolbar && this.toolbarFlexItem?.toolbarAPI?.items?.length > 1) {
      const yKeys = ['ArrowUp', 'Up', 'ArrowDown', 'Down'];
      if (yKeys.indexOf(keyName) > -1) {
        this.collapse();
      }
    }
  },

  /**
   * Handles global (document) level keydown events that are established to help
   * collapse/de-highlight searchfields on a timer.
   * @private
   * @param {jQuery.Event} e jQuery-wrapped Keydown event
   * @returns {void}
   */
  handleOutsideKeydown(e) {
    const key = e.which;
    const target = e.target;

    if (key === 9 && !this.isSearchfieldElement(target)) {
      this.handleSafeBlur();
    }
  },

  /**
   * Modifies the menu at $('#autocomplete-list') to propagate/remove style
   *  classes on the Searchfield element.
   * @private
   * @param {jQuery.Event} e custom jQuery `beforeopen` event from the Popupmenu Component.
   * @param {jQuery[]} menu element that represents the popupmenu that is being opened.
   * @returns {boolean} the ability to cancel the menu's opening.
   */
  handlePopupBeforeOpen(e, menu) {
    if ((this.isCollapsible && (this.isExpanding || !this.isExpanded)) || !menu) {
      return false;
    }

    const contextClassMethod = this.wrapper.hasClass('context') ? 'addClass' : 'removeClass';
    const altClassMethod = this.wrapper.hasClass('alternate') ? 'addClass' : 'removeClass';

    menu[contextClassMethod]('context');
    menu[altClassMethod]('alternate');

    if (!this.isExpanded) {
      this.categoryButton.focus();
      return false;
    }

    return true;
  },

  /**
   * @private
   * @param {jQuery.Event} e jQuery `click` event
   * @returns {void}
   */
  handleGoButtonClick(e) {
    const action = this.settings.goButtonAction;
    if (typeof action !== 'function') {
      return undefined;
    }

    const searchfieldValue = this.element.val();
    let categorySelection;

    if (this.hasCategories()) {
      categorySelection = this.getCategoryData();
    }

    // gives access to the current searchfield value, and category data if applicable.
    return action(e, searchfieldValue, categorySelection);
  },

  /**
   * @private
   * @returns {void}
   */
  handleGoButtonFocus() {
    this.setAsActive(true);
  },

  /**
   * Sets the text content on the category button.  Will either display a single category
   * name, or a translated "[x] Selected." string.
   * @param {string} [textContent] Optional incoming text that will be subtituted for the
   * selected element count.
   * @returns {undefined}
   */
  setCategoryButtonText(textContent) {
    if (!this.settings.showCategoryText || !this.categoryButton.length) {
      return;
    }

    let text = '';
    const button = this.wrapper.find('.btn');
    let span = button.find('span');

    if (!span || !span.length) {
      span = $('<span class="category"></span>').insertAfter(button.find('.icon').first());
    }

    span.empty();

    // incoming text takes precedent
    if (typeof textContent === 'string' && textContent.length) {
      span.text(textContent.trim());
      return;
    }

    // Otherwise, grab currently selected categories and set text
    // (or clear, if no options are selected).
    const item = this.getSelectedCategories();
    if (!item.length) {
      return;
    }

    if (item.length > 1) {
      text = `${item.length} ${Locale.translate('Selected')}`;
    } else {
      text = item.text().trim();
    }

    span.text(text);
  },

  /**
   * Detects whether or not an element is part of this instance of the Searchfield component
   * @private
   * @param {HTMLElement} element the element being checked.
   * @returns {boolean} whether or not the element provided is part of this Searchfield component
   */
  isSearchfieldElement(element) {
    if ($.contains(this.wrapper[0], element)) {
      return true;
    }

    // Don't close if a category is being selected from a category menu
    if (this.categoryButton && this.categoryButton.length) {
      const menu = this.categoryButton.data('popupmenu').menu;
      if (menu.has(element).length) {
        return true;
      }
    }

    return false;
  },

  /**
   * Retrieves the distance between a left and right boundary.
   * Used on controls like Lookup, Contextual Panel, etc. to fill the space remaining in a toolbar.
   * @private
   * @param {Number|jQuery[]} leftBoundary left boundary in pixels
   * @param {Number|jQuery[]} rightBoundary right boundary in pixels
   * @returns {number} the fill size area
   */
  getFillSize(leftBoundary, rightBoundary) {
    let leftBoundaryNum = 0;
    let rightBoundaryNum = 0;

    function sanitize(boundary) {
      if (!boundary) {
        return 0;
      }

      // Return out if the boundary is just a number
      if (!isNaN(parseInt(boundary, 10))) {
        return parseInt(boundary, 10);
      }

      if (boundary instanceof jQuery) {
        if (!boundary.length) {
          return 0;
        }

        if (boundary.is('.title')) {
          boundary = boundary.next('.buttonset');
        }

        boundary = boundary[0];
      }

      return boundary;
    }

    function getEdgeFromBoundary(boundary, edge) {
      if (!isNaN(boundary)) {
        return (boundary === null || boundary === undefined) ? 0 : boundary;
      }

      if (!edge || typeof edge !== 'string') {
        edge = 'left';
      }

      const edges = ['left', 'right'];
      if ($.inArray(edge, edges) === -1) {
        edge = edges[0];
      }

      let rect;

      if (boundary instanceof HTMLElement || boundary instanceof SVGElement) {
        rect = boundary.getBoundingClientRect();
      }

      return rect[edge];
    }

    leftBoundary = sanitize(leftBoundary);
    rightBoundary = sanitize(rightBoundary);

    function whichEdge() {
      let e = 'left';
      if (leftBoundary === rightBoundary || ($(rightBoundary).length && $(rightBoundary).is('.buttonset'))) {
        e = 'right';
      }

      return e;
    }

    leftBoundaryNum = getEdgeFromBoundary(leftBoundary);
    rightBoundaryNum = getEdgeFromBoundary(rightBoundary, whichEdge());

    if (!leftBoundaryNum && !rightBoundaryNum) {
      return TOOLBARSEARCHFIELD_EXPAND_SIZE;
    }

    const distance = rightBoundaryNum - leftBoundaryNum;

    // TODO: Remove this once we figure out how to definitively fix the searchfield sizing.
    // Toolbar Searchfield needs a way to demand that the parent toolbar increase
    // the size of its buttonset and decrease the size of its title under this condition
    // -- currently there is no way.
    if (distance <= TOOLBARSEARCHFIELD_EXPAND_SIZE) {
      return TOOLBARSEARCHFIELD_EXPAND_SIZE;
    }

    if (distance >= MAX_TOOLBARSEARCHFIELD_EXPAND_SIZE) {
      return MAX_TOOLBARSEARCHFIELD_EXPAND_SIZE;
    }

    return distance;
  },

  /**
   * @deprecated as of v4.26.0
   * @private
   * @returns {void}
   */
  setClosedWidth() {
    return this.setInitalWidth();
  },

  /**
   * @private
   * @returns {void}
   */
  setOpenWidth() {
    let subtractWidth = 0;
    const wrapper = this.wrapper;

    if (this.wrapper[0]) {
      this.wrapper[0].style.width = this.openWidth;
    }

    // If the searchfield category button exists, change the width of the
    // input field on the inside to provide space for the (variable) size of the currently-selected
    // category (or categories)
    if (this.hasCategories()) {
      const categoryButtonStyle = window.getComputedStyle(this.categoryButton[0]);
      const categoryButtonWidth = this.categoryButton.width();
      const categoryButtonPadding = parseInt(categoryButtonStyle.paddingLeft, 10) +
        parseInt(categoryButtonStyle.paddingRight, 10);
      const categoryButtonBorder = (parseInt(categoryButtonStyle.borderLeftWidth, 10) * 2);

      subtractWidth += (categoryButtonWidth + categoryButtonPadding + categoryButtonBorder);

      if (this.element.parents('.header').length === 1) {
        subtractWidth += 40;
      }
    }

    if (this.hasGoButton()) {
      const goButtonStyle = window.getComputedStyle(this.goButton[0]);
      const goButtonWidth = this.goButton.width();
      const goButtonPadding = parseInt(goButtonStyle.paddingLeft, 10) +
        parseInt(goButtonStyle.paddingRight, 10);
      const goButtonBorder = (parseInt(goButtonStyle.borderLeftWidth, 10) * 2);

      subtractWidth += (goButtonWidth + goButtonPadding + goButtonBorder);
    }

    if (subtractWidth > 0) {
      // Add two more pixels so that the searchfield will not cut off the border.
      const isAlternate = wrapper.hasClass('alternate') ? 2 : 0;

      this.input.style.width = `calc(100% - ${subtractWidth + isAlternate}px)`;
    }

    delete this.openWidth;
  },

  /**
   * @private
   * @returns {void}
   */
  calculateOpenWidth() {
    const buttonset = this.element.parents('.toolbar').children('.buttonset');
    let nextElem = this.wrapper.next();
    let width;

    if (!buttonset.length) {
      return;
    }
    // If small form factor, use the right edge
    if (nextElem.is('.title')) {
      nextElem = buttonset;
    }

    if (this.shouldBeFullWidth()) {
      let baseWidth = '100%';

      if (breakpoints.isBelow('desktop')) {
        baseWidth = '90%';
      }

      width = baseWidth;

      if ($(this.toolbarParent).closest('.tab-container.module-tabs').length) {
        width = `calc(${baseWidth} - 1px)`;
      }

      this.openWidth = width;
      return;
    }

    // Figure out boundaries
    // +10 on the left boundary reduces the likelyhood that the toolbar pushes other elements
    // into the spillover menu whenever the searchfield opens.
    const leftBoundary = buttonset.offset().left + 10;
    let rightBoundary = nextElem;

    // If the search input sits alone, just use the other side of the buttonset to measure
    if (!rightBoundary.length) {
      rightBoundary = buttonset.offset().left + 10 + buttonset.outerWidth(true);
    }

    width = this.getFillSize(leftBoundary, rightBoundary);
    this.openWidth = `${width - 6}px`;
  },

  /**
   * Ensures that the size of the Searchfield Wrapper does not change whenever a category
   * is chosen from a category searchfield.
   * NOTE: this method must be run AFTER changes to DOM elements (text/size changes) have been made.
   * @private
   */
  calculateSearchfieldWidth() {
    const inlineStyleProp = this.element[0].getAttribute('style');
    let baseWidth = '100%';
    let subtractWidth = 0;
    let targetWidthProp;

    if (inlineStyleProp) {
      this.element[0].removeAttribute('style');
    }

    const computedStyle = window.getComputedStyle(this.element[0]);
    if (computedStyle.width && !this.isContextSearch) {
      baseWidth = computedStyle.width;
    }

    // Subtract width of extraneous buttons/elems
    if (this.hasCategories()) {
      subtractWidth += this.categoryButton.outerWidth(true);
    }

    if (this.hasGoButton()) {
      subtractWidth += this.goButton.outerWidth(true);
    }

    // NOTE: final width can only be 100% if no value is subtracted for other elements
    if (subtractWidth > 0) {
      // If it's an alternate searchfield, change the base width to 100%
      let isAlternate;
      if (this.element[0].parentElement == null) {
        isAlternate = false;
      } else {
        isAlternate = this.element[0].parentElement.classList.contains('alternate') || this.isContainedByFlexToolbar;
      }

      targetWidthProp = `calc(${isAlternate ? '100%' : baseWidth} - ${subtractWidth}px)`;
    }
    if (targetWidthProp) {
      this.element[0].style.width = targetWidthProp;
    }
  },

  /**
   * Category Selection event handler
   * @private
   * @param  {object} e The event.
   * @param  {object} anchor the link object
   */
  handleCategorySelected(e, anchor) {
    /**
     * Fires when the searchfield has become collapsed.
     * @event selected
     * @memberof SearchField
     * @type {object}
     * @property {object} event - The jquery event object
     */
    this.element.trigger('selected', [anchor]);

    // Only change the text and searchfield size if we can
    if (!this.settings.showCategoryText) {
      return;
    }

    this.setCategoryButtonText(e, anchor.text().trim());
    this.calculateSearchfieldWidth();

    if (!this.settings.categoryMultiselect) {
      this.setAsActive(true, true);
    }
  },

  /**
   * Category Button Focus event handler
   * @private
   * @returns {undefined}
   */
  handleCategoryFocus() {
    this.saveFocus();
    this.setAsActive(true);
  },

  /**
   * Gets a complete list of categories in jQuery-collection form.
   * @returns {jQuery} categories
   */
  getCategories() {
    return this.list.children('li:not(.separator)');
  },

  /**
   * Gets the currently selected list of categories in jQuery-collection form.
   * @returns {jQuery} selectedCategories
   */
  getSelectedCategories() {
    return this.getCategories().filter('.is-checked');
  },

  /**
   * Gets the currently selected categories as data.
   * @param {boolean} [onlyReturnSelected=false] - If set to true, will only return
   *  checked list items.
   * @returns {Object[]} data -
   * @returns {string} name - Category name
   * @returns {string|number} id - Category element's ID (if applicable)
   * @returns {string|number} value - Category element's value (if applicable)
   * @returns {boolean} [checked=true] - Category's selection status
   */
  getCategoryData(onlyReturnSelected) {
    const categories = this.getCategories();
    const data = [];

    categories.each(function () {
      const classList = this.classList;
      const checked = classList.contains('is-checked');

      if (onlyReturnSelected === true && checked === false) {
        return;
      }

      const category = {
        name: this.innerText,
        checked
      };

      if (this.id) {
        category.id = this.id;
      }

      const value = this.getAttribute('data-value');
      if (value !== undefined) {
        category.value = value;
      }

      data.push(category);
    });

    return data;
  },

  /**
   * Updates just the categories setting and rerenders the category list.
   * @param {Object[]} categories - Array of category object definitions.
   * @param {string} categories[].name - Category name.
   * @param {string|number} [id] - Category element's ID (if applicable).
   * @param {string|number} [value] - Category element's value (if applicable).
   * @param {boolean} [checked=true] - Category's selection status
   * @returns {undefined}
   */
  updateCategories(categories) {
    this.settings.categories = categories;
    this.setCategories(this.settings.categories);
  },

  /**
   * Creates a new set of categories on the Searchfield and rerenders it.
   * @param {Object[]} categories - Array of category object definitions.
   * @param {string} categories[].name - Category name.
   * @param {string|number} [id] - Category element's ID (if applicable).
   * @param {string|number} [value] - Category element's value (if applicable).
   * @param {boolean} [checked=true] - Category's selection status
   * @returns {undefined}
   */
  setCategories(categories) {
    this.list.empty();

    const self = this;
    const valueTypes = ['string', 'number'];
    let previouslySelected = false;

    categories.forEach((val) => {
      // if passed a string, typecast to an object.
      if (typeof val === 'string') {
        val = {
          name: val
        };
      }

      // Object types get a bit more customization.
      // Don't continue if there's no name present.
      if (!val.name) {
        return;
      }

      let id = '';
      if (typeof val.id === 'string' && val.id.length) {
        id = ` id="${val.id}"`;
      }

      let value = '';
      if (valueTypes.indexOf(typeof val.value) > -1) {
        value = ` data-value="${val.value}"`;
      }

      let selected = '';
      if (val.checked === true && previouslySelected !== true) {
        selected = ' class="is-checked"';

        if (!self.settings.categoryMultiselect) {
          previouslySelected = true;
        }
      }

      self.list.append(`<li${selected}${id}${value}><a href="#">${val.name}</a></li>`);
    });

    const api = this.categoryButton.data('popupmenu');
    if (api && typeof api.updated === 'function') {
      api.updated();
    }
  },

  /**
   * Expands the Searchfield
   * @param {boolean} [noFocus] If defined, causes the searchfield component not to become focused
   *  at the end of the expand method. Its default functionality is that it will become focused.
   * @returns {Promise} resolved when the expansion completes
   */
  expand(noFocus) {
    const self = this;
    // eslint-disable-next-line compat/compat
    const expandPromise = new Promise((resolve) => {
      if (self.isExpanded || self.isExpanding || self.isCollapsing) {
        resolve();
        return;
      }

      const notFullWidth = !self.shouldBeFullWidth();

      self.isExpanding = true;

      // Places the input wrapper into the toolbar on smaller breakpoints
      if (!notFullWidth) {
        self.appendToParent();
      }

      self.wrapper.removeAttr('style');
      self.input.removeAttribute('style');

      // Re-adjust the size of the buttonset element if the expanded searchfield would be
      // too large to fit.
      let buttonsetWidth = 0;
      if (self.buttonsetElem) {
        buttonsetWidth = parseInt(window.getComputedStyle(self.buttonsetElem).width, 10);
      }

      const buttonsetElemWidth = buttonsetWidth + TOOLBARSEARCHFIELD_EXPAND_SIZE;
      const containerSizeSetters = {
        buttonset: buttonsetElemWidth
      };

      if (!this.isContainedByFlexToolbar) {
        this.wrapper[0].classList.add('is-open');
      }
      this.calculateOpenWidth();
      this.setOpenWidth();

      // Some situations require adjusting the focused element
      if (!noFocus || env.os.name === 'ios' || (self.isFocused && document.activeElement !== self.input)) {
        if (self.focusElem) {
          self.focusElem = self.input;
        }
        // added variation for searchfields inside flex toolbar
        if (!self.element.parents('.flex-toolbar').length) {
          self.input.focus();
        }
      }

      // Recalculate the Toolbar Buttonset/Title sizes.
      const eventArgs = [];
      if (containerSizeSetters) {
        eventArgs.push(containerSizeSetters);
      }

      /**
       * Fires before the searchfield is expanded.
       * @event beforeexpand
       * @memberof SearchField
       * @type {object}
       * @property {object} event - The jquery event object
       */
      self.element.trigger('beforeexpand');
      $(self.toolbarParent).triggerHandler('recalculate-buttons', eventArgs);

      const expandTimer = new RenderLoopItem({
        duration: 10,
        updateCallback() {}, // TODO: make this work without an empty function
        timeoutCallback() {
          $(self.toolbarParent).triggerHandler('recalculate-buttons', eventArgs);

          /**
           * Fires when the searchfield has become expanded.
           * @event expanded
           * @memberof SearchField
           * @type {object}
           * @property {object} event - The jquery event object
           */
          self.element.trigger('expanded');

          delete self.isExpanding;
          self.isExpanded = true;

          if (self.settings.clearable) {
            self.xButton.removeClass('collapsed');
          }

          if (self.isCurrentlyCollapsible && !self.isFocused && !self.focusElem) {
            self.handleSafeBlur();
          }
        }
      });
      renderLoop.register(expandTimer);
    });

    return expandPromise;
  },

  /**
   * Collapses the Searchfield
   * @returns {Promise} resolved once the collapse completes
   */
  collapse() {
    const self = this;
    // eslint-disable-next-line compat/compat
    const collapsePromise = new Promise((resolve) => {
      if (!self.isExpanded && self.isExpanding && !self.isCollapsing) {
        resolve();
        return;
      }

      self.isCollapsing = true;

      self.wrapper.removeAttr('style');

      // Puts the input wrapper back where it should be if it's been moved due to small form factors.
      self.appendToButtonset();

      self.checkContents();
      if (self.toolbarParent) {
        self.setInitalWidth();
      }

      self.clearResponsiveState();

      self.wrapper.removeClass('is-open');
      self.wrapper.removeClass('active');
      if (env.browser.isIE11) {
        self.wrapper[0].classList.remove('is-open');
      }

      setTimeout(() => {
        if (this.isContainedByFlexToolbar || !this.isFocused) {
          self.wrapper[0].classList.remove('has-focus');
        }
      }, 300);

      if (self.categoryButton && self.categoryButton.length) {
        self.categoryButton.data('popupmenu').close(false, true);
      }

      /**
       * Fires before the searchfield is collapsed.
       * @event beforecollapse
       * @memberof SearchField
       * @type {object}
       * @property {object} event - The jquery event object
       */
      self.element.trigger('beforecollapse');

      delete self.isExpanded;
      delete self.isExpanding;

      const collapseTimer = new RenderLoopItem({
        duration: 10,
        updateCallback() {}, // TODO: make this work without an empty function
        timeoutCallback() {
          delete self.isCollapsing;
          $(self.toolbarParent).triggerHandler('recalculate-buttons');

          /**
           * Fires when the searchfield has become collapsed.
           * @event collapsed
           * @memberof SearchField
           * @type {object}
           * @property {object} event - The jquery event object
           */
          self.element.trigger('collapsed');

          if (self.settings.clearable) {
            self.xButton.addClass('collapsed');
          }

          resolve();
        }
      });

      renderLoop.register(collapseTimer);
    });

    return collapsePromise;
  },

  /**
   * @private
   * @param {jQuery.Event} e incoming click event (driven either by keyboard or actual click)
   * @returns {void}
   */
  collapseResponsive(e) {
    if (this.previouslyCollapsedByKey && e.type === 'click') {
      delete this.previouslyCollapsedByKey;
      return;
    }

    // Navigate forward unless the event has been driven by a keystroke
    const self = this;
    let dir = 1;
    if (e && !e.key) {
      dir = 0;
      if (this.toolbarFlexItem && this.toolbarFlexItem?.focused) {
        dir = 1;
      }
    }

    if (e.type === 'keydown') {
      this.previouslyCollapsedByKey = true;
    }

    // Collapse followed by a special event trigger (gets picked up by Flex Toolbar)
    this.collapse().then(() => {
      /**
       * Fires when the searchfield has become collapsed.
       * @event collapsed-responsive
       * @memberof SearchField
       * @type {object}
       * @property {object} event - The jquery event object
       * @property {number} dir - The direction in which the Flex Toolbar has navigated (can be 0 to stay, or 1 to navigate forward)
       */
      self.wrapper.trigger('collapsed-responsive', [dir]);
    });
  },

  /**
   * @returns {boolean} whether or not the Searchfield contains a valid value.
   */
  get hasText() {
    const value = !this.input.value ? '' : this.input.value.trim();
    return value !== '';
  },

  /**
   * Adds/removes a CSS class to the searchfield wrapper depending on whether or not the input field is empty.
   * Needed for expand/collapse scenarios, for proper searchfield resizing.
   * @private
   * @returns {void}
   */
  checkContents() {
    return this.wrapper[0].classList[this.hasText ? 'add' : 'remove']('has-text');
  },

  /**
   * Sets the width of the Searchfield when it closes.
   * @private
   * @returns {void}
   */
  setInitalWidth() {
    if (!this.settings.collapsible || this.shouldBeFullWidth() || !this.hasText) {
      return;
    }

    // If collapsing with a search term present,
    // shrink the unfocused state to a custom-defined width instead of the default "button" size.
    // If a function is provided instead of a number, the function should eventually return a number.
    let size;
    if (this.settings.collapseSize) {
      if (typeof this.settings.collapseSize === 'function') {
        size = this.settings.collapseSize(this);
      } else {
        size = parseInt(this.settings.collapseSize, 10);
      }
    }

    if (isNaN(size)) {
      if (this.wrapper[0]) {
        this.wrapper[0].style.width = '';
      }
      return;
    }

    // this.wrapper.outerWidth(size);
    if (this.wrapper[0]) {
      this.wrapper[0].style.width = `${size}px`;
    }
  },

  /**
   * Adds a link at the bottom of a searchfield with more than (0) results that can be used to link out to a
   * larger display of search results.
   * @private
   * @returns {void}
   */
  addMoreLink() {
    const list = $('#autocomplete-list');
    const val = this.element.val();

    if ($('.more-results', list).length > 0) {
      return;
    }

    const separator = $('<li class="separator" role="presentation"></li>').appendTo(list);
    const more = $('<li role="presentation"></li>').appendTo(list);
    this.moreLink = $('<a href="#" class="more-results" tabindex="-1" role="menuitem"></a>')
      .html(`<span>${Locale.translate('AllResults')} "${xssUtils.ensureAlphaNumericWithSpaces(val)}"</span>`)
      .appendTo(more);

    if (this.autocomplete.maxWidth) {
      separator.width(`${this.autocomplete.maxWidth}px`);
    }
  },

  /**
   * Adds a link at the bottom of a searchfield with no results that announces no search results.
   * @private
   * @returns {void}
   */
  addNoneLink() {
    const list = $('#autocomplete-list');
    if ($('.no-results', list).length > 0) {
      return;
    }

    const none = $('<li role="presentation" class="is-placeholder"></li>').appendTo(list);

    this.noneLink = $('<a href="#" class="no-results" disabled="disabled" tabindex="-1" role="menuitem" aria-disabled="true"></a>')
      .html(`<span>${Locale.translate('NoResults')}</span>`).appendTo(none);
  },

  /**
   * Tears down and rebuilds the Searchfield. Can be called directly, but is also
   * triggered by calling the "updated.searchfield" event on the searchfield element.
   * @param {object} [settings] incoming settings
   * @returns {void}
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);

      // `utils.mergeSettings` misses passing the empty `collapseSize` property, so we need to check for it
      if (Object.prototype.hasOwnProperty.call(settings, 'collapseSize') && settings.collapseSize === undefined) {
        this.settings.collapseSize = settings.collapseSize;
      }
    }
    this.teardown().init();
  },

  /**
   * Disables the Searchfield
   * @returns {void}
   */
  disable() {
    this.wrapper.addClass('is-disabled');
    this.element.prop('disabled', true);
  },

  /**
   * Enables the Searchfield
   * @returns {void}
   */
  enable() {
    this.wrapper.removeClass('is-disabled');
    this.element.prop('disabled', false);
  },

  /**
   * Unbinds events and removes unnecessary markup.
   * @private
   * @returns {this} component instance
   */
  teardown() {
    this.element.off([
      `updated.${this.id}`,
      `focus.${this.id}`,
      `blur.${this.id}`,
      `click.${this.id}`,
      `keydown.${this.id}`,
      `beforeopen.${this.id}`,
      `input.${this.id}`,
      `listopen.${this.id}`,
      `listclose.${this.id}`,
      `safe-blur.${this.id}`,
      `selected.${this.id}`,
      `populated.${this.id}`,
      `cleared.${this.id}`].join(' '));

    this.wrapper.off([
      `mouseenter.${this.id}`,
      `mouseleave.${this.id}`,
      `focusin.${this.id}`,
      `focusout.${this.id}`,
      `keydown.${this.id}`,
      `collapse.${this.id}`
    ].join(' '));

    if (this.toolbarParent) {
      $(this.toolbarParent).off('navigate.toolbarsearchfield');
    }

    if (this.goButton && this.goButton.length) {
      this.goButton.off(`click.${this.id} blur.${this.id}`).remove();
      delete this.goButton;
    }

    if (this.customButton && this.customButton.length) {
      this.customButton.off(`click.${this.id} blur.${this.id}`).remove();
      delete this.customButton;
    }

    if (this.categoryButton && this.categoryButton.length) {
      const api = this.categoryButton.data('popupmenu');
      if (api) {
        api.destroy();
        api.wrapper.off().remove();
      }
      this.categoryButton.off().remove();
      delete this.categoryButton;
    }

    if (this.collapseButton && this.collapseButton.length) {
      this.collapseButton.off().remove();
      delete this.collapseButton;
      delete this.previouslyCollapsedByKey;
    }

    // Used to determine if the "Tab" key was involved in switching focus to the searchfield.
    this.removeDocumentDeactivationEvents();
    $('body').off(`resize.${this.id}`);
    $('body').off(`breakpoint-change.${this.id}`);

    if (this.autocomplete) {
      this.autocomplete.destroy();
    }

    if (this.wrapper.hasClass('context')) {
      this.element.addClass('context');
    }

    this.element.next('.icon').remove();
    if (this.element.parent().hasClass('searchfield-wrapper')) {
      this.element.parent().find('ul').remove();
      this.element.parent().find('.icon').remove();
    }

    if (this.xButton && this.xButton.length) {
      this.xButton.off(`blur.${this.id}`);

      // Safari Mac document.activeElement cannot be used on buttons because it is not focusable on the Mac OS Safari.
      if (env.browser.isSafari()) {
        this.xButton.off('mouseover.clearable');
        this.xButton.off('mouseleave.clearable');
      }

      this.xButton.remove();
    }

    return this;
  },

  /**
   * Make the search field have an x button.
   * @public
   * @returns {void} adds 'x' button to clear the searchfield.
   */
  makeClearable() {
    this.element.clearable({ tabbable: this.settings.tabbable });
    this.wrapper.addClass('has-close-icon-button');
    this.xButton = this.wrapper.children('.icon.close').length > 0 ? this.wrapper.children('.icon.close') : this.wrapper.children('button.close');

    // Ignoring the close button from tabbing
    if (!this.settings.tabbable) {
      this.xButton[0].setAttribute('tabindex', '-1');
    }

    this.element.on('cleared', () => this.checkContents());

    // Add test automation ids
    utils.addAttributes(this.xButton, this, this.settings.attributes, 'btn-close', true);
    utils.addAttributes(this.element.xButton, this, this.settings.attributes, 'btn-close', true);
  },

  /**
   * Clear the search field.
   * @public
   * @returns {void} adds 'x' button to clear the searchfield.
   */
  clear() {
    if (this.xButton) {
      this.xButton.click();
    }
    if (this.element.xButton) {
      this.element.xButton.click();
    }
  },

  /**
   * Destroys the Searchfield and removes all jQuery component instancing.
   * @returns {void}
   */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { SearchField, COMPONENT_NAME };
