import { Environment as env } from '../../utils/environment';
import * as debug from '../../utils/debug';
import { breakpoints } from '../../utils/breakpoints';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

// jQuery Components
import '../autocomplete/autocomplete.jquery';
import '../button/button.jquery';
import '../popupmenu/popupmenu.jquery';

// Name of this component
const COMPONENT_NAME = 'searchfield';

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
  collapsible: false,
  collapsibleOnMobile: false
};

// Used throughout:
const TOOLBARSEARCHFIELD_EXPAND_SIZE = 280;
const MAX_TOOLBARSEARCHFIELD_EXPAND_SIZE = 450;

/**
 * The search field component.
 * @class SearchField
 * @param {jQuery[]|HTMLElement} element the base searchfield element
 * @param {object} [settings] incoming settings
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
 */
function SearchField(element, settings) {
  this.element = $(element);

  // Backwards compatibility for old toolbars that had `collapsible` and `clearable` as the defaults
  if (this.toolbarParent && settings !== undefined) {
    if (settings.clearable === undefined) {
      settings.clearable = true;
    }
    if (settings.collapsible === undefined) {
      settings.collapsible = true;
    }
    if (settings.collapsibleOnMobile === undefined) {
      settings.collapsibleOnMobile = true;
    }
  }

  this.settings = utils.mergeSettings(element, settings, SEARCHFIELD_DEFAULTS);
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
    return this.settings.collapsible || this.settings.collapsibleOnMobile;
  },

  /**
   * @returns {boolean} whether or not the searchfield is currently able to be collapsed.
   */
  get isCurrentlyCollapsible() {
    return this.settings.collapsible || (this.settings.collapsibleOnMobile && breakpoints.isBelow('phone-to-tablet'));
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
      this.id = this.element.uniqueId(COMPONENT_NAME);
    }

    this.label = this.element.prev('label, .label');
    this.inlineLabel = this.element.closest('label');
    this.isInlineLabel = this.element.parent().is('.inline');

    // Invoke Autocomplete and store references to that and the popupmenu created by autocomplete.
    // Autocomplete settings are fed the same settings as Searchfield
    if (this.settings.source || this.element.attr('data-autocomplete')) {
      this.element.autocomplete(this.settings);
    }
    this.autocomplete = this.element.data('autocomplete');

    // Prevent browser typahead
    this.element.attr('autocomplete', 'off');

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

      // Label for toolbar-inlined searchfields needs to be inside the
      // wrapper to help with positioning.
      if (this.element.closest('.toolbar').length) {
        this.label.prependTo(this.wrapper);
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
    }

    // Add/remove the collapsible functionality
    this.wrapper[0].classList[!this.isCollapsible ? 'add' : 'remove']('non-collapsible');

    // Add/remove `toolbar-searchfield-wrapper` class based on existence of Toolbar Parent
    this.wrapper[0].classList[this.toolbarParent ? 'add' : 'remove']('toolbar-searchfield-wrapper');

    // Initially disable animations on searchfields
    this.element.add(this.wrapper).addClass('no-transition no-animation');

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
        this.categoryButton.popupmenu({
          menu: this.list,
          offset: {
            y: 10
          }
        });
      } else {
        this.setCategories(this.settings.categories);
      }

      this.setCategoryButtonText();
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
            <span>${this.settings.goButtonCopy || Locale.translate('Go')}</span>
          </button>
        `);
      }
      this.goButton.attr('id', this.goButton.uniqueId('searchfield-go-button-'));
      this.wrapper.addClass('has-go-button');
      this.element.after(this.goButton);
    } else {
      this.wrapper.removeClass('has-go-button');
    }

    // Hoist the 'alternate' CSS class to the wrapper, if applicable
    const isAlternate = this.element.hasClass('alternate');
    this.wrapper[isAlternate ? 'addClass' : 'removeClass']('alternate');

    if (this.settings.clearable) {
      this.element.clearable();
      this.xButton = this.wrapper.children('.icon.close');
    }

    this.wrapper[0].classList[!this.isCurrentlyCollapsible ? 'add' : 'remove']('is-open');

    this.calculateSearchfieldWidth();

    if (this.isCollapsible) {
      this.adjustOnBreakpoint();
    }

    return this;
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

      if (this.hasFocus()) {
        this.appendToParent();

        this.calculateOpenWidth();
        this.setOpenWidth();

        if (this.isExpanded) {
          return;
        }

        this.expand(true);
      } else if (this.settings.collapsibleOnMobile === true && this.isExpanded) {
        this.collapse();
      }

      return;
    }

    // On larger form-factor (desktop)
    this.appendToButtonset();

    if (!this.settings.collapsible) {
      this.calculateOpenWidth();
      this.setOpenWidth();

      if (!this.isExpanded) {
        this.expand();
        return;
      }
    }

    if (!this.hasFocus() && this.settings.collapsible === true && this.isExpanded) {
      this.collapse();
    }
  },

  /**
   * Appends this searchfield to the `containmentParent` element
   * Used when the small-form-factor searchfield needs to be established.
   * @private
   * @returns {void}
   */
  appendToParent() {
    if (this.wrapper.parent().is(this.containmentParent)) {
      return;
    }

    this.saveFocus();

    this.elemBeforeWrapper = this.wrapper.prev();
    this.wrapper.detach().prependTo(this.containmentParent);
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
    if (!this.wrapper.parent().is(this.containmentParent)) {
      return;
    }

    this.saveFocus();

    if (!(this.elemBeforeWrapper instanceof $) || !this.elemBeforeWrapper.length) {
      this.wrapper.prependTo(this.toolbarParent.children('.buttonset'));
    } else {
      this.wrapper.detach().insertAfter(this.elemBeforeWrapper);
      this.elemBeforeWrapper = null;
    }

    this.removeDocumentDeactivationEvents();
    this.toolbarParent.triggerHandler('scrollup');
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
    if (this.settings.collapsibleOnMobile === true) {
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
   * @private
   * @returns {boolean} whether or not one of the components inside of this searchfield
   *  is the document's "active" element.
   */
  isActive() {
    return this.wrapper.hasClass('active');
  },

  /**
   * @private
   * @returns {boolean} whether or not this searchfield instance is currently expanded.
   */
  isOpen() {
    return this.wrapper.hasClass('is-open');
  },

  /**
  * Fires when the searchfield is clicked (if enabled).
  * @event mousedown
  * @memberof ToolbarSearchfield
  * @property {object} event - The jquery event object
  * /
  /**
  * Fires when the searchfield is focused.
  * @event focusin
  * @memberof ToolbarSearchfield
  * @property {object} event - The jquery event object
  * /
  /**
  * Fires when a key is pressed inside of the searchfield.
  * @event keydown
  * @memberof ToolbarSearchfield
  * @property {object} event - The jquery event object
  */
  /**
  *  Fires when a `collapse` event is triggered externally on the searchfield.
  * @event collapse
  * @memberof ToolbarSearchfield
  * @property {object} event - The jquery event object
  */
  /**
  *  Fires when a `beforeopen` event is triggered on the searchfield's optional categories menubutton.
  * @event beforeopen
  * @memberof ToolbarSearchfield
  * @property {object} event - The jquery event object
  */
  /**
  * Fires when a `navigate` event is triggered on the searchfield's parent toolbar.
  * @event navigate
  * @memberof ToolbarSearchfield
  * @property {object} event - The jquery event object
  */
  /**
  * Fires when a `keydown` event is triggered at the `document` level.
  * @event keydown
  * @memberof ToolbarSearchfield
  * @property {object} event - The jquery event object
  */
  /**
   * Fires when a `resize` event is triggered at the `body` level.
   * @event resize
   * @memberof ToolbarSearchfield
   * @property {object} event - The jquery event object
   */

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
        self.handleBlur(e);
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
      .on(`safe-blur.${this.id} listclose.${this.id}`, () => {
        self.wrapper.removeClass('popup-is-open');
      });

    self.wrapper.on(`mouseenter.${this.id}`, function () {
      $(this).addClass('is-hovered');
    }).on(`mouseleave.${this.id}`, function () {
      $(this).removeClass('is-hovered');
    });

    if (this.hasCategories()) {
      this.categoryButton.on(`selected.${this.id}`, (e, anchor) => {
        self.handleCategorySelected(e, anchor);
        /*self.element.trigger('selected', [anchor]);*/
      }).on(`focus.${this.id}`, (e) => {
        self.handleCategoryFocus(e);
      }).on(`blur.${this.id}`, (e) => {
        self.handleCategoryBlur(e);
      }).on(`close.${this.id}`, (e) => { // Popupmenu Close
        self.handlePopupClose(e);
      }).on(`beforeopen.${this.id}`, (e, menu) => { // Popupmenu beforeOpen
        self.handlePopupBeforeOpen(e, menu)
      });
    }

    if (self.hasGoButton()) {
      self.goButton.on(`click.${this.id}`, e => self.handleGoButtonClick(e));
    }

    if (this.isCollapsible) {
      this.element.on(`cleared.${this.id}`, () => {
        self.element.addClass('active is-open has-focus');
        self.isFocused = true;
      });

      this.wrapper.on(`mousedown.${this.id}`, () => {
        self.fastExpand = true;
      }).on(`focusin.${this.id}`, (e) => {
        self.handleFocus(e);
      }).on(`keydown.${this.id}`, (e) => {
        self.handleKeydown(e);
      }).on(`collapse.${this.id}`, () => {
        self.collapse();
      });

      $('body').on(`resize.${this.id}`, () => {
        self.adjustOnBreakpoint();
      });
      self.adjustOnBreakpoint();
    }

    if (this.toolbarParent) {
      $(this.toolbarParent).on(`navigate.${this.id}`, () => {
        if (!self.hasFocus()) {
          self.collapse();
        }
      }).on(`reanimate.${this.id}`, () => {
        self.element.removeClass('no-transition no-animation');
        self.wrapper.removeClass('no-transition no-animation');
      });
    }

    if (env.os.name === 'ios') {
      this.element.on(`blur.${this.id}`, () => {
        $('head').triggerHandler('disable-zoom');
      });
    }

    // Insert the "view more results" link on the Autocomplete control's "populated" event
    self.element.off(`populated.${this.id}`).on(`populated.${this.id}`, (e, items) => {
      if (items.length > 0) {
        if (self.settings.showAllResults) {
          self.addMoreLink();
        }
      } else {
        self.addNoneLink();
      }
    });

    // Override the 'click' listener created by Autocomplete (which overrides the
    // default Popupmenu method) to act differntly when the More Results link is activated.
    self.element.on(`listopen.${this.id}`, (e, items) => {
      const list = $('#autocomplete-list');

      // Visual indicator class
      self.wrapper.addClass('popup-is-open');

      list.off('click').on('click.autocomplete', 'a', (thisE) => {
        const a = $(thisE.currentTarget);
        let ret = a.text().trim();
        const isMoreLink = a.hasClass('more-results');
        const isNoneLink = a.hasClass('no-results');

        if (!isMoreLink && !isNoneLink) {
          // Only write text into the field on a regular result pick.
          self.element.attr('aria-activedescendant', a.parent().attr('id'));
        }

        if (isMoreLink) {
          // Trigger callback if one is defined
          const callback = self.settings.allResultsCallback;
          if (callback && typeof callback === 'function') {
            callback(ret);
          }
        }

        if (a.parent().attr('data-value')) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].value.toString() === a.parent().attr('data-value')) {
              ret = items[i];
            }
          }
        }

        self.element.trigger('selected', [a, ret]);
        self.element.data('popupmenu').close();
        // e.preventDefault();
        return false;
      });

      // Override the focus event created by the Autocomplete control to make the more link
      // and no-results link blank out the text inside the input.
      list.find('.more-results, .no-results').off('focus').on('focus.searchfield', function () {
        const anchor = $(this);
        list.find('li').removeClass('is-selected');
        anchor.parent('li').addClass('is-selected');
        self.element.val('');
      });

      // Setup a listener for the Clearable behavior, if applicable
      if (self.settings.clearable) {
        self.element.on('cleared.searchfield', () => {
          self.element.triggerHandler('resetfilter');
        });
      }
    });

    return this;
  },

  /**
   * If located inside a toolbar element, setup a timed event that will send a
   * signal to the parent toolbar, telling it to recalculate which buttons are visible.
   * Needs to be done after a CSS animation on the searchfield finishes.
   * @private
   * @returns {void}
   */
  recalculateParent() {
    const toolbar = this.element.closest('.toolbar');
    if (toolbar.length) {
      // TODO: Bolster this to work with CSS TransitonEnd
      setTimeout(() => {
        toolbar.triggerHandler('recalculate-buttons');
      }, 300);
    }
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

    this.wrapper.addClass('has-focus');
    this.expand(true);

    // Activate
    this.wrapper.addClass('active');
    const toolbar = this.element.closest('.toolbar, [class$="-toolbar"]');
    if (toolbar.length) {
      toolbar.addClass('searchfield-active');
    }

    if (this.isExpanded) {
      return;
    }

    if (doFocus === true) {
      this.element.focus();
    }
  },

  /**
   * Detects whether or not the Searchfield has focus.
   * @returns {boolean} whether or not the Searchfield has focus.
   */
  hasFocus() {
    const active = document.activeElement;

    if ($.contains(this.wrapper[0], active)) {
      return true;
    }

    // Don't close if a category is being selected from a category menu
    if (this.categoryButton && this.categoryButton.length) {
      const menu = this.categoryButton.data('popupmenu').menu;
      if (menu.has(active).length) {
        return true;
      }
    }

    return false;
  },

  /**
   * Focus event handler
   * @private
   * @returns {void}
   */
  handleFocus() {
    if (this.isExpanded) {
      return;
    }

    this.setAsActive();
  },

  /**
   * Blur event handler
   * @private
   * @returns {void}
   */
  handleBlur() {
    if (!this.hasFocus()) {
      this.wrapper.removeClass('has-focus active');
    }
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
    const self = this;

    $(document)
      .on(`click.${this.id}`, (e) => {
        self.handleOutsideClick(e);
      })
      .on(`keydown.${this.id}`, (e) => {
        self.handleOutsideKeydown(e);
      });
  },

  /**
   * Removes global (document) level event handlers.
   * @private
   * @returns {void}
   */
  removeDocumentDeactivationEvents() {
    $(document).off(`click.${this.id} keydown.${this.id}`);
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

    $(document).off(this.outsideEventStr);
    this.collapse();
  },

  /**
   * Handles the "focusout" event
   * @private
   * @returns {void}
   */
  handleFocusOut() {
    if (this.isFocused || !this.settings.collapsible) {
      return;
    }

    this.collapse();
  },

  /**
   * Keydown event handler
   * @private
   * @param {jQuery.Event} e jQuery `keydown`
   * @returns {void}
   */
  handleKeydown(e) {
    const key = e.which;

    if (key === 27 && env.browser.isIE11()) {
      e.preventDefault();
    }

    if (key === 9) { // Tab
      this.handleFocusOut(e);
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
      this.isFocused = false;
      this.handleFocusOut(e);
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
    if (!menu) {
      return false;
    }

    const contextClassMethod = this.wrapper.hasClass('context') ? 'addClass' : 'removeClass';
    const altClassMethod = this.wrapper.hasClass('alternate') ? 'addClass' : 'removeClass';

    menu[contextClassMethod]('context');
    menu[altClassMethod]('alternate');

    if (!this.isOpen()) {
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
   * Sets the text content on the category button.  Will either display a single category
   * name, or a translated "[x] Selected." string.
   * @param {string} [textContent] Optional incoming text that will be subtituted for the
   * selected element count.
   * @returns {undefined}
   */
  setCategoryButtonText(textContent) {
    if (!this.settings.showCategoryText || !this.hasCategoryButton()) {
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
   * @private
   * @returns {void}
   */
  setClosedWidth() {
    let closedWidth = 0;

    // If the searchfield category button exists, change the width of the
    // input field on the inside to provide space for the (variable) size of the currently-selected
    // category (or categories)
    if ((this.categoryButton instanceof $) && this.categoryButton.length) {
      const buttonStyle = window.getComputedStyle(this.categoryButton[0]);
      const buttonWidth = this.categoryButton.width();
      const buttonBorder = parseInt(buttonStyle.borderLeftWidth, 10) * 2;
      const buttonPadding = parseInt(buttonStyle.paddingLeft, 10) +
        parseInt(buttonStyle.paddingRight, 10);

      closedWidth += (buttonWidth + buttonBorder + buttonPadding + 4);
    }

    if (this.wrapper[0]) {
      this.wrapper[0].style.width = `${closedWidth}px`;
    }
  },

  /**
   * @private
   * @returns {void}
   */
  setOpenWidth() {
    let subtractWidth = 0;

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
      this.input.style.width = `calc(100% - ${subtractWidth}px)`;
    }
  },

  /**
   * @private
   * @returns {void}
   */
  calculateOpenWidth() {
    const buttonset = this.element.parents('.toolbar').children('.buttonset');
    let nextElem = this.wrapper.next();
    let width;

    // If small form factor, use the right edge
    if (nextElem.is('.title')) {
      nextElem = buttonset;
    }

    if (this.shouldBeFullWidth()) {
      width = '100%';

      if ($(this.toolbarParent).closest('.header').length) {
        width = 'calc(100% - 40px)';
      }
      if ($(this.toolbarParent).closest('.tab-container.module-tabs').length) {
        width = 'calc(100% - 1px)';
      }

      this.openWidth = width;
      return;
    }

    if (!buttonset.length) {
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
    /*
    if (this.toolbarParent) {
      // If this is a toolbar searchfield, run its internal size check that fixes the
      // trigger button and input field size.
      this.calculateOpenWidth();
      this.setOpenWidth();
      return;
    }
    */

    let subtractWidth = 0;
    let targetWidthProp;

    if (this.hasCategories()) {
      subtractWidth += this.categoryButton.outerWidth(true);
    }
    if (this.hasGoButton()) {
      subtractWidth += this.goButton.outerWidth(true);
    }

    // NOTE: final width can only be 100% if no value is subtracted for other elements
    if (subtractWidth > 0) {
      targetWidthProp = `calc(100% - ${subtractWidth}px)`;
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
    // Only change the text and searchfield size if we can
    if (!this.settings.showCategoryText) {
      return;
    }

    this.setCategoryButtonText(e, anchor.text().trim());
    this.calculateSearchfieldWidth();
  },

  /**
   * Category Button Focus event handler
   * @private
   * @returns {undefined}
   */
  handleCategoryFocus() {
    this.wrapper
      .addClass('active')
      .addClass('has-focus');
  },

  /**
   * Category Button Blur event handler
   * @private
   * @returns {undefined}
   */
  handleCategoryBlur() {
    const self = this;

    setTimeout(() => {
      if (!self.hasFocus()) {
        self.wrapper.removeClass('has-focus');
      }
    }, 1);
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
   * Determines whether or not a Category Trigger exists.
   * @private
   * @returns {boolean} whether or not a Category Trigger exists.
   */
  hasCategoryButton() {
    return this.wrapper.find('.btn').length > 0;
  },

  /**
   * Category Button Close event handler
   * @private
   * @returns {void}
   */
  handlePopupClose() {
    return this.setAsActive(true, true);
  },

  /**
   * Clears the contents of the searchfield
   * @returns {void}
   */
  clear() {
    this.element.val('').trigger('change').focus();
  },

  /**
   * Expands the Searchfield
   * @param {boolean} [noFocus] If defined, causes the searchfield component not to become focused
   *  at the end of the expand method. Its default functionality is that it will become focused.
   * @returns {void}
   */
  expand(noFocus) {
    const self = this;
    const notFullWidth = !this.shouldBeFullWidth();

    if (this.isActive()) {
      return;
    }

    let containerSizeSetters;

    if (this.buttonsetElem === undefined) {
      this.getToolbarElements();
    }

    // Places the input wrapper into the toolbar on smaller breakpoints
    if (!notFullWidth) {
      this.appendToParent();
    } else {
      // Re-adjust the size of the buttonset element if the expanded searchfield would be
      // too large to fit.
      let buttonsetWidth = 0;
      if (this.buttonsetElem) {
        buttonsetWidth = parseInt(window.getComputedStyle(this.buttonsetElem).width, 10);
      }

      const buttonsetElemWidth = buttonsetWidth + TOOLBARSEARCHFIELD_EXPAND_SIZE;
      containerSizeSetters = {
        buttonset: buttonsetElemWidth
      };
    }

    this.addDocumentDeactivationEvents();

    // Don't continue if we shouldn't expand in a mobile setting.
    if (this.shouldExpandOnMobile()) {
      self.calculateOpenWidth();
      self.setOpenWidth();
      return;
    }

    if (!self.isOpen()) {
      self.wrapper.addClass('is-open');
      self.calculateOpenWidth();
      self.setOpenWidth();
    }

    if (!noFocus || env.os.name === 'ios') {
      self.input.focus();
    }

    // Recalculate the Toolbar Buttonset/Title sizes.
    const eventArgs = [];
    if (containerSizeSetters) {
      eventArgs.push(containerSizeSetters);
    }
    $(self.toolbarParent).triggerHandler('recalculate-buttons', eventArgs);

    self.wrapper.one($.fn.transitionEndName(), () => {
      if (!self.isFocused && self.hasFocus() && document.activeElement !== self.input[0]) {
        self.isFocused = true;
        self.input.focus();
      }

      $(self.toolbarParent).triggerHandler('recalculate-buttons', eventArgs);
      self.wrapper.triggerHandler('expanded');
      self.isExpanded = true;
    });
  },

  /**
   * Collapses the Searchfield
   * @returns {void}
   */
  collapse() {
    const self = this;
    let textMethod = 'removeClass';

    // Puts the input wrapper back where it should be if it's been moved due to small form factors.
    this.appendToButtonset();

    if (this.input.value.trim() !== '') {
      textMethod = 'addClass';
    }
    this.wrapper[textMethod]('has-text');

    self.wrapper.removeClass('active');
    if (!self.hasFocus()) {
      self.wrapper.removeClass('has-focus');
      self.isFocused = false;
    }

    // Return out without collapsing or handling callbacks for the `collapse` event if:
    // Searchfield is not collapsible in general -OR-
    // Searchfield is only collapsible on mobile, and we aren't below the mobile breakpoint
    if (!this.isCollapsible && !this.isCurrentlyCollapsible) {
      return;
    }

    if (this.shouldExpandOnMobile()) {
      return;
    }

    this.wrapper.removeAttr('style');
    this.input.removeAttribute('style');

    if (self.categoryButton && self.categoryButton.length) {
      self.categoryButton.data('popupmenu').close(false, true);
    }

    self.wrapper
      .removeClass('is-open')
      .triggerHandler('collapsed');

    self.removeDocumentDeactivationEvents();

    self.isExpanded = false;

    if (env.os.name === 'ios') {
      $('head').triggerHandler('enable-zoom');
    }

    self.wrapper.one($.fn.transitionEndName(), () => {
      $(self.toolbarParent).triggerHandler('recalculate-buttons');
    });
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

    $('<li class="separator" role="presentation"></li>').appendTo(list);
    const more = $('<li role="presentation"></li>').appendTo(list);
    this.moreLink = $('<a href="#" class="more-results" tabindex="-1" role="menuitem"></a>').html(`<span>${Locale.translate('AllResults')} "${val}"</span>`).appendTo(more);
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

    const none = $('<li role="presentation"></li>').appendTo(list);

    this.noneLink = $('<a href="#" class="no-results" tabindex="-1" role="menuitem"></a>').html(`<span>${Locale.translate('NoResults')}</span>`).appendTo(none);
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
    }
    this.teardown().init();
  },

  /**
   * Enables the Searchfield
   * @returns {void}
   */
  enable() {
    this.wrapper.addClass('is-disabled');
    this.element.prop('disabled', false);
  },

  /**
   * Disables the Searchfield
   * @returns {void}
   */
  disable() {
    this.wrapper.removeClass('is-disabled');
    this.element.prop('disabled', true);
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
      `listopen.${this.id}`,
      `listclose.${this.id}`,
      `safe-blur.${this.id}`,
      `cleared.${this.id}`].join(' '));

    // ToolbarSearchfield events
    this.wrapper.off([
      `mousedown.${this.id}`,
      `focusin.${this.id}`,
      `keydown.${this.id}`,
      `collapse.${this.id}`
    ].join(' '));

    if (this.toolbarParent) {
      $(this.toolbarParent).off('navigate.toolbarsearchfield');
    }

    // Used to determine if the "Tab" key was involved in switching focus to the searchfield.
    this.removeDocumentDeactivationEvents();
    $('body').off(`resize.${this.id}`);

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
      this.xButton.remove();
    }

    return this;
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
