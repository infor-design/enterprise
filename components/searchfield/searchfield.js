import { Environment as env } from '../utils/environment';
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
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
  clearable: false
};

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
 * @param {boolean} [settings.clearable = false]  Add an X to clear.
 */
function SearchField(element, settings) {
  this.settings = utils.mergeSettings(element, settings, SEARCHFIELD_DEFAULTS);
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

SearchField.prototype = {

  /**
   * Initialization Kickoff
   * @private
   * @returns {void}
   */
  init() {
    this.inlineLabel = this.element.closest('label');
    this.inlineLabelText = this.inlineLabel.find('.label-text');
    this.isInlineLabel = this.element.parent().is('.inline');
    this.isIe11 = env.browser.name === 'ie' && env.browser.version === '11';
    this.build().setupEvents();
  },

  /**
   * Builds the markup for this component.
   * @private
   * @returns {this} component instance
   */
  build() {
    this.optionsParseBoolean();
    this.label = this.element.prev('label, .label');

    // Invoke Autocomplete and store references to that and the popupmenu created by autocomplete.
    // Autocomplete settings are fed the same settings as Searchfield
    if (this.settings.source || this.element.attr('data-autocomplete')) {
      this.element.autocomplete(this.settings);
    }
    this.autocomplete = this.element.data('autocomplete');

    // Prevent browser typahead
    this.element.attr('autocomplete', 'off');

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

    // Add Icon
    let icon = this.wrapper.find('.icon:not(.icon-dropdown)');
    const insertIconInFront = this.wrapper.hasClass('context') || this.wrapper.hasClass('has-categories');

    if (!icon || !icon.length) {
      icon = $.createIconElement('search');
    }

    // Swap icon position to in-front if we have "context/has-categories" CSS class.
    icon[insertIconInFront ? 'insertBefore' : 'insertAfter'](this.element).icon();

    // Change icon to a trigger button if we're dealing with categories
    if (this.hasCategories()) {
      this.wrapper.addClass('has-categories');

      this.categoryButton = this.wrapper.find('.btn, .searchfield-category-button');
      if (!this.categoryButton.length) {
        this.categoryButton = $('<button type="button" class="btn searchfield-category-button"></button>');
      }
      icon.appendTo(this.categoryButton);
      icon = this.categoryButton;

      this.categoryButton.insertBefore(this.element);

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
    if (this.settings.showGoButton && (!this.goButton || !this.goButton.length)) {
      this.goButton = $(`<button class="btn-secondary go-button"><span>${this.settings.goButtonCopy || Locale.translate('Go')}</span></button>`);
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
    }

    this.calculateSearchfieldWidth();

    return this;
  },

  /**
   * Set boolean value if strings
   * @private
   * @returns {void}
   */
  optionsParseBoolean() {
    let i;
    let l;
    const arr = [
      'showAllResults',
      'categoryMultiselect',
      'showCategoryText',
      'clearable'
    ];
    for (i = 0, l = arr.length; i < l; i++) {
      this.settings[arr[i]] = this.parseBoolean(this.settings[arr[i]]);
    }
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
   * Sets up the event-listening structure for this component instance.
   * @private
   * @returns {this} component instance
   */
  setupEvents() {
    const self = this;

    self.element
      .on('updated.searchfield', () => {
        self.updated();
      })
      .on('focus.searchfield', (e) => {
        self.handleFocus(e);
      })
      .on('blur.searchfield', (e) => {
        self.handleBlur(e);
      })
      .on('click.searchfield', (e) => {
        self.handleClick(e);
      })
      .on('keydown.searchfield', (e) => {
        self.handleKeydown(e);
      })
      .on('beforeopen.searchfield', (e, menu) => { // propagates from Autocomplete's Popupmenu
        self.handlePopupBeforeOpen(e, menu);
      })
      .on('safe-blur.searchfield listclose.searchfield', () => {
        self.wrapper.removeClass('popup-is-open');
      });

    self.wrapper.on('mouseenter.searchfield', function () {
      $(this).addClass('is-hovered');
    }).on('mouseleave.searchfield', function () {
      $(this).removeClass('is-hovered');
    });

    if (this.hasCategories()) {
      this.categoryButton.on('selected.searchfield', (e, anchor) => {
        self.handleCategorySelected(e, anchor);
        self.element.trigger('selected', [anchor]);
      }).on('focus.searchfield', (e) => {
        self.handleCategoryFocus(e);
      }).on('blur.searchfield', (e) => {
        self.handleCategoryBlur(e);
      }).on('close.searchfield', (e) => { // Popupmenu Close
        self.handlePopupClose(e);
      });
    }

    if (self.hasGoButton()) {
      self.goButton.on('click.searchfield', e => self.handleGoButtonClick(e));
    }

    // Insert the "view more results" link on the Autocomplete control's "populated" event
    self.element.off('populated.searchfield').on('populated.searchfield', (e, items) => {
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
    self.element.on('listopen.searchfield', (e, items) => {
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

    // Activate
    this.wrapper.addClass('active');
    const toolbar = this.element.closest('.toolbar, [class$="-toolbar"]');
    if (toolbar.length) {
      toolbar.addClass('searchfield-active');
    }

    // if Toolbar Searchfield, allow that control to handle adding this class
    if (!this.isToolbarSearchfield()) {
      this.wrapper.addClass('has-focus');
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
   * Keydown event handler
   * @private
   * @param {jQuery.Event} e jQuery `keydown`
   * @returns {void}
   */
  handleKeydown(e) {
    const key = e.which;

    if (key === 27 && this.isIe11) {
      e.preventDefault();
    }
  },

  /**
   * Modifies the menu at $('#autocomplete-list') to propagate/remove style
   *  classes on the Searchfield element.
   * @private
   * @param {jQuery.Event} e custom jQuery `beforeopen` event from the Popupmenu Component.
   * @param {jQuery[]} menu element that represents the popupmenu that is being opened.
   * @returns {void}
   */
  handlePopupBeforeOpen(e, menu) {
    if (!menu) {
      return;
    }

    const contextClassMethod = this.wrapper.hasClass('context') ? 'addClass' : 'removeClass';
    const altClassMethod = this.wrapper.hasClass('alternate') ? 'addClass' : 'removeClass';

    menu[contextClassMethod]('context');
    menu[altClassMethod]('alternate');
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
   * Ensures that the size of the Searchfield Wrapper does not change whenever a category
   * is chosen from a category searchfield.
   * NOTE: this method must be run AFTER changes to DOM elements (text/size changes) have been made.
   * @private
   */
  calculateSearchfieldWidth() {
    if (this.isToolbarSearchfield()) {
      // If this is a toolbar searchfield, run its internal size check that fixes the
      // trigger button and input field size.
      const tsAPI = this.element.data('toolbarsearchfield');
      if (tsAPI && typeof tsAPI.setOpenWidth === 'function') {
        tsAPI.calculateOpenWidth();
        tsAPI.setOpenWidth();
      }
      return;
    }

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
   * Detects whether or not this component is a Toolbar Searchfield
   * @private
   * @returns {boolean} whether or not this component is a Toolbar Searchfield
   */
  isToolbarSearchfield() {
    return this.wrapper.is('.toolbar-searchfield-wrapper');
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
    // if Toolbar Searchfield, allow that control to handle adding this class
    if (this.isToolbarSearchfield()) {
      return;
    }

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

    // if Toolbar Searchfield, allow that control to handle adding this class
    if (this.isToolbarSearchfield()) {
      return;
    }

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
    this.element.prop('disabled', false);
  },

  /**
   * Disables the Searchfield
   * @returns {void}
   */
  disable() {
    this.element.prop('disabled', true);
  },

  /**
   * Performs the usual Boolean coercion with the exception of the strings "false"
   * (case insensitive) and "0"
   * @private
   * @param {boolean|string|number} b the value to be checked
   * @returns {boolean} whether or not the value passed coerces to true.
   */
  parseBoolean(b) {
    return !(/^(false|0)$/i).test(b) && !!b;
  },

  /**
   * Unbinds events and removes unnecessary markup.
   * @private
   * @returns {this} component instance
   */
  teardown() {
    this.element.off('updated.searchfield focus.searchfield blur.searchfield click.searchfield keydown.searchfield beforeopen.searchfield listopen.searchfield listclose.searchfield safe-blur.searchfield cleared.searchfield');

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

    return this;
  },

  /**
   * Destroys the Searchfield and removes all jQuery component instancing.
   * @param {boolean} dontDestroyToolbarSearchfield if true, will not pass through
   *  and destroy a linked instance of the Toolbar Searchfield component.
   * @returns {undefined}
   */
  destroy(dontDestroyToolbarSearchfield) {
    this.teardown();

    // Destroy the linked Toolbar Searchfield instance
    const tbsf = this.element.data('toolbarsearchfield');
    if (!dontDestroyToolbarSearchfield && tbsf && typeof tbsf.destroy === 'function') {
      tbsf.destroy(true);
    }

    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { SearchField, COMPONENT_NAME };
