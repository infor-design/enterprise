/* eslint-disable no-nested-ternary, prefer-template */

import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { DOM } from '../../utils/dom';
import { ListFilter } from '../listfilter/listfilter';
import { Locale } from '../locale/locale';
import { Tmpl } from '../tmpl/tmpl';
import { stringUtils } from '../../utils/string';
import { xssUtils } from '../../utils/xss';

// jQuery Components
import '../../utils/highlight';
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
 * Provides a method for highlighting or calling out the matching search term
 * within rendered filter results.  Note that this method will not be run by the
 * Autocomplete if the component is configured with an external `displayResultsCallback` method
 * for handling the display of filter results.
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
    targetProp = targetProp.replace(new RegExp('(' + stringUtils.escapeRegExp(options.term) + ')', 'ig'), '<i>$1</i>');
  } else if (options.filterMode === 'keyword') {
    // Handle "keyword" filterMode
    const keywords = options.term.split(' ');
    for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i];

      if (keyword) {
        targetProp = targetProp.replace(new RegExp('(' + stringUtils.escapeRegExp(keyword) + ')', 'ig'), '<i>$1</i>');
      }
    }
  } else {
    // Handle "startsWith" filterMode highlighting a bit differently.
    const originalItem = targetProp;
    let testContent = `${originalItem}`;
    if (!options.caseSensitive) {
      testContent = Locale.toLowerCase(testContent);
    }
    const safeTerm = stringUtils.escapeRegExp(options.term);
    const pos = testContent.indexOf(safeTerm);

    if (pos > 0) {
      targetProp = originalItem.substr(0, pos) + '<i>' + originalItem.substr(pos, safeTerm.length) + '</i>' + originalItem.substr(safeTerm.length + pos);
    } else if (pos === 0) {
      targetProp = '<i>' + originalItem.substr(0, safeTerm.length) + '</i>' + originalItem.substr(safeTerm.length);
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
* The Autocomplete control provides an easier means of searching through a large amount of data by filtering
* down the results based on keyboard input from the user.
* @class Autocomplete
* @param {object} element The component element.
* @param {object} [settings] The component settings.
* @param {string} [settings.source=[]] Defines the data to use, must be specified.
* @param {string} [settings.sourceArguments={}] If a source method is defined, this flexible object can be passed
* into the source method, and augmented with parameters specific to the implementation.
* @param {boolean} [settings.template If defined, use this to draw the contents of each search result instead of the default draw routine.
* @param {boolean} [settings.caseSensitive=false] if true, causes filter results that don't match case to be thrown out
* @param {string} [settings.filterMode='startsWith'] The matching algorithm, startsWith, keyword and contains are supported - false will not filter client side
* @param {boolean} [settings.delay=300] The delay between key strokes on the keypad before it thinks you stopped typing
* @param {string} [settings.width=null] Width of the open auto complete menu
* @param {string} [settings.offset=null] For the open menu, the left or top offset
* @param {string} [settings.autoSelectFirstItem=false] Whether or not to select he first item in the list to be selected
* @param {boolean} [settings.highlightMatchedText=true] The highlightMatchText property.
* @param {function} [settings.highlightCallback] The highlightCallback property.
* @param {function} [settings.resultIteratorCallback] The resultIteratorCallback property.
* @param {function} [settings.clearResultsCallback] the clearResultsCallback property.
* @param {function} [settings.displayResultsCallback] The displayResultsCallback property.
* @param {function} [settings.searchableTextCallback] The searchableTextCallback property.
*/
const AUTOCOMPLETE_DEFAULTS = {
  source: [],
  sourceArguments: {},
  template: undefined,
  filterMode: 'wordStartsWith',
  caseSensitive: false,
  delay: 300,
  width: null,
  offset: null,
  autoSelectFirstItem: false,
  highlightMatchedText: true,
  highlightCallback: DEFAULT_AUTOCOMPLETE_HIGHLIGHT_CALLBACK,
  resultIteratorCallback: DEFAULT_AUTOCOMPLETE_RESULT_ITERATOR_CALLBACK,
  clearResultsCallback: undefined,
  displayResultsCallback: undefined,
  searchableTextCallback: DEFAULT_AUTOCOMPLETE_SEARCHABLE_TEXT_CALLBACK
};

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
      this.element.removeAttr('data-autocomplete');
    }

    const listFilterSettings = {
      filterMode: this.settings.filterMode,
      caseSensitive: this.settings.caseSensitive,
      highlightMatchedText: this.settings.highlightMatchedText,
      searchableTextCallback: this.settings.searchableTextCallback
    };
    if (!this.listFilter) {
      this.listFilter = new ListFilter(listFilterSettings);
    } else {
      this.listFilter.updated(listFilterSettings);
    }

    this.addMarkup();
    this.handleEvents();
  },

  /**
   * @returns {boolean} whether or not this component instance has an element that is focused.
   */
  get isFocused() {
    const active = document.activeElement;
    const input = this.element[0];
    const $list = this.list;

    if (input.isEqualNode(active) || ($list && $list.length && $list[0].contains(active))) {
      return true;
    }
    return false;
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

    if (!this.element.hasClass('searchfield')) {
      const canOpen = this.element.triggerHandler('beforeopen.autocomplete', { elem: this.element, value: this.element.val() });
      if (canOpen === false) {
        return;
      }
    }

    const self = this;
    if (!this.settings.caseSensitive) {
      term = Locale.toLowerCase(term);
    }

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
        if (typeof val === 'string') {
          val = { label: val, value: val };
        }

        let result = utils.extend(true, {}, val);
        result = self.settings.resultIteratorCallback(result, index);

        if (self.settings.highlightMatchedText) {
          const filterOpts = {
            filterMode: self.settings.filterMode,
            caseSensitive: self.settings.caseSensitive,
            term
          };
          if (result.highlightTarget) {
            filterOpts.alias = result.highlightTarget;
          }
          // Only render highlight results if we don't do this manually
          // in another component's rendering method.
          if (!self.settings.displayResultsCallback) {
            result = self.settings.highlightCallback(result, filterOpts);
          }
        }

        modifiedFilterResults.push(result);
      });
    }

    this.currentDataSet = modifiedFilterResults;

    // If a "resultsCallback" method is defined, pipe the filtered items to that method and skip
    // building a popupmenu.
    if (typeof this.settings.displayResultsCallback === 'function') {
      this.settings.displayResultsCallback(modifiedFilterResults, () => {
        self.element.trigger('listopen', [modifiedFilterResults]);
      }, term);
      return;
    }

    this.handleListResults(term, items, modifiedFilterResults);
  },

  handleListResults(term, items, filterResult) {
    const self = this;

    filterResult.forEach((dataset) => {
      if (typeof Tmpl !== 'undefined') {
        const renderedTmpl = Tmpl.compile(self.tmpl, dataset);
        DOM.append(self.list, renderedTmpl, '*');
      }
    });

    /**
     * Fires before the menu DOM is populated with the filter results.
     *
     * @event beforepopulated
     * @memberof Autocomplete
     * @param {object} event - The jquery event object
     * @param {object} filterResult - The results of the filtering
     */
    this.element.trigger('beforepopulated', [filterResult]);

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
      triggerSelect: false,
      placementOpts: {
        parent: this.element,
        callback: afterPlaceCallback
      }
    };

    if (!this.previouslyOpened) {
      this.element.addClass('is-open')
        .popupmenu(popupOpts)
        .one('close.autocomplete', () => {
          self.closeList(true);
        });
    } else {
      const popupmenuAPI = this.element.data('popupmenu');
      if (popupmenuAPI) {
        popupmenuAPI.position();
      }
    }

    // Adjust the widths of the LIs to the longest
    const lis = self.list.find('li');
    const width = $(lis[0]).find('span').outerWidth() + 20;
    if (width > parseInt(this.element.outerWidth(), 10)) {
      for (let i = 0; i < lis.length; i++) {
        lis.width(width + 'px');
      }
      this.maxWidth = width;
    }

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
    * @memberof Autocomplete
    * @param {object} event - The jquery event object
    * @param {object} filterResult - The results of the filtering
    */
    this.element.trigger('populated', [filterResult]).focus();

    if (!this.previouslyOpened) {
      // Overrides the 'click' listener attached by the Popupmenu plugin
      self.list
        .on(`touchend.${COMPONENT_NAME} click.${COMPONENT_NAME}`, 'a', (e) => {
          self.select(e);
        })
        .on(`focusout.${COMPONENT_NAME}`, () => {
          self.checkActiveElement();
        });

      // Highlight anchors on focus
      const all = self.list.find('a').on(`focus.${COMPONENT_NAME} touchend.${COMPONENT_NAME}`, function () {
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
    }

    // As chars are typed into the edit field, nothing was announced to indicate
    // that a value has been suggested, for the non-sighted user an offscreen span
    // added and will remove soon popup close that includes aria-live="polite"
    // which have the first suggested item automatically announced when it
    // appears without moving focus.
    const previousLiveMessages = utils.getArrayFromList(document.querySelectorAll('#ac-is-arialive'));
    if (previousLiveMessages) {
      previousLiveMessages.forEach((messageElem) => {
        messageElem.parentNode.removeChild(messageElem);
      });
    }

    DOM.append(
      self.list.parent('.popupmenu-wrapper'),
      `<span id="ac-is-arialive" aria-live="polite" class="audible">${
        $.trim(this.list.find('>li:first-child').text())
      }</span>`,
      '<div><span><a><small><img><svg><i><b><use><br><strong><em>'
    );

    this.noSelect = true;
    this.previouslyOpened = true;
    this.element.trigger('listopen', [filterResult]);
  },

  closeList(dontClosePopup) {
    if (!this.list) {
      return;
    }

    // Remove events
    this.list.off([
      `click.${COMPONENT_NAME}`,
      `keydown.${COMPONENT_NAME}`,
      `touchend.${COMPONENT_NAME}`,
      `focusout.${COMPONENT_NAME}`
    ].join(' '));
    this.list.find('a').off(`focus.${COMPONENT_NAME} touchend.${COMPONENT_NAME}`);

    this.element.trigger('listclose');

    if (typeof this.settings.clearResultsCallback === 'function') {
      this.settings.clearResultsCallback();
      return;
    }

    const popup = this.element.data('popupmenu');
    if (!popup) {
      return;
    }
    if (!dontClosePopup) {
      popup.close();
    }

    $('#autocomplete-list').parent('.popupmenu-wrapper').remove();
    $('#autocomplete-list').remove();
    this.element.add(this.list).removeClass('is-open is-ontop');
    delete this.previouslyOpened;
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
      let highlightedItems = items.filter('.is-selected');
      if (highlightedItems.length === 0) {
        highlightedItems = items.filter('.is-focused');
      }
      return highlightedItems;
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
        self.select(highlighted);
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
      * @memberof Autocomplete
      * @param {object} event The input event object
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
      * @memberof Autocomplete
      * @param {object} event The input event object
      * @param {array} An array containing the searchTerm and call back function
      */
      self.element.trigger('requestend', [searchTerm, response]);

      if (deferredStatus === false) {
        return dfd.reject(searchTerm);
      }
      return dfd.resolve(xssUtils.stripTags(searchTerm), response);
    }

    this.loadingTimeout = setTimeout(() => {
      if (self.isLoading() || !self.isFocused) {
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
      * @memberof Autocomplete
      * @param {object} event The input event object
      * @param {array} event An array with the buffer in it
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
      } else if (self.settings.filterMode === 'keyword') {
        let keywordData = [];
        const mergeData = function (data) {
          if (keywordData.length === 0) {
            keywordData = data;
          } else {
            // Check for duplicate entries
            for (let i = 0; i < data.length; i++) {
              const dataItem = data[i];

              let isExists = false;

              for (let ii = 0; ii < keywordData.length; ii++) {
                const keywordItem = keywordData[ii];

                for (let iii = 0; iii < Object.getOwnPropertyNames(keywordItem).length; iii++) {
                  const dataPropVal = dataItem[Object.getOwnPropertyNames(dataItem)[iii]];
                  const keywordPropVal = keywordItem[Object.getOwnPropertyNames(keywordItem)[iii]];

                  if (dataPropVal === keywordPropVal) {
                    isExists = true;
                    break;
                  }
                }
              }

              if (!isExists) {
                keywordData.push(dataItem);
              }
            }
          }
        };

        const doneData = function (data) {
          mergeData(data);

          done(buffer, keywordData, true);
        };

        const keywords = buffer.split(' ');
        if (keywords[keywords.length - 1] === '') {
          keywords.splice(-1, 1);
        }

        for (let i = 0; i < keywords.length; i++) {
          const keyword = keywords[i];

          if (keyword.length > 0) {
            const sourceURL = self.settings.source.toString();
            const request = $.getJSON(sourceURL + keyword);

            if (i < keywords.length - 1) {
              request.done(mergeData).fail(mergeData);
            } else {
              request.done(doneData).fail(doneData);
            }
          }
        }
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
    self.element.select();
  },

  /**
   * Highlights (and focuses) an Autocomplete list option
   * @param {jQuery} anchor the anchor to be highlighted
   * @param {jQuery[]} [allAnchors=null] optional list of anchors to deselect when the new one becomes selected.
   * @returns {void}
   */
  highlight(anchor, allAnchors) {
    const val = this.element.val();
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
    if (val !== text) {
      this.element.triggerHandler('change');
    }
  },

  /**
   * Selects an Autocomplete result.
   * @param {jQuery|jQuery.Event} anchorOrEvent either a reference to a jQuery-wrapped HTMLElement, or a jQuery Event object with a target.
   * @param {object[]} [items=this.currentDataSet] an array of objects representing autocomplete options.
   * @returns {object} contains information about the selected item.
   */
  select(anchorOrEvent, items) {
    let a;
    let li;
    let ret = {};
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
    const dataIndex = li.attr('data-index');
    const dataValue = li.attr('data-value');

    this.element.attr('aria-activedescendant', li.attr('id'));

    if (!items || !items.length) {
      items = this.currentDataSet;
    }

    // If the data-index attr is supplied, use it to get the item
    // (since two items could have same value)
    if (dataIndex) {
      ret = items[parseInt(dataIndex, 10)];
    } else if (dataValue) {
      // Otherwise use data-value to get the item (a custom template may not supply data-index)
      for (let i = 0, value; i < items.length; i++) {
        if (typeof items[i] === 'object' && items[i].value !== undefined) {
          value = items[i].value.toString();
        } else {
          value = items[i].toString();
        }

        if (value === dataValue) {
          if (typeof items[i] === 'object') {
            ret = items[i];
          }
          ret.value = value;
        }
      }
    }

    // Use the label as the value, if we're not working from a true dataset
    if (!ret.value || !ret.value.length === 0) {
      ret.value = a.text().trim();
    }

    this.highlight(a);

    this.noSelect = true;

    // Update the data for the event
    ret.label = xssUtils.stripHTML(ret.label);

    // Add these elements for key down vs click consistency
    if (!ret.highlightTarget) {
      ret.highlightTarget = 'label';
      ret.index = parseInt(dataIndex, 10);
      ret.listItemId = 'ac-list-option' + ret.index;
      ret.hasValue = true;
    }

    /**
    *  Fires when an element is selected from the list.
    *
    * @event selected
    * @memberof Autocomplete
    * @param {array} args An array containing the link and the return object.
    */
    this.element.trigger('selected', [a, ret]);

    if (isEvent) {
      anchorOrEvent.preventDefault();
    }

    this.closeList();
    this.element.focus();

    return ret;
  },

  /*
  * Handle after list open.
  */
  handleAfterListOpen() {
    // Fix one pixel off list by element
    if (this.element.offset().left > this.list.offset().left) {
      this.list.width(this.list.width() + 1);
    }



    // Allow keyboard handling when focus is inside the Autocomplete list.
    // See https://github.com/infor-design/enterprise-ng/issues/901
    this.list.on(`keydown.${COMPONENT_NAME}`, (e) => {
      if (e.key === 'Enter') {
        this.handleAutocompleteKeydown(e);
      }
    });

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

    if (settings && settings.source) {
      this.settings.source = settings.source;
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

    this.element.off([
      `focus.${COMPONENT_NAME}`,
      `focusout.${COMPONENT_NAME}`,
      `input.${COMPONENT_NAME}`,
      `keydown.${COMPONENT_NAME}`,
      `listopen.${COMPONENT_NAME}`,
      `requestend.${COMPONENT_NAME}`,
      `resetfilter.${COMPONENT_NAME}`,
      `updated.${COMPONENT_NAME}`
    ].join(' '));
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

    this.element
      .on(`updated.${COMPONENT_NAME}`, () => {
        self.updated();
      })
      .on(`keydown.${COMPONENT_NAME}`, (e) => {
        self.handleAutocompleteKeydown(e);
      })
      .on(`input.${COMPONENT_NAME}`, (e) => {
        self.handleAutocompleteInput(e);
      })
      .on(`focus.${COMPONENT_NAME}`, () => {
        self.handleAutocompleteFocus();
      })
      .on(`focusout.${COMPONENT_NAME}`, () => {
        self.checkActiveElement();
      })
      /**
      * Fires when the menu is opened.
      * @event listopen
      * @memberof Autocomplete
      * @param {object} event - The jquery event object
      * @param {object} ui - The dialog object
      */
      .on(`listopen.${COMPONENT_NAME}`, () => {
        self.handleAfterListOpen();
      })
      /**
      * Comes from Searchfields wrapping an autocomplete - resets
      * a filtered autocomplete back to normal.
      * @event listopen
      * @memberof Autocomplete
      * @param {object} event - The jquery event object
      */
      .on(`resetfilter.${COMPONENT_NAME}`, () => {
        self.resetFilters();
      });
  }

};

export { Autocomplete, COMPONENT_NAME };
/* eslint-enable no-nested-ternary */
