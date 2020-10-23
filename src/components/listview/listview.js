/* eslint-disable no-underscore-dangle, no-continue, no-nested-ternary */
import * as debug from '../../utils/debug';
import { deprecateMethod } from '../../utils/deprecated';
import { utils } from '../../utils/utils';
import { DOM } from '../../utils/dom';
import { stringUtils as str } from '../../utils/string';
import { Tmpl } from '../tmpl/tmpl';
import { ListFilter } from '../listfilter/listfilter';
import { Locale } from '../locale/locale';

// jQuery Components
import '../../utils/animations';
import '../pager/pager.jquery';
import '../popupmenu/popupmenu.jquery';
import '../searchfield/searchfield.jquery';
import '../emptymessage/emptymessage.jquery';

const COMPONENT_NAME = 'listview';

/**
 * Creates lists of small pieces of relevant, actionable information.
 * @class ListView
 * @constructor
 *
 * @param {jquery[]|htmlelement} element the base element
 * @param {object} [settings] incoming settings
 * @param {array} [settings.dataset] Array of data to feed the template
 * @param {string} [settings.template] Html Template String
 * @param {string} [settings.description] Audible Label (or use parent title)
 * @param {boolean} [settings.paging=false] If true, activates paging
 * @param {number} [settings.pagesize=10] If paging is activated, sets the number of listview items available per page
 * @param {boolean} [settings.searchable=false] If true, associates itself with a Searchfield/Autocomplete and allows itself to be filtered
 * @param {boolean} [settings.highlight=true] If false the highlighting of text when using searchable is disabled. You may want to disable this on larger lists.
 * @param {string|boolean} [settings.selectable='single'] selection mode, can be false, 'single', 'multiple' or 'mixed'
 * @param {boolean} [settings.allowDeselect=true] If using single select you can set this if you want the rows to not be deSelected.
 * @param {boolean} [settings.selectOnFocus=true] If true the first item in the list will be selected as it is focused.
 * @param {boolean} [settings.showCheckboxes=true] If false will not show checkboxes used with multiple selection mode only
 * @param {boolean} [settings.hoverable=true] If true the list element will show a hover action to indicate its actionable.
 * @param {string} [settings.emptyMessage] Text to go in emptyMessage.
 * @param {function|string} [settings.source] If source is a string then it serves as
  the url for an ajax call that returns the dataset. If its a function it is a call back for getting the data asyncronously.
 * @param {boolean} [settings.forceToRenderOnEmptyDs=false] If true list will render as an empty list with ul tag, but not any li tags in it.
 * @param {boolean} [settings.disableItemDeactivation=false] If true when an item is
  activated the user should not be able to deactivate it by clicking on the activated item. They can only select another row.
 * @param {boolean} [settings.showPageSizeSelector=false] If true the page size select will be shown when paging.
 * @param {object} [settings.listFilterSettings=null] If defined as an object, passes settings into the internal ListFilter component
 * @param {object} [settings.pagerSettings=null] If defined as an object, passes settings into the internal Pager component
 * @param {object} [settings.searchTermMinSize=1] The search term will trigger filtering only when its length is greater than or equals to the value.
 * @param {object} [settings.initializeContents=false] If true the initializer will be run on all internal contents.
 * @param {string} [settings.attributes] Add extra attributes like id's to the listview. For example `attributes: { name: 'id', value: 'my-unique-id' }`
 */
const LISTVIEW_DEFAULTS = {
  dataset: [],
  template: null,
  description: null,
  paging: false,
  pagesize: 10,
  searchable: false,
  highlight: true,
  selectable: 'single',
  selectOnFocus: true,
  showCheckboxes: true,
  hoverable: true,
  emptyMessage: null,
  source: null,
  forceToRenderOnEmptyDs: false,
  disableItemDeactivation: false,
  allowDeselect: true,
  showPageSizeSelector: false,
  listFilterSettings: null,
  pagerSettings: {
    showFirstButton: false,
    showLastButton: false
  },
  searchTermMinSize: 1,
  initializeContents: false,
  attributes: null,
};

function ListView(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, LISTVIEW_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);

  return this;
}

ListView.prototype = {

  /**
   * @returns {Pager|undefined} Pager component instance, if one exists
   */
  get pagerAPI() {
    return this.element.data('pager');
  },

  /**
   * @returns {object} containing valid Pager Component settings
   */
  get pagerSettings() {
    let pagerSettings = {};
    if (this.settings.pagerSettings) {
      pagerSettings = this.settings.pagerSettings;
    }
    pagerSettings.dataset = this.settings.dataset;
    pagerSettings.source = this.settings.source;
    pagerSettings.type = 'list';

    // Backwards compatibility for direct pager settings
    const oldSettingTypes = ['pagesize', 'showPageSizeSelector'];
    for (let i = 0; i < oldSettingTypes.length; i++) {
      if (this.settings[oldSettingTypes[i]] !== undefined && !pagerSettings[oldSettingTypes[i]]) {
        pagerSettings[oldSettingTypes[i]] = this.settings[oldSettingTypes[i]];
      }
    }

    return pagerSettings;
  },

  /**
   * Initialize this component.
   * @private
   * @returns {void}
   */
  init() {
    this.setup();
    this.handleEvents();
    this.refresh();
    this.selectedItems = [];
    this.lastSelectedItem = 0; // Rember index to use shift key
    this.isSelectedAll = false; // Rember if all selected or not
    this.sortInit('listview', 'click.listview', 'data-sortlist');
    this.handleResize();
  },

  /**
   * Do initial dom and settings setup.
   * @private
   * @returns {void}
   */
  setup() {
    const self = this;
    const card = this.element.closest('.card, .widget');
    const selectable = this.element.attr('data-selectable');
    const selectOnFocus = this.element.attr('data-select-onfocus');

    // Check for legacy data attributes
    if (this.element.attr('data-pagesize')) {
      const pagesize = Number(this.element.attr('data-pagesize'));
      if (!isNaN(pagesize)) {
        this.settings.pagesize = pagesize;
      }
      this.element.removeAttr('data-pagesize');
    }

    // Convert a DOM-based list into a stored dataset (legacy)
    if (!this.settings.dataset.length) {
      if (this.element.is('ul') && this.element.children('li').length) {
        const items = this.element.children('li');
        if (!this.settings.template) {
          this.settings.template = '{{#dataset}}<li>{{text}}</li>{{/dataset}}';
        }
        items.each((i, item) => {
          this.settings.dataset.push({ text: $(item).text() });
        });
        items.remove();
      }
    }

    // Search the global variable space for a dataset variable name, if provided.
    if (this.settings.dataset && typeof this.settings.dataset === 'string') {
      const globalDataset = window[this.settings.dataset];
      if (globalDataset && globalDataset.length) {
        this.settings.dataset = globalDataset;
      }
    }

    if (selectable && selectable.length) {
      this.settings.selectable = selectable;
    }

    if (selectOnFocus && selectOnFocus.length) {
      this.settings.selectOnFocus = JSON.parse(selectOnFocus);
    }

    self.actionButton = card.find('.btn-actions');

    if (self.actionButton.length > 0) {
      // Action Buttons may already be invoked via initialize.js.
      if (!(self.actionButton.data('popupmenu'))) {
        self.actionButton.popupmenu();
      }
    }

    this.element.attr({ tabindex: '-1', 'x-ms-format-detection': 'none' });

    // Add user-defined attributes
    if (this.settings.attributes) {
      utils.addAttributes(this.element, this, this.settings.attributes, 'listview');
    }

    // Configure Paging
    if (this.element.is('.paginated') || this.settings.paging === true) {
      this.element.pager(this.pagerSettings);
    }

    const cardWidgetContent = this.element.parent('.card-content, .widget-content');
    if (cardWidgetContent[0]) {
      cardWidgetContent[0].style.overflow = 'hidden';
    }

    // Associate with an existing searchfield, if applicable
    if (this.settings.searchable) {
      this.searchfield = this.element.parent().find('.searchfield, .autocomplete');

      if (!this.searchfield.length) {
        // TODO: Create Searchfield somehow
      }

      // Setup the ListFilter with externally-defined settings, if applicable
      let listFilterSettings = {
        filterMode: 'contains'
      };
      if (typeof this.settings.listFilterSettings === 'object') {
        listFilterSettings = utils.extend({}, listFilterSettings, this.settings.listFilterSettings);
      }

      this.listfilter = new ListFilter(listFilterSettings);
    }

    if (this.settings.emptyMessage) {
      // Object { title: "No Data Available", info: "", icon: "icon-empty-no-data" }
      self.emptyMessageContainer = $('<div>').emptymessage(this.settings.emptyMessage);
    }
  },

  /**
   * Calculate the totals for totalling examples.
   * This is displayed in the template by referencing {{totals}}.
   * @private
   * @param {array} dataset the incoming dataset
   * @returns {number} the total number of listview items.
   */
  getTotals(dataset) {
    const totals = { count: dataset.length };
    let property;

    if (!dataset[0]) {
      return undefined;
    }

    for (property in dataset[0]) { //eslint-disable-line
      totals[property] = 0;
    }

    for (let i = 0; i < dataset.length; i++) {
      for (property in dataset[i]) { //eslint-disable-line
        totals[property] += parseFloat(dataset[i][property]);
      }
    }
    return totals;
  },

  /**
   * Render the template against the dataset.
   * @private
   * @param {array} dataset  The dataset to use
   * @param {object} pagerInfo  Pager instructions
   */
  render(dataset, pagerInfo) {
    const self = this;
    const isServerSide = typeof this.settings.source === 'function';
    let totals = {};
    let displayedDataset = dataset;
    let firstRecordIdx = 0;
    let lastRecordIdx = displayedDataset ? displayedDataset.length : 0;
    let pagesize = this.settings.pagesize;
    let setSize = dataset.length;

    if (pagerInfo) {
      pagesize = pagerInfo.pagesize || pagesize;
      setSize = pagerInfo.filteredTotal || setSize;
    }

    if (!isServerSide && this.pagerAPI) {
      this.renderPager(pagerInfo, true);
      pagerInfo = this.pagerAPI.state;
    }

    // If the paging information sets limits on the dataset, customize the
    // displayed dataset to fit the conditions.
    if (setSize > pagesize) {
      const pages = this.filteredDataset ? pagerInfo.filteredPages : pagerInfo.pages;
      if (pages > 1) {
        let trueActivePage = pagerInfo.activePage > 0 ? pagerInfo.activePage - 1 : 0;
        if (this.filteredDataset) {
          trueActivePage = pagerInfo.filteredActivePage - 1;
        }
        firstRecordIdx = pagerInfo.pagesize * trueActivePage;
        lastRecordIdx = pagerInfo.pagesize * (trueActivePage + 1);
        displayedDataset = dataset.slice(firstRecordIdx, lastRecordIdx);
      }
    }

    // Render "mustache" Template
    if (typeof Tmpl === 'object' && displayedDataset && this.settings.template) {
      // create a copy of an inlined template
      if (this.settings.template instanceof $) {
        this.settings.template = `${this.settings.template.html()}`;
      } else if (typeof this.settings.template === 'string') {
        // If a string doesn't contain HTML elments,
        // assume it's an element ID string and attempt to select with jQuery
        if (!str.containsHTML(this.settings.template)) {
          this.settings.template = $(`#${this.settings.template}`).html();
        }
      }

      if (this.settings.template.indexOf('{{#totals}}') > -1) {
        totals = this.getTotals(dataset);
      }

      const renderedTmpl = Tmpl.compile(this.settings.template, {
        dataset: displayedDataset,
        totals
      });

      if (this.element.parent().is('.scrollable-flex-content')) {
        this.element.parent().find('.empty-message').remove();
      }

      if (displayedDataset.length > 0 || this.settings.forceToRenderOnEmptyDs) {
        this.element.html(renderedTmpl);
      } else if (self.emptyMessageContainer && this.element.parent().is('.scrollable-flex-content')) {
        this.element.empty();
        DOM.append(this.element.parent(), this.emptyMessageContainer[0].outerHTML, '<div><svg><use><span><b>');
      } else if (self.emptyMessageContainer) {
        this.element.empty();
        DOM.append(this.element, this.emptyMessageContainer[0].outerHTML, '<div><svg><use><span><b>');
      } else if (displayedDataset.length === 0) {
        this.element.html(renderedTmpl || '<ul></ul>');
      }
    }

    // Add Aria
    const card = this.element.closest('.card, .widget');
    $('ul', this.element).attr({
      role: 'listbox',
      'aria-label': this.settings.description || card.find('.card-title, .widget-title').text() || 'List'
    });

    // Add Checkboxes
    const first = this.element.find('li, tbody > tr').first();
    const items = this.element.find('li, tr');
    const isMultiselect = (this.settings.selectable === 'multiple' || this.settings.selectable === 'mixed');

    // Set Initial Tab Index
    this.focusItem = first.attr('tabindex', 0);

    // Let the link be focus'd
    if (!this.settings.selectable && first.find('a').length === 1) {
      first.removeAttr('tabindex');
    }

    // When DOM items are not rendered with "mustache" template, filtered items
    // have to be hidden specifically.
    const hideFlag = items.length > displayedDataset.length;

    items.each(function (i) {
      const item = $(this);

      item.attr('role', 'option');

      // Add user-defined attributes
      if (self.settings.attributes) {
        utils.addAttributes(item, self, self.settings.attributes, `listview-item-${i}`);
      }

      if (isMultiselect) {
        // Add Selection Checkboxes
        self.element.addClass('is-multiselect');

        // Create a Toolbar for the "Selected Items" area
        const selectedToolbar = self.element.prevAll('.toolbar');
        if (selectedToolbar.length && selectedToolbar.data('toolbar')) {
          selectedToolbar.data('toolbar').toggleMoreMenu();
        }

        if (self.settings.showCheckboxes) {
          // Only need one checkbox
          if (item.children('.listview-selection-checkbox').length === 0) {
            // For mixed selection mode primarily append a checkbox object
            item.prepend(`<label class="listview-selection-checkbox l-vertical-center inline inline-checkbox">
              <input tabindex="-1" type="checkbox" class="checkbox">
              <span class="label-text" role="presentation">
                <span class="audible">${Locale.translate('Checkbox')} ${Locale.translate('NotSelected')}.</span>
              </span>
            </label>`);
          }
        }
      }

      // Hide filtered items
      if (hideFlag) {
        const n = firstRecordIdx + i;
        if (n < self.settings.dataset.length) {
          const data = self.settings.dataset[n];
          item.css('display', (data._isFilteredOut === undefined || data._isFilteredOut) ? '' : 'none');
        }
      } else {
        item.css('display', '');
      }

      // Add Aria
      item.attr({ 'aria-posinset': (firstRecordIdx + i + 1), 'aria-setsize': setSize });

      // Add Aria disabled
      if (item.hasClass('is-disabled')) {
        item.attr('aria-disabled', 'true');
      }

      // If this dataset is filtered, hightlight the relevant search term inside the element.
      if (self.settings.highlight && self.searchTerm) {
        item.highlight(self.searchTerm);
      }
    });

    // Invoke all elements within the list view
    if (self.settings.initializeContents) {
      this.element.find('ul').initialize();
    }

    /**
     * Fires after the listbox is fully rendered.
     *
     * @event rendered
     * @memberof ListView
     * @property {object} event - The jquery event object
     * @property {array} dataset .
     */
    this.element.trigger('rendered', [displayedDataset]);

    // Handle refresh
    this.element.off('updated.listview').on('updated.listview', (e, settings) => {
      self.updated(settings);
    });
  },

  /**
   * Add and update the pager (if used)
   * @private
   * @param {object} updatedPagerInfo contains updated paging settings
   * @param {boolean} isResponse represents whether or not this render call was caused by an AJAX response
   * @returns {void}
   */
  renderPager(updatedPagerInfo, isResponse) {
    if (!this.pagerAPI) {
      return;
    }

    this.pagerAPI.updatePagingInfo(updatedPagerInfo, isResponse);
  },

  /**
   * Reliably gets all the pre-rendered elements in the container and returns them for use.
   * @private
   * @returns {array} TThe pagable items
   */
  getPageableElements() {
    let elements = this.element.children();

    // Adjust for cases where the root is a <ul>
    if (elements.is('ul')) {
      elements = elements.children();
    }

    return elements;
  },

  /**
   * Get the Data Source. Can be an array, Object or Url and render the list.
   * @private
   * @param {array} dataset contains a potential new dataset to display inside the listview.
   * @param {object} [pagingInfo=undefined] information about desired pager state
   */
  refresh(dataset, pagingInfo) {
    this.loadData(dataset, pagingInfo);

    if (this.list) {
      this.render(this.list.data);
    }
  },

  /**
   * Load Data from an external API
   * @param {object} ds  The dataset to use or will use settings.dataset.
   * @param {object} pagerInfo  The pager settings to use (see pager api)
   * @param {boolean} isResponse Flag used to avoid dup source calls.
   * @returns {void}
   */
  loadData(ds, pagerInfo, isResponse) {
    let ajaxDs = false;
    const self = this;

    ds = ds || this.settings.dataset;
    if (this.filteredDataset) {
      ds = this.filteredDataset;
    }

    if (!pagerInfo) {
      if (this.pagerAPI) {
        if (ds.length !== this.pagerAPI.settings.dataset.length) {
          this.pagerAPI.updated({
            dataset: ds
          });
        }
        pagerInfo = this.pagerAPI.state;
      } else {
        pagerInfo = {
          activePage: 1
        };
      }
    }

    if (this.filteredDataset) {
      pagerInfo.filteredTotal = ds.length;
    } else {
      pagerInfo.total = ds.length;
    }

    if (!Array.isArray(ds)) {
      return;
    }

    function done(response, pagingInfo) {
      self.settings.dataset = response;
      ds = response;
      const activePage = self.pagerAPI ? self.pagerAPI.activePage : 1;

      if (typeof pagingInfo === 'string') {
        pagingInfo = {
          activePage,
          pagesize: self.settings.pagesize,
          total: ds.length,
          type: pagingInfo
        };
      }

      if (self.pagerAPI) {
        self.renderPager(pagingInfo, true);
        pagingInfo = self.pagerAPI.state;
      }
      self.render(ds, pagingInfo);
    }

    let s = this.settings.source;

    if (typeof ds === 'string' && (ds.indexOf('http') === 0 || ds.indexOf('/') === 0)) {
      s = ds;
      ajaxDs = true;
    }

    // If paging is not active, and a source is present, attempt to retrieve
    // information from the datasource.
    // TODO: Potentially abstract this datasource concept out for use elsewhere
    if ((s || ajaxDs) && !this.filteredDataset && !isResponse) {
      switch (typeof s) {
        case 'function':
          s(pagerInfo, done);
          break;
        case 'string':
          if (s.indexOf('http') === 0 || s.indexOf('/') === 0) {
            $.getJSON(s, done);
          }
          return;
        default:
          this.settings.dataset = s;
          ds = s;
          this.render(s, pagerInfo);
          break;
      }
      return;
    }

    // Otherwise, simply render with the existing dataset
    this.render(ds, pagerInfo);
  },

  /**
   * Toggle all items from selected to deselected, useful for multi/mixed selection
   * @returns {void}
   */
  toggleAll() {
    this[this.isSelectedAll ?
      'deselectItemsBetweenIndexes' :
      'selectItemsBetweenIndexes']([0, $('li, tbody tr', this.element).length - 1]);
    this.isSelectedAll = !this.isSelectedAll;
  },

  /**
   * Select Items between a set of indexes. Used for shift selection.
   * @private
   * @param {array} indexes an array containing two numeric indicies that will
   *  be used to make a selection.
   * @returns {void}
   */
  selectItemsBetweenIndexes(indexes) {
    utils.clearSelection(); // Clear all currently selected list items.
    indexes.sort((a, b) => a - b);
    for (let i = indexes[0]; i <= indexes[1]; i++) {
      const item = $('li, tbody tr', this.element).eq(i);

      if (!item.is('.is-disabled, .is-selected')) {
        this.select(item);
      }
    }
  },

  /**
  * De-Select Items between a set of indexes. Used for shift selection.
  * @private
  * @param {array} indexes an array containing two numeric indicies that will
  *  be used to deselect.
  * @returns {void}
  */
  deselectItemsBetweenIndexes(indexes) {
    indexes.sort((a, b) => a - b);
    for (let i = indexes[0]; i <= indexes[1]; i++) {
      const item = $('li, tbody tr', this.element).eq(i);
      if (!item.is('.is-disabled') && item.is('.is-selected')) {
        this.select(item);
      }
    }
  },

  /**
  * Handle page/form resize
  * @private
  * @returns {void}
  */
  handleResize() {
    const items = $('li .listview-heading, tr .listview-heading', this.element);
    const item1 = items.eq(1);
    const item1W = item1.width();

    if (item1.length && item1W) {
      items[0].style.width = `${item1W}px`;
    }

    if (this.pagerAPI) {
      this.pagerAPI.render();
    }
  },

  /**
   * @private
   * @param {jquery.event} e custom jQuery `contents-checked` event.
   * @param {jquery[]} searchfield the element representing a searchfield.
   * @returns {void}
   */
  handleSearch(e, searchfield) {
    this.filter(searchfield);
  },

  /**
   * Filters the contents of Listviews that are paired with a Searchfield.
   * @param {jquery[]} searchfield the element representing a searchfield.
   * @returns {void}
   */
  filter(searchfield) {
    if (!searchfield) {
      return;
    }

    searchfield = $(searchfield);

    // Get the search string and trim whitespace
    const searchFieldVal = searchfield.val().trim();
    const pagingInfo = {
      searchActivePage: 1
    };

    // Clear
    if (!searchFieldVal) {
      if (!this.searchTerm) {
        return;
      }
      this.resetSearch();
      return;
    }

    // Make sure there is a search term...and its not the
    // same as the previous term
    if (searchFieldVal.length < this.settings.searchTermMinSize) {
      this.resetSearch();
      return;
    }

    if (this.searchTerm === searchFieldVal) {
      return;
    }

    // Set a global "searchTerm" and get the list of elements
    this.searchTerm = searchFieldVal;

    // Clean highlight marks before new filter action
    this.element.unhighlight();

    // Reset filter status
    this.settings.dataset.forEach((item) => {
      item._isFilteredOut = false;
    });

    // Filter the results and highlight things
    let results = this.listfilter.filter(this.settings.dataset, this.searchTerm);
    if (!results.length) {
      results = [];
    }
    pagingInfo.filteredTotal = results.length;
    pagingInfo.searchActivePage = 1;
    results.forEach((result) => {
      result._isFilteredOut = true;
    });

    this.filteredDataset = results;
    this.loadData(null, pagingInfo);

    /**
     * Fires after filtering the list.
     * @event filtered
     * @memberof ListView
     * @property {object} event - The jquery event object
     * @property {object} args.elem The list element
     * @property {array} args.filteredResults The filter list items
     * @property {term} args.term The search term used.
     */
    this.element.trigger('filtered', { elem: this.element, filteredResults: results, term: this.searchTerm });
  },

  /**
   * Reset the current search parameters and highlight.
   * @private
   * @returns {void}
   */
  resetSearch() {
    this.element.unhighlight();

    // reset filter status
    this.settings.dataset.forEach((item) => {
      delete item._isFilteredOut;
    });

    if (this.filteredDataset) {
      delete this.filteredDataset;
    }
    if (this.searchTerm) {
      delete this.searchTerm;
    }

    const pagingInfo = {
      activePage: 1,
      filteredTotal: undefined,
      searchActivePage: undefined
    };

    this.refresh(null, pagingInfo);
  },

  /**
   * Focus the provided list item with the keyboard
   * @private
   * @param {jquery} item  The list item (as jQuery) to focus
   * @returns {void}
   */
  focus(item) {
    if (item.is(':hidden') || item.is('.is-disabled')) {
      return;
    }

    if (this.focusItem) {
      this.focusItem.removeAttr('tabindex');
    }
    this.focusItem = item.attr('tabindex', 0).focus();

    if (!this.settings.selectable && item.find('a').length === 1) {
      item.find('a').focus();
      item.removeAttr('tabindex');
    }

    if (this.settings.selectOnFocus &&
      this.settings.selectable !== 'multiple' &&
      this.settings.selectable !== 'mixed') {
      this.select(item);
    }
  },

  /**
   * Remove the given list item.
   * @param {jquery|number} li Either the actually jQuery list element or a zero based index
   * @returns {void}
   */
  remove(li) {
    if (typeof li === 'number') {
      li = $(this.element.children()[0]).children().eq(li);
    }
    // Un-select selected item
    // and donot trigger selected event, sinnce we removeing
    if (li.is('.is-selected')) {
      this.select(li, true);
    }
    li.remove();
  },

  /**
   * Remove all list items.
   * @returns {void}
   */
  clear() {
    const root = $(this.element.children()[0]);
    root.empty();
  },

  /**
   * Remove all selected items entirely from the list.
   * @returns {void}
   */
  removeAllSelected() {
    const self = this;
    $.each(this.selectedItems, (index, selected) => {
      self.remove(selected);
    });
  },

  /**
   * Deselect all selected items.
   * @returns {void}
   */
  clearAllSelected() {
    const self = this;
    $.each(this.selectedItems, (index, selected) => {
      // Un-select selected item
      self.select(selected);
    });
  },

  /**
   * Initialize the sorted list
   * @private
   * @param {string} control component name
   * @param {string} onEvent the name of the event to sort on
   * @param {string} attr the name of the HTML attribute to retrieve options from.
   * @returns {void}
   */
  sortInit(control, onEvent, attr) {
    if (!attr || $.trim(attr) === '') {
      return;
    }
    $(`[${attr}]`).each(function () {
      const element = $(this);
      const options = $.fn.parseOptions(element, attr);

      element.on(onEvent, (e) => {
        $(options.list).data(control).setSortColumn(options);
        e.preventDefault();
      });
    });
  },

  /**
  * Sort the list with the given options.
  * @private
  * @param {object} [options] incoming sort options
  * @returns {void}
  */
  setSortColumn(options) {
    let field = options.orderBy || this.list.sort.field;
    let reverse = options.order;

    if (!this.list.data && !field) {
      return;
    }

    reverse = reverse ?
      (reverse === 'desc') :
      !((this.list.sort && this.list.sort[field] && this.list.sort[field].reverse));

    // reload data
    if (options.reloadApi || options.reloadApiNoSort) {
      this.loadData();
    }

    // reload data but no sort change
    if (options.reloadApiNoSort) {
      field = this.list.sort.field;
      reverse = this.list.sort[field].reverse;
    }

    const sort = this.sortFunction(field, reverse);
    this.list.data.sort(sort);
    this.render(this.list.data);

    this.list.sort = { field };
    this.list.sort[field] = { reverse };
    /**
     * Fires after sorting the list.
     *
     * @event sorted
     * @memberof ListView
     * @property {object} event - The jquery event object
     * @property {object} this.element
     * @property {string} this.list.sort
     */
    this.element.trigger('sorted', [this.element, this.list.sort]);
  },

  /**
  * Overridable function to conduct sorting
  * @private
  * @param {string} field  The field in the dataset to sort on.
  * @param {string} reverse  If true sort descending.
  * @param {function} primer  A sorting primer function.
  * @returns {function} a customized sorting algorithm
  */
  sortFunction(field, reverse, primer) {
    if (!primer) {
      primer = function (a) {
        a = (a === undefined || a === null ? '' : a);
        if (typeof a === 'string') {
          a = a.toUpperCase();

          if (!isNaN(parseFloat(a))) {
            a = parseFloat(a);
          }
        }
        return a;
      };
    }

    const key = primer ? function (x) { return primer(x[field]); } :
      function (x) { return x[field]; };

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a)); //eslint-disable-line
    };
  },

  /**
  * Deselect the given list item.
  * @param {jquery[]|number} li  Either the actually jQuery list element or a zero based index
  */
  deselect(li) {
    if (!this.settings.allowDeselect) {
      return;
    }

    if (typeof li === 'number') {
      li = $(this.element.children()[0]).children().eq(li);
    }
    if (li.is('.is-selected')) {
      this.select(li);
    }
  },

  /**
   * Deselect the given list item.
   * This method is slated to be removed in a future v4.9.0 or v5.0.0.
   * @deprecated as of v4.3.0. Please use `deselect()` instead.
   * @param {jquery[]|number} li a list item
   * @returns {void}
   */
  unselect(li) {
    return deprecateMethod(this.deselect, this.unselect).apply(this, [li]);
  },

  /**
   * Select the given list item.
   * @param {jquery|number} li Either the actually jQuery list element or a zero based index
   * @param {boolean} noTrigger Do not trigger the selected event.
   */
  select(li, noTrigger) {
    const self = this;
    let isChecked = false;
    const isMixed = self.settings.selectable === 'mixed';

    self.selectedItems = [];
    if (typeof li === 'number') {
      li = $(this.element.children()[0]).children().eq(li);
    }

    isChecked = li.hasClass('is-selected');

    if (isChecked && !this.settings.allowDeselect) {
      return;
    }

    // focus
    if (!li.is('[tabindex="0"]')) {
      if (this.focusItem) {
        this.focusItem.removeAttr('tabindex');
      }
      li.attr('tabindex', 0);
    }

    if (this.settings.selectable === false || this.settings.selectable === 'false') {
      return;
    }

    // Deselect all other items, when items
    if (this.settings.selectable !== 'multiple' && this.settings.selectable !== 'mixed') {
      li.parent().children().removeAttr('aria-selected');
      li.parent().find('.is-selected').removeClass('is-selected');
      self.selectedItems[0] = $(this);
    }

    if (isChecked) {
      self.selectedItems = [];
      li.removeClass('is-selected hide-selected-color');
    } else if (this.settings.selectable) {
      li.addClass(`is-selected${isMixed ? ' hide-selected-color' : ''}`);
      self.lastSelectedItem = li.index();// Rember index to use shift key
    }

    li.parent().find('.is-selected').each(function (i) {
      self.selectedItems[i] = $(this);
    });

    // Reselect just this item
    // NOTE: don't use `aria-selected` on list items when checkboxes aren't involved.
    li.find('.listview-selection-checkbox input').prop('checked', !isChecked);
    if (this.settings.selectable === 'multiple' || this.settings.selectable === 'mixed') {
      const operationText = !isChecked ? 'Selected' : 'NotSelected';
      li.attr('aria-selected', !isChecked);
      li.find('.label-text .audible').text(`${Locale.translate('Checkbox')} ${operationText}.`);
    }

    if (!noTrigger) {
      const triggerStr = isChecked ? 'unselected' : 'selected';
      const selectedData = [];

      for (let i = 0; i < this.selectedItems.length; i++) {
        const posinset = this.selectedItems[i][0].getAttribute('aria-posinset');
        selectedData.push(this.settings.dataset[posinset - 1]);
      }

      /**
       * Fires when a item is selected.
       * @event selected
       * @memberof ListView
       * @property {object} event - The jquery event object
       * @property {object} selected items and item info and item data
       */
      this.element.triggerHandler(triggerStr, {
        selectedItems: this.selectedItems,
        elem: li,
        selectedData
      });

      if (triggerStr === 'unselected') {
        /**
         * Fires when a item is deselected.
         *
         * @event deselected
         * @memberof ListView
         * @property {object} event - The jquery event object
         * @property {object} selected items and item info
         */
        this.element.triggerHandler('deselected', { selectedItems: this.selectedItems, elem: li, selectedData });
      }
    }

    let parent = this.element.closest('.card, .widget');
    if (!parent.length) {
      parent = this.element.parent();
    }

    const toolbar = parent.find('.listview-toolbar, .contextual-toolbar');
    const toolbarControl = toolbar.data('toolbar');

    if (self.selectedItems.length > 0) {
      if (toolbarControl) {
        toolbarControl.toggleMoreMenu();
      }
      // Order of operations: set up event, change display prop, animate, toggle menu.
      // Menu toggle takes place after the animation starts
      toolbar.one('animateopencomplete', () => {
        self.element.addClass('is-toolbar-open');
        toolbar.trigger('recalculate-buttons').removeClass('is-hidden');
      });
      if (toolbar[0]) {
        toolbar[0].style.display = 'block';
      }
      // toolbar.animateOpen({distance: 52});
      toolbar.animateOpen({ distance: 40 });

      let title = toolbar.find('.title, .selection-count');
      if (!title || !title.length) {
        title = $('<div class="title selection-count"></div>');
        toolbar.prepend(title);
      }
      title.text(`${self.selectedItems.length} ${Locale ? Locale.translate('Selected') : 'Selected'}`);
    } else {
      toolbar.addClass('is-hidden').one('animateclosedcomplete', function (e) {
        e.stopPropagation();
        this.style.display = 'none';
        self.element.removeClass('is-toolbar-open');
      }).animateClosed();
    }
  },

  /**
   * Toggle acivation state on the list item
   * @private
   * @param {jquery} li The jQuery list element.
   * @returns {void}
   */
  toggleItemActivation(li) {
    const isActivated = li.hasClass('is-activated');

    if (isActivated) {
      if (!this.settings.disableItemDeactivation) {
        this.deactivateItem(li);
      }
      return;
    }

    this.activateItem(li);
  },

  /**
   * Set item to activated, unactivate others and fire an event.
   * @private
   * @param {jquery|number} li The jQuery list element or the index.
   * @returns {void}
   */
  activateItem(li) {
    const idx = (typeof li === 'number' ? li : li.index());
    const active = this.element.find('li.is-activated');
    let elemCanActivate = true;

    if (typeof li === 'number') {
      li = this.element.find('ul').children().eq(li);
    }
    this.deactivateItem(active);
    /**
     * Fires before activate item.
     *
     * @event beforeactivate
     * @memberof ListView
     * @property {object} event - The jquery event object
     * @property {object} args index, elem, data
     */
    elemCanActivate = this.element.triggerHandler('beforeactivate', [{ index: idx, elem: li, data: this.settings.dataset[idx] }]);

    if (elemCanActivate === false) {
      return;
    }
    li.addClass('is-activated');

    /**
     * Fires after activate item.
     *
     * @event itemactivated
     * @memberof ListView
     * @property {object} event - The jquery event object
     * @property {object} args index, elem, data
     */
    this.element.triggerHandler('itemactivated', [{ index: idx, elem: li, data: this.settings.dataset[idx] }]);
  },

  /**
  * Return an object containing info about the currently activated item.
  * @returns {object} An object containing the active row's index, dom element and data.
  */
  activatedItem() {
    const active = this.element.find('li.is-activated');
    const idx = active.index();

    return {
      index: idx,
      elem: active,
      data: this.settings.dataset[idx]
    };
  },

  /**
   * Set item to deactivated, and fire an event.
   * @param {jquery|number} li The jQuery list element. The li element or the index.
   *  If null the currently activated one will be deactivated.
   * @returns {void}
   */
  deactivateItem(li) {
    if (typeof li === 'number') {
      li = this.element.find('ul').children().eq(li);
    }

    if (li === undefined) {
      li = this.element.find('li.is-activated');
    }

    li.removeClass('is-activated');
    const idx = li.index();

    if (idx < 0) {
      return;
    }

    /**
     * Fires after deactivated item.
     *
     * @event itemdeactivated
     * @memberof ListView
     * @property {object} event - The jquery event object
     * @property {object} args index, elem, data
     */
    this.element.triggerHandler('itemdeactivated', [{ index: idx, elem: li, data: this.settings.dataset[idx] }]);
  },

  /**
   * @returns {jquery[]} the currently selected ListView item, or an empty jQuery selector
   *  if there are currently no items selected.
   */
  getSelected() {
    return this.element.find('.is-selected');
  },

  /**
   * Handle to update the search data
   * @private
   * @returns {void}
   */
  updateSearch() {
    if (this.settings.searchable && this.filteredDataset) {
      delete this.filteredDataset;
      if (this.searchTerm) {
        delete this.searchTerm;
      }
      const searchfieldApi = this.searchfield.data('searchfield');
      if (searchfieldApi && searchfieldApi.xButton) {
        searchfieldApi.xButton.trigger('click');
      }
    }
  },

  /**
   * Refresh the list with any optioned options that might have been set.
   * @param {object} [settings] incoming settings
   * @returns {object} component instance
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
      if (settings && settings.dataset) {
        this.settings.dataset = settings.dataset;
      }
    }

    this.updateSearch();
    this.refresh(settings && settings.dataset ? settings.dataset : null);
    return this;
  },

  /**
   * Disables the functionality of a ListView.
   * @returns {void}
   */
  disable() {
    this.element.addClass('is-disabled');
  },

  /**
  * Enables the functionality of a ListView.
  * @returns {void}
  */
  enable() {
    this.element.removeClass('is-disabled');
  },

  /**
   * Detatch all bound events.
   * @private
   * @returns {object} component instance
   */
  teardown() {
    $('body').off('resize.listview');
    this.element.prev('.listview-header').off('click.listview');
    if (this.searchfield) {
      this.searchfield.off([
        'contents-checked.searchable-listview',
        'cleared.searchable-listview'
      ].join(' '));
    }
    this.element.off('change.selectable-listview', '.listview-checkbox input');
    this.element.off('contextmenu.listview dblclick.listview', 'li, tr');
    this.element.off('click.listview', 'li, tr, input[checkbox]');
    this.element.off('keydown.listview', 'li, tr, a');
    this.element.off('focus.listview', 'li, tbody tr');
    this.element.off('focus.listview click.listview touchend.listview keydown.listview change.selectable-listview updated.listview').empty();

    if (this.filteredDataset) {
      delete this.filteredDataset;
    }
    if (this.searchTerm) {
      delete this.searchTerm;
    }

    return this;
  },

  /**
   * Detatch all events and tear down data object
   * @returns {void}
   */
  destroy() {
    this.teardown();
    this.element.removeData(COMPONENT_NAME);
  },

  /**
    * Attach Events used by the Control
    * @private
    * @returns {void}
    */
  handleEvents() {
    const self = this;
    let isSelect = false;
    let isFocused = false;
    const isMultiple = self.settings.selectable === 'multiple' || self.settings.selectable === 'mixed';

    this.element
      .off('focus.listview', 'li, tbody tr')
      .on('focus.listview', 'li, tbody tr', function (evt) {
        const item = $(this);

        // Ignore favorite clicks
        if (evt.originalEvent && evt.originalEvent.target && $(evt.originalEvent.target).is('.icon-favorite')) {
          return;
        }

        // First element if disabled
        if (item.is(':first-child') && item.hasClass('is-disabled')) {
          const e = $.Event('keydown.listview');

          e.keyCode = 40; // move down
          isSelect = true;
          item.trigger(e);
        }

        if ((!isSelect) &&
          (!item.hasClass('is-disabled')) &&
          (self.settings.selectOnFocus) &&
          (self.settings.selectable !== 'multiple') &&
          (self.settings.selectable !== 'mixed')) {
          self.select(item);
          isSelect = true;
          isFocused = true;
        }
      });

    // Keyboard
    this.element
      .off('keydown.listview', 'li, tr, a')
      .on('keydown.listview', 'li, tr, a', function (e) {
        const elem = $(this);
        const item = elem.is('a') ? elem.closest('li') : $(this);
        const list = item.is('a') ? item.closest('ul') : item.parent();
        const key = e.keyCode || e.charCode || 0;
        const metaKey = e.metaKey;

        if (item.index() === 0 && e.keyCode === 38) {
          return false;
        }

        if ((key === 40 || key === 38) && !metaKey) { // move down or up
          const newItem = e.keyCode === 40 ? item.nextAll(':not(.is-disabled):visible:first') : item.prevAll(':not(.is-disabled):visible:first');

          if (newItem.length && ($(e.target).is(item) || e.shiftKey || elem.is('a'))) {
            self.focus(newItem);
          }
          e.preventDefault();
          e.stopPropagation(); // prevent container from scrolling
        }

        if (key === 35 || (key === 40 && metaKey)) { // end
          const last = list.children().last();
          self.focus(last);
          e.stopPropagation();
          return false;
        }

        if (key === 36 || (key === 38 && metaKey)) { // home
          const first = list.children().first();
          self.focus(first);
          e.stopPropagation();
          return false;
        }

        if (key === 32) { // Space to toggle selection
          if ($(e.target).is(item)) {
            if (isMultiple && e.shiftKey) {
              self.selectItemsBetweenIndexes([self.lastSelectedItem, item.index()]);
            } else {
              self.select(item);
            }
            e.preventDefault();
          }
        }

        // If multiSelect is enabled, press Control+A to toggle select all items
        if (isMultiple && ((e.ctrlKey || e.metaKey) && key === 65)) {
          self.toggleAll();
          self.focus(item);
          e.preventDefault();
        }

        return true;
      });

    // Selection View Click/Touch
    if (this.settings.selectable) {
      this.element.addClass('is-selectable');

      const pattern = $(this.element).closest('.list-detail, .builder');

      this.element
        .off('click.listview', 'li, tr, input[checkbox]')
        .on('click.listview', 'li, tr, input[checkbox]', function (e) {
          const item = $(this);
          const isCheckbox = $(e.target).closest('.listview-selection-checkbox').length > 0;
          const isMixed = self.settings.selectable === 'mixed';
          const target = $(e.target);

          // ignore clicking favorites element or a hyperlink
          if (target.hasClass('icon-favorite') || target.hasClass('hyperlink')) {
            return;
          }

          if (!isFocused && !item.hasClass('is-disabled') && (!isMixed || isCheckbox)) {
            isSelect = true;

            if (isMultiple && e.shiftKey) {
              self.selectItemsBetweenIndexes([self.lastSelectedItem, item.index()]);
              e.preventDefault();
            } else {
              self.select(item);
            }
            item.focus();
          }

          if (!item.hasClass('is-disabled') && isMixed && !isCheckbox) {
            item.focus();
            self.toggleItemActivation(item);
          }

          if (pattern.length > 0 && $(window).outerWidth() < 767 && !item.hasClass('is-disabled') && !isCheckbox) {
            self.element.trigger('drilldown', [item]);
          }

          isFocused = false;

          e.preventDefault();
          e.stopPropagation();

          self.element.trigger('click', [{
            elem: item,
            data: self.settings.dataset[item.attr('aria-posinset') - 1],
            index: item.index(),
            originalEvent: e
          }]);
        });

      this.element
        .off('dblclick.listview', 'li, tr')
        .on('dblclick.listview', 'li, tr', function (e) {
          const item = $(this);

          e.preventDefault();
          e.stopPropagation();
          self.element.trigger('dblclick', [{
            elem: $(this),
            data: self.settings.dataset[item.attr('aria-posinset') - 1],
            index: item.index(),
            originalEvent: e
          }]);
          return false;
        });

      this.element
        .off('contextmenu.listview', 'li, tr')
        .on('contextmenu.listview', 'li, tr', function (e) {
          const item = $(this);

          e.preventDefault();
          e.stopPropagation();
          self.element.trigger('contextmenu', [{
            elem: $(this),
            data: self.settings.dataset[item.attr('aria-posinset') - 1],
            index: item.index(),
            originalEvent: e
          }]);
          return false;
        });
    }

    if (!this.settings.hoverable || this.settings.hoverable === 'false') {
      this.element.removeClass('is-selectable');
      this.element.addClass('disable-hover');
    }

    if (!this.settings.selectable || this.settings.selectable === 'false') {
      this.element.removeClass('is-selectable');
      this.element.addClass('disable-hover');
    }

    if (this.settings.selectable === 'multiple' || this.settings.selectable === 'mixed') {
      this.element
        .off('change.selectable-listview', '.listview-checkbox input')
        .on('change.selectable-listview', '.listview-checkbox input', function (e) {
          $(this).parent().trigger('click');
          e.stopPropagation();
        });
    }

    // For use with Searchfield
    if (this.settings.searchable) {
      this.searchfield
        .off('contents-checked.searchable-listview')
        .on('contents-checked.searchable-listview', function (e) {
          self.handleSearch(e, $(this));
        })
        .off('cleared.searchable-listview')
        .on('cleared.searchable-listview', () => {
          self.resetSearch();
          self.element.trigger('filtered', { elem: self.element, filteredResults: [], term: '' });
        });
    }

    // If used with a Pager Control, listen for the end of the page and scroll
    // the Listview to the top
    if (this.pagerAPI) {
      this.element
        .off('page.listview').on('page.listview', (e, pagingInfo) => {
          self.handlePageChange(pagingInfo);
        })
        .off('pagesizechange.listview').on('pagesizechange.listview', (e, pagingInfo) => {
          self.handlePageSizeChange(pagingInfo);
        });
    }

    $('body').off('resize.listview').on('resize.listview', (e) => {
      self.handleResize(e);
    });

    // Animate open and Closed from the header
    self.element.prev('.listview-header')
      .off('click.listview')
      .on('click.listview', function () {
        const icon = $(this).find('.plus-minus');
        if (icon.hasClass('active')) {
          icon.removeClass('active');
          self.element.animateClosed();
        } else {
          icon.addClass('active');
          self.element.animateOpen();
        }
      });
  },

  /**
   * Listens for a `pagesizechange` event from the dropdown that recalculates page size
   * @param {object} pagingOpts state information from the pager
   */
  handlePageSizeChange(pagingOpts) {
    pagingOpts.activePage = 1;
    this.loadData(undefined, pagingOpts);
  },

  /**
   * Listens for `page` events from the Pager.
   * @param {object} pagingOpts state information from the pager
   */
  handlePageChange(pagingOpts) {
    this.loadData(undefined, pagingOpts);
  },
};

export { ListView, COMPONENT_NAME, LISTVIEW_DEFAULTS };
