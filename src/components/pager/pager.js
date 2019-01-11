/* eslint-disable no-underscore-dangle */
import * as debug from '../../utils/debug';
import { DOM } from '../../utils/dom';
import { utils } from '../../utils/utils';
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
  '.pager-first > a',
  '.pager-prev > a',
  '.pager-next > a',
  '.pager-last > a',
  '.pager-no > a',
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
* @param {boolean} [settings.showPageSizeSelector = true] If false will not show page size selector
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
  showPageSizeSelector: true,
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
  lastPageTooltip: 'LastPage'
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
    const pagesize = this.settings.pagesize;
    const type = this.previousOperation;
    const trigger = this.previousTrigger;

    if (this.settings.dataset) {
      total = this.settings.dataset.length;
      pages = Math.ceil(total / pagesize);
    }

    return {
      activePage: this.activePage,
      indeterminate: this.settings.indeterminate,
      pagesize,
      pages,
      trigger,
      total,
      type
    };
  },

  /**
   * @deprecated as of v4.15.0
   * (See https://github.com/infor-design/enterprise/issues/922)
   * @returns {object} containing various state properties
   */
  get pagingInfo() {
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
   * Init the pager.
   * @private
   * @returns {void}
   */
  init() {
    this.setup();
    this.createPagerBar();
    this.setActivePage(this.settings.activePage, true); // Get First Page
    this.handleEvents();
  },

  /**
   * Setting the internals of the pager.
   * @private
   * @returns {void}
   */
  setup() {
    // Add [pagesize] if not found in [pagesizes]
    if (this.settings.pagesizes.indexOf(this.settings.pagesize) === -1) {
      const sortNumber = function (a, b) {
        return a - b;
      };
      this.settings.pagesizes.push(this.settings.pagesize);
      this.settings.pagesizes = this.settings.pagesizes.sort(sortNumber);
    }

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

    return this;
  },

  /**
   * Add the pager dom elements.
   * @private
   */
  createPagerBar() {
    this.pagerBar = this.element.prev('.pager-toolbar');

    if (this.pagerBar.length === 0) {
      this.pagerBar = $('<ul class="pager-toolbar"></ul>');
    }

    if (this.settings.type === 'standalone') {
      this.element.append(this.pagerBar);
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
    if (widgetContainer.length) {
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

        self.pagerBar.appendTo(widgetFooter);
      });
    }
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
   * Attach All relevant events
   * @private
   */
  handleEvents() {
    const self = this;

    // Attach button click and touch
    this.pagerBar.on('click.pager', 'a', function (e) {
      const a = e.currentTarget;
      const li = a.parentNode;
      let state = self.state;

      e.preventDefault();

      if ($(this).attr('disabled')) {
        return false;
      }

      if (DOM.hasClass(li, 'pager-prev')) {
        self.setActivePage(self.activePage - 1, false, 'prev');
        state = self.state;
        if (self.settings.onPreviousPage) {
          self.settings.onPreviousPage(this, state);
        }
        self.element.trigger('page', state);
        self.element.trigger('previouspage', state);
        return false;
      }

      if (DOM.hasClass(li, 'pager-next')) {
        self.setActivePage((self.activePage === -1 ? 0 : self.activePage) + 1, false, 'next');
        state = self.state;
        if (self.settings.onNextPage) {
          self.settings.onNextPage(this, state);
        }
        self.element.trigger('page', state);
        self.element.trigger('nextpage', state);
        return false;
      }

      if (DOM.hasClass(li, 'pager-first')) {
        self.setActivePage(1, false, 'first');
        state = self.state;
        if (self.settings.onFirstPage) {
          self.settings.onFirstPage(this, state);
        }
        self.element.trigger('page', state);
        self.element.trigger('firstpage', state);
        return false;
      }

      if (DOM.hasClass(li, 'pager-last')) {
        self.setActivePage(self.pageCount(), false, 'last'); // TODO Calculate Last Page?
        state = self.state;
        if (self.settings.onLastPage) {
          self.settings.onLastPage(this, state);
        }
        self.element.trigger('page', state);
        self.element.trigger('lastpage', state);
        return false;
      }

      // Go to the page via the applied `data-page` attribute of the button
      let activePageIdx = Number(a.getAttribute('data-page'));
      if (isNaN(activePageIdx)) {
        activePageIdx = 0;
      }
      const types = ['table', 'pageof', 'standalone'];
      if (types.indexOf(self.settings.type) === -1) {
        activePageIdx += 1;
      }
      self.setActivePage(activePageIdx, false, 'page');
      self.element.trigger('page', self.state);

      return false;
    });

    self.pagerBar.on('keydown.pager', $(self.focusableElements), (event) => {
      event = event || window.event;
      const key = event.which || event.keyCode || event.charCode || false;
      let isLeft = key === 37 || key === 40;
      let isRight = key === 39 || key === 38;

      const elem = event.currentTarget;
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
        const link = prev.querySelector('a, button, input');
        link.removeAttribute('tabindex');
        elem.setAttribute('tabindex', '-1');
        link.focus();
        return false;
      }

      if (isLeft && isFirst) {
        const link = parent.parentNode.lastChild.querySelector('a, button, input');
        link.removeAttribute('tabindex');
        elem.setAttribute('tabindex', '-1');
        link.focus();
        return false;
      }

      if (isRight && !isLast) {
        const link = next.querySelector('a, button, input');
        link.removeAttribute('tabindex');
        elem.setAttribute('tabindex', '-1');
        link.focus();
        return false;
      }

      if (isRight && isLast) {
        const link = parent.parentNode.firstChild.querySelector('a, button, input');
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

    this.render();
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
      this.pageCount();
    } else {
      this.pagerBar.find('.pager-pagesize').remove();
    }
  },

  /**
   * Show first page button.
   * @param  {boolean} toggleOption Toggle vs show
   */
  showFirstButton(toggleOption) {
    toggleOption = (`${toggleOption}`).toLowerCase() === 'true';
    this.settings.showFirstButton = toggleOption;
    if (toggleOption) {
      this.pagerBar.find('.pager-first a').show();
    } else {
      this.pagerBar.find('.pager-first a').hide();
    }
  },

  /**
   * Show previous page button.
   * @param  {boolean} toggleOption Toggle vs show
   */
  showPreviousButton(toggleOption) {
    toggleOption = (`${toggleOption}`).toLowerCase() === 'true';
    this.settings.showPreviousButton = toggleOption;
    if (toggleOption) {
      this.pagerBar.find('.pager-prev a').show();
    } else {
      this.pagerBar.find('.pager-prev a').hide();
    }
  },

  /**
   * Show next page button.
   * @param  {boolean} toggleOption Toggle vs show
   */
  showNextButton(toggleOption) {
    toggleOption = (`${toggleOption}`).toLowerCase() === 'true';
    this.settings.showNextButton = toggleOption;
    if (toggleOption) {
      this.pagerBar.find('.pager-next a').show();
    } else {
      this.pagerBar.find('.pager-next a').hide();
    }
  },

  /**
   * Show last page button.
   * @param  {boolean} toggleOption Toggle vs show
   */
  showLastButton(toggleOption) {
    toggleOption = (`${toggleOption}`).toLowerCase() === 'true';
    this.settings.showLastButton = toggleOption;
    if (toggleOption) {
      this.pagerBar.find('.pager-last a').show();
    } else {
      this.pagerBar.find('.pager-last a').hide();
    }
  },

  /**
   * Enable first page button.
   * @param  {boolean} toggleOption Toggle vs show
   */
  enableFirstButton(toggleOption) {
    toggleOption = (`${toggleOption}`).toLowerCase() === 'true';
    this.settings.enableFirstButton = toggleOption;

    if (toggleOption) {
      this.pagerBar.find('.pager-first a').removeAttr('disabled');
    } else {
      this.pagerBar.find('.pager-first a').attr('disabled', 'disabled');
    }
  },

  /**
   * Enable previous page button.
   * @param  {boolean} toggleOption Toggle vs show
   */
  enablePreviousButton(toggleOption) {
    toggleOption = (`${toggleOption}`).toLowerCase() === 'true';
    this.settings.enablePrevButton = toggleOption;

    if (toggleOption) {
      this.pagerBar.find('.pager-prev a').removeAttr('disabled');
    } else {
      this.pagerBar.find('.pager-prev a').attr('disabled', 'disabled');
    }
  },

  /**
   * Enable next page button.
   * @param {boolean} toggleOption Toggle vs show
   */
  enableNextButton(toggleOption) {
    toggleOption = (`${toggleOption}`).toLowerCase() === 'true';
    this.settings.enableNextButton = toggleOption;

    if (toggleOption) {
      this.pagerBar.find('.pager-next a').removeAttr('disabled');
    } else {
      this.pagerBar.find('.pager-next a').attr('disabled', 'disabled');
    }
  },

  /**
   * Enable last page button.
   * @param {boolean} toggleOption Toggle vs show
   */
  enableLastButton(toggleOption) {
    toggleOption = (`${toggleOption}`).toLowerCase() === 'true';
    this.settings.enableLastButton = toggleOption;

    if (toggleOption) {
      this.pagerBar.find('.pager-last a').removeAttr('disabled');
    } else {
      this.pagerBar.find('.pager-last a').attr('disabled', 'disabled');
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
    let pageNum = this.activePage || this.settings.activePage;

    if (typeof pagingInfo === 'object' && pagingInfo.activePage) {
      pageNum = pagingInfo.activePage;
    } else if (!isNaN(pagingInfo)) {
      pageNum = pagingInfo;
    }

    // Never go below (1)
    if (pageNum < 1) {
      pageNum = 1;
    }
    // Never go above the total number of pages (determined internally by the state)
    if (pageNum > this.state.pages) {
      pageNum = this.state.pages;
    }

    // Set the active page interally and render the new state
    this.activePage = pageNum;
    this.previousOperation = op;
    this.render();

    // If any of the following conditions are met, don't rerender the pages.
    // Only rerender the pager bar.
    if (pageNum === undefined ||
        pageNum === 0 ||
        isNaN(pageNum) ||
        (pageNum > this.state.pages && this.state.pages > 0) ||
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
    const types = ['table', 'pageof', 'firstlast', 'standalone'];
    const canHaveFirstLastButtons = types.indexOf(this.settings.type) > -1;
    const totalPages = this.state.pages;
    let buttonHTML = '';
    let doRenderFirstButton = false;
    let doRenderPreviousButton = false;
    let doRenderNextButton = false;
    let doRenderLastButton = false;
    let disableFirstButton = !this.settings.enableFirstButton;
    let disablePreviousButton = !this.settings.enablePreviousButton;
    let disableNextButton = !this.settings.enableFirstButton;
    let disableLastButton = !this.settings.enableLastButton;

    // Determine whether or not special navigation buttons should eventually be rendered
    // First Button
    if (this.settings.showFirstButton && canHaveFirstLastButtons) {
      if (this.activePage === 1) {
        disableFirstButton = true;
      }
      doRenderFirstButton = true;
    }
    // Previous Button
    if (this.settings.showPreviousButton) {
      if (this.activePage === 1) {
        disablePreviousButton = true;
      }
      doRenderPreviousButton = true;
    }
    // Next Button
    if (this.settings.showNextButton) {
      if (this.activePage === this.state.pages) {
        disableNextButton = true;
      }
      doRenderNextButton = true;
    }
    // Last Button
    if (this.settings.showLastButton && canHaveFirstLastButtons) {
      if (this.activePage === this.state.pages) {
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
    if (maxNumberButtons >= totalPages) {
      disableFirstButton = true;
      disableLastButton = true;
    }

    // Figure out the distance on either side of the median value of the number button array.
    // If either index goes out of page boundaries, shift the array to fit the same
    // number of pages by adding to the opposite side.
    const maxDistanceFromCenter = Math.floor(maxNumberButtons / 2);
    let startIndex = this.activePage - maxDistanceFromCenter;
    let endIndex = this.activePage + maxDistanceFromCenter;
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

    function renderButton(visibleContent = '', audibleContent = '', tooltipContent, targetPageNum, classAttr = '', selected = false, disabled = false, hidden = false) {
      let isAriaSelected = '';
      let isAriaDisabled = '';
      let isControlDisabled = '';
      let titleAttr = '';
      let pageAttr = '';

      if (targetPageNum) {
        pageAttr = ` data-page="${targetPageNum}"`;
      }
      if (hidden) {
        classAttr += ' hidden';
      }
      if (selected) {
        classAttr += ' selected';
        isAriaSelected = ' aria-selected="true"';
        isAriaDisabled = ' aria-disabled="true"';
      }
      if (disabled) {
        isControlDisabled = ' disabled';
        isAriaDisabled = ' aria-disabled="true"';
      }
      if (tooltipContent) {
        titleAttr = ` title="${tooltipContent}"`;
      }

      const html = `<li class="${classAttr}"${isAriaSelected}>
        <a${titleAttr}${pageAttr} href="#"${isAriaDisabled}${isControlDisabled}>
          <span class="audible">${audibleContent} </span>${visibleContent}
        </a>
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
    if (!this.isTable) {
      let numberButtonHTML = '';
      buttonsToRender.forEach((i) => {
        if (i === (this.activePage || 1)) {
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

    // Invoke all sub-components
    this.pagerBar.children('li').children('a')
      .button()
      .tooltip();
  },

  /**
   * Renders an input-field based page selector (Datagrid only)
   * @returns {void}
   */
  renderPageSelectorInput() {
    if (!this.pageSelectorInput) {
      let text = Locale.translate('PageOf');
      text = text.replace('{0}', `<input class="new-mask" name="pager-pageno" value="${this.activePage}" autocomplete="off">`);
      text = text.replace('{1}', `<span class="pager-total-pages">${this.state.pages || 1}</span>`);
      $(`<li class="pager-count"><label>${text} </label>`).insertAfter(this.pagerBar.find('.pager-prev'));
    } else {
      // Update the total number of pages
      if (this.state.pages > 1) {
        this.pagerBar.find('.pager-total-pages').text(this.state.pages);
      }
      // Update the input field's number
      this.pagerBar.find('.pager-count input').val(this.activePage);
    }

    let lastValue = null;
    const pattern = (`${this.state.pages}`).replace(/\d/g, '#');

    $(this.pageSelectorInput)
      .mask({ pattern, mode: 'number', processOnInitialize: false })
      .on('focus', function () {
        lastValue = $(this).val();
      })
      .on('blur', function () {
        if (lastValue !== $(this).val()) {
          $(this).val(self.setActivePage(parseInt($(this).val(), 10), false, 'page'));
        }
      })
      .on('keydown', function (e) {
        if (e.which === 13) {
          self.setActivePage(parseInt($(this).val(), 10), false, 'page');

          e.stopPropagation();
          e.preventDefault();
        }
      });
  },

  /**
   * Displays a Page Size Selector button as part of the pager bar
   * @returns {void}
   */
  renderPageSizeSelectorButton() {
    if (!this.pageSizeSelectorButton) {
      const pageSize = $('<li class="pager-pagesize"></li>');
      const pageSizeButton = $(`${'<button type="button" class="btn-menu">' +
        '<span>'}${Locale.translate('RecordsPerPage').replace('{0}', this.settings.pagesize)}</span> ${
        $.createIcon({ icon: 'dropdown' })
      } </button>`).appendTo(pageSize);

      let last = this.pagerBar.find('.pager-last');
      if (last.length === 0) {
        last = this.pagerBar.find('.pager-next');
      }
      pageSize.insertAfter(last);

      const menu = $('<ul class="popupmenu is-selectable"></ul>');

      for (let k = 0; k < this.settings.pagesizes.length; k++) {
        const size = this.settings.pagesizes[k];
        menu.append(`<li ${size === this.settings.pagesize ? ' class="is-checked"' : ''}><a href="#">${size}</a></li>`);
      }

      pageSizeButton.after(menu);

      const popupOpts = {
        placementOpts: {
          parent: pageSizeButton,
          parentXAlignment: (Locale.isRTL() ? 'left' : 'right'),
          strategies: ['flip']
        }
      };

      pageSizeButton.popupmenu(popupOpts);
    }

    $(this.pageSizeSelectorButton).on('selected.pager', (e, args) => {
      this.changePageSize(args);
    });
  },

  /**
   * Renders the contents of the pager bar
   * @returns {void}
   */
  render() {
    // Check Data Attr
    if (this.element.attr('data-pagesize')) {
      this.settings.pagesize = this.element.attr('data-pagesize');
    }

    // Adjust Page count numbers
    this.pageCount(this.state.pages);

    this.renderButtons();

    if (this.isTable && !this.settings.indeterminate) {
      this.renderPageSelectorInput();
    }

    if (this.settings.showPageSizeSelector) {
      this.renderPageSizeSelectorButton();
    }

    this.renderBar();
  },

  /**
   * Renders the pager bar based on derived or forced settings.
   * @deprecated as of v4.15.0 (see https://github.com/infor-design/enterprise/issues/922)
   * @private
   * @param {SohoPagingInfo} pagingInfo - an object containing information on how to render the pager.
   * @returns {undefined}
   */
  renderBar(pagingInfo) {
    const pb = this.pagerBar;
    if (!pagingInfo) {
      pagingInfo = this.state;
    }

    // Refresh Disabled
    const prev = pb.find('.pager-prev a');
    const next = pb.find('.pager-next a');
    const first = pb.find('.pager-first a');
    const last = pb.find('.pager-last a');
    const prevGroup = prev.add(first).add('.pager-prev').add('.pager-first');
    const nextGroup = next.add(last).add('.pager-next').add('.pager-last');

    // Reset all pager buttons' disabled/focusable states
    this.pagerBar[0].classList.remove('hidden');
    prevGroup.add(nextGroup).prop('disabled', false);

    // hide buttons feature
    if (!this.settings.showFirstButton) {
      first.hide();
    }

    if (!this.settings.enableFirstButton) {
      this.enableFirstButton(false);
    }

    if (!this.settings.showPreviousButton) {
      prev.hide();
    }

    if (!this.settings.enablePreviousButton) {
      this.enablePreviousButton(false);
    }

    if (!this.settings.showNextButton) {
      next.hide();
    }

    if (!this.settings.enableNextButton) {
      this.enableNextButton(false);
    }

    if (!this.settings.showLastButton) {
      last.hide();
    }

    if (!this.settings.enableLastButton) {
      this.enableLastButton(false);
    }

    if (this.settings.showPageSizeSelector) {
      this.showPageSizeSelector(true);
    }

    /*
    if (this.settings.type === 'standalone') {
      this.initTabIndexes(pb);
      return;
    }
    */

    // Explicit false turns buttons back on.
    if (pagingInfo.firstPage === false) {
      prevGroup.prop('disabled', false);
    }

    if (pagingInfo.lastPage === false) {
      nextGroup.prop('disabled', false);
    }

    // First page
    if (pagingInfo.firstPage === true ||
      (pagingInfo.firstPage === undefined && this.activePage === 1)) {
      prevGroup.prop('disabled', true);
    }

    // Last page
    if (pagingInfo.lastPage === true ||
      (pagingInfo.lastPage === undefined && this.activePage === this.pageCount())) {
      nextGroup.prop('disabled', true);
    }

    if (this.hidePagerBar(pagingInfo)) {
      this.pagerBar[0].classList.add('hidden');
    }

    this.initTabIndexes();
  },

  /**
   * Sync the tabindexes
   * @private
   */
  initTabIndexes() {
    const tabbables = $(this.focusableElements);
    tabbables.attr('tabindex', '-1');
    tabbables.filter(':not([disabled])').first().removeAttr('tabindex');
  },

  /**
   * Render a page of items.
   * @private
   * @param {object} op The paging operation.
   * @param {function} callback The pager callback.
   * @param {string} trigger The triggering action.
   */
  renderPages(op, callback, trigger) {
    const self = this;

    if (this.settings.type === 'standalone') {
      return;
    }

    let expr;
    const request = this.state;

    /**
    * Fires just before changing page. Returning false from the request function will cancel paging.
    * @event beforepaging
    * @memberof Pager
    * @property {object} event - The jquery event object
    * @property {function} request - The paging request info
    */
    const doPaging = self.element.triggerHandler('beforepaging', this.state);
    if (doPaging === false) {
      return;
    }

    if (self.settings.source && op) {
      const response = function (data, pagingInfo) {
        if (pagingInfo && pagingInfo.activePage) {
          if (pagingInfo.activePage > -1) {
            self.activePage = pagingInfo.activePage;
          }
        }

        // Render Data
        pagingInfo.preserveSelected = true;

        // Call out to the component's API to pull in dataset information.
        // This method should also tell the Pager how to re-render itself.
        self.settings.componentAPI.loadData(data, pagingInfo, true);

        if (callback && typeof callback === 'function') {
          callback(true);
        }

        /**
        * Fires after changing paging has completed.
        * @event afterpaging
        * @memberof Pager
        * @property {object} event - The jquery event object
        * @property {object} pagingInfo - The paging info object
        */
        self.element.trigger('afterpaging', pagingInfo);
      };

      if (self.settings.componentAPI.sortColumn && self.settings.componentAPI.sortColumn.sortId) {
        request.sortAsc = self.settings.componentAPI.sortColumn.sortAsc;
        request.sortField = self.settings.componentAPI.sortColumn.sortField;
        request.sortId = self.settings.componentAPI.sortColumn.sortId;
      }

      if (self.settings.componentAPI.filterExpr) {
        request.filterExpr = self.settings.componentAPI.filterExpr;
      }
      self.settings.source(request, response);
    }

    /**
    * Fires when change page.
    * @event paging
    * @memberof Pager
    * @property {object} event The jquery event object
    * @property {object} request The paging request object
    */
    self.element.trigger('paging', request);
    const elements = self.getPageableElements().not('.is-hidden');

    // Render page objects
    if (!self.settings.source) {
      const rows = self.settings.pagesize;

      self.updatePagingInfo(request);

      if (self.settings.componentAPI && typeof self.settings.componentAPI.renderRows === 'function' && request.type && request.type !== 'initial') {
        self.settings.componentAPI.renderRows();
      }

      elements.hide();

      // collapse expanded rows
      self.element.children()
        .filter('.datagrid-expandable-row.is-expanded')
        .removeClass('is-expanded').hide()
        .prev()
        .removeClass('.is-expanded')
        .find('.plus-minus')
        .removeClass('active');

      expr = (self.activePage === 1 ? `:not(".is-filtered"):lt(${rows})` : `:not(".is-filtered"):lt(${(self.activePage) * rows}):gt(${((self.activePage - 1) * rows) - 1})`);

      elements.filter(expr).show();

      if (self.element.children('.datagrid-summary-row')) {
        self.element.children('.datagrid-summary-row').show();
      }

      self.element.trigger('afterpaging', request);
    } else {
      elements.show();
    }
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

    /*
    if (settings.showPageSizeSelector !== undefined) {
      this.showPageSizeSelector(this.settings.showPageSizeSelector);
    }

    if (settings.showFirstButton !== undefined) {
      this.showFirstButton(this.settings.showFirstButton);
    }

    if (settings.showPreviousButton !== undefined) {
      this.showPreviousButton(this.settings.showPreviousButton);
    }

    if (settings.showNextButton !== undefined) {
      this.showNextButton(this.settings.showNextButton);
    }

    if (settings.showLastButton !== undefined) {
      this.showLastButton(this.settings.showLastButton);
    }

    if (settings.pagesizes) {
      this.settings.pagesizes = settings.pagesizes;
    }
    */

    this.updatePagingInfo(this.settings);

    /*
    if (settings.enableFirstButton !== undefined) {
      this.enableFirstButton(this.settings.enableFirstButton);
    }

    if (settings.enablePreviousButton !== undefined) {
      this.enablePreviousButton(this.settings.enablePreviousButton);
    }

    if (settings.enableNextButton !== undefined) {
      this.enableNextButton(this.settings.enableNextButton);
    }

    if (settings.enableLastButton !== undefined) {
      this.enableLastButton(this.settings.enableLastButton);
    }
    */

    return this;
  },

  /**
   * Changes the size of the visible page
   */
  changePageSize(args) {
    const tag = args;
    tag.closest('.popupmenu').find('.is-checked').removeClass('is-checked');
    tag.parent('li').addClass('is-checked');
    this.settings.pagesize = parseInt(tag.text(), 10);

    if (this.settings.componentAPI) {
      this.settings.componentAPI.settings.pagesize = this.settings.pagesize;
    }
    this.setActivePage(1, true, 'first');

    if (this.settings.onPageSizeChange) {
      this.settings.onPageSizeChange(this, {
        tag: args,
        pagesize: this.settings.pagesize,
        settings: this.settings
      });
    }

    this.element.trigger('pagesizechange', {
      tag: args,
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
   * @returns {void}
   */
  updatePagingInfo(pagingInfo) {
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

    // Set a default total if none are defined.
    if (!pagingInfo.total) {
      pagingInfo.total = 0;
    }

    if (this.settings.source || this.settings.dataset) {
      // Set first and last page if passed
      // If we get a page number as a result, rendering has already happened and
      // we should not attempt to re-render.
      this.setActivePage(pagingInfo, false, 'pageinfo');
      return;
    }

    this.render();
  },

  /**
   * Reclaim the pager height so that datagrid can use it's full container, if only one page.
   * @private
   * @param  {object} pagingInfo The pager states.
   * @returns {void}
   */
  hidePagerBar(pagingInfo) {
    if (this.settings.hideOnOnePage && pagingInfo.total <= pagingInfo.pagesize) {
      return true;
    }

    if ((pagingInfo.firstPage === true && pagingInfo.lastPage === true) &&
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
    this.numberButtons.forEach((li) => {
      const a = li.querySelector('a');
      $(a).data('button').destroy();
      $(a).data('tooltip').destroy();
    });

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
      $(this.pageSelectorInput).data('mask').destroy();
    }

    if (this.pageSizeSelectorButton) {
      $(this.pageSizeSelectorButton).off(`selected.${COMPONENT_NAME}`);
      $(this.pageSizeSelectorButton).data('popupmenu').destroy();
    }

    this.pagerBar[0].innerHTML = '';
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
