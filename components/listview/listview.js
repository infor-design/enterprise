import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { stringUtils as str } from '../utils/string';
import { Tmpl } from '../tmpl/tmpl';
import { ListFilter } from '../listfilter/listfilter';
import { Locale } from '../locale/locale';

// jQuery Components
import '../utils/animations';
import '../initialize/initialize.jquery';
import '../pager/pager.jquery';
import '../popupmenu/popupmenu.jquery';
import '../searchfield/searchfield.jquery';

const COMPONENT_NAME = 'listview';

/**
 * Listview Default Settings
 * @namespace
 * @property {array} dataset  Array of data to feed the template
 * @property {string} content  Html Template String
 * @property {string} description  Audible Label (or use parent title)
 * @property {boolean} paging  If true, activates paging
 * @property {number} pagesize  If paging is activated, sets the number of
 *  listview items available per page
 * @property {boolean} searchable  If true, associates itself with a Searchfield/Autocomplete
 *  and allows itself to be filtered
 * @property {String|Boolean} selectable   selection mode, can be false, 'single' or
 *  'multiple' or 'mixed'
 * @property {boolean} selectOnFocus   If true the first item in the list will be
 *  selected as it is focused.
 * @property {boolean} showCheckboxes   If false will not show checkboxes used with
 *  multiple selection mode only
 * @property {boolean} hoverable   If true the list element will show a hover action
 *  to indicate its actionable.
 * @property {Function|String} source  If source is a string then it serves as the url
 *  for an ajax call that returns the dataset. If its a function it is a call back for
 *  getting the data asyncronously.
 * @property {boolean} disableItemDeactivation  If true when an item is activated the
 *  user should not be able to deactivate it by clicking on the activated item. They
 *  can only select another row.
 */
const LISTVIEW_DEFAULTS = {
  dataset: [],
  template: null,
  description: null,
  paging: false,
  pagesize: 10,
  searchable: false,
  selectable: 'single',
  selectOnFocus: true,
  showCheckboxes: true,
  hoverable: true,
  emptyMessage: null,
  source: null,
  disableItemDeactivation: false
};

/**
 * Creates lists of small pieces of relevant, actionable information.
 * @class ListView
 * @param {jQuery[]|HTMLElement} element the base element
 * @param {object} [settings] incoming settings
 */
function ListView(element, settings) {
  this.element = $(element);
  this.settings = utils.mergeSettings(this.element[0], settings, LISTVIEW_DEFAULTS);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

ListView.prototype = {

  /**
   * Initialize this component.
   * @private
   * @returns {void}
   */
  init() {
    this.setup();
    this.refresh();
    this.selectedItems = [];
    this.lastSelectedItem = 0; // Rember index to use shift key
    this.isSelectedAll = false; // Rember if all selected or not
    this.sortInit('listview', 'click.listview', 'data-sortlist');
    this.handleEvents();
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

    // Configure Paging
    if (this.element.is('.paginated') || this.settings.paging === true) {
      this.element.pager({
        componentAPI: this,
        pagesize: this.settings.pagesize,
        source: this.settings.source
      });

      this.pager = this.element.data('pager');
    }

    const cardWidgetContent = this.element.parent('.card-content, .widget-content');
    if (cardWidgetContent[0]) {
      cardWidgetContent[0].style.overflow = 'hidden';
    }

    // Add Aria Roles
    this.element.attr({
      role: 'listbox',
      'aria-label': this.settings.description || card.find('.card-title, .widget-title').text()
    });

    // Associate with an existing searchfield, if applicable
    if (this.settings.searchable) {
      this.searchfield = this.element.parent().find('.searchfield, .autocomplete');

      if (!this.searchfield.length) {
        // TODO: Create Searchfield somehow
      }

      this.listfilter = new ListFilter({
        filterMode: 'contains'
      });
    }

    if (this.settings.emptyMessage) {
      // Object { title: "No Data Available", info: "", icon: "icon-empty-no-data" }
      self.emptyMessageContainer = $('<div>').emptymessage(this.settings.emptyMessage);
    }

    if (this.settings.dataset) {
      // Search the global variable space for a dataset variable name, if provided.
      if (typeof this.settings.dataset === 'string') {
        const dataset = window[this.settings.dataset];
        if (dataset && dataset.length) {
          this.settings.dataset = dataset;
        }
      }
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
   * @param {array} dataset  The dataset to use
   * @param {object} pagerInfo  Pager instructions
   */
  render(dataset, pagerInfo) {
    const self = this;
    let totals = {};

    // Render "mustache" Template
    if (typeof Tmpl === 'object' && dataset && this.settings.template) {
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

      const compiledTmpl = Tmpl.compile(this.settings.template);
      const renderedTmpl = compiledTmpl.render({ dataset, totals });

      if (dataset.length > 0) {
        this.element.html(renderedTmpl);
      } else if (self.emptyMessageContainer) {
        this.element.empty().append(this.emptyMessageContainer);
      } else if (dataset.length === 0) {
        this.element.html(renderedTmpl || '<ul></ul>');
      }
    }

    // Render Pager
    if (this.settings.paging) {
      this.renderPager(pagerInfo);
    }

    // Add Aria
    $('ul', this.element).attr({ role: 'presentation' });

    // Add Checkboxes
    const first = this.element.find('li, tbody > tr').first();
    const items = this.element.find('li, tr');
    const isMultiselect = (this.settings.selectable === 'multiple' || this.settings.selectable === 'mixed');

    // Set Initial Tab Index
    first.attr('tabindex', 0);

    // Let the link be focus'd
    if (!this.settings.selectable && first.find('a').length === 1) {
      first.removeAttr('tabindex');
    }

    items.each(function (i) {
      const item = $(this);

      item.attr('role', 'option');

      if (isMultiselect) {
        // Add Selection Checkboxes
        self.element.addClass('is-muliselect');

        // Create a Toolbar for the "Selected Items" area
        const selectedToolbar = self.element.prevAll('.toolbar');
        if (selectedToolbar.length && selectedToolbar.data('toolbar')) {
          selectedToolbar.data('toolbar').toggleMoreMenu();
        }

        if (self.settings.showCheckboxes) {
          // For mixed selection mode primarily append a checkbox object
          item.prepend('<label class="listview-selection-checkbox l-vertical-center inline inline-checkbox"><input tabindex="-1" type="checkbox" class="checkbox"><span class="label-text">&nbsp;</span></label>');
          // TODO: item.find('.checkbox').attr('tabindex', '-1');
        }
      }

      // Add Aria
      item.attr({ 'aria-posinset': i + 1, 'aria-setsize': items.length });

      // Add Aria disabled
      if (item.hasClass('is-disabled')) {
        item.attr('aria-disabled', 'true');
      }
    });

    // TODO: Invoke the "element" here after we write an updated method.
    this.element.children().initialize();
    this.element.trigger('rendered', [dataset]);

    // Handle refresh
    this.element.off('updated').on('updated', (e, settings) => {
      self.updated(settings);
    });
  },

  /**
   * Add and update the pager (if used)
   * @private
   * @param {object} updatedPagerInfo contains updated paging settings
   * @returns {void}
   */
  renderPager(updatedPagerInfo) {
    if (!this.pager) {
      return;
    }

    this.pager.updatePagingInfo(updatedPagerInfo);
    this.pager.setActivePage(1, true);
  },

  /**
   * Get the Data Source. Can be an array, Object or Url and render the list.
   * @param {array} dataset contains a potential new dataset to display inside the listview.
   */
  refresh(dataset) {
    this.loadData(dataset);

    if (this.list) {
      this.render(this.list.data);
    }
  },

  /**
   * Load Data from an external API
   * @param {object} ds  The dataset to use or will use settings.dataset.
   * @param {object} pagerInfo  The pager settings to use (see pager api)
   * @returns {void}
   */
  loadData(ds, pagerInfo) {
    let ajaxDs = false;
    const self = this;

    ds = ds || this.settings.dataset;
    pagerInfo = pagerInfo || {};

    if (!Array.isArray(ds) || !ds.length) {
      return;
    }

    function done(response, pagingInfo) {
      self.settings.dataset = response;
      ds = response;
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
    if ((s) || ajaxDs) {
      switch (typeof s) {
        case 'function':
          s(pagerInfo, done);
          break;
        case 'string':
          if (s.indexOf('http') === 0 || s.indexOf('/') === 0) {
            $.ajax({
              url: s,
              async: false,
              dataType: 'json',
              success: done
            });
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
    this.clearSelection();
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
  * Clear all currently selected list items.
  * @private
  * @returns {void}
  */
  clearSelection() {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      document.selection.empty();
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

    if (this.element.data('pager')) {
      this.element.data('pager').renderBar();
    }
  },

  /**
  * For instances of Listview that are paired with a Searchfield
  * NOTE: Search functionality is called from "js/listfilter.js"
  * @private
  * @param {jQuery.Event} e custom jQuery `contents-checked` event.
  * @param {jQuery[]} searchfield the element representing a searchfield.
  * @returns {void}
  */
  handleSearch(e, searchfield) {
    const list = this.element.find('li, tbody > tr');
    const term = searchfield.val();
    let results;

    this.resetSearch();

    if (term && term.length) {
      results = this.listfilter.filter(list, term);
    }

    if (!results || !results.length && !term) {
      return;
    }

    list.not(results).addClass('hidden');
    list.filter(results).each(function (i) {
      const li = $(this);
      li.attr('tabindex', i === 0 ? '0' : '-1');
      li.highlight(term);
    });

    this.renderPager();
  },

  /**
   * Reset the current search parameters and highlight.
   * @returns {void}
   */
  resetSearch() {
    const list = this.element.find('li, tbody > tr');

    list.removeClass('hidden').each(function () {
      $(this).unhighlight();
    });
  },

  /**
   * Focus the provided list item with the keyboard
   * @param {jQuery} item  The list item (as jQuery) to focus
   * @returns {void}
   */
  focus(item) {
    if (item.is(':hidden') || item.is('.is-disabled')) {
      return;
    }

    item.siblings().removeAttr('tabindex');
    item.attr('tabindex', 0).focus();

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
   * @param {jQuery|Number} li  Either the actually jQuery list element or a zero based index
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

    this.element.trigger('sorted', [this.element, this.list.sort]);
  },

  /**
  * Overridable function to conduct sorting
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
  * @param {jQuery[]|Number} li  Either the actually jQuery list element or a zero based index
  */
  deselect(li) {
    if (typeof li === 'number') {
      li = $(this.element.children()[0]).children().eq(li);
    }
    if (li.is('.is-selected')) {
      this.select(li);
    }
  },

  /**
   * Deprivated - use `deselect()`
   * @deprecated as of v4.3.0
   * @param {jQuery[]|number} li a list item
   * @returns {void}
   */
  unselect(li) {
    this.deselect(li);
  },

  /**
   * Select the given list item.
   * @param {jQuery|Number} li Either the actually jQuery list element or a zero based index
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

    // focus
    if (!li.is('[tabindex="0"]')) {
      li.siblings().removeAttr('tabindex');
      li.attr('tabindex', 0);
    }

    if (this.settings.selectable === false || this.settings.selectable === 'false') {
      return;
    }

    // Select
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

    li.attr('aria-selected', !isChecked);
    li.find('.listview-selection-checkbox input').prop('checked', !isChecked);

    if (!noTrigger) {
      const triggerStr = isChecked ? 'unselected' : 'selected';
      this.element.triggerHandler(triggerStr, { selectedItems: this.selectedItems, elem: li });

      if (triggerStr === 'unselected') {
        this.element.triggerHandler('deselected', { selectedItems: this.selectedItems, elem: li });
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
      title.text(`${self.selectedItems.length} ${Locale.translate('Selected')}`);
    } else {
      toolbar.addClass('is-hidden').one('animateclosedcomplete', function (e) {
        e.stopPropagation();
        this.style.display = 'none';
      }).animateClosed();
    }
  },

  /**
   * Toggle acivation state on the list item
   * @param {jQuery} li The jQuery list element.
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
   * @param {jQuery|number} li The jQuery list element or the index.
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

    elemCanActivate = this.element.triggerHandler('beforeactivate', [{ index: idx, elem: li, data: this.settings.dataset[idx] }]);

    if (elemCanActivate === false) {
      return;
    }
    li.addClass('is-activated');

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
   * Set item to deactivated, uand fire an event.
   * @param {jQuery|Number} li The jQuery list element. The li element or the index.
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

    this.element.triggerHandler('itemdeactivated', [{ index: idx, elem: li, data: this.settings.dataset[idx] }]);
  },

  /**
   * Refresh the list with any optioned options that might have been set.
   * @param {object} [settings] incoming settings
   * @returns {this} component instance
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }

    this.refresh(settings.dataset);
    return this;
  },

  /**
   * Detatch all bound events.
   * @returns {this} component instance
   */
  teardown() {
    $('body').off('resize.listview');
    this.element.off('focus.listview click.listview touchend.listview keydown.listview change.selectable-listview afterpaging.listview').empty();
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
   * This component fires the following events.
   * @fires ListBox#events
   * @listens selected  Fires when a item is selected
   * @listens unselected  Fires when a item is deselected (deprecated)
   * @listens deselected  Fires when a item is deselected
   * @listens rendered  Fires after the listbox is fully rendered
   * @listens focus
   * @listens keydown
   * @listens click
   */
  handleEvents() {
    const self = this;
    let isSelect = false;
    let isFocused = false;
    const isMultiple = self.settings.selectable === 'multiple' || self.settings.selectable === 'mixed';

    this.element.on('focus.listview', 'li, tbody tr', function () {
      const item = $(this);

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
    this.element.on('keydown.listview', 'li, tr, a', function (e) {
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

      const trigger = $('.list-detail-back-button, .list-detail-button').find('.app-header');
      const pattern = $(this.element).closest('.list-detail, .builder');

      trigger.parent().on('click.listview', (e) => {
        if (trigger.hasClass('go-back')) {
          trigger.removeClass('go-back');
          pattern.removeClass('show-detail');
        }
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
      });

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

          if (pattern.length > 0 && $(window).outerWidth() < 767 && !item.hasClass('is-disabled')) {
            pattern.toggleClass('show-detail');
            trigger.toggleClass('go-back');
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
      this.element.on('change.selectable-listview', '.listview-checkbox input', function (e) {
        $(this).parent().trigger('click');
        e.stopPropagation();
      });
    }

    // For use with Searchfield
    if (this.settings.searchable) {
      this.searchfield.on('contents-checked.searchable-listview', function (e) {
        self.handleSearch(e, $(this));
      });
    }

    // If used with a Pager Control, listen for the end of the page and scroll
    // the Listview to the top
    if (this.element.data('pager')) {
      this.element.on('afterpaging.listview', () => {
        self.element.scrollTop(0);
      });
    }

    $('body').on('resize.listview', () => {
      self.handleResize();
    });

    // Animate open and Closed from the header
    self.element.prev('.listview-header').on('click', function () {
      const icon = $(this).find('.plus-minus');
      if (icon.hasClass('active')) {
        icon.removeClass('active');
        self.element.animateClosed();
      } else {
        icon.addClass('active');
        self.element.animateOpen();
      }
    });
  }
};

export { ListView, COMPONENT_NAME };
