/* eslint-disable no-underscore-dangle */
import * as debug from '../utils/debug';
import { utils } from '../utils/utils';
import { Locale } from '../locale/locale';

// jQuery Components
import '../button/button.jquery';
import '../icons/icons.jquery';
import '../popupmenu/popupmenu.jquery';
import '../tooltip/tooltip.jquery';

// The name of this component.
const COMPONENT_NAME = 'pager';

/**
* @namespace
* @property {string} componentAPI  If defined, becomes the definitive way to call methods on
* parent component.
* @property {string} type  Different types of pagers
* list - just shows next and Previous and a listing of pages
* table - shows next and previous and first and last with a page number input and
* page size selector used as the default for datagrid
* pageof - also shows next and previous and first and last with a page number input and
* page size selector used optionally for lists
* firstlast - shows next and previous and first and last with option to set showPageSizeSelector
* @property {string} position  Can be on 'bottom' or 'top'.
* @property {number} activePage  Start on this page
* @property {boolean} hideOnOnePage  If true, hides the pager if there is only one page worth of
* results.
* @property {Function} source  Call Back Function for Pager Data Source
* @property {number} pagesize  Can be calculated or a specific number
* @property {array} pagesizes  Array of numbers of the page size selector
* @property {boolean} showPageSizeSelector  If false will not show page size selector
* @property {boolean} indeterminate  If true will not show anything that lets you go to a specific
* page.
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
  indeterminate: false
};

const PAGER_NON_NUMBER_BUTTON_SELECTOR = 'li:not(.pager-prev):not(.pager-next):not(.pager-first):not(.pager-last)';

/**
* The Pager Component supports paging on lists.
* @class Pager
* @param {jQuery[]|HTMLElement} element The component element.
* @param {object} [settings] The component settings.
*
*/
function Pager(element, settings) {
  this.settings = utils.mergeSettings(element, settings, PAGER_DEFAULTS);
  this.settings.dataset = settings.dataset; // by pass deep copy
  this.element = $(element);
  debug.logTimeStart(COMPONENT_NAME);
  this.init();
  debug.logTimeEnd(COMPONENT_NAME);
}

Pager.prototype = {

  pagerInfo: {},

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
      this.isPageof = this.settings.type === 'pageof';

      if (!this.settings.componentAPI) {
        this.settings.componentAPI = this.element.data('listview');
      }
    }

    this.isRTL = Locale.isRTL();

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
      let buttons = `${'<li class="pager-prev">' +
          '<a href="#" rel="prev" title="PreviousPage">'}${$.createIcon({ icon: 'previous-page' })
      }<span class="audible">${Locale.translate('PreviousPage')}</span>` +
          '</a>' +
        '</li>' +
        '<li class="pager-next">' +
          `<a href="#" rel="next" title="NextPage">${$.createIcon({ icon: 'next-page' })
          }<span class="audible">${Locale.translate('NextPage')}</span>` +
          '</a>' +
        '</li>';

      if (this.settings.type === 'table' || this.settings.type === 'pageof' || this.settings.type === 'firstlast') {
        buttons = `${'<li class="pager-first">' +
          '<a href="#" title="FirstPage">'}${$.createIcon({ icon: 'first-page' })
        }<span class="audible">${Locale.translate('FirstPage')}</span>` +
          '</a>' +
        `</li>${
          buttons
        }<li class="pager-last">` +
          `<a href="#" title="LastPage">${$.createIcon({ icon: 'last-page' })
          }<span class="audible">${Locale.translate('LastPage')}</span>` +
          '</a>' +
        '</li>';
      }

      this.pagerBar.html(buttons);

      this.pagerBar.children('li').children('a').button();
    }

    if (this.isTable || this.isPageof) {
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
   * Attach All relevant events
   * @private
   */
  handleEvents() {
    const self = this;

    // Set element to be focused after paging
    self.element.on('afterpaging.pager', () => {
      const isVisible = $('li[tabindex]:visible, td[tabindex]:visible', self.element);
      if (!isVisible.length) {
        $('li:visible:first, td:visible:first', self.element).attr('tabindex', '0');
      }

      // Fix: Firefox by default to not allow keyboard focus on links
      $('li a', self.pagerBar).each(function () {
        const a = $(this);
        const li = a.closest('li');

        if (!a.is('[disabled]')) {
          li.attr('tabindex', '0').on('focus.pager', function () {
            $('a', this).focus();
          });
        }
      });
    });

    // Attach button click and touch
    this.pagerBar.on('click.pager', 'a', function (e) {
      const li = $(this).parent();
      e.preventDefault();

      if ($(this).attr('disabled')) {
        return false;
      }

      if (li.is('.pager-prev')) {
        self.setActivePage(self.activePage - 1, false, 'prev');
        return false;
      }

      if (li.is('.pager-next')) {
        self.setActivePage((self.activePage === -1 ? 0 : self.activePage) + 1, false, 'next');
        return false;
      }

      if (li.is('.pager-first')) {
        self.setActivePage(1, false, 'first');
        return false;
      }

      if (li.is('.pager-last')) {
        self.setActivePage(self.pageCount(), false, 'last'); // TODO Calculate Last Page?
        return false;
      }

      // Go to the page via the index of the button
      self.setActivePage($(this).parent().index() + (self.settings.type === 'table' ||
        self.settings.type === 'pageof' ? -1 : 0), false, 'page');

      return false;
    })
      .on('focus.pager', 'a', function () {
        const li = $(this).parent('li');
        li.addClass('is-focused');
      })
      .on('blur.pager', 'a', function () {
        const li = $(this).parent('li');
        li.removeClass('is-focused');
      });

    // Toolbar functionality
    this.pagerBar.on('keydown.pager', 'a', function (e) {
      e = e || window.event;
      const key = e.which || e.keyCode || e.charCode || false;
      const parent = $(this).parent();
      let btn = ((key === 37 || key === 9 && e.shiftKey) ? parent.prev() :  //eslint-disable-line
        (key === 39 ? parent.next() : $()));  //eslint-disable-line

      if (key === 9 && e.shiftKey && parent.prev().is('.pager-prev, .pager-first, .pager-count') ||
          key === 9 && e.shiftKey && parent.is('.pager-prev, .pager-first')) {
        parent.removeAttr('tabindex');
        setTimeout(() => {
          parent.attr('tabindex', '0');
        }, 0);
        // Handle pressing Enter on arrow icons and prevent pagerBar.click from being triggered
      } else if (key === 13) {
        const li = $(this).parent();
        e.preventDefault();

        if ($(this).attr('disabled')) {
          return false;
        }

        if (li.is('.pager-prev')) {
          self.setActivePage(self.activePage - 1, false, 'prev');
          return false;
        }

        if (li.is('.pager-next')) {
          self.setActivePage((self.activePage === -1 ? 0 : self.activePage) + 1, false, 'next');
          return false;
        }

        if (li.is('.pager-first')) {
          self.setActivePage(1, false, 'first');
          return false;
        }

        if (li.is('.pager-last')) {
          self.setActivePage(self.pageCount(), false, 'last'); // TODO Calculate Last Page?
          return false;
        }

        // Go to the page via the index of the button
        if (self.settings.type === 'list') {
          self.setActivePage($(this).parent().index(), false, 'page');
        }
      }

      btn = $('a', btn).length ? btn : $(':text', btn);
      if (btn.length && !btn.is('[disabled]')) {
        btn.focus();
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
   * Set or Get Current Page.
   * @param  {object} pagingInfo The paging info object
   * @param  {boolean} force Force the update
   * @param  {string} op The paging operation type.
   * @returns {void}
   */
  setActivePage(pagingInfo, force, op) {
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
        pageNum > this.pageCount() ||
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

  _pageCount: 0,

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
    if (!this.isTable && !this.isPageof) {
      let i;
      let thisClass;
      let thisText;
      let isAriaSelected;
      let isAriaDisabled;
      this.pagerBar.find(PAGER_NON_NUMBER_BUTTON_SELECTOR).remove();

      for (i = pages; i > 0; i--) {
        if (i === (this.activePage || 1)) {
          thisClass = 'class="selected"';
          thisText = Locale.translate('PageOn');
          isAriaSelected = 'aria-selected="true"';
          isAriaDisabled = 'aria-disabled="true"';
        } else {
          thisClass = '';
          thisText = Locale.translate('Page');
          isAriaSelected = '';
          isAriaDisabled = '';
        }

        $(`<li ${thisClass}${isAriaSelected}><a href="#" ${isAriaDisabled}><span class="audible">${thisText} </span>${i}</a></li>`).insertAfter(this.pagerBar.find('.pager-prev'));
      }
    }

    if (this.isTable && !this.settings.indeterminate && this.pagerBar.find('.pager-count').length === 0) {
      let text = Locale.translate('PageOf');
      text = text.replace('{0}', `<input name="pager-pageno" value="${this.activePage}">`);
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

      const menu = $('<ul class="popupmenu has-icons"></ul>');

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
      });
    }

    if (this.isPageof && !this.settings.indeterminate && this.pagerBar.find('.pager-count').length === 0) {
      let text = Locale.translate('PageOf');
      text = text.replace('{0}', `<input name="pager-pageno" value="${this.activePage}">`);
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

    const pattern = (`${this._pageCount}`).replace(/\d/g, '#');
    this.pagerBar.find('.pager-count input').attr('data-mask', '').mask({ pattern, mode: 'number', processOnInitialize: false });

    this._pageCount = this._pageCount || 1;

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
    if (!this.settings.source) {
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
    const disabledAttrs = { disabled: 'disabled', tabindex: -1 };

    // Reset all pager buttons' disabled/focusable states
    this.pagerBar[0].classList.remove('hidden');
    prevGroup.add(nextGroup).removeAttr('disabled tabindex');

    // Explicit false turns buttons back on.
    if (pagingInfo.firstPage === false) {
      prevGroup.removeAttr('disabled').removeAttr('tabindex');
    }
    if (pagingInfo.lastPage === false) {
      nextGroup.removeAttr('disabled').removeAttr('tabindex');
    }

    // First page
    if (pagingInfo.firstPage === true ||
      (pagingInfo.firstPage === undefined && this.activePage === 1)) {
      prevGroup.attr(disabledAttrs);

      if (pagingInfo.lastPage !== true) {
        nextGroup.attr({ tabIndex: 0 });
      }
    }

    // Last page
    if (pagingInfo.lastPage === true ||
      (pagingInfo.lastPage === undefined && this.activePage === this.pageCount())) {
      nextGroup.attr(disabledAttrs);

      if (pagingInfo.firstPage !== true) {
        prevGroup.attr({ tabindex: 0 });
      }
    }

    if (this.hidePagerBar(pagingInfo)) {
      this.pagerBar[0].classList.add('hidden');
    }

    // Remove from the front until selected is visible and we have at least howMany showing
    // rowTemplate
    if (!this.settings.source) {
      elems = pb.find(PAGER_NON_NUMBER_BUTTON_SELECTOR);
      elems.show();
      if (elems.length < howMany) {
        return;
      }

      elems.each(function () {
        const li = $(this);
        if (pb.find('.pager-next').offset().top - pb.offset().top > 1 && !li.is('.selected')) {
          $(this).hide();
        }
      });
    }
  },

  /**
   * Render a page of items.
   * @param  {object} op The paging operation.
   * @param  {function} callback The pager callback.
   */
  renderPages(op, callback) {
    let expr;
    const self = this;
    const request = {
      activePage: self.activePage,
      pagesize: self.settings.pagesize,
      type: op,
      total: self.settings.componentAPI ? self.settings.componentAPI.settings.dataset.length : -1
    };

    // Make an ajax call and wait
    setTimeout(() => {
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

          setTimeout(() => {
            self.element.trigger('afterpaging', pagingInfo);
          }, 1);
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

      // Make an ajax call and wait
      self.element.trigger('paging', request);
      const elements = self.getPageableElements();

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
      } else {
        elements.show();
      }

      if (!self.settings.source) {
        self.element.trigger('afterpaging', request);
      }
    }, 0);
  },

  /**
   * Update the component and optionally apply new settings.
   *
   * @param  {object} settings the settings to update to.
   * @returns {object} The plugin api for chaining.
   */
  updated(settings) {
    if (settings) {
      this.settings = utils.mergeSettings(this.element, settings, this.settings);
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
   * To reclaim the pager height so that datagrid can use it's full container
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
    $.removeData(this.element[0], COMPONENT_NAME);
  }
};

export { Pager, COMPONENT_NAME };
