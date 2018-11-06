/* eslint-disable no-underscore-dangle */
import * as debug from '../../utils/debug';
import { utils } from '../../utils/utils';
import { Locale } from '../locale/locale';

// jQuery Components
import '../button/button.jquery';
import '../icons/icons.jquery';
import '../popupmenu/popupmenu.jquery';
import '../tooltip/tooltip.jquery';

// The name of this component.
const COMPONENT_NAME = 'pager';

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

const PAGER_NON_NUMBER_BUTTON_SELECTOR = 'li:not(.pager-prev):not(.pager-next):not(.pager-first):not(.pager-last)';
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
   * Init the pager.
   * @private
   * @returns {void}
   */
  init() {
    this.setup();
    this.createPagerBar();
    this.setActivePage(this.settings.activePage, true); // Get First Page
    this.renderBar();
    this.renderPages('initial');
    this.handleEvents();
    this.pagerInfo = {};
    this._pageCount = 0;
  },

  /**
   * Setting the internals of the pager.
   * @private
   * @returns {void}
   */
  setup() {
    // Add [pagesize] if not found in [pagesizes]
    if ($.inArray(this.settings.pagesize, this.settings.pagesizes) === -1) {
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

    this.isRTL = Locale.isRTL();
    this.tabbableSelector = '.pager-first > a, .pager-prev > a, .pager-next > a, .pager-last > a, .pager-no > a, .pager-count input, .pager-pagesize button';

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

      const firstButton = `<li class="pager-first">
        <a href="#" title="${this.settings.firstPageTooltip}">${$.createIcon({ icon: 'first-page' })}
          <span class="audible">${Locale.translate('FirstPage')}</span>
        </a>
      </li>`;

      const prevButton = `<li class="pager-prev">
          <a href="#" rel="prev" title="${this.settings.previousPageTooltip}">${$.createIcon({ icon: 'previous-page' })}
            <span class="audible">${Locale.translate('PreviousPage')}</span>
          </a>
        </li>`;

      const nextButton = `<li class="pager-next">
          <a href="#" rel="next" title="${this.settings.nextPageTooltip}">${$.createIcon({ icon: 'next-page' })}
            <span class="audible">${Locale.translate('NextPage')}</span>
          </a>
        </li>`;

      const lastButton = `<li class="pager-last">
        <a href="#" title="${this.settings.lastPageTooltip}">${$.createIcon({ icon: 'last-page' })}
        <span class="audible">${Locale.translate('LastPage')}</span>
        </a>
      </li>`;

      if (this.settings.type === 'table' || this.settings.type === 'pageof' || this.settings.type === 'firstlast' || this.settings.type === 'standalone') {
        this.pagerBar.html(firstButton + prevButton + nextButton + lastButton);
      } else {
        this.pagerBar.html(prevButton + nextButton);
      }
      this.pagerBar.children('li').children('a').button();
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

    this.pagerBar.find('a').tooltip();
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
      const li = $(this).parent();
      const opts = {
        activePage: self.activePage,
        pagerInfo: self.pagerInfo,
        settings: self.settings,
        element: self.element
      };

      e.preventDefault();

      if ($(this).attr('disabled')) {
        return false;
      }

      if (li.is('.pager-prev')) {
        self.setActivePage(self.activePage - 1, false, 'prev');
        if (self.settings.onPreviousPage) {
          self.settings.onPreviousPage(this, opts);
        }
        self.element.trigger('previouspage', opts);
        return false;
      }

      if (li.is('.pager-next')) {
        self.setActivePage((self.activePage === -1 ? 0 : self.activePage) + 1, false, 'next');
        if (self.settings.onNextPage) {
          self.settings.onNextPage(this, opts);
        }
        self.element.trigger('nextpage', opts);
        return false;
      }

      if (li.is('.pager-first')) {
        self.setActivePage(1, false, 'first');
        if (self.settings.onFirstPage) {
          self.settings.onFirstPage(this, opts);
        }
        self.element.trigger('firstpage', opts);
        return false;
      }

      if (li.is('.pager-last')) {
        self.setActivePage(self.pageCount(), false, 'last'); // TODO Calculate Last Page?
        if (self.settings.onLastPage) {
          self.settings.onLastPage(this, opts);
        }
        self.element.trigger('lastpage', opts);
        return false;
      }

      // Go to the page via the index of the button
      self.setActivePage($(this).parent().index() + (self.settings.type === 'table' ||
        self.settings.type === 'pageof' ? -1 : 0), false, 'page');

      return false;
    });

    self.pagerBar.on('keydown.pager', self.tabbableSelector, (event) => {
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
   * @param  {object} pagingInfo The paging info object
   * @param  {boolean} force Force the update
   * @param  {string} op The paging operation type.
   * @returns {void}
   */
  setActivePage(pagingInfo, force, op) {
    if (this.settings.type === 'standalone') {
      return this.activePage;
    }

    const lis = this.pagerBar.find(PAGER_NON_NUMBER_BUTTON_SELECTOR);
    let pageNum;

    // Backwards compatibility with having "pageNum" as the first argument
    // instead of "pagingInfo"
    if (!isNaN(pagingInfo)) {
      pageNum = pagingInfo;
      pagingInfo = {
        activePage: pageNum
      };
    }

    // Check to make sure our internal active page is set
    if (!this.activePage || isNaN(this.activePage)) {
      this.activePage = this.settings.activePage;
    }

    // If any of the following conditions are met, don't rerender the pages.
    // Only rerender the pager bar.
    if (pageNum === undefined ||
        pageNum === 0 ||
        isNaN(pageNum) ||
        (pageNum > this.pageCount() && this.pageCount() > 0) ||
        (pageNum === this.activePage && !force)) {
      this.renderBar(pagingInfo);
      return this.activePage;
    }

    this.activePage = pageNum;

    // Remove selected
    if (!this.settings.source) {
      lis.filter('.selected').removeClass('selected').removeAttr('aria-selected')
        .find('a')
        .removeAttr('aria-disabled')
        .find('.audible')
        .html(Locale.translate('Page'));

      // Set selected Page
      lis.eq(pageNum - 1).addClass('selected').attr('aria-selected', true)
        .find('a')
        .attr('aria-disabled', true)
        .find('.audible')
        .html(Locale.translate('PageOn'));
    }

    this.renderBar(pagingInfo);
    this.renderPages(op);
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
    const self = this;
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

    // Add in fake pages
    if (!this.isTable) {
      let i;
      let thisClass;
      let thisText;
      let isAriaSelected;
      let isAriaDisabled;
      this.pagerBar.find(PAGER_NON_NUMBER_BUTTON_SELECTOR).remove();

      for (i = pages; i > 0; i--) {
        if (i === (this.activePage || 1)) {
          thisClass = 'class="pager-no selected"';
          thisText = Locale.translate('PageOn');
          isAriaSelected = 'aria-selected="true"';
          isAriaDisabled = 'aria-disabled="true"';
        } else {
          thisClass = 'class="pager-no"';
          thisText = Locale.translate('Page');
          isAriaSelected = '';
          isAriaDisabled = '';
        }

        $(`<li ${thisClass}${isAriaSelected}><a href="#" ${isAriaDisabled}><span class="audible">${thisText} </span>${i}</a></li>`).insertAfter(this.pagerBar.find('.pager-prev'));
      }
    }

    if (this.isTable && !this.settings.indeterminate && this.pagerBar.find('.pager-count').length === 0) {
      let text = Locale.translate('PageOf');
      text = text.replace('{0}', `<input name="pager-pageno" value="${this.activePage}" autocomplete="off">`);
      text = text.replace('{1}', `<span class="pager-total-pages">${pages || 1}</span>`);
      $(`<li class="pager-count"><label>${text} </label>`).insertAfter(this.pagerBar.find('.pager-prev'));

      // Setup interactivty with the numeric page input
      let lastValue = null;

      this.pagerBar.find('.pager-count input')
        .on('focus', function () {
          lastValue = $(this).val();
        }).on('blur', function () {
          if (lastValue !== $(this).val()) {
            $(this).val(self.setActivePage(parseInt($(this).val(), 10), false, 'page'));
          }
        }).on('keydown', function (e) {
          if (e.which === 13) {
            self.setActivePage(parseInt($(this).val(), 10), false, 'page');

            e.stopPropagation();
            e.preventDefault();
          }
        });
    }

    // Add functionality to change page size.
    if (self.settings.showPageSizeSelector && this.pagerBar.find('.btn-menu').length === 0) {
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

      for (let k = 0; k < self.settings.pagesizes.length; k++) {
        const size = self.settings.pagesizes[k];
        menu.append(`<li ${size === self.settings.pagesize ? ' class="is-checked"' : ''}><a href="#">${size}</a></li>`);
      }

      pageSizeButton.after(menu);

      const popupOpts = {
        placementOpts: {
          parent: pageSizeButton,
          parentXAlignment: (this.isRTL ? 'left' : 'right'),
          strategies: ['flip']
        }
      };

      pageSizeButton.popupmenu(popupOpts).on('selected.pager', (e, args) => {
        const tag = args;
        tag.closest('.popupmenu').find('.is-checked').removeClass('is-checked');
        tag.parent('li').addClass('is-checked');
        self.settings.pagesize = parseInt(tag.text(), 10);

        if (self.settings.componentAPI) {
          self.settings.componentAPI.settings.pagesize = self.settings.pagesize;
        }
        self.setActivePage(1, true, 'first');

        if (self.settings.onPageSizeChange) {
          self.settings.onPageSizeChange(this, {
            tag: args,
            pagesize: self.settings.pagesize,
            settings: self.settings
          });
        }

        self.element.trigger('pagesizechange', {
          tag: args,
          pagesize: self.settings.pagesize,
          settings: self.settings
        });

        // Update the number of records per page
        self.pagerBar.find('.btn-menu span')
          .text(Locale.translate('RecordsPerPage').replace('{0}', self.settings.pagesize));
      });
    }

    const pattern = (`${this._pageCount}`).replace(/\d/g, '#');
    this.pagerBar.find('.pager-count input').attr('data-mask', '').mask({ pattern, mode: 'number', processOnInitialize: false });

    this._pageCount = this._pageCount || 1;
    if (this.settings.indeterminate) {
      return 999999999;
    }
    return this._pageCount;
  },

  /**
   * Reliably gets all the pre-rendered elements in the container and returns them for use.
   * @private
   * @returns {array} TThe pagable items
   */
  getPageableElements() {
    let elements = this.element.children().not('.datagrid-expandable-row');

    // Adjust for cases where the root is a <ul>
    if (elements.is('ul')) {
      elements = elements.children();
    }

    if (elements.is('table')) {
      elements = elements.find('tr');
    }

    return elements;
  },

  /**
   * Renders the pager bar based on derived or forced settings.
   * @private
   * @param {SohoPagingInfo} pagingInfo - an object containing information on how to
   * render the pager.
   * @returns {undefined}
   */
  renderBar(pagingInfo) {
    // How many can fit?
    const pb = this.pagerBar;
    let elems;
    let pc;
    const width = (this.element.parent().width() / pb.find('li:first').width());
    const VISIBLE_BUTTONS = 3; // Take out the ones that should be visible (buttons and selected)
    const howMany = Math.floor(width - VISIBLE_BUTTONS);

    if (!pagingInfo) {
      pagingInfo = {};
    }

    // Check Data Attr
    if (this.element.attr('data-pagesize')) {
      this.settings.pagesize = this.element.attr('data-pagesize');
    }

    // Adjust Page count numbers
    if (!this.settings.source && this.settings.type !== 'standalone') {
      const pageableLength = this.getPageableElements().not('.is-filtered').length;
      pc = Math.ceil(pageableLength / this.settings.pagesize);

      if (this.isTable) {
        const isFiltered = function (value) {
          return !value.isFiltered;
        };
        const dataLength = this.settings.dataset.filter(isFiltered).length;

        pc = Math.ceil(dataLength / this.settings.pagesize);
      }
      this.pageCount(pc);
    }

    // Update the input field's number
    this.pagerBar
      .find('.pager-count input').val(this.activePage);

    // Update the total number of pages
    if (this._pageCount !== '0' && !isNaN(this._pageCount)) {
      this.pagerBar.find('.pager-total-pages').text(this._pageCount);
    }

    // Update the number of records per page
    this.pagerBar.find('.btn-menu span')
      .text(Locale.translate('RecordsPerPage').replace('{0}', this.settings.pagesize));

    // Refresh Disabled
    const prev = pb.find('.pager-prev a');
    const next = pb.find('.pager-next a');
    const first = pb.find('.pager-first a');
    const last = pb.find('.pager-last a');
    const prevGroup = prev.add(first).add('.pager-prev').add('.pager-first');
    const nextGroup = next.add(last).add('.pager-next').add('.pager-last');
    const disabledAttrs = { disabled: 'disabled' };

    // Reset all pager buttons' disabled/focusable states
    this.pagerBar[0].classList.remove('hidden');
    prevGroup.add(nextGroup).removeAttr('disabled');

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

    if (this.settings.type === 'standalone') {
      this.initTabIndexes(pb);
      return;
    }

    // Explicit false turns buttons back on.
    if (pagingInfo.firstPage === false) {
      prevGroup.removeAttr('disabled');
    }

    if (pagingInfo.lastPage === false) {
      nextGroup.removeAttr('disabled');
    }

    // First page
    if (pagingInfo.firstPage === true ||
      (pagingInfo.firstPage === undefined && this.activePage === 1)) {
      prevGroup.attr(disabledAttrs);
    }

    // Last page
    if (pagingInfo.lastPage === true ||
      (pagingInfo.lastPage === undefined && this.activePage === this.pageCount())) {
      nextGroup.attr(disabledAttrs);
    }

    if (this.hidePagerBar(pagingInfo)) {
      this.pagerBar[0].classList.add('hidden');
    }

    // Remove from the front until selected is visible and we have at least howMany showing
    if (!this.settings.source) {
      elems = pb.find(PAGER_NON_NUMBER_BUTTON_SELECTOR);
      elems.show();
      if (elems.length < howMany) {
        this.initTabIndexes(pb);
        return;
      }

      elems.each(function () {
        const li = $(this);
        if (pb.find('.pager-next').offset().top - pb.offset().top > 1 && !li.is('.selected')) {
          $(this).hide();
        }
      });
    }

    this.initTabIndexes(pb);
  },

  /**
   * Sync the tabindexes
   * @param {object} pb The pager bar elem.
   * @private
   */
  initTabIndexes(pb) {
    const tabbables = pb.find(this.tabbableSelector);
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
    if (this.settings.type === 'standalone') {
      return;
    }

    let expr;
    const self = this;
    const request = {
      activePage: self.activePage,
      pagesize: self.settings.pagesize,
      indeterminate: self.settings.indeterminate,
      type: op,
      trigger,
      total: self.settings.componentAPI ? self.settings.componentAPI.settings.dataset.length : -1
    };

    /**
    * Fires just before changing page. Returning false from the request function will cancel paging.
    * @event beforepaging
    * @memberof Pager
    * @property {object} event - The jquery event object
    * @property {function} request - The paging request info
    */
    const doPaging = self.element.triggerHandler('beforepaging', request);
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
    } else {
      elements.show();
    }

    if (!self.settings.source) {
      self.element.trigger('afterpaging', request);
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

    this.updatePagingInfo(this.settings);

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

    return this;
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

    if (this.settings.source) {
      this._pageCount = Math.ceil(pagingInfo.total / this.settings.pagesize);
      // Set first and last page if passed
      // If we get a page number as a result, rendering has already happened and
      // we should not attempt to re-render.
      this.setActivePage(pagingInfo, false, 'pageinfo');
      return;
    }

    this.renderBar(pagingInfo);
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
   * Tear down and detatch all events
   */
  destroy() {
    if (this.pagerBar) {
      this.pagerBar.remove();
    }
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Pager, COMPONENT_NAME };
