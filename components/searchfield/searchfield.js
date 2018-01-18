/* eslint-disable */
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

// jQuery Components
import '../autocomplete/autocomplete.jquery';
import '../button/button.jquery';
import '../popupmenu/popupmenu.jquery';

// Name of this component
let COMPONENT_NAME = 'searchfield';

/**
* @namespace
* @property {function} resultsCallback Callback function for getting typahead results on search.
* @property {function} allResultsCallback Callback function for getting "all results".
* @property {boolean} showAllResults If true the show all results link is showin in the list.
* @property {boolean} showGoButton If true a go button is associated.
* @property {string} goButtonCopy The text to use on the go button.
* @property {function} goButtonAction If defined as a function, will fire this callback on
* the Go Button "click"
* @property {array} categories If defined as an array, displays a dropdown containing
* categories that can be used to filter results.
* @property {boolean} categoryMultiselect If true, creates a multiselectable categories list.
* @property {boolean} showCategoryText If true, will show any available categories that are
* selected to the left of the Dropdown field.
* @property {function} source Callback function for getting type ahead results.
* @property {string} template The html template to use for the search list
* @property {boolean} clearable Add an X to clear.
*/
let SEARCHFIELD_DEFAULTS = {
  resultsCallback: undefined,
  allResultsCallback: undefined,
  showAllResults: true,
  showGoButton: false,
  goButtonCopy: Locale.translate('Go') || 'Go',
  goButtonAction: undefined,
  categories: undefined,
  categoryMultiselect: false,
  showCategoryText: false,
  source: undefined,
  template: undefined,
  clearable: false
};


/**
 * Searchfield Control
 * @constructor
 * @param {object} element
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
   * @returns {this}
   */
  init: function() {
    this.inlineLabel = this.element.closest('label');
    this.inlineLabelText = this.inlineLabel.find('.label-text');
    this.isInlineLabel = this.element.parent().is('.inline');
    this.build().setupEvents();
  },

  /**
   * Builds the markup for this component.
   * @private
   * @returns {this}
   */
  build: function() {
    this.optionsParseBoolean();
    this.label = this.element.prev('label, .label');

    // Invoke Autocomplete and store references to that and the popupmenu created by autocomplete.
    // Autocomplete settings are fed the same settings as Searchfield
    if (this.settings.source || this.element.attr('data-autocomplete')) {
      this.element.autocomplete(this.settings);
    }
    this.autocomplete = this.element.data('autocomplete');

    //Prevent browser typahead
    this.element.attr('autocomplete','off');

    this.wrapper = this.element.parent('.searchfield-wrapper');
    if (!this.wrapper || !this.wrapper.length) {
      if (this.isInlineLabel) {
        this.wrapper = this.inlineLabel.addClass('searchfield-wrapper');
      }
      else {
        this.wrapper = this.element.wrap('<span class="searchfield-wrapper"></span>').parent();
      }

      // Label for toolbar-inlined searchfields needs to be inside the wrapper to help with positioning.
      if (this.element.closest('.toolbar').length) {
        this.label.prependTo(this.wrapper);
      }

      var customClasses = ['context', 'alternate'],
        c;
      for (var i = 0; i < customClasses.length; i++) {
        if (this.element.hasClass(customClasses[i])) {
          c = customClasses[i];
          this.wrapper.addClass(c);
          this.element.removeClass(c);
        }
      }
    }

    // Add Icon
    var icon = this.wrapper.find('.icon:not(.icon-dropdown)'),
      insertIconInFront = this.wrapper.hasClass('context') || this.wrapper.hasClass('has-categories');

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

      var ddIcon = icon.find('.icon-dropdown');
      if (!ddIcon.length) {
        ddIcon = $.createIconElement({ classes: 'icon-dropdown', icon: 'dropdown' }).icon();
      }
      ddIcon.appendTo(icon);

      var popupAPI = this.categoryButton.data('popupmenu');
      if (!popupAPI) {
        this.list = this.wrapper.find('ul.popupmenu');
        if (!this.list || !this.list.length) {
          this.list = $('<ul class="popupmenu"></ul>');
        }

        // Handle Single vs Multi-Selectable Lists
        var categoryListType = this.settings.categoryMultiselect ? 'is-multiselectable' : 'is-selectable';
        this.list.addClass(categoryListType);
        var removeListType = 'is-selectable';
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
    var goButton = this.wrapper.next('.go-button');
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
      this.goButton = $('<button class="btn-secondary go-button"><span>'+ this.settings.goButtonCopy +'</span></button>');
      this.goButton.attr('id', this.goButton.uniqueId('searchfield-go-button-'));
      this.wrapper.addClass('has-go-button');
      this.element.after(this.goButton);
    } else {
      this.wrapper.removeClass('has-go-button');
    }

    // Hoist the 'alternate' CSS class to the wrapper, if applicable
    var isAlternate = this.element.hasClass('alternate');
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
   * @returns {undefined}
   */
  optionsParseBoolean: function() {
    var i, l,
      arr = [
        'showAllResults',
        'categoryMultiselect',
        'showCategoryText',
        'clearable'
      ];
    for (i=0,l=arr.length; i<l; i++) {
      this.settings[arr[i]] = this.parseBoolean(this.settings[arr[i]]);
    }
  },

  /**
   * Reveals whether or not categories are active on this searchfield
   * @returns {boolean}
   */
  hasCategories: function() {
    return this.settings.categories && $.isArray(this.settings.categories) && this.settings.categories.length > 0;
  },

  /**
   * Detects the existence of a "Go" button added to the main searchfield API
   * @returns {boolean}
   */
  hasGoButton: function() {
    return this.settings.showGoButton && this.goButton && this.goButton.length;
  },

  /**
   * Sets up the event-listening structure for this component instance.
   * @private
   * @returns {this}
   */
  setupEvents: function() {
    var self = this;

    self.element.on('updated.searchfield', function() {
      self.updated();
    }).on('focus.searchfield', function(e) {
      self.handleFocus(e);
    }).on('blur.searchfield', function(e) {
      self.handleBlur(e);
    }).onTouchClick('searchfield', '.searchfield')
    .on('click.searchfield', function(e) {
      self.handleClick(e);
    }).on('keydown.searchfield', function(e) {
      self.handleKeydown(e);
    }).on('beforeopen.searchfield', function(e, menu) { // propagates from Autocomplete's Popupmenu
      self.handlePopupBeforeOpen(e, menu);
    }).on('safe-blur.searchfield listclose.searchfield', function() {
      self.wrapper.removeClass('popup-is-open');
    });

    self.wrapper.on('mouseenter.searchfield', function() {
      $(this).addClass('is-hovered');
    }).on('mouseleave.searchfield', function() {
      $(this).removeClass('is-hovered');
    });

    if (this.hasCategories()) {
      this.categoryButton.on('selected.searchfield', function(e, anchor) {
        self.handleCategorySelected(e, anchor);
        self.element.trigger('selected', [anchor]);
      }).on('focus.searchfield', function(e) {
        self.handleCategoryFocus(e);
      }).on('blur.searchfield', function(e) {
        self.handleCategoryBlur(e);
      }).on('close.searchfield', function(e) { // Popupmenu Close
        self.handlePopupClose(e);
      });
    }

    if (self.hasGoButton()) {
      self.goButton.on('click.searchfield', function(e) {
        return self.handleGoButtonClick(e);
      });
    }

    // Insert the "view more results" link on the Autocomplete control's "populated" event
    self.element.off('populated.searchfield').on('populated.searchfield', function(e, items) {
      if (items.length > 0) {
        if (self.settings.showAllResults) {
          self.addMoreLink();
        }
      } else {
        self.addNoneLink();
      }
    });

    // Override the 'click' listener created by Autocomplete (which overrides the default Popupmenu method)
    // to act differntly when the More Results link is activated.
    self.element.on('listopen.searchfield', function(e, items) {
      var list = $('#autocomplete-list');

      // Visual indicator class
      self.wrapper.addClass('popup-is-open');

      list.off('click').on('click.autocomplete', 'a', function (e) {
        var a = $(e.currentTarget),
          ret = a.text().trim(),
          isMoreLink = a.hasClass('more-results'),
          isNoneLink = a.hasClass('no-results');

        if (!isMoreLink && !isNoneLink) {
          // Only write text into the field on a regular result pick.
          self.element.attr('aria-activedescendant', a.parent().attr('id'));
        }

        if (isMoreLink) {
          // Trigger callback if one is defined
          var callback = self.settings.allResultsCallback;
          if (callback && typeof callback === 'function') {
            callback(ret);
          }
        }

        if (a.parent().attr('data-value')) {
          for (var i = 0; i < items.length; i++) {
            if (items[i].value.toString() === a.parent().attr('data-value')) {
              ret = items[i];
            }
          }
        }

        self.element.trigger('selected', [a, ret]);
        self.element.data('popupmenu').close();
        //e.preventDefault();
        return false;
      });

      // Override the focus event created by the Autocomplete control to make the more link
      // and no-results link blank out the text inside the input.
      list.find('.more-results, .no-results').off('focus').on('focus.searchfield', function () {
        var anchor = $(this);
        list.find('li').removeClass('is-selected');
        anchor.parent('li').addClass('is-selected');
        self.element.val('');
      });

      // Setup a listener for the Clearable behavior, if applicable
      if (self.settings.clearable) {
        self.element.on('cleared.searchfield', function() {
          self.element.triggerHandler('resetfilter');
        });
      }

    });

    return this;
  },

  /**
   * If located inside a toolbar element, setup a timed event that will send a signal to the parent toolbar,
   * telling it to recalculate which buttons are visible. Needs to be done after a CSS animation on the searchfield finishes.
   * @private
   * @returns {undefined}
   */
  recalculateParent: function() {
    var toolbar = this.element.closest('.toolbar');
    if (toolbar.length) {
      // TODO: Bolster this to work with CSS TransitonEnd
      setTimeout(function() {
        toolbar.triggerHandler('recalculate-buttons');
      }, 300);
    }
  },

  /**
   * Activates a toolbar-based searchfield and keeps it "open".  Instead of closing it on blur, sets up
   * an explicit, out-of-bounds click/tap that will serve to close it when the user acts.
   * @private
   * @param {boolean} force - ignore any attempt to return out first
   * @param {boolean} doFocus - focus the searchfield element.
   * @returns {undefined}
   */
  setAsActive: function(force, doFocus) {
    if (!force && this.wrapper.hasClass('active')) {
      return;
    }

    // Activate
    this.wrapper.addClass('active');
    var toolbar = this.element.closest('.toolbar, [class$="-toolbar"]');
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
   * @returns {boolean}
   */
  hasFocus: function() {
    var active = document.activeElement;

    if ($.contains(this.wrapper[0], active)) {
      return true;
    }

    // Don't close if a category is being selected from a category menu
    if (this.categoryButton && this.categoryButton.length) {
      var menu = this.categoryButton.data('popupmenu').menu;
      if (menu.has(active).length) {
        return true;
      }
    }

    return false;
  },

  /**
   * Focus event handler
   * @private
   * @returns {undefined}
   */
  handleFocus: function() {
    this.setAsActive();
  },

  /**
   * Blur event handler
   * @private
   * @returns {undefined}
   */
  handleBlur: function() {
    if (!this.hasFocus()) {
      this.wrapper.removeClass('has-focus active');
    }
  },

  /**
   * Click event handler
   * @private
   * @returns {undefined}
   */
  handleClick: function() {
    this.setAsActive();
  },

  /**
   * Keydown event handler
   * @private
   * @returns {undefined}
   */
  handleKeydown: function(e) {
    var key = e.which;

    if (key === 27) {
      this.clear();
    }
  },

  /**
   * Modifies the menu at $('#autocomplete-list') to propagate/remove style classes on the Searchfield element.
   * @private
   * @returns {boolean}
   */
  handlePopupBeforeOpen: function(e, menu) {
    if (!menu) {
      return;
    }

    var contextClassMethod = this.wrapper.hasClass('context') ? 'addClass' : 'removeClass',
      altClassMethod = this.wrapper.hasClass('alternate') ? 'addClass' : 'removeClass';

    menu[contextClassMethod]('context');
    menu[altClassMethod]('alternate');

    return true;
  },


  /**
   * @param {jQuery.Event} e
   */
  handleGoButtonClick: function(e) {
    var action = this.settings.goButtonAction;
    if (typeof action !== 'function') {
      return;
    }

    var searchfieldValue = this.element.val(),
      categorySelection;

    if (this.hasCategories()) {
      categorySelection =this.getCategoryData();
    }

    // gives access to the current searchfield value, and category data if applicable.
    return action(e, searchfieldValue, categorySelection);
  },


  /**
   * Sets the text content on the category button.  Will either display a single category name, or a translated "[x] Selected." string.
   * @param {string} [textContent] - Optional incoming text that will be subtituted for the selected element count.
   * @returns {undefined}
   */
  setCategoryButtonText: function(textContent) {
    if (!this.settings.showCategoryText || !this.hasCategoryButton()) {
      return;
    }

    var text = '',
      button = this.wrapper.find('.btn'),
      span = button.find('span');

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
    var item = this.getSelectedCategories();
    if (!item.length) {
      return;
    }

    if (item.length > 1) {
      text = item.length + ' ' + Locale.translate('Selected');
    } else {
      text = item.text().trim();
    }

    span.text(text);
  },

  /**
   * Ensures that the size of the Searchfield Wrapper does not change whenever a category
   * is chosen from a category searchfield.
   * NOTE: this method must be run AFTER changes to DOM elements (text/size changes) have been made.
   */
  calculateSearchfieldWidth: function() {
    if (this.isToolbarSearchfield()) {
      // If this is a toolbar searchfield, run its internal size check that fixes the
      // trigger button and input field size.
      var tsAPI = this.element.data('toolbarsearchfield');
      if (tsAPI && typeof tsAPI.setOpenWidth === 'function') {
        tsAPI.calculateOpenWidth();
        tsAPI.setOpenWidth();
      }
      return;
    }

    var subtractWidth = 0,
      targetWidthProp = '100%';

    if (this.hasCategories()) {
      subtractWidth = subtractWidth + this.categoryButton.outerWidth(true);
    }
    if (this.hasGoButton()) {
      subtractWidth = subtractWidth + this.goButton.outerWidth(true);
    }

    // NOTE: final width can only be 100% if no value is subtracted for other elements
    if (subtractWidth > 0) {
      targetWidthProp = 'calc(100% - '+ subtractWidth +'px)';
    }

    this.element[0].style.width = targetWidthProp;
  },

  /**
   * Detects whether or not this component is a Toolbar Searchfield
   * @returns {boolean}
   */
  isToolbarSearchfield: function() {
    return this.wrapper.is('.toolbar-searchfield-wrapper');
  },

  /**
   * Category Selection event handler
   * @private
   * @returns {undefined}
   */
  handleCategorySelected: function(e, anchor) {
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
  handleCategoryFocus: function() {
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
  handleCategoryBlur: function() {
    var self = this;

    // if Toolbar Searchfield, allow that control to handle adding this class
    if (this.isToolbarSearchfield()) {
      return;
    }

    setTimeout(function () {
      if (!self.hasFocus()) {
        self.wrapper.removeClass('has-focus');
      }
    }, 1);
  },

  /**
   * Gets a complete list of categories in jQuery-collection form.
   * @return {jQuery} categories
   */
  getCategories: function() {
    return this.list.children('li:not(.separator)');
  },

  /**
   * Gets the currently selected list of categories in jQuery-collection form.
   * @return {jQuery} selectedCategories
   */
  getSelectedCategories: function() {
    return this.getCategories().filter('.is-checked');
  },

  /**
   * Gets the currently selected categories as data.
   * @param {boolean} [onlyReturnSelected=false] - If set to true, will only return checked list items.
   * @returns {Object[]} data -
   * @returns {string} name - Category name
   * @returns {string|number} id - Category element's ID (if applicable)
   * @returns {string|number} value - Category element's value (if applicable)
   * @returns {boolean} [checked=true] - Category's selection status
   */
  getCategoryData: function(onlyReturnSelected) {
    var categories = this.getCategories(),
      data = [];

    categories.each(function() {
      var classList = this.classList,
        checked = classList.contains('is-checked');

      if (onlyReturnSelected === true && checked === false) {
        return;
      }

      var category = {
        name: this.innerText,
        checked: checked
      };

      if (this.id) {
        category.id = this.id;
      }

      var value = this.getAttribute('data-value');
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
   * @return {undefined}
   */
  updateCategories: function(categories) {
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
   * @return {undefined}
   */
  setCategories: function(categories) {
    this.list.empty();

    var self = this,
      previouslySelected = false;

    categories.forEach(function(val) {
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

      var id = '';
      if (typeof val.id === 'string' && val.id.length) {
        id = ' id="'+ val.id +'"';
      }

      var value = '',
        valueTypes = ['string', 'number'];
      if (valueTypes.indexOf(typeof val.value) > -1) {
        value = ' data-value="'+ val.value +'"';
      }

      var selected = '';
      if (val.checked === true && previouslySelected !== true) {
        selected = ' class="is-checked"';

        if (!self.settings.categoryMultiselect) {
          previouslySelected = true;
        }
      }

      self.list.append('<li'+ selected + id + value + '><a href="#">' + val.name + '</a></li>');
    });

    var api = this.categoryButton.data('popupmenu');
    if (api && typeof api.updated === 'function') {
      api.updated();
    }
  },

  /**
   * Determines whether or not a Category Trigger exists.
   * @returns {boolean}
   */
  hasCategoryButton: function() {
    return this.wrapper.find('.btn').length > 0;
  },

  /**
   * Category Button Close event handler
   * @private
   * @returns {function}
   */
  handlePopupClose: function() {
    return this.setAsActive(true, true);
  },

  /**
   * Clears the contents of the searchfield
   * @returns {undefined}
   */
  clear: function() {
    this.element.val('').trigger('change').focus();
  },

  /**
   * Adds a link at the bottom of a searchfield with more than (0) results that can be used to link out to a larger display of search results.
   * @private
   * @returns {undefined}
   */
  addMoreLink: function() {
    var list = $('#autocomplete-list'),
      val = this.element.val();

    if ($('.more-results', list).length > 0) {
      return;
    }

    $('<li class="separator" role="presentation"></li>').appendTo(list);
    var more = $('<li role="presentation"></li>').appendTo(list);
    this.moreLink = $('<a href="#" class="more-results" tabindex="-1" role="menuitem"></a>').html('<span>' + Locale.translate('AllResults') + ' "' + val + '"</span>').appendTo(more);
  },

  /**
   * Adds a link at the bottom of a searchfield with no results that announces no search results.
   * @private
   * @returns {undefined}
   */
  addNoneLink: function() {
    var list = $('#autocomplete-list');
    if ($('.no-results', list).length > 0) {
      return;
    }

    var none = $('<li role="presentation"></li>').appendTo(list);

    this.noneLink = $('<a href="#" class="no-results" tabindex="-1" role="menuitem"></a>').html('<span>' + Locale.translate('NoResults') + '</span>').appendTo(none);
  },

  /**
   * Tears down and rebuilds the Searchfield.
   * Can be called directly, but is also triggered by calling the "updated.searchfield" event on the searchfield element.
   * @returns {undefined}
   */
  updated: function(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }
    this.teardown().init();
  },

  /**
   * Enables the Searchfield
   * @returns {undefined}
   */
  enable: function() {
    this.element.prop('disabled', false);
  },

  /**
   * Disables the Searchfield
   * @returns {undefined}
   */
  disable: function() {
    this.element.prop('disabled', true);
  },

  /**
   * Performs the usual Boolean coercion with the exception of the strings "false" (case insensitive) and "0"
   * @private
   * @returns {boolean}
   */
  parseBoolean: function(b) {
    return !(/^(false|0)$/i).test(b) && !!b;
  },

  /**
   * Unbinds events and removes unnecessary markup.
   * @private
   * @returns {this}
   */
  teardown: function() {
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
   * @param {boolean} dontDestroyToolbarSearchfield - if true, will not pass through and destroy a linked instance of the Toolbar Searchfield component.
   * @returns {undefined}
   */
  destroy: function(dontDestroyToolbarSearchfield) {
    this.teardown();

    // Destroy the linked Toolbar Searchfield instance
    var tbsf = this.element.data('toolbarsearchfield');
    if (!dontDestroyToolbarSearchfield && tbsf && typeof tbsf.destroy === 'function') {
      tbsf.destroy(true);
    }

    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { SearchField, COMPONENT_NAME };
