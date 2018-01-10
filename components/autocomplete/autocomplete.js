/* eslint-disable no-nested-ternary, no-underscore-dangle */

import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { ListFilter } from '../listfilter/listfilter';
import { Locale } from '../locale/locale';
import { Tmpl } from '../tmpl/tmpl';

// jQuery Components
import '../utils/highlight';
import '../popupmenu/popupmenu.jquery';

// The Name of this components
const COMPONENT_NAME = 'autocomplete';

/*
 * Default Autocomplete Result Item Template.  This can be modified to add data points that
 * will be populated by adding properties to the object created
 * in `DEFAULT_AUTOCOMPLETE_RESULT_ITERATOR_CALLBACK`.
 */
const DEFAULT_AUTOCOMPLETE_TEMPLATE = `<li id="{{listItemId}}" data-index="{{index}}" {{#hasValue}}data-value="{{value}}"{{/hasValue}} role="listitem">
 <a href="#" tabindex="-1">
   <span>{{{label}}}</span>
 </a>
</li>`;

/*
* Autocomplete's method for obtaining the string that will be tested against a provided search
* term for a match. This is configurable in the event that the component you attach this to
* needs a specific part of it searched (instead of the whole thing).
* @param {String|Object} item - text string, or an object containing a 'label'.
* @returns {string} The item or item label.
*/
const DEFAULT_AUTOCOMPLETE_SEARCHABLE_TEXT_CALLBACK = function (item) {
  const isString = typeof item === 'string';
  return (isString ? item : item.label);
};

/*
* Autocomplete provides a method that will be run on every result that is passed back from the
* filtering API. This method can be replaced, allowing developers to customize the output of the
* returned dataset to add values that can also be displayed on each list item with a modified
* `DEFAULT_AUTOCOMPLETE_TEMPLATE`.
*/
const DEFAULT_AUTOCOMPLETE_RESULT_ITERATOR_CALLBACK = function resultIterator(item, index) {
  // For standard autocompletes with a popupmenu, build the dataset that
  // will be submitted to the template.
  const isString = typeof item === 'string';
  let dataset = {
    highlightTarget: 'label',
    index,
    listItemId: `ac-list-option${index}`
  };

  if (!isString) {
    dataset = utils.extend({}, dataset, item);
  } else {
    dataset.label = item;
  }

  dataset.hasValue = item.value !== undefined;
  if (dataset.hasValue) {
    dataset.value = item.value;
  }

  return dataset;
};

/*
  * @param {string} item
  * @param {object} options
  * @param {string} [options.alias]
  * @param {string} options.filterMode
  * @param {string} options.term
  * @returns {string}
  */
const DEFAULT_AUTOCOMPLETE_HIGHLIGHT_CALLBACK = function highlightMatch(item, options) {
  let targetProp = item;
  let hasAlias = false;

  // If this is an object and we need to replace text within a specific property,
  // look for an "alias" property to use instead of the item itself.
  if (typeof options.alias === 'string' && item[options.alias] !== undefined) {
    hasAlias = true;
    targetProp = item[options.alias];
  }

  // Easy match for 'contains'-style filterMode.
  if (options.filterMode === 'contains') {
    targetProp = targetProp.replace(new RegExp(`(${options.term})`, 'ig'), '<i>$1</i>');
  } else {
    // Handle "startsWith" filterMode highlighting a bit differently.
    const originalItem = targetProp;
    const pos = Locale.toLowerCase(originalItem).indexOf(options.term);

    if (pos > 0) {
      targetProp = `${originalItem.substr(0, pos)}<i>${originalItem.substr(pos, options.term.length)}</i>${originalItem.substr(options.term.length + pos)}`;
    } else if (pos === 0) {
      targetProp = `<i>${originalItem.substr(0, options.term.length)}</i>${originalItem.substr(options.term.length)}`;
    }
  }

  // place result back
  if (hasAlias) {
    item[options.alias] = targetProp;
  } else {
    item = targetProp;
  }

  return item;
};

/**
* @namespace
* @property {string} source Defines the data to use, must be specified.
* @property {string} sourceArguments If a source method is defined, this flexible
* object can be passed into the source method, and augmented with parameters specific to the
* implementation.
* @property {boolean} template If defined, use this to draw the contents of each
* search result instead of the default draw routine.
* @property {string} filterMode The matching algorithm, startsWith and contains
* are supported - false will not filter client side
* @property {boolean} delay The delay between key strokes on the keypad before it
* thinks you stopped typing
* @property {string} width Width of the open auto complete menu
* @property {string} offset For the open menu, the left or top offset
* @property {string} autoSelectFirstItem Whether or not to select he first item in the
* list to be selected
* @property {function} resultsCallback If defined, does not produce the results of the
* Autocomplete inside a popupmenu, instead piping them to a process defined inside this callback
* function.
*/
const AUTOCOMPLETE_DEFAULTS = {
  source: [],
  sourceArguments: {},
  template: undefined,
  filterMode: 'startsWith',
  delay: 300,
  width: null,
  offset: null,
  autoSelectFirstItem: false,
  highlightMatchedText: true,
  highlightCallback: DEFAULT_AUTOCOMPLETE_HIGHLIGHT_CALLBACK,
  resultIteratorCallback: DEFAULT_AUTOCOMPLETE_RESULT_ITERATOR_CALLBACK,
  displayResultsCallback: undefined,
  searchableTextCallback: DEFAULT_AUTOCOMPLETE_SEARCHABLE_TEXT_CALLBACK
};

/**
* The Autocomplete control provides an easier means of searching through a large amount of data by
* filtering down the results based on keyboard input from the user.
*
* @class Autocomplete
* @param {string} element The api element.
* @param {string} settings The settings element.
*/
function Autocomplete(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, AUTOCOMPLETE_DEFAULTS);

  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

// Plugin Object
Autocomplete.prototype = {

  init() {
    // data-autocomplete can be a url, 'source' or an array
    const data = this.element.attr('data-autocomplete');
    if (data && data !== 'source') {
      this.settings.source = data;
    }

    if (!this.listFilter) {
      this.listFilter = new ListFilter({
        filterMode: this.settings.filterMode,
        highlightMatchedText: this.settings.highlightMatchedText,
        searchableTextCallback: this.settings.searchableTextCallback
      });
    }

    this.addMarkup();
    this.handleEvents();
  },

  addMarkup() {
    this.element.addClass('autocomplete').attr({
      role: 'combobox',
      autocomplete: 'off'
    });
  },

  isLoading() {
    return this.element.hasClass('is-loading') && this.element.hasClass('is-blocked');
  },

  openList(term, items) {
    if (this.element.is('[disabled], [readonly]') || this.isLoading()) {
      return;
    }

    const self = this;
    term = Locale.toLowerCase(term);

    // append the list
    this.list = $('#autocomplete-list');
    if (this.list.length === 0) {
      this.list = $('<ul id="autocomplete-list" aria-expanded="true"></ul>').appendTo('body');
    }

    this.list[0].style.height = 'auto';
    this.list[0].style.width = `${this.element.outerWidth()}px`;
    this.list.addClass('autocomplete');
    this.list.empty();

    if (this.settings.width) {
      this.list[0].style.width = this.settings.width + (/(px|%)/i.test(`${this.settings.width}`) ? '' : 'px');
    }

    // Pre-compile template.
    // Try to get an element first, and use its contents.
    // If the string provided isn't a selector, attempt to use it as a string, or fall back
    // to the default template.
    const templateAttr = $(this.element.attr('data-tmpl'));
    this.tmpl = $(templateAttr).length ? $(templateAttr).text() :
      typeof templateAttr === 'string' ? templateAttr :
        $(this.settings.template).length ? $(this.settings.template).text() :
          typeof this.settings.template === 'string' ? this.settings.template :
            DEFAULT_AUTOCOMPLETE_TEMPLATE;

    // Send full item list to the ListFilter for filtering.
    const filterResult = this.listFilter.filter(items, term);
    const modifiedFilterResults = [];

    // Modify filtered results for a specific template with a `resultIteratorCallback`,
    // if applicable. Each of these results is deep-copied.
    if (filterResult !== false) {
      filterResult.forEach((val, index) => {
        let result = Soho.utils.extend(true, {}, val);
        result = self.settings.resultIteratorCallback(result, index);

        if (self.settings.highlightMatchedText) {
          const filterOpts = {
            filterMode: self.settings.filterMode,
            term
          };
          if (result._highlightTarget) {
            filterOpts.alias = result._highlightTarget;
          }
          result = self.settings.highlightCallback(result, filterOpts);
        }

        modifiedFilterResults.push(result);
      });
    }

    // If a "resultsCallback" method is defined, pipe the filtered items to that method and skip
    // building a popupmenu.
    if (typeof this.settings.displayResultsCallback === 'function') {
      this.settings.displayResultsCallback(modifiedFilterResults, () => {
        self.element.trigger('listopen', [modifiedFilterResults]);
      });
    }

    this.handleListResults(term, items, modifiedFilterResults);
  },

  handleListResults(term, items, filterResult) {
    const self = this;

    const afterPlaceCallback = function (placementObj) {
      if (placementObj.wasFlipped === true) {
        self.list.add(self.element).addClass('is-ontop');
        placementObj.y += 1;
      }
      return placementObj;
    };

    const popupOpts = {
      menuId: 'autocomplete-list',
      ariaListbox: true,
      mouseFocus: false,
      trigger: 'immediate',
      attachToBody: true,
      autoFocus: false,
      returnFocus: false,
      placementOpts: {
        parent: this.element,
        callback: afterPlaceCallback
      }
    };

    filterResult.forEach((dataset) => {
      if (typeof Tmpl !== 'undefined') {
        const compiledTmpl = Tmpl.compile(self.tmpl);
        const renderedTmpl = compiledTmpl.render(dataset);

        self.list.append($.sanitizeHTML(renderedTmpl));
      } else {
        const listItem = $('<li role="listitem"></li>');
        listItem.attr('id', dataset.listItemId);
        listItem.attr('data-index', dataset.index);
        listItem.attr('data-value', dataset.value);
        listItem.append(`<a href="#" tabindex="-1"><span>${dataset.label}</span></a>`);
        self.list.append($.sanitizeHTML(listItem));
      }
    });

    this.element.addClass('is-open')
      .popupmenu(popupOpts)
      .on('close.autocomplete', () => {
        self.closeList(true);
      });

    // Optionally select the first item in the list
    if (self.settings.autoSelectFirstItem) {
      self.list.children().filter(':not(.separator):not(.hidden):not(.heading):not(.group):not(.is-disabled)').first()
        .addClass('is-selected');
    }

    this.noSelect = true;
    /**
    * Fires after the menu is populated with its contents.
    *
    * @event populated
    * @property {object} event - The jquery event object
    * @property {object} filterResult - The results of the filtering
    */
    this.element.trigger('populated', [filterResult]).focus();

    // Overrides the 'click' listener attached by the Popupmenu plugin
    self.list.off('click touchend')
      .on('touchend.autocomplete click.autocomplete', 'a', (e) => {
        self.select(e, items);
      })
      .off('focusout.autocomplete').on('focusout.autocomplete', () => {
        self.checkActiveElement();
      });

    // Highlight anchors on focus
    const all = self.list.find('a').on('focus.autocomplete touchend.autocomplete', function () {
      self.highlight($(this), all);
    });

    if (this.settings.offset) {
      const domListParent = this.list.parent()[0];

      if (this.settings.offset.left) {
        domListParent.style.left = `${parseInt(domListParent.style.left, 10) + this.settings.offset.left}px`;
      }
      if (this.settings.offset.top) {
        domListParent.style.top = `${parseInt(domListParent.style.top, 10) + this.settings.offset.top}px`;
      }
    }

    // As chars are typed into the edit field, nothing was announced to indicate
    // that a value has been suggested, for the non-sighted user an offscreen span
    // added and will remove soon popup close that includes aria-live="polite"
    // which have the first suggested item automatically announced when it
    // appears without moving focus.
    self.list.parent('.popupmenu-wrapper').append(`${'' +
      '<span id="ac-is-arialive" aria-live="polite" class="audible">'}${
      $.trim(this.list.find('>li:first-child').text())
    }</span>`);

    this.noSelect = true;
    this.element.trigger('listopen', [filterResult]);
  },

  closeList(dontClosePopup) {
    const popup = this.element.data('popupmenu');
    if (!popup) {
      return;
    }

    if (!dontClosePopup) {
      popup.close();
    }

    this.element.trigger('listclose');
    $('#autocomplete-list').parent('.popupmenu-wrapper').remove();
    $('#autocomplete-list').remove();
    this.element.add(this.list).removeClass('is-open is-ontop');
  },

  listIsOpen() {
    return this.list instanceof $ && this.list.length && this.list.is(':visible');
  },

  // Handles the Autocomplete's "keydown" event
  handleAutocompleteKeydown(e) {
    const self = this;

    if (this.isLoading()) {
      e.preventDefault();
      return false;
    }

    if (!this.listIsOpen()) {
      return null;
    }

    function getHighlighted(items) {
      return items.filter('.is-selected');
    }

    function unhighlight(item) {
      item.removeClass('is-selected is-focused');
    }

    function highlight(item) {
      item.addClass('is-selected').find('a').focus();
    }

    const excludes = 'li:not(.separator):not(.hidden):not(.heading):not(.group):not(.is-disabled)';
    const items = this.list.find(excludes);
    const highlighted = getHighlighted(items);

    // Down - select next
    if (e.keyCode === 40 && this.listIsOpen()) {
      if (highlighted.length) {
        self.noSelect = true;
        unhighlight(highlighted);
        highlight(items.eq(items.index(highlighted) + 1));
        e.preventDefault();
        e.stopPropagation();
      }
    }

    // Up select prev
    if (e.keyCode === 38 && this.listIsOpen()) {
      if (highlighted.length) {
        self.noSelect = true;
        unhighlight(highlighted);
        highlight(items.eq(items.index(highlighted) - 1));
        e.preventDefault();
        e.stopPropagation();
      }
    }

    // Enter/Tab - apply selected item
    if ((e.keyCode === 9 || e.keyCode === 13) && this.listIsOpen()) {
      // Apply selection if an item is selected, otherwise close list and
      // allow default tab/enter behavior to happen
      if (highlighted.length) {
        e.stopPropagation();
        e.preventDefault();
        self.noSelect = true;
        self.select(highlighted, this.currentDataSet);
      } else {
        self.closeList();
      }
    }

    return null;
  },

  // Handles the Autocomplete's "input" event
  handleAutocompleteInput(e) {
    const self = this;

    if (self.isLoading()) {
      e.preventDefault();
      return false;
    }

    // Makes a new AJAX call every time a key is pressed.
    const waitForSource = this.getDataFromSource();
    waitForSource.done((term, response) => {
      self.currentDataSet = response;
      self.openList(term, response);
    });

    return null;
  },

  /**
   * Check to see whether or not the currently-focused element resides within
   * the Autocomplete's field or list, and if not, fires a "safe-blur" event on the element.
   *
   * @private
   * @param {object} e The event object passed in from the jQuery `.on()` listener.
   * @returns {void}
   */
  checkActiveElement() {
    const self = this;
    setTimeout(() => {
      const activeElem = document.activeElement;

      if ((self.listIsOpen() && $.contains(self.list[0], activeElem)) ||
        self.element.is(activeElem)) {
        return;
      }

      /**
      *  Fires after the input (and menu) both loose focus
      *
      * @event safe-blur
      * @property {object} event The input event object
      */
      self.element.trigger('safe-blur');
    }, 0);
  },

  getDataFromSource() {
    const self = this;

    // Don't attempt to load if we're already loading.
    if (self.isLoading()) {
      return false;
    }

    const field = this.element;
    const dfd = $.Deferred();
    let buffer;

    clearTimeout(this.loadingTimeout);

    function done(searchTerm, response, deferredStatus) {
      self.element.triggerHandler('complete'); // For Busy Indicator

      /**
      *  Fires when the ajax request (source option) is completed
      *
      * @event requestend
      * @property {object} event The input event object
      * @property {array} An array containing the searchTerm and call back function
      */
      self.element.trigger('requestend', [searchTerm, response]);

      if (deferredStatus === false) {
        return dfd.reject(searchTerm);
      }
      return dfd.resolve(searchTerm, response);
    }

    this.loadingTimeout = setTimeout(() => {
      if (self.isLoading()) {
        return;
      }

      buffer = field.val();
      if (buffer === '') {
        if (self.element.data('popupmenu')) {
          self.element.data('popupmenu').close();
        }
        return;
      }

      const sourceType = typeof self.settings.source;
      self.element.triggerHandler('start'); // For Busy Indicator

      /**
      * Fires when the ajax request (source option) is initiated
      *
      * @event requeststart
      * @property {object} event The input event object
      * @property {array} event An array with the buffer in it
      */
      self.element.trigger('requeststart', [buffer]);

      if (sourceType === 'function') {
        // Call the 'source' setting as a function with the done callback.
        self.settings.source(buffer, done, self.settings.sourceArguments);
      } else if (sourceType === 'object') {
        // Use the 'source' setting as pre-existing data.
        // Sanitize accordingly.
        const sourceData = $.isArray(self.settings.source) ?
          self.settings.source : [self.settings.source];
        done(buffer, sourceData, true);
      } else if (!self.settings.source) {
        dfd.reject(buffer);
      } else {
        // Attempt to resolve source as a URL string.  Do an AJAX get with the URL
        const sourceURL = self.settings.source.toString();
        const request = $.getJSON(sourceURL + buffer);

        request.done((data) => {
          done(buffer, data, true);
        }).fail(() => {
          done(buffer, [], false);
        });
      }
    }, self.settings.delay);

    return dfd;
  },

  /**
  * Resets a filtered autocomplete back to its original state.
  * @returns {void}
  */
  resetFilters() {
    this.openList('', this.currentDataSet);
  },

  // Handles the Autocomplete's "focus" event
  handleAutocompleteFocus() {
    const self = this;
    if (this.noSelect) {
      this.noSelect = false;
      return;
    }

    // select all text (after a delay since works better across browsers), but only if element is
    // still focused to avoid flashing cursor focus trap (since select causes focus event to
    // fire if no longer focused)
    setTimeout(() => {
      if (self.element.is(':focus')) {
        self.element.select();
      }
    }, 10);
  },

  highlight(anchor, allAnchors) {
    let text = anchor.text().trim();

    if (anchor.find('.display-value').length > 0) {
      text = anchor.find('.display-value').text().trim();
    }

    if (allAnchors && allAnchors.length) {
      allAnchors.parent('li').removeClass('is-selected');
    }
    anchor.parent('li').addClass('is-selected');

    this.noSelect = true;
    this.element.val(text).focus();
  },

  select(anchorOrEvent, items) {
    let a;
    let li;
    let ret;
    let isEvent = false;

    // Initial Values
    if (anchorOrEvent instanceof $.Event) {
      isEvent = true;
      a = $(anchorOrEvent.currentTarget);
    } else {
      a = anchorOrEvent;
    }

    if (a.is('li')) {
      li = a;
      a = a.children('a');
    }

    li = a.parent('li');
    ret = a.text().trim();
    const dataIndex = li.attr('data-index');
    const dataValue = li.attr('data-value');

    this.element.attr('aria-activedescendant', li.attr('id'));

    if (items && items.length) {
      // If the data-index attr is supplied, use it to get the item
      // (since two items could have same value)
      if (dataIndex) {
        ret = items[parseInt(dataIndex, 10)];
      } else if (dataValue) {
        // Otherwise use data-value to get the item (a custom template may not supply data-index)
        for (let i = 0, value; i < items.length; i++) {
          value = items[i].value.toString();
          if (value === dataValue) {
            ret = items[i];
          }
        }
      }
    }

    this.closeList();
    this.highlight(a);

    this.noSelect = true;
    this.element
      .trigger('selected', [a, ret])
      .focus();

    if (isEvent) {
      anchorOrEvent.preventDefault();
    }

    return false;
  },

  /*
  * Handle after list open.
  */
  handleAfterListOpen() {
    // Fix one pixel off list by element
    if (this.element.offset().left > this.list.offset().left) {
      this.list.width(this.list.width() + 1);
    }

    return this;
  },

  /**
   * Update the component with new settings.
   * @param {object} settings The new settings object to use.
   * @returns {void}
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element[0], settings, this.settings);
    }

    this.teardown().init();
    return this;
  },

  /**
  * Enable the input from readonly or disabled state.
  * @returns {void}
  */
  enable() {
    this.element.prop('disabled', false);
  },

  /**
  * Disable the input from editing
  * @returns {void}
  */
  disable() {
    this.element.prop('disabled', true);
  },

  teardown() {
    const popup = this.element.data('popupmenu');
    if (popup) {
      popup.destroy();
    }

    this.element.off('keypress.autocomplete focus.autocomplete requestend.autocomplete updated.autocomplete');
    return this;
  },

  /**
  * Teardown and remove any added markup and events.
  * @returns {void}
  */
  destroy() {
    this.teardown();
    $.removeData(this.element[0], COMPONENT_NAME);
  },

  /**
  * Setup the event handlers.
  * @private
  * @returns {void}
  */
  handleEvents() {
    // similar code as dropdown but close enough to be dry
    const self = this;

    this.element.off('updated.autocomplete').on('updated.autocomplete', () => {
      self.updated();
    }).off('keydown.autocomplete').on('keydown.autocomplete', (e) => {
      self.handleAutocompleteKeydown(e);
    })
      .off('input.autocomplete')
      .on('input.autocomplete', (e) => {
        self.handleAutocompleteInput(e);
      })
      .off('focus.autocomplete')
      .on('focus.autocomplete', () => {
        self.handleAutocompleteFocus();
      })
      .off('focusout.autocomplete')
      .on('focusout.autocomplete', () => {
        self.checkActiveElement();
      })
      /**
      * Fires when the menu is opened.
      * @event listopen
      * @property {object} event - The jquery event object
      * @property {object} ui - The dialog object
      */
      .off('listopen.autocomplete')
      .on('listopen.autocomplete', () => {
        self.handleAfterListOpen();
      })
      /**
      * Comes from Searchfields wrapping an autocomplete - resets
      * a filtered autocomplete back to normal.
      * @event listopen
      * @property {object} event - The jquery event object
      */
      .off('resetfilter.autocomplete')
      .on('resetfilter.autocomplete', () => {
        self.resetFilters();
      });
  }

};

export { Autocomplete, COMPONENT_NAME };
/* eslint-enable no-nested-ternary */
