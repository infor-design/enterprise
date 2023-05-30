/* eslint-disable no-underscore-dangle */
import * as debug from '../../utils/debug';
import { DOM } from '../../utils/dom';
import { warnAboutDeprecation } from '../../utils/deprecated';
import { utils } from '../../utils/utils';
import { stringUtils } from '../../utils/string';
import { Locale } from '../locale/locale';

// jQuery Components
import '../button/button.jquery';
import '../icons/icons.jquery';
import '../mask/mask-input';
import '../popupmenu/popupmenu.jquery';
import '../tooltip/tooltip.jquery';

// The name of this component.
const COMPONENT_NAME = 'pager';

// Selector for Pager elements that should have a tabIndex
const FOCUSABLE_SELECTOR = [
  '.pager-first > .btn-icon',
  '.pager-prev > .btn-icon',
  '.pager-next > .btn-icon',
  '.pager-last > .btn-icon',
  '.pager-no > .btn-icon',
  '.pager-count input',
  '.pager-pagesize button'
].join(', ');

/**
* The Pager Component supports paging on lists.
* @class Pager
* @param {jQuery[]|HTMLElement} element The component element.
* @param {object} [settings] The component settings.
*
* @param {string} [settings.componentAPI]  If defined, becomes the definitive way to call methods on
* parent component.
* @param {string} [settings.type = 'list']  Different types of pagers option sets.
* list - just shows next and previous and a listing of page numbers you can click
* pageof - for datagrid also shows next and previous and first and last with a page number input and page size selector used optionally for
* firstlast - for lists shows next and previous and first and last with option to set showPageSizeSelector
* standalone - lets you control all the options with settings, events and methods. In the future i will refactor the others out.
* @param {string} [settings.position = 'bottom']  Can be on 'bottom' or 'top'.
* @param {number} [settings.activePage = 1]  Start on this page
* @param {boolean} [settings.hideOnOnePage = false]  If true, hides the pager if there is only one page worth of results.
* @param {Function} [settings.source] Call back function for pager data source
* @param {number} [settings.pagesize = 15]  Can be calculated or a specific number
* @param {array} [settings.pagesizes = [15, 25, 50, 75]] Array of numbers of the page size selector
* @param {boolean} [settings.footerContainment = true] If false will not append to card or widget footer
* @param {string} [settings.footerContainmentClass = null] Custom css class to use style
* @param {string} [settings.pageSelectorInputText = null] Custom text for selector input
* @param {boolean} [settings.showPageSelectorInput = false] If true will show selector input for standalone type
* @param {boolean} [settings.showPageSizeSelector = true] If false will not show page size selector
* @param {boolean} [settings.smallPageSizeSelector = false] If true, shows a condensed view of the page size selector
* @param {string} [settings.pageSizeSelectorText = 'RecordsPerPage'] A string to the key of the translation text for the page size selector.
* @param {boolean} [settings.onPageSizeChange] Call back function for page change
* @param {boolean} [settings.showFirstButton = true] If false the first button will be hidden (standalone mode)
* @param {boolean} [settings.enableFirstButton = true] If false the first button will be disabled (standalone mode)
* @param {boolean} [settings.onFirstPage] Call back function for first page button click
* @param {boolean} [settings.showPreviousButton = true] If false the previous button will be hidden (standalone mode)
* @param {boolean} [settings.enablePreviousButton = true] If false the previous button will be disabled (standalone mode)
* @param {boolean} [settings.onPreviousPage] Call back function for previous page button click
* @param {boolean} [settings.showNextButton = true] If false the next button will be hidden (standalone mode)
* @param {boolean} [settings.enableNextButton = true] If false the next button will be disabled (standalone mode)
* @param {boolean} [settings.onNextPage] Call back function for next page button click
* @param {boolean} [settings.showLastButton = true] If false the last button will be hidden (standalone mode)
* @param {boolean} [settings.enableLastButton = true] If false the last button will be disabled (standalone mode)
* @param {boolean} [settings.onLastPage] Call back function for next page button click
* @param {boolean} [settings.indeterminate = false] If true will not show anything that lets you go to a specific page (deprecated for standalone)
* @param {boolean} [settings.firstPageTooltip = 'First Page'] Tooltip for the first page, defaults to an internally translated tooltip.
* @param {boolean} [settings.previousPageTooltip = 'Previous Page'] Tooltip for the first page, defaults to an internally translated tooltip.
* @param {boolean} [settings.nextPageTooltip = 'Next Page'] Tooltip for the first page, defaults to an internally translated tooltip.
* @param {boolean} [settings.lastPageTooltip = 'Last Page'] Tooltip for the first page, defaults to an internally translated tooltip.
* @param {boolean} [settings.pageSizeMenuSettings = {}] customizable popupmenu settings for the Page Size Selector.
* @param {string} [settings.attributes] Add extra attributes like id's to the toast element. For example `attributes: { name: 'id', value: 'my-unique-id' }`
* @param {boolean} [settings.tabbable] If true, will use tab key to navigate instead of arrow keys.
*/
const PAGER_DEFAULTS = {
  componentAPI: undefined,
  type: 'list',
  position: 'bottom',
  activePage: 1,
  hideOnOnePage: false,
  source: null,
  pagesize: 15,
  pagesizes: [15, 25, 50, 75],
  footerContainment: true,
  footerContainmentClass: null,
  pageSelectorInputText: null,
  showPageSelectorInput: false,
  showPageSizeSelector: true,
  smallPageSizeSelector: false,
  pageSizeSelectorText: 'RecordsPerPage',
  pageSizeSelectorTextNoToken: 'RecordsPerPageNoToken',
  onPageSizeChange: null,
  showFirstButton: true,
  enableFirstButton: true,
  showPreviousButton: true,
  enablePreviousButton: true,
  showNextButton: true,
  enableNextButton: true,
  showLastButton: true,
  enableLastButton: true,
  indeterminate: false,
  onFirstPage: null,
  onPreviousPage: null,
  onNextPage: null,
  onLastPage: null,
  firstPageTooltip: 'FirstPage',
  previousPageTooltip: 'PreviousPage',
  nextPageTooltip: 'NextPage',
  lastPageTooltip: 'LastPage',
  pageSizeMenuSettings: {
    attachToBody: false
  },
  attributes: null,
  tabbable: true
};

function Pager(element, settings) {
  this.settings = utils.mergeSettings(element, settings, PAGER_DEFAULTS);
  this.settings.dataset = settings.dataset; // by pass deep copy
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

Pager.prototype = {

  /**
   * Displays the current state of the pager. Replaces `pagingInfo` object.
   * @returns {object} containing various state properties.
   */
  get state() {
    let total = 0;
    let pages = 1;
    let filteredPages;
    let filteredTotal;
    let grandTotal;
    const indeterminate = this.settings.indeterminate;
    const indeterminatePageCount = 999999999;
    const pagesize = this.settings.pagesize;
    const type = this.previousOperation;
    const trigger = this.previousTrigger;
    const ds = this.settings.dataset;

    // pass in total number of records
    if (!isNaN(this.serverDatasetTotal)) {
      total = this.serverDatasetTotal;
    } else if (ds && ds.length) {
      total = ds.length;
      if (this.isFilteredClientside) {
        const filteredDs = ds.filter(i => !i._isFilteredOut);
        total = filteredDs.length;
      }
    }

    if (this.grandTotal) {
      grandTotal = this.grandTotal;
    }

    // calculate number of pages
    if (indeterminate) {
      pages = indeterminatePageCount;
    } else if (total < 1) {
      pages = 1;
    } else {
      pages = Math.ceil(total / pagesize);
    }

    // calculate number of filtered pages, if applicable
    if (!isNaN(this.filteredTotal)) {
      filteredTotal = this.filteredTotal;
      if (indeterminate) {
        pages = indeterminatePageCount;
      } else if (filteredTotal < 1) {
        filteredPages = 1;
      } else {
        filteredPages = Math.ceil(filteredTotal / pagesize);
      }
    }

    return {
      activePage: this.activePage,
      indeterminate: this.settings.indeterminate,
      grandTotal,
      pagesize,
      pages,
      trigger,
      total,
      type,
      filteredActivePage: this.filteredActivePage,
      filteredTotal,
      filteredPages
    };
  },

  /**
   * This method is slated to be removed in a future v4.21.0 or v5.0.0.
   * (See https://github.com/infor-design/enterprise/issues/922)
   * @deprecated as of v4.15.0.  Please use the `state` property instead.
   * @returns {object} containing various state properties
   */
  get pagingInfo() {
    warnAboutDeprecation('state', 'pagingInfo');
    return this.state;
  },

  /**
   * @returns {Array} of HTMLElements representing focusable elements in the pager
   */
  get focusableElements() {
    return utils.getArrayFromList(this.pagerBar[0].querySelectorAll(FOCUSABLE_SELECTOR));
  },

  /**
   * @returns {Array|undefined} containing references to numeric paging buttons, if enabled
   */
  get numberButtons() {
    if (this.isTable) {
      return undefined;
    }
    const numberButtonSelector = 'li:not(.pager-prev):not(.pager-next):not(.pager-first):not(.pager-last):not(.pager-pagesize)';
    const buttons = this.pagerBar[0].querySelectorAll(numberButtonSelector);
    return utils.getArrayFromList(buttons);
  },

  /**
   * @returns {HTMLElement|undefined} the input field used for selecting pages, if enabled
   */
  get pageSelectorInput() {
    if (this.isListView) {
      return undefined;
    }
    return this.pagerBar[0].querySelector('.pager-count input');
  },

  /**
   * @returns {HTMLElement|undefined} the button used to select from a list of page sizes, if enabled
   */
  get pageSizeSelectorButton() {
    if (!this.settings.showPageSizeSelector) {
      return undefined;
    }
    return this.pagerBar[0].querySelector('.pager-pagesize button');
  },

  /**
   * @returns {boolean} if true, shows the condensed version of the Page Size
   * Selector Button for smaller viewing areas.
   */
  get showSmallPageSizeSelector() {
    if (!this.settings.showPageSizeSelector) {
      return false;
    }
    if (this.settings.smallPageSizeSelector === true) {
      return true;
    }
    return this.isListView && this.element.parents('.list-detail').length;
  },

  /**
   * Init the pager.
   * @private
   * @returns {void}
   */
  init() {
    this.setup();
    this.createPagerBar();
    // Wait for the component tol render first before activation of page
    this.setActivePage(this.settings.activePage, true); // Get First Page
    setTimeout(() => {
      this.triggerPagingEvents(this.settings.activePage);
    });
    this.handleEvents();
  },

  /**
   * Setting the internals of the pager.
   * @private
   * @returns {void}
   */
  setup() {
    // Check for legacy data attributes
    if (this.element.attr('data-pagesize')) {
      const pagesize = Number(this.element.attr('data-pagesize'));
      if (!isNaN(pagesize)) {
        this.settings.pagesize = pagesize;
      }
      this.element.removeAttr('data-pagesize');
    }

    // Add [pagesize] if not found in [pagesizes]
    if (this.settings.pagesizes.indexOf(this.settings.pagesize) === -1) {
      const sortNumber = function (a, b) {
        return a - b;
      };
      this.settings.pagesizes.push(this.settings.pagesize);
      this.settings.pagesizes = this.settings.pagesizes.sort(sortNumber);
    }

    this.handleDeprecatedSettings();

    const widgetContainer = this.element.parents('.card, .widget');

    // Adjust for the possibility of the pager being attached to a Table instead
    // of normal grid markup
    if (this.element.is('tbody')) {
      this.isTable = true;
      this.settings.type = 'table';
      this.mainContainer = this.element.closest('.datagrid-container');

      if (!this.settings.componentAPI) {
        this.settings.componentAPI = this.mainContainer.data('datagrid');
      }

      if (widgetContainer.length) {
        widgetContainer[0].classList.add('has-datagrid');
      }
    }

    // If contained by a widget/card container, build some settings for that
    const listviewContainer = this.element.is('.listview');
    if (listviewContainer) {
      this.isTable = false;
      this.isListView = true;
      this.mainContainer = this.element;

      if (!this.settings.componentAPI) {
        this.settings.componentAPI = this.element.data('listview');
      }
    }

    this.element.attr({ role: 'region', 'aria-label': Locale.translate('Pagination') });

    return this;
  },

  /**
   * Add the pager dom elements.
   * @private
   */

  createPagerBar() {
    if (this.pagerBar) {
      return;
    }
    this.pagerBar = this.element.prev('.pager-toolbar');

    if (this.pagerBar.length === 0) {
      this.pagerBar = $('<ul class="pager-toolbar"></ul>');
    }

    if (this.settings.type === 'standalone') {
      this.pagerBar.addClass('is-standalone');
      if (this.isListView) {
        this.mainContainer.after(this.pagerBar);
      } else {
        this.element.append(this.pagerBar);
      }
    } else if (this.isTable) {
      this.mainContainer.after(this.pagerBar);
    } else if (this.settings.position === 'bottom') {
      this.element.after(this.pagerBar);
    } else {
      this.element.before(this.pagerBar);
    }

    if (this.isListView) {
      this.pagerBar.addClass('is-listview');
    }

    // Inside of Listviews, place the pager bar inside of the card/widget footer
    const widgetContainer = this.element.closest('.card, .widget');
    if (widgetContainer.length && this.settings.footerContainment) {
      const self = this;
      const widgetTypes = ['widget', 'card'];

      widgetTypes.forEach((type) => {
        const widgetContent = self.element.closest(`.${type}-content`);
        if (!widgetContent.length) {
          return;
        }

        let widgetFooter = widgetContent.next(`.${type}-footer`);
        if (!widgetFooter.length) {
          widgetFooter = $(`<div class="${type}-footer"></div>`).insertAfter(widgetContent);
        }

        if (this.settings.footerContainmentClass) {
          widgetFooter.addClass(this.settings.footerContainmentClass.toString());
        }

        self.pagerBar.appendTo(widgetFooter);
      });
    }
  },

  /**
   * Handle Deprecated Settings
   * @private
   * @returns {void}
   */
  handleDeprecatedSettings() {
    // `attachPageSizeMenuToBody` becomes `pageSizeMenuSettings.attachToBody`.
    // The `pageSizeMenuSettings` object represents a Popupmenu settings object.
    if (this.settings.attachPageSizeMenuToBody !== undefined) {
      warnAboutDeprecation('pageSizeMenuSettings.attachToBody (setting)', 'attachPageSizeMenuToBody (setting)');
      this.settings.pageSizeMenuSettings.attachToBody = this.settings.attachPageSizeMenuToBody;
      delete this.settings.attachPageSizeMenuToBody;
    }
  },

  /**
   * Attach All relevant events
   * @private
   */
  handleEvents() {
    const self = this;

    // Attach button click and touch
    this.pagerBar.on('click.pager', '.btn-icon', function (e) {
      const btn = e.currentTarget;
      const li = btn.parentNode;
      const dropdown = document.querySelector('.datagrid-cell-wrapper .dropdown');
      const dropdownList = document.querySelector('.datagrid-dropdown-list');

      e.preventDefault();

      if ($(this).attr('disabled')) {
        return false;
      }

      // If a dropdown is open, remove it on pager click
      if (dropdownList) {
        const triggerCell = dropdown.parentNode.parentNode;
        dropdownList.remove();
        triggerCell.classList.remove('is-editing');
      }

      // If this is a filtered dataset, use the `filteredTotal` instead
      const state = self.state;
      let currentPage = state.activePage;
      if (state.filteredTotal) {
        currentPage = state.filteredActivePage;
      }

      if (DOM.hasClass(li, 'pager-prev')) {
        self.setActivePage(currentPage - 1, false, 'prev');
        self.triggerPagingEvents(currentPage);
        return false;
      }

      if (DOM.hasClass(li, 'pager-next')) {
        self.setActivePage((currentPage === -1 ? 1 : currentPage) + 1, false, 'next');
        self.triggerPagingEvents(currentPage);
        return false;
      }

      if (DOM.hasClass(li, 'pager-first')) {
        self.setActivePage(1, false, 'first');
        self.triggerPagingEvents(currentPage);
        return false;
      }

      if (DOM.hasClass(li, 'pager-last')) {
        self.setActivePage(self.pageCount(), false, 'last'); // TODO Calculate Last Page?
        self.triggerPagingEvents(currentPage);
        return false;
      }

      // Go to the page via the applied `data-page` attribute of the button
      let activePageIdx = Number(btn.getAttribute('data-page'));
      if (isNaN(activePageIdx) || activePageIdx < 1) {
        activePageIdx = 1;
      }
      self.setActivePage(activePageIdx, false, 'page');
      self.triggerPagingEvents(currentPage);
      return false;
    });

    self.pagerBar.on('keydown.pager', $(self.focusableElements), (event) => {
      if ($('.popupmenu.is-open').length > 0 || self.settings.tabbable) {
        return true;
      }

      event = event || window.event;
      const key = event.which || event.keyCode || event.charCode || false;
      let isLeft = key === 37 || key === 40;
      let isRight = key === 39 || key === 38;

      const elem = event.target;
      if (elem.nodeName === 'INPUT') { // work on up down key
        isLeft = key === 40;
        isRight = key === 38;
      }

      if (!isLeft && !isRight) {
        return true;
      }

      const parent = elem.nodeName === 'INPUT' ? elem.parentNode.parentNode : elem.parentNode;
      const next = parent.nextSibling;
      const prev = parent.previousSibling;
      const isFirst = prev === null;
      const isLast = next === null;

      event.preventDefault();

      if (isLeft && !isFirst) {
        const link = prev.querySelector('button, input');
        link.removeAttribute('tabindex');
        elem.setAttribute('tabindex', '-1');
        link.focus();
        return false;
      }

      if (isLeft && isFirst) {
        const link = parent.parentNode.lastChild.querySelector('button, input');
        link.removeAttribute('tabindex');
        elem.setAttribute('tabindex', '-1');
        link.focus();
        return false;
      }

      if (isRight && !isLast) {
        const link = next.querySelector('button, input');
        link.removeAttribute('tabindex');
        elem.setAttribute('tabindex', '-1');
        link.focus();
        return false;
      }

      if (isRight && isLast) {
        const link = parent.parentNode.firstChild.querySelector('button, input');
        link.removeAttribute('tabindex');
        elem.setAttribute('tabindex', '-1');
        link.focus();
      }

      return false;
    });
  },

  /**
   * Resets the pager to its original settings
   * @param {string} [operation=undefined] optional informational string that describes the purpose of a filtering operation
   * @param {string} [trigger=undefined] optional information string that describes the reason for the reset
   * @returns {void}
   */
  reset(operation, trigger) {
    this.activePage = this.settings.activePage;
    this.previousOperation = operation;
    this.previousTrigger = trigger;

    this.teardown();
    this.init();
  },

  /**
   * Show page size selector
   * @param  {boolean} toggleOption Toggle vs show
   */
  showPageSizeSelector(toggleOption) {
    toggleOption = (`${toggleOption}`).toLowerCase() === 'true';
    this.settings.showPageSizeSelector = toggleOption;

    if (toggleOption) {
      this.isShowPageSizeSelectorCall = toggleOption;
    }
  },

  /**
   * Shows or hides a specified special control button on the Pager.
   * @param {string} [type] the type of button to target.
   * @param {boolean} toggleOption Show vs. Hide
   */
  showButton(type, toggleOption) {
    // Determine the correct button
    const types = ['first', 'last', 'next', 'previous'];
    if (types.indexOf(type) === -1) {
      return;
    }
    let selector = `.pager-${type} .btn-icon`;
    if (type === 'previous') {
      selector = '.pager-prev .btn-icon';
    }

    // Get anchor/option
    const btn = this.pagerBar[0].querySelector(selector);
    toggleOption = (`${toggleOption}`).toLowerCase() === 'true';

    // Set the value in the settings
    this.settings[`show${stringUtils.capitalize(type)}Button`] = toggleOption;

    // If the button hasn't been rendered, don't alter the DOM.
    if (!btn) {
      return;
    }

    // Change the DOM
    if (toggleOption) {
      btn.parentNode.classList.remove('hidden');
    } else {
      btn.parentNode.classList.add('hidden');
    }
  },

  /**
   * Enables or disables a specified special control button on the Pager.
   * @param {string} [type] the type of button to target.
   * @param {boolean} toggleOption Enable vs. Disable
   */
  enableButton(type, toggleOption) {
    // Determine the correct button
    const types = ['first', 'last', 'next', 'previous'];
    if (types.indexOf(type) === -1) {
      return;
    }
    let selector = `.pager-${type} .btn-icon`;
    if (type === 'previous') {
      selector = '.pager-prev .btn-icon';
    }

    // Get anchor/option
    const btn = this.pagerBar[0].querySelector(selector);
    toggleOption = (`${toggleOption}`).toLowerCase() === 'true';

    // Set the value in the settings
    this.settings[`enable${stringUtils.capitalize(type)}Button`] = toggleOption;

    // If the button hasn't been rendered, don't alter the DOM.
    if (!btn) {
      return;
    }

    const btnJQ = $(btn);
    const tooltipContent = this.settings[`${type}PageTooltip`];

    // Change the DOM
    if (toggleOption) {
      btn.disabled = false;
      btn.parentNode.classList.remove('is-disabled');
      btnJQ.removeAttr('disabled aria-disabled');
      const tooltipApi = btnJQ.data('tooltip');
      if (tooltipApi && !tooltipApi.content) {
        tooltipApi.content = tooltipContent;
      }
    } else {
      btn.disabled = true;
      btn.parentNode.classList.add('is-disabled');
      btnJQ.attr({ disabled: 'disabled', 'aria-disabled': 'true' });
      const tooltipEl = btnJQ.find('.disabled-tooltip');
      if (!tooltipEl.length) {
        const tooltipApi = btnJQ.data('tooltip');
        tooltipApi.destroy();
        btnJQ.append(`<div class="disabled-tooltip" title="${tooltipContent}"></div>`);
        btnJQ.find('.disabled-tooltip').tooltip();
      }
    }
  },

  /**
   * Set or Get Current Page.
   * @param {number|object} pagingInfo a number representing a page, or a state object with an `activePage` property
   * @param {boolean} force Force the update
   * @param {string} op The paging operation type.
   * @returns {void}
   */
  setActivePage(pagingInfo, force, op) {
    const useFiltering = typeof pagingInfo.searchActivePage === 'number' ||
      typeof pagingInfo.filteredActivePage === 'number' ||
      typeof this.filteredActivePage === 'number';

    let pageNum = this.filteredActivePage || this.activePage || this.settings.activePage;
    if (typeof pagingInfo === 'object') {
      if (useFiltering) {
        pageNum = pagingInfo.filteredActivePage || pagingInfo.searchActivePage;
      } else if (pagingInfo.activePage) {
        pageNum = pagingInfo.activePage;
      } else {
        pageNum = 1;
      }
    } else if (!isNaN(pagingInfo)) {
      pageNum = pagingInfo;
    }

    // Set the active page interally and render the new state.
    // If working against a filtered dataset, use the filtered active page instead of
    // the standard one.
    if (useFiltering) {
      this.filteredActivePage = pageNum;
    } else {
      this.activePage = pageNum;
    }

    this.previousOperation = op;
    this.render();

    // If any of the following conditions are met, don't rerender the pages.
    // Only rerender the pager bar.
    if (pageNum === undefined ||
        pageNum === 0 ||
        isNaN(pageNum) ||
        (pageNum === this.activePage && !force)) {
      return this.activePage;
    }

    // TODO: This is datagrid specific, need to move this specifically back there
    if (this.settings.componentAPI && this.settings.componentAPI.saveUserSettings) {
      this.settings.componentAPI.saveUserSettings();
    }

    return pageNum;
  },

  /**
   * Adjust an integer representing a Page Number to fit within the boundaries of the page count limits
   * @param {number} [pageNum=1] the incoming number to be analyzed
   * @returns {number} the adjusted value
   */
  adjustPageCount(pageNum) {
    const state = this.state;
    const useFiltering = typeof state.filteredActivePage === 'number' ||
      typeof this.filteredActivePage === 'number';

    // Never go above the total number of pages (determined internally by the state,
    // or externally by the incoming `pagingInfo` object)
    let totalPages = state.pages;
    if (useFiltering && state.filteredPages) {
      totalPages = state.filteredPages;
    }

    // If the page number provided is out of bounds, reset it to the one previously set.
    if (pageNum < 1 || pageNum > totalPages) {
      pageNum = this.filteredActivePage || this.activePage;
    }

    return pageNum;
  },

  /**
  * Fires when the page size changer is used.
  * @event pagesizechange
  * @memberof Pager
  * @property {object} event - The jquery event object
  * @property {function} request - Various paging info
  */
  /**
   * Get the Total Number of pages
   * @private
   * @param  {object} pages The pages to set.
   * @returns {void}
   */
  pageCount(pages) {
    const isShowPageSizeSelectorCall = this.isShowPageSizeSelectorCall;

    // Remove call, after cached
    delete this.isShowPageSizeSelectorCall;

    if (pages === undefined && this.settings.indeterminate) {
      this._pageCount = this.settings.pagesize; //eslint-disable-line
    }

    if (pages === undefined && !this.settings.source && !isShowPageSizeSelectorCall) {
      return this._pageCount; //eslint-disable-line
    }

    if (pages !== undefined) {
      this._pageCount = pages;  //eslint-disable-line
    }

    this._pageCount = this._pageCount || 1;
    if (this.settings.indeterminate) {
      return 999999999;
    }
    return this._pageCount;
  },

  /**
   * Renders a row of numbers that can be used to select pages (Blockgrid/Listview)
   * @returns {void}
   */
  renderButtons() {
    // Only certain types of Pages get to have the `last` and `first` buttons
    // const types = ['table', 'pageof', 'firstlast', 'standalone'];
    // const canHaveFirstLastButtons = types.indexOf(this.settings.type) > -1 || !this.isListView;
    let activePage = this.activePage;
    let totalPages = this.state.pages;
    let buttonHTML = '';
    let doRenderFirstButton = false;
    let doRenderPreviousButton = false;
    let doRenderNextButton = false;
    let doRenderLastButton = false;
    let disableFirstButton = !this.settings.enableFirstButton;
    let disablePreviousButton = !this.settings.enablePreviousButton;
    let disableNextButton = !this.settings.enableNextButton;
    let disableLastButton = !this.settings.enableLastButton;

    const disableFirstIndeterminate = this.settings.indeterminate && this.firstPage === true;
    const disableLastIndeterminate = this.settings.indeterminate && this.lastPage === true;
    const hasDataset = (this.settings.dataset && this.settings.dataset.length);

    // If this is a filtered dataset, use the `filteredTotal` instead
    if (this.state.filteredPages) {
      activePage = this.state.filteredActivePage;
      totalPages = this.state.filteredPages;
    }

    if (this.pagerBar) {
      this.pagerBar?.children('li').find('> .btn-icon, > .btn-icon[disabled] .disabled-tooltip').each((i, elem) => {
        const el = $(elem);
        if (el.data('tooltip')) {
          el.data('tooltip').destroy();
        }
      });
    }

    // Determine whether or not special navigation buttons should eventually be rendered
    // First Button
    if (this.settings.showFirstButton) {
      if (disableFirstIndeterminate || (!this.settings.indeterminate && this.settings.type !== 'standalone' && activePage === 1)) {
        disableFirstButton = true;
      }
      doRenderFirstButton = true;
    }
    // Previous Button
    if (this.settings.showPreviousButton) {
      if (disableFirstIndeterminate || (!this.settings.indeterminate && this.settings.type !== 'standalone' && activePage === 1)) {
        disablePreviousButton = true;
      }
      doRenderPreviousButton = true;
    }
    // Next Button
    if (this.settings.showNextButton) {
      if (disableLastIndeterminate || (!this.settings.indeterminate && this.settings.type !== 'standalone' && activePage === totalPages)) {
        disableNextButton = true;
      }
      doRenderNextButton = true;
    }
    // Last Button
    if (this.settings.showLastButton) {
      if (disableLastIndeterminate || (!this.settings.indeterminate && this.settings.type !== 'standalone' && activePage === totalPages)) {
        disableLastButton = true;
      }
      doRenderLastButton = true;
    }

    const AVG_BUTTON_WIDTH = 40;
    const AVG_PAGESIZESELECTOR_WIDTH = 190;
    const buttonsToRender = [];

    const pageSizeButtonSize = this.settings.showPageSizeSelector ? AVG_PAGESIZESELECTOR_WIDTH : 0;
    const availableButtonWidth = (this.pagerBar.width() - pageSizeButtonSize) / AVG_BUTTON_WIDTH;

    // `maxAllowedButtons` does not include the Page Size Selector.
    // Subtract an allowed number button for each set of special controls.
    const maxAllowedButtons = Math.floor(availableButtonWidth);
    let maxNumberButtons = maxAllowedButtons;
    if (doRenderPreviousButton || doRenderNextButton) {
      maxNumberButtons -= 1;
    }
    if (doRenderLastButton || doRenderFirstButton) {
      maxNumberButtons -= 1;
    }

    // Disable first/last if we can display all available page numbers
    if (!this.isTable && this.settings.type !== 'standalone' && hasDataset && maxNumberButtons >= totalPages) {
      disableFirstButton = true;
      disableLastButton = true;
    }

    // Figure out the distance on either side of the median value of the number button array.
    // If either index goes out of page boundaries, shift the array to fit the same
    // number of pages by adding to the opposite side.
    if (!this.settings.indeterminate) {
      const maxDistanceFromCenter = Math.floor(maxNumberButtons / 2);
      let startIndex = activePage - maxDistanceFromCenter;
      let endIndex = activePage + maxDistanceFromCenter;
      while (startIndex < 1) {
        ++startIndex;
        if (endIndex < totalPages) {
          ++endIndex;
        }
      }
      while (endIndex > totalPages) {
        if (startIndex > 1) {
          --startIndex;
        }
        --endIndex;
      }
      for (let i = startIndex; i < (endIndex + 1); i++) {
        buttonsToRender.push(i);
      }
    }

    // eslint-disable-next-line default-param-last
    function renderButton(visibleContent = '', audibleContent = '', tooltipContent, targetPageNum, classAttr = '', selected = false, disabled = false, hidden = false) {
      let isAriaDisabled = '';
      let isControlDisabled = '';
      let isDisabledTooltip = '';
      let titleAttr = '';
      let pageAttr = '';

      if (targetPageNum) {
        pageAttr = ` data-page="${targetPageNum}"`;
      }
      if (tooltipContent) {
        titleAttr = ` title="${tooltipContent}"`;
      }
      if (hidden) {
        classAttr += ' hidden';
      }
      if (selected) {
        classAttr += ' selected';
        isAriaDisabled = ' aria-disabled="true"';
      }
      if (disabled) {
        isControlDisabled = ' disabled';
        isAriaDisabled = ' aria-disabled="true"';
        isDisabledTooltip = `<div class="disabled-tooltip"${titleAttr}></div>`;
        if (!targetPageNum) {
          titleAttr = '';
        }
      }

      const html = `<li class="${classAttr}">
        <button type="button" class="btn-icon"${titleAttr}${pageAttr}${isAriaDisabled}${isControlDisabled}>
          ${isDisabledTooltip}<span>${audibleContent}</span>
          ${visibleContent}
        </button>
      </li>`;

      return html;
    }

    // Remove all existing buttons
    $(this.numberButtons).remove();

    // First Button
    if (doRenderFirstButton) {
      buttonHTML += renderButton($.createIcon({ icon: 'first-page' }), Locale.translate('FirstPage'), this.settings.firstPageTooltip, null, 'pager-first', false, disableFirstButton, false);
    }

    // Previous Button
    if (doRenderPreviousButton) {
      buttonHTML += renderButton($.createIcon({ icon: 'previous-page' }), Locale.translate('PreviousPage'), this.settings.previousPageTooltip, null, 'pager-prev', false, disablePreviousButton, false);
    }

    // Draw all relevant page numbers, if applicable
    // Page Number Buttons are only rendered if there is visible space available to fit them.
    if (!this.isTable && hasDataset && !this.settings.showPageSelectorInput) {
      let numberButtonHTML = '';
      buttonsToRender.forEach((i) => {
        if (i === (activePage || 1)) {
          numberButtonHTML += renderButton(i, Locale.translate('PageOn'), null, i, 'pager-no', true, false, false);
        } else {
          numberButtonHTML += renderButton(i, Locale.translate('Page'), null, i, 'pager-no', false, false, false);
        }
      });
      buttonHTML += numberButtonHTML;
    }

    // Next Button
    if (doRenderNextButton) {
      buttonHTML += renderButton($.createIcon({ icon: 'next-page' }), Locale.translate('NextPage'), this.settings.nextPageTooltip, null, 'pager-next', false, disableNextButton, false);
    }

    // Last Button
    if (doRenderLastButton) {
      buttonHTML += renderButton($.createIcon({ icon: 'last-page' }), Locale.translate('LastPage'), this.settings.lastPageTooltip, null, 'pager-last', false, disableLastButton, false);
    }

    // Render all elements into the pager container element
    this.pagerBar[0].innerHTML = buttonHTML;

    if (!doRenderLastButton && !doRenderFirstButton && !this.settings.showPageSizeSelector) {
      this.pagerBar[0].classList.add('two-button');
    } else {
      this.pagerBar[0].classList.remove('two-button');
    }

    // Invoke all sub-components
    this.pagerBar.children('li').find('> .btn-icon').button().tooltip();
    this.pagerBar.children('li').find('> .btn-icon[disabled] .disabled-tooltip').tooltip();
  },

  /**
   * Renders an input-field based page selector (Datagrid only)
   * @returns {void}
   */
  renderPageSelectorInput() {
    if ((!this.isTable || this.settings.indeterminate) && !this.settings.showPageSelectorInput) {
      return;
    }

    let activePage = this.activePage;
    let totalPages = this.state.pages || 1;

    // If this is a filtered dataset, use the `filteredTotal` instead
    if (this.state.filteredPages) {
      activePage = this.state.filteredActivePage;
      totalPages = this.state.filteredPages;
    }

    if (!this.pageSelectorInput) {
      let text = this.settings.pageSelectorInputText || Locale.translate('PageOf');
      text = text.replace('{0}', `<input class="new-mask" name="pager-pageno" value="${activePage}" autocomplete="off">`);
      text = text.replace('{1}', `<span class="pager-total-pages">${totalPages}</span>`);
      $(`<li class="pager-count"><label>${text} </label>`).insertAfter(this.pagerBar.find('.pager-prev'));
    } else {
      // Update the total number of pages
      if (totalPages > 1) {
        this.pagerBar.find('.pager-total-pages').text(totalPages);
      }
      // Update the input field's number
      this.pagerBar.find('.pager-count input').val(activePage);
    }

    let lastValue = null;
    const pattern = (`${totalPages}`).replace(/\d/g, '#');
    const self = this;
    const maskSettings = {
      pattern,
      mode: 'number',
      processOnInitialize: false
    };

    function update(elem) {
      const newValue = self.adjustPageCount(parseInt(elem.val(), 10));
      if (lastValue === newValue) {
        elem.val(lastValue);
        return;
      }

      let currentPage = self.activePage;
      if (self.state.filteredPages) {
        currentPage = self.state.filteredActivePage;
      }
      elem.val(self.setActivePage(newValue, false, 'page'));
      self.triggerPagingEvents(currentPage);
    }

    $(this.pageSelectorInput)
      .mask(maskSettings)
      .on('focus', function () {
        lastValue = parseInt($(this).val(), 10);
      })
      .on('blur', function () {
        update($(this));
        lastValue = null;
      })
      .on('keydown', function (e) {
        if (e.which === 13) {
          update($(this));
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
        return true;
      });
  },

  /**
   * Displays a Page Size Selector button as part of the pager bar
   * @returns {void}
   */
  renderPageSizeSelectorButton() {
    if (!this.settings.showPageSizeSelector || this.settings.pagesizes.length < 2) {
      return;
    }

    if (!this.pageSizeSelectorButton) {
      const pageSizeLi = $('<li class="pager-pagesize"></li>');
      const dropdownIcon = $.createIcon({ icon: 'dropdown' });
      let translatedText = Locale.translate(this.settings.pageSizeSelectorText).replace('{0}', this.settings.pagesize);
      let isAudible = '';
      let recordHtml = `<span>${translatedText}</span>`;

      // Change to the condensed layout, if applicable
      if (this.showSmallPageSizeSelector) {
        isAudible = ' class="audible"';
        translatedText = Locale.translate(this.settings.pageSizeSelectorTextNoToken);
        recordHtml = `<span class="record-count">${this.settings.pagesize}</span>
        <span${isAudible}>${translatedText}</span>`;
      }

      // Render the button
      const pageSizeButton = $(`<button type="button" class="btn-menu">
        ${recordHtml}
        ${dropdownIcon}
      </button>`).appendTo(pageSizeLi);
      pageSizeLi.appendTo(this.pagerBar);

      // Render menu items that render available records per page
      let menuItems = '';
      if (this.showSmallPageSizeSelector) {
        menuItems = `<li class="heading">${translatedText}</li>`;
      }
      for (let k = 0; k < this.settings.pagesizes.length; k++) {
        const size = this.settings.pagesizes[k];
        menuItems += `<li class="${size === this.settings.pagesize ? ' is-checked' : ''}"><a href="#">${size}</a></li>`;
      }
      const menu = $(`<ul class="popupmenu is-selectable">${menuItems}</ul>`);
      pageSizeButton.after(menu);
    }

    const $pageSizeSelectorButton = $(this.pageSizeSelectorButton);

    // Invoke/Update the popupmenu instance with new settings
    const popupOpts = utils.extend({}, {
      placementOpts: {
        parent: $pageSizeSelectorButton,
        parentXAlignment: (Locale.isRTL() ? 'left' : 'right'),
        strategies: ['flip']
      }
    }, this.settings.pageSizeMenuSettings);
    $pageSizeSelectorButton.popupmenu(popupOpts);
    $pageSizeSelectorButton.on('selected.pager', (e, args) => {
      this.changePageSize(args);
    });

    if (this.settings.tabbable) {
      const popupmenuApi = $pageSizeSelectorButton.data('popupmenu');
      this.pagerBar
        .off(`keydown.${COMPONENT_NAME}`, '.pager-pagesize button')
        .on(`keydown.${COMPONENT_NAME}`, '.pager-pagesize button', (e) => {
          const key = e.which || e.keyCode || e.charCode;
          if (key === 40 && popupmenuApi && !popupmenuApi.isOpen) {
            popupmenuApi.open();
            e.preventDefault();
            e.stopPropagation();
          }
        });
    }
  },

  /**
   * Renders the contents of the pager bar
   * @returns {void}
   */
  render() {
    // Adjust Page count numbers
    const state = this.state;
    let totalPages = state.pages;

    // Preserve the focus before render, if focus on pagesize popupmenu
    this.preserveFocus = this.preserveFocus || false;
    const isPagesizeBtnFocused = $(':focus').closest('.pager-pagesize').length > 0;
    if (!this.preserveFocus && isPagesizeBtnFocused) {
      this.preserveFocus = true;
    }

    if (state.filteredPages) {
      totalPages = state.filteredPages;
    }
    this.pageCount(totalPages);

    if (this.pageSizeSelectorButton) {
      this.teardownPageSizeSelector();
    }

    this.renderButtons();
    this.renderPageSelectorInput();
    this.renderPageSizeSelectorButton();
    this.renderBar();

    // Apply focus after render, if preserve focus was on pagesize popupmenu
    if (this.preserveFocus) {
      this.element.find('.pager-pagesize button').focus();
    }
  },

  /**
   * Renders the pager bar based on derived or forced settings.
   * @private
   * @param {SohoPagingInfo} pagingInfo - an object containing information on how to render the pager.
   * @returns {undefined}
   */
  renderBar(pagingInfo) {
    const self = this;

    if (!pagingInfo) {
      pagingInfo = this.state;
    } else {
      pagingInfo = utils.extend({}, this.state, pagingInfo);
    }

    let activePage = pagingInfo.activePage;
    if (pagingInfo.filteredActivePage) {
      activePage = pagingInfo.filteredActivePage;
    }

    // hide buttons feature
    if (!this.settings.showFirstButton) {
      this.showButton('first', false);
    }

    if (!this.settings.enableFirstButton) {
      this.enableButton('first', false);
    }

    if (!this.settings.showPreviousButton) {
      this.showButton('previous', false);
    }

    if (!this.settings.enablePreviousButton) {
      this.enableButton('previous', false);
    }

    if (!this.settings.showNextButton) {
      this.showButton('next', false);
    }

    if (!this.settings.enableNextButton) {
      this.enableButton('next', false);
    }

    if (!this.settings.showLastButton) {
      this.showButton('last', false);
    }

    if (!this.settings.enableLastButton) {
      this.enableButton('last', false);
    }

    if (this.settings.showPageSizeSelector) {
      this.showPageSizeSelector(true);
    }

    // Explicit true/false when using `firstPage` or `lastPage` will force the state
    // on the specified set of buttons to change.
    if (pagingInfo.firstPage !== undefined) {
      // First/Prev page
      if (pagingInfo.firstPage === false) {
        this.enableButton('first', true);
        this.enableButton('previous', true);
      }
      if (pagingInfo.firstPage === true || activePage === 1) {
        this.enableButton('first', false);
        this.enableButton('previous', false);
      }
    }

    if (pagingInfo.lastPage !== undefined) {
      // Next/Last Page
      if (pagingInfo.lastPage === false) {
        this.enableButton('next', true);
        this.enableButton('last', true);
      }
      if (pagingInfo.lastPage === true || activePage === this.pageCount()) {
        this.enableButton('next', false);
        this.enableButton('last', false);
      }
    }

    const classList = this.pagerBar[0] ? this.pagerBar[0].classList : null;
    const pagerClassList = ['.pager-first', '.pager-prev', '.pager-next', '.pager-last', '.pager-count'];

    const toggleHide = (classNames = [], addHide = true) => {
      classNames.forEach((className) => {
        if (addHide) {
          self.pagerBar.find(className).addClass('hidden');
        } else {
          self.pagerBar.find(className).removeClass('hidden');
        }
      });
    };

    if (this.settings.hideOnOnePage && pagingInfo.total <= pagingInfo.pagesize) {
      toggleHide(pagerClassList);
    } else if (this.hidePagerBar(pagingInfo) && classList) {
      classList.add('hidden');
    } else if (this.settings.hideOnOnePage && classList && classList.contains('hidden')) {
      classList.remove('hidden');
      toggleHide(pagerClassList, false);
    }

    this.initTabIndexes();

    // Add id's to everything
    utils.addAttributes(this.pagerBar, this, this.settings.attributes);
    utils.addAttributes(this.pagerBar.find('.pager-first button'), this, this.settings.attributes, 'btn-first');
    utils.addAttributes(this.pagerBar.find('.pager-prev button'), this, this.settings.attributes, 'btn-prev');
    utils.addAttributes(this.pagerBar.find('.pager-next button'), this, this.settings.attributes, 'btn-next');
    utils.addAttributes(this.pagerBar.find('.pager-last button'), this, this.settings.attributes, 'btn-last');
    utils.addAttributes(this.pagerBar.find('.pager-pagesize button'), this, this.settings.attributes, 'btn-pagesize');
    utils.addAttributes(this.pagerBar.find('input'), this, this.settings.attributes, 'pagesize-input');

    this.pagerBar.find('.pager-pagesize .popupmenu li').each(function () {
      const link = $(this).find('a');
      const value = link.text();
      utils.addAttributes(link, self, self.settings.attributes, `pagesize-opt-${value}`);
    });

    // Append if using attach to body
    const menu = this.pagerBar.find('.btn-menu')?.data('popupmenu')?.menu;
    if (menu) {
      menu.find('li').each(function () {
        const link = $(this).find('a');
        const value = link.text();
        utils.addAttributes(link, self, self.settings.attributes, `pagesize-opt-${value}`);
      });
    }
  },

  /**
   * Sync the tabindexes
   * @private
   */
  initTabIndexes() {
    if (this.settings.tabbable) {
      return;
    }
    const tabbables = $(this.focusableElements);
    tabbables.attr('tabindex', '-1');
    tabbables.filter(':not([disabled])').first().removeAttr('tabindex');
  },

  /**
  * Fires when the first page button is clicked.
  * @event firstpage
  * @memberof Pager
  * @property {object} event - The jquery event object
  * @property {function} request - Various paging info
  */
  /**
  * Fires when the previous page button is clicked.
  * @event previouspage
  * @memberof Pager
  * @property {object} event - The jquery event object
  * @property {function} request - Various paging info
  */
  /**
  * Fires when the next page button is clicked.
  * @event nextpage
  * @memberof Pager
  * @property {object} event - The jquery event object
  * @property {function} request - Various paging info
  */
  /**
   *Fires when the last page button is clicked.
   * @event lastpage
   * @memberof Pager
   * @property {object} event - The jquery event object
   * @property {function} request - Various paging info
   */
  /**
   * @private
   * Triggers the `page` event, along with other special events.  Also runs associated callbacks.
   * @param {number} [previousActivePage=undefined] if defined, sets a previous page value for determining some event triggers
   * @returns {void}
   */
  triggerPagingEvents(previousActivePage) {
    const state = this.state;
    if (!previousActivePage) {
      previousActivePage = this.state.activePage;
    }

    // Trigger events for specific special pages, and always trigger the `page` event
    // containing the new pager state.
    if (state.type === 'first') {
      // First Page
      if (this.settings.onFirstPage) {
        this.settings.onFirstPage(this, state);
      }
      this.element.trigger('firstpage', state);
    }
    if (state.type === 'prev') {
      // Previous Page
      if (this.settings.onPreviousPage) {
        this.settings.onPreviousPage(this, state);
      }
      this.element.trigger('previouspage', state);
    }
    if (state.type === 'next') {
      // Next Page
      if (this.settings.onNextPage) {
        this.settings.onNextPage(this, state);
      }
      this.element.trigger('nextpage', state);
    }
    if (state.type === 'last') {
      // Last Page
      if (this.settings.onLastPage) {
        this.settings.onLastPage(this, state);
      }
      this.element.trigger('lastpage', state);
    }

    if (state.type === 'pageinfo') {
      return;
    }

    this.element.trigger('page', state);
  },

  /**
   * Update the component and optionally apply new settings.
   * @param  {object} settings the settings to update to.
   * @returns {object} The plugin api for chaining.
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
    }
    if (Array.isArray(settings.pagesizes) && settings.pagesizes.length) {
      this.settings.pagesizes = settings.pagesizes;
    }

    // Limit updated paging info to a specific subset
    const pagingInfo = {
      activePage: this.settings.activePage,
      indeterminate: this.settings.indeterminate,
      pagesize: this.settings.pagesize
    };

    this.handleDeprecatedSettings();
    this.updatePagingInfo(pagingInfo);
    return this;
  },

  /**
   * Changes the size of the visible page
   * @param {jQuery} anchor containing a reference to the jQuery-wrapped popupmenu menu item element that was chosen.
   * @returns {void}
   */
  changePageSize(anchor) {
    const tag = anchor;
    tag.closest('.popupmenu').find('.is-checked').removeClass('is-checked');
    tag.parent('li').addClass('is-checked');
    this.settings.pagesize = parseInt(tag.text(), 10);

    if (this.settings.componentAPI) {
      this.settings.componentAPI.settings.pagesize = this.settings.pagesize;
    }
    this.setActivePage(1, true, 'first');

    if (this.settings.onPageSizeChange) {
      this.settings.onPageSizeChange(this, {
        tag: anchor,
        pagesize: this.settings.pagesize,
        settings: this.settings
      });
    }

    this.element.trigger('pagesizechange', {
      tag: anchor,
      pagesize: this.settings.pagesize,
      settings: this.settings
    });
  },

  /**
   * Updates this instance of pager with externally-provided settings.
   * @param {object} pagingInfo - contains settings that will change buttons on the pager.
   * @param {number} pagingInfo.pagesize - the number of items visible per page
   * @param {number} pagingInfo.total - the total number of pages
   * @param {number} pagingInfo.activePage - the currently visible page
   * @param {boolean} [pagingInfo.firstPage=false] - passed if the currently visible page is the
   * first one
   * @param {boolean} [pagingInfo.lastPage=false] - passed if the currently visible page is the
   * last one
   * @param {boolean} [pagingInfo.hideDisabledPagers=false] - causes the pager to become completely
   * hidden if all buttons are disabled
   * @param {boolean} [isResponse=false] if true, causes events not to be triggered (avoids infinite loops)
   * @returns {void}
   */
  updatePagingInfo(pagingInfo, isResponse) {
    if (!pagingInfo) {
      return;
    }

    // Grab and retain the pagesize
    if (pagingInfo.pagesize) {
      this.settings.pagesize = pagingInfo.pagesize;
      if (this.isTable && this.settings.componentAPI) {
        this.settings.componentAPI.settings.pagesize = pagingInfo.pagesize;
      }
    }

    // Detect client-side filtering in the other component's API
    if (pagingInfo.isFilteredClientside) {
      this.isFilteredClientside = true;
      delete this.serverDatasetTotal;
    } else if (this.isFilteredClientside) {
      delete this.isFilteredClientside;
    }

    // Explicitly setting `firstPage` or `lastPage` to true/false will cause pager buttons
    // to be forced enabled/disabled
    delete this.firstPage;
    delete this.lastPage;
    if (pagingInfo.firstPage !== undefined) {
      this.firstPage = pagingInfo.firstPage;
      this.settings.enableFirstButton = !pagingInfo.firstPage;
      this.settings.enablePreviousButton = !pagingInfo.firstPage;
    }
    if (pagingInfo.lastPage !== undefined) {
      this.lastPage = pagingInfo.lastPage;
      this.settings.enableNextButton = !pagingInfo.lastPage;
      this.settings.enableLastButton = !pagingInfo.lastPage;
    }

    // Track "grandTotal" for all records, including filtered-out, if applicable
    if (!isNaN(pagingInfo.grandTotal)) {
      this.grandTotal = pagingInfo.grandTotal;
    }

    // For server-side paging, retain a separate "total" for the server dataset.
    if (!this.isFilteredClientside) {
      this.serverDatasetTotal = pagingInfo.total;
    }

    // If the dataset is filtered, store some extra meta-data for the state.
    if (!isNaN(pagingInfo.filteredTotal)) {
      this.filteredTotal = pagingInfo.filteredTotal;
      this.filteredActivePage = pagingInfo.searchActivePage || pagingInfo.filteredActivePage || 1;
    } else if (this.filteredTotal || this.filteredActivePage) {
      delete this.filteredTotal;
      delete this.filteredActivePage;
    }

    if (!pagingInfo.type) {
      pagingInfo.type = 'pageinfo';
    }

    if (this.settings.source || this.settings.dataset) {
      // Set first and last page if passed
      // If we get a page number as a result, rendering has already happened and
      // we should not attempt to re-render.
      this.setActivePage(pagingInfo, false, pagingInfo.type);
      if (pagingInfo.type !== 'initial' && !isResponse) {
        this.triggerPagingEvents();
      }
      return;
    }

    this.teardown();
    this.render();
    this.handleEvents();
  },

  /**
   * Reclaim the pager height so that datagrid can use it's full container, if only one page.
   * @private
   * @param  {object} pagingInfo The pager states.
   * @returns {void}
   */
  hidePagerBar(pagingInfo) {
    if (pagingInfo && (pagingInfo.firstPage === true && pagingInfo.lastPage === true) &&
      pagingInfo.hideDisabledPagers) {
      return true;
    }

    return false;
  },

  /**
   * Removes all event listeners and generated HTML markup from the pager instance
   * @returns {void}
   */
  teardown() {
    if (this.numberButtons) {
      this.numberButtons.forEach((li) => {
        const btn = li.querySelector('.btn-icon');
        const buttonAPI = $(btn).data('button');
        const tooltipAPI = $(btn).data('tooltip');

        if (buttonAPI) {
          buttonAPI.destroy();
        }
        if (tooltipAPI) {
          tooltipAPI.destroy();
        }
      });
    }

    this.pagerBar.off([
      `click.${COMPONENT_NAME}`,
      `keydown.${COMPONENT_NAME}`
    ].join(' '));

    if (this.pageSelectorInput) {
      $(this.pageSelectorInput).off([
        `focus.${COMPONENT_NAME}`,
        `blur.${COMPONENT_NAME}`,
        `keydown.${COMPONENT_NAME}`
      ].join(' '));
      $(this.pageSelectorInput).data('mask')?.destroy();
    }

    if (this.pageSizeSelectorButton) {
      $(this.pageSizeSelectorButton).off(`selected.${COMPONENT_NAME}`);
      this.teardownPageSizeSelector();
    }

    this.pagerBar[0].innerHTML = '';

    delete this.firstPage;
    delete this.lastPage;
  },

  /**
   * Tears down the Popupmenu associated with the page size selector.
   * This happens here because the Popupmenu component does not remove its own
   * menu markup when being destroyed.
   * @private
   * @returns {void}
   */
  teardownPageSizeSelector() {
    const $pageSizeSelectorButton = $(this.pageSizeSelectorButton);
    const api = $pageSizeSelectorButton.data('popupmenu');

    if (!api || !api.menu) {
      return;
    }

    const pageSizeSelectorMenu = api.menu;
    api.destroy();
    pageSizeSelectorMenu.remove();
  },

  /**
   * Tear down and detatch all events
   */
  destroy() {
    this.teardown();
    if (this.pagerBar) {
      this.pagerBar.remove();
    }
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Pager, COMPONENT_NAME };
